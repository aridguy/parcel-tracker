import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getUser, logout } from '../../../../../utils/auth';
import ParcelsList from '../../../../../components/ParcelsList';

const stats = [
  { label: 'Active parcels', value: '3',  hint: 'Being tracked' },
  { label: 'Delivered',      value: '12', hint: 'All time' },
  { label: 'Alerts on',      value: '2',  hint: 'Email + SMS' },
  { label: 'Saved couriers', value: '4',  hint: 'In your account' },
];

const actions = [
  {
    title: 'Track a parcel',
    text: 'Look up a new tracking number.',
    to: '/',
    label: 'Go to tracker',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    title: 'Notifications',
    text: 'Manage email and SMS delivery alerts.',
    to: '/',
    label: 'Manage alerts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    title: 'API access',
    text: 'Get your key and start integrating.',
    to: '/apiaccess',
    label: 'View docs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Account settings',
    text: 'Update your profile and password.',
    to: '/settings',
    label: 'Open settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const firstName = user?.name?.split(' ')[0] || 'there';

  const handleLogout = () => {
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




  return (
    <div className="dash">
      <style>{`
        .dash {
          min-height: 100vh;
          background: #F7F6F3;
          color: #0E0E10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ============ HERO ============ */
        .dash-hero {
          position: relative;
          background: #0E0E10;
          color: #fff;
          padding: 7rem 1.5rem 8rem;
          overflow: hidden;
          isolation: isolate;
        }
        .dash-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%);
          pointer-events: none;
          z-index: 0;
        }
        .dash-hero::after {
          content: '';
          position: absolute;
          top: -50%; right: -15%;
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(255,82,48,0.32), transparent 65%);
          filter: blur(30px);
          pointer-events: none;
          z-index: 0;
          animation: dashGlow 16s ease-in-out infinite;
        }
        @keyframes dashGlow {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(-40px,50px); }
        }

        .dash-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
        }

        .dash-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5230;
          padding: 0.45rem 0.95rem;
          border: 1px solid rgba(255,82,48,0.3);
          border-radius: 100px;
          background: rgba(255,82,48,0.08);
          margin-bottom: 1.75rem;
        }
        .dash-eyebrow .pulse {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #FF5230;
          box-shadow: 0 0 0 4px rgba(255,82,48,0.2);
          animation: dashPulse 2.4s ease-in-out infinite;
        }
        @keyframes dashPulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(255,82,48,0.2); }
          50%     { box-shadow: 0 0 0 8px rgba(255,82,48,0); }
        }

        .dash-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.045em;
          margin: 0 0 1rem;
          max-width: 800px;
        }
        .dash-hero h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #FF5230 0%, #FFB199 60%, #FF5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 100%;
          animation: dashShimmer 6s linear infinite;
        }
        @keyframes dashShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .dash-hero .sub {
          color: rgba(255,255,255,0.6);
          font-size: 1.05rem;
          line-height: 1.6;
          margin: 0 0 2.25rem;
          max-width: 520px;
        }

        .dash-hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .dash-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.8rem 1.5rem;
          border-radius: 100px;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          border: none;
          transition: background 0.25s ease, transform 0.25s ease,
                      box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .dash-btn-primary {
          background: #FF5230;
          color: #fff;
        }
        .dash-btn-primary:hover {
          background: #ff3b14;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -14px rgba(255,82,48,0.7);
        }
        .dash-btn-ghost {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
        }
        .dash-btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          color: #fff;
          transform: translateY(-2px);
        }

        /* ============ FLOATING STATS ============ */
        .dash-stats {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: -5rem auto 0;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .dash-stat {
          background: #fff;
          border-radius: 20px;
          padding: 1.5rem 1.35rem;
          border: 1px solid rgba(14,14,16,0.05);
          box-shadow: 0 25px 50px -30px rgba(14,14,16,0.2);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s ease, border-color 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .dash-stat::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 24px; height: 2px;
          background: #FF5230;
        }
        .dash-stat:hover {
          transform: translateY(-6px);
          border-color: rgba(255,82,48,0.25);
          box-shadow: 0 35px 60px -30px rgba(255,82,48,0.35);
        }
        .dash-stat-num {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #0E0E10;
          margin-bottom: 0.5rem;
          font-variant-numeric: tabular-nums;
        }
        .dash-stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0E0E10;
          margin-bottom: 0.15rem;
        }
        .dash-stat-hint {
          font-size: 0.75rem;
          color: #A1A1AA;
        }

        /* ============ SECTIONS ============ */
        .dash-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4.5rem 1.5rem 0;
        }
        .dash-section:last-child {
          padding-bottom: 5rem;
        }
        .dash-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
        }
        .dash-section-title {
          font-size: clamp(1.35rem, 2.5vw, 1.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0;
          line-height: 1.1;
        }
        .dash-section-sub {
          font-size: 0.85rem;
          color: #71717A;
          margin: 0.35rem 0 0;
        }
        .dash-section-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: #FF5230;
          text-decoration: none;
        }
        .dash-section-link:hover { text-decoration: underline; }

        /* ============ ACTIONS GRID ============ */
        .action-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .action {
          background: #fff;
          border: 1px solid rgba(14,14,16,0.06);
          border-radius: 18px;
          padding: 1.5rem 1.35rem;
          text-decoration: none;
          color: #0E0E10;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s ease, border-color 0.3s ease;
        }
        .action:hover {
          transform: translateY(-6px);
          color: #0E0E10;
          border-color: rgba(255,82,48,0.3);
          box-shadow: 0 25px 50px -25px rgba(255,82,48,0.35);
        }
        .action-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(255,82,48,0.1);
          color: #FF5230;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .action:hover .action-icon {
          background: #FF5230;
          color: #fff;
        }
        .action h3 {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .action p {
          font-size: 0.85rem;
          color: #71717A;
          line-height: 1.55;
          margin: 0;
        }
        .action-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #FF5230;
          margin-top: auto;
          padding-top: 0.5rem;
        }

        /* ============ LOGOUT BAR ============ */
        .dash-logout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 3rem 1.5rem 5rem;
          display: flex;
          justify-content: flex-end;
        }
        .logout-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: #71717A;
          border: 1px solid rgba(14,14,16,0.12);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.7rem 1.25rem;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.25s ease, border-color 0.25s ease,
                      background 0.25s ease;
        }
        .logout-btn:hover {
          color: #0E0E10;
          border-color: rgba(14,14,16,0.25);
          background: #fff;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 900px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .action-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-hero { padding: 6rem 1.5rem 7rem; }
        }
        @media (max-width: 640px) {
          .dash-stats { grid-template-columns: 1fr; }
          .action-grid { grid-template-columns: 1fr; }
          .dash-section { padding-top: 3rem; }
        }
      `}</style>

      {/* ============ HERO ============ */}
      <section className="dash-hero">
        <div className="dash-hero-inner">
          <div className="dash-eyebrow">
            <span className="pulse" />
            Dashboard
          </div>

          <h1>
            Welcome back,
            <br />
            <em>{firstName}.</em>
          </h1>

          <p className="sub">
            Here's what's happening with your parcels today. Track new
            shipments, manage alerts, or dive into your API.
          </p>

          <div className="dash-hero-actions">
            <Link to="/" className="dash-btn dash-btn-primary">
              Track a parcel
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <button
              type="button"
              className="dash-btn dash-btn-ghost"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </section>

      {/* ============ FLOATING STATS ============ */}
      <section className="dash-stats">
        {stats.map((s) => (
          <div key={s.label} className="dash-stat">
            <div className="dash-stat-num">{s.value}</div>
            <div className="dash-stat-label">{s.label}</div>
            <div className="dash-stat-hint">{s.hint}</div>
          </div>
        ))}
      </section>

      {/* ============ PARCELS ============ */}
      <section className="dash-section">
        <div className="dash-section-head">
          <div>
            <h2 className="dash-section-title">Your parcels</h2>
            <p className="dash-section-sub">
              The latest status for everything you're tracking.
            </p>
          </div>
          <Link to="/" className="dash-section-link">
            Add new →
          </Link>
        </div>

        <ParcelsList />
      </section>

      {/* ============ QUICK ACTIONS ============ */}
      <section className="dash-section">
        <div className="dash-section-head">
          <div>
            <h2 className="dash-section-title">Quick actions</h2>
            <p className="dash-section-sub">
              Everything you need, one tap away.
            </p>
          </div>
        </div>

        <div className="action-grid">
          {actions.map((a) => (
            <Link key={a.title} to={a.to} className="action">
              <span className="action-icon">{a.icon}</span>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
              <span className="action-label">{a.label} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ LOGOUT BAR ============ */}
      <div className="dash-logout">
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Log out
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;