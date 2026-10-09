import React, { useMemo, useState } from 'react';

const countries = [
  { name: 'Nigeria',        flag: '🇳🇬', region: 'Africa',        couriers: 24, popular: true },
  { name: 'Ghana',          flag: '🇬🇭', region: 'Africa',        couriers: 12, popular: true },
  { name: 'Kenya',          flag: '🇰🇪', region: 'Africa',        couriers: 15, popular: true },
  { name: 'South Africa',   flag: '🇿🇦', region: 'Africa',        couriers: 18, popular: true },
  { name: 'Egypt',          flag: '🇪🇬', region: 'Africa',        couriers: 10 },
  { name: 'Morocco',        flag: '🇲🇦', region: 'Africa',        couriers: 8  },
  { name: 'United States',  flag: '🇺🇸', region: 'North America', couriers: 42, popular: true },
  { name: 'Canada',         flag: '🇨🇦', region: 'North America', couriers: 22 },
  { name: 'Mexico',         flag: '🇲🇽', region: 'North America', couriers: 14 },
  { name: 'United Kingdom', flag: '🇬🇧', region: 'Europe',        couriers: 38, popular: true },
  { name: 'Germany',        flag: '🇩🇪', region: 'Europe',        couriers: 30 },
  { name: 'France',         flag: '🇫🇷', region: 'Europe',        couriers: 28 },
  { name: 'Spain',          flag: '🇪🇸', region: 'Europe',        couriers: 20 },
  { name: 'Italy',          flag: '🇮🇹', region: 'Europe',        couriers: 19 },
  { name: 'Netherlands',    flag: '🇳🇱', region: 'Europe',        couriers: 17 },
  { name: 'China',          flag: '🇨🇳', region: 'Asia',          couriers: 35, popular: true },
  { name: 'India',          flag: '🇮🇳', region: 'Asia',          couriers: 26, popular: true },
  { name: 'Japan',          flag: '🇯🇵', region: 'Asia',          couriers: 21 },
  { name: 'UAE',            flag: '🇦🇪', region: 'Middle East',   couriers: 16, popular: true },
  { name: 'Saudi Arabia',   flag: '🇸🇦', region: 'Middle East',   couriers: 13 },
  { name: 'Brazil',         flag: '🇧🇷', region: 'South America', couriers: 18 },
  { name: 'Argentina',      flag: '🇦🇷', region: 'South America', couriers: 11 },
  { name: 'Australia',      flag: '🇦🇺', region: 'Oceania',       couriers: 23 },
  { name: 'New Zealand',    flag: '🇳🇿', region: 'Oceania',       couriers: 9  },
];

const regions = ['All', 'Africa', 'North America', 'South America', 'Europe', 'Asia', 'Middle East', 'Oceania'];

const Countries = () => {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter((c) => {
      const matchesRegion = region === 'All' || c.region === region;
      const matchesQuery = !q || c.name.toLowerCase().includes(q);
      return matchesRegion && matchesQuery;
    });
  }, [query, region]);

  const totalCouriers = useMemo(
    () => countries.reduce((sum, c) => sum + c.couriers, 0),
    []
  );

  return (
    <div className="countries">
      <style>{`
        .countries {
          background: #F7F6F3;
          color: #0E0E10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.011em;
          min-height: 100vh;
        }

        .countries .eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5230;
          margin-bottom: 1rem;
        }

        /* HERO */
        .countries-hero {
          position: relative;
          background: #0E0E10;
          color: #fff;
          padding: 8rem 1.5rem 6rem;
          overflow: hidden;
        }
        .countries-hero::before {
          content: '';
          position: absolute;
          top: -30%; right: -10%;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(255,82,48,0.28), transparent 65%);
          filter: blur(20px);
          pointer-events: none;
        }
        .countries-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }
        .countries-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.045em;
          margin: 0 0 1.5rem;
        }
        .countries-hero h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #FF5230 0%, #FFB199 60%, #FF5230 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .countries-hero p {
          font-size: 1.1rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.65);
          max-width: 560px;
          margin: 0 0 2.5rem;
        }

        /* Hero stats */
        .countries-stats {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .countries-stat-num {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.35rem;
        }
        .countries-stat-label {
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          font-weight: 600;
        }

        /* CONTROLS */
        .countries-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
        }
        .countries-controls {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .countries-search {
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
        .countries-search::placeholder { color: #A1A1AA; }
        .countries-search:focus {
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
        .countries-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .country-card {
          background: #fff;
          border: 1px solid rgba(14,14,16,0.06);
          border-radius: 16px;
          padding: 1.25rem 1.25rem 1.35rem;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          position: relative;
        }
        .country-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(14,14,16,0.15);
          border-color: rgba(255,82,48,0.3);
        }
        .country-flag {
          font-size: 1.75rem;
          line-height: 1;
          display: inline-block;
          margin-bottom: 0.9rem;
        }
        .country-name {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem;
        }
        .country-meta {
          font-size: 0.85rem;
          color: #71717A;
        }
        .country-meta strong {
          color: #0E0E10;
          font-weight: 600;
        }
        .popular-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FF5230;
          background: #FFE9E2;
          padding: 0.25rem 0.55rem;
          border-radius: 100px;
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
          .countries-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .countries-hero { padding: 6rem 1.25rem 4rem; }
          .countries-section { padding: 3.5rem 1.25rem; }
          .countries-grid { grid-template-columns: 1fr; }
          .countries-stats { gap: 1.75rem; }
        }
      `}</style>

      {/* HERO */}
      <section className="countries-hero">
        <div className="countries-hero-inner">
          <div className="eyebrow" style={{ color: '#FF5230' }}>Coverage</div>
          <h1>
            Every country.
            <br />
            <em>Every courier.</em>
          </h1>
          <p>
            ParcelTracker works with carriers in {countries.length}+ countries
            and territories. Find yours below.
          </p>

          <div className="countries-stats">
            <div>
              <div className="countries-stat-num">{countries.length}+</div>
              <div className="countries-stat-label">Countries</div>
            </div>
            <div>
              <div className="countries-stat-num">{totalCouriers}+</div>
              <div className="countries-stat-label">Courier links</div>
            </div>
            <div>
              <div className="countries-stat-num">24/7</div>
              <div className="countries-stat-label">Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROLS + GRID */}
      <section className="countries-section">
        <div className="countries-controls">
          <input
            type="text"
            className="countries-search"
            placeholder="Search for a country…"
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
            <strong>No countries found</strong>
            Try a different search term or region.
          </div>
        ) : (
          <div className="countries-grid">
            {filtered.map((c) => (
              <div key={c.name} className="country-card">
                {c.popular && <span className="popular-badge">Popular</span>}
                <span className="country-flag" aria-hidden="true">{c.flag}</span>
                <h3 className="country-name">{c.name}</h3>
                <div className="country-meta">
                  <strong>{c.couriers}</strong> couriers · {c.region}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Countries;