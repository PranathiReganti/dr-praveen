import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { DOCTOR, CLINICS, WHATSAPP_MSG } from '../data/content'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  function submit(e) {
    e.preventDefault()
    const msg = encodeURIComponent(`Hi Dr. Praveen! My name is ${form.name}. Phone: ${form.phone}. Message: ${form.message}`)
    window.open(`https://wa.me/${DOCTOR.whatsapp}?text=${msg}`, '_blank')
    setSent(true)
  }

  return (
    <>
      <Helmet><title>Contact | {DOCTOR.name}</title></Helmet>
      <div style={{ paddingTop: '72px' }}>
        <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2040)', padding: '80px 5%', textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center', color: '#0FA898' }}>GET IN TOUCH</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: '700', color: '#fff' }}>
            Contact <em style={{ fontStyle: 'italic', color: '#0FA898' }}>DiaPlus Clinic</em>
          </h1>
        </div>

        <section style={{ padding: '80px 5%', background: '#fff' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>

            {/* Left — Details */}
            <div>
              <h2 className="section-h2" style={{ marginBottom: '32px' }}>Visit <em>Us Today</em></h2>
              {CLINICS.map(c => (
                <div key={c.id} style={{ background: '#F8FAFA', borderRadius: '16px', padding: '24px', border: '1px solid #E2EEEC', marginBottom: '20px' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '18px', fontWeight: '700', color: '#0A1628', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E2EEEC' }}>{c.name}</div>
                  {[['', c.address], ['', c.landmark], ['', c.timings.join(' · ')], ['', c.days]].map(([icon, text]) => (
                    <div key={text} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: '#64748B' }}>
                      <span style={{ flexShrink: 0 }}>{icon}</span><span>{text}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                <a href={`tel:${DOCTOR.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#E6F4F2', color: '#0B7B6F', padding: '14px 20px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}> Call {DOCTOR.phone}</a>
                <a href={`https://wa.me/${DOCTOR.whatsapp}?text=${WHATSAPP_MSG}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#25D366', color: '#fff', padding: '14px 20px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}> WhatsApp Us</a>
                <a href={`mailto:${DOCTOR.email}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFA', color: '#0A1628', padding: '14px 20px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', border: '1px solid #E2EEEC' }}> {DOCTOR.email}</a>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <h2 className="section-h2" style={{ marginBottom: '32px' }}>Send a <em>Message</em></h2>
              {sent ? (
                <div style={{ background: '#E6F4F2', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #B2DDD8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}></div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '24px', fontWeight: '700', color: '#0A1628', marginBottom: '8px' }}>Message Sent!</div>
                  <p style={{ color: '#64748B' }}>Your message has been sent via WhatsApp. Dr. Praveen's team will respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                    { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B7B6F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))} required
                        style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #E2EEEC', borderRadius: '10px', fontSize: '14px', fontFamily: "'DM Sans',sans-serif", outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = '#0B7B6F'}
                        onBlur={e => e.target.style.borderColor = '#E2EEEC'}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B7B6F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Message</label>
                    <textarea placeholder="Tell us about your condition or query..." value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} rows={5} required
                      style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #E2EEEC', borderRadius: '10px', fontSize: '14px', fontFamily: "'DM Sans',sans-serif", outline: 'none', resize: 'vertical', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#0B7B6F'}
                      onBlur={e => e.target.style.borderColor = '#E2EEEC'}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '15px' }}>
                     Send via WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}