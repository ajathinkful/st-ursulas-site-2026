import './App.css'
import { useEffect, useState } from 'react'


function ProgramSlideshow({ slides, label }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentSlide = slides[activeIndex]

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length)
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % slides.length)
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
      <div className="slideshow-image">
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
              onClick={() => setActiveIndex(index)}
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
  return (
    <div className="site">
      {/* Header: identity and most important contact actions */}
      <header className="header">
        <div className="container header-content">
          <div className="brand">
            <p className="eyebrow">Morgantown, West Virginia</p>
            <h1 className="site-name">St. Ursula Food Pantry &amp; Outreach</h1>
            <p className="site-subtitle">St. Mary Roman Catholic Church</p>
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
                    Proof of Monongalia County residency (such as a document showing your address)
                    and household income are required for food assistance.
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
            <p className="eyebrow">Location</p>
            <h2>Where We Are</h2>
            <p>St. Ursula Food Pantry &amp; Outreach<br />St. Ursula, Rt. 19 &amp; 7</p>
            <p>Pursglove, WV 26546</p>
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
            {/* Venmo and PayPal QR codes can be added here later. */}
          </div>
        </section>


        {/* Community Partners */}
        <section className="section light-section">
          <div className="container narrow">
            <p className="eyebrow">Community Partners</p>
            <h2>Working together to fight hunger</h2>

            <p>
              St. Ursula Food Pantry is a member of the United Way Family
              Resource Network Food and Hunger Committee and the Mountaineer
              Food Bank. We also participate in community food drives and
              Empty Bowls Monongalia.
            </p>

            <div className="partner-logos" aria-label="Community partner logos">
              <img
                src="/images.png"
                alt="United Way"
              />
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
                St. Ursula is part of the St. Mary Roman Catholic Church community.
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
