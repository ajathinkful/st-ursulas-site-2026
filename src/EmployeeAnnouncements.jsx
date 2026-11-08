
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase.js'
import './EmployeeAnnouncements.css'

const BUCKET = 'site-announcements'
const MAX_FILE_SIZE = 5 * 1024 * 1024

const emptyForm = {
  title: '',
  message: '',
  link_url: '',
  link_text: 'Learn More',
  expires_at: '',
  is_published: false,
  is_pinned: false,
}

function getImageUrl(path) {
  if (!path) return ''
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

function formatDate(date) {
  if (!date) return 'No expiration'
  return new Date(date).toLocaleDateString()
}

export default function EmployeeAnnouncements() {
  const navigate = useNavigate()

  const [checking, setChecking] = useState(true)
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('')
      return
    }

    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)

    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  useEffect(() => {
    if (!checking) loadAnnouncements()
  }, [checking])

  async function loadAnnouncements() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Announcement loading error:', error)
      setError(`Unable to load announcements: ${error.message}`)
    } else {
      setAnnouncements(data || [])
    }

    setLoading(false)
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please choose a JPG, PNG, or WebP image.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Please choose an image smaller than 5 MB.')
      return
    }

    setError('')
    setImageFile(file)
    setRemoveImage(false)
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setImageFile(null)
    setRemoveImage(false)
    setMessage('')
    setError('')
  }

  function startEditing(announcement) {
    setEditingId(announcement.id)

    setForm({
      title: announcement.title,
      message: announcement.message,
      link_url: announcement.link_url || '',
      link_text: announcement.link_text || 'Learn More',
      expires_at: announcement.expires_at
        ? new Date(
            new Date(announcement.expires_at).getTime() -
            new Date(announcement.expires_at).getTimezoneOffset() * 60000
          ).toISOString().slice(0, 16)
        : '',
      is_published: announcement.is_published,
      is_pinned: announcement.is_pinned,
    })

    setImageFile(null)
    setRemoveImage(false)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    let newImagePath = null
    let oldImagePath = null

    try {
      const existing = announcements.find(
        (item) => item.id === editingId
      )

      oldImagePath = existing?.image_path || null

      if (form.link_url.trim()) {
        try {
          const url = new URL(form.link_url.trim())
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error()
          }
        } catch {
          throw new Error('Please enter a valid link beginning with https:// or http://.')
        }
      }

      const publishedAt = form.is_published
        ? existing?.published_at || new Date().toISOString()
        : null

      const expiresAt = form.expires_at
        ? new Date(form.expires_at).toISOString()
        : null

      if (
        expiresAt &&
        publishedAt &&
        new Date(expiresAt) <= new Date(publishedAt)
      ) {
        throw new Error('The expiration date must be after the publication date.')
      }

      if (imageFile) {
        const extension = imageFile.type === 'image/png'
          ? 'png'
          : imageFile.type === 'image/webp'
            ? 'webp'
            : 'jpg'

        newImagePath = `${crypto.randomUUID()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(newImagePath, imageFile, {
            contentType: imageFile.type,
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError
      }

      const payload = {
        title: form.title.trim(),
        message: form.message.trim(),
        link_url: form.link_url.trim() || null,
        link_text: form.link_url.trim()
          ? (form.link_text.trim() || 'Learn More')
          : null,
        image_path: newImagePath ||
          (removeImage ? null : oldImagePath),
        is_published: form.is_published,
        is_pinned: form.is_pinned,
        published_at: publishedAt,
        expires_at: expiresAt,
      }

      let result

      if (editingId) {
        result = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single()
      } else {
        result = await supabase
          .from('announcements')
          .insert(payload)
          .select()
          .single()
      }

      if (result.error) throw result.error

      if (
        oldImagePath &&
        (newImagePath || removeImage)
      ) {
        const { error: removeError } = await supabase.storage
          .from(BUCKET)
          .remove([oldImagePath])

        if (removeError) {
          console.error('Old image cleanup error:', removeError)
        }
      }

      setMessage(
        editingId
          ? 'Announcement updated successfully.'
          : 'Announcement created successfully.'
      )

      resetForm()
      await loadAnnouncements()
    } catch (error) {
      console.error('Announcement save error:', error)

      if (newImagePath) {
        await supabase.storage.from(BUCKET).remove([newImagePath])
      }

      setError(error.message || 'Unable to save the announcement.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(announcement) {
    const confirmed = window.confirm(
      `Delete "${announcement.title}"? This cannot be undone.`
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    const { error: deleteError } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcement.id)

    if (deleteError) {
      setError(`Unable to delete announcement: ${deleteError.message}`)
      return
    }

    if (announcement.image_path) {
      const { error: imageError } = await supabase.storage
        .from(BUCKET)
        .remove([announcement.image_path])

      if (imageError) {
        console.error('Image cleanup error:', imageError)
      }
    }

    if (editingId === announcement.id) resetForm()

    setMessage('Announcement deleted successfully.')
    await loadAnnouncements()
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/employee', { replace: true })
  }

  if (checking) {
    return (
      <main className="employee-announcements-page">
        Checking sign-in…
      </main>
    )
  }

  return (
    <main className="employee-announcements-page">
      <header className="employee-announcements-header">
        <img src="/st-ursula-logo.png" alt="" />

        <div>
          <p className="employee-announcements-eyebrow">STAFF ACCESS</p>
          <h1>Announcement Manager</h1>
          <p>Manage updates displayed on the St. Ursula homepage.</p>
        </div>

        <button onClick={handleSignOut}>Sign Out</button>
      </header>

      <section className="employee-announcements-content">
        <button
          className="employee-announcements-back"
          onClick={() => navigate('/employee/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <h2>Website Announcements</h2>
        <p>Create and manage announcements for website visitors.</p>

        {message && <p className="announcement-success" role="status">{message}</p>}
        {error && <p className="announcement-error" role="alert">{error}</p>}

        <section className="announcement-form-card">
          <div className="announcement-section-heading">
            <div>
              <h3>{editingId ? 'Edit Announcement' : 'Create Announcement'}</h3>
              <p>Share news, schedule changes, and important updates.</p>
            </div>

            {editingId && (
              <button type="button" className="announcement-cancel"
                onClick={resetForm}>
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSave}>
            <label htmlFor="announcement-title">Title</label>
            <input
              id="announcement-title"
              name="title"
              value={form.title}
              onChange={updateField}
              maxLength={120}
              placeholder="Enter an announcement title"
              required
            />
            <small>{form.title.length}/120 characters</small>

            <label htmlFor="announcement-message">Message</label>
            <textarea
              id="announcement-message"
              name="message"
              value={form.message}
              onChange={updateField}
              maxLength={1500}
              rows={5}
              placeholder="Write your announcement..."
              required
            />
            <small>{form.message.length}/1500 characters</small>

            <div className="announcement-form-row">
              <div>
                <label htmlFor="announcement-link">Optional link URL</label>
                <input
                  id="announcement-link"
                  name="link_url"
                  type="url"
                  value={form.link_url}
                  onChange={updateField}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="announcement-link-text">Link text</label>
                <input
                  id="announcement-link-text"
                  name="link_text"
                  value={form.link_text}
                  onChange={updateField}
                  maxLength={40}
                  placeholder="Learn More"
                  disabled={!form.link_url.trim()}
                />
              </div>
            </div>

            <div className="announcement-image-field">
              <label htmlFor="announcement-image">
                Optional announcement image
              </label>

              {(imagePreview || (
                editingId &&
                announcements.find((item) => item.id === editingId)?.image_path &&
                !removeImage
              )) && (
                <div className="announcement-image-preview">
                  <img
                    src={
                      imagePreview ||
                      getImageUrl(
                        announcements.find((item) => item.id === editingId)?.image_path
                      )
                    }
                    alt="Announcement preview"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setRemoveImage(true)
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <input
                id="announcement-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
              <small>JPG, PNG, or WebP. Maximum file size: 5 MB.</small>
            </div>

            <label htmlFor="announcement-expiration">Expiration date (optional)</label>
            <input
              id="announcement-expiration"
              type="datetime-local"
              name="expires_at"
              value={form.expires_at}
              onChange={updateField}
            />

            <div className="announcement-options">
              <label className="announcement-checkbox">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={updateField}
                />
                Publish announcement
              </label>

              <label className="announcement-checkbox">
                <input
                  type="checkbox"
                  name="is_pinned"
                  checked={form.is_pinned}
                  onChange={updateField}
                />
                Pin announcement
              </label>
            </div>

            <button
              type="submit"
              className="announcement-save-button"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Save Changes'
                  : 'Save Announcement'}
            </button>
          </form>
        </section>

        <section className="announcement-list-section">
          <div className="announcement-section-heading">
            <div>
              <h3>Existing Announcements</h3>
              <p>{announcements.length} total announcements</p>
            </div>

            <button
              type="button"
              className="announcement-refresh"
              onClick={loadAnnouncements}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <div className="announcement-empty">
              <span>📢</span>
              <h4>No announcements yet</h4>
              <p>Create your first announcement using the form above.</p>
            </div>
          ) : (
            <div className="announcement-list">
              {announcements.map((announcement) => (
                <article className="announcement-item" key={announcement.id}>
                  {announcement.image_path && (
                    <img
                      className="announcement-item-image"
                      src={getImageUrl(announcement.image_path)}
                      alt=""
                    />
                  )}

                  <div className="announcement-item-content">
                    <div className="announcement-item-heading">
                      <h4>{announcement.title}</h4>

                      <div className="announcement-statuses">
                        <span className={
                          announcement.is_published
                            ? 'announcement-status published'
                            : 'announcement-status draft'
                        }>
                          {announcement.is_published ? 'Published' : 'Draft'}
                        </span>

                        {announcement.is_pinned && (
                          <span className="announcement-status pinned">
                            Pinned
                          </span>
                        )}
                      </div>
                    </div>

                    <p>{announcement.message}</p>

                    {announcement.link_url && (
                      <a href={announcement.link_url}
                        target="_blank" rel="noopener noreferrer">
                        {announcement.link_text || 'Learn More'} ↗
                      </a>
                    )}

                    <small>
                      Created {formatDate(announcement.created_at)}
                      {' · '}
                      {announcement.expires_at
                        ? `Expires ${formatDate(announcement.expires_at)}`
                        : 'No expiration'}
                    </small>

                    <div className="announcement-item-actions">
                      <button onClick={() => startEditing(announcement)}>
                        Edit
                      </button>
                      <button
                        className="announcement-delete-button"
                        onClick={() => handleDelete(announcement)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
