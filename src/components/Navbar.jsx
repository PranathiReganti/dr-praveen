import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/clinics', label: 'Clinics' },
  { to: '/queue', label: 'Book Token' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '72px',
          padding: '0 5%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
          borderBottom: scrolled ? '1px solid #E2EEEC' : 'none',
        }}
      >

        {/* BRAND */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}>

          {/* LOGO */}
          <div className="nav-logo">
            PR
          </div>

          {/* TEXT */}
          <div className="nav-text">
            <div className="name">
              Dr. Praveen Ramachandra
            </div>

            <div className="sub">
              ENDOCRINOLOGY SPECIALIST
            </div>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={pathname === l.to ? 'active' : ''}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-btn"
        >
          <span/>
          <span/>
          <span/>
        </button>

      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">

          {/* HEADER */}
          <div className="mobile-header">
            <div className="logo">PR</div>
            <div>
              <div className="name">Dr. Praveen</div>
              <div className="sub">Endocrinology Specialist</div>
            </div>
          </div>

          {/* LINKS */}
          <div className="mobile-links">
            {links.map(l => (
              <Link key={l.to} to={l.to}>{l.label}</Link>
            ))}
          </div>

        </div>
      )}

      <style>{`

        /* LOGO */
        .nav-logo {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #0B7B6F;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .nav-text .name {
          font-size: 15px;
          font-weight: 600;
          color: #0A1628;
          line-height: 1.2;
        }

        .nav-text .sub {
          font-size: 10px;
          color: #0B7B6F;
          letter-spacing: 1.5px;
        }

        /* DESKTOP LINKS */
        .nav-links {
          display: flex;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          color: #64748B;
          font-size: 13px;
          padding: 7px 14px;
          border-radius: 8px;
          text-decoration: none;
        }

        .nav-links a.active {
          color: #0B7B6F;
          background: #E6F4F2;
        }

        /* MENU BUTTON */
        .menu-btn {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .menu-btn span {
          width: 20px;
          height: 2px;
          background: #0A1628;
        }

        /* MOBILE MENU */
        .mobile-menu {
          position: fixed;
          inset: 0;
          background: white;
          z-index: 999;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .mobile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .mobile-header .logo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #0B7B6F;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 24px;
          font-size: 18px;
        }

        .mobile-links a {
          text-decoration: none;
          color: #0A1628;
        }

        /* MOBILE FIX */
        @media (max-width: 900px) {
          .nav-links {
            display: none;
          }

          .nav-text .name {
            font-size: 13px;
          }

          .nav-text .sub {
            font-size: 9px;
          }
        }

      `}</style>
    </>
  )
}