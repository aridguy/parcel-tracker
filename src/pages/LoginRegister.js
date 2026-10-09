import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  saveAuth,
  getLockoutStatus,
  registerFailedAttempt,
  clearAttempts,
  VALID_EMAIL,
  VALID_PASSWORD,
} from '../utils/auth';

const LoginRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [lockout, setLockout] = useState(getLockoutStatus());

  // Re-check lockout every 30s while page is open
  useEffect(() => {
    const id = setInterval(() => setLockout(getLockoutStatus()), 30000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 0. Block if locked out
    const status = getLockoutStatus();
    if (status.locked) {
      Swal.fire({
        icon: 'error',
        title: 'Too many attempts',
        text: `Try again in ${status.minutesLeft} minute${
          status.minutesLeft === 1 ? '' : 's'
        }.`,
        confirmButtonColor: '#FF5230',
      });
      return;
    }

    // 1. Validate email
    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#FF5230',
      });
      return;
    }

    // 2. Validate password
    if (form.password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak password',
        text: 'Password must be at least 6 characters.',
        confirmButtonColor: '#FF5230',
      });
      return;
    }

    setLoading(true);

    try {
      // Fake network delay so the loading state is visible
      await new Promise((res) => setTimeout(res, 700));

      // 3. Check credentials
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      if (email !== VALID_EMAIL.toLowerCase() || password !== VALID_PASSWORD) {
        throw new Error('Invalid email or password.');
      }

      // 4. Save token + user
      saveAuth({
        name: 'Nehorail',
        email: VALID_EMAIL,
        createdAt: new Date().toISOString(),
      });

      // 5. Reset rate-limit counter
      clearAttempts();
      setLockout(getLockoutStatus());

      // 6. Success + redirect
      Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'Redirecting to your dashboard…',
        confirmButtonColor: '#FF5230',
        timer: 1400,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate(redirectTo, { replace: true });
      });
    } catch (err) {
      // 7. Register failed attempt
      const next = registerFailedAttempt();
      setLockout(next);

      if (next.locked) {
        Swal.fire({
          icon: 'error',
          title: 'Account temporarily locked',
          text: `Too many failed attempts. Try again in ${
            next.minutesLeft
          } minute${next.minutesLeft === 1 ? '' : 's'}.`,
          confirmButtonColor: '#FF5230',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: `${err.message} ${next.attemptsLeft} attempt${
            next.attemptsLeft === 1 ? '' : 's'
          } left.`,
          confirmButtonColor: '#FF5230',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const submitDisabled = loading || lockout.locked;
  const submitLabel = lockout.locked
    ? `Locked (${lockout.minutesLeft}m)`
    : loading
    ? 'Please wait…'
    : 'Sign in';

  return (
    <div className="auth">
      <style>{`
        .auth {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #F7F6F3;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          color: #0E0E10;
        }

        .auth-side {
          position: relative;
          background: #0E0E10;
          color: #fff;
          padding: 5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }
        .auth-side::before {
          content: '';
          position: absolute;
          top: -30%; right: -20%;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(255,82,48,0.28), transparent 65%);
          filter: blur(20px);
          pointer-events: none;
        }
        .auth-side::after {
          content: '';
          position: absolute;
          bottom: -30%; left: -20%;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(120,90,255,0.18), transparent 65%);
          pointer-events: none;
        }
        .auth-side-inner {
          position: relative;
          z-index: 1;
          max-width: 440px;
        }
        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          text-decoration: none;
          margin-bottom: 4rem;
        }
        .auth-logo:hover { color: #fff; }
        .auth-logo-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #FF5230;
          box-shadow: 0 0 0 4px rgba(255,82,48,0.18);
        }
        .auth-side h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin: 0 0 1.25rem;
        }
        .auth-side h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #FF5230 0%, #FFB199 60%, #FF5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-side p {
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          font-size: 1rem;
          margin: 0 0 2.5rem;
          max-width: 380px;
        }
        .auth-perks {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .auth-perks li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.92rem;
          color: rgba(255,255,255,0.75);
        }
        .auth-perks .tick {
          width: 20px; height: 20px;
          flex-shrink: 0;
          border-radius: 50%;
          background: rgba(255,82,48,0.2);
          color: #FF5230;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .auth-side-foot {
          position: relative;
          z-index: 1;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .auth-main {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
        }
        .auth-card h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.25rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.05;
          margin: 0 0 0.6rem;
        }
        .auth-card .sub {
          color: #71717A;
          font-size: 0.95rem;
          margin: 0 0 2rem;
          line-height: 1.6;
        }
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.1rem;
        }
        .auth-field label {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #52525B;
          font-weight: 600;
        }
        .auth-field input {
          width: 100%;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.1);
          border-radius: 14px;
          padding: 0.9rem 1.1rem;
          font-size: 0.95rem;
          font-family: inherit;
          color: #0E0E10;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .auth-field input::placeholder { color: #A1A1AA; }
        .auth-field input:focus {
          border-color: rgba(255,82,48,0.6);
          box-shadow: 0 0 0 4px rgba(255,82,48,0.1);
        }
        .auth-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0.4rem 0 1.5rem;
          font-size: 0.85rem;
        }
        .auth-check {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #52525B;
          cursor: pointer;
        }
        .auth-check input { accent-color: #FF5230; }
        .auth-forgot {
          color: #FF5230;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-forgot:hover { text-decoration: underline; }

        .auth-submit {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: #FF5230;
          color: #fff;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .auth-submit:hover:not(:disabled) {
          background: #ff3b14;
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px rgba(255,82,48,0.6);
        }
        .auth-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0 1.5rem;
          color: #A1A1AA;
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(14,14,16,0.08);
        }
        .auth-sso {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .auth-sso button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.1);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: #0E0E10;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .auth-sso button:hover {
          border-color: rgba(14,14,16,0.25);
          transform: translateY(-1px);
        }
        .auth-terms {
          margin-top: 1.75rem;
          font-size: 0.8rem;
          color: #71717A;
          text-align: center;
          line-height: 1.6;
        }
        .auth-terms a {
          color: #FF5230;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-terms a:hover { text-decoration: underline; }

        @media (max-width: 900px) {
          .auth { grid-template-columns: 1fr; }
          .auth-side { padding: 4rem 2rem 3rem; }
          .auth-side h1 { font-size: 2rem; }
          .auth-side p { margin-bottom: 1.5rem; }
          .auth-logo { margin-bottom: 2.5rem; }
          .auth-main { padding: 3rem 1.5rem 4rem; }
        }
        @media (max-width: 480px) {
          .auth-sso { grid-template-columns: 1fr; }
        }
      `}</style>

      <aside className="auth-side">
        <div className="auth-side-inner">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-dot" />
            <span>ParcelTracker</span>
          </Link>

          <h1>
            Track anything,
            <br />
            <em>anywhere.</em>
          </h1>
          <p>
            Sign in to save tracking numbers, get delivery alerts, and manage
            every parcel in one place.
          </p>

          <ul className="auth-perks">
            <li>
              <span className="tick">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              Save unlimited tracking numbers
            </li>
            <li>
              <span className="tick">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              Email + SMS delivery alerts
            </li>
            <li>
              <span className="tick">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              One dashboard for every courier
            </li>
          </ul>
        </div>

        <div className="auth-side-foot">
          ParcelTracker · Built for humans
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <h2>Welcome back.</h2>
          <p className="sub">
            Enter your details to access your saved parcels.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading || lockout.locked}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                disabled={loading || lockout.locked}
                autoComplete="current-password"
              />
            </div>

            <div className="auth-row">
              <label className="auth-check">
                <input type="checkbox" /> Remember me
              </label>
              <a href="/" className="auth-forgot">Forgot password?</a>
            </div>

            <button type="submit" className="auth-submit" disabled={submitDisabled}>
              {submitLabel}
              {!submitDisabled && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          <div className="auth-divider">or continue with</div>

          <div className="auth-sso">
            <button type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1H12v3.2h5.3c-.5 2.3-2.4 3.9-5.3 3.9a5.7 5.7 0 1 1 0-11.4c1.4 0 2.7.5 3.7 1.4l2.4-2.4A9.3 9.3 0 0 0 12 3a9 9 0 1 0 0 18c5.2 0 8.7-3.7 8.7-8.8 0-.4 0-.7-.1-1.1z" />
              </svg>
              Google
            </button>
            <button type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.1 2.2a10 10 0 0 0-3.6 19.4c-.1-.8-.1-2 .3-2.9.4-.9 2.5-6.8 2.5-6.8s-.1-.5-.1-1.2c0-1.2.7-2 1.5-2 .7 0 1 .5 1 1.2 0 .7-.5 1.8-.7 2.8-.2.9.4 1.5 1.3 1.5 1.5 0 2.7-1.6 2.7-3.9 0-2-1.4-3.5-3.5-3.5-2.4 0-3.8 1.8-3.8 3.6 0 .7.3 1.5.6 1.9.1.1.1.2.1.3l-.2.9c0 .1-.1.2-.3.1-1.1-.5-1.8-2.1-1.8-3.4 0-2.7 2-5.3 5.7-5.3 3 0 5.3 2.1 5.3 5 0 3-1.9 5.3-4.6 5.3-.9 0-1.7-.5-2-1 0 0-.5 1.8-.6 2.2-.2.8-.7 1.9-1.1 2.5A10 10 0 1 0 12.1 2.2z" />
              </svg>
              Apple
            </button>
          </div>

          <p className="auth-terms">
            By continuing you agree to our{' '}
            <a href="/">Terms</a> and <a href="/">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginRegister;