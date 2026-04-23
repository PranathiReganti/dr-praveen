import { Link } from 'react-router-dom'
import { BLOG_POSTS } from '../data/content'

export default function BlogPreview() {
  return (
    <section style={{ padding: '60px 5% 80px', marginTop: '-40px', background: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="section-tag">HEALTH INSIGHTS</div>
          <h2 className="section-h2">
            Learn From <em>Dr. Praveen</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: '26px'
        }}>
          {BLOG_POSTS.map((b) => {
            const Icon = b.icon

            return (
              <Link key={b.id} to="/blog" style={{ textDecoration: 'none' }}>
                <div style={{
                  border: '1px solid #E2EEEC',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '190px',
                    background: 'linear-gradient(135deg,#E6F4F2,#B2DDD8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* ✅ FIXED ICON */}
                    <Icon size={28} color="#0B7B6F" />
                  </div>

                  <div style={{ padding: '22px' }}>
                    <div style={{ fontWeight: '700' }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>
                      {b.desc}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/blog" className="btn-secondary">
            View All Health Articles →
          </Link>
        </div>

      </div>
    </section>
  )
}