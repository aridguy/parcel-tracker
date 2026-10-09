import React, { useState } from 'react';
import Swal from 'sweetalert2';

const codeSample = `curl -X GET "https://api.parceltracker.app/v1/track" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tracking_number": "GIG1234567890",
    "courier": "gig"
  }'`;

const features = [
  { title: '500+ couriers', text: 'One endpoint. Every carrier we support.' },
  { title: 'Real-time webhooks', text: 'Push updates the second a scan happens.' },
  { title: '99.9% uptime', text: 'Built on infrastructure that stays up.' },
  { title: 'Generous free tier', text: '1,000 requests/month, no card required.' },
];

const ApiAccess = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Copy failed',
        text: 'Please select and copy manually.',
        confirmButtonColor: '#FF5230',
      });
    }
  };

  const handleRequestKey = () => {
    Swal.fire({
      title: 'Request API access',
      input: 'email',
      inputLabel: 'Your work email',
      inputPlaceholder: 'you@company.com',
      showCancelButton: true,
      confirmButtonColor: '#FF5230',
      cancelButtonColor: '#71717A',
      confirmButtonText: 'Request key',
      inputValidator: (value) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email';
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Request received',
          text: `We'll send your API key to ${result.value} shortly.`,
          confirmButtonColor: '#FF5230',
        });
      }
    });
  };

  return (
    <div className="api-page">
      <style>{`
        .api-page {
          background: #F7F6F3;
          color: #0E0E10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          min-height: 100vh;
        }

        .api-page .eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5230;
          margin-bottom: 1rem;
        }

        /* HERO */
        .api-hero {
          position: relative;
          background: #0E0E10;
          color: #fff;
          padding: 8rem 1.5rem 6rem;
          overflow: hidden;
        }
        .api-hero::before {
          content: '';
          position: absolute;
          top: -30%; right: -10%;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(255,82,48,0.28), transparent 65%);
          filter: blur(20px);
          pointer-events: none;
        }
        .api-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }
        .api-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.045em;
          margin: 0 0 1.5rem;
        }
        .api-hero h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #FF5230 0%, #FFB199 60%, #FF5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .api-hero p {
          font-size: 1.1rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.65);
          max-width: 560px;
          margin: 0 0 2rem;
        }
        .api-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #FF5230;
          color: #fff;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          padding: 1rem 2rem;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .api-cta:hover {
          background: #ff3b14;
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px rgba(255,82,48,0.6);
        }

        /* SECTION */
        .api-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
        }
        .api-section h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        /* FEATURES */
        .api-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .api-feature {
          background: #fff;
          border-radius: 18px;
          padding: 1.75rem;
          border: 1px solid rgba(14,14,16,0.06);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .api-feature:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(14,14,16,0.15);
        }
        .api-feature h3 {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem;
        }
        .api-feature p {
          font-size: 0.9rem;
          color: #71717A;
          line-height: 1.6;
          margin: 0;
        }

        /* CODE BLOCK */
        .api-code-wrap {
          background: #0E0E10;
          border-radius: 20px;
          overflow: hidden;
          margin-top: 1.5rem;
        }
        .api-code-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .api-code-dots {
          display: flex;
          gap: 0.4rem;
        }
        .api-code-dots span {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }
        .api-code-dots span:first-child { background: #FF5230; }
        .api-copy {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.4rem 0.9rem;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .api-copy:hover {
          background: rgba(255,82,48,0.15);
          color: #FF5230;
        }
        .api-code {
          padding: 1.5rem;
          margin: 0;
          font-family: 'SF Mono', Menlo, Consolas, monospace;
          font-size: 0.85rem;
          line-height: 1.7;
          color: #E4E4E7;
          overflow-x: auto;
          white-space: pre;
        }

        /* MOBILE */
        @media (max-width: 640px) {
          .api-hero { padding: 6rem 1.25rem 4rem; }
          .api-section { padding: 3.5rem 1.25rem; }
          .api-features { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HERO */}
      <section className="api-hero">
        <div className="api-hero-inner">
          <div className="eyebrow" style={{ color: '#FF5230' }}>Developers</div>
          <h1>
            Track parcels
            <br />
            <em>programmatically.</em>
          </h1>
          <p>
            One REST API. Every courier. Ship tracking into your app, dashboard,
            or bot in minutes.
          </p>
          <button type="button" className="api-cta" onClick={handleRequestKey}>
            Request API key
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="api-section">
        <div className="eyebrow">Why use our API</div>
        <h2>Built for developers.</h2>
        <div className="api-features">
          {features.map((f) => (
            <div key={f.title} className="api-feature">
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CODE SAMPLE */}
      <section className="api-section" style={{ paddingTop: 0 }}>
        <div className="eyebrow">Quickstart</div>
        <h2>One request. Real data.</h2>
        <div className="api-code-wrap">
          <div className="api-code-head">
            <div className="api-code-dots">
              <span /><span /><span />
            </div>
            <button type="button" className="api-copy" onClick={handleCopy}>
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          <pre className="api-code">{codeSample}</pre>
        </div>
      </section>
    </div>
  );
};

export default ApiAccess;