import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTopOnNav() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '100px', left: '28px', zIndex: 998,
        width: '44px', height: '44px', borderRadius: '50%',
        background: '#0B7B6F', color: '#fff',
        border: 'none', cursor: 'pointer', fontSize: '18px',
        boxShadow: '0 4px 16px rgba(11,123,111,0.35)',
        transition: 'all 0.2s',
        animation: 'fadeIn 0.3s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      title="Back to top"
    >↑</button>
  )
}