import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DOCTOR } from '../data/content'
import { apiFetch } from '../utils/api'

export default function Login() {
  const [role, setRole]       = useState('admin')
  const [pin, setPin]         = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  /**
   * Handle login - send credentials to backend API
   * Uses role as username and PIN as password
   */
  async function handleLogin() {
    try {
      // Reset previous errors
      setError('')
      setLoading(true)

      // Validate input
      if (!pin || pin.length === 0) {
        setError('Please enter your PIN')
        setLoading(false)
        return
      }

      // Send login request to backend
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: role,
          password: pin
        })
      })

      const data = await response.json()

      // Check if login was successful
      if (!response.ok) {
        setError(data.message || 'Invalid credentials. Please try again.')
        setPin('')
        setLoading(false)
        return
      }

      // Store token and role in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('drp_role', role)
        localStorage.setItem('username', role)

        // Redirect to appropriate dashboard
        const dashboardRoute = role === 'admin' ? '/admin' : '/doctor'
        navigate(dashboardRoute)
      } else {
        setError('Login failed. No token received.')
        setPin('')
      }
    } catch (err) {
      console.error('[LOGIN ERROR]', err)
      setError('Network error. Please check your connection and try again.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg,#0B7B6F,#096358)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: '26px', fontWeight: '700', color: '#fff', margin: '0 auto 16px' }}>PR</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '22px', fontWeight: '700', color: '#0A1628' }}>{DOCTOR.name}</div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Staff Login Portal</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(11,123,111,0.08)', border: '1px solid #E2EEEC' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '26px', fontWeight: '700', color: '#0A1628', marginBottom: '24px', textAlign: 'center' }}>Secure Login</h2>

          {/* Role toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
            {['admin','doctor'].map(r => (
              <button key={r} onClick={() => { setRole(r); setPin(''); setError(''); }}
                style={{ padding: '12px', borderRadius: '10px', border: `2px solid ${role === r ? '#0B7B6F' : '#E2EEEC'}`, background: role === r ? '#E6F4F2' : '#fff', color: role === r ? '#0B7B6F' : '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif" }}>
                {r === 'admin' ? ' Receptionist' : '‍⚕️ Doctor'}
              </button>
            ))}
          </div>

          {/* PIN */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B7B6F', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Enter PIN</label>
            <input 
              type="password" 
              value={pin} 
              onChange={e => setPin(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && !loading && handleLogin()}
              placeholder="Enter your 4-digit PIN" 
              maxLength={6}
              disabled={loading}
              style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E2EEEC', borderRadius: '10px', fontSize: '18px', letterSpacing: '6px', fontFamily: "'DM Sans',sans-serif", outline: 'none', textAlign: 'center', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'text' }}
              onFocus={e => e.target.style.borderColor = '#0B7B6F'}
              onBlur={e => e.target.style.borderColor = '#E2EEEC'}
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}> {error}</p>}

          <button 
            onClick={handleLogin} 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Verifying...' : 'Login Securely'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748B', marginTop: '20px' }}>
            Access restricted to authorized clinic staff only
          </p>
        </div>
      </div>
    </div>
  )
}