
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase.js'
import './EmployeeDashboard.css'

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return

      if (error || !data.session) {
        navigate('/employee', { replace: true })
      } else {
        setChecking(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate('/employee', { replace: true })
        }
      }
    )

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [navigate])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/employee', { replace: true })
  }

  if (checking) {
    return (
      <main className="employee-dashboard-page">
        Checking sign-in…
      </main>
    )
  }

  return (
    <main className="employee-dashboard-page">
      <header className="employee-dashboard-header">
        <img src="/st-ursula-logo.png" alt="" />

        <div>
          <p className="employee-dashboard-eyebrow">
            STAFF ACCESS
          </p>
          <h1>Website Management</h1>
          <p>Manage the St. Ursula website.</p>
        </div>

        <button onClick={handleSignOut}>
          Sign Out
        </button>
      </header>

      <section className="employee-dashboard-content">
        <h2>Welcome to the Staff Portal</h2>
        <p>What would you like to manage today?</p>

        <div className="employee-dashboard-grid">
          <button
            className="employee-dashboard-card"
            onClick={() => navigate('/employee/photos')}
          >
            <span className="dashboard-card-icon">📷</span>
            <h3>Website Photos</h3>
            <p>
              Manage facility, program, and staff photos.
            </p>
            <span className="dashboard-card-link">
              Open Photo Manager →
            </span>
          </button>

          <button
            className="employee-dashboard-card"
            onClick={() => navigate('/employee/announcements')}
          >
            <span className="dashboard-card-icon">📢</span>
            <h3>Announcements</h3>
            <p>
              Create and manage updates displayed on the homepage.
            </p>
            <span className="dashboard-card-link">
              Open Announcement Manager →
            </span>
          </button>
        </div>

        <a className="employee-dashboard-back" href="/">
          ← Back to public website
        </a>
      </section>
    </main>
  )
}
