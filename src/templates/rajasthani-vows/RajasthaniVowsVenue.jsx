import { motion } from 'framer-motion'
import { SectionHeader, LotusDivider } from './RajasthaniVowsShared.jsx'

const PinIcon = ({ size = 16, color = '#7A1228' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const lineAnim = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function RajasthaniVowsVenue({
  data = {},
  bgImageDesktop,
  bgImageMobile,
  isDesktop = false,
}) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024

  const bgSrc = isDesktop
    ? (data.bgImageDesktop || bgImageDesktop || "/assets/templates/rajestani-vows/venue-mobile.webp")
    : (data.bgImageMobile || bgImageMobile || "/assets/templates/rajestani-vows/venue-mobile.webp")

  const venueName = data.venueName || ''
  const mapUrl = data.mapUrl || ''
  const qrSrc = mapUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(mapUrl)}&size=200x200&color=7A1228&bgcolor=FAF6EE&qzone=2&format=png`
    : null

  const addrParts = []
  if (data.venueLine1) addrParts.push(data.venueLine1)
  if (data.venueLine2) addrParts.push(data.venueLine2)
  if (addrParts.length === 0 && data.location) addrParts.push(data.location)

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
        justifyContent: 'flex-start',
        overflow: 'hidden',
        paddingTop: isDesktop ? '8vh' : (isTablet ? '8svh' : '6.5svh'),
        paddingBottom: '30px',
        paddingLeft: isDesktop ? '24px' : '20px',
        paddingRight: isDesktop ? '24px' : '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Background Image */}
      <img
        src={bgSrc}
        alt="Venue illustration"
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

      {/* Typography and interactive layer */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: isDesktop ? 600 : (isTablet ? 500 : 380),
        }}
      >
        {/* Consistent Section Header */}
        <SectionHeader
          subtitle={data.subtitle || "CELEBRATION VENUE"}
          title={data.title || "THE VENUE"}
        />

        {/* Venue Name — Cinzel font */}
        {venueName && (
          <motion.h3
            variants={lineAnim}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: isDesktop ? '20px' : (isTablet ? '22px' : '17px'),
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#7A1228',
              margin: '8px 0 6px 0',
              lineHeight: 1.25,
              letterSpacing: '0.10em',
              maxWidth: '100%',
            }}
          >
            {venueName}
          </motion.h3>
        )}

        {/* Address Lines — Cinzel font */}
        {addrParts.length > 0 && (
          <motion.div
            variants={lineAnim}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 18 }}
          >
            {addrParts.map((line, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 600,
                  fontSize: isDesktop ? '12px' : (isTablet ? '13px' : '11px'),
                  color: '#8A1D33',
                  margin: 0,
                  lineHeight: 1.45,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  opacity: 0.95,
                }}
              >
                {line}
              </p>
            ))}
          </motion.div>
        )}

        {/* QR Code */}
        {qrSrc && (
          <motion.div
            variants={lineAnim}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 18 }}
          >
            <div
              style={{
                width: isDesktop ? 104 : (isTablet ? 114 : 92),
                height: isDesktop ? 104 : (isTablet ? 114 : 92),
                background: '#FAF6EE',
                borderRadius: 6,
                padding: 6,
                border: '1px solid rgba(197, 154, 78, 0.5)',
                boxShadow: '0 8px 24px rgba(122,18,40,0.12)',
              }}
            >
              <img
                src={qrSrc}
                alt="QR code for venue location"
                style={{ width: '100%', height: '100%', display: 'block', borderRadius: 4 }}
                loading="lazy"
              />
            </div>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C59A4E',
                margin: 0,
              }}
            >
              Scan for Location
            </p>
          </motion.div>
        )}

        {/* Location Button */}
        {mapUrl && (
          <motion.a
            variants={lineAnim}
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open venue location in maps"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: `1.5px solid #C59A4E`,
              borderRadius: 6,
              padding: isDesktop ? '10px 26px' : '9px 22px',
              background: 'rgba(250, 246, 238, 0.95)',
              backdropFilter: 'blur(4px)',
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(122,18,40,0.14)',
            }}
          >
            <PinIcon size={14} color="#7A1228" />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: 11.5,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: '#7A1228',
              }}
            >
              {data.buttonText || 'Open Location'}
            </span>
          </motion.a>
        )}
      </motion.div>
    </section>
  )
}
