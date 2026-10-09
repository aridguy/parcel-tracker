import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/qkxysvxk1g4j8';

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();

    // Basic validation
    if (!trimmed) {
      Swal.fire({
        icon: 'warning',
        title: 'Email required',
        text: 'Please enter your email address.',
        confirmButtonColor: '#FF5230',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#FF5230',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              email: trimmed,
              source: 'footer-newsletter',
              subscribedAt: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const data = await res.json();

      Swal.fire({
        icon: 'success',
        title: "You're on the list!",
        text: "We'll send tracking updates straight to your inbox.",
        confirmButtonColor: '#FF5230',
        timer: 3000,
        timerProgressBar: true,
      });

      setEmail('');
      console.log('SheetDB response:', data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text:
          err.message ||
          'Could not subscribe right now. Please try again later.',
        confirmButtonColor: '#FF5230',
      });
      console.error('Subscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="pt-footer">
      <style>{`
        .pt-footer {
          position: relative;
          background: #0E0E10;
          color: #ffffff;
          padding: 6rem 0 0;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          isolation: isolate;
        }

        .pt-footer::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -10%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(255, 82, 48, 0.18), transparent 65%);
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }

        .pt-footer::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at 50% 100%, black 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 100%, black 20%, transparent 75%);
          pointer-events: none;
          z-index: 0;
        }

        .pt-footer-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .pt-footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 4rem;
        }

        .pt-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #ffffff;
          text-decoration: none;
          margin-bottom: 1.25rem;
        }

        .pt-footer-brand:hover { color: #ffffff; }

        .pt-footer-brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #FF5230;
          box-shadow: 0 0 0 4px rgba(255, 82, 48, 0.18);
        }

        .pt-footer-tagline {
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.5);
          max-width: 320px;
          margin: 0 0 1.75rem;
        }

        .pt-footer-form {
          display: flex;
          align-items: center;
          max-width: 340px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 100px;
          padding: 0.3rem 0.3rem 0.3rem 1.1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
        }

        .pt-footer-form:focus-within {
          border-color: rgba(255, 82, 48, 0.6);
          box-shadow: 0 0 0 4px rgba(255, 82, 48, 0.12);
        }

        .pt-footer-form.is-loading {
          opacity: 0.7;
          pointer-events: none;
        }

        .pt-footer-form input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 0.875rem;
          padding: 0.55rem 0;
          min-width: 0;
        }

        .pt-footer-form input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .pt-footer-form button {
          background: #FF5230;
          color: #ffffff;
          border: none;
          padding: 0.55rem 1.1rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
          flex-shrink: 0;
          font-family: inherit;
        }

        .pt-footer-form button:hover:not(:disabled) {
          background: #ff3b14;
          transform: translateY(-1px);
        }

        .pt-footer-form button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .pt-footer-col h4 {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5230;
          margin: 0 0 1.25rem;
        }

        .pt-footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pt-footer-col a {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: color 0.25s ease, transform 0.25s ease;
          display: inline-block;
        }

        .pt-footer-col a:hover {
          color: #ffffff;
          transform: translateX(3px);
        }

        .pt-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.75rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
        }

        .pt-footer-copy {
          font-size: 0.825rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        .pt-footer-legal {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .pt-footer-legal a {
          font-size: 0.825rem;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .pt-footer-legal a:hover { color: #ffffff; }

        .pt-footer-socials {
          display: flex;
          gap: 0.6rem;
        }

        .pt-footer-social {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: background 0.25s ease, border-color 0.25s ease,
                      color 0.25s ease, transform 0.25s ease;
        }

        .pt-footer-social:hover {
          background: #FF5230;
          border-color: #FF5230;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .pt-footer-wordmark {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 2rem 1.5rem 0;
          overflow: hidden;
          line-height: 0.85;
        }

        .pt-footer-wordmark span {
          display: block;
          font-size: clamp(4rem, 18vw, 15rem);
          font-weight: 900;
          letter-spacing: -0.06em;
          background: linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          user-select: none;
          padding-bottom: 0.05em;
        }

        @media (max-width: 900px) {
          .pt-footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .pt-footer-brand-block {
            grid-column: span 2;
          }
        }

        @media (max-width: 576px) {
          .pt-footer {
            padding-top: 4rem;
          }
          .pt-footer-top {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .pt-footer-brand-block {
            grid-column: span 1;
          }
          .pt-footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          .pt-footer-legal {
            justify-content: center;
          }
        }
      `}</style>

      <div className="pt-footer-inner">
        <div className="pt-footer-top">
          {/* Brand block */}
          <div className="pt-footer-brand-block">
            <Link to="/" className="pt-footer-brand">
              <span className="pt-footer-brand-dot" />
              <span>ParcelTracker</span>
            </Link>
            <p className="pt-footer-tagline">
              One search box for every parcel, every courier, every corner of
              the planet. Track anything, anywhere.
            </p>

            <form
              className={`pt-footer-form ${loading ? 'is-loading' : ''}`}
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                placeholder="Get tracking updates by email"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending…' : 'Notify me'}
              </button>
            </form>
          </div>

          {/* Product */}
          <div className="pt-footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link to="/">Track a parcel</Link></li>
              <li><Link to="/courier">Couriers</Link></li>
              <li><Link to="/countries">Countries</Link></li>
              <li><Link to="/apiaccess">API access</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="pt-footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/support">Contact</Link></li>
              <li><Link to="/career">Careers</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="pt-footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/login">Register</Link></li>
              <li><Link to="/">Saved parcels</Link></li>
              <li><Link to="/">Notifications</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-footer-bottom">
          <p className="pt-footer-copy">
            © {year} ParcelTracker. All rights reserved.
          </p>

          <div className="pt-footer-legal">
            <Link to="/">Privacy</Link>
            <Link to="/">Terms</Link>
            <Link to="/">Cookies</Link>
          </div>

          <div className="pt-footer-socials">
            <a href="/" className="pt-footer-social" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="/" className="pt-footer-social" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="/" className="pt-footer-social" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="pt-footer-wordmark" aria-hidden="true">
        <span>ParcelTracker</span>
      </div>
    </footer>
  );
};

export default Footer;