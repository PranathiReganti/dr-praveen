import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { DOCTOR, EDUCATION } from '../data/content'
import doctorImg from "../assets/images/doctor.jpg";

export default function About() {
  return (
    <>
      <Helmet><title>About {DOCTOR.name} | Endocrinologist Bengaluru</title></Helmet>
      <div style={{ paddingTop: '72px' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2040)', padding: '80px 5%', textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center', color: '#0FA898' }}>ABOUT THE DOCTOR</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
            {DOCTOR.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>{DOCTOR.title}</p>
        </div>

        {/* Main */}
        <section style={{ padding: '80px 5%', background: '#fff' }}>
          <div className="about-page-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'start' }}>

            {/* Photo + Contact */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ borderRadius: '24px', aspectRatio: '3/4', background: 'linear-gradient(135deg,#E6F4F2,#B2DDD8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', overflow: 'hidden' }}>
                {DOCTOR.photo ? <img src={doctorImg} alt="Dr Praveen" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <span>‍⚕️</span>}
              </div>
              <div style={{ marginTop: '20px', background: '#F8FAFA', borderRadius: '16px', padding: '20px', border: '1px solid #E2EEEC' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0B7B6F', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Contact</div>
                {[['', DOCTOR.phone], ['', DOCTOR.email], ['', 'Yelahanka New Town, Bengaluru']].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#64748B' }}>
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
                <Link to="/queue" className="btn-primary" style={{ display: 'flex', marginTop: '16px', justifyContent: 'center' }}>Book Appointment</Link>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="section-h2" style={{ marginBottom: '20px' }}>About <em>Dr. Praveen</em></h2>
              <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.85', marginBottom: '32px' }}>{DOCTOR.bio}</p>

              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', fontWeight: '700', color: '#0A1628', marginBottom: '24px' }}>Education & Qualifications</h3>
              {EDUCATION.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '24px', padding: '20px', background: '#F8FAFA', borderRadius: '14px', border: '1px solid #E2EEEC' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#0B7B6F,#096358)', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A1628', marginBottom: '4px' }}>{e.degree}</div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '2px' }}>{e.inst}</div>
                    <span style={{ background: '#E6F4F2', color: '#0B7B6F', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{e.year}</span>
                  </div>
                </div>
              ))}

              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', fontWeight: '700', color: '#0A1628', margin: '32px 0 20px' }}>Areas of Expertise</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Diabetes Management', 'Thyroid Disorders', 'Obesity & Weight', 'PCOS / PCOD', 'Pediatric Endocrinology', 'Adrenal Disorders', 'Pituitary Disorders', 'Osteoporosis', 'Metabolic Syndrome', 'Gestational Diabetes', 'Hormone Imbalance', 'Dyslipidemia'].map(tag => (
                  <span key={tag} style={{ background: '#E6F4F2', border: '1px solid #B2DDD8', color: '#0B7B6F', padding: '7px 16px', borderRadius: '25px', fontSize: '13px', fontWeight: '600' }}>{tag}</span>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ── MOBILE ONLY ── */}
      <style>{`
        @media (max-width: 768px) {

          /* Stack the two columns */
          .about-page-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            padding: 0 !important;
          }

          /* Unstick the photo column */
          .about-page-grid > div:first-child {
            position: static !important;
          }

          /* ── PHOTO: compact landscape card ── */
          .about-page-grid > div:first-child > div:first-child {
            aspect-ratio: 1/1 !important;
            max-width: 180px !important;
            margin: 0 auto 0 !important;
            border-radius: 50% !important;
            border: 4px solid #E6F4F2 !important;
            box-shadow: 0 8px 24px rgba(11,123,111,0.15) !important;
          }

          /* ── CONTACT CARD: clean pill strip ── */
          .about-page-grid > div:first-child > div:last-child {
            margin-top: 16px !important;
            border-radius: 16px !important;
            padding: 18px !important;
            background: #F8FAFA !important;
            border: 1px solid #E2EEEC !important;
          }

          /* Book appointment button */
          .about-page-grid > div:first-child > div:last-child a {
            display: flex !important;
            width: 100% !important;
            box-sizing: border-box !important;
            justify-content: center !important;
          }

          /* ── CONTENT SECTION ── */
          .about-page-grid > div:last-child {
            padding-top: 28px !important;
          }

          /* Bio heading */
          .about-page-grid .section-h2 {
            font-size: 22px !important;
          }

          /* Bio text */
          .about-page-grid p {
            font-size: 14px !important;
            line-height: 1.75 !important;
          }

          /* Section headings (Education, Expertise) */
          .about-page-grid h3 {
            font-size: 20px !important;
          }

          /* ── EDUCATION CARDS: tighter on mobile ── */
          .about-page-grid > div:last-child > div[style*="marginBottom: '24px'"] {
            padding: 14px !important;
            gap: 14px !important;
            margin-bottom: 12px !important;
          }

          /* Number circle */
          .about-page-grid > div:last-child > div[style*="marginBottom: '24px'"] > div:first-child {
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
            font-size: 13px !important;
          }

          /* Degree text */
          .about-page-grid > div:last-child > div[style*="marginBottom: '24px'"] > div:last-child > div:first-child {
            font-size: 14px !important;
          }

          /* ── EXPERTISE TAGS: 2-column grid ── */
          .about-page-grid > div:last-child > div[style*="flexWrap"] {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }

          .about-page-grid > div:last-child > div[style*="flexWrap"] span {
            text-align: center !important;
            font-size: 12px !important;
            padding: 8px 10px !important;
          }
        }
      `}</style>
    </>
  )
}