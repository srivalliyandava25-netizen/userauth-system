# User Authentication System

A backend authentication API built using Node.js, Express.js, MongoDB, bcrypt, and JWT.

## Features
- User registration
- User login
- Password hashing using bcrypt
- Email and password validation
- Duplicate email checking
- JWT-based authentication
- Protected profile route

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- JSON Web Token (JWT)

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive a token |
| GET | `/profile` | Access the protected profile using a valid token |

## Setup

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file and configure your environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT=5000`
4. Start the server using `node app.js`.

**Note:** Never upload your `.env` file or expose your secret keys.

