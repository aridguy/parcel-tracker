import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * variant="light" → for LIGHT page backgrounds (default)
 *   · not scrolled → dark text on transparent
 *   · scrolled     → white text on blurred dark bar
 *
 * variant="dark"  → for DARK page backgrounds
 *   · not scrolled → white text on transparent
 *   · scrolled     → white text on blurred dark bar
 */
const Navbar = ({ variant = 'light' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <style>{`
        .pt-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.25rem 0;
          transition: padding 0.35s ease, background 0.35s ease,
                      backdrop-filter 0.35s ease, border-color 0.35s ease;
          border-bottom: 1px solid transparent;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .pt-nav.is-scrolled {
          padding: 0.75rem 0;
          background: rgba(14, 14, 16, 0.75);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }

        .pt-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ---------------- Brand ---------------- */
        .pt-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #ffffff;
          text-decoration: none;
          transition: color 0.3s ease, opacity 0.25s ease;
        }

        .pt-brand:hover { opacity: 0.85; }

        .pt-brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #FF5230;
          box-shadow: 0 0 0 4px rgba(255, 82, 48, 0.18);
          animation: ptPulse 2.4s ease-in-out infinite;
        }

        @keyframes ptPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(255, 82, 48, 0.18); }
          50%      { box-shadow: 0 0 0 8px rgba(255, 82, 48, 0); }
        }

        .pt-brand-text {
          background: linear-gradient(180deg, #ffffff 0%, #d4d4d8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: none;
        }

        /* ---------------- Links ---------------- */
        .pt-links {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .pt-link {
          position: relative;
          padding: 0.55rem 0.95rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.65);
          text-decoration: none;
          border-radius: 100px;
          transition: color 0.25s ease, background 0.25s ease;
        }

        .pt-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .pt-link.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .pt-link.active::after {
          content: '';
          position: absolute;
          bottom: 0.15rem;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          border-radius: 2px;
          background: #FF5230;
        }

        /* ---------------- CTA ---------------- */
        .pt-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 0.75rem;
          padding: 0.65rem 1.35rem;
          background: #FF5230;
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.25s ease,
                      box-shadow 0.25s ease, color 0.25s ease;
        }

        .pt-cta:hover {
          background: #ff3b14;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 12px 25px -8px rgba(255, 82, 48, 0.65);
        }

        .pt-cta svg { transition: transform 0.25s ease; }
        .pt-cta:hover svg { transform: translateX(2px); }

        /* ---------------- Hamburger ---------------- */
        .pt-burger {
          display: none;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .pt-burger:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .pt-burger-lines {
          position: relative;
          width: 18px;
          height: 14px;
        }

        .pt-burger-lines span {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.2s ease, top 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.25s ease;
        }

        .pt-burger-lines span:nth-child(1) { top: 0; }
        .pt-burger-lines span:nth-child(2) { top: 6px; }
        .pt-burger-lines span:nth-child(3) { top: 12px; }

        .pt-burger.is-open .pt-burger-lines span:nth-child(1) {
          top: 6px;
          transform: rotate(45deg);
        }
        .pt-burger.is-open .pt-burger-lines span:nth-child(2) {
          opacity: 0;
        }
        .pt-burger.is-open .pt-burger-lines span:nth-child(3) {
          top: 6px;
          transform: rotate(-45deg);
        }

        /* =========================================================
           VARIANT: light  →  page bg is LIGHT at the top
           ========================================================= */
        .pt-nav--light:not(.is-scrolled) .pt-brand { color: #0E0E10; }
        .pt-nav--light:not(.is-scrolled) .pt-brand-text {
          background: linear-gradient(180deg, #0E0E10 0%, #52525B 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .pt-nav--light:not(.is-scrolled) .pt-link {
          color: rgba(14, 14, 16, 0.6);
        }
        .pt-nav--light:not(.is-scrolled) .pt-link:hover {
          color: #0E0E10;
          background: rgba(14, 14, 16, 0.06);
        }
        .pt-nav--light:not(.is-scrolled) .pt-link.active {
          color: #0E0E10;
          background: rgba(14, 14, 16, 0.08);
        }

        .pt-nav--light:not(.is-scrolled) .pt-burger {
          background: rgba(14, 14, 16, 0.05);
          border-color: rgba(14, 14, 16, 0.12);
        }
        .pt-nav--light:not(.is-scrolled) .pt-burger:hover {
          background: rgba(14, 14, 16, 0.09);
          border-color: rgba(14, 14, 16, 0.2);
        }
        .pt-nav--light:not(.is-scrolled) .pt-burger-lines span {
          background: #0E0E10;
        }
        /* When the burger is open (drawer visible) the drawer is dark,
           so keep the X lines light regardless of variant */
        .pt-nav--light .pt-burger.is-open .pt-burger-lines span {
          background: #ffffff;
        }
        .pt-nav--light .pt-burger.is-open {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.1);
        }

        /* =========================================================
           VARIANT: dark  →  page bg is DARK at the top
           (keeps the original always-white look)
           ========================================================= */
        .pt-nav--dark:not(.is-scrolled) .pt-brand { color: #ffffff; }
        .pt-nav--dark:not(.is-scrolled) .pt-link {
          color: rgba(255, 255, 255, 0.65);
        }
        .pt-nav--dark:not(.is-scrolled) .pt-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }
        .pt-nav--dark:not(.is-scrolled) .pt-link.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* ---------------- Mobile drawer ---------------- */
        .pt-drawer {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(14, 14, 16, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          padding: 7rem 2rem 2rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-12px);
          transition: opacity 0.35s ease, visibility 0.35s ease,
                      transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pt-drawer.is-open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .pt-drawer-links {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .pt-drawer-link {
          display: block;
          padding: 1.1rem 0;
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: rgba(0, 0, 0, 0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          transition: color 0.25s ease, padding-left 0.3s ease;
        }

        .pt-drawer-link:hover,
        .pt-drawer-link.active {
          color: #ffffff;
          padding-left: 0.5rem;
        }

        .pt-drawer-cta {
          margin-top: 2.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem 2rem;
          background: #FF5230;
          color: #ffffff;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.25s ease;
        }

        .pt-drawer-cta:hover {
          background: #ff3b14;
          color: #ffffff;
        }

        /* ---------------- Responsive ---------------- */
        @media (max-width: 900px) {
          .pt-links { display: none; }
          .pt-burger { display: inline-flex; }
        }
      `}</style>

      <nav className={`pt-nav pt-nav--${variant} ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="pt-nav-inner">
          {/* Brand */}
          <Link className="pt-brand" to="/" onClick={closeMenu}>
            <span className="pt-brand-dot" />
            <span className="pt-brand-text">ParcelTracker</span>
          </Link>

          {/* Desktop links */}
          <ul className="pt-links">
            <li>
              <NavLink className="pt-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className="pt-link" to="/about">
                About
              </NavLink>
            </li>
            <li>
              <NavLink className="pt-link" to="/support">
                Support
              </NavLink>
            </li>
            <li>
              <NavLink className="pt-cta" to="/login">
                Login / Register
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </NavLink>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            type="button"
            className={`pt-burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span className="pt-burger-lines">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`pt-drawer ${open ? 'is-open' : ''}`}>
        <ul className="pt-drawer-links">
          <li>
            <NavLink className="pt-drawer-link" to="/" end onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="pt-drawer-link" to="/about" onClick={closeMenu}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink className="pt-drawer-link" to="/support" onClick={closeMenu}>
              Support
            </NavLink>
          </li>
        </ul>

        <Link className="pt-drawer-cta" to="/login" onClick={closeMenu}>
          Login / Register
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default Navbar;