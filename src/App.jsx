import './App.css'
import { useEffect, useState } from 'react'


function ProgramSlideshow({ slides, label }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(null)

  const currentSlide = slides[activeIndex]

  function pauseAndShow(index) {
    setIsPlaying(false)
    setActiveIndex(index)
  }

  function showPrevious() {
    setIsPlaying(false)
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length)
  }

  function showNext() {
    setIsPlaying(false)
    setActiveIndex((index) => (index + 1) % slides.length)
  }

  function handleTouchStart(event) {
    setTouchStart(event.touches[0].clientX)
  }

  function handleTouchEnd(event) {
    if (touchStart === null) return

    const touchEnd = event.changedTouches[0].clientX
    const distance = touchStart - touchEnd

    if (Math.abs(distance) > 40) {
      setIsPlaying(false)

      if (distance > 0) {
        setActiveIndex((index) => (index + 1) % slides.length)
      } else {
        setActiveIndex((index) => (index - 1 + slides.length) % slides.length)
      }
    }

    setTouchStart(null)
  }

  useEffect(() => {
    if (!isPlaying || slides.length < 2) return

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isPlaying, slides.length])

  return (
    <div className="program-slideshow" aria-label={`${label} photo slideshow`}>
      <div
        className="slideshow-image"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentSlide.src ? (
          <img src={currentSlide.src} alt={currentSlide.alt} />
        ) : (
          <div className="slideshow-placeholder">
            <span>PHOTO</span>
            <p>{currentSlide.alt}</p>
          </div>
        )}
      </div>

      <div className="slideshow-controls">
        <div className="slideshow-dots" aria-label="Choose a photo">
          {slides.map((slide, index) => (
            <button
              key={slide.alt}
              type="button"
              className={`slideshow-dot ${index === activeIndex ? 'active' : ''}`}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={() => pauseAndShow(index)}
            />
          ))}
        </div>

        <div className="slideshow-buttons">
          <button type="button" onClick={showPrevious} aria-label="Previous photo">
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? 'Ⅱ' : '▷'}
          </button>
          <button type="button" onClick={showNext} aria-label="Next photo">
            ›
          </button>
        </div>
      </div>
    </div>
  )
}


const foodPantryPhotos = [
  { src: '', alt: 'Food Pantry' },
  { src: '', alt: 'Food Distribution' },
  { src: '', alt: 'Community Volunteers' },
]

const babyProgramPhotos = [
  { src: '', alt: 'Baby Supplies' },
  { src: '', alt: 'Toddler Supplies' },
  { src: '', alt: 'Program Activities' },
]



function App() {
  const [enlargedQr, setEnlargedQr] = useState(null);

  useEffect(() => {
    if (!enlargedQr) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setEnlargedQr(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [enlargedQr]);

  return (
    <div className="site">
      {/* Header: identity and most important contact actions */}
      <header className="header">
        <div className="container header-content">

          <div className="brand">
            <a href="/" className="site-logo-link" aria-label="St. Ursula home">
              <img
                src="/st-ursula-logo.png"
                alt=""
                className="site-logo"
              />
            </a>

            <div className="brand-text">
              <p className="eyebrow">Pursglove, West Virginia</p>
              <h1 className="site-name">St. Ursula Food Pantry &amp; Outreach</h1>
              <p className="site-subtitle">St. Mary Roman Catholic Church</p>
            </div>
          </div>



          <div className="header-actions">
            <div className="donate-group">
              <a href="#donate" className="contact-button donate-button">
                Donate
              </a>

              <div className="payment-methods" aria-label="Payment methods">
                <span className="venmo-label">Venmo</span>
                <span className="paypal-label">PayPal</span>
              </div>
            </div>

            <a href="#contact" className="contact-button email-button">
              Contact Us
            </a>
          </div>

        </div>
      </header>

      {/* Facility photo banner */}
      <section className="facility-banner" aria-label="Facility photo">
        <div className="facility-photo-placeholder">
          <div>
            <span>FACILITY PHOTO</span>
            <p>Photo of St. Ursula Food Pantry</p>
          </div>
        </div>
      </section>

      <main>
        {/* Programs appear immediately after the banner */}
        <section className="programs-wrapper" aria-label="Programs">
          <div className="container">
            <div className="programs-grid">
              <section className="program-section food-pantry-section" aria-labelledby="food-pantry-title">
                <h2 id="food-pantry-title">Food Pantry</h2>
                <div className="program-description">
                  <p>
                    St. Ursula Food Pantry serves households at or below the poverty
                    level according to USDA means tests.
                  </p>
                  <div className="hours">
                    <strong>First 3 Wednesdays of each month</strong>
                    <span>1:00 PM–4:30 PM · By appointment</span>
                    <span>Phone: <a href="tel:3045993822">304-599-3822</a></span>
                  </div>
                  <p>Emergency food orders are available for eligible first-time families and individuals.</p>
                  <p>
                    Proof of Monongalia County residency (such as a piece of mail
                    showing your current address) and household income are required for
                    food assistance. Please bring a piece of regular mail, not junk mail,
                    as proof of residency.
                  </p>
                </div>

                <ProgramSlideshow
                  slides={foodPantryPhotos}
                  label="Food Pantry"
                />
              </section>

              <section className="program-section baby-program-section" aria-labelledby="baby-program-title">
                <h2 id="baby-program-title">Baby &amp; Toddler Program</h2>
                <div className="program-description">
                  <p>Our Baby &amp; Toddler Program operates on the following days:</p>
                  <div className="hours">
                    <strong>Monday, Tuesday, and Thursday</strong>
                    <span>9:00 AM–4:00 PM</span>
                  </div>
                </div>

                <ProgramSlideshow
                  slides={babyProgramPhotos}
                  label="Baby and Toddler Program"
                />
              </section>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="section light-section">

          <div className="container">
            <div className="location-layout">
              <div className="location-info">
                <p className="eyebrow">Location</p>
                <h2>Where We Are</h2>

                <p>
                  St. Ursula Food Pantry &amp; Outreach<br />
                  St. Ursula, Rt. 19 &amp; 7
                </p>

                <p>Pursglove, WV 26546</p>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=87+Pursglove+Rd%2C+Pursglove%2C+WV+26546"
                  target="_blank"
                  rel="noreferrer"
                  className="directions-link"
                >
                  Get Directions →
                </a>
              </div>

              <div className="location-map">
                <iframe
                  title="Map to St. Ursula Food Pantry & Outreach"
                  src="https://maps.google.com/maps?q=87%20Pursglove%20Rd%2C%20Pursglove%2C%20WV%2026546&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

        </section>

        {/* Contact */}
        <section className="contact-section" id="contact">
          <div className="container contact-content">
            <div>
              <p className="eyebrow">Need Help?</p>
              <h2>Contact St. Ursula</h2>
              <p>If you have questions about food assistance, emergency food orders, or our programs, please contact us.</p>
            </div>
            <div className="contact-details">
              <div><span>Phone</span><a href="tel:3045993822">304-599-3822</a></div>
              <div><span>Email</span><a href="mailto:stursulaoutreach@gmail.com">stursulaoutreach@gmail.com</a></div>
              <a href="mailto:stursulaoutreach@gmail.com" className="contact-button large">Email Us</a>
            </div>
          </div>
        </section>

        {/* Donations */}
        <section className="section" id="donate">
          <div className="container narrow">
            <p className="eyebrow">Community Support</p>
            <h2>Help support our food pantry</h2>
            <p>We accept food and monetary donations from the general community.</p>
            <p>We are active participants in community food drives and Empty Bowls Monongalia.</p>

            <div className="donation-options">
              <div className="donation-option">
                <h3>Venmo</h3>
                <button
                  type="button"
                  className="donation-qr-button"
                  aria-label="Enlarge Venmo QR code"
                  onClick={() =>
                    setEnlargedQr({
                      src: "/venmostursula.png",
                      alt: "Venmo QR code for St. Ursula Food Pantry",
                      title: "Donate with Venmo",
                    })
                  }
                >
                  <img
                    src="/venmostursula.png"
                    alt="Venmo QR code for St. Ursula Food Pantry"
                    className="donation-qr"
                  />
                </button>
                <p className="donation-hint">Tap or click to enlarge</p>
                <a
                  href="https://account.venmo.com/u/StursulaPantry90"
                  className="donation-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Donate with Venmo
                </a>
              </div>

              <div className="donation-option">
                <h3>PayPal</h3>
                <button
                  type="button"
                  className="donation-qr-button"
                  aria-label="Enlarge PayPal QR code"
                  onClick={() =>
                    setEnlargedQr({
                      src: "/paypalstursula.png",
                      alt: "PayPal QR code for St. Ursula Food Pantry",
                      title: "Donate with PayPal",
                    })
                  }
                >
                  <img
                    src="/paypalstursula.png"
                    alt="PayPal QR code for St. Ursula Food Pantry"
                    className="donation-qr"
                  />
                </button>
                <p className="donation-hint">Tap or click to enlarge</p>
                <a
                  href="https://www.paypal.com/qrcodes/managed/7263b690-6b6d-4220-bf2c-1de1e73de762?utm_source=bizapp_download"
                  className="donation-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Donate with PayPal
                </a>
              </div>
            </div>

            {enlargedQr && (
              <div
                className="qr-overlay"
                role="dialog"
                aria-modal="true"
                aria-label={enlargedQr.title}
                onClick={() => setEnlargedQr(null)}
              >
                <div
                  className="qr-modal"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="qr-close"
                    onClick={() => setEnlargedQr(null)}
                    aria-label="Close enlarged QR code"
                  >
                    &times;
                  </button>

                  <h3>{enlargedQr.title}</h3>

                  <img
                    src={enlargedQr.src}
                    alt={enlargedQr.alt}
                    className="qr-modal-image"
                  />

                  <p>Scan this code with your phone to donate.</p>
                </div>
              </div>
            )}


          </div>
        </section>


        {/* Community Partners */}
        <section className="section light-section">
          <div className="container narrow">
            <p className="eyebrow">Community Partners</p>
            <h2>Working together to fight hunger</h2>

            <p>
              St. Ursula Food Pantry is a member of the United Way Family Resource Network Food and Hunger Committee and Mountaineer Food Bank. We also participate in the annual Postal Food Drive and Empty Bowls Monongalia. Many local churches and community agencies support St. Ursula in its mission to help those facing food insecurity.
            </p>

            <div className="partner-logos" aria-label="Community partner logos">
              <img
                src="/Mountaineer-Foodbank-logo-bg-2026.png"
                alt="Mountaineer Food Bank"
              />
            </div>
          </div>
        </section>



        {/* Additional Information */}
        <section className="section">
          <div className="container narrow">
            <h2>Additional Information</h2>

            <div className="church-link">
              <p>
                St. Ursula is a ministry of St. Mary Roman Catholic Church.
              </p>
              <a
                href="https://www.stmarystarcity.com/"
                target="_blank"
                rel="noreferrer"
              >
                Visit St. Mary Roman Catholic Church →
              </a>
            </div>

            <p className="additional-note">
              We do not refer or advocate for abortion or affiliate with
              organizations who do.
            </p>
          </div>
        </section>


        {/* About us */}
        <section className="about-section">
          <div className="container about-grid">
            <div className="sister-photo-placeholder">
              <div><span>PHOTO PLACEHOLDER</span><p>Sister Rachel</p></div>
            </div>
            <div className="about-content">
              <p className="eyebrow">About Us</p>
              <h2>Serving our community</h2>
              <p>PLACEHOLDER — information about Sister Rachel and her work with St. Ursula Food Pantry &amp; Outreach can go here.</p>
              <p>PLACEHOLDER — a short biography, history of the pantry, or information about the organization's mission can go here.</p>
            </div>
          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <strong>St. Ursula Food Pantry &amp; Outreach</strong>
          <p>87 Pursglove Rd<br />PO Box 18<br />Pursglove, WV 26546</p>
          <p>Phone: <a href="tel:3045993822">304-599-3822</a></p>
          <p>Email: <a href="mailto:stursulaoutreach@gmail.com">stursulaoutreach@gmail.com</a></p>
          <p className="copyright">© {new Date().getFullYear()} St. Ursula Food Pantry &amp; Outreach</p>
        </div>
      </footer>
    </div>
  )
}

export default App
