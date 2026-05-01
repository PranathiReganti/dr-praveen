import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { DOCTOR, EDUCATION } from '../data/content'
import doctorImg from "../assets/images/doctor.jpg";

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

        {/* LEFT IMAGE */}
        <div ref={leftRef} style={{ opacity: 0, transform: 'translateX(-32px)', transition: 'all 0.7s ease' }}>
          <div style={{
            borderRadius: '24px',
            aspectRatio: '3/4',
            background: 'linear-gradient(135deg,#E6F4F2,#B2DDD8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={doctorImg} 
              alt="Doctor" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }}
            />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div ref={rightRef} style={{ opacity: 0, transform: 'translateX(32px)', transition: 'all 0.7s ease' }}>
          <div className="section-tag">ABOUT THE DOCTOR</div>

          <h2 className="section-h2">
            Meet <em>Dr. Praveen</em><br/>Ramachandra
          </h2>

          <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.8', marginBottom: '28px' }}>
            {DOCTOR.bio}
          </p>

          {/* EDUCATION */}
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

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/about" className="btn-primary">
              Learn More →
            </Link>

            <a
              href="https://youtube.com/@diaplusclinicbengaluru?si=ODRzapyBvtIvPOxX"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #E2EEEC",
                fontSize: "14px",
                fontWeight: "500",
                color: "#0B7B6F",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              ▶ Watch Videos
            </a>
          </div>

        </div>
      </div>

      <style>{`
  @media (max-width: 900px) {

    .about-grid {
      grid-template-columns: 1fr !important;
      gap: 0px !important;
    }

    /* ── IMAGE CARD ── */
    .about-grid > div:first-child {
      background: white !important;
      border-radius: 20px 20px 0 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      overflow: hidden;
    }

    /* Remove the gradient wrapper on mobile, let the photo breathe */
    .about-grid > div:first-child > div {
      aspect-ratio: 4/3 !important;
      border-radius: 20px 20px 0 0 !important;
      background: linear-gradient(180deg, #0B7B6F 0%, #E6F4F2 100%) !important;
      position: relative;
    }

    /* ✅ FIXED: Doctor name ABOVE image (no overlap) */
    .about-grid > div:first-child::before {
      content: "Dr. Praveen Ramachandra";
      display: block;
      text-align: center;

      white-space: nowrap;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(11,123,111,0.15);
      border-radius: 100px;
      padding: 6px 18px;

      font-size: 13px;
      font-weight: 700;
      color: #0A1628;

      margin: 14px auto 10px;
      width: fit-content;
    }

    /* Photo */
    .about-grid img {
      height: 100% !important;
      width: 55% !important;
      object-fit: cover !important;
      object-position: top center !important;
      border-radius: 0 !important;
      display: block;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    /* ── CONTENT CARD ── */
    .about-grid > div:last-child {
      background: white !important;
      border-radius: 0 0 20px 20px !important;
      padding: 24px 20px 28px !important;
      box-shadow: 0 12px 32px rgba(10,22,40,0.10) !important;
    }

    /* Heading */
    .section-h2 {
      font-size: 22px !important;
      margin: 6px 0 10px !important;
      line-height: 1.3 !important;
    }

    /* Bio text */
    .about-grid p {
      font-size: 13px !important;
      line-height: 1.7 !important;
      margin-bottom: 20px !important;
      color: #64748B !important;
    }

    /* ── EDUCATION ── */
    .about-grid > div:last-child > div:nth-child(4) {
      margin-bottom: 22px !important;
    }

    .about-grid > div:last-child > div:nth-child(4) > div {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      padding: 10px 14px !important;
      border-radius: 12px !important;
      background: #F4FAFA !important;
      border: 1px solid #E2EEEC !important;
      margin-bottom: 8px !important;
      padding-bottom: 10px !important;
    }

    .about-grid > div:last-child > div:nth-child(4) > div > div:first-child {
      width: 28px !important;
      height: 28px !important;
      min-width: 28px !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      border-radius: 50% !important;
      background: #0B7B6F !important;
      color: white !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .about-grid > div:last-child > div:nth-child(4) > div > div:last-child > div:first-child {
      font-size: 13px !important;
      font-weight: 700 !important;
      color: #0A1628 !important;
    }

    .about-grid > div:last-child > div:nth-child(4) > div > div:last-child > div:last-child {
      font-size: 11px !important;
      color: #94A3B8 !important;
      margin-top: 1px !important;
    }

    /* ── BUTTONS ── */
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

    .about-grid .btn-primary {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
  }
`}</style>
    </section>
  )
}