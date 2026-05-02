import { useCounter } from '../hooks/useScrollReveal'

function Stat({ target, suffix, prefix, label }) {
  const ref = useCounter(target)
  return (
    <div className="stat-item">
      <div className="stat-number">
        {prefix && <span className="stat-prefix">{prefix}</span>}
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function StatsCounter() {
  return (
    <section style={{
      padding: '18px 5%',
      background: 'rgba(11,123,111,0.10)',
      borderTop: '1px solid rgba(11,123,111,0.08)',
      borderBottom: '1px solid rgba(11,123,111,0.08)',
    }}>
      <div className="stats-inline">
        <Stat target={4.7} suffix="★" label="Rating · 131 Reviews" />
        <Stat target={13} suffix="+" label="Years Experience" />
        <Stat target={10} suffix="K+" label="Patients Treated" />
        <Stat target={2} label="Clinic Locations" />
      </div>

      <style>{`
        .stats-inline {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 4px 0;
        }
        .stats-inline::-webkit-scrollbar { display: none; }

        .stat-item {
          position: relative;
          flex: 0 0 auto;
          text-align: center;
          min-width: 75px;
        }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          color: #0A1628;
          line-height: 1.1;
          margin-bottom: 2px;
        }
        .stat-prefix { color: #0B7B6F; }

        .stat-label {
          font-size: 10px;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          color: #64748B;
          white-space: nowrap;
        }

        .stat-item:not(:last-child)::after {
          content: "";
          position: absolute;
          right: -6px; top: 50%;
          transform: translateY(-50%);
          height: 24px; width: 1px;
          background: rgba(11,123,111,0.18);
        }

        @media (max-width: 900px) {
          .stats-inline { justify-content: flex-start; padding: 4px 0; gap: 14px; }
          .stat-number { font-size: 20px; }
          .stat-label { font-size: 9px; }
          .stat-item::after { display: none; }
        }
      `}</style>
    </section>
  )
}