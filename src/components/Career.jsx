import React from 'react';
import Swal from 'sweetalert2';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/qkxysvxk1g4j8';

const roles = [
  { title: 'Frontend Engineer',     team: 'Product',  location: 'USA / Texas', type: 'Full-time' },
  { title: 'Backend Engineer',      team: 'Platform', location: 'Remote',         type: 'Hybrid' },
  { title: 'Product Designer',      team: 'Design',   location: 'USA',          type: 'Remote' },
  { title: 'Customer Support Lead', team: 'Support',  location: 'Singapore',          type: 'Remote' },
  { title: 'Growth Marketer',       team: 'Marketing',location: 'Canada',         type: 'Contract'  },
];

const perks = [
  { icon: '🌍', title: 'Remote-first', text: 'Work from anywhere. We hire across Africa and beyond.' },
  { icon: '⚡', title: 'Ship fast',    text: 'Small team, big ownership. Your work goes live in days, not quarters.' },
  { icon: '💰', title: 'Real equity',  text: 'Everyone gets a stake. When we win, you win.' },
  { icon: '🌴', title: 'Time off',     text: '25 days paid leave, plus public holidays in your country.' },
];

const Careers = () => {
  const handleApply = async (role) => {
    const { value: email } = await Swal.fire({
      title: `Apply — ${role.title}`,
      html: `
        <p style="font-size: 0.85rem; color: #71717A; margin: 0 0 1rem;">
          ${role.team} · ${role.location} · ${role.type}
        </p>
      `,
      input: 'email',
      inputLabel: 'Your email',
      inputPlaceholder: 'you@example.com',
      showCancelButton: true,
      confirmButtonColor: '#FF5230',
      cancelButtonColor: '#71717A',
      confirmButtonText: 'Send application',
      inputValidator: (value) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email';
        return null;
      },
    });

    if (!email) return;

    // Show loading while we POST
    Swal.fire({
      title: 'Sending…',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      confirmButtonColor: '#FF5230',
    });

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
              email: email.trim(),
              source: `career: ${role.title}`,
              subscribedAt: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      await res.json();

      Swal.fire({
        icon: 'success',
        title: 'Application received',
        html: `Thanks for applying for <strong>${role.title}</strong>.<br/>We'll be in touch at <strong>${email}</strong>.`,
        confirmButtonColor: '#FF5230',
      });
    } catch (err) {
      console.error('Apply error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Could not send',
        text: 'Something went wrong. Please try again or email careers@parceltracker.app.',
        confirmButtonColor: '#FF5230',
      });
    }
  };

  return (
    <div className="careers">
      <style>{`
        .careers {
          background: #F7F6F3;
          color: #0E0E10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          min-height: 100vh;
        }

        .careers .eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5230;
          margin-bottom: 1rem;
        }

        /* HERO */
        .careers-hero {
          position: relative;
          background: #0E0E10;
          color: #fff;
          padding: 8rem 1.5rem 6rem;
          overflow: hidden;
        }
        .careers-hero::before {
          content: '';
          position: absolute;
          top: -30%; right: -10%;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(255,82,48,0.28), transparent 65%);
          filter: blur(20px);
          pointer-events: none;
        }
        .careers-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }
        .careers-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.045em;
          margin: 0 0 1.5rem;
        }
        .careers-hero h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #FF5230 0%, #FFB199 60%, #FF5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .careers-hero p {
          font-size: 1.1rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.65);
          max-width: 560px;
          margin: 0;
        }

        /* SECTIONS */
        .careers-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
        }
        .careers-section h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        /* PERKS */
        .perks-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .perk {
          background: #fff;
          border-radius: 18px;
          padding: 1.75rem;
          border: 1px solid rgba(14,14,16,0.06);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .perk:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(14,14,16,0.15);
        }
        .perk-icon {
          font-size: 1.5rem;
          display: inline-block;
          margin-bottom: 0.9rem;
          line-height: 1;
        }
        .perk h3 {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem;
        }
        .perk p {
          font-size: 0.9rem;
          color: #71717A;
          line-height: 1.6;
          margin: 0;
        }

        /* ROLES */
        .roles-list {
          display: flex;
          flex-direction: column;
          margin-top: 2rem;
          border-top: 1px solid rgba(14,14,16,0.08);
        }
        .role {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.75rem 0;
          border-bottom: 1px solid rgba(14,14,16,0.08);
          transition: padding-left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .role:hover { padding-left: 0.75rem; }
        .role-info h3 {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem;
        }
        .role-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #71717A;
        }
        .role-meta span {
          padding: 0.25rem 0.65rem;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.08);
          border-radius: 100px;
        }
        .role-apply {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #0E0E10;
          color: #fff;
          border: none;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.7rem 1.25rem;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          flex-shrink: 0;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .role-apply:hover {
          background: #FF5230;
          transform: translateY(-1px);
        }

        /* CTA */
        .careers-cta {
          background: #0E0E10;
          color: #fff;
          border-radius: 28px;
          padding: 3.5rem 2rem;
          text-align: center;
          margin-top: 2rem;
        }
        .careers-cta h3 {
          font-size: clamp(1.35rem, 2.5vw, 1.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 0.75rem;
        }
        .careers-cta p {
          color: rgba(255,255,255,0.6);
          max-width: 440px;
          margin: 0 auto 1.75rem;
          font-size: 0.95rem;
          line-height: 1.65;
        }
        .careers-cta a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #FF5230;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.9rem 1.75rem;
          border-radius: 100px;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .careers-cta a:hover {
          background: #ff3b14;
          color: #fff;
          transform: translateY(-2px);
        }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .careers-hero { padding: 6rem 1.25rem 4rem; }
          .careers-section { padding: 3.5rem 1.25rem; }
          .perks-grid { grid-template-columns: 1fr; }
          .role {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .role-apply { width: 100%; justify-content: center; }
          .careers-cta { padding: 2.5rem 1.5rem; border-radius: 24px; }
        }
      `}</style>

      {/* HERO */}
      <section className="careers-hero">
        <div className="careers-hero-inner">
          <div className="eyebrow" style={{ color: '#FF5230' }}>Careers</div>
          <h1>
            Build the future of
            <br />
            <em>parcel tracking.</em>
          </h1>
          <p>
            We're a small team obsessed with making delivery tracking simple
            for millions of people. If that sounds like you, come build with
            us.
          </p>
        </div>
      </section>

      {/* PERKS */}
      <section className="careers-section">
        <div className="eyebrow">Why join us</div>
        <h2>What you get.</h2>
        <div className="perks-grid">
          {perks.map((p) => (
            <div key={p.title} className="perk">
              <span className="perk-icon" aria-hidden="true">{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OPEN ROLES */}
      <section className="careers-section" style={{ paddingTop: 0 }}>
        <div className="eyebrow">Open roles</div>
        <h2>{roles.length} positions open.</h2>

        <div className="roles-list">
          {roles.map((r) => (
            <div key={r.title} className="role">
              <div className="role-info">
                <h3>{r.title}</h3>
                <div className="role-meta">
                  <span>{r.team}</span>
                  <span>{r.location}</span>
                  <span>{r.type}</span>
                </div>
              </div>
              <button
                type="button"
                className="role-apply"
                onClick={() => handleApply(r)}
              >
                Apply
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="careers-cta">
          <h3>Don't see your role?</h3>
          <p>
            We're always looking for great people. Send us your portfolio or
            CV and tell us what you'd build here.
          </p>
          <a href="mailto:careers@parceltracker.app">
            Email us
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Careers;