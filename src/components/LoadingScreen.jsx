import { useState, useEffect } from 'react'

export default function LoadingScreen() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1800)
    return () => clearTimeout(t)
  }, [])

  if (done) return null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0A1628',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      animation: done ? 'fadeOut 0.5s ease forwards' : 'none',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: 'linear-gradient(135deg,#0B7B6F,#096358)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: '28px', fontWeight: '700', color: '#fff',
        marginBottom: '24px',
        animation: 'logoPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}>PR</div>

      <div style={{ width: '200px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '14px' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg,#0B7B6F,#0FA898)',
          borderRadius: '2px',
          animation: 'loadFill 1.5s ease forwards',
        }}/>
      </div>

      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Dr. Praveen Ramachandra
      </div>

      <style>{`
        @keyframes logoPop { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes loadFill { from{width:0} to{width:100%} }
        @keyframes fadeOut { to{opacity:0;visibility:hidden} }
      `}</style>
    </div>
  )
}