import { useMemo, useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { pavitraSriData } from '../../data/custom/pavitraSriData.js'
import PhotoCardsMidnightWaltz from '../../components/PhotoCardsMidnightWaltz.jsx'
import Countdown from '../../components/Countdown.jsx'
import Footer from '../../components/Footer.jsx'
import { useDraft } from '../../context/DraftContext.jsx'
import { API_URL } from '../../config.js'
import SplashScreen from '../../components/SplashScreen.jsx'

// ── Background asset URLs (local Vercel CDN) ────────────────────────────────────────
const desktopHeroBg = "/assets/templates/midnight-waltz/hero-desktop.webp"
const smartphoneHeroBg = "/assets/templates/midnight-waltz/hero-mobile.webp"
const photoBgDesktop = "/assets/templates/midnight-waltz/photo-bg-desktop.webp"
const photoBgMobile = "/assets/templates/midnight-waltz/photo-bg-mobile.webp"
const messageBgDesktop = "/assets/templates/midnight-waltz/welcome-desktop.webp"
const messageBgMobile = "/assets/templates/midnight-waltz/welcome-mobile.webp"
const locationBgDesktop = "/assets/templates/midnight-waltz/venue-desktop.webp"
const locationBgMobile = "/assets/templates/midnight-waltz/venue-mobile.webp"
const countdownBgDesktop = "/assets/templates/midnight-waltz/countdown-desktop.webp"
const countdownBgMobile = "/assets/templates/midnight-waltz/countdown-mobile.webp"
const rosePetalSrc = "/assets/decorations/midnight-waltz-rosePetal.png"

// â”€â”€ Petal configs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const petalConfig = Array.from({ length: 22 }).map((_, i) => {
  const rand = (offset) => {
    const x = Math.sin(i * 9.301 + offset * 7.583) * 43758.5453
    return x - Math.floor(x)
  }
  const isLeft = i % 2 === 0
  const leftPos = isLeft ? rand(0) * 18 : 82 + rand(0) * 18
  const baseDrift = 10 + rand(4) * 40
  const driftDirection = isLeft ? -1 : 1

  return {
    left: `${leftPos}vw`,
    duration: 9 + rand(1) * 14,
    delay: rand(2) * 10,
    size: 10 + rand(3) * 12,
    x1: driftDirection * baseDrift,
    x2: driftDirection * (baseDrift * 0.7),
    x3: driftDirection * (baseDrift * 0.4),
    initRot: rand(7) * 360,
    rotAmount: (1.2 + rand(8)) * (rand(9) > 0.5 ? 360 : -360),
    opacity: 0.45 + rand(10) * 0.5,
    scale: 0.7 + rand(11) * 0.4,
  }
})

function FallingRosePetals() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100svh' }}>
      {petalConfig.map((p, i) => (
        <motion.img
          key={i}
          src={rosePetalSrc}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: '-8%',
            left: p.left,
            width: p.size,
            height: 'auto',
            opacity: p.opacity,
            scale: p.scale,
            filter: 'drop-shadow(0px 2px 4px rgba(120,40,40,0.12))',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          animate={{
            y: ['0vh', '115vh'],
            x: [0, p.x1, p.x2, p.x3],
            rotate: [p.initRot, p.initRot + p.rotAmount],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// â”€â”€ Lotus ornament divider (Exact Midnight Waltz design) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LotusDivider({ color = '#B09060' }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 4, marginBottom: 4 }}>
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

function LotusOrnament({ size = 14, color = '#B58A3C' }) {
  return (
    <svg viewBox="0 0 40 20" width={size * 2.2} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 18 C20 18 10 10 6 4 C10 6 15 8 20 8 C25 8 30 6 34 4 C30 10 20 18 20 18Z" fill={color} opacity="0.75" />
      <path d="M20 18 C20 18 14 12 12 7 C15 9 17.5 10 20 10 C22.5 10 25 9 28 7 C26 12 20 18 20 18Z" fill={color} opacity="0.55" />
      <circle cx="20" cy="7" r="2" fill={color} opacity="0.6" />
    </svg>
  )
}

function TopOrnament({ color = '#B09060', size = 32 }) {
  return (
    <svg viewBox="0 0 32 36" width={size} height={size * 1.12} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="16" y1="28" x2="16" y2="34" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      <path d="M16 2 C10 8 8 14 8 18 C8 23 11.5 26 16 26 C20.5 26 24 23 24 18 C24 14 22 8 16 2Z" stroke={color} strokeWidth="1.1" fill={color} fillOpacity="0.1" opacity="0.8" />
      <path d="M11 18 Q16 10 21 18" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.55" />
      <circle cx="16" cy="2" r="1.8" fill={color} opacity="0.75" />
      <circle cx="16" cy="34" r="1.6" fill={color} opacity="0.6" />
    </svg>
  )
}

function ThinDivider({ color = '#7A6840', width = 110 }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 7, width, margin: '6px 0' }}>
      <div style={{ flex: 1, height: 0.75, background: color, opacity: 0.6, borderRadius: 1 }} />
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, opacity: 0.75, flexShrink: 0 }} />
      <div style={{ flex: 1, height: 0.75, background: color, opacity: 0.6, borderRadius: 1 }} />
    </div>
  )
}

const PinIcon = ({ size = 16, color = '#4A3E20' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const lineAnim = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
  },
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 1. HERO SECTION (Identical to existing Midnight Waltz)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function MidnightWaltzHero({ data, isDesktop }) {
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  )

  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%'])
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  useEffect(() => {
    const onResize = () => setIsLandscape(window.innerWidth > window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // â”€â”€ Animation variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const lineAnim = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // â”€â”€ Parse date "12 November 2026" â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      const monthAbbr = parts[1].slice(0, 3).toUpperCase()
      return { day: parts[0], month: monthAbbr, year: parts[2] }
    }
    return { day: '12', month: 'NOV', year: '2026' }
  }, [data.dateLine])

  // Determine if device is tablet (width between 600px and 1024px in portrait/square)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // iPad Pro is 1024px wide in portrait mode.
  const isTablet = !isDesktop && windowWidth >= 600 && windowWidth <= 1024

  // Tablets and mobile both use the smartphone background image layout.
  // Only wide desktop screens use the desktop hero layout.
  const bgSrc = isDesktop ? desktopHeroBg : smartphoneHeroBg

  // â”€â”€ Color palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const C = {
    primary: '#4A3E20',   // deep warm olive â€” names, date, address
    secondary: '#7A6840',   // medium warm brown â€” labels, subtitles
    gold: '#B09060',   // antique gold â€” ornament, "and"
  }

  return (
    <section
      id="hero"
      aria-label="Wedding hero â€” Midnight Waltz"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: isDesktop ? '100vh' : '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        // Frame content under illustration cleanly across devices
        paddingTop: isDesktop ? '45vh' : (isTablet ? '38svh' : '38svh'),
        paddingBottom: isDesktop ? '28px' : '20px',
        paddingLeft: isTablet ? 36 : 24,
        paddingRight: isTablet ? 36 : 24,
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Parallax background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          // 1.04 on tablet eliminates heavy over-zoom while avoiding white border gaps during -4% scroll
          scale: isDesktop ? 1.20 : (isTablet ? 1.04 : 1.12),
          transformOrigin: 'center',
          y: bgY,
        }}
      >
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          loading="eager"
        />
      </motion.div>

      {/* Falling rose petals */}
      <FallingRosePetals />

      {/* â”€â”€ HERO CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.1 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.35 } } }}
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: isDesktop ? 520 : (isTablet ? 640 : 360),
        }}
      >

        {/* 1. Top ornament */}
        <motion.div variants={lineAnim} style={{ marginBottom: isDesktop ? 8 : (isTablet ? 8 : 5) }}>
          <TopOrnament color={C.gold} size={isDesktop ? 28 : (isTablet ? 30 : 22)} />
        </motion.div>

        {/* 2. SAVE THE DATE â€” Modernline (Not capitalized) */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(14px, 1.3vw, 18px)' : (isTablet ? 'clamp(26px, 3.0vw, 32px)' : 'clamp(15px, 2.2vw, 22px)'),
            color: C.primary,
            margin: `0 0 ${isDesktop ? '8px' : '5px'} 0`,
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          Save the Date
        </motion.p>

        {/* 3. GROOM NAME â€” Religath */}
        <motion.div
          variants={lineAnim}
          aria-label={data.groomName || 'Groom'}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop
              ? 'clamp(2.5rem, 4.2vw, 3.6rem)'
              : (isTablet ? 'clamp(4.2rem, 6.5vw, 5.2rem)' : 'clamp(2.5rem, 4.5vw, 4.0rem)'),
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: C.primary,
            lineHeight: 1.0,
            position: 'relative',
          }}
        >
          <span style={{ position: 'relative', display: 'block' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.groomName || 'Sri')}
            </span>
            {/* Gold glare sweep */}
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: "'Religath', serif",
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                lineHeight: 'inherit',
                display: 'block',
                background: 'linear-gradient(110deg, transparent 30%, rgba(181,146,60,0.55) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {(data.groomName || 'Sri')}
            </motion.span>
          </span>
        </motion.div>

        {/* 4. and â€” Modernline */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop
              ? 'clamp(1.4rem, 2.4vw, 2.0rem)'
              : (isTablet ? 'clamp(2.4rem, 4.0vw, 3.0rem)' : 'clamp(1.3rem, 3.0vw, 2.2rem)'),
            color: C.primary,
            margin: `${isDesktop ? '-2px' : '-2px'} 0`,
            lineHeight: 1.0,
            textTransform: 'lowercase',
          }}
        >
          and
        </motion.p>

        {/* 5. BRIDE NAME â€” Religath */}
        <motion.div
          variants={lineAnim}
          aria-label={data.brideName || 'Bride'}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop
              ? 'clamp(2.5rem, 4.2vw, 3.6rem)'
              : (isTablet ? 'clamp(4.2rem, 6.5vw, 5.2rem)' : 'clamp(2.5rem, 4.5vw, 4.0rem)'),
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: C.primary,
            lineHeight: 1.0,
            position: 'relative',
          }}
        >
          <span style={{ position: 'relative', display: 'block' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.brideName || 'Pavitra')}
            </span>
            {/* Gold glare sweep (offset from groom's) */}
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear', delay: 1.2 }}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: "'Religath', serif",
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                lineHeight: 'inherit',
                display: 'block',
                background: 'linear-gradient(110deg, transparent 30%, rgba(181,146,60,0.55) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {(data.brideName || 'Pavitra')}
            </motion.span>
          </span>
        </motion.div>

        {/* 6. ARE GETTING MARRIED */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: isDesktop ? 'clamp(9px, 0.9vw, 11px)' : (isTablet ? 'clamp(18px, 2.8vw, 24px)' : 'clamp(8px, 2.2svw, 10px)'),
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: C.secondary,
            margin: `${isDesktop ? '8px' : '6px'} 0 ${isDesktop ? '6px' : '5px'} 0`,
            opacity: 0.85,
          }}
        >
          Are Getting Married
        </motion.p>

        {/* 7. Divider  â€”â€” â€¢ â€”â€” */}
        <motion.div
          variants={lineAnim}
          style={{ marginBottom: isDesktop ? 8 : 6 }}
        >
          <ThinDivider color={C.secondary} width={isDesktop ? 120 : (isTablet ? 180 : 100)} />
        </motion.div>

        {/* 8. DATE ROW: NOVEMBER | 12 | 2026 */}
        <motion.div
          variants={lineAnim}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isDesktop ? 12 : (isTablet ? 16 : 10),
            lineHeight: 1,
            marginBottom: isTablet ? 12 : 8,
          }}
        >
          {/* Month */}
          <span
            style={{
              fontFamily: "'Religath', serif",
              fontSize: isDesktop
                ? 'clamp(1.1rem, 1.8vw, 1.5rem)'
                : (isTablet ? 'clamp(1.8rem, 2.8vw, 2.4rem)' : 'clamp(1.15rem, 2.4vw, 1.6rem)'),
              color: C.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {dateParts.month}
          </span>

          {/* Separator */}
          <span style={{ color: C.secondary, fontSize: isDesktop ? '1.2rem' : (isTablet ? '2.2rem' : '1.1rem'), opacity: 0.6, fontFamily: 'serif' }}>|</span>

          {/* Day (Date) â€” larger */}
          <span
            style={{
              fontFamily: "'Religath', serif",
              fontSize: isDesktop
                ? 'clamp(2.2rem, 3.8vw, 3.2rem)'
                : (isTablet ? 'clamp(3.6rem, 5.5vw, 4.6rem)' : 'clamp(2.0rem, 5.0vw, 2.8rem)'),
              color: C.primary,
              letterSpacing: '0.04em',
              fontWeight: 'normal',
            }}
          >
            {dateParts.day}
          </span>

          {/* Separator */}
          <span style={{ color: C.secondary, fontSize: isDesktop ? '1.2rem' : (isTablet ? '2.2rem' : '1.1rem'), opacity: 0.6, fontFamily: 'serif' }}>|</span>

          {/* Year */}
          <span
            style={{
              fontFamily: "'Religath', serif",
              fontSize: isDesktop
                ? 'clamp(1.1rem, 1.8vw, 1.5rem)'
                : (isTablet ? 'clamp(1.8rem, 2.8vw, 2.4rem)' : 'clamp(1.15rem, 2.4vw, 1.6rem)'),
              color: C.primary,
              letterSpacing: '0.04em',
            }}
          >
            {dateParts.year}
          </span>
        </motion.div>

        {/* 9. Day of week â”€â”€ Religath font */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(13px, 1.2vw, 16px)' : (isTablet ? 'clamp(22px, 3.0vw, 28px)' : 'clamp(14px, 2.0vw, 18px)'),
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.primary,
            margin: `${isDesktop ? '4px' : '3px'} 0 1px 0`,
          }}
        >
          {data.dayOfWeek || 'Thursday'}
        </motion.p>

        {/* 10. Wedding time â”€â”€ Religath font */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(12px, 1.1vw, 15px)' : (isTablet ? 'clamp(18px, 2.5vw, 24px)' : 'clamp(13px, 1.8vw, 16px)'),
            letterSpacing: '0.10em',
            color: C.primary,
            margin: `1px 0 ${isDesktop ? '10px' : '8px'} 0`,
          }}
        >
          {data.weddingTime || '09:00 AM - 10:30 AM'}
        </motion.p>

        {/* 11. Pin / location icon */}
        <motion.div variants={lineAnim} style={{ marginBottom: isDesktop ? 6 : (isTablet ? 8 : 5) }}>
          <svg
            viewBox="0 0 24 24"
            width={isDesktop ? 16 : (isTablet ? 22 : 14)}
            height={isDesktop ? 16 : (isTablet ? 22 : 14)}
            fill={C.secondary}
            aria-hidden="true"
            style={{ opacity: 0.8 }}
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </motion.div>

        {/* 12. Full address */}
        <motion.div
          variants={lineAnim}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            maxWidth: isDesktop ? '90%' : (isTablet ? '80%' : '90%'),
            width: '100%',
            margin: '0 auto',
          }}
        >
          {(() => {
            const lines = data.addressParts
              ? (isDesktop ? data.addressParts.desktop : data.addressParts.mobile)
              : null

            if (lines && lines.length > 0) {
              return lines.map((line, idx) => {
                const cleanLine = line.replace(/\b\d{6}\b/g, '').replace(/,\s*$/, '').trim()
                if (!cleanLine) return null
                return (
                  <p
                    key={idx}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 600,
                      fontSize: isDesktop ? 'clamp(11px, 1.2vw, 14px)' : (isTablet ? 'clamp(18px, 2.4vw, 23px)' : 'clamp(12px, 1.8vw, 15px)'),
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: C.primary,
                      margin: 0,
                      lineHeight: 1.45,
                      opacity: 0.95,
                    }}
                  >
                    {cleanLine}
                  </p>
                )
              })
            }
            return (
              <>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: isDesktop ? '13px' : (isTablet ? '22px' : '13px'),
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.primary,
                  margin: 0,
                  lineHeight: 1.45,
                }}>
                  {data.venueName}
                </p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: isDesktop ? '11px' : (isTablet ? '18px' : '11px'),
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.primary,
                  margin: 0,
                  lineHeight: 1.45,
                  opacity: 0.82,
                }}>
                  {data.venueCity}
                </p>
              </>
            )
          })()}
        </motion.div>
      </motion.div>

      {/* â”€â”€ Scroll indicator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1.2 }}
        style={{
          position: 'absolute',
          bottom: isDesktop ? '20px' : '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 24 24" width={isDesktop ? 16 : 14} height={isDesktop ? 16 : 14} fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.75 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 2. OUR STORY SECTION (Uses Photo Moments Background & Same Typography)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function OurStorySection({ data, isDesktop }) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024
  const bgImg = isDesktop ? photoBgDesktop : photoBgMobile

  return (
    <section
      id="story"
      aria-label="Our Story"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: isDesktop ? '14svh 24px 10svh' : (isTablet ? '14svh 36px 10svh' : '12svh 24px 8svh'),
        boxSizing: 'border-box',
      }}
    >
      <img
        src={bgImg}
        alt="Texture"
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
          maxWidth: isDesktop ? 680 : (isTablet ? 560 : 360),
        }}
      >
        {/* Section Label — Modernline calligraphy */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(22px, 2.2vw, 30px)' : (isTablet ? 'clamp(28px, 3.5vw, 36px)' : 'clamp(22px, 5vw, 28px)'),
            color: '#4A3E20',
            margin: '0 0 6px 0',
            lineHeight: 1,
            textTransform: 'none',
          }}
        >
          {data.sectionLabel || "Our Story"}
        </motion.p>

        <motion.div variants={lineAnim}>
          <LotusDivider />
        </motion.div>

        {/* Heading — Religath serif */}
        <motion.h2
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(20px, 2.4vw, 30px)' : (isTablet ? 'clamp(26px, 3.6vw, 34px)' : 'clamp(18px, 4.8vw, 24px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '14px 0 16px 0',
            lineHeight: 1.25,
            letterSpacing: '0.04em',
          }}
        >
          {data.heading}
        </motion.h2>

        {/* Paragraphs — Cormorant Garamond */}
        <motion.div
          variants={lineAnim}
          style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}
        >
          {data.paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: isDesktop ? 'clamp(14px, 1.3vw, 17px)' : (isTablet ? 'clamp(17px, 2.2vw, 20px)' : 'clamp(13px, 3.8vw, 15px)'),
                color: '#4A3E20',
                lineHeight: 1.6,
                margin: 0,
                opacity: 0.9,
              }}
            >
              {para}
            </p>
          ))}
        </motion.div>

        {/* Quote */}
        {data.quote && (
          <motion.p
            variants={lineAnim}
            style={{
              fontFamily: "'Modernline', sans-serif",
              fontSize: isDesktop ? 'clamp(16px, 1.6vw, 22px)' : (isTablet ? 'clamp(20px, 2.5vw, 26px)' : 'clamp(16px, 4.2vw, 20px)'),
              color: '#B09060',
              margin: '10px 0 0 0',
              lineHeight: 1.3,
            }}
          >
            {data.quote}
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 3. PREMIUM GILDED ROYAL PHOTO MOMENTS SECTION (Single Screen Layout)
// ═══════════════════════════════════════════════════════════════════

/*
 * Design: High-End Royal Gilded Photo Gallery (Sunflower & Midnight Waltz hybrid).
 * - All 3 photos appear simultaneously in a single screen (no multi-screen scroll lock).
 * - Mobile: Cascading artistic tiered layout with elegant tilts, overlapping gracefully.
 * - Desktop: Balanced luxury 3-frame art gallery trio.
 * - Bespoke frame details: Double gold inset borders, Victorian Lotus corner filigrees,
 *   3D Gold Wax Seal Heart medallion, film-grain texture, and golden light sweep.
 * - Smooth staggered whileInView entry animations.
 */

// ── Decorative Gold Corner Filigree ──
function GoldCornerFiligree({ position = 'top-left', size = 22, color = '#B58A3C' }) {
  const transforms = {
    'top-left': 'rotate(0deg)',
    'top-right': 'rotate(90deg)',
    'bottom-right': 'rotate(180deg)',
    'bottom-left': 'rotate(270deg)',
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: transforms[position] }}
    >
      <path d="M2 2 L2 11 Q2 6 7 4 L11 2 Z" fill={color} opacity="0.35" />
      <path d="M2 2 C2 9 5 13 11 15" stroke={color} strokeWidth="0.8" opacity="0.55" fill="none" />
      <path d="M2 2 C4 7 7 9 15 11" stroke={color} strokeWidth="0.6" opacity="0.4" fill="none" />
      <circle cx="2.5" cy="2.5" r="1.3" fill={color} opacity="0.6" />
    </svg>
  )
}

// ── Postage Stamp Frame Component (Delicate, Compact Real-Stamp Proportions) ──
function PostageStampCard({ image, alt, isDesktop }) {
  const toothRadius = isDesktop ? 3.5 : 2.5
  const toothSpacing = isDesktop ? 12 : 9
  const bgPaper = '#FAF6EE'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: `
          radial-gradient(circle at 50% 0, transparent ${toothRadius}px, ${bgPaper} ${toothRadius + 0.4}px) top / ${toothSpacing}px ${toothSpacing * 0.65}px repeat-x,
          radial-gradient(circle at 50% 100%, transparent ${toothRadius}px, ${bgPaper} ${toothRadius + 0.4}px) bottom / ${toothSpacing}px ${toothSpacing * 0.65}px repeat-x,
          radial-gradient(circle at 0 50%, transparent ${toothRadius}px, ${bgPaper} ${toothRadius + 0.4}px) left / ${toothSpacing * 0.65}px ${toothSpacing}px repeat-y,
          radial-gradient(circle at 100% 50%, transparent ${toothRadius}px, ${bgPaper} ${toothRadius + 0.4}px) right / ${toothSpacing * 0.65}px ${toothSpacing}px repeat-y,
          linear-gradient(${bgPaper}, ${bgPaper}) center / calc(100% - ${toothSpacing * 1.15}px) calc(100% - ${toothSpacing * 1.15}px) no-repeat
        `,
        padding: isDesktop ? '10px 10px 16px 10px' : '7px 7px 12px 7px',
        boxSizing: 'border-box',
      }}
    >
      {/* Inner Photo Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3/4',
          overflow: 'hidden',
          borderRadius: '1px',
          background: '#EDE3D0',
          boxShadow: 'inset 0 0 8px rgba(45, 30, 10, 0.15), 0 0.5px 1.5px rgba(0, 0, 0, 0.06)',
        }}
      >
        <img
          src={image}
          alt={alt || "Moment"}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
          loading="lazy"
        />
        {/* Subtle Ambient Film Grain */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='2'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

// ── Main Section: Single Screen Cascading Photo Gallery ──
function WatercolorMomentsSection({ data, isDesktop }) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024
  const bgImg = isDesktop ? photoBgDesktop : photoBgMobile

  const defaultPhotos = [
    {
      id: 1,
      image: "/assets/templates/midnight-waltz/sample-photo-1.webp",
    },
    {
      id: 2,
      image: "/assets/templates/midnight-waltz/sample-photo-2.webp",
    },
    {
      id: 3,
      image: "/assets/templates/midnight-waltz/sample-photo-3.webp",
    },
  ]

  const photos = data?.photos && data.photos.length >= 3 ? data.photos : defaultPhotos

  const viewport = { once: false, amount: 0.15 }

  const headerContainerAnim = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const headerItemAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      id="moments"
      aria-label="Our Moments"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: isDesktop
          ? '7svh 20px 5svh'
          : (isTablet ? '6svh 24px 4svh' : '5svh 14px 4svh'),
        boxSizing: 'border-box',
      }}
    >
      {/* Background Texture with warm gold gradient overlay */}
      <img
        src={bgImg}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: 'rotate(180deg)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        loading="lazy"
      />

      {/* Subtle Warm Amber Vignette Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(255, 248, 230, 0.35) 0%, rgba(245, 235, 210, 0.15) 50%, rgba(74, 62, 32, 0.08) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── 1. Header: Section Titles ── */}
      <motion.div
        variants={headerContainerAnim}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: isDesktop ? 680 : (isTablet ? 540 : 340),
          width: '100%',
          margin: '0 auto',
          flexShrink: 0,
        }}
      >
        <motion.p
          variants={headerItemAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(22px, 2.2vw, 28px)' : (isTablet ? 'clamp(22px, 2.8vw, 26px)' : 'clamp(18px, 4.2vw, 23px)'),
            color: '#4A3E20',
            margin: '0 0 2px 0',
            lineHeight: 1.1,
            textTransform: 'none',
          }}
        >
          {data?.sectionLabel || "Our Moments"}
        </motion.p>

        <motion.div variants={headerItemAnim} style={{ margin: '2px 0 4px' }}>
          <LotusDivider color="#B09060" />
        </motion.div>

        <motion.h2
          variants={headerItemAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(16px, 1.6vw, 21px)' : (isTablet ? 'clamp(17px, 2.2vw, 22px)' : 'clamp(14px, 3.4vw, 17px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '0 0 2px 0',
            lineHeight: 1.2,
            letterSpacing: '0.08em',
            fontWeight: 'normal',
          }}
        >
          {data?.heading || "Glimpses of Forever"}
        </motion.h2>

        {data?.subtitle && (
          <motion.p
            variants={headerItemAnim}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: isDesktop ? '13px' : (isTablet ? '13px' : '11px'),
              color: '#4A3E20',
              opacity: 0.75,
              margin: '2px 0 0 0',
              lineHeight: 1.2,
            }}
          >
            {data.subtitle}
          </motion.p>
        )}
      </motion.div>

      {/* ── 2. Photo Cards Gallery Container ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: isDesktop ? '940px' : (isTablet ? '640px' : '360px'),
          margin: 'auto 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* DESKTOP / TABLET ROW LAYOUT */}
        {isDesktop || isTablet ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: isDesktop ? '26px' : '16px',
              padding: '0 10px',
            }}
          >
            {/* CARD 0 (Left - Tilt -3.5deg) */}
            {photos[0] && (
              <motion.div
                initial={{ opacity: 0, x: -40, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                style={{
                  width: isDesktop ? '210px' : '155px',
                  rotate: -3.5,
                  zIndex: 1,
                  filter: 'drop-shadow(0px 8px 14px rgba(40, 28, 10, 0.20)) drop-shadow(0px 2px 5px rgba(40, 28, 10, 0.10))',
                }}
                whileHover={{ rotate: 0, y: -6, scale: 1.03, zIndex: 15 }}
              >
                <PostageStampCard
                  image={photos[0].image}
                  alt={photos[0].title || "Moment 1"}
                  isDesktop={isDesktop}
                />
              </motion.div>
            )}

            {/* CARD 1 (Centerpiece - Straight/Tilt +1.5deg) */}
            {photos[1] && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={viewport}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
                style={{
                  width: isDesktop ? '225px' : '165px',
                  rotate: 1.5,
                  zIndex: 10,
                  position: 'relative',
                  filter: 'drop-shadow(0px 10px 18px rgba(40, 28, 10, 0.22)) drop-shadow(0px 3px 6px rgba(40, 28, 10, 0.12))',
                }}
                whileHover={{ rotate: 0, y: -8, scale: 1.04, zIndex: 20 }}
              >
                <PostageStampCard
                  image={photos[1].image}
                  alt={photos[1].title || "Moment 2"}
                  isDesktop={isDesktop}
                />
              </motion.div>
            )}

            {/* CARD 2 (Right - Tilt +3.5deg) */}
            {photos[2] && (
              <motion.div
                initial={{ opacity: 0, x: 40, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                style={{
                  width: isDesktop ? '210px' : '155px',
                  rotate: 3.5,
                  zIndex: 2,
                  filter: 'drop-shadow(0px 8px 14px rgba(40, 28, 10, 0.20)) drop-shadow(0px 2px 5px rgba(40, 28, 10, 0.10))',
                }}
                whileHover={{ rotate: 0, y: -6, scale: 1.03, zIndex: 15 }}
              >
                <PostageStampCard
                  image={photos[2].image}
                  alt={photos[2].title || "Moment 3"}
                  isDesktop={isDesktop}
                />
              </motion.div>
            )}
          </div>
        ) : (
          /* MOBILE ELEGANT TOP-TO-BOTTOM CASCADING STAMPS */
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '340px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '0 auto',
              padding: '6px 0',
            }}
          >
            {/* CARD 0 (Top-Mid Area - Tilt -3.5deg) */}
            {photos[0] && (
              <motion.div
                initial={{ opacity: 0, x: -35, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                style={{
                  width: '58%',
                  maxWidth: '195px',
                  marginRight: '28%',
                  rotate: -3.5,
                  zIndex: 10,
                  filter: 'drop-shadow(0px 8px 14px rgba(40, 28, 10, 0.20)) drop-shadow(0px 2px 4px rgba(40, 28, 10, 0.10))',
                }}
              >
                <PostageStampCard
                  image={photos[0].image}
                  alt={photos[0].title || "Moment 1"}
                  isDesktop={false}
                />
              </motion.div>
            )}

            {/* CARD 1 (Mid Area - Tilt +3.5deg) */}
            {photos[1] && (
              <motion.div
                initial={{ opacity: 0, x: 35, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
                style={{
                  width: '60%',
                  maxWidth: '205px',
                  marginLeft: '28%',
                  marginTop: '-12%',
                  rotate: 3.5,
                  zIndex: 20,
                  filter: 'drop-shadow(0px 8px 14px rgba(40, 28, 10, 0.20)) drop-shadow(0px 2px 4px rgba(40, 28, 10, 0.10))',
                }}
              >
                <PostageStampCard
                  image={photos[1].image}
                  alt={photos[1].title || "Moment 2"}
                  isDesktop={false}
                />
              </motion.div>
            )}

            {/* CARD 2 (Bottom Area - Tilt -2.5deg) */}
            {photos[2] && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                style={{
                  width: '58%',
                  maxWidth: '195px',
                  marginRight: '16%',
                  marginTop: '-12%',
                  rotate: -2.5,
                  zIndex: 30,
                  filter: 'drop-shadow(0px 8px 14px rgba(40, 28, 10, 0.20)) drop-shadow(0px 2px 4px rgba(40, 28, 10, 0.10))',
                }}
              >
                <PostageStampCard
                  image={photos[2].image}
                  alt={photos[2].title || "Moment 3"}
                  isDesktop={false}
                />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. Subtle Bottom Ornament ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          opacity: 0.6,
          margin: '0 auto',
          flexShrink: 0,
        }}
      >
        <LotusOrnament size={isDesktop ? 12 : 9} color="#B09060" />
      </div>
    </section>
  )
}



// ═══════════════════════════════════════════════════════════════════
// 4. WELCOME SECTION (Editable Typography Over Temple Background)
// ═══════════════════════════════════════════════════════════════════
function WelcomeSection({ data, isDesktop }) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024
  const bgImg = isDesktop ? messageBgDesktop : messageBgMobile

  return (
    <section
      id="welcome"
      aria-label="Welcome"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={bgImg}
        alt=""
        aria-hidden="true"
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

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.35 } } }}
        style={{
          position: 'relative',
          zIndex: 2,
          marginInline: isDesktop ? 'auto' : 'none',
          marginLeft: isDesktop ? 'auto' : (isTablet ? '8%' : '6%'),
          marginRight: isDesktop ? 'auto' : 'none',
          width: isDesktop ? 'clamp(280px, 60%, 800px)' : (isTablet ? '50%' : '72%'),
          maxWidth: isDesktop ? 680 : (isTablet ? 450 : 320),
          display: 'flex',
          flexDirection: 'column',
          alignItems: isDesktop ? 'center' : 'flex-start',
          textAlign: isDesktop ? 'center' : 'left',
          paddingTop: isDesktop ? '0' : '15svh',
          paddingBottom: isDesktop ? '0' : '10svh',
        }}
      >
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(18px, 1.8vw, 24px)' : (isTablet ? 'clamp(32px, 4vw, 38px)' : 'clamp(20px, 4.2vw, 24px)'),
            color: '#4A3E20',
            margin: '0 0 6px 0',
            lineHeight: 1,
            textTransform: 'none',
          }}
        >
          {data.label || "Welcome"}
        </motion.p>

        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(28px, 3.2vw, 38px)' : (isTablet ? 'clamp(36px, 5vw, 44px)' : 'clamp(20px, 5vw, 24px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '0 0 2px 0',
            lineHeight: 1.1,
            letterSpacing: '0.04em',
          }}
        >
          {data.headingLine1 || "Dear Friends"}
        </motion.p>

        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(28px, 3.2vw, 38px)' : (isTablet ? 'clamp(36px, 5vw, 44px)' : 'clamp(20px, 5vw, 24px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '0 0 10px 0',
            lineHeight: 1.1,
            letterSpacing: '0.04em',
          }}
        >
          {data.headingLine2 || "& Family,"}
        </motion.p>

        <motion.div
          variants={lineAnim}
          style={{
            width: 44,
            height: 0.75,
            background: '#B09060',
            opacity: 0.55,
            marginBottom: 12,
            marginInline: isDesktop ? 'auto' : '0'
          }}
        />

        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: isDesktop ? 'clamp(16px, 1.5vw, 20px)' : (isTablet ? 'clamp(20px, 2.8vw, 24px)' : 'clamp(13px, 3.8vw, 15px)'),
            color: '#4A3E20',
            lineHeight: 1.45,
            margin: 0,
            opacity: 0.9,
            maxWidth: '100%',
          }}
        >
          {data.message}
        </motion.p>

        <motion.div variants={lineAnim} style={{ alignSelf: isDesktop ? 'center' : 'flex-start', marginTop: 10 }}>
          <LotusDivider />
        </motion.div>
      </motion.div>
    </section>
  )
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 4. VENUE SECTION (Duplicated across Haldi/Mehendi, Reception, Wedding)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function SingleEventVenueSection({ event, isDesktop }) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024
  const mapUrl = event.mapUrl || '#'
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(mapUrl)}&size=200x200&color=3F4930&bgcolor=FDFBF7&qzone=2&format=png`

  const addrParts = []
  if (event.venueLine1) addrParts.push(event.venueLine1)
  if (event.venueLine2) addrParts.push(event.venueLine2)

  return (
    <section
      id={event.id || "venue"}
      aria-label={event.eventName || event.sectionLabel}
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
      <img
        src={isDesktop ? (event.bgDesktop || locationBgDesktop) : (event.bgMobile || locationBgMobile)}
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
        {/* Section Label â€” Modernline calligraphy */}
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
          {event.sectionLabel || "Our Venue"}
        </motion.p>

        <motion.div variants={lineAnim}>
          <LotusDivider />
        </motion.div>

        {/* Venue Name â€” Religath serif */}
        <motion.h2
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(22px, 2.6vw, 32px)' : (isTablet ? 'clamp(32px, 4.5vw, 40px)' : 'clamp(22px, 5.5vw, 28px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '14px 0 6px 0',
            lineHeight: 1.15,
            letterSpacing: '0.04em',
            maxWidth: '100%',
          }}
        >
          {event.venueName}
        </motion.h2>

        {/* Date & Time Line */}
        {event.dateTimeLine && (
          <motion.p
            variants={lineAnim}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: isDesktop ? 'clamp(14px, 1.3vw, 17px)' : (isTablet ? 'clamp(16px, 2vw, 19px)' : 'clamp(13px, 3.8vw, 15px)'),
              color: '#B09060',
              margin: '0 0 8px 0',
              letterSpacing: '0.05em',
            }}
          >
            {event.dateTimeLine}
          </motion.p>
        )}

        {/* Address Lines â€” Cormorant Garamond */}
        <motion.div
          variants={lineAnim}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 16 }}
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
          {event.dressCode && (
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: isDesktop ? 12 : 11,
                color: '#7A6840',
                margin: '4px 0 0 0',
                fontStyle: 'italic',
              }}
            >
              Dress Code: {event.dressCode}
            </p>
          )}
        </motion.div>

        {/* QR Code */}
        <motion.div
          variants={lineAnim}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 18 }}
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 5. CELEBRATE & BLESS US (RSVP & Registry â€” Full Screen)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function CelebrateAndBlessSection({ data, isDesktop }) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024
  const bgImg = isDesktop ? photoBgDesktop : photoBgMobile

  return (
    <section
      id="celebrate"
      aria-label="Celebrate & Bless Us"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: isDesktop ? '14svh 24px 10svh' : (isTablet ? '14svh 36px 10svh' : '12svh 24px 8svh'),
        boxSizing: 'border-box',
      }}
    >
      <img
        src={bgImg}
        alt="Texture"
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
          maxWidth: isDesktop ? 680 : (isTablet ? 560 : 360),
        }}
      >
        {/* Label â€” Modernline */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(22px, 2.2vw, 30px)' : (isTablet ? 'clamp(28px, 3.5vw, 36px)' : 'clamp(22px, 5vw, 28px)'),
            color: '#4A3E20',
            margin: '0 0 6px 0',
            lineHeight: 1,
            textTransform: 'none',
          }}
        >
          {data.sectionLabel || "Celebrate & Bless Us"}
        </motion.p>

        <motion.div variants={lineAnim}>
          <LotusDivider />
        </motion.div>

        {/* Heading â€” Religath */}
        <motion.h2
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(22px, 2.6vw, 32px)' : (isTablet ? 'clamp(28px, 3.8vw, 36px)' : 'clamp(20px, 5vw, 26px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '14px 0 10px 0',
            lineHeight: 1.2,
            letterSpacing: '0.04em',
          }}
        >
          {data.heading || "RSVP & Gift Registry"}
        </motion.h2>

        {/* Subtitle â€” Cormorant Garamond */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: isDesktop ? 'clamp(14px, 1.3vw, 17px)' : (isTablet ? 'clamp(17px, 2.2vw, 20px)' : 'clamp(13px, 3.8vw, 15px)'),
            color: '#4A3E20',
            lineHeight: 1.5,
            margin: '0 0 28px 0',
            opacity: 0.9,
            maxWidth: 520,
          }}
        >
          {data.subtitle}
        </motion.p>

        {/* Two Action Cards / Buttons */}
        <motion.div
          variants={lineAnim}
          style={{
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            width: '100%',
            maxWidth: 560,
          }}
        >
          {data.rsvp?.enabled && (
            <div
              style={{
                flex: 1,
                width: '100%',
                background: 'rgba(253, 251, 247, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(176, 144, 96, 0.5)',
                borderRadius: 8,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(176, 144, 96, 0.12)',
              }}
            >
              <span
                style={{
                  fontFamily: "'Religath', serif",
                  fontSize: 18,
                  textTransform: 'uppercase',
                  color: '#7A6840',
                  marginBottom: 6,
                  letterSpacing: '0.05em',
                }}
              >
                {data.rsvp.title}
              </span>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#4A3E20',
                  lineHeight: 1.4,
                  margin: '0 0 16px 0',
                  opacity: 0.85,
                  minHeight: 36,
                }}
              >
                {data.rsvp.description}
              </p>
              <a
                href={data.rsvp.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  background: '#7A6840',
                  color: '#FDFBF7',
                  border: '1px solid #7A6840',
                  borderRadius: 4,
                  padding: '10px 18px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(122, 104, 64, 0.25)',
                  cursor: 'pointer',
                }}
              >
                {data.rsvp.buttonLabel || "RSVP Online"}
              </a>
            </div>
          )}

          {data.registry?.enabled && (
            <div
              style={{
                flex: 1,
                width: '100%',
                background: 'rgba(253, 251, 247, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(176, 144, 96, 0.5)',
                borderRadius: 8,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(176, 144, 96, 0.12)',
              }}
            >
              <span
                style={{
                  fontFamily: "'Religath', serif",
                  fontSize: 18,
                  textTransform: 'uppercase',
                  color: '#7A6840',
                  marginBottom: 6,
                  letterSpacing: '0.05em',
                }}
              >
                {data.registry.title}
              </span>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#4A3E20',
                  lineHeight: 1.4,
                  margin: '0 0 16px 0',
                  opacity: 0.85,
                  minHeight: 36,
                }}
              >
                {data.registry.description}
              </p>
              <a
                href={data.registry.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  background: '#FDFBF7',
                  color: '#7A6840',
                  border: '1px solid #7A6840',
                  borderRadius: 4,
                  padding: '10px 18px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(176, 144, 96, 0.12)',
                  cursor: 'pointer',
                }}
              >
                {data.registry.buttonLabel || "View Registry"}
              </a>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MAIN TEMPLATE COMPONENT (Pavitra & Sri Customization)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export default function CustomMidnightWaltzPavitraSri() {
  const { variant } = useParams()
  const [searchParams] = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true'
  const codeParam = searchParams.get('code') || (!['1', '2', 'full', 'wedding'].includes(variant) ? variant : null)
  const { draftData } = useDraft()
  const [liveInvite, setLiveInvite] = useState(null)
  const [showSplash, setShowSplash] = useState(!isPreview)

  useEffect(() => {
    if (!isPreview) {
      const timer = setTimeout(() => setShowSplash(false), 900)
      return () => clearTimeout(timer)
    }
  }, [isPreview])

  useEffect(() => {
    if (codeParam && !isPreview) {
      fetch(`${API_URL}/api/invites/${codeParam}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setLiveInvite(data)
        })
        .catch(() => {})
    }
  }, [codeParam, isPreview])

  // Merge live data, custom editor data, or draft data with base pavitraSriData
  const data = useMemo(() => {
    let customLocal = null
    const varKey = variant || '1'
    try {
      const savedVar = localStorage.getItem(`inviteque_custom_data_midnight-waltz_Pavitra-Sri_v${varKey}`)
      if (savedVar) {
        customLocal = JSON.parse(savedVar)
      } else {
        const savedFallback = localStorage.getItem('inviteque_custom_data_midnight-waltz_pavitra-sri')
        if (savedFallback) customLocal = JSON.parse(savedFallback)
      }
    } catch (e) {}

    const base = pavitraSriData
    const dynamicSource = isPreview 
      ? draftData 
      : (customLocal || liveInvite || (draftData?.code === codeParam ? draftData : null))

    if (!dynamicSource) return base

    // Map dynamic fields gracefully over base
    const groom = dynamicSource.groomName || dynamicSource.coupleData?.groomName || base.hero.groomName
    const bride = dynamicSource.brideName || dynamicSource.coupleData?.brideName || base.hero.brideName
    const day = dynamicSource.weddingDate || dynamicSource.heroData?.weddingDate || base.hero.weddingDate
    const month = dynamicSource.weddingMonth || dynamicSource.heroData?.weddingMonth || base.hero.weddingMonth
    const year = dynamicSource.weddingYear || dynamicSource.heroData?.weddingYear || base.hero.weddingYear
    const time = dynamicSource.weddingTime || dynamicSource.heroData?.weddingTime || base.hero.weddingTime
    const mahal = dynamicSource.mahalName || dynamicSource.venueData?.mahalName || base.events[0]?.venueName
    const addr = dynamicSource.venueAddress || dynamicSource.venueData?.venueAddress || base.events[0]?.venueLine1
    const cityState = `${dynamicSource.venueCity || dynamicSource.venueData?.venueCity || ''}${dynamicSource.state || dynamicSource.venueData?.state ? ', ' + (dynamicSource.state || dynamicSource.venueData?.state) : ''}`.trim() || base.events[0]?.venueLine2
    const map = dynamicSource.mapLink || dynamicSource.venueData?.mapLink || base.events[0]?.mapUrl

    // Photos
    let mappedPhotos = base.moments.photos
    if (dynamicSource.photos && Array.isArray(dynamicSource.photos) && dynamicSource.photos.filter(Boolean).length >= 3) {
      mappedPhotos = dynamicSource.photos.slice(0, 3).map((img, i) => ({ id: i + 1, image: img }))
    } else if (dynamicSource.storyData?.photos && Array.isArray(dynamicSource.storyData.photos) && dynamicSource.storyData.photos.filter(Boolean).length >= 3) {
      mappedPhotos = dynamicSource.storyData.photos.slice(0, 3).map((img, i) => ({ id: i + 1, image: img }))
    }

    // Events
    let mappedEvents = base.events
    if (dynamicSource.events && Array.isArray(dynamicSource.events) && dynamicSource.events.length > 0) {
      mappedEvents = dynamicSource.events
    } else if (dynamicSource.scheduleItems || dynamicSource.scheduleData?.items) {
      const rawSchedule = dynamicSource.scheduleItems || dynamicSource.scheduleData?.items
      if (rawSchedule && rawSchedule.length > 0) {
        mappedEvents = rawSchedule.map((item, idx) => ({
          id: `evt-${idx + 1}`,
          label: item.title || 'Ceremony',
          eventName: item.title || 'Ceremony',
          date: `${day} ${month} ${year}`.trim(),
          time: item.time || time,
          venueName: mahal,
          venueLine1: addr,
          venueLine2: cityState,
          mapUrl: map,
          isWeddingOnly: idx === 0
        }))
      }
    }

    const currentCode = codeParam || dynamicSource.code || 'PAVITRASRI'

    return {
      ...base,
      hero: {
        ...base.hero,
        groomName: groom,
        brideName: bride,
        weddingDate: day,
        weddingMonth: month,
        weddingYear: year,
        weddingTime: time,
        subtitle: dynamicSource.heroSubtitle || base.hero.subtitle,
      },
      story: {
        ...base.story,
        quote: dynamicSource.storyQuote || dynamicSource.customSectionSubtitle || base.story.quote,
        message: dynamicSource.storyMessage || dynamicSource.customSectionContent || base.story.message,
      },
      moments: {
        ...base.moments,
        photos: mappedPhotos
      },
      welcome: {
        ...base.welcome,
        label: dynamicSource.welcomeLabel || base.welcome.label,
        headingLine1: dynamicSource.welcomeHeading1 || base.welcome.headingLine1,
        headingLine2: dynamicSource.welcomeHeading2 || base.welcome.headingLine2,
        message: dynamicSource.welcomeMessage || dynamicSource.familyMessage || dynamicSource.invitationData?.familyMessage || base.welcome.message,
      },
      events: mappedEvents,
      countdown: {
        ...base.countdown,
        targetDate: dynamicSource.countdownTargetDate || (day && month && year ? `${year}-${month}-${day}` : base.countdown.targetDate)
      },
      celebrate: {
        ...base.celebrate,
        rsvp: {
          ...base.celebrate.rsvp,
          title: dynamicSource.rsvpTitle || base.celebrate.rsvp.title,
          description: dynamicSource.rsvpDescription || base.celebrate.rsvp.description,
          buttonLabel: dynamicSource.rsvpButtonLabel || base.celebrate.rsvp.buttonLabel,
          url: dynamicSource.rsvpUrl || `/templates/midnight-waltz/${currentCode}/RSVP`
        },
        registry: {
          ...base.celebrate.registry,
          title: dynamicSource.registryTitle || base.celebrate.registry.title,
          description: dynamicSource.registryDescription || base.celebrate.registry.description,
          buttonLabel: dynamicSource.registryButtonLabel || base.celebrate.registry.buttonLabel,
          url: dynamicSource.registryUrl || base.celebrate.registry.url,
          enabled: dynamicSource.hasRegistry !== undefined ? dynamicSource.hasRegistry : base.celebrate.registry.enabled
        }
      },
      sections: dynamicSource.sections ? { ...base.sections, ...dynamicSource.sections } : {
        showHero: dynamicSource.showHero !== undefined ? dynamicSource.showHero : true,
        showStory: dynamicSource.showStory !== undefined ? dynamicSource.showStory : (dynamicSource.showCustomSection ?? true),
        showGallery: dynamicSource.showGallery !== undefined ? dynamicSource.showGallery : true,
        showWelcome: dynamicSource.showWelcome !== undefined ? dynamicSource.showWelcome : true,
        showVenue: dynamicSource.showVenue !== undefined ? dynamicSource.showVenue : (dynamicSource.showSchedule ?? true),
        showCountdown: dynamicSource.showCountdown !== undefined ? dynamicSource.showCountdown : true,
        hasRsvp: dynamicSource.hasRsvp !== undefined ? dynamicSource.hasRsvp : true,
      }
    }
  }, [variant, codeParam, isPreview, draftData, liveInvite])

  // Filter events based on variant:
  // Variant "2" = Wedding ceremony venue only
  // Variant "1" (or default) = All configured venue sections (Haldi & Mehendi, Reception, Wedding)
  const filteredEvents = useMemo(() => {
    if (variant === '2') {
      return data.events.filter(e => e.isWeddingOnly === true)
    }
    return data.events
  }, [variant, data.events])

  const sections = data.sections || {
    showHero: true,
    showStory: true,
    showGallery: true,
    showWelcome: true,
    showVenue: true,
    showCountdown: true,
    hasRsvp: true,
  }

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-[#4A3E20]">
      {/* Luxury Splash Screen overlay (Identical to other templates) */}
      <SplashScreen loading={showSplash} />

      {/* ── MOBILE VIEW ── */}
      <div className="lg:hidden flex justify-center items-start min-h-screen bg-[#F0E8D8]">
        <div className="relative w-full max-w-[768px] min-h-[100svh] bg-[#FDFBF7] shadow-[0_0_60px_rgba(0,0,0,0.10)]">
          {/* 1. Hero Section */}
          {sections.showHero !== false && (
            <MidnightWaltzHero data={data.hero} isDesktop={false} />
          )}

          {/* 2. Our Story Section */}
          {sections.showStory !== false && (
            <OurStorySection data={data.story} isDesktop={false} />
          )}

          {/* 3. Watercolor Photo Moments Section */}
          {sections.showGallery !== false && (
            <WatercolorMomentsSection data={data.moments} isDesktop={false} />
          )}

          {/* 4. Welcome Invitation Section */}
          {sections.showWelcome !== false && (
            <WelcomeSection data={data.welcome} isDesktop={false} />
          )}

          {/* 5. Multi-Event Venues */}
          {sections.showVenue !== false && filteredEvents.map((event) => (
            <SingleEventVenueSection key={event.id} event={event} isDesktop={false} />
          ))}

          {/* 6. Live Countdown Timer */}
          {sections.showCountdown !== false && (
            <Countdown
              data={data.countdown}
              bgImage={countdownBgMobile}
              theme="traditional"
              position="bottom"
              isDesktop={false}
            />
          )}

          {/* 7. Celebrate & Bless Us (RSVP & Registry) */}
          {sections.hasRsvp !== false && (
            <CelebrateAndBlessSection data={data.celebrate} isDesktop={false} />
          )}

          {/* 8. Footer */}
          <Footer data={data.footer} theme="traditional" isDesktop={false} />
        </div>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="hidden lg:block w-full min-h-screen bg-[#FDFBF7] relative">
        {/* 1. Hero Section */}
        {sections.showHero !== false && (
          <div className="w-full">
            <MidnightWaltzHero data={data.hero} isDesktop={true} />
          </div>
        )}

        {/* 2. Our Story Section */}
        {sections.showStory !== false && (
          <div className="w-full">
            <OurStorySection data={data.story} isDesktop={true} />
          </div>
        )}

        {/* 3. Watercolor Photo Moments Section */}
        {sections.showGallery !== false && (
          <div className="w-full">
            <WatercolorMomentsSection data={data.moments} isDesktop={true} />
          </div>
        )}

        {/* 4. Welcome Invitation Section */}
        {sections.showWelcome !== false && (
          <div className="w-full">
            <WelcomeSection data={data.welcome} isDesktop={true} />
          </div>
        )}

        {/* 5. Multi-Event Venues */}
        {sections.showVenue !== false && filteredEvents.map((event) => (
          <div key={event.id} className="w-full">
            <SingleEventVenueSection event={event} isDesktop={true} />
          </div>
        ))}

        {/* 6. Live Countdown Timer */}
        {sections.showCountdown !== false && (
          <div className="w-full">
            <Countdown
              data={data.countdown}
              bgImage={countdownBgDesktop}
              theme="traditional"
              position="bottom"
              isDesktop={true}
            />
          </div>
        )}

        {/* 7. Celebrate & Bless Us */}
        {sections.hasRsvp !== false && (
          <div className="w-full">
            <CelebrateAndBlessSection data={data.celebrate} isDesktop={true} />
          </div>
        )}

        {/* 8. Footer */}
        <div className="w-full">
          <Footer data={data.footer} theme="traditional" isDesktop={true} />
        </div>
      </div>

    </div>
  )
}
