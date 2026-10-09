import React, { useMemo, useState } from 'react';

const couriers = [
  // Global
  { name: 'DHL',              code: 'dhl',       region: 'Global',    countries: 220, status: 'active',  color: '#FFCC00' },
  { name: 'FedEx',            code: 'fedex',     region: 'Global',    countries: 220, status: 'active',  color: '#4D148C' },
  { name: 'UPS',              code: 'ups',       region: 'Global',    countries: 220, status: 'active',  color: '#351C15' },
  { name: 'Aramex',           code: 'aramex',    region: 'Global',    countries: 70,  status: 'active',  color: '#E30613' },
  { name: 'TNT',              code: 'tnt',       region: 'Global',    countries: 200, status: 'active',  color: '#FF6600' },

  // Africa
  { name: 'GIG Logistics',    code: 'gig',       region: 'Africa',    countries: 1,   status: 'active',  color: '#E63946' },
  { name: 'Kwik',             code: 'kwik',      region: 'Africa',    countries: 1,   status: 'active',  color: '#00B4D8' },
  { name: 'Sendbox',          code: 'sendbox',   region: 'Africa',    countries: 1,   status: 'active',  color: '#4361EE' },
  { name: 'Jumia Logistics',  code: 'jumia',     region: 'Africa',    countries: 9,   status: 'active',  color: '#F77F00' },
  { name: 'Speedaf',          code: 'speedaf',   region: 'Africa',    countries: 12,  status: 'active',  color: '#023E8A' },

  // North America
  { name: 'USPS',             code: 'usps',      region: 'North America', countries: 1, status: 'active', color: '#004B87' },
  { name: 'Canada Post',      code: 'canada-post', region: 'North America', countries: 1, status: 'active', color: '#EE0000' },
  { name: 'Purolator',        code: 'purolator', region: 'North America', countries: 1, status: 'active', color: '#00843D' },

  // Europe
  { name: 'Royal Mail',       code: 'royal-mail', region: 'Europe',   countries: 1,   status: 'active',  color: '#E30613' },
  { name: 'DPD',              code: 'dpd',       region: 'Europe',    countries: 30,  status: 'active',  color: '#DC0032' },
  { name: 'GLS',              code: 'gls',       region: 'Europe',    countries: 40,  status: 'active',  color: '#FFD500' },
  { name: 'Hermes',           code: 'hermes',    region: 'Europe',    countries: 12,  status: 'active',  color: '#00A0DF' },
  { name: 'La Poste',         code: 'la-poste',  region: 'Europe',    countries: 1,   status: 'active',  color: '#FFCD00' },
  { name: 'Deutsche Post',    code: 'deutsche-post', region: 'Europe', countries: 1, status: 'active',  color: '#FFCC00' },

  // Asia
  { name: 'SF Express',       code: 'sf-express', region: 'Asia',     countries: 5,   status: 'active',  color: '#000000' },
  { name: 'Cainiao',          code: 'cainiao',   region: 'Asia',      countries: 15,  status: 'active',  color: '#FF6A00' },
  { name: 'Japan Post',       code: 'japan-post', region: 'Asia',     countries: 1,   status: 'active',  color: '#E60012' },
  { name: 'India Post',       code: 'india-post', region: 'Asia',     countries: 1,   status: 'active',  color: '#FF6600' },

  // Middle East
  { name: 'Aramex Gulf',      code: 'aramex-gulf', region: 'Middle East', countries: 8, status: 'active', color: '#E30613' },

  // Oceania
  { name: 'Australia Post',   code: 'auspost',   region: 'Oceania',   countries: 1,   status: 'active',  color: '#DC2519' },
  { name: 'NZ Post',          code: 'nz-post',   region: 'Oceania',   countries: 1,   status: 'active',  color: '#D0021B' },
];

const regions = ['All', 'Global', 'Africa', 'North America', 'Europe', 'Asia', 'Middle East', 'Oceania'];

const Courier = () => {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return couriers.filter((c) => {
      const matchesRegion = region === 'All' || c.region === region;
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
      return matchesRegion && matchesQuery;
    });
  }, [query, region]);

  const stats = useMemo(() => {
    const totalCountries = couriers.reduce((sum, c) => sum + c.countries, 0);
    return {
      couriers: couriers.length,
      reach: totalCountries,
      regions: new Set(couriers.map((c) => c.region)).size,
    };
  }, []);

  return (
    <div className="couriers">
      <style>{`
        .couriers {
          background: #F7F6F3;
          color: #0E0E10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          min-height: 100vh;
        }

        .couriers .eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5230;
          margin-bottom: 1rem;
        }

        /* HERO */
        .couriers-hero {
          position: relative;
          background: #0E0E10;
          color: #fff;
          padding: 8rem 1.5rem 6rem;
          overflow: hidden;
        }
        .couriers-hero::before {
          content: '';
          position: absolute;
          top: -30%; right: -10%;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(255,82,48,0.28), transparent 65%);
          filter: blur(20px);
          pointer-events: none;
        }
        .couriers-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }
        .couriers-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.045em;
          margin: 0 0 1.5rem;
        }
        .couriers-hero h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #FF5230 0%, #FFB199 60%, #FF5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .couriers-hero p {
          font-size: 1.1rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.65);
          max-width: 560px;
          margin: 0 0 2.5rem;
        }

        /* Hero stats */
        .couriers-stats {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .couriers-stat-num {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.35rem;
        }
        .couriers-stat-label {
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          font-weight: 600;
        }

        /* CONTROLS */
        .couriers-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
        }
        .couriers-controls {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .couriers-search {
          width: 100%;
          background: #fff;
          border: 1px solid rgba(14,14,16,0.08);
          border-radius: 14px;
          padding: 0.9rem 1.1rem;
          font-size: 0.95rem;
          font-family: inherit;
          color: #0E0E10;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .couriers-search::placeholder { color: #A1A1AA; }
        .couriers-search:focus {
          border-color: rgba(255,82,48,0.5);
          box-shadow: 0 0 0 4px rgba(255,82,48,0.1);
        }

        .region-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .region-pill {
          background: #fff;
          border: 1px solid rgba(14,14,16,0.08);
          color: #52525B;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
        .region-pill:hover {
          color: #0E0E10;
          border-color: rgba(14,14,16,0.2);
        }
        .region-pill.active {
          background: #0E0E10;
          color: #fff;
          border-color: #0E0E10;
        }

        /* GRID */
        .couriers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .courier-card {
          background: #fff;
          border: 1px solid rgba(14,14,16,0.06);
          border-radius: 16px;
          padding: 1.35rem;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .courier-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(14,14,16,0.15);
          border-color: rgba(255,82,48,0.3);
        }

        .courier-head {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .courier-logo {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        .courier-title {
          flex: 1;
          min-width: 0;
        }
        .courier-name {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 0.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .courier-code {
          font-size: 0.75rem;
          color: #A1A1AA;
          font-family: 'SF Mono', Menlo, Consolas, monospace;
        }

        .courier-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(14,14,16,0.06);
          font-size: 0.82rem;
          color: #71717A;
        }
        .courier-meta strong {
          color: #0E0E10;
          font-weight: 600;
        }

        .courier-status {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .courier-status .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
        }
        .courier-status.inactive .dot {
          background: #A1A1AA;
          box-shadow: 0 0 0 3px rgba(161,161,170,0.15);
        }

        /* EMPTY */
        .empty {
          padding: 4rem 1.5rem;
          text-align: center;
          color: #71717A;
          background: #fff;
          border-radius: 16px;
          border: 1px dashed rgba(14,14,16,0.12);
        }
        .empty strong {
          display: block;
          color: #0E0E10;
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .couriers-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .couriers-hero { padding: 6rem 1.25rem 4rem; }
          .couriers-section { padding: 3.5rem 1.25rem; }
          .couriers-grid { grid-template-columns: 1fr; }
          .couriers-stats { gap: 1.75rem; }
        }
      `}</style>

      {/* HERO */}
      <section className="couriers-hero">
        <div className="couriers-hero-inner">
          <div className="eyebrow" style={{ color: '#FF5230' }}>Couriers</div>
          <h1>
            The carriers
            <br />
            <em>you already use.</em>
          </h1>
          <p>
            DHL, FedEx, UPS, GIG, Kwik, Sendbox, and hundreds more — all
            supported by one tracking number search.
          </p>

          <div className="couriers-stats">
            <div>
              <div className="couriers-stat-num">{stats.couriers}+</div>
              <div className="couriers-stat-label">Couriers</div>
            </div>
            <div>
              <div className="couriers-stat-num">{stats.reach}+</div>
              <div className="couriers-stat-label">Country links</div>
            </div>
            <div>
              <div className="couriers-stat-num">{stats.regions}</div>
              <div className="couriers-stat-label">Regions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROLS + GRID */}
      <section className="couriers-section">
        <div className="couriers-controls">
          <input
            type="text"
            className="couriers-search"
            placeholder="Search for a courier…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="region-pills">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                className={`region-pill ${region === r ? 'active' : ''}`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <strong>No couriers found</strong>
            Try a different search term or region.
          </div>
        ) : (
          <div className="couriers-grid">
            {filtered.map((c) => (
              <div key={c.code} className="courier-card">
                <div className="courier-head">
                  <span
                    className="courier-logo"
                    style={{ background: c.color }}
                    aria-hidden="true"
                  >
                    {c.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </span>
                  <div className="courier-title">
                    <h3 className="courier-name">{c.name}</h3>
                    <div className="courier-code">{c.code}</div>
                  </div>
                </div>

                <div className="courier-meta">
                  <span>
                    <strong>{c.countries}</strong>{' '}
                    {c.countries === 1 ? 'country' : 'countries'}
                  </span>
                  <span className={`courier-status ${c.status !== 'active' ? 'inactive' : ''}`}>
                    <span className="dot" />
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Courier;