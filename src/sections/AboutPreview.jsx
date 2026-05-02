import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { DOCTOR, EDUCATION } from '../data/content'
import doctorImg from "../assets/images/doctor.jpg";

export default function AboutPreview() {
  const leftRef  = useScrollReveal()
  const rightRef = useScrollReveal()
  const isMobile = window.innerWidth <= 900;

  return (
    <section style={{ padding: '56px 5%', background: '#F8FAFA' }}>
      <div
        className="about-grid"
        style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1.3fr',
          gap: '56px', alignItems: 'center'
        }}
      >

        {/* ── LEFT IMAGE ── */}
        <div ref={leftRef} style={{ opacity: 0, transform: 'translateX(-32px)', transition: 'all 0.7s ease' }}>
          <div style={{
            borderRadius: '24px',
            aspectRatio: '3/4',
            background: 'linear-gradient(160deg, #0B7B6F 0%, #1a9e90 40%, #B2DDD8 80%, #E6F4F2 100%)',
            overflow: 'hidden',
            boxShadow: '0 24px 56px rgba(11,123,111,0.18)',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>

            {/* ✅ NAME MOVED TO GREEN AREA (TOP) */}
           <div style={{
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none', // keeps it clean
}}>
   
  <span style={{
    color: 'white',
    fontSize: '13px',
    fontWeight: '700',
    background: 'rgba(255,255,255,0.15)',
    padding: '6px 16px',
    borderRadius: '20px',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    whiteSpace: 'nowrap',
    transform: isMobile ? 'none' : 'translateX(8px)' // move up on mobile
  }}>
    Dr. Praveen Ramachandra
  </span>
</div>
            {/* Photo */}
            <img
              src={doctorImg}
              alt="Dr. Praveen Ramachandra"
              style={{
                width: '100%',
                height: '88%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
              }}
            />

          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div ref={rightRef} style={{ opacity: 0, transform: 'translateX(32px)', transition: 'all 0.7s ease' }}>
          <div className="section-tag">ABOUT THE DOCTOR</div>

          <h2 className="section-h2">
            Meet <em>Dr. Praveen</em><br/>Ramachandra
          </h2>

          <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.8', marginBottom: '22px' }}>
            {DOCTOR.bio}
          </p>

          {/* EDUCATION */}
          <div style={{ marginBottom: '24px' }}>
            {EDUCATION.map((e, i) => (
              <div key={i} style={{
                display: 'flex', gap: '14px', alignItems: 'center',
                padding: '10px 14px', borderRadius: '12px',
                background: '#fff', border: '1px solid #E2EEEC',
                marginBottom: '8px',
              }}>
                <div style={{
                  width: '30px', height: '30px', minWidth: '30px',
                  borderRadius: '50%', background: '#0B7B6F',
                  color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '13px', fontWeight: '700',
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#0A1628' }}>{e.degree}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{e.inst}</div>
                </div>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/about" className="btn-primary">Learn More →</Link>
            <a
              href="https://youtube.com/@diaplusclinicbengaluru?si=ODRzapyBvtIvPOxX"
              target="_blank" rel="noreferrer"
              style={{
                padding: '10px 16px', borderRadius: '10px',
                border: '1px solid #E2EEEC', fontSize: '14px',
                fontWeight: '500', color: '#0B7B6F',
                textDecoration: 'none', display: 'flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              ▶ Watch Videos
            </a>
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <style>{`
        @media (max-width: 900px) {

          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }

          .about-grid > div:first-child {
            padding: 0 !important;
          }

          .about-grid > div:first-child > div {
            aspect-ratio: 1/1 !important;
            border-radius: 20px 20px 0 0 !important;
          }

          .about-grid > div:last-child {
            background: white !important;
            border-radius: 0 0 20px 20px !important;
            padding: 22px 18px 26px !important;
            box-shadow: 0 16px 40px rgba(10,22,40,0.10) !important;
          }

          .about-grid .section-h2 {
            font-size: 21px !important;
            margin: 6px 0 10px !important;
            line-height: 1.3 !important;
          }

          .about-grid p {
            font-size: 13px !important;
            line-height: 1.7 !important;
            margin-bottom: 14px !important;
          }

          .about-grid > div:last-child > div:last-child {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .about-grid a {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </section>
  )
}