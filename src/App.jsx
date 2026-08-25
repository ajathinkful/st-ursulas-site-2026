import './App.css'

function App() {
  return (
    <div className="site">

      <header className="header">
        <div className="container header-content">
          <div>
            <p className="site-name">St. Ursula</p>
            <p className="site-subtitle">Food Pantry & Outreach</p>
          </div>

          <a
            href="mailto:stursulaoutreach@gmail.com"
            className="contact-button"
          >
            Email Us
          </a>
        </div>
      </header>

      <main>

        {/* Main information */}
        <section className="hero">
          <div className="container">

            <p className="eyebrow">Pursglove, West Virginia</p>

            <h1>St. Ursula Food Pantry & Outreach</h1>

            <p className="intro">
              St. Mary Roman Catholic Church
            </p>

            <div className="important-notice">
              <h2>Food Pantry</h2>

              <p>
                St. Ursula Food Pantry serves households at or below
                the poverty level according to USDA means tests.
              </p>

              <div className="hours">
                <strong>First 3 Wednesdays of each month</strong>
                <span>1:00 PM – 4:30 PM • By appointment</span>
              </div>

              <p>
                Emergency food orders are available at other times.
              </p>
            </div>

            

          </div>
        </section>


        {/* Quick information */}
        <section className="quick-section">
          <div className="container">

            <div className="quick-grid">

              <div className="quick-card">
                <p className="card-label">Service Area</p>

                <h3>Who We Serve</h3>

                <p>
                  Our geographical area is west of the Monongahela
                  River in Monongalia County, plus the Town of Star City.
                </p>
              </div>

              <div className="quick-card">
                <p className="card-label">Additional Program</p>

                <h3>Baby & Toddler Program</h3>

                <p>
                  Monday, Tuesday and Thursday
                </p>

                <strong>9:00 AM – 4:00 PM</strong>
              </div>

              <div className="quick-card">
                <p className="card-label">Location</p>

                <h3>Where We Are</h3>

                <p>
                  St. Ursula Food Pantry & Outreach
                  <br />
                  St. Ursula, Rt. 19 & 7
                </p>

                <p>
                  Pursglove, WV 26546
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* Contact */}
        <section className="contact-section">
          <div className="container contact-content">

            <div>
              <p className="eyebrow">Need Help?</p>

              <h2>Contact St. Ursula</h2>

              <p>
                If you have questions about food assistance,
                emergency food orders, or our programs, please
                contact us.
              </p>
            </div>

            <div className="contact-details">

              <div>
                <span>Phone</span>
                <a href="tel:3045993822">
                  304-599-3822
                </a>
              </div>

              <div>
                <span>Email</span>
                <a href="mailto:stursulaoutreach@gmail.com">
                  stursulaoutreach@gmail.com
                </a>
              </div>

              <a
                href="mailto:stursulaoutreach@gmail.com"
                className="contact-button large"
              >
                Email Us
              </a>

            </div>

          </div>
        </section>


        {/* Donations */}
        <section className="section">
          <div className="container narrow">

            <p className="eyebrow">Community Support</p>

            <h2>Help support our food pantry</h2>

            <p>
              We accept food and monetary donations from the
              general community.
            </p>

            <p>
              We are active participants in community food drives
              and Empty Bowls Monongalia.
            </p>

          </div>
        </section>


        {/* Community partners */}
        <section className="section light-section">
          <div className="container narrow">

            <p className="eyebrow">Community Partners</p>

            <h2>Working together to fight hunger</h2>

            <p>
              St. Ursula Food Pantry is a member of the United Way
              Family Resource Network Food and Hunger Committee and
              the Mountaineer Food Bank.
            </p>

          </div>
        </section>


        {/* About / additional information */}
        <section className="section">
          <div className="container narrow">

            <h2>Additional Information</h2>

            <p>
              St. Ursula Food Pantry & Outreach is operating a food
              pantry providing emergency food at St. Ursula, Rt. 19 & 7.
            </p>

            <p>
              We do not refer or advocate for abortion or affiliate
              with organizations who do.
            </p>

          </div>
        </section>


        {/* Existing church website */}
        <section className="church-link-section">
          <div className="container">

            <p>
              St. Ursula is part of the St. Mary Roman Catholic Church
              community.
            </p>

            <a
              href="https://www.stmarystarcity.com/"
              target="_blank"
              rel="noreferrer"
            >
              Visit St. Mary Roman Catholic Church →
            </a>

          </div>
        </section>

      </main>


      <footer className="footer">
        <div className="container">

          <strong>St. Ursula Food Pantry & Outreach</strong>

          <p>
            PO Box 18
            <br />
            Pursglove, WV 26546
          </p>

          <p>
            Phone: <a href="tel:3045993822">304-599-3822</a>
          </p>

          <p>
            Email:{' '}
            <a href="mailto:stursulaoutreach@gmail.com">
              stursulaoutreach@gmail.com
            </a>
          </p>

          <p className="copyright">
            © {new Date().getFullYear()} St. Ursula Food Pantry & Outreach
          </p>

        </div>
      </footer>

    </div>
  )
}

export default App