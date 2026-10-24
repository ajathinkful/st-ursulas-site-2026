
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase.js'
import './EmployeeLogin.css'

export default function EmployeeResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()

      if (!active) return

      if (error || !data.session) {
        setError(
          'This reset link is invalid or expired. Please request a new one.'
        )
      } else {
        setReady(true)
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 8) {
      setError('Your password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(
          'Unable to update the password. The reset link may have expired. Please request a new one.'
        )
        return
      }

      await supabase.auth.signOut()
      setMessage('Password updated successfully. You can now sign in.')
      setPassword('')
      setConfirmPassword('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
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
        <h1>Reset Your Password</h1>
        <p className="employee-login-description">
          Choose a new password for the employee photo manager.
        </p>

        {!ready && !error && <p>Checking your reset link...</p>}

        {ready && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />

            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}

        {message && (
          <p role="status" style={{ color: '#18794e' }}>{message}</p>
        )}

        {message && (
          <button type="button" onClick={() => navigate('/employee')}>
            Return to Employee Sign In
          </button>
        )}

        <a className="employee-back-link" href="/">
          ← Back to the public website
        </a>
      </div>
    </main>
  )
}
