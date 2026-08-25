import './App.css'

function App() {
  return (
    <div className="site">
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="container nav-container">
          <a href="#home" className="logo">
            <div className="logo-mark">SU</div>

            <div>
              <strong>St. Ursula</strong>
              <span>Food Pantry & Outreach</span>
            </div>
          </a>

          <nav>
            <a href="#about">About</a>
            <a href="#pantry">Food Pantry</a>
            <a href="#programs">Programs</a>
            <a href="#donate">Donate</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>

        {/* ================= HERO ================= */}
        <section id="home" className="hero">
          <div className="hero-image-placeholder">
            <div className="placeholder-content">
              <span>PHOTO PLACEHOLDER</span>
              <p>Community / Food Pantry Photo</p>
            </div>
          </div>

          <div className="hero-overlay" />

          <div className="container hero-content">
            <p className="eyebrow">Serving Pursglove & Monongalia County</p>

            <h1>
              Helping our community
              <span>put food on the table.</span>
            </h1>

            <p className="hero-text">
              St. Ursula Food Pantry & Outreach provides emergency food
              assistance and support to families and households in our
              community.
            </p>

            <div className="hero-buttons">
              <a href="#pantry" className="button primary">
                Get Food Assistance
              </a>

              <a href="#donate" className="button secondary">
                How You Can Help
              </a>
            </div>
          </div>
        </section>


        {/* ================= QUICK INFO ================= */}
        <section className="quick-info">
          <div className="container quick-info-grid">

            <div className="quick-item">
              <div className="quick-icon">📍</div>
              <div>
                <strong>Serving Our Community</strong>
                <span>Monongalia County & Star City</span>
              </div>
            </div>

            <div className="quick-item">
              <div className="quick-icon">🕐</div>
              <div>
                <strong>Food Pantry</strong>
                <span>First 3 Wednesdays • 1–4:30 PM</span>
              </div>
            </div>

            <div className="quick-item">
              <div className="quick-icon">❤️</div>
              <div>
                <strong>Need Help?</strong>
                <span>Emergency food orders available</span>
              </div>
            </div>

          </div>
        </section>


        {/* ================= ABOUT ================= */}
        <section id="about" className="section">
          <div className="container split-section">

            <div className="image-placeholder large">
              <div>
                <span>PHOTO PLACEHOLDER</span>
                <p>St. Ursula / Volunteers / Community</p>
              </div>
            </div>

            <div className="section-content">
              <p className="eyebrow">About St. Ursula</p>

              <h2>Neighbors helping neighbors.</h2>

              <p>
                St. Ursula Food Pantry serves households at or below the
                poverty level according to USDA means tests.
              </p>

              <p>
                Our geographical area is west of the Monongahela River
                in Monongalia County, plus the Town of Star City.
              </p>

              <p>
                We provide emergency food assistance while working with
                community partners to help address hunger in our area.
              </p>

              <a href="#pantry" className="text-link">
                Learn about food assistance →
              </a>
            </div>

          </div>
        </section>


        {/* ================= PHOTO / INFO CAROUSEL ================= */}
        <section className="carousel-section">
          <div className="container">

            <div className="carousel-heading">
              <div>
                <p className="eyebrow">Our Community</p>
                <h2>Making a difference together.</h2>
              </div>

              <p>
                PLACEHOLDER — photos, events, food drives,
                volunteers, and community activities can go here.
              </p>
            </div>

          </div>

          <div className="carousel-wrapper">
            <div className="carousel-track">

              <div className="carousel-card">
                <div className="carousel-image">
                  PHOTO
                </div>
                <strong>Community Food Drive</strong>
                <span>PLACEHOLDER INFORMATION</span>
              </div>

              <div className="carousel-card">
                <div className="carousel-image">
                  PHOTO
                </div>
                <strong>Volunteers</strong>
                <span>PLACEHOLDER INFORMATION</span>
              </div>

              <div className="carousel-card">
                <div className="carousel-image">
                  PHOTO
                </div>
                <strong>Helping Local Families</strong>
                <span>PLACEHOLDER INFORMATION</span>
              </div>

              <div className="carousel-card">
                <div className="carousel-image">
                  PHOTO
                </div>
                <strong>Community Events</strong>
                <span>PLACEHOLDER INFORMATION</span>
              </div>

              {/* Duplicate cards for seamless scrolling */}
              <div className="carousel-card">
                <div className="carousel-image">
                  PHOTO
                </div>
                <strong>Community Food Drive</strong>
                <span>PLACEHOLDER INFORMATION</span>
              </div>

              <div className="carousel-card">
                <div className="carousel-image">
                  PHOTO
                </div>
                <strong>Volunteers</strong>
                <span>PLACEHOLDER INFORMATION</span>
              </div>

              <div className="carousel-card">
                <div className="carousel-image">
                  PHOTO
                </div>
                <strong>Helping Local Families</strong>
                <span>PLACEHOLDER INFORMATION</span>
              </div>

            </div>
          </div>
        </section>


        {/* ================= FOOD PANTRY ================= */}
        <section id="pantry" className="section blue-section">
          <div className="container">

            <div className="center-heading">
              <p className="eyebrow light">Food Pantry</p>

              <h2>Food assistance when you need it.</h2>

              <p>
                Our food pantry provides emergency food assistance
                to eligible households in our service area.
              </p>
            </div>

            <div className="info-grid">

              <div className="info-card">
                <div className="card-number">01</div>
                <h3>Regular Pantry Hours</h3>

                <p>
                  The food pantry is open the first three Wednesdays
                  of each month by appointment.
                </p>

                <strong>1:00 PM – 4:30 PM</strong>
              </div>

              <div className="info-card">
                <div className="card-number">02</div>
                <h3>Emergency Food</h3>

                <p>
                  Emergency food orders are available at other times
                  when assistance is needed.
                </p>

                <a href="#contact">Contact us →</a>
              </div>

              <div className="info-card">
                <div className="card-number">03</div>
                <h3>Who We Serve</h3>

                <p>
                  Households at or below the poverty level according
                  to USDA means tests within our service area.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* ================= PROGRAMS ================= */}
        <section id="programs" className="section">
          <div className="container">

            <div className="center-heading">
              <p className="eyebrow">Programs</p>

              <h2>More ways we support families.</h2>

              <p>
                PLACEHOLDER — additional programs and services can
                be featured here.
              </p>
            </div>

            <div className="program-grid">

              <div className="program-card">
                <div className="program-image">
                  PHOTO
                </div>

                <div className="program-card-content">
                  <p className="eyebrow">Program</p>
                  <h3>Baby & Toddler Program</h3>

                  <p>
                    Our Baby and Toddler Program is available
                    Monday, Tuesday, and Thursday.
                  </p>

                  <strong>9:00 AM – 4:00 PM</strong>
                </div>
              </div>

              <div className="program-card">
                <div className="program-image">
                  PHOTO
                </div>

                <div className="program-card-content">
                  <p className="eyebrow">Community</p>
                  <h3>Food Drives</h3>

                  <p>
                    We participate in community food drives and
                    Empty Bowls Monongalia.
                  </p>
                </div>
              </div>

              <div className="program-card">
                <div className="program-image">
                  PHOTO
                </div>

                <div className="program-card-content">
                  <p className="eyebrow">Partnerships</p>
                  <h3>Community Partners</h3>

                  <p>
                    We work with organizations including the United
                    Way Family Resource Network and Mountaineer Food Bank.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ================= DONATE ================= */}
        <section id="donate" className="donate-section">
          <div className="container donate-content">

            <div>
              <p className="eyebrow light">Support St. Ursula</p>

              <h2>
                Help us keep food
                <span>on the table.</span>
              </h2>

              <p>
                We accept food and monetary donations from the
                general community.
              </p>
            </div>

            <div className="donate-buttons">
              <a href="#contact" className="button donate-button">
                Donate Food
              </a>

              <a href="#contact" className="button donate-button outline">
                Make a Donation
              </a>
            </div>

          </div>
        </section>


        {/* ================= CONTACT ================= */}
        <section id="contact" className="section contact-section">
          <div className="container contact-grid">

            <div>
              <p className="eyebrow">Contact</p>

              <h2>We're here to help.</h2>

              <p>
                Have questions about food assistance, donations,
                or volunteering? Get in touch with us.
              </p>

              <div className="contact-info">

                <div>
                  <strong>Address</strong>
                  <p>
                    St. Ursula Food Pantry & Outreach
                    <br />
                    PO Box 18
                    <br />
                    Pursglove, WV 26546
                  </p>
                </div>

                <div>
                  <strong>Phone</strong>
                  <p>
                    <a href="tel:3045993822">
                      304-599-3822
                    </a>
                  </p>
                </div>

                <div>
                  <strong>Email</strong>
                  <p>
                    <a href="mailto:stursulaoutreach@gmail.com">
                      stursulaoutreach@gmail.com
                    </a>
                  </p>
                </div>

              </div>
            </div>

            <div className="map-placeholder">
              <div>
                <span>MAP PLACEHOLDER</span>
                <p>Google Maps / Location Information</p>
              </div>
            </div>

          </div>
        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="container footer-content">

          <div>
            <div className="footer-logo">
              <div className="logo-mark">SU</div>

              <div>
                <strong>St. Ursula</strong>
                <span>Food Pantry & Outreach</span>
              </div>
            </div>

            <p>
              Serving our community in Pursglove and
              Monongalia County, West Virginia.
            </p>
          </div>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#pantry">Food Pantry</a>
            <a href="#donate">Donate</a>
            <a href="#contact">Contact</a>
          </div>

        </div>

        <div className="container copyright">
          © {new Date().getFullYear()} St. Ursula Food Pantry & Outreach
        </div>
      </footer>

    </div>
  )
}

export default App