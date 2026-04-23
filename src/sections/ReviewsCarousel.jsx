import { useCounter } from '../hooks/useScrollReveal'

function Stat({ target, suffix, prefix, label, delay }) {
  const ref = useCounter(target)

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '0 20px',
        position: 'relative',
        animation: `fadeUp 0.6s ${delay} both`
      }}
    >
      <div style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: '42px',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '6px'
      }}>
        {prefix && <span style={{ color: '#0FA898' }}>{prefix}</span>}
        <span ref={ref}>0</span>
        {suffix}
      </div>

      <div style={{
        fontSize: '13px',
        color: 'rgba(255,255,255,0.6)'
      }}>
        {label}
      </div>

      <div style={{
        position: 'absolute',
        right: 0,
        top: '20%',
        bottom: '20%',
        width: '1px',
        background: 'rgba(255,255,255,0.08)'
      }} />
    </div>
  )
}

export default function StatsCounter() {
  return (
    <section style={{
      padding: '60px 5%',
      background: 'linear-gradient(135deg,#0F2238,#0A1628)',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        alignItems: 'center'
      }} className="stats-grid">

        <Stat target={4.7} suffix="★" label="JustDial Rating · 131 Reviews" delay="0s" />
        <Stat target={13} suffix="+" label="Years of Clinical Excellence" delay="0.1s" />
        <Stat target={10} suffix="K+" label="Patients Treated" delay="0.2s" />
        <Stat target={2} label="Clinic Locations in Bengaluru" delay="0.3s" />

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2,1fr) !important;
            gap: 20px;
          }
        }

        @media (max-width: 500px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}