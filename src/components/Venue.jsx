import { motion } from 'framer-motion'
import { fadeUp } from '../motionVariants.js'
const locationImg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029562/ucwqwm3grlx07v8iijxc.png"

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } }
}

function AnimatedTitle({ text, className, style }) {
  return (
    <motion.h2 variants={letterContainer} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className={className} style={style}>
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterAnim} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
      ))}
    </motion.h2>
  )
}

const PinIconSolid = ({ size = 20, color = '#D8B26E' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

const CornerFloral = ({ top, left, right, bottom, rotate = 0 }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 120 120"
    width="120"
    height="120"
    style={{
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      transform: `rotate(${rotate}deg)`,
      opacity: 0.38,
      pointerEvents: 'none',
      zIndex: 1,
    }}
  >
    <path d="M16 96 C34 70 47 50 61 18" stroke="#D8B26E" strokeWidth="1.8" fill="none" />
    <path d="M32 86 C51 67 69 49 83 28" stroke="#D8B26E" strokeWidth="1.2" fill="none" opacity="0.72" />
    <circle cx="60" cy="20" r="4" fill="#D8B26E" opacity="0.68" />
    <circle cx="78" cy="30" r="3" fill="#D8B26E" opacity="0.52" />
    <circle cx="45" cy="38" r="3" fill="#D8B26E" opacity="0.58" />
  </svg>
)

export default function Venue({ data, isDesktop }) {
  if (!data) return null

  const addressTextRaw = String(data.address || data.location || 'MG Road')
  // Remove venue name from address to avoid duplication with the title
  const venueCityPart = data.venueCity ? String(data.venueCity).trim() : ''
  const venueTitleBase = data.venueName ? String(data.venueName).trim() : ''
  const venueTitle = (venueTitleBase
    ? `${venueTitleBase}${venueCityPart ? `, ${venueCityPart}` : ''}`
    : 'Palace Ground'
  )

  // Strip the venue name from the full address so it doesn't repeat
  let addressTextPretty = addressTextRaw
  if (venueTitleBase) {
    // Remove "VenueName, " or "VenueName" from the start of the address
    const regex = new RegExp(`^${venueTitleBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*,?\\s*`, 'i')
    addressTextPretty = addressTextRaw.replace(regex, '').trim()
  }
  // If stripping removed everything, fall back to raw
  if (!addressTextPretty) addressTextPretty = addressTextRaw

  const viewport = { once: false, amount: 0.15 }
  const petals = [
    { left: '9%', top: '16%', delay: 0.1 },
    { left: '88%', top: '20%', delay: 0.2 },
    { left: '14%', top: '64%', delay: 0.25 },
    { left: '82%', top: '68%', delay: 0.35 },
    { left: '48%', top: '12%', delay: 0.15 },
  ]

  return (
    <section 
      id={data.id} 
      className={isDesktop ? "relative w-full overflow-hidden px-4 py-6 flex flex-col items-center text-center venue-section" : "relative w-full overflow-hidden px-4 py-6 flex flex-col items-center text-center"}
      style={isDesktop ? {
        aspectRatio: '3 / 2',
        minHeight: 'auto',
        backgroundColor: '#FFF7F2',
        backgroundImage: `url("https://res.cloudinary.com/djbxuk2xr/image/upload/v1782033908/io3izfnqso0mtsob8zlk.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        paddingTop: 'clamp(80px, 12svh, 120px)',
        paddingBottom: 'clamp(52px, 10svh, 96px)',
        clipPath: 'url(#venueTopCurveClip)',
      } : {
        minHeight: '100svh',
        backgroundColor: '#FFF7F2',
        backgroundImage: `url(${locationImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        paddingTop: 'clamp(80px, 12svh, 120px)',
        paddingBottom: 'clamp(52px, 10svh, 96px)',
        clipPath: 'url(#venueTopCurveClip)',
      }}
    >
      <CornerFloral top="10px" left="10px" rotate={0} />
      <CornerFloral top="10px" right="10px" rotate={90} />
      <CornerFloral bottom="6px" left="4px" rotate={-90} />
      <CornerFloral bottom="8px" right="2px" rotate={180} />

      {petals.map((petal, index) => (
        <motion.div
          key={`${petal.left}-${petal.top}`}
          aria-hidden="true"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut', delay: petal.delay }}
          style={{
            position: 'absolute',
            left: petal.left,
            top: petal.top,
            width: 16,
            height: 16,
            opacity: 0.44,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#D8B26E">
            <path d="M12 3c2.2 0 4 1.8 4 4 0 1.6-1.2 3.4-4 6.5C9.2 10.4 8 8.6 8 7c0-2.2 1.8-4 4-4z"/>
          </svg>
        </motion.div>
      ))}

      <svg aria-hidden="true" width="0" height="0" focusable="false">
        <defs>
          <clipPath id="venueTopCurveClip" clipPathUnits="objectBoundingBox">
            <path d="M0 0.045 C 0.25 0 0.75 0 1 0.045 L 1 1 L 0 1 Z" />
          </clipPath>
        </defs>
      </svg>

      {isDesktop ? (
        <div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-between text-center"
          style={{
            paddingTop: 'clamp(70px, 9.5%, 120px)',
            paddingBottom: '8%',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          {/* Top: Header & Venue Details */}
          <div className="flex flex-col items-center">
            <AnimatedTitle 
              text="OUR VENUE"
              className="font-semibold relative z-10"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(28px, 3.2vw, 36px)',
                letterSpacing: '0.14em',
                fontWeight: 600,
                color: '#7B1E2B',
                marginBottom: '8px',
                textShadow: '0 14px 28px rgba(123, 30, 43, 0.16)',
              }}
            />
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 relative z-10"
              style={{ marginBottom: '14px' }}
            >
              <span style={{ width: '56px', height: '1px', backgroundColor: 'rgba(216,178,110,0.7)' }} />
              <PinIconSolid size={16} color="#D8B26E" />
              <span style={{ width: '56px', height: '1px', backgroundColor: 'rgba(216,178,110,0.7)' }} />
            </motion.p>

            <motion.h3 
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-semibold relative z-10"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(22px, 2.8vw, 30px)',
                fontWeight: 600,
                color: '#8A2D3B',
                margin: '6px 0 8px 0',
                letterSpacing: '0.16em',
                textShadow: '0 14px 28px rgba(122, 30, 43, 0.16)',
              }}
            >
              {venueTitle}
            </motion.h3>

            <motion.address
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center relative z-10"
              style={{
                width: '100%',
                maxWidth: '620px',
                marginTop: '4px',
                color: '#9C5E67',
                fontStyle: 'normal',
              }}
            >
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: 1.6,
                  color: '#9C5E67',
                  whiteSpace: 'normal',
                  overflowWrap: 'anywhere',
                  textShadow: '0 12px 24px rgba(255, 247, 242, 0.64)',
                }}
              >
                {addressTextPretty}
              </span>
            </motion.address>
          </div>

          {/* Bottom: QR Code card */}
          {data.mapUrl && (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                background: '#FFF7F2',
                borderRadius: '16px',
                border: '1px solid rgba(216,178,110,0.6)',
                boxShadow: '0 15px 35px rgba(109,18,32,0.1), 0 5px 12px rgba(216,178,110,0.15)',
                padding: '14px 24px',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <motion.img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(String(data.mapUrl))}&color=6D1220&bgcolor=FFF7F2`}
                alt="QR Code for Location"
                width={130}
                height={130}
                style={{
                  display: 'block',
                  borderRadius: '10px',
                  border: '1px solid rgba(216,178,110,0.44)',
                  backgroundColor: '#FFF7F2',
                  padding: '4px',
                }}
                loading="lazy"
              />
              <div className="flex flex-col items-start gap-3">
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#9C5E67',
                  letterSpacing: '0.1em'
                }}>Scan to locate or</span>
                <a
                  href={String(data.mapUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px 20px',
                    borderRadius: '20px',
                    background: 'rgba(123, 30, 43, 0.08)',
                    border: '1px solid rgba(123, 30, 43, 0.2)',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#7B1E2B',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(123, 30, 43, 0.12)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(123, 30, 43, 0.08)'
                  }}
                >
                  📍 Open in Maps
                </a>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-between mt-6">
          {/* Top: Details */}
          <div className="flex flex-col items-center justify-center w-full">
            <AnimatedTitle 
              text="OUR VENUE"
              className="font-semibold relative z-10"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(24px, 5.2vw, 34px)',
                letterSpacing: '0.14em',
                fontWeight: 600,
                color: '#7B1E2B',
                marginBottom: '12px',
                textShadow: '0 14px 28px rgba(123, 30, 43, 0.16)',
              }}
            />

            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 relative z-10"
              style={{ marginBottom: '16px' }}
            >
              <span style={{ width: '56px', height: '1px', backgroundColor: 'rgba(216,178,110,0.7)' }} />
              <PinIconSolid size={16} color="#D8B26E" />
              <span style={{ width: '56px', height: '1px', backgroundColor: 'rgba(216,178,110,0.7)' }} />
            </motion.p>

            <motion.h3 
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-semibold relative z-10"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(18px, 4.2vw, 28px)',
                fontWeight: 600,
                color: '#8A2D3B',
                margin: '10px 0 6px 0',
                letterSpacing: '0.16em',
                textShadow: '0 14px 28px rgba(122, 30, 43, 0.16)',
              }}
            >
              {venueTitle}
            </motion.h3>

            <motion.address
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center relative z-10"
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: 0,
                marginTop: '14px',
                color: '#9C5E67',
                fontStyle: 'normal',
                textAlign: 'center',
              }}
            >
              <span style={{ display: 'inline-flex', items: 'center', gap: 8 }}>
                <span style={{ width: 54, height: 1, background: 'rgba(216,178,110,0.66)' }} />
                <PinIconSolid size={16} color="#D8B26E" />
                <span style={{ width: 54, height: 1, background: 'rgba(216,178,110,0.66)' }} />
              </span>

              <AnimatedTitle 
                text="ADDRESS"
                style={{
                  marginTop: 8,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: '11px',
                  letterSpacing: '0.34em',
                  color: '#9C5E67',
                  textTransform: 'uppercase',
                  textShadow: '0 8px 18px rgba(255, 247, 242, 0.64)',
                }}
              />

              <span
                style={{
                  marginTop: 6,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  fontSize: 'clamp(13px, 2.8vw, 15px)',
                  lineHeight: 1.68,
                  color: '#9C5E67',
                  whiteSpace: 'normal',
                  overflowWrap: 'anywhere',
                  textShadow: '0 12px 24px rgba(255, 247, 242, 0.64)',
                }}
              >
                {addressTextPretty}
              </span>
            </motion.address>
          </div>

          {/* Bottom: Smaller QR Map Card (Vertical Stack) */}
          {data.mapUrl && (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                background: '#FFF7F2',
                borderRadius: '16px',
                border: '1px solid rgba(216,178,110,0.5)',
                boxShadow: '0 10px 24px rgba(109,18,32,0.06)',
                padding: '12px 14px',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                alignSelf: 'center',
                marginTop: '16px',
              }}
            >
              <motion.img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(String(data.mapUrl))}&color=6D1220&bgcolor=FFF7F2`}
                alt="QR Code for Location"
                width={86}
                height={86}
                style={{
                  display: 'block',
                  borderRadius: '8px',
                  border: '1px solid rgba(216,178,110,0.44)',
                  backgroundColor: '#FFF7F2',
                  padding: '4px',
                }}
                loading="lazy"
              />
              <a
                href={String(data.mapUrl)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  padding: '6px 14px',
                  borderRadius: '16px',
                  background: 'rgba(123, 30, 43, 0.08)',
                  border: '1px solid rgba(123, 30, 43, 0.2)',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#7B1E2B',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                📍 Open in Maps
              </a>
            </motion.div>
          )}
        </div>
      )}

    </section>
  )
}
