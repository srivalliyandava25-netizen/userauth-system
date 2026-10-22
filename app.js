const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully!');

        app.listen(process.env.PORT || 5000, () => {
            console.log('Server running on port 5000');
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
    });

app.get('/', (req, res) => {
    res.send('User Authentication System');
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email received:', JSON.stringify(email));

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        if (password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) 
        ) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
            })
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address'
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            message: 'Registration failed'
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            message: 'Login failed'
        });
    }
});

app.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Profile accessed successfully',
            user
        });

    } catch (error) {
        console.error('Profile error:', error);

        return res.status(500).json({
            message: 'Failed to access profile'
        });
    }
});
