import { motion } from 'framer-motion'
import { fadeUp } from '../motionVariants.js'

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
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

const PinIconSolid = ({ size = 20, color = '#D4AF37' }) => (
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
      top, left, right, bottom,
      transform: `rotate(${rotate}deg)`,
      opacity: 0.38,
      pointerEvents: 'none',
      zIndex: 1,
    }}
  >
    {/* Traditional Royal/Heritage Floral details */}
    <path d="M16 96 C34 70 47 50 61 18" stroke="#D4AF37" strokeWidth="1.8" fill="none" />
    <path d="M32 86 C51 67 69 49 83 28" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.72" />
    <circle cx="60" cy="20" r="4" fill="#D4AF37" opacity="0.68" />
    <circle cx="78" cy="30" r="3" fill="#7B0F1A" opacity="0.75" />
    <circle cx="45" cy="38" r="3" fill="#D4AF37" opacity="0.58" />
  </svg>
)

export default function VenueRoyalPalace({ data, isDesktop, bgImage }) {
  if (!data) return null

  // Red/Gold Theme colors for Royal Palace
  const colors = {
    primary: '#E3C57C',
    primaryDark: '#D4AF37',
    primaryLight: '#E3C57C',
    border: 'rgba(227, 197, 124, 0.4)',
    borderSolid: 'rgba(227, 197, 124, 0.5)',
    bg: 'transparent',
    accent: '#E3C57C',
    qrColor: '7B0F1A',
    qrBg: 'FFFDF2',
    btnBg: 'rgba(227, 197, 124, 0.15)',
    btnBorder: 'rgba(227, 197, 124, 0.4)',
    btnHover: 'rgba(227, 197, 124, 0.3)'
  }

  const addressTextRaw = String(data.address || data.location || '')
  const venueCityPart = data.venueCity ? String(data.venueCity).trim() : ''
  const venueTitleBase = data.venueName ? String(data.venueName).trim() : ''
  const venueTitle = venueTitleBase
    ? `${venueTitleBase}${venueCityPart ? `, ${venueCityPart}` : ''}`
    : ''

  let addressTextPretty = addressTextRaw
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
      id={data.id || "venue"}
      className={isDesktop 
        ? "relative w-full overflow-hidden px-4 py-6 flex flex-col items-center text-center venue-section" 
        : "relative w-full overflow-hidden px-4 py-6 flex flex-col items-center text-center"
      }
      style={isDesktop ? {
        aspectRatio: '3 / 2',
        minHeight: 'auto',
        backgroundColor: '#5C0A14',
        paddingTop: 'clamp(80px, 12svh, 120px)',
        paddingBottom: 'clamp(52px, 10svh, 96px)',
      } : {
        minHeight: '100svh',
        backgroundColor: '#5C0A14',
        paddingTop: 'clamp(80px, 12svh, 120px)',
        paddingBottom: 'clamp(52px, 10svh, 96px)',
      }}
    >
      {/* Background Image as native img tag for consistent composting */}
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
        />
      )}
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
          <svg viewBox="0 0 24 24" width="16" height="16" fill={colors.accent}>
            <path d="M12 3c2.2 0 4 1.8 4 4 0 1.6-1.2 3.4-4 6.5C9.2 10.4 8 8.6 8 7c0-2.2 1.8-4 4-4z"/>
          </svg>
        </motion.div>
      ))}

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
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(30px, 3.2vw, 38px)',
                letterSpacing: '2px',
                fontWeight: 600,
                color: colors.primary,
                marginBottom: '8px',
              }}
            />
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.0, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 relative z-10"
              style={{ marginBottom: '14px' }}
            >
              <span style={{ width: '56px', height: '1px', backgroundColor: colors.border }} />
              <PinIconSolid size={16} color={colors.accent} />
              <span style={{ width: '56px', height: '1px', backgroundColor: colors.border }} />
            </motion.p>

            {(data.venueLine1 || data.venueLine2 || addressTextPretty) && (
              <motion.address
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                variants={fadeUp}
                transition={{ duration: 1.1, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center relative z-10"
                style={{
                  width: '100%',
                  maxWidth: '620px',
                  marginTop: '4px',
                  color: colors.primaryLight,
                  fontStyle: 'normal',
                }}
              >
                {data.venueLine1 || data.venueLine2 ? (
                  <>
                    {data.venueLine1 && (
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 600,
                          fontSize: 'clamp(15px, 1.8vw, 19px)',
                          lineHeight: 1.6,
                          color: colors.primary,
                        }}
                      >
                        {data.venueLine1}
                      </span>
                    )}
                    {data.venueLine2 && (
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 500,
                          fontSize: 'clamp(14px, 1.5vw, 17px)',
                          lineHeight: 1.6,
                          color: colors.primaryLight,
                          marginTop: '4px',
                        }}
                      >
                        {data.venueLine2}
                      </span>
                    )}
                  </>
                ) : (
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      fontSize: 'clamp(15px, 1.8vw, 19px)',
                      lineHeight: 1.6,
                      color: colors.primary,
                    }}
                  >
                    {addressTextPretty}
                  </span>
                )}
              </motion.address>
            )}
          </div>

          {/* Bottom: QR Code card */}
          {data.mapUrl && (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.2, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                background: 'transparent',
                borderRadius: '0px',
                border: 'none',
                boxShadow: 'none',
                padding: '14px 24px',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <motion.img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(String(data.mapUrl))}&color=${colors.qrColor}&bgcolor=${colors.qrBg}`}
                alt="QR Code for Location"
                width={120}
                height={120}
                style={{
                  display: 'block',
                  borderRadius: '10px',
                  border: `1px solid ${colors.borderSolid}`,
                  backgroundColor: colors.bg,
                  padding: '4px',
                }}
                loading="lazy"
              />
              <div className="flex flex-col items-start gap-3">
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.primary,
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
                    padding: '8px 18px',
                    borderRadius: '20px',
                    background: colors.btnBg,
                    border: `1px solid ${colors.btnBorder}`,
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.primary,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = colors.btnHover
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = colors.btnBg
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
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(26px, 5.2vw, 34px)',
                letterSpacing: '2px',
                fontWeight: 600,
                color: colors.primary,
                marginBottom: '12px',
              }}
            />
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.0, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 relative z-10"
              style={{ marginBottom: '16px' }}
            >
              <span style={{ width: '56px', height: '1px', backgroundColor: colors.border }} />
              <PinIconSolid size={16} color={colors.accent} />
              <span style={{ width: '56px', height: '1px', backgroundColor: colors.border }} />
            </motion.p>

            <motion.address
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.1, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center relative z-10"
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: 0,
                marginTop: '6px',
                color: colors.primaryLight,
                fontStyle: 'normal',
                textAlign: 'center',
              }}
            >
              {data.venueLine1 || data.venueLine2 ? (
                <>
                  {data.venueLine1 && (
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 600,
                        fontSize: 'clamp(14px, 3.2vw, 16px)',
                        lineHeight: 1.68,
                        color: colors.primary,
                      }}
                    >
                      {data.venueLine1}
                    </span>
                  )}
                  {data.venueLine2 && (
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 500,
                        fontSize: 'clamp(13px, 2.8vw, 15px)',
                        lineHeight: 1.68,
                        color: colors.primaryLight,
                        marginTop: '4px',
                      }}
                    >
                      {data.venueLine2}
                    </span>
                  )}
                </>
              ) : (
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: 'clamp(14px, 3.2vw, 16px)',
                    lineHeight: 1.68,
                    color: colors.primary,
                  }}
                >
                  {addressTextPretty}
                </span>
              )}
            </motion.address>
          </div>

          {/* Bottom: Smaller QR Map Card (Vertical Stack for Mobile) */}
          {data.mapUrl && (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 1.2, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                background: 'transparent',
                borderRadius: '0px',
                border: 'none',
                boxShadow: 'none',
                padding: '14px 18px',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                marginTop: '20px'
              }}
            >
              <motion.img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(String(data.mapUrl))}&color=${colors.qrColor}&bgcolor=${colors.qrBg}`}
                alt="QR Code for Location"
                width={100}
                height={100}
                style={{
                  display: 'block',
                  borderRadius: '10px',
                  border: `1px solid ${colors.borderSolid}`,
                  backgroundColor: colors.bg,
                  padding: '4px',
                }}
                loading="lazy"
              />
              <div className="flex flex-col items-center gap-2">
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.primaryLight,
                  letterSpacing: '0.08em'
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
                    padding: '8px 18px',
                    borderRadius: '20px',
                    background: colors.btnBg,
                    border: `1px solid ${colors.btnBorder}`,
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.primary,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = colors.btnHover
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = colors.btnBg
                  }}
                >
                  📍 Open in Maps
                </a>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </section>
  )
}
