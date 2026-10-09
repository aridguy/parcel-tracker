import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getUser, logout } from '../../../../../utils/auth';

/* ------------------------------------------------------------------ */
/*  SHARED ALERTS                                                     */
/* ------------------------------------------------------------------ */
const swalBase = {
  confirmButtonColor: '#FF5230',
  cancelButtonColor: '#71717A',
  reverseButtons: true,
  customClass: {
    popup: 'swal-pt-popup',
    title: 'swal-pt-title',
    confirmButton: 'swal-pt-confirm',
    cancelButton: 'swal-pt-cancel',
  },
  showClass: { popup: 'swal-pt-in' },
};

const showSettingsLocked = () =>
  Swal.fire({
    ...swalBase,
    title: 'Settings locked',
    html: `
      <p style="margin:0;color:#52525B;font-size:0.92rem;line-height:1.55;">
        Reach out to the admin via the
        <strong style="color:#0E0E10;">live chat icon</strong>
        to make settings configurations.
      </p>
    `,
    icon: 'info',
    iconColor: '#FF5230',
    confirmButtonText: 'Got it',
  });

const showSaved = (label = 'Changes saved') =>
  Swal.fire({
    ...swalBase,
    title: label,
    icon: 'success',
    iconColor: '#22c55e',
    timer: 1400,
    showConfirmButton: false,
  });

/* ------------------------------------------------------------------ */
/*  NAV CONFIG                                                        */
/* ------------------------------------------------------------------ */
const SECTIONS = [
  { id: 'profile',       label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security',      label: 'Security' },
  { id: 'preferences',   label: 'Preferences' },
  { id: 'danger',        label: 'Danger zone' },
];

/* ------------------------------------------------------------------ */
/*  SMALL UI PRIMITIVES                                               */
/* ------------------------------------------------------------------ */
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`set-toggle${checked ? ' is-on' : ''}${disabled ? ' is-disabled' : ''}`}
  >
    <span className="set-toggle-knob" />
  </button>
);

const Field = ({ label, hint, children }) => (
  <label className="set-field">
    <span className="set-field-label">{label}</span>
    {children}
    {hint && <span className="set-field-hint">{hint}</span>}
  </label>
);

/* ------------------------------------------------------------------ */
/*  SETTINGS                                                          */
/* ------------------------------------------------------------------ */
const Settings = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [activeSection, setActiveSection] = useState('profile');

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || 'Nigeria',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    marketing: false,
    deliveryUpdates: true,
    exceptions: true,
  });

  const [prefs, setPrefs] = useState({
    theme: 'light',
    language: 'English',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD MMM YYYY',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  /* ---------- handlers ---------- */
  const handleProfileSave = (e) => {
    e.preventDefault();
    // 🔒 Locked per admin policy — swap for real save when backend is ready
    showSettingsLocked();
  };

  const handleNotificationToggle = (key) => {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
    showSaved('Preference updated');
  };

  const handlePrefChange = (key, value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      Swal.fire({
        ...swalBase,
        icon: 'warning',
        iconColor: '#FF5230',
        title: 'Missing fields',
        text: 'Fill in all password fields to continue.',
        confirmButtonText: 'Okay',
      });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      Swal.fire({
        ...swalBase,
        icon: 'error',
        iconColor: '#ef4444',
        title: "Passwords don't match",
        text: 'Make sure your new password and confirmation match.',
        confirmButtonText: 'Try again',
      });
      return;
    }
    showSettingsLocked();
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      ...swalBase,
      title: 'Delete account?',
      html: `
        <p style="margin:0;color:#52525B;font-size:0.92rem;line-height:1.55;">
          This action is permanent and cannot be undone. All your parcels,
          alerts, and history will be removed.
        </p>
      `,
      icon: 'warning',
      iconColor: '#ef4444',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete forever',
      cancelButtonText: 'Cancel',
    }).then((res) => {
      if (res.isConfirmed) showSettingsLocked();
    });
  };

  const handleLogoutAll = () => {
    Swal.fire({
      ...swalBase,
      title: 'Log out everywhere?',
      text: 'You will be signed out on all devices.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Log out all',
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        Swal.fire({
          ...swalBase,
          icon: 'success',
          iconColor: '#22c55e',
          title: 'Logged out',
          timer: 1100,
          showConfirmButton: false,
        }).then(() => navigate('/login'));
      }
    });
  };

  const initials = (profile.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  /* ---------- render ---------- */
  return (
    <div className="set-page">
      <style>{`
        .set-page {
          min-height: 100vh;
          background: #F7F6F3;
          color: #0E0E10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          -webkit-font-smoothing: antialiased;
        }

        /* ============ HEADER ============ */
        .set-header {
          position: relative;
          background: #0E0E10;
          color: #fff;
          padding: 7rem 1.5rem 6rem;
          overflow: hidden;
          isolation: isolate;
        }
        .set-header::before {
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
        .set-header::after {
          content: '';
          position: absolute;
          top: -40%; right: -10%;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(255,82,48,0.28), transparent 65%);
          filter: blur(30px);
          pointer-events: none;
          z-index: 0;
          animation: setGlow 16s ease-in-out infinite;
        }
        @keyframes setGlow {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(-30px,40px); }
        }

        .set-header-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
        }
        .set-eyebrow {
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
          margin-bottom: 1.5rem;
        }
        .set-eyebrow .pulse {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #FF5230;
          box-shadow: 0 0 0 4px rgba(255,82,48,0.2);
          animation: setPulse 2.4s ease-in-out infinite;
        }
        @keyframes setPulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(255,82,48,0.2); }
          50%     { box-shadow: 0 0 0 8px rgba(255,82,48,0); }
        }
        .set-header h1 {
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.045em;
          margin: 0 0 0.75rem;
        }
        .set-header h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #FF5230 0%, #FFB199 60%, #FF5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 100%;
          animation: setShimmer 6s linear infinite;
        }
        @keyframes setShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .set-header p {
          color: rgba(255,255,255,0.6);
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
          max-width: 540px;
        }

        /* ============ LAYOUT ============ */
        .set-layout {
          max-width: 1100px;
          margin: -3.5rem auto 0;
          padding: 0 1.5rem 6rem;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 2rem;
          position: relative;
          z-index: 2;
        }

        /* Sidebar nav */
        .set-nav {
          position: sticky;
          top: 6rem;
          align-self: start;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.06);
          border-radius: 20px;
          padding: 0.6rem;
          box-shadow: 0 25px 50px -30px rgba(14,14,16,0.18);
        }
        .set-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .set-nav-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.7rem 0.9rem;
          font-family: inherit;
          font-size: 0.86rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #52525B;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .set-nav-btn:hover {
          color: #0E0E10;
          background: rgba(14,14,16,0.04);
        }
        .set-nav-btn.is-active {
          color: #0E0E10;
          background: rgba(255,82,48,0.08);
          position: relative;
        }
        .set-nav-btn.is-active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%;
          bottom: 20%;
          width: 3px;
          border-radius: 3px;
          background: #FF5230;
        }
        .set-nav-btn.is-danger { color: #b91c1c; }
        .set-nav-btn.is-danger:hover { background: rgba(239,68,68,0.06); }
        .set-nav-btn.is-danger.is-active {
          background: rgba(239,68,68,0.08);
        }
        .set-nav-btn.is-danger.is-active::before { background: #ef4444; }

        /* Main column */
        .set-main {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Card */
        .set-card {
          background: #fff;
          border: 1px solid rgba(14,14,16,0.06);
          border-radius: 22px;
          padding: 1.75rem;
          box-shadow: 0 25px 50px -35px rgba(14,14,16,0.15);
        }
        .set-card-head {
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          padding-bottom: 1.35rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(14,14,16,0.06);
        }
        .set-card-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(255,82,48,0.1);
          color: #FF5230;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .set-card-title {
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 0.2rem;
          color: #0E0E10;
        }
        .set-card-sub {
          font-size: 0.83rem;
          color: #71717A;
          margin: 0;
          line-height: 1.5;
        }

        /* Profile header inside card */
        .set-profile-top {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          margin-bottom: 1.75rem;
        }
        .set-avatar {
          width: 68px; height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF5230 0%, #ff8a6e 100%);
          color: #fff;
          font-weight: 800;
          font-size: 1.35rem;
          letter-spacing: -0.02em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 12px 30px -12px rgba(255,82,48,0.6);
        }
        .set-profile-meta { min-width: 0; }
        .set-profile-name {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0E0E10;
          margin: 0 0 0.15rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .set-profile-email {
          font-size: 0.85rem;
          color: #71717A;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .set-avatar-btn {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 600;
          color: #52525B;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.12);
          padding: 0.55rem 1rem;
          border-radius: 100px;
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease,
                      background 0.2s ease;
        }
        .set-avatar-btn:hover {
          color: #0E0E10;
          border-color: rgba(14,14,16,0.28);
          background: #F7F6F3;
        }

        /* Form */
        .set-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.1rem;
        }
        .set-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .set-field-label {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #52525B;
        }
        .set-field-hint {
          font-size: 0.75rem;
          color: #A1A1AA;
          margin-top: 0.15rem;
        }
        .set-input {
          font-family: inherit;
          font-size: 0.9rem;
          color: #0E0E10;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.12);
          border-radius: 12px;
          padding: 0.75rem 0.95rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease,
                      background 0.2s ease;
          width: 100%;
        }
        .set-input:hover { border-color: rgba(14,14,16,0.22); }
        .set-input:focus {
          outline: none;
          border-color: #FF5230;
          box-shadow: 0 0 0 4px rgba(255,82,48,0.12);
        }
        .set-input:disabled {
          background: #F7F6F3;
          color: #A1A1AA;
          cursor: not-allowed;
        }
        .set-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2352525B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
          background-repeat: no-repeat;
          background-position: right 0.9rem center;
          padding-right: 2.4rem;
          cursor: pointer;
        }

        .set-actions {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
          margin-top: 0.75rem;
        }

        /* Buttons */
        .set-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.7rem 1.4rem;
          border-radius: 100px;
          cursor: pointer;
          border: none;
          transition: background 0.22s ease, color 0.22s ease,
                      border-color 0.22s ease, transform 0.22s ease,
                      box-shadow 0.22s ease;
        }
        .set-btn-primary {
          background: #FF5230;
          color: #fff;
        }
        .set-btn-primary:hover {
          background: #ff3b14;
          transform: translateY(-1px);
          box-shadow: 0 12px 25px -10px rgba(255,82,48,0.6);
        }
        .set-btn-ghost {
          background: #fff;
          color: #52525B;
          border: 1px solid rgba(14,14,16,0.12);
        }
        .set-btn-ghost:hover {
          color: #0E0E10;
          border-color: rgba(14,14,16,0.25);
          background: #F7F6F3;
        }
        .set-btn-danger {
          background: #ef4444;
          color: #fff;
        }
        .set-btn-danger:hover {
          background: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 12px 25px -10px rgba(239,68,68,0.55);
        }
        .set-btn-danger-ghost {
          background: #fff;
          color: #b91c1c;
          border: 1px solid rgba(239,68,68,0.3);
        }
        .set-btn-danger-ghost:hover {
          background: rgba(239,68,68,0.06);
          border-color: rgba(239,68,68,0.5);
        }

        /* Toggle row */
        .set-rows {
          display: flex;
          flex-direction: column;
        }
        .set-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(14,14,16,0.05);
        }
        .set-row:first-child { padding-top: 0; }
        .set-row:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }
        .set-row-text { flex: 1; min-width: 0; }
        .set-row-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0E0E10;
          margin: 0 0 0.15rem;
        }
        .set-row-desc {
          font-size: 0.8rem;
          color: #71717A;
          margin: 0;
          line-height: 1.45;
        }

        /* Toggle */
        .set-toggle {
          position: relative;
          width: 42px;
          height: 24px;
          border-radius: 100px;
          background: #E7E5E1;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition: background 0.25s ease;
        }
        .set-toggle.is-on { background: #FF5230; }
        .set-toggle.is-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .set-toggle-knob {
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .set-toggle.is-on .set-toggle-knob {
          transform: translateX(18px);
        }

        /* Danger card */
        .set-card.is-danger { border-color: rgba(239,68,68,0.2); }
        .set-card.is-danger .set-card-icon {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
        }
        .set-card.is-danger .set-card-title { color: #b91c1c; }

        /* SWEETALERT OVERRIDES */
        .swal-pt-popup {
          border-radius: 22px !important;
          padding: 1.75rem 1.5rem 1.5rem !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          box-shadow: 0 30px 70px -25px rgba(14,14,16,0.45) !important;
        }
        .swal-pt-title {
          font-size: 1.15rem !important;
          font-weight: 700 !important;
          color: #0E0E10 !important;
          letter-spacing: -0.02em !important;
          padding: 0 !important;
        }
        .swal-pt-confirm,
        .swal-pt-cancel {
          border-radius: 100px !important;
          padding: 0.7rem 1.6rem !important;
          font-weight: 600 !important;
          font-size: 0.88rem !important;
          font-family: inherit !important;
          box-shadow: none !important;
          transition: background 0.22s ease, transform 0.22s ease !important;
        }
        .swal-pt-confirm:hover { transform: translateY(-1px); }

        @keyframes swalPtIn {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to   { opacity: 1; transform: none; }
        }
        .swal-pt-in {
          animation: swalPtIn 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 900px) {
          .set-layout {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .set-nav {
            position: static;
            overflow-x: auto;
          }
          .set-nav-list {
            flex-direction: row;
            gap: 0.25rem;
          }
          .set-nav-btn { white-space: nowrap; }
          .set-nav-btn.is-active::before { display: none; }
          .set-form { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .set-header { padding: 6rem 1.25rem 5rem; }
          .set-layout { padding: 0 1.25rem 5rem; }
          .set-card { padding: 1.35rem; }
          .set-profile-top {
            flex-wrap: wrap;
          }
          .set-avatar-btn {
            margin-left: 0;
            width: 100%;
            justify-content: center;
          }
          .set-actions {
            flex-direction: column-reverse;
          }
          .set-actions .set-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* ============ HEADER ============ */}
      <section className="set-header">
        <div className="set-header-inner">
          <div className="set-eyebrow">
            <span className="pulse" />
            Account
          </div>
          <h1>
            Settings &<br />
            <em>preferences.</em>
          </h1>
          <p>
            Manage your profile, notifications, security, and how
            ParcelTracker behaves for you.
          </p>
        </div>
      </section>

      {/* ============ LAYOUT ============ */}
      <div className="set-layout">
        {/* SIDEBAR */}
        <aside className="set-nav">
          <ul className="set-nav-list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`set-nav-btn${activeSection === s.id ? ' is-active' : ''}${s.id === 'danger' ? ' is-danger' : ''}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN */}
        <div className="set-main">
          {/* ---------- PROFILE ---------- */}
          {activeSection === 'profile' && (
            <section className="set-card">
              <div className="set-card-head">
                <div className="set-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h2 className="set-card-title">Profile</h2>
                  <p className="set-card-sub">
                    Your personal details — visible only to you.
                  </p>
                </div>
              </div>

              <div className="set-profile-top">
                <div className="set-avatar">{initials}</div>
                <div className="set-profile-meta">
                  <p className="set-profile-name">
                    {profile.name || 'Unnamed user'}
                  </p>
                  <p className="set-profile-email">
                    {profile.email || 'no email on file'}
                  </p>
                </div>
                <button
                  type="button"
                  className="set-avatar-btn"
                  onClick={showSettingsLocked}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Change photo
                </button>
              </div>

              <form className="set-form" onSubmit={handleProfileSave}>
                <Field label="Full name">
                  <input
                    className="set-input"
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Jane Doe"
                  />
                </Field>

                <Field label="Email address">
                  <input
                    className="set-input"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="you@example.com"
                  />
                </Field>

                <Field label="Phone number" hint="Used for SMS delivery alerts.">
                  <input
                    className="set-input"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    placeholder="+1 09 9999 9999"
                  />
                </Field>

                <Field label="Country">
                  <select
                    className="set-input set-select"
                    value={profile.country}
                    onChange={(e) =>
                      setProfile({ ...profile, country: e.target.value })
                    }
                  >
                    <option>United States</option>
                    <option>Romania</option>
                    <option>Canada</option>
                    <option>Kenya</option>
                    <option>South Africa</option>
                    <option>United Kingdom</option>
                    <option>Others</option>
                  </select>
                </Field>

                <div className="set-actions">
                  <button
                    type="button"
                    className="set-btn set-btn-ghost"
                    onClick={() =>
                      setProfile({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        country: user?.country || 'Nigeria',
                      })
                    }
                  >
                    Reset
                  </button>
                  <button type="submit" className="set-btn set-btn-primary">
                    Save changes
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ---------- NOTIFICATIONS ---------- */}
          {activeSection === 'notifications' && (
            <section className="set-card">
              <div className="set-card-head">
                <div className="set-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <div>
                  <h2 className="set-card-title">Notifications</h2>
                  <p className="set-card-sub">
                    Choose how and when we ping you.
                  </p>
                </div>
              </div>

              <div className="set-rows">
                <div className="set-row">
                  <div className="set-row-text">
                    <p className="set-row-title">Email notifications</p>
                    <p className="set-row-desc">
                      Receive parcel updates and account notices by email.
                    </p>
                  </div>
                  <Toggle
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle('email')}
                  />
                </div>

                <div className="set-row">
                  <div className="set-row-text">
                    <p className="set-row-title">SMS alerts</p>
                    <p className="set-row-desc">
                      Get delivery updates straight to your phone.
                    </p>
                  </div>
                  <Toggle
                    checked={notifications.sms}
                    onChange={() => handleNotificationToggle('sms')}
                  />
                </div>

                <div className="set-row">
                  <div className="set-row-text">
                    <p className="set-row-title">Push notifications</p>
                    <p className="set-row-desc">
                      Real-time browser push on this device.
                    </p>
                  </div>
                  <Toggle
                    checked={notifications.push}
                    onChange={() => handleNotificationToggle('push')}
                  />
                </div>

                <div className="set-row">
                  <div className="set-row-text">
                    <p className="set-row-title">Delivery updates</p>
                    <p className="set-row-desc">
                      Every checkpoint and status change on tracked parcels.
                    </p>
                  </div>
                  <Toggle
                    checked={notifications.deliveryUpdates}
                    onChange={() => handleNotificationToggle('deliveryUpdates')}
                  />
                </div>

                <div className="set-row">
                  <div className="set-row-text">
                    <p className="set-row-title">Exception alerts</p>
                    <p className="set-row-desc">
                      Priority notice when something goes wrong.
                    </p>
                  </div>
                  <Toggle
                    checked={notifications.exceptions}
                    onChange={() => handleNotificationToggle('exceptions')}
                  />
                </div>

                <div className="set-row">
                  <div className="set-row-text">
                    <p className="set-row-title">Product & marketing</p>
                    <p className="set-row-desc">
                      News, feature drops, and occasional offers.
                    </p>
                  </div>
                  <Toggle
                    checked={notifications.marketing}
                    onChange={() => handleNotificationToggle('marketing')}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ---------- SECURITY ---------- */}
          {activeSection === 'security' && (
            <>
              <section className="set-card">
                <div className="set-card-head">
                  <div className="set-card-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="set-card-title">Change password</h2>
                    <p className="set-card-sub">
                      Use a strong password you don't use elsewhere.
                    </p>
                  </div>
                </div>

                <form className="set-form" onSubmit={handlePasswordSave}>
                  <Field label="Current password">
                    <input
                      className="set-input"
                      type="password"
                      autoComplete="current-password"
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords({ ...passwords, current: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </Field>

                  <div />

                  <Field label="New password" hint="Minimum 8 characters.">
                    <input
                      className="set-input"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.next}
                      onChange={(e) =>
                        setPasswords({ ...passwords, next: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </Field>

                  <Field label="Confirm new password">
                    <input
                      className="set-input"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </Field>

                  <div className="set-actions">
                    <button type="submit" className="set-btn set-btn-primary">
                      Update password
                    </button>
                  </div>
                </form>
              </section>

              <section className="set-card">
                <div className="set-card-head">
                  <div className="set-card-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="set-card-title">Sessions</h2>
                    <p className="set-card-sub">
                      Sign out of every device you're currently signed in on.
                    </p>
                  </div>
                </div>
                <div className="set-actions" style={{ marginTop: 0 }}>
                  <button
                    type="button"
                    className="set-btn set-btn-ghost"
                    onClick={handleLogoutAll}
                  >
                    Log out everywhere
                  </button>
                </div>
              </section>
            </>
          )}

          {/* ---------- PREFERENCES ---------- */}
          {activeSection === 'preferences' && (
            <section className="set-card">
              <div className="set-card-head">
                <div className="set-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="set-card-title">Preferences</h2>
                  <p className="set-card-sub">
                    Appearance, language, and regional formatting.
                  </p>
                </div>
              </div>

              <div className="set-form">
                <Field label="Theme">
                  <select
                    className="set-input set-select"
                    value={prefs.theme}
                    onChange={(e) => handlePrefChange('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">Match system</option>
                  </select>
                </Field>

                <Field label="Language">
                  <select
                    className="set-input set-select"
                    value={prefs.language}
                    onChange={(e) => handlePrefChange('language', e.target.value)}
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Afrikan</option>
                    <option>Japanese</option>
                    <option>Turkish</option>
                    <option>Spanih</option>
                  </select>
                </Field>

                <Field label="Timezone">
                  <select
                    className="set-input set-select"
                    value={prefs.timezone}
                    onChange={(e) => handlePrefChange('timezone', e.target.value)}
                  >
                    <option value="America/New_York">America/New_York (ET)</option>
                    <option value="Africa/Accra">Africa/Accra (GMT)</option>
                    
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    
                    <option value="UTC">UTC</option>
                  </select>
                </Field>

                <Field label="Date format">
                  <select
                    className="set-input set-select"
                    value={prefs.dateFormat}
                    onChange={(e) => handlePrefChange('dateFormat', e.target.value)}
                  >
                    <option value="DD MMM YYYY">DD MMM YYYY — 03 Oct 2026</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY — 10/03/2026</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY — 03/10/2026</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD — 2026-10-03</option>
                  </select>
                </Field>

                <div className="set-actions">
                  <button
                    type="button"
                    className="set-btn set-btn-primary"
                    onClick={() => showSaved('Preferences saved')}
                  >
                    Save preferences
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ---------- DANGER ZONE ---------- */}
          {activeSection === 'danger' && (
            <section className="set-card is-danger">
              <div className="set-card-head">
                <div className="set-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <h2 className="set-card-title">Danger zone</h2>
                  <p className="set-card-sub">
                    Irreversible actions. Please proceed with care.
                  </p>
                </div>
              </div>

              <div className="set-rows">
                <div className="set-row">
                  <div className="set-row-text">
                    <p className="set-row-title">Delete account</p>
                    <p className="set-row-desc">
                      Permanently remove your account, parcels, and history.
                      This cannot be undone.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="set-btn set-btn-danger-ghost"
                    onClick={handleDeleteAccount}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;