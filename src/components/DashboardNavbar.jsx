import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getUser, logout } from '../utils/auth';

/**
 * variant="light" → for LIGHT page backgrounds (default)
 *   · not scrolled → dark text on transparent
 *   · scrolled     → white text on blurred dark bar
 *
 * variant="dark"  → for DARK page backgrounds
 *   · not scrolled → white text on transparent
 *   · scrolled     → white text on blurred dark bar
 */
const DashboardNavbar = ({ variant = 'light' }) => {
  const navigate = useNavigate();
  const user = getUser();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    closeMenu();
    Swal.fire({
      title: 'Log out?',
      text: 'You will need to sign in again to access your dashboard.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF5230',
      cancelButtonColor: '#71717A',
      confirmButtonText: 'Log out',
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        Swal.fire({
          icon: 'success',
          title: 'Logged out',
          timer: 1100,
          showConfirmButton: false,
        }).then(() => navigate('/login'));
      }
    });
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <style>{`
        .dnav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 1rem 0;
          transition: padding 0.35s ease, background 0.35s ease,
                      backdrop-filter 0.35s ease, border-color 0.35s ease;
          border-bottom: 1px solid transparent;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
        }
        .dnav.is-scrolled {
          padding: 0.65rem 0;
          background: rgba(14,14,16,0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom-color: rgba(255,255,255,0.08);
        }
        .dnav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ---------------- Brand ---------------- */
        .dnav-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          text-decoration: none;
          transition: color 0.3s ease, opacity 0.25s ease;
        }
        .dnav-brand:hover { opacity: 0.85; }
        .dnav-brand-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #FF5230;
          box-shadow: 0 0 0 4px rgba(255,82,48,0.18);
          animation: dnavPulse 2.4s ease-in-out infinite;
        }
        @keyframes dnavPulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(255,82,48,0.18); }
          50%     { box-shadow: 0 0 0 8px rgba(255,82,48,0); }
        }
        .dnav-brand-tag {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-left: 0.5rem;
          padding-left: 0.75rem;
          border-left: 1px solid rgba(255,255,255,0.12);
          transition: color 0.3s ease, border-color 0.3s ease;
        }

        /* ---------------- Links ---------------- */
        .dnav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .dnav-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.95rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          border-radius: 100px;
          transition: color 0.25s ease, background 0.25s ease;
        }
        .dnav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .dnav-link.active {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }

        /* ---------------- Right cluster ---------------- */
        .dnav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .dnav-user {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.35rem 0.85rem 0.35rem 0.35rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .dnav-user:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
        }
        .dnav-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #FF5230;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0;
        }
        .dnav-user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #fff;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .dnav-logout {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1.1rem;
          background: transparent;
          color: rgba(255,255,255,0.7);
          font-size: 0.82rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.25s ease, background 0.25s ease,
                      border-color 0.25s ease;
        }
        .dnav-logout:hover {
          color: #fff;
          background: #FF5230;
          border-color: #FF5230;
        }

        /* ---------------- Hamburger ---------------- */
        .dnav-burger {
          display: none;
          width: 42px; height: 42px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .dnav-burger:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .dnav-burger-lines {
          position: relative;
          width: 18px; height: 14px;
        }
        .dnav-burger-lines span {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.2s ease, top 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.25s ease;
        }
        .dnav-burger-lines span:nth-child(1) { top: 0; }
        .dnav-burger-lines span:nth-child(2) { top: 6px; }
        .dnav-burger-lines span:nth-child(3) { top: 12px; }
        .dnav-burger.is-open .dnav-burger-lines span:nth-child(1) {
          top: 6px; transform: rotate(45deg);
        }
        .dnav-burger.is-open .dnav-burger-lines span:nth-child(2) {
          opacity: 0;
        }
        .dnav-burger.is-open .dnav-burger-lines span:nth-child(3) {
          top: 6px; transform: rotate(-45deg);
        }

        /* =========================================================
           VARIANT: light  →  page bg is LIGHT at the top
           ========================================================= */
        .dnav--light:not(.is-scrolled) .dnav-brand { color: #0E0E10; }
        .dnav--light:not(.is-scrolled) .dnav-brand-tag {
          color: rgba(14,14,16,0.4);
          border-left-color: rgba(14,14,16,0.14);
        }

        .dnav--light:not(.is-scrolled) .dnav-link {
          color: rgba(14,14,16,0.6);
        }
        .dnav--light:not(.is-scrolled) .dnav-link:hover {
          color: #0E0E10;
          background: rgba(14,14,16,0.06);
        }
        .dnav--light:not(.is-scrolled) .dnav-link.active {
          color: #0E0E10;
          background: rgba(14,14,16,0.08);
        }

        .dnav--light:not(.is-scrolled) .dnav-user {
          background: rgba(14,14,16,0.04);
          border-color: rgba(14,14,16,0.1);
        }
        .dnav--light:not(.is-scrolled) .dnav-user:hover {
          background: rgba(14,14,16,0.07);
          border-color: rgba(14,14,16,0.18);
        }
        .dnav--light:not(.is-scrolled) .dnav-user-name { color: #0E0E10; }

        .dnav--light:not(.is-scrolled) .dnav-logout {
          color: rgba(14,14,16,0.75);
          border-color: rgba(14,14,16,0.16);
        }
        .dnav--light:not(.is-scrolled) .dnav-logout:hover {
          color: #fff;
          background: #FF5230;
          border-color: #FF5230;
        }

        .dnav--light:not(.is-scrolled) .dnav-burger {
          background: rgba(14,14,16,0.05);
          border-color: rgba(14,14,16,0.12);
        }
        .dnav--light:not(.is-scrolled) .dnav-burger:hover {
          background: rgba(14,14,16,0.09);
          border-color: rgba(14,14,16,0.2);
        }
        .dnav--light:not(.is-scrolled) .dnav-burger-lines span {
          background: #0E0E10;
        }
        /* Burger open → drawer is dark → force white lines + dark chip */
        .dnav--light .dnav-burger.is-open {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }
        .dnav--light .dnav-burger.is-open .dnav-burger-lines span {
          background: #fff;
        }

        /* =========================================================
           VARIANT: dark  →  page bg is DARK at the top
           (keeps the original always-white look)
           ========================================================= */
        .dnav--dark:not(.is-scrolled) .dnav-brand { color: #fff; }
        .dnav--dark:not(.is-scrolled) .dnav-link {
          color: rgba(255,255,255,0.6);
        }
        .dnav--dark:not(.is-scrolled) .dnav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .dnav--dark:not(.is-scrolled) .dnav-link.active {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }

        /* ---------------- Mobile drawer (always dark) ---------------- */
        .dnav-drawer {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(14,14,16,0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 6rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-12px);
          transition: opacity 0.35s ease, visibility 0.35s ease,
                      transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dnav-drawer.is-open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .dnav-drawer-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 1rem;
        }
        .dnav-drawer-user .dnav-avatar {
          width: 40px; height: 40px;
          font-size: 0.85rem;
        }
        .dnav-drawer-user-text {
          display: flex;
          flex-direction: column;
        }
        .dnav-drawer-user-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
        }
        .dnav-drawer-user-email {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
        }
        .dnav-drawer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .dnav-drawer-link {
          display: block;
          padding: 1rem 0;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.25s ease, padding-left 0.3s ease;
        }
        .dnav-drawer-link:hover,
        .dnav-drawer-link.active {
          color: #fff;
          padding-left: 0.5rem;
        }
        .dnav-drawer-logout {
          margin-top: 2rem;
          padding: 1rem 1.5rem;
          background: #FF5230;
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
        }

        @media (max-width: 900px) {
          .dnav-links,
          .dnav-user,
          .dnav-logout { display: none; }
          .dnav-burger { display: inline-flex; }
          .dnav-brand-tag { display: none; }
        }
      `}</style>

      <nav className={`dnav dnav--${variant} ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="dnav-inner">
          <Link to="/" className="dnav-brand">
            <span className="dnav-brand-dot" />
            <span>ParcelTracker</span>
            <span className="dnav-brand-tag">Signed in</span>
          </Link>

          <ul className="dnav-links">
            <li>
              <NavLink className="dnav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className="dnav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink className="dnav-link" to="/countries">
                Countries
              </NavLink>
            </li>
            <li>
              <NavLink className="dnav-link" to="/courier">
                Couriers
              </NavLink>
            </li>
            <li>
              <NavLink className="dnav-link" to="/support">
                Support
              </NavLink>
            </li>
          </ul>

          <div className="dnav-right">
            <Link to="/dashboard" className="dnav-user">
              <span className="dnav-avatar">{initials}</span>
              <span className="dnav-user-name">
                {user?.name || 'Signed in'}
              </span>
            </Link>

            <button type="button" className="dnav-logout" onClick={handleLogout}>
              Log out
            </button>

            <button
              type="button"
              className={`dnav-burger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              <span className="dnav-burger-lines">
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`dnav-drawer ${open ? 'is-open' : ''}`}>
        <div className="dnav-drawer-user">
          <span className="dnav-avatar">{initials}</span>
          <div className="dnav-drawer-user-text">
            <span className="dnav-drawer-user-name">
              {user?.name || 'Signed in'}
            </span>
            <span className="dnav-drawer-user-email">
              {user?.email || ''}
            </span>
          </div>
        </div>

        <ul className="dnav-drawer-links">
          <li>
            <NavLink className="dnav-drawer-link" to="/" end onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="dnav-drawer-link" to="/dashboard" onClick={closeMenu}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink className="dnav-drawer-link" to="/countries" onClick={closeMenu}>
              Countries
            </NavLink>
          </li>
          <li>
            <NavLink className="dnav-drawer-link" to="/courier" onClick={closeMenu}>
              Couriers
            </NavLink>
          </li>
          <li>
            <NavLink className="dnav-drawer-link" to="/support" onClick={closeMenu}>
              Support
            </NavLink>
          </li>
        </ul>

        <button type="button" className="dnav-drawer-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </>
  );
};

export default DashboardNavbar;