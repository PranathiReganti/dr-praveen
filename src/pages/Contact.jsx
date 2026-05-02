import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { DOCTOR, CLINICS, WHATSAPP_MSG } from '../data/content'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  function submit(e) {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Hi Dr. Praveen! My name is ${form.name}. Phone: ${form.phone}. Message: ${form.message}`
    )
    window.open(`https://wa.me/${DOCTOR.whatsapp}?text=${msg}`, '_blank')
    setSent(true)
  }

  return (
    <>
      <Helmet>
        <title>Contact | {DOCTOR.name}</title>
      </Helmet>

      <div style={{ paddingTop: '72px' }}>

        {/* HEADER */}
        <div style={{
          background: 'linear-gradient(135deg,#0A1628,#0F2040)',
          padding: '80px 5%',
          textAlign: 'center'
        }}>
          <div className="section-tag" style={{ justifyContent: 'center', color: '#0FA898' }}>
            GET IN TOUCH
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(36px,5vw,60px)',
            fontWeight: '700',
            color: '#fff'
          }}>
            Contact <em style={{ fontStyle: 'italic', color: '#0FA898' }}>DiaPlus Clinic</em>
          </h1>
        </div>

        {/* MAIN */}
        <section style={{ padding: '80px 5%', background: '#fff' }}>
          <div className="contact-grid" style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px'
          }}>

            {/* LEFT SIDE */}
            <div>
              <h2 className="section-h2" style={{ marginBottom: '32px' }}>
                Visit <em>Us Today</em>
              </h2>

              {CLINICS.map(c => (
                <div key={c.id} style={{
                  background: '#F8FAFA',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #E2EEEC',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#0A1628',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #E2EEEC'
                  }}>
                    {c.name}
                  </div>

                  {/* Address row */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px' }}></span>
                    <span style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{c.address}</span>
                  </div>

                  {/* Landmark */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px' }}></span>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>{c.landmark}</span>
                  </div>

                  {/* Timings */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px' }}></span>
                    <span style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{c.timings.join(' · ')}</span>
                  </div>

                  {/* Days */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px' }}></span>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>{c.days}</span>
                  </div>
                </div>
              ))}

              {/* CONTACT BUTTONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                <a
                  href={`tel:${DOCTOR.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#E6F4F2',
                    color: '#0B7B6F',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                   Call {DOCTOR.phone}
                </a>

                <a
                  href={`https://wa.me/${DOCTOR.whatsapp}?text=${WHATSAPP_MSG}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #0B7B6F, #0FA898)',
                    color: '#fff',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: '0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #09665d, #0c8f82)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, #0B7B6F, #0FA898)'}
                >
                   WhatsApp Us
                </a>

                <a
                  href={`mailto:${DOCTOR.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#F8FAFA',
                    color: '#0A1628',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: '1px solid #E2EEEC'
                  }}
                >
                   {DOCTOR.email}
                </a>
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div>
              <h2 className="section-h2" style={{ marginBottom: '32px' }}>
                Send a <em>Message</em>
              </h2>

              {sent ? (
                <div style={{
                  background: '#E6F4F2',
                  borderRadius: '16px',
                  padding: '40px',
                  textAlign: 'center',
                  border: '1px solid #B2DDD8'
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#0A1628',
                    marginBottom: '8px'
                  }}>
                    Message Sent!
                  </div>
                  <p style={{ color: '#64748B' }}>Your message has been sent via WhatsApp.</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  {[
                    { label: 'Full Name', key: 'name', type: 'text' },
                    { label: 'Phone Number', key: 'phone', type: 'tel' }
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#0B7B6F',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        required
                        style={{
                          width: '100%',
                          padding: '13px 16px',
                          border: '1.5px solid #E2EEEC',
                          borderRadius: '10px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          background: '#F8FAFA',
                          color: '#0A1628'
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0B7B6F',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Your Message
                    </label>
                    <textarea
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      rows={5}
                      required
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        border: '1.5px solid #E2EEEC',
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#F8FAFA',
                        color: '#0A1628',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0B7B6F, #0FA898)',
                      color: '#fff',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '15px',
                      cursor: 'pointer'
                    }}
                  >
                     Send via WhatsApp
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      </div>

      {/* ── MOBILE ONLY ── */}
      <style>{`
        @media (max-width: 768px) {

          /* Stack columns */
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            padding: 0 !important;
          }

          /* Reduce section padding on mobile */
          .contact-grid > div {
            padding-bottom: 8px !important;
          }

          /* Headings */
          .contact-grid .section-h2 {
            font-size: 22px !important;
            margin-bottom: 20px !important;
          }

          /* Clinic cards: tighter */
          .contact-grid > div:first-child > div[style*="background: #F8FAFA"] {
            padding: 16px !important;
            margin-bottom: 12px !important;
            border-radius: 14px !important;
          }

          /* Clinic name */
          .contact-grid > div:first-child > div[style*="background: #F8FAFA"] > div:first-child {
            font-size: 16px !important;
            margin-bottom: 12px !important;
            padding-bottom: 10px !important;
          }

          /* Contact buttons row: side by side for call + whatsapp */
          .contact-grid > div:first-child > div[style*="flexDirection: column"] {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }

          /* Email button: full width */
          .contact-grid > div:first-child > div[style*="flexDirection: column"] > a:last-child {
            grid-column: 1 / -1 !important;
          }

          .contact-grid > div:first-child > div[style*="flexDirection: column"] > a {
            font-size: 13px !important;
            padding: 12px 10px !important;
            justify-content: center !important;
            text-align: center !important;
          }

          /* Divider between left and right on mobile */
          .contact-grid > div:last-child {
            padding-top: 32px !important;
            border-top: 1px solid #E2EEEC !important;
            margin-top: 24px !important;
          }

          /* Form inputs full width */
          .contact-grid input,
          .contact-grid textarea {
            font-size: 16px !important; /* prevents iOS zoom */
            width: 100% !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </>
  )
}