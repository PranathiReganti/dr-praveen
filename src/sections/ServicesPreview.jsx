import { Link } from 'react-router-dom'
import { useState } from 'react'
import { SERVICES } from '../data/content'

const TABS = ['All','diabetes','thyroid','hormones','pediatric','bone']

export default function ServicesPreview() {
  const [tab, setTab] = useState('All')

  const filtered =
    tab === 'All'
      ? SERVICES.slice(0,6)
      : SERVICES.filter(s => s.cat === tab).slice(0,6)

  return (
    <section style={{ padding: '80px 5%', background: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            CONDITIONS WE TREAT
          </div>
          <h2 className="section-h2">
            Comprehensive <em>Endocrinology Care</em>
          </h2>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '40px'
        }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '18px'
        }}>
          {filtered.map((s) => {
            const Icon = s.icon

            return (
              <div key={s.name} style={{
                border: '1px solid #E2EEEC',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: '#E6F4F2',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} color="#0B7B6F" />
                </div>

                <div style={{ fontWeight: '700', fontSize: '15px' }}>
                  {s.name}
                </div>

                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  {s.desc}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/services">View All →</Link>
        </div>

      </div>
    </section>
  )
}