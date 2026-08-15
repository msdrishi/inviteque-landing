import { motion } from 'framer-motion'

/* ──────────────────────────────────────────────────────────────
   VenueMidnightWaltz.jsx
   Venue section for the Midnight Waltz traditional Indian template.
   Full-screen layout with text elements placed in the top-middle area.
   ────────────────────────────────────────────────────────────── */

// PIN icon
const PinIcon = ({ size = 16, color = '#4A3E20' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

// Tiny lotus ornament divider
function LotusDivider({ color = '#B09060' }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 4 }}>
      <div style={{ width: 26, height: 0.7, background: color, opacity: 0.55 }} />
      <svg viewBox="0 0 32 18" width={32} height={18} fill="none">
        <path d="M16 16C16 16 8 9 5 4C8 6 12 8 16 8C20 8 24 6 27 4C24 9 16 16 16 16Z" fill={color} opacity="0.65" />
        <path d="M16 16C16 16 11 10 10 6C12.5 8 14.5 9 16 9C17.5 9 19.5 8 22 6C21 10 16 16 16 16Z" fill={color} opacity="0.4" />
        <circle cx="16" cy="6" r="1.8" fill={color} opacity="0.55" />
      </svg>
      <div style={{ width: 26, height: 0.7, background: color, opacity: 0.55 }} />
    </div>
  )
}

const lineAnim = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function VenueMidnightWaltz({
  data,
  bgImageDesktop,
  bgImageMobile,
  isDesktop,
}) {
  if (!data) return null

  const venueName = data.venueName || 'Venue Name'
  const mapUrl = data.mapUrl || '#'

  // Build address lines
  const addrParts = []
  if (data.venueLine1) addrParts.push(data.venueLine1)
  if (data.venueLine2) addrParts.push(data.venueLine2)
  if (addrParts.length === 0 && data.location) addrParts.push(data.location)

  // QR code URL (using a public QR API — matches existing pattern in the codebase)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(mapUrl)}&size=200x200&color=3F4930&bgcolor=FDFBF7&qzone=2&format=png`

  // Check if device is a tablet
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024

  return (
    <section
      id="venue"
      aria-label="Our Venue"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Image spanning full screen */}
      <img
        src={isDesktop ? bgImageDesktop : bgImageMobile}
        alt="Traditional Indian wedding mandap venue illustration"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
        loading="lazy"
      />

      {/* Typography and interactive layer — top-middle area */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.35 } } }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: isDesktop ? 600 : (isTablet ? 500 : 360),
          paddingTop: isDesktop ? '14svh' : (isTablet ? '16svh' : '12svh'),
          paddingBottom: '8svh',
          paddingLeft: 24,
          paddingRight: 24,
          boxSizing: 'border-box',
        }}
      >
        {/* OUR VENUE label — Modernline calligraphy */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(18px, 1.8vw, 24px)' : (isTablet ? 'clamp(24px, 3vw, 30px)' : 'clamp(20px, 4.2vw, 24px)'),
            color: '#4A3E20',
            margin: '0 0 6px 0',
            lineHeight: 1,
            textTransform: 'none',
          }}
        >
          Our Venue
        </motion.p>

        <motion.div variants={lineAnim}>
          <LotusDivider />
        </motion.div>

        {/* Venue Name — Religath serif */}
        <motion.h2
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(22px, 2.6vw, 32px)' : (isTablet ? 'clamp(32px, 4.5vw, 40px)' : 'clamp(22px, 5.5vw, 28px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '14px 0 10px 0',
            lineHeight: 1.15,
            letterSpacing: '0.04em',
            maxWidth: '100%',
          }}
        >
          {venueName}
        </motion.h2>

        {/* Address — Cormorant Garamond with reduced line height spacing */}
        <motion.div
          variants={lineAnim}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 20 }}
        >
          {addrParts.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: isDesktop ? 'clamp(13px, 1.2vw, 16px)' : (isTablet ? 'clamp(17px, 2.2vw, 20px)' : 'clamp(13px, 3.8vw, 15px)'),
                color: '#4A3E20',
                margin: 0,
                lineHeight: 1.45,
                opacity: 0.9,
              }}
            >
              {line}
            </p>
          ))}
        </motion.div>

        {/* QR Code */}
        <motion.div
          variants={lineAnim}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 22 }}
        >
          <div
            style={{
              width: isDesktop ? 106 : (isTablet ? 116 : 90),
              height: isDesktop ? 106 : (isTablet ? 116 : 90),
              background: '#FDFBF7',
              borderRadius: 4,
              padding: 6,
              border: '0.75px solid rgba(176, 144, 96, 0.35)',
              boxShadow: '0 2px 12px rgba(63,73,48,0.07)',
            }}
          >
            <img
              src={qrSrc}
              alt="QR code for venue location"
              style={{ width: '100%', height: '100%', display: 'block', borderRadius: 2 }}
              loading="lazy"
            />
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: isDesktop ? 11 : 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B09060',
              margin: 0,
              opacity: 0.85,
            }}
          >
            Scan for Location
          </p>
        </motion.div>

        {/* Open Location Button */}
        <motion.a
          variants={lineAnim}
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open venue location in maps"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            border: '1px solid #B09060',
            borderRadius: 4,
            padding: isDesktop ? '10px 24px' : '8px 20px',
            background: 'rgba(253, 251, 247, 0.85)',
            backdropFilter: 'blur(4px)',
            cursor: 'pointer',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(176, 144, 96, 0.12)',
          }}
        >
          <PinIcon size={14} color="#4A3E20" />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: isDesktop ? 12 : 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#4A3E20',
            }}
          >
            Open Location
          </span>
        </motion.a>
      </motion.div>
    </section>
  )
}
