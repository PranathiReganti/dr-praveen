import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { BLOG_POSTS, DOCTOR } from '../data/content'

export default function Blog() {
  const [open, setOpen] = useState(null)

  return (
    <>
      <Helmet>
        <title>Health Tips | {DOCTOR.name}</title>
      </Helmet>

      <div style={{ paddingTop: '72px' }}>

        {/* HEADER */}
        <div style={{
          background: 'linear-gradient(135deg,#0A1628,#0F2040)',
          padding: '80px 5%',
          textAlign: 'center'
        }}>
          <div className="section-tag" style={{ justifyContent: 'center', color: '#0FA898' }}>
            HEALTH TIPS
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(36px,5vw,60px)',
            fontWeight: '700',
            color: '#fff'
          }}>
            Learn From <em style={{ fontStyle: 'italic', color: '#0FA898' }}>Dr. Praveen</em>
          </h1>
        </div>

        {/* CONTENT */}
        <section style={{ padding: '80px 5%', background: '#fff' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

            {open !== null ? (
              <div>

                <button
                  onClick={() => setOpen(null)}
                  style={{
                    background: '#E6F4F2',
                    border: 'none',
                    color: '#0B7B6F',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginBottom: '32px'
                  }}
                >
                  ← Back to Articles
                </button>

                <div style={{ background: '#F8FAFA', borderRadius: '20px', padding: '48px' }}>

                  {/* ICON */}
                  {(() => {
                    const Icon = BLOG_POSTS[open].icon
                    return (
                      <div style={{
                        height: '160px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={50} color="#0B7B6F" />
                      </div>
                    )
                  })()}

                  <span style={{
                    background: '#0B7B6F',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {BLOG_POSTS[open].cat}
                  </span>

                  <h2 style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '40px',
                    margin: '20px 0'
                  }}>
                    {BLOG_POSTS[open].title}
                  </h2>

                  <p style={{ color: '#64748B' }}>
                    {BLOG_POSTS[open].desc}
                  </p>

                  <p style={{ marginTop: '20px', lineHeight: '1.8' }}>
                    {BLOG_POSTS[open].content}
                  </p>

                  <div style={{ marginTop: '32px' }}>
                    <Link to="/queue" className="btn-primary">
                      Book Consultation →
                    </Link>
                  </div>

                </div>
              </div>
            ) : (

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
                gap: '28px'
              }}>
                {BLOG_POSTS.map((b, i) => {
                  const Icon = b.icon

                  return (
                    <div
                      key={b.id}
                      onClick={() => setOpen(i)}
                      style={{
                        background: '#F8FAFA',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid #E2EEEC',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        height: '200px',
                        background: 'linear-gradient(135deg,#E6F4F2,#B2DDD8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {/* ✅ FIXED ICON */}
                        <Icon size={40} color="#0B7B6F" />

                        <span style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          background: '#0B7B6F',
                          color: '#fff',
                          padding: '5px 14px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {b.cat}
                        </span>
                      </div>

                      <div style={{ padding: '28px' }}>
                        <div style={{ fontWeight: '700', fontSize: '20px' }}>
                          {b.title}
                        </div>

                        <div style={{ fontSize: '13px', color: '#64748B' }}>
                          {b.desc}
                        </div>

                        <div style={{ marginTop: '12px', fontSize: '12px' }}>
                          {b.readTime}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

            )}
          </div>
        </section>
      </div>
    </>
  )
}