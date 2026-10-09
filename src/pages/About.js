import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about">

      {/* ============ ALL CSS GOES HERE ============ */}
      <style>{`
        /* ----- Page base ----- */
        .about {
          background: #F7F6F3;
          color: #0E0E10;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.011em;
        }

        /* ----- HERO (dark top section) ----- */
        .about-hero {
          background: #0E0E10;
          color: #ffffff;
          padding: 8rem 1.5rem 6rem;
          text-align: left;
        }

        .about-hero-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .about-eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5230;
          margin-bottom: 1.25rem;
        }

        .about-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin: 0 0 1.5rem;
        }

        .about-hero h1 span {
          color: #FF5230;
        }

        .about-hero p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.65);
          max-width: 560px;
          margin: 0;
        }

        /* ----- SECTIONS ----- */
        .about-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 6rem 1.5rem;
        }

        .about-section h2 {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        .about-section p {
          font-size: 1.02rem;
          line-height: 1.75;
          color: #52525B;
          margin-bottom: 1rem;
        }

        /* ----- VALUES LIST ----- */
        .about-values {
          list-style: none;
          padding: 0;
          margin: 2rem 0 0;
        }

        .about-values li {
          display: flex;
          gap: 1.5rem;
          padding: 2rem 0;
          border-top: 1px solid rgba(14, 14, 16, 0.08);
          align-items: flex-start;
        }

        .about-values li:last-child {
          border-bottom: 1px solid rgba(14, 14, 16, 0.08);
        }

        .about-value-num {
          font-size: 0.8rem;
          font-weight: 600;
          color: #FF5230;
          letter-spacing: 0.1em;
          padding-top: 0.35rem;
          flex-shrink: 0;
        }

        .about-value-title {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem;
        }

        .about-value-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #71717A;
          margin: 0;
        }

        /* ----- STATS ----- */
        .about-stats {
          background: #ffffff;
          border-top: 1px solid rgba(14, 14, 16, 0.06);
          border-bottom: 1px solid rgba(14, 14, 16, 0.06);
        }

        .about-stats-grid {
          max-width: 900px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .about-stat-num {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0E0E10;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .about-stat-label {
          font-size: 0.8rem;
          color: #71717A;
        }

        /* ----- CTA (dark card) ----- */
        .about-cta {
          background: #0E0E10;
          color: #ffffff;
          border-radius: 28px;
          padding: 4rem 2rem;
          text-align: center;
          margin-top: 1rem;
        }

        .about-cta h2 {
          color: #ffffff;
          margin-bottom: 0.75rem;
        }

        .about-cta p {
          color: rgba(255, 255, 255, 0.6);
          max-width: 420px;
          margin: 0 auto 2rem;
        }

        .about-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #FF5230;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.9rem 1.75rem;
          border-radius: 100px;
          transition: background 0.25s ease, transform 0.25s ease;
        }

        .about-btn:hover {
          background: #ff3b14;
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* ----- MOBILE ----- */
        @media (max-width: 640px) {
          .about-hero { padding: 6rem 1.5rem 4rem; }
          .about-section { padding: 4rem 1.5rem; }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            padding: 3rem 1.5rem;
          }
          .about-cta { padding: 3rem 1.5rem; border-radius: 24px; }
        }
      `}</style>

      {/* ============ HERO ============ */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-eyebrow">About Us</div>
          <h1>
            Every parcel has a story.
            <br />
            We just tell it <span>clearly.</span>
          </h1>
          <p>
            ParcelTracker pulls delivery updates from hundreds of couriers into
            one clean, honest view — so you stop guessing and start knowing.
          </p>
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className="about-section">
        <h2>Born from a simple frustration.</h2>
        <p>
          Tracking a package used to mean juggling five different courier
          websites, each with its own confusing interface and its own idea of
          what "in transit" means.
        </p>
        <p>
          We built ParcelTracker so there is exactly one place to look. One
          number, one page, one honest status.
        </p>
        <p>
          Today, we bring delivery updates from couriers worldwide into a
          single view — clean, fast, and built for the way people actually use
          their phones.
        </p>
      </section>

      {/* ============ STATS ============ */}
      <section className="about-stats">
        <div className="about-stats-grid">
          <div>
            <div className="about-stat-num">500+</div>
            <div className="about-stat-label">Couriers</div>
          </div>
          <div>
            <div className="about-stat-num">200+</div>
            <div className="about-stat-label">Countries</div>
          </div>
          <div>
            <div className="about-stat-num">1M+</div>
            <div className="about-stat-label">Parcels tracked</div>
          </div>
          <div>
            <div className="about-stat-num">24/7</div>
            <div className="about-stat-label">Always online</div>
          </div>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section className="about-section">
        <h2>What we stand for.</h2>
        <ul className="about-values">
          <li>
            <span className="about-value-num">01</span>
            <div>
              <h3 className="about-value-title">Global by design</h3>
              <p className="about-value-text">
                One search box. Every courier that matters — from America to
                London, New York to Nairobi, Asia etc. No region left behind.
              </p>
            </div>
          </li>
          <li>
            <span className="about-value-num">02</span>
            <div>
              <h3 className="about-value-title">Fast and frictionless</h3>
              <p className="about-value-text">
                No sign-up walls. No ads between you and your answer. Paste a
                number, get the truth in seconds.
              </p>
            </div>
          </li>
          <li>
            <span className="about-value-num">03</span>
            <div>
              <h3 className="about-value-title">Private by default</h3>
              <p className="about-value-text">
                We do not sell your data, and we do not track what you search.
                Your parcels are your business.
              </p>
            </div>
          </li>
          <li>
            <span className="about-value-num">04</span>
            <div>
              <h3 className="about-value-title">Built for real life</h3>
              <p className="about-value-text">
                Works on cheap phones, slow networks, and in the middle of
                New York traffic. Reliability is the whole point.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* ============ CTA ============ */}
      <section className="about-section" style={{ paddingTop: 0 }}>
        <div className="about-cta">
          <h2>Ready to find your parcel?</h2>
          <p>
            Paste a tracking number and get a real answer in seconds. No
            account, no noise.
          </p>
          <Link to="/" className="about-btn">
            Track a Parcel
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;