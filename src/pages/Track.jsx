import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { DOCTOR } from '../data/content'
import { apiRequest } from '../utils/api'

export default function Track() {
  const params = new URLSearchParams(window.location.search)
  const [phone, setPhone] = useState(params.get('phone') || '')
  const [data, setData]   = useState(null)
  const [ahead, setAhead] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Queue status from backend
  const [queueStatus, setQueueStatus] = useState(null)
  const [queueLoading, setQueueLoading] = useState(false)

  /**
   * Fetch queue status from backend API
   */
  async function fetchQueueStatus() {
    try {
      setQueueLoading(true)
      const result = await apiRequest('/queue')
      
      if (result.data) {
        setQueueStatus(result.data)
      }
    } catch (err) {
      console.error('[QUEUE STATUS ERROR]', err)
    } finally {
      setQueueLoading(false)
    }
  }

  async function track(ph) {
    const p = ph || phone
    if (!p || p.length < 10) { setError('Enter a valid phone number'); return }
    setLoading(true); setError(''); setData(null)
    try {
      const today = new Date().toDateString()
      const q = query(collection(db, 'patients'), where('phone', '==', p), where('date', '==', today))
      const snap = await getDocs(q)
      if (snap.empty) { setError('No token found for this number today. Please book a token first.'); setLoading(false); return }
      const patient = { id: snap.docs[0].id, ...snap.docs[0].data() }

      // Count waiting patients ahead
      const qAhead = query(collection(db, 'patients'), where('clinicId', '==', patient.clinicId), where('date', '==', today), where('status', '==', 'waiting'))
      const snapAhead = await getDocs(qAhead)
      const waitingAhead = snapAhead.docs.filter(d => d.data().tokenNumber < patient.tokenNumber).length
      setAhead(waitingAhead)
      setData(patient)
      
      // Fetch queue status from backend
      await fetchQueueStatus()
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  useEffect(() => { 
    if (params.get('phone')) track(params.get('phone'))
    // Fetch queue status on mount
    fetchQueueStatus()
  }, [])

  useEffect(() => {
    if (!data) return
    const t = setInterval(() => track(phone), 30000)
    return () => clearInterval(t)
  }, [data])

  const statusColor = { waiting: '#F59E0B', serving: '#0B7B6F', done: '#64748B' }
  const statusLabel = { waiting: '⏳ Waiting', serving: ' Being Served', done: ' Done' }
  const estWait = ahead * 10

  return (
    <>
      <Helmet><title>Track Token | {DOCTOR.name}</title></Helmet>
      <div style={{ paddingTop: '72px', minHeight: '100vh', background: '#F8FAFA' }}>
        <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2040)', padding: '60px 5%', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: '700', color: '#fff' }}>
            Track Your <em style={{ fontStyle: 'italic', color: '#0FA898' }}>Queue Position</em>
          </h1>
        </div>

        <div style={{ maxWidth: '480px', margin: '48px auto', padding: '0 5%' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px rgba(11,123,111,0.08)', border: '1px solid #E2EEEC' }}>

            {!data ? (
              <>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '26px', fontWeight: '700', color: '#0A1628', marginBottom: '8px' }}>Enter Your Phone</h2>
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Use the phone number you registered with</p>
                <input type="tel" placeholder="10-digit mobile number" value={phone} maxLength={10}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && track()}
                  style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E2EEEC', borderRadius: '10px', fontSize: '15px', fontFamily: "'DM Sans',sans-serif", outline: 'none', marginBottom: '16px' }}
                  onFocus={e => e.target.style.borderColor = '#0B7B6F'}
                  onBlur={e => e.target.style.borderColor = '#E2EEEC'}
                />
                {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>⚠️ {error}</p>}
                <button onClick={() => track()} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px', opacity: loading ? 0.7 : 1 }}>
                  {loading ? ' Searching...' : ' Track My Token'}
                </button>
              </>
            ) : (
              <>
                {/* Token card */}
                <div style={{ background: 'linear-gradient(135deg,#0B7B6F,#096358)', borderRadius: '18px', padding: '28px', textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Your Token</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '72px', fontWeight: '800', color: '#fff', lineHeight: '1' }}>#{String(data.tokenNumber).padStart(2,'0')}</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '8px' }}>{data.clinicId === 'diaplus' ? 'Diaplus Endocrinology Clinic' : 'Thyroplus Endocrinology Clinic'}</div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#F8FAFA', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #E2EEEC' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#0B7B6F' }}>{ahead}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Patients Ahead</div>
                  </div>
                  <div style={{ background: '#F8FAFA', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #E2EEEC' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#0B7B6F' }}>{estWait}m</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Est. Wait</div>
                  </div>
                </div>

                {/* Status */}
                <div style={{ background: '#F8FAFA', borderRadius: '12px', padding: '16px', border: '1px solid #E2EEEC', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Status</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: statusColor[data.status] || '#0B7B6F' }}>{statusLabel[data.status] || '⏳ Waiting'}</span>
                  </div>
                  <div style={{ height: '8px', background: '#E2EEEC', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg,#0B7B6F,#0FA898)', borderRadius: '4px', width: data.status === 'done' ? '100%' : data.status === 'serving' ? '80%' : `${Math.max(10, 100 - (ahead * 15))}%`, transition: 'width 0.5s ease' }}/>
                  </div>
                </div>

                {/* Patient */}
                <div style={{ background: '#F8FAFA', borderRadius: '12px', padding: '16px', border: '1px solid #E2EEEC', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Patient</div>
                  <div style={{ fontWeight: '700', color: '#0A1628' }}>{data.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{data.reason}</div>
                </div>

                <p style={{ fontSize: '11px', color: '#64748B', textAlign: 'center', marginBottom: '16px' }}> Auto-refreshes every 30 seconds</p>
                <button onClick={() => { setData(null); setPhone(''); }} style={{ width: '100%', background: 'none', border: '1.5px solid #E2EEEC', borderRadius: '10px', padding: '12px', color: '#64748B', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Track Different Token</button>
              </>
            )}
          </div>

          {/* Queue Status from Backend */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px rgba(11,123,111,0.08)', border: '1px solid #E2EEEC', marginTop: '24px' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '22px', fontWeight: '700', color: '#0A1628', marginBottom: '20px', textAlign: 'center' }}>Live Queue Status</h3>
            
            {queueLoading ? (
              <div style={{ textAlign: 'center', padding: '28px', color: '#64748B' }}>
                <div style={{ fontSize: '13px' }}>Loading queue status...</div>
              </div>
            ) : queueStatus ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {/* Current Token */}
                <div style={{ background: 'linear-gradient(135deg,#0B7B6F,#096358)', borderRadius: '14px', padding: '16px', textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Now Serving</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '32px', fontWeight: '800', lineHeight: '1' }}>#{String(queueStatus.currentToken).padStart(2,'0')}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Current Token</div>
                </div>

                {/* Waiting Patients */}
                <div style={{ background: '#F8FAFA', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #E2EEEC' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>In Queue</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#F59E0B', lineHeight: '1' }}>{queueStatus.waiting}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>Patients Waiting</div>
                </div>

                {/* Estimated Time */}
                <div style={{ background: '#F8FAFA', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #E2EEEC' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Est. Wait</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#0B7B6F', lineHeight: '1' }}>{queueStatus.estimatedTime}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>Approximate</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '28px', color: '#64748B' }}>
                <div style={{ fontSize: '13px' }}>Unable to fetch queue status</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}