import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'

const STEPS = [
  { n: '1', title: 'Enter Your Details',    desc: 'Name, phone, choose doctor and reason for visit.' },
  { n: '2', title: 'Receive SMS Token',     desc: 'Get token number and live tracking link on your phone.' },
  { n: '3', title: 'Track Your Position',  desc: 'See position, patients ahead and wait time in real time.' },
  { n: '4', title: 'Walk In When Ready',   desc: 'Arrive exactly when your turn is near. Zero waiting room stress.' },
]

export default function QueuePreview() {
  const [queueData, setQueueData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchQueueData()
    // Refresh queue data every 30 seconds
    const interval = setInterval(fetchQueueData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchQueueData() {
    try {
      setLoading(true)
      const response = await apiFetch('/api/queue')
      const result = await response.json()
      
      if (response.ok && result.data) {
        setQueueData(result.data)
        setError(false)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('[QUEUE DATA ERROR]', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ padding: '60px 5%', background: '#fff' }} id="queue">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '70px', alignItems: 'center' }}>

        {/* Left */}
        <div>
          <div className="section-tag">SMART QUEUE SYSTEM</div>
          <h2 className="section-h2">Skip the Wait —<br/><em>Book Your Token Online</em></h2>
          <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.75', marginBottom: '20px' }}>
            Walk in at the right time. No more crowding at reception. Get your token via SMS and track your live position from any phone — no app download needed.
          </p>

          {/* Steps */}
          <div style={{ marginBottom: '20px' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '28px', position: 'relative' }}>
                {i < STEPS.length - 1 && <div style={{ position: 'absolute', left: '17px', top: '38px', bottom: 0, width: '2px', background: 'linear-gradient(180deg,#B2DDD8,transparent)' }}/>}
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#0B7B6F,#096358)', color: '#fff', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0A1628', marginBottom: '3px' }}>{s.title}</div>
                  <div style={{ fontSize: '12.5px', color: '#64748B', lineHeight: '1.55' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/queue" className="btn-primary">🎫 Get My Token Now</Link>
        </div>

        {/* Right — Phone mockup with live data */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '264px', borderRadius: '38px', background: '#0A1628', padding: '16px', boxShadow: '0 32px 80px rgba(10,22,40,0.35)' }}>
            <div style={{ width: '80px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', margin: '0 auto 16px' }}/>
            <div style={{ background: '#111827', borderRadius: '24px', padding: '20px', overflow: 'hidden' }}>
              {loading ? (
                <div style={{ background: '#1F2937', borderRadius: '10px', padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Loading queue...</div>
              ) : error || !queueData ? (
                <div style={{ background: '#1F2937', borderRadius: '10px', padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Queue status unavailable</div>
              ) : (
                <>
                  {/* Token card */}
                  <div style={{ background: 'linear-gradient(135deg,#0B7B6F,#096358)', borderRadius: '16px', padding: '22px', textAlign: 'center', marginBottom: '14px' }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.65)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Now Serving</div>
                    <div style={{ fontSize: '52px', fontWeight: '800', color: '#fff', fontFamily: "'Cormorant Garamond',serif", lineHeight: '1' }}>#{String(queueData.currentToken).padStart(2,'0')}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>Diaplus Clinic</div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ background: '#1F2937', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: '#0FA898' }}>{queueData.waiting}</div>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>In Queue</div>
                    </div>
                    <div style={{ background: '#1F2937', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: '#0FA898' }}>{queueData.estimatedTime}</div>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Est. Wait</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ background: '#1F2937', borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '7px' }}>Queue Progress</div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: '65%', background: 'linear-gradient(90deg,#0B7B6F,#0FA898)', borderRadius: '3px' }}/>
                    </div>
                  </div>

                  {/* Doctor */}
                  <div style={{ background: '#1F2937', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#0B7B6F,#096358)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>PR</div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#fff', fontWeight: '600' }}>Dr. Praveen Ramachandra</div>
                      <div style={{ fontSize: '9px', color: '#0FA898', marginTop: '1px' }}>● Online Now</div>
                    </div>
                  </div>

                  {/* Live indicator */}
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '12px' }}>🔄 Updates every 30 seconds</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}