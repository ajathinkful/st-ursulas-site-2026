
import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import './AnnouncementCarousel.css'

export default function AnnouncementCarousel() {
  const [announcements, setAnnouncements] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchAnnouncements() {
      setError('')

      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          message,
          image_path,
          link_url,
          link_text,
          is_published,
          is_pinned,
          sort_order,
          published_at,
          expires_at
        `)
        .eq('is_published', true)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order('is_pinned', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('published_at', { ascending: false })

      if (!active) return

      if (error) {
        console.error('Announcement loading error:', error)
        setError('Announcements are temporarily unavailable.')
        setIsLoading(false)
        return
      }

      setAnnouncements(data || [])
      setActiveIndex(0)
      setIsLoading(false)
    }

    fetchAnnouncements()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (isPaused || announcements.length < 2) return

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % announcements.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [isPaused, announcements.length])

  function showPrevious() {
    setActiveIndex(
      (index) => (index - 1 + announcements.length) % announcements.length
    )
  }

  function showNext() {
    setActiveIndex(
      (index) => (index + 1) % announcements.length
    )
  }

  if (isLoading || (!error && announcements.length === 0)) {
    return null
  }

  if (error) {
    return null
  }

  const current = announcements[activeIndex]

  const imageUrl = current.image_path
    ? current.image_path.startsWith('http')
      ? current.image_path
      : supabase.storage
          .from('site-announcements')
          .getPublicUrl(current.image_path).data.publicUrl
    : null

  return (
    <section
      className="announcement-carousel-section"
      aria-label="Website announcements"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false)
        }
      }}
    >
      <div className="container">
        <div className="announcement-carousel">

          <div className="announcement-label">
        
            <span>Announcements</span>
          </div>

          <div className="announcement-slide" key={current.id}>

            {imageUrl && (
              <div className="announcement-image">
                <img
                  src={imageUrl}
                  alt=""
                />
              </div>
            )}

            <div className="announcement-content">
              <h2>{current.title}</h2>

              <p>{current.message}</p>

              {current.link_url && (
                <a
                  href={current.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="announcement-link"
                >
                  {current.link_text || 'Learn More'} →
                </a>
              )}
            </div>

          </div>

          {announcements.length > 1 && (
            <div className="announcement-controls">

              <div className="announcement-dots">
                {announcements.map((announcement, index) => (
                  <button
                    key={announcement.id}
                    type="button"
                    className={
                      index === activeIndex
                        ? 'announcement-dot active'
                        : 'announcement-dot'
                    }
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show announcement ${index + 1}`}
                    aria-pressed={index === activeIndex}
                  />
                ))}
              </div>

              <div className="announcement-buttons">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous announcement"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={() => setIsPaused((paused) => !paused)}
                  aria-label={
                    isPaused
                      ? 'Resume announcement rotation'
                      : 'Pause announcement rotation'
                  }
                >
                  {isPaused ? '▷' : 'Ⅱ'}
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next announcement"
                >
                  ›
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  )
}
