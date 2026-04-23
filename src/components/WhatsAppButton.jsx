import { DOCTOR, WHATSAPP_MSG } from '../data/content'
import { FaWhatsapp } from "react-icons/fa"

export default function WhatsAppButton() {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999
    }}>

      {/* Pulse Ring */}
      <div style={{
        position: 'absolute',
        inset: '-6px',
        borderRadius: '50%',
        border: '2px solid rgba(37,211,102,0.35)',
        animation: 'ring 2s ease-out infinite',
        pointerEvents: 'none',
      }}/>

      {/* Button */}
      <a
        href={`https://wa.me/${DOCTOR.whatsapp}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: '#25D366',
          color: '#fff',
          boxShadow: '0 10px 30px rgba(37,211,102,0.4)',
          transition: 'all 0.25s ease',
          textDecoration: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.08)'
          e.currentTarget.style.boxShadow = '0 12px 36px rgba(37,211,102,0.6)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(37,211,102,0.4)'
        }}
      >
        {/* WhatsApp Icon */}
        <FaWhatsapp size={26} />
      </a>

      {/* Animation */}
      <style>{`
        @keyframes ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

    </div>
  )
}