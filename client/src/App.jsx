
import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('token'))
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const endpoint =
      page === 'register'
        ? 'http://localhost:5000/register'
        : 'http://localhost:5000/login'

    const body =
      page === 'register'
        ? { name, email, password }
        : { email, password }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setMessage(data.message || 'Success!')

      if (page === 'login' && data.token) {
        localStorage.setItem('token', data.token)
        setIsLoggedIn(true)
        setProfile(null)
      }

      if (page === 'register') {
        setName('')
      }

      setEmail('')
      setPassword('')
    } catch (error) {
      setMessage(
        error.message || 'Unable to connect to the server'
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      setMessage('')

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Please login first')
      }

      const response = await fetch(
        'http://localhost:5000/profile',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile')
      }

      setProfile(data.user)
      setMessage(data.message || 'Profile loaded successfully')
    } catch (error) {
      setMessage(error.message || 'Unable to fetch profile')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setProfile(null)
    setPage('login')
    setName('')
    setEmail('')
    setPassword('')
    setMessage('Logged out successfully')
  }

  const changePage = (selectedPage) => {
    setPage(selectedPage)
    setMessage('')
    setProfile(null)
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="app">
      <div className="auth-card">
        <h1>
          {isLoggedIn
            ? 'Welcome!'
            : page === 'login'
              ? 'Welcome Back!'
              : 'Create Account'}
        </h1>

        <p className="subtitle">
          {isLoggedIn
            ? 'You are logged in'
            : page === 'login'
              ? 'Login to your account'
              : 'Join us and create your account'}
        </p>

        {isLoggedIn ? (
          <>
            <div className="tabs">
              <button
                type="button"
                className="active"
                onClick={fetchProfile}
              >
                View Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

            {profile && (
              <div className="profile-details">
                <h2>My Profile</h2>

                <p>
                  <strong>Name:</strong> {profile.name}
                </p>

                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="tabs">
              <button
                type="button"
                className={page === 'login' ? 'active' : ''}
                onClick={() => changePage('login')}
              >
                Login
              </button>

              <button
                type="button"
                className={page === 'register' ? 'active' : ''}
                onClick={() => changePage('register')}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {page === 'register' && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="submit-btn"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : page === 'login'
                    ? 'Login'
                    : 'Create Account'}
              </button>
            </form>
          </>
        )}

        {message && (
          <p className="message" role="status">
            {message}
          </p>
        )}

        <p className="footer-text">
          Secure Authentication · Built with React
        </p>
      </div>
    </div>
  )
}

export default App
