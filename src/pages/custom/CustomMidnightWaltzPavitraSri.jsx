import { useMemo, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { pavitraSriData } from '../../data/custom/pavitraSriData.js'
import PhotoCardsMidnightWaltz from '../../components/PhotoCardsMidnightWaltz.jsx'
import Countdown from '../../components/Countdown.jsx'
import Footer from '../../components/Footer.jsx'

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
        {/* Section Label â€” Modernline calligraphy */}
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

        {/* Heading â€” Religath serif */}
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

        {/* Paragraphs â€” Cormorant Garamond */}
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 3. PREMIUM GILDED POLAROID PHOTO MOMENTS SECTION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/*
 * Design: Elegant gilded Polaroid-stack.
 * - Three cream-toned Polaroid portrait cards
 * - Ornate double-line gold inset border + corner filigree accents
 * - Scroll-driven parallax stacking: cards fan up from below one-by-one
 * - Gold wax-seal heart badge on the center card
 * - Subtle film-grain texture overlay on each photo
 * - Golden shimmer light sweep on scroll entrance
 * - All 3 visible simultaneously in the final stacked layout
 */

// â”€â”€ Decorative Gold Corner Filigree â”€â”€
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
      <path d="M2 2 L2 10 Q2 6 6 4 L10 2 Z" fill={color} opacity="0.3" />
      <path d="M2 2 C2 8 4 12 10 14" stroke={color} strokeWidth="0.7" opacity="0.5" fill="none" />
      <path d="M2 2 C4 6 6 8 14 10" stroke={color} strokeWidth="0.5" opacity="0.35" fill="none" />
      <circle cx="2.5" cy="2.5" r="1.2" fill={color} opacity="0.5" />
    </svg>
  )
}

// â”€â”€ Gold Wax Seal Heart Badge â”€â”€
function GoldWaxSealHeart({ size = 44 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #D4A74A 0%, #B58A3C 55%, #96703A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(150, 112, 58, 0.4), 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,235,180,0.5)',
        border: '1.5px solid rgba(255, 235, 180, 0.5)',
      }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.48} height={size * 0.48} fill="#FFFDF5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  )
}

// â”€â”€ Single Gilded Polaroid Card â”€â”€
function GildedPolaroidCard({ photo, isDesktop, index = 0, cardStyle = {} }) {
  const isCenter = index === 1

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: 'linear-gradient(170deg, #FEFCF8 0%, #F8F1E4 100%)',
        padding: isDesktop ? '10px 10px 36px 10px' : '7px 7px 28px 7px',
        borderRadius: isDesktop ? '6px' : '5px',
        border: '1px solid rgba(181, 138, 60, 0.3)',
        boxShadow: `
          0 ${isCenter ? '20px 50px' : '14px 36px'} rgba(74, 62, 32, ${isCenter ? '0.2' : '0.14'}),
          0 ${isCenter ? '8px 18px' : '5px 12px'} rgba(197, 168, 128, ${isCenter ? '0.22' : '0.16'}),
          inset 0 1px 0 rgba(255, 255, 255, 0.9)
        `,
        cursor: 'pointer',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
        ...cardStyle,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 28px 65px rgba(74,62,32,0.24), 0 12px 28px rgba(197,168,128,0.28), inset 0 1px 0 rgba(255,255,255,0.9)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Ornate Double Gold Inset Border */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: isDesktop ? '5px 5px 30px 5px' : '4px 4px 24px 4px',
          border: '1px solid rgba(181, 138, 60, 0.35)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: isDesktop ? '8px 8px 33px 8px' : '6px 6px 26px 6px',
          border: '0.5px solid rgba(181, 138, 60, 0.2)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Corner Filigrees */}
      <div style={{ position: 'absolute', top: isDesktop ? 3 : 1, left: isDesktop ? 3 : 1, zIndex: 6 }}>
        <GoldCornerFiligree position="top-left" size={isDesktop ? 20 : 15} />
      </div>
      <div style={{ position: 'absolute', top: isDesktop ? 3 : 1, right: isDesktop ? 3 : 1, zIndex: 6 }}>
        <GoldCornerFiligree position="top-right" size={isDesktop ? 20 : 15} />
      </div>
      <div style={{ position: 'absolute', bottom: isDesktop ? 28 : 22, left: isDesktop ? 3 : 1, zIndex: 6 }}>
        <GoldCornerFiligree position="bottom-left" size={isDesktop ? 20 : 15} />
      </div>
      <div style={{ position: 'absolute', bottom: isDesktop ? 28 : 22, right: isDesktop ? 3 : 1, zIndex: 6 }}>
        <GoldCornerFiligree position="bottom-right" size={isDesktop ? 20 : 15} />
      </div>

      {/* Photo Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3/4',
          overflow: 'hidden',
          background: '#EDE3D0',
          borderRadius: '2px',
        }}
      >
        <img
          src={photo.image}
          alt={photo.title || `Memory ${index + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
          loading="lazy"
        />

        {/* Film Grain Texture Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient Inner Shadow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            boxShadow: 'inset 0 0 20px rgba(74, 62, 32, 0.15), inset 0 -30px 30px rgba(74, 62, 32, 0.06)',
          }}
        />

        {/* Golden Shimmer Light Sweep */}
        <motion.div
          initial={{ x: '-140%', opacity: 0 }}
          whileInView={{ x: '200%', opacity: [0, 0.55, 0] }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 2.0, delay: 0.15 + index * 0.25, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 30%, rgba(255, 238, 195, 0.45) 50%, transparent 70%)',
            pointerEvents: 'none',
            transform: 'skewX(-18deg)',
          }}
        />
      </div>

      {/* Card Footer â€” Lotus Ornament */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginTop: isDesktop ? 10 : 8,
        }}
      >
        <div style={{ width: 18, height: 0.5, background: '#B58A3C', opacity: 0.5 }} />
        <LotusOrnament size={isDesktop ? 9 : 7} color="#B58A3C" />
        <div style={{ width: 18, height: 0.5, background: '#B58A3C', opacity: 0.5 }} />
      </div>

      {/* Wax Seal Heart on center card only */}
      {isCenter && (
        <div
          style={{
            position: 'absolute',
            top: '38%',
            right: isDesktop ? -20 : -16,
            zIndex: 15,
          }}
        >
          <GoldWaxSealHeart size={isDesktop ? 44 : 36} />
        </div>
      )}
    </div>
  )
}

// â”€â”€ Main Section: Scroll-Driven Parallax Photo Stack â”€â”€
function WatercolorMomentsSection({ data, isDesktop }) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024
  const bgImg = isDesktop ? photoBgDesktop : photoBgMobile
  const containerRef = useRef(null)

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

  // Scroll tracking for entry animation (section entering viewport)
  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  })

  // Scroll tracking for stacking animation (once section is pinned)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothEntry = useSpring(entryProgress, { stiffness: 80, damping: 22, mass: 0.3 })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.3 })

  // Card 0: Slides up as section enters viewport
  const card0Y = useTransform(smoothEntry, [0.15, 0.95], ['55vh', '0vh'])
  const card0Op = useTransform(smoothEntry, [0.15, 0.7], [0, 1])
  const card0Scale = useTransform(smoothProgress, [0.3, 0.55], [1, 0.94])

  // Card 1: Slides up from below once scroll begins
  const card1Y = useTransform(smoothProgress, [0.04, 0.32], ['90vh', '0vh'])
  const card1Op = useTransform(smoothProgress, [0.04, 0.18], [0, 1])
  const card1Scale = useTransform(smoothProgress, [0.38, 0.62], [1, 0.96])

  // Card 2: Slides up after Card 1 completes
  const card2Y = useTransform(smoothProgress, [0.35, 0.64], ['90vh', '0vh'])
  const card2Op = useTransform(smoothProgress, [0.35, 0.50], [0, 1])

  // Card rotation angles for the fanned-out polaroid look
  const cardRotations = [-5.5, 3.5, -3]

  // Card dimensions relative to container
  const cardWidth = isDesktop ? '330px' : (isTablet ? '280px' : '72%')

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '270vh' }}
    >
      {/* Sticky viewport container â€” everything visible in one screen */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background Texture */}
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
            pointerEvents: 'none',
          }}
          loading="lazy"
        />

        {/* Header â€” Section Title */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.25 } } }}
          style={{
            position: 'absolute',
            top: isDesktop ? '5%' : '4%',
            zIndex: 10,
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <motion.p
            variants={lineAnim}
            style={{
              fontFamily: "'Modernline', sans-serif",
              fontSize: isDesktop ? 'clamp(22px, 2.2vw, 30px)' : (isTablet ? 'clamp(22px, 2.8vw, 28px)' : 'clamp(20px, 4.8vw, 26px)'),
              color: '#4A3E20',
              margin: '0 0 4px 0',
              lineHeight: 1.1,
              textTransform: 'none',
            }}
          >
            {data?.sectionLabel || "Our Moments"}
          </motion.p>

          <motion.div variants={lineAnim} style={{ margin: '4px 0' }}>
            <LotusDivider />
          </motion.div>

          <motion.h2
            variants={lineAnim}
            style={{
              fontFamily: "'Religath', serif",
              fontSize: isDesktop ? 'clamp(18px, 1.8vw, 24px)' : (isTablet ? 'clamp(20px, 2.6vw, 26px)' : 'clamp(15px, 3.8vw, 19px)'),
              textTransform: 'uppercase',
              color: '#7A6840',
              margin: '6px 0 0 0',
              lineHeight: 1.2,
              letterSpacing: '0.08em',
              fontWeight: 'normal',
            }}
          >
            {data?.heading || "Glimpses of Forever"}
          </motion.h2>
        </motion.div>

        {/* â”€â”€ Parallax Photo Stack â”€â”€ */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: isDesktop ? '480px' : (isTablet ? '380px' : '340px'),
            height: isDesktop ? '400px' : (isTablet ? '360px' : '320px'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            zIndex: 5,
          }}
        >
          {/* Card 0 (Bottom of stack â€” first to appear) */}
          {photos[0] && (
            <motion.div
              style={{
                position: 'absolute',
                width: cardWidth,
                y: card0Y,
                opacity: card0Op,
                scale: card0Scale,
                rotate: cardRotations[0],
                zIndex: 1,
              }}
            >
              <GildedPolaroidCard
                photo={photos[0]}
                isDesktop={isDesktop}
                index={0}
              />
            </motion.div>
          )}

          {/* Card 1 (Middle â€” slides up second, has wax seal) */}
          {photos[1] && (
            <motion.div
              style={{
                position: 'absolute',
                width: cardWidth,
                y: card1Y,
                opacity: card1Op,
                scale: card1Scale,
                rotate: cardRotations[1],
                zIndex: 2,
              }}
            >
              <GildedPolaroidCard
                photo={photos[1]}
                isDesktop={isDesktop}
                index={1}
              />
            </motion.div>
          )}

          {/* Card 2 (Top of stack â€” slides up last) */}
          {photos[2] && (
            <motion.div
              style={{
                position: 'absolute',
                width: cardWidth,
                y: card2Y,
                opacity: card2Op,
                rotate: cardRotations[2],
                zIndex: 3,
              }}
            >
              <GildedPolaroidCard
                photo={photos[2]}
                isDesktop={isDesktop}
                index={2}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
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
  const data = pavitraSriData

  // Filter events based on variant:
  // Variant "2" = Wedding ceremony venue only
  // Variant "1" (or default) = All 3 venue sections (Haldi & Mehendi, Reception, Wedding)
  const filteredEvents = useMemo(() => {
    if (variant === '2') {
      return data.events.filter(e => e.isWeddingOnly === true)
    }
    return data.events
  }, [variant, data.events])

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-[#4A3E20]">

      {/* â”€â”€ MOBILE VIEW â”€â”€ */}
      <div className="lg:hidden flex justify-center items-start min-h-screen bg-[#F0E8D8]">
        <div className="relative w-full max-w-[768px] min-h-[100svh] bg-[#FDFBF7] shadow-[0_0_60px_rgba(0,0,0,0.10)]">
          {/* 1. Hero Section (Identical to existing Midnight Waltz) */}
          <MidnightWaltzHero data={data.hero} isDesktop={false} />

          {/* 2. Our Story Section (New section on photo moments bg) */}
          <OurStorySection data={data.story} isDesktop={false} />

          {/* 3. Watercolor Photo Moments Section */}
          <WatercolorMomentsSection data={data.moments} isDesktop={false} />

          {/* 4. Welcome Invitation Section */}
          <WelcomeSection data={data.welcome} isDesktop={false} />

          {/* 5. Multi-Event Venues (Haldi/Mehendi, Reception, Wedding) */}
          {filteredEvents.map((event) => (
            <SingleEventVenueSection key={event.id} event={event} isDesktop={false} />
          ))}

          {/* 6. Live Countdown Timer */}
          <Countdown
            data={data.countdown}
            bgImage={countdownBgMobile}
            theme="traditional"
            position="bottom"
            isDesktop={false}
          />

          {/* 7. Celebrate & Bless Us (RSVP & Registry on photo moments bg) */}
          <CelebrateAndBlessSection data={data.celebrate} isDesktop={false} />

          {/* 8. Footer */}
          <Footer data={data.footer} theme="traditional" isDesktop={false} />
        </div>
      </div>

      {/* â”€â”€ DESKTOP VIEW â”€â”€ */}
      <div className="hidden lg:block w-full min-h-screen bg-[#FDFBF7] relative">
        {/* 1. Hero Section */}
        <div className="w-full">
          <MidnightWaltzHero data={data.hero} isDesktop={true} />
        </div>

        {/* 2. Our Story Section */}
        <div className="w-full">
          <OurStorySection data={data.story} isDesktop={true} />
        </div>

        {/* 3. Watercolor Photo Moments Section */}
        <div className="w-full">
          <WatercolorMomentsSection data={data.moments} isDesktop={true} />
        </div>

        {/* 4. Welcome Invitation Section */}
        <div className="w-full">
          <WelcomeSection data={data.welcome} isDesktop={true} />
        </div>

        {/* 5. Multi-Event Venues */}
        {filteredEvents.map((event) => (
          <div key={event.id} className="w-full">
            <SingleEventVenueSection event={event} isDesktop={true} />
          </div>
        ))}

        {/* 6. Live Countdown Timer */}
        <div className="w-full">
          <Countdown
            data={data.countdown}
            bgImage={countdownBgDesktop}
            theme="traditional"
            position="bottom"
            isDesktop={true}
          />
        </div>

        {/* 7. Celebrate & Bless Us */}
        <div className="w-full">
          <CelebrateAndBlessSection data={data.celebrate} isDesktop={true} />
        </div>

        {/* 8. Footer */}
        <div className="w-full">
          <Footer data={data.footer} theme="traditional" isDesktop={true} />
        </div>
      </div>

    </div>
  )
}
