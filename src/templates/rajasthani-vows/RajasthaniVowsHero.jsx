import { useMemo, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import defaultGaneshaLogo from '../royal-heirloom/ganesha-logo.webp'

// ── Falling Royal Flowers Component (Royal Heirloom Style adapted to Rajasthani vibrant rose & gold) ──
const petalConfig = Array.from({ length: 16 }).map((_, i) => {
  const isLeft = i % 2 === 0
  const leftPos = isLeft ? Math.random() * 14 : 86 + Math.random() * 14 // strictly outer edges (0-14% or 86-100%)
  const duration = 7 + Math.random() * 7 // slow realistic floating
  const delay = Math.random() * 5
  const size = 11 + Math.random() * 8 // delicate petal size (11px to 19px)
  const xDrift = (isLeft ? 1 : -1) * (10 + Math.random() * 14) // contained drift so it never reaches center
  return { left: leftPos, duration, delay, size, xDrift }
})

export function FallingRoyalFlowers() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden w-full h-full">
      {petalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute -top-8"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.35,
            opacity: 0.88,
          }}
          initial={{ y: '-10vh', opacity: 0 }}
          animate={{
            y: ['0vh', '112vh'],
            x: [0, p.xDrift, p.xDrift * 0.3, p.xDrift * 0.9],
            rotate: [0, 360],
            opacity: [0, 0.92, 0.92, 0.45, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Delicate petal matching Rajasthani royal pink umbrella with gold/wine accents */}
          <svg viewBox="0 0 24 32" width="100%" height="100%" fill="none" className="drop-shadow-[0_1px_3px_rgba(120,20,45,0.25)]">
            <path
              d="M12 2 C6 7, 3 17, 12 30 C21 17, 18 7, 12 2 Z"
              fill="#D4355B"
              fillOpacity="0.82"
              stroke="#8A1230"
              strokeWidth="0.75"
            />
            <path
              d="M12 4 C11 11, 10 19, 12 28"
              stroke="#700D24"
              strokeWidth="0.65"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path d="M12 11 Q8 14 6 17" stroke="#700D24" strokeWidth="0.45" strokeLinecap="round" opacity="0.65" />
            <path d="M12 16 Q16 19 18 22" stroke="#700D24" strokeWidth="0.45" strokeLinecap="round" opacity="0.65" />
            <path
              d="M12 6 C10 10, 8 16, 12 24"
              stroke="#FFAEC0"
              strokeWidth="0.45"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// Thin decorative divider with diamond ornament
function ThinDivider({ color = '#C59A4E', width = 120 }) {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width }}
    >
      <div style={{ flex: 1, height: 0.8, background: color, opacity: 0.7, borderRadius: 1 }} />
      <div
        style={{
          width: 5,
          height: 5,
          transform: 'rotate(45deg)',
          background: color,
          opacity: 0.9,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, height: 0.8, background: color, opacity: 0.7, borderRadius: 1 }} />
    </div>
  )
}

export default function RajasthaniVowsHero({
  data = {},
  isDesktop,
  hasTriggeredHeroBg = false,
  hasTriggeredHeroText = false,
  hasOpened = false,
}) {
  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%'])
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isTablet = !isDesktop && windowWidth >= 600 && windowWidth <= 1024
  const bgSrc = isDesktop
    ? (data.bgImageDesktop || "/assets/templates/rajestani-vows/hero-mobile.webp")
    : (data.bgImageMobile || "/assets/templates/rajestani-vows/hero-mobile.webp")

  // Color palette matching royal Rajasthani red/pink & gold theme
  const colors = {
    primary: '#7A1228',     // Rich royal ruby-crimson (matches umbrellas)
    secondary: '#8A1D33',   // Deep wine-rose
    gold: '#C59A4E',        // Warm antique gold
    goldDark: '#A87B32',    // Deeper antique gold
  }

  const lineAnim = {
    hidden: { opacity: 0, y: 16, filter: 'blur(5px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const hasDate = Boolean(data.weddingMonth || data.weddingDate || data.weddingYear)

  // Determine if hero visual is active (if cover opened or video finished)
  const isHeroActive = hasTriggeredHeroBg || hasOpened
  const isTextActive = hasTriggeredHeroText || hasOpened

  return (
    <section
      id="hero"
      aria-label="Wedding hero — Rajasthani Vows"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minHeight: isDesktop ? '100vh' : '100svh',
        height: isDesktop ? '100vh' : '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'center',
        paddingTop: isDesktop ? '46vh' : (isTablet ? '48svh' : '49.5svh'),
        paddingBottom: '28px',
        paddingLeft: isTablet ? 28 : 16,
        paddingRight: isTablet ? 28 : 16,
        boxSizing: 'border-box',
        userSelect: 'none',
        backgroundColor: '#FAF6EE',
      }}
    >
      {/* ── Background Image with Water Spread Bloom Animation ── */}
      <motion.div
        initial={{
          clipPath: 'circle(0% at 50% 50%)',
          opacity: 0,
          scale: isDesktop ? 1.25 : 1.18,
          filter: 'blur(10px)',
        }}
        animate={
          isHeroActive
            ? {
                clipPath: 'circle(135% at 50% 50%)',
                opacity: 1,
                scale: isDesktop ? 1.15 : (isTablet ? 1.04 : 1.08),
                filter: 'blur(0px)',
              }
            : {
                clipPath: 'circle(0% at 50% 50%)',
                opacity: 0,
                scale: isDesktop ? 1.25 : 1.18,
                filter: 'blur(10px)',
              }
        }
        transition={{
          duration: 3.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          transformOrigin: 'center',
          y: bgY,
        }}
      >
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
          loading="eager"
        />
      </motion.div>

      {/* Royal Falling Flower Petals Animation (triggers with hero) */}
      {isHeroActive && <FallingRoyalFlowers />}

      {/* ── HERO CONTENT (Animated after video finishes) ── */}
      <motion.div
        initial="hidden"
        animate={isTextActive ? "show" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.18,
              delayChildren: 0.35,
            },
          },
        }}
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: isDesktop ? 540 : (isTablet ? 600 : 400),
        }}
      >
        {/* 1. Ganesha Logo — Sacred emblem with clear breathing room */}
        {(data.ganeshaLogo || defaultGaneshaLogo) && (
          <motion.div variants={lineAnim} style={{ marginBottom: isDesktop ? 10 : 8 }}>
            <img
              src={data.ganeshaLogo || defaultGaneshaLogo}
              alt="Om Ganesha"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-8 md:h-8 object-contain opacity-95 drop-shadow-[0_2px_4px_rgba(122,18,40,0.18)]"
            />
          </motion.div>
        )}

        {/* 2. Couple Names — Modernline luxury calligraphy script font with clear non-overlapping separation */}
        {(data.groomName || data.brideName) && (
          <motion.div
            variants={lineAnim}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              margin: '0 auto',
            }}
          >
            {/* Groom Name */}
            {data.groomName && (
              <span
                style={{
                  fontFamily: "'Modernline', 'Allura', 'Alex Brush', cursive",
                  fontSize: isDesktop
                    ? 'clamp(3.1rem, 4.4vw, 3.8rem)'
                    : (isTablet ? 'clamp(3.2rem, 5.0vw, 3.9rem)' : 'clamp(2.6rem, 7.0vw, 3.2rem)'),
                  color: colors.primary,
                  lineHeight: 1.25,
                  display: 'block',
                  filter: 'drop-shadow(0 2px 4px rgba(122,18,40,0.22))',
                }}
              >
                {data.groomName}
              </span>
            )}

            {/* and — Protected margin to prevent overlap from descenders/ascenders */}
            {data.andText && (
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: isDesktop
                    ? 'clamp(11px, 1.2vw, 14px)'
                    : (isTablet ? 'clamp(12px, 1.4vw, 15px)' : 'clamp(10px, 2.4vw, 12px)'),
                  letterSpacing: '0.22em',
                  textTransform: 'lowercase',
                  color: colors.goldDark,
                  lineHeight: 1.35,
                  margin: isDesktop ? '8px 0' : '6px 0',
                  opacity: 0.95,
                }}
              >
                {data.andText}
              </span>
            )}

            {/* Bride Name */}
            {data.brideName && (
              <span
                style={{
                  fontFamily: "'Modernline', 'Allura', 'Alex Brush', cursive",
                  fontSize: isDesktop
                    ? 'clamp(3.1rem, 4.4vw, 3.8rem)'
                    : (isTablet ? 'clamp(3.2rem, 5.0vw, 3.9rem)' : 'clamp(2.6rem, 7.0vw, 3.2rem)'),
                  color: colors.primary,
                  lineHeight: 1.25,
                  display: 'block',
                  filter: 'drop-shadow(0 2px 4px rgba(122,18,40,0.22))',
                }}
              >
                {data.brideName}
              </span>
            )}
          </motion.div>
        )}

        {/* 3. Subtitle ("ARE GETTING MARRIED") — Separated cleanly below cursive flourish */}
        {data.subtitle && (
          <motion.p
            variants={lineAnim}
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              fontSize: isDesktop ? 'clamp(9px, 0.85vw, 10.5px)' : (isTablet ? 'clamp(10px, 1.3vw, 12px)' : 'clamp(8.5px, 2.0vw, 10px)'),
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: colors.secondary,
              marginTop: isDesktop ? '14px' : '10px',
              marginBottom: isDesktop ? '10px' : '8px',
              lineHeight: 1.35,
              opacity: 0.92,
            }}
          >
            {data.subtitle}
          </motion.p>
        )}

        {/* 4. Thin Ornamental Gold Divider */}
        {hasDate && (
          <motion.div variants={lineAnim} style={{ marginBottom: isDesktop ? 12 : 9 }}>
            <ThinDivider color={colors.gold} width={isDesktop ? 90 : (isTablet ? 110 : 80)} />
          </motion.div>
        )}

        {/* 5. Date Row: MONTH | DATE | YEAR */}
        {hasDate && (
          <motion.div
            variants={lineAnim}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isDesktop ? 12 : 10,
              lineHeight: 1,
              marginBottom: isDesktop ? 10 : 8,
            }}
          >
            {data.weddingMonth && (
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: isDesktop ? '0.92rem' : (isTablet ? '1.05rem' : '0.85rem'),
                  color: colors.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                {String(data.weddingMonth).trim().slice(0, 3).toUpperCase()}
              </span>
            )}

            {data.weddingDate && (
              <>
                <span style={{ color: colors.gold, fontSize: '0.8rem', opacity: 0.75, fontFamily: 'serif' }}>|</span>
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    fontSize: isDesktop ? '1.6rem' : (isTablet ? '1.9rem' : '1.5rem'),
                    color: colors.primary,
                    letterSpacing: '0.02em',
                    lineHeight: 1,
                  }}
                >
                  {data.weddingDate}
                </span>
                <span style={{ color: colors.gold, fontSize: '0.8rem', opacity: 0.75, fontFamily: 'serif' }}>|</span>
              </>
            )}

            {data.weddingYear && (
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: isDesktop ? '0.92rem' : (isTablet ? '1.05rem' : '0.85rem'),
                  color: colors.primary,
                  letterSpacing: '0.10em',
                }}
              >
                {data.weddingYear}
              </span>
            )}
          </motion.div>
        )}

        {/* 6. Day of Week — Distinct and legible */}
        {data.dayOfWeek && (
          <motion.p
            variants={lineAnim}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: isDesktop ? '10px' : (isTablet ? '11.5px' : '9.5px'),
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.secondary,
              marginTop: isDesktop ? '4px' : '3px',
              marginBottom: isDesktop ? '4px' : '3px',
              lineHeight: 1.35,
              fontWeight: 600,
            }}
          >
            {data.dayOfWeek}
          </motion.p>
        )}

        {/* 7. Wedding Time — Clearly separated from day of week */}
        {data.weddingTime && (
          <motion.p
            variants={lineAnim}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: isDesktop ? '9.5px' : (isTablet ? '11px' : '9px'),
              letterSpacing: '0.14em',
              color: colors.secondary,
              marginTop: isDesktop ? '2px' : '1px',
              marginBottom: isDesktop ? '12px' : '9px',
              lineHeight: 1.35,
              fontWeight: 500,
              opacity: 0.95,
            }}
          >
            {data.weddingTime}
          </motion.p>
        )}

        {/* 8. Pin Icon */}
        {(data.venueName || (data.addressLines && data.addressLines.length > 0)) && (
          <motion.div variants={lineAnim} style={{ marginBottom: isDesktop ? 5 : 4 }}>
            <svg
              viewBox="0 0 24 24"
              width={11}
              height={11}
              fill={colors.gold}
              aria-hidden="true"
              style={{ opacity: 0.95 }}
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </motion.div>
        )}

        {/* 9. Venue Name & Address Lines — Covering bottom area gracefully */}
        {(data.venueName || (data.addressLines && data.addressLines.length > 0)) && (
          <motion.div
            variants={lineAnim}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isDesktop ? 4 : 3,
              width: '100%',
              margin: '0 auto',
            }}
          >
            {data.venueName && (
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: isDesktop ? '11.5px' : (isTablet ? '12.5px' : '10.5px'),
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: colors.primary,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {data.venueName}
              </p>
            )}

            {Array.isArray(data.addressLines) &&
              data.addressLines.map((line, idx) => (
                <p
                  key={idx}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                    fontSize: isDesktop ? '10px' : (isTablet ? '11px' : '9px'),
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: colors.secondary,
                    margin: 0,
                    lineHeight: 1.4,
                    opacity: 0.9,
                  }}
                >
                  {line}
                </p>
              ))}
          </motion.div>
        )}
      </motion.div>

      {/* ── Scroll Indicator (Guaranteed True Center + Separate Round Arrow Below) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(6px, 1.4vh, 14px)',
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          aria-label="Scroll down"
        >
          {/* Centered Scroll Down Banner Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px 14px',
              borderRadius: 9999,
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(122, 18, 40, 0.38)',
              boxShadow: '0 4px 14px rgba(122, 18, 40, 0.14), 0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: '9.5px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: colors.primary,
                lineHeight: 1,
              }}
            >
              Scroll Down
            </span>
          </div>

          {/* Separate Round Icon Below with Arrow */}
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(122, 18, 40, 0.38)',
              boxShadow: '0 4px 12px rgba(122, 18, 40, 0.14), 0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <svg
              viewBox="0 0 14 9"
              width={10}
              height={6}
              fill="none"
              stroke={colors.primary}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 1.5 L7 7.5 L13 1.5" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}