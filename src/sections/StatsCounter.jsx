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

      <div className="stat-label">
        {label}
      </div>

    </div>
  )
}

export default function StatsCounter() {
  return (
    <section style={{
      padding: '30px 5% 50px',
      marginTop: '-20px',
      background: 'rgba(11,123,111,0.15)',
    }}>

      <div className="stats-inline">

        <Stat target={4.7} suffix="★" label="Rating · 131 Reviews" />
        <Stat target={13} suffix="+" label="Years Experience" />
        <Stat target={10} suffix="K+" label="Patients Treated" />
        <Stat target={2} label="Clinic Locations" />

      </div>

      <style>{`

        .stats-inline {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;

          flex-wrap: nowrap;
          overflow-x: auto;
          white-space: nowrap;

          scrollbar-width: none;
          padding: 10px 0;
        }

        .stats-inline::-webkit-scrollbar {
          display: none;
        }

        .stat-item {
          position: relative;
          flex: 0 0 auto;
          min-width: 90px;   /* 🔥 IMPORTANT */
        }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          color: #0A1628;
          margin-bottom: 2px;
        }

        .stat-prefix {
          color: #0B7B6F;
        }

        .stat-label {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #64748B;
          white-space: nowrap;
        }

        .stat-item:not(:last-child)::after {
          content: "";
          position: absolute;
          right: -14px;
          top: 50%;
          transform: translateY(-50%);
          height: 24px;
          width: 1px;
          background: #DDE7E5;
        }

        /* ✅ FINAL MOBILE FIX */
        @media (max-width: 900px) {

          .stats-inline {
            justify-content: flex-start;
            padding: 10px 10px;   /* 🔥 LEFT + RIGHT FIX */
            gap: 20px;
          }

          .stat-number {
            font-size: 22px;
          }

          .stat-label {
            font-size: 9px;
          }

          .stat-item::after {
            display: none;
          }
        }

      `}</style>

    </section>
  )
}