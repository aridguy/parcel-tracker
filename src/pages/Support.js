import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

// ⚠️ Replace these with your real EmailJS values
const EMAILJS_SERVICE_ID  = 'service_mh8dgbr';
const EMAILJS_TEMPLATE_ID = 'template_4mi5guv';
const EMAILJS_PUBLIC_KEY  = 'ULxnH3mTzZ6qk3Y85';

const channels = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    ),
    label: 'Email',
    value: 'support@parceltracker.app',
    note: 'We reply within 24 hours.',
    href: 'mailto:support@parceltracker.app',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: 'Live Chat',
    value: 'Chat with us',
    note: 'Mon–Fri, 9am – 6pm WAT.',
    href: '#',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: 'Phone',
    value: '+234 700 000 0000',
    note: 'For urgent delivery issues.',
    href: 'tel:+2347000000000',
  },
];

const categories = [
  { title: 'Tracking issues', text: 'Numbers not returning results, wrong status, or missing updates.', icon: '📦' },
  { title: 'Courier problems', text: 'Delays, failed deliveries, damaged parcels, or lost shipments.', icon: '🚚' },
  { title: 'Account & login', text: 'Password reset, registration issues, or account security.', icon: '🔐' },
  { title: 'Billing & refunds', text: 'Charges, subscription questions, or refund requests.', icon: '💳' },
  { title: 'API & developers', text: 'Integration help, rate limits, webhooks, and documentation.', icon: '⚙️' },
  { title: 'Report a bug', text: 'Something is broken. Tell us exactly what you saw.', icon: '🐞' },
];

const faqs = [
  { q: 'Why is my tracking number not showing any results?', a: 'Most couriers take up to 24 hours to register a new parcel in their system. If it has been longer, double-check the number for typos, and confirm the courier actually handed the parcel over.' },
  { q: 'Do I need an account to track a parcel?', a: 'No. Paste a number and get a result. An account is only useful if you want to save tracking history, set up email alerts, or manage multiple parcels in one dashboard.' },
  { q: 'Which couriers do you support?', a: 'We support 500+ carriers globally, including DHL, FedEx, UPS, USPS, Royal Mail, GIG Logistics, Kwik, Sendbox, and many more.' },
  { q: 'The status says "delivered" but I never received my parcel.', a: 'This usually means the courier marked it delivered to a neighbour, security post, or pickup point. Contact the courier directly with the tracking number first.' },
  { q: 'Is my tracking data private?', a: 'Yes. We do not sell your data. Tracking lookups are anonymous by default, and account data is only stored if you create an account.' },
  { q: 'How do I request a courier to be added?', a: 'Use the contact form on this page and select "Courier request" as the topic. Include the courier name and a sample tracking number.' },
];

const topicOptions = [
  'Tracking issue',
  'Courier problem',
  'Account & login',
  'Billing & refunds',
  'API & developers',
  'Courier request',
  'Report a bug',
  'Something else',
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: topicOptions[0],
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please fill in your name, email and message.',
        confirmButtonColor: '#FF5230',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
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
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          topic: form.topic,
          message: form.message.trim(),
          to_name: 'ParcelTracker Support',
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      Swal.fire({
        icon: 'success',
        title: 'Message sent!',
        text: "We'll get back to you within 24 hours.",
        confirmButtonColor: '#FF5230',
        timer: 3500,
        timerProgressBar: true,
      });

      setForm({ name: '', email: '', topic: topicOptions[0], message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Could not send',
        text:
          err?.text ||
          'Something went wrong. Please try again or email us directly.',
        confirmButtonColor: '#FF5230',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">
      <style>{`
        .support-page {
          background: #F7F6F3;
          color: #0E0E10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .support-page .eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5230;
        }

        /* ============ HERO ============ */
        .support-hero {
          position: relative;
          background: #0E0E10;
          color: #fff;
          padding: 8rem 1.5rem 6rem;
          overflow: hidden;
          isolation: isolate;
        }

        .support-hero::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -10%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(255, 82, 48, 0.28), transparent 65%);
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }

        .support-hero::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(90, 120, 255, 0.22), transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .support-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        .support-hero h1 {
          font-size: clamp(2.75rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.045em;
          margin: 1.25rem 0 1.5rem;
          max-width: 900px;
        }

        .support-hero h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #FF5230 0%, #FFB199 60%, #FF5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 100%;
          animation: supportShimmer 6s linear infinite;
        }

        @keyframes supportShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .support-hero p.lede {
          font-size: 1.1rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.65);
          max-width: 560px;
          margin: 0;
        }

        /* ============ CHANNELS ============ */
        .channels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 4rem;
        }

        .channel-card {
          display: block;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.75rem;
          color: #fff;
          text-decoration: none;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .channel-card:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 82, 48, 0.5);
          transform: translateY(-4px);
          color: #fff;
        }

        .channel-icon {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255, 82, 48, 0.15);
          color: #FF5230;
          margin-bottom: 1.25rem;
        }

        .channel-label {
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .channel-value {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.35rem;
          word-break: break-word;
        }

        .channel-note {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        /* ============ CATEGORIES ============ */
        .categories-section {
          padding: 7rem 1.5rem 6rem;
          background: #fff;
        }

        .categories-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-head {
          max-width: 640px;
          margin-bottom: 3.5rem;
        }

        .section-head h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.05;
          margin: 1rem 0 0;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .cat-card {
          background: #F7F6F3;
          border-radius: 20px;
          padding: 2rem 1.75rem;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, background 0.3s ease;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .cat-card:hover {
          transform: translateY(-6px);
          background: #fff;
          border-color: rgba(255, 82, 48, 0.25);
          box-shadow: 0 25px 50px -20px rgba(14, 14, 16, 0.15);
        }

        .cat-icon {
          font-size: 1.75rem;
          margin-bottom: 1.25rem;
          display: inline-block;
          line-height: 1;
        }

        .cat-title {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .cat-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #71717A;
          margin: 0;
        }

        /* ============ FAQ ============ */
        .faq-section {
          padding: 7rem 1.5rem;
          background: #F7F6F3;
        }

        .faq-wrap {
          max-width: 1200px;
          margin: 0 auto;
        }

        .faq-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
          align-items: start;
        }

        .faq-side h2 {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.05;
          margin: 1rem 0 1.25rem;
        }

        .faq-side p {
          color: #71717A;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .faq-side a {
          color: #FF5230;
          font-weight: 600;
          text-decoration: none;
        }

        .faq-side a:hover { text-decoration: underline; }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .faq-item {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(14, 14, 16, 0.06);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .faq-item.open {
          border-color: rgba(255, 82, 48, 0.35);
          box-shadow: 0 15px 40px -20px rgba(255, 82, 48, 0.35);
        }

        .faq-q {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          width: 100%;
          padding: 1.25rem 1.5rem;
          background: transparent;
          border: none;
          text-align: left;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: #0E0E10;
          cursor: pointer;
          transition: color 0.2s ease;
          font-family: inherit;
        }

        .faq-q:hover { color: #FF5230; }

        .faq-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 82, 48, 0.1);
          color: #FF5230;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, color 0.3s ease;
        }

        .faq-item.open .faq-icon {
          transform: rotate(45deg);
          background: #FF5230;
          color: #fff;
        }

        .faq-a {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-item.open .faq-a {
          max-height: 400px;
        }

        .faq-a-inner {
          padding: 0 1.5rem 1.5rem;
          font-size: 0.95rem;
          line-height: 1.7;
          color: #71717A;
        }

        /* ============ CONTACT FORM ============ */
        .contact-section {
          position: relative;
          padding: 7rem 1.5rem;
          background: #0E0E10;
          color: #fff;
          overflow: hidden;
        }

        .contact-section::before {
          content: '';
          position: absolute;
          top: -30%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 900px;
          background: radial-gradient(circle, rgba(255, 82, 48, 0.15), transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .contact-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }

        .contact-inner h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.05;
          margin: 1rem 0 1rem;
        }

        .contact-inner p.lede {
          color: rgba(255, 255, 255, 0.6);
          max-width: 520px;
          margin: 0 0 3rem;
          line-height: 1.7;
        }

        .contact-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field.full { grid-column: 1 / -1; }

        .field label {
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          color: #fff;
          padding: 0.9rem 1.1rem;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .field textarea {
          min-height: 150px;
          resize: vertical;
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: rgba(255, 82, 48, 0.7);
          box-shadow: 0 0 0 4px rgba(255, 82, 48, 0.12);
          background: rgba(255, 255, 255, 0.07);
        }

        .field select option {
          background: #1A1A1F;
          color: #fff;
        }

        .contact-submit {
          grid-column: 1 / -1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: #FF5230;
          color: #fff;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          padding: 1rem 2rem;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          font-family: inherit;
          margin-top: 0.5rem;
        }

        .contact-submit:hover:not(:disabled) {
          background: #ff3b14;
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px rgba(255, 82, 48, 0.6);
        }

        .contact-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 900px) {
          .channels-grid,
          .categories-grid {
            grid-template-columns: 1fr;
          }
          .faq-layout {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .contact-form {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .support-hero { padding: 6rem 1.25rem 4rem; }
          .categories-section,
          .faq-section,
          .contact-section {
            padding: 5rem 1.25rem;
          }
        }
      `}</style>

      {/* ============ HERO ============ */}
      <section className="support-hero">
        <div className="support-hero-inner">
          <div className="eyebrow">Support</div>
          <h1>
            We're here.
            <br />
            <em>Talk to us.</em>
          </h1>
          <p className="lede">
            Whether it's a missing parcel, a broken tracking number, or an idea
            to make ParcelTracker better — reach out. Real humans, real
            answers.
          </p>

          <div className="channels-grid">
            {channels.map((c) => (
              <a key={c.label} href={c.href} className="channel-card">
                <span className="channel-icon">{c.icon}</span>
                <div className="channel-label">{c.label}</div>
                <div className="channel-value">{c.value}</div>
                <p className="channel-note">{c.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="categories-section">
        <div className="categories-inner">
          <div className="section-head">
            <div className="eyebrow">Browse help</div>
            <h2>
              Pick a topic.
              <br />
              We'll meet you there.
            </h2>
          </div>

          <div className="categories-grid">
            {categories.map((c) => (
              <div key={c.title} className="cat-card">
                <span className="cat-icon" aria-hidden="true">{c.icon}</span>
                <h3 className="cat-title">{c.title}</h3>
                <p className="cat-text">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="faq-section">
        <div className="faq-wrap">
          <div className="faq-layout">
            <div className="faq-side">
              <div className="eyebrow">FAQ</div>
              <h2>Answers to the things people ask most.</h2>
              <p>
                Can't find what you're looking for?{' '}
                <a href="#contact">Send us a message</a> and we'll get back to
                you within a day.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={f.q}
                    className={`faq-item ${isOpen ? 'open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-q"
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                    >
                      <span>{f.q}</span>
                      <span className="faq-icon" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div className="faq-a">
                      <div className="faq-a-inner">{f.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTACT FORM ============ */}
      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="eyebrow">Contact</div>
          <h2>Send us a message.</h2>
          <p className="lede">
            Tell us what's happening. Include a tracking number if it's
            relevant — it helps us help you faster.
          </p>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="field full">
              <label htmlFor="topic">Topic</label>
              <select
                id="topic"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                disabled={loading}
              >
                {topicOptions.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="field full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us what happened..."
                value={form.message}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button type="submit" className="contact-submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send message'}
              {!loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Support;