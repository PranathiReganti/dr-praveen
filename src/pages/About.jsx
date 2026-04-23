import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { DOCTOR, EDUCATION } from '../data/content'

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
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'start' }}>

            {/* Photo */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ borderRadius: '24px', aspectRatio: '3/4', background: 'linear-gradient(135deg,#E6F4F2,#B2DDD8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', overflow: 'hidden' }}>
                {DOCTOR.photo ? <img src={DOCTOR.photo} alt={DOCTOR.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <span>‍⚕️</span>}
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
    </>
  )
}