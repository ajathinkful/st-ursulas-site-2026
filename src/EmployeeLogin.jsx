
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase.js'
import './EmployeeLogin.css'

export default function EmployeeLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (username.trim().toLowerCase() !== 'ursula') {
      setError('Incorrect username or password.')
      return
    }

    const email = import.meta.env.VITE_EMPLOYEE_EMAIL

    if (!email) {
      setError('Staff sign-in is not configured yet.')
      return
    }

    setIsLoading(true)

    try {
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) {
        setError('Incorrect username or password.')
        return
      }

      navigate('/employee/photos')
    } catch {
      setError('Unable to sign in right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleForgotPassword() {
    setError('')
    setNotice('')

    const email = import.meta.env.VITE_EMPLOYEE_EMAIL

    if (!email) {
      setError('Staff sign-in is not configured yet.')
      return
    }

    setIsSendingReset(true)

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/employee/reset-password`,
        })

if (resetError) {
  console.error('Password reset error:', resetError)
  setError(resetError.message)
  return
}

      setNotice(
        'If the staff account exists, a password-reset email will be sent. Check your inbox and spam folder.'
      )
    } catch {
      setError('Unable to send the reset email. Please try again.')
    } finally {
      setIsSendingReset(false)
    }
  }

  return (
    <main className="employee-login-page">
      <div className="employee-login-card">
        <img
          src="/st-ursula-logo.png"
          alt="St. Ursula Food Pantry & Outreach"
          className="employee-login-logo"
        />

        <p className="employee-login-eyebrow">STAFF ACCESS</p>
        <h1>Employee Sign In</h1>
        <p className="employee-login-description">
          Sign in to manage the photos on the St. Ursula website.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="employee-username">Username</label>
          <input
            id="employee-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="employee-password">Password</label>
          <input
            id="employee-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p role="alert" style={{ color: '#b42318' }}>
              {error}
            </p>
          )}

          {notice && (
            <p role="status" style={{ color: '#18794e' }}>
              {notice}
            </p>
          )}

          <button type="submit" disabled={isLoading || isSendingReset}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isSendingReset || isLoading}
          style={{
            marginTop: '12px',
            background: 'transparent',
            color: '#245b47',
            textDecoration: 'underline',
          }}
        >
          {isSendingReset ? 'Sending email...' : 'Forgot password?'}
        </button>

        <a className="employee-back-link" href="/">
          ← Back to the public website
        </a>
      </div>
    </main>
  )
}
