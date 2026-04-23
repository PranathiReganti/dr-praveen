import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { CLINICS } from '../data/content'

const REASONS = ['Diabetes Checkup','Thyroid Consultation','Hormone Imbalance','Obesity/Weight','PCOS / PCOD','Gestational Diabetes','Pediatric Endocrinology','Osteoporosis','Adrenal Disorder','Pituitary Disorder','General Consultation','Other']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [patients, setPatients]     = useState([])
  const [clinicId, setClinicId]     = useState('diaplus')
  const [showAdd, setShowAdd]       = useState(false)
  const [form, setForm]             = useState({ name: '', phone: '', reason: '' })
  const [adding, setAdding]         = useState(false)

  useEffect(() => {
    if (localStorage.getItem('drp_role') !== 'admin') navigate('/login')
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const q = query(collection(db, 'patients'), where('clinicId', '==', clinicId), where('date', '==', today))
    return onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a,b) => a.tokenNumber - b.tokenNumber)
      setPatients(list)
    })
  }, [clinicId])

  const waiting   = patients.filter(p => p.status === 'waiting')
  const serving   = patients.find(p => p.status === 'serving')
  const completed = patients.filter(p => p.status === 'done')
  const revenue   = completed.length * 500

  async function addPatient() {
    if (!form.name || !form.phone || !form.reason) return
    setAdding(true)
    const today = new Date().toDateString()
    const tokenNum = patients.length + 1
    await addDoc(collection(db, 'patients'), {
      ...form, clinicId, doctor: 'Dr. Praveen Ramachandra',
      tokenNumber: tokenNum, status: 'waiting',
      date: today, createdAt: Timestamp.now(),
      payment: false, consultationFee: 500,
    })
    setForm({ name:'', phone:'', reason:'' })
    setShowAdd(false)
    setAdding(false)
  }

  async function callNext() {
    if (serving) await updateDoc(doc(db, 'patients', serving.id), { status: 'done' })
    if (waiting.length > 0) await updateDoc(doc(db, 'patients', waiting[0].id), { status: 'serving', servedAt: Timestamp.now() })
  }

  async function markDone() {
    if (serving) await updateDoc(doc(db, 'patients', serving.id), { status: 'done', doneAt: Timestamp.now() })
  }

  async function removePatient(id) {
    await updateDoc(doc(db, 'patients', id), { status: 'removed' })
  }

  function logout() { localStorage.removeItem('drp_role'); navigate('/login') }

  const S = { label: { fontSize: '11px', fontWeight: '700', color: '#0B7B6F', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '8px' } }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFA', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#0A1628', padding: '0 5%', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#0B7B6F,#096358)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontWeight: '700', color: '#fff', fontSize: '14px' }}>PR</div>
          <div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Admin Dashboard</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Queue Management</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {CLINICS.map(c => (
            <button key={c.id} onClick={() => setClinicId(c.id)} style={{ padding: '7px 14px', borderRadius: '8px', border: `1.5px solid ${clinicId === c.id ? '#0B7B6F' : 'rgba(255,255,255,0.15)'}`, background: clinicId === c.id ? '#0B7B6F' : 'transparent', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{c.id === 'diaplus' ? 'Diaplus' : 'Thyroplus'}</button>
          ))}
          <button onClick={logout} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}> Logout</button>
        </div>
      </div>

      <div style={{ padding: '28px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Patients', val: patients.filter(p => p.status !== 'removed').length, color: '#0A1628' },
            { label: 'In Queue',       val: waiting.length, color: '#F59E0B' },
            { label: 'Completed Today',val: completed.length, color: '#0B7B6F' },
            { label: 'Revenue Today',  val: `₹${revenue.toLocaleString()}`, color: '#0B7B6F' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #E2EEEC', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{s.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '36px', fontWeight: '700', color: s.color, lineHeight: '1' }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          {/* Left — Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Now serving */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E2EEEC' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>Now Consulting</div>
              {serving ? (
                <div>
                  <div style={{ background: 'linear-gradient(135deg,#E6F4F2,#EFF7F6)', borderRadius: '12px', padding: '16px', marginBottom: '16px', borderLeft: '4px solid #0B7B6F' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0B7B6F', fontFamily: "'Cormorant Garamond',serif" }}>#{String(serving.tokenNumber).padStart(2,'0')}</div>
                    <div style={{ fontWeight: '700', color: '#0A1628', marginTop: '4px' }}>{serving.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{serving.reason}</div>
                  </div>
                  <button onClick={markDone} style={{ width: '100%', background: '#0B7B6F', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}> Mark Complete</button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#64748B', fontSize: '14px', padding: '20px 0' }}>No active consultation</div>
              )}
            </div>

            {/* Call Next */}
            <button onClick={callNext} disabled={waiting.length === 0} style={{ background: waiting.length > 0 ? 'linear-gradient(135deg,#0B7B6F,#096358)' : '#E2EEEC', color: waiting.length > 0 ? '#fff' : '#64748B', border: 'none', borderRadius: '14px', padding: '18px', fontSize: '15px', fontWeight: '700', cursor: waiting.length > 0 ? 'pointer' : 'not-allowed', boxShadow: waiting.length > 0 ? '0 6px 20px rgba(11,123,111,0.3)' : 'none', fontFamily: "'DM Sans',sans-serif" }}>
              ▶ Call Next Patient
            </button>

            {/* Add Patient */}
            <button onClick={() => setShowAdd(!showAdd)} style={{ background: '#fff', color: '#0B7B6F', border: '1.5px solid #B2DDD8', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
              {showAdd ? ' Cancel' : '+ Add Patient Manually'}
            </button>

            {showAdd && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E2EEEC' }}>
                {[
                  { label: 'Patient Name', key: 'name', type: 'text', ph: 'Full name' },
                  { label: 'Phone Number', key: 'phone', type: 'tel', ph: '10-digit number' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '16px' }}>
                    <label style={S.label}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))} maxLength={f.key === 'phone' ? 10 : undefined}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2EEEC', borderRadius: '9px', fontSize: '14px', fontFamily: "'DM Sans',sans-serif", outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#0B7B6F'}
                      onBlur={e => e.target.style.borderColor = '#E2EEEC'}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: '16px' }}>
                  <label style={S.label}>Reason</label>
                  <select value={form.reason} onChange={e => setForm(p => ({...p, reason: e.target.value}))} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2EEEC', borderRadius: '9px', fontSize: '14px', fontFamily: "'DM Sans',sans-serif", outline: 'none', background: '#fff' }}>
                    <option value="">Select reason...</option>
                    {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button
                onClick={addPatient}
                disabled={adding}
                style={{
                width: '100%',
                background: '#0B7B6F',
                color: '#fff',
                border: 'none',
                borderRadius: '9px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                opacity: adding ? 0.7 : 1
  }}
>
  {adding ? 'Adding...' : ' Add to Queue'}
</button>
</div>
)}
          </div>

          {/* Right — Patient list */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2EEEC', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2EEEC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '700', color: '#0A1628' }}>Queue Management</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>{waiting.length} waiting · {completed.length} done</div>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {patients.filter(p => p.status !== 'removed').length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>No patients yet today</div>
              ) : patients.filter(p => p.status !== 'removed').map(p => (
                <div key={p.id} style={{ padding: '16px 24px', borderBottom: '1px solid #E2EEEC', display: 'flex', alignItems: 'center', gap: '16px', background: p.status === 'serving' ? '#E6F4F2' : '#fff' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: p.status === 'serving' ? 'linear-gradient(135deg,#0B7B6F,#096358)' : p.status === 'done' ? '#E2EEEC' : '#E6F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: p.status === 'serving' ? '#fff' : '#0B7B6F', fontSize: '14px', flexShrink: 0 }}>
                    {String(p.tokenNumber).padStart(2,'0')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#0A1628', fontSize: '14px' }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{p.reason} · {p.phone}</div>
                  </div>
                  <span style={{
                    padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                    background: p.status === 'serving' ? '#0B7B6F' : p.status === 'done' ? '#E2EEEC' : '#FEF3C7',
                    color: p.status === 'serving' ? '#fff' : p.status === 'done' ? '#64748B' : '#92400E',
                  }}>
                    {p.status === 'serving' ? ' Serving' : p.status === 'done' ? ' Done' : '⏳ Waiting'}
                  </span>
                  {p.status === 'waiting' && (
                    <button onClick={() => removePatient(p.id)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '16px', padding: '4px' }} title="Remove"></button>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #E2EEEC', background: '#F8FAFA', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[
                { label: 'Avg Wait', val: waiting.length > 0 ? `${waiting.length * 10}m` : '0m' },
                { label: 'Completion Rate', val: patients.length > 0 ? `${Math.round((completed.length / patients.filter(p => p.status !== 'removed').length) * 100)}%` : '0%' },
                { label: 'Revenue', val: `₹${revenue.toLocaleString()}` },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B7B6F' }}>{s.val}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
  