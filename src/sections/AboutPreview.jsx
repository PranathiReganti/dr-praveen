import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { DOCTOR, EDUCATION } from '../data/content'

export default function AboutPreview() {
  const leftRef  = useScrollReveal()
  const rightRef = useScrollReveal()

  return (
    <section style={{ padding: '90px 5%', background: '#F8FAFA' }}>
      <div
        className="about-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '80px',
          alignItems: 'center'
        }}
      >

        <div ref={leftRef} style={{ opacity: 0, transform: 'translateX(-32px)', transition: 'all 0.7s ease' }}>
          <div style={{
            borderRadius: '24px',
            aspectRatio: '3/4',
            background: 'linear-gradient(135deg,#E6F4F2,#B2DDD8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px'
          }}>
            {DOCTOR.photo ? (
              <img src={DOCTOR.photo} alt={DOCTOR.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            ) : '👨‍⚕️'}
          </div>
        </div>

        <div ref={rightRef} style={{ opacity: 0, transform: 'translateX(32px)', transition: 'all 0.7s ease' }}>
          <div className="section-tag">ABOUT THE DOCTOR</div>

          <h2 className="section-h2">
            Meet <em>Dr. Praveen</em><br/>Ramachandra
          </h2>

          <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.8', marginBottom: '28px' }}>
            {DOCTOR.bio}
          </p>

          <div style={{ marginBottom: '32px' }}>
            {EDUCATION.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '20px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0B7B6F',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {i + 1}
                </div>

                <div>
                  <div style={{ fontWeight: '700' }}>{e.degree}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{e.inst}</div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/about" className="btn-primary">
            Learn More →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  )
}