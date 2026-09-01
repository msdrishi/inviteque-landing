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

// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• 
// 1. HERO SECTION (Identical to existing Midnight Waltz)
// â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• 
function MidnightWaltzHero({ data, isDesktop }) {
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  )

  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%'])
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  // ── Parse dynamic date fields cleanly ──────────────────────────
  const dateParts = useMemo(() => {
    let rawDay = data.weddingDate
    let rawMonth = data.weddingMonth
    let rawYear = data.weddingYear

    if (typeof rawDay === 'object' && rawDay !== null) {
      rawMonth = rawDay.month || rawMonth
      rawYear = rawDay.year || rawYear
      rawDay = rawDay.day || rawDay.date || '12'
    }
    if (!rawDay && data.dateLine) rawDay = data.dateLine.split(/\s+/)[0]
    if (!rawMonth && data.dateLine) rawMonth = data.dateLine.split(/\s+/)[1]
    if (!rawYear && data.dateLine) rawYear = data.dateLine.split(/\s+/)[2]

    const monthAbbr = String(rawMonth || 'Nov').slice(0, 3).toUpperCase()
    return { day: String(rawDay || '12'), month: monthAbbr, year: String(rawYear || '2026') }
  }, [data.weddingDate, data.weddingMonth, data.weddingYear, data.dateLine])

  const calculatedDayOfWeek = useMemo(() => {
    try {
      let rawDay = data.weddingDate
      let rawMonth = data.weddingMonth
      let rawYear = data.weddingYear

      if (typeof rawDay === 'object' && rawDay !== null) {
        rawMonth = rawDay.month || rawMonth
        rawYear = rawDay.year || rawYear
        rawDay = rawDay.day || rawDay.date || '12'
      }
      if (!rawDay && data.dateLine) rawDay = data.dateLine.split(/\s+/)[0]
      if (!rawMonth && data.dateLine) rawMonth = data.dateLine.split(/\s+/)[1]
      if (!rawYear && data.dateLine) rawYear = data.dateLine.split(/\s+/)[2]

      const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"]
      const mIdx = monthNames.findIndex(m => m.startsWith(String(rawMonth || 'november').toLowerCase().slice(0, 3)))
      const dayNum = parseInt(String(rawDay || '12'), 10)
      const yearNum = parseInt(String(rawYear || '2026'), 10)

      if (mIdx !== -1 && !isNaN(dayNum) && !isNaN(yearNum)) {
        const d = new Date(yearNum, mIdx, dayNum)
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { weekday: 'long' })
        }
      }
    } catch (e) {}
    return 'Saturday'
  }, [data.weddingDate, data.weddingMonth, data.weddingYear, data.dateLine])

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

        {/* 6. SUBTITLE (e.g. ARE GETTING MARRIED) */}
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
          {data.subtitle || "Are Getting Married"}
        </motion.p>

        {/* 7. Divider  ―― • ―― */}
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

          {/* Day (Date) — larger */}
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

        {/* 9. Day of week ―― Religath font */}
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
          {calculatedDayOfWeek}
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
            gap: 2,
            maxWidth: isDesktop ? '90%' : (isTablet ? '80%' : '90%'),
            width: '100%',
            margin: '0 auto',
          }}
        >
          {(() => {
            const rawParts = data.addressParts
              ? (isDesktop ? data.addressParts.desktop : data.addressParts.mobile)
              : [data.venueName, data.venueLine1, data.venueLine2].filter(Boolean)

            const lines = (Array.isArray(rawParts) && rawParts.length > 0)
              ? rawParts
              : [data.venueName || "Sri Venkateswara Royal Mandapam"]

            return lines.map((line, idx) => {
              if (!line) return null
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
                  {line}
                </p>
              )
            })
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
          {(Array.isArray(data.paragraphs) ? data.paragraphs : [data.paragraphs || data.message].filter(Boolean)).map((para, i) => (
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

// ═══════════════════════════════════════════════════════════════════
// 4. VENUE SECTION (Duplicated across Haldi/Mehendi, Reception, Wedding)
// ═══════════════════════════════════════════════════════════════════
function SingleEventVenueSection({ event, isDesktop }) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024
  const mapUrl = event.mapUrl || event.mapLink || `https://maps.google.com/?q=${encodeURIComponent([event.venueName, event.venueLine1, event.venueLine2].filter(Boolean).join(', '))}`
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(mapUrl)}&size=200x200&color=3F4930&bgcolor=FDFBF7&qzone=2&format=png`

  const addrParts = []
  if (event.venueLine1) addrParts.push(event.venueLine1)
  if (event.venueLine2) addrParts.push(event.venueLine2)
  if (addrParts.length === 0 && event.venueAddress) addrParts.push(event.venueAddress)
  if (addrParts.length === 1 && event.venueCity) addrParts.push(event.venueCity)

  const displayDateTime = (event.date && event.time) ? `${event.date} • ${event.time}` : (event.date || event.time || event.dateTimeLine || '')

  // Dedicated bespoke backgrounds for Pavitra & Sri events:
  const isHaldi = event.id === 'haldi-mehendi' || (event.eventName && event.eventName.toLowerCase().includes('haldi')) || (event.sectionLabel && event.sectionLabel.toLowerCase().includes('haldi'))
  const isReception = event.id === 'reception' || (event.eventName && event.eventName.toLowerCase().includes('reception')) || (event.sectionLabel && event.sectionLabel.toLowerCase().includes('reception'))

  const defaultBespokeDesktopBg = isHaldi
    ? "/backgrounds/midnight%20waltz/haldi-desktop.webp"
    : isReception
    ? "/backgrounds/midnight%20waltz/reception-desktop.webp"
    : "/backgrounds/midnight%20waltz/temple-desktop.webp"

  const defaultBespokeMobileBg = isHaldi
    ? "/backgrounds/midnight%20waltz/haldi-mobile.webp"
    : isReception
    ? "/backgrounds/midnight%20waltz/reception-mobile.webp"
    : "/backgrounds/midnight%20waltz/temple-mobile.webp"

  const rawBg = isDesktop ? (event.bgDesktop || defaultBespokeDesktopBg) : (event.bgMobile || defaultBespokeMobileBg)
  const bgSource = (typeof rawBg === 'string' && rawBg.trim() !== '')
    ? rawBg.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    : (isDesktop ? defaultBespokeDesktopBg : defaultBespokeMobileBg)

  return (
    <section
      id={event.id || "venue"}
      aria-label={event.eventName || event.sectionLabel || "Venue"}
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
        src={bgSource}
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
        {/* Ceremony / Section Title */}
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
          {event.eventName || event.sectionLabel || event.label || "Our Venue"}
        </motion.p>

        <motion.div variants={lineAnim}>
          <LotusDivider />
        </motion.div>

        {/* Venue Name */}
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
          {event.venueName || event.eventName || "Sri Venkateswara Royal Mandapam"}
        </motion.h2>

        {/* Date & Time Line */}
        {displayDateTime && (
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
            {displayDateTime}
          </motion.p>
        )}

        {/* Address Lines */}
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

// ═══════════════════════════════════════════════════════════════════
// 5. CELEBRATE & BLESS US (RSVP & Registry — Full Screen)
// ═══════════════════════════════════════════════════════════════════
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
        {/* Label */}
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

        {/* Heading */}
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

        {/* Subtitle */}
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

// ═══════════════════════════════════════════════════════════════════
// MAIN TEMPLATE COMPONENT (Pavitra & Sri Customization)
// ═══════════════════════════════════════════════════════════════════
export default function CustomMidnightWaltzPavitraSri() {
  const { variant } = useParams()
  const [searchParams] = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true'
  const { draftData } = useDraft()
  const [liveInvite, setLiveInvite] = useState(null)
  const [showSplash, setShowSplash] = useState(!isPreview)

  useEffect(() => {
    if (!isPreview) {
      const timer = setTimeout(() => setShowSplash(false), 900)
      return () => clearTimeout(timer)
    }
  }, [isPreview])

  // Fetch from Backend Database by slug (single source of truth)
  useEffect(() => {
    if (!isPreview) {
      const tryFetch = async () => {
        try {
          // Fetch by slug — backend resolves Pavitra-Sri via slug column (case-insensitive)
          const res = await fetch(`${API_URL}/api/invites/Pavitra-Sri`)
          if (res.ok) {
            const dbData = await res.json()
            if (dbData && (dbData.groomName || dbData.coupleData || dbData.heroData || dbData.slug || dbData.code)) {
              setLiveInvite(dbData)
            }
          }
        } catch (e) {
          console.warn('Template DB fetch error:', e)
        }
      }
      tryFetch()
    }
  }, [isPreview])


  // Merge live data, IndexedDB data, custom editor data, or draft data with base pavitraSriData
  const data = useMemo(() => {
    const base = pavitraSriData
    // DB (liveInvite) always wins, then draftData, then base defaults
    const dynamicSource = isPreview 
      ? draftData 
      : (liveInvite || (draftData?.slug === 'Pavitra-Sri' ? draftData : null))

    if (!dynamicSource) return base

    // Map dynamic fields gracefully over base
    const groom = dynamicSource.groomName || dynamicSource.coupleData?.groomName || base.hero.groomName
    const bride = dynamicSource.brideName || dynamicSource.coupleData?.brideName || base.hero.brideName
    
    let day = base.hero.weddingDate || '12'
    let month = base.hero.weddingMonth || 'November'
    let year = base.hero.weddingYear || '2026'
    let time = dynamicSource.weddingTime || dynamicSource.heroData?.weddingTime || base.hero.weddingTime || '09:00 AM - 10:30 AM'

    const rawDate = dynamicSource.weddingDate || dynamicSource.heroData?.weddingDate
    if (rawDate) {
      if (typeof rawDate === 'object' && rawDate !== null) {
        day = rawDate.day || rawDate.date || day
        month = rawDate.month || month
        year = rawDate.year || year
      } else if (typeof rawDate === 'string') {
        if (rawDate.includes('-')) {
          const parts = rawDate.split('-')
          if (parts.length === 3) {
            year = parts[0]
            const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
            const mIdx = parseInt(parts[1], 10) - 1
            month = monthNames[mIdx] || parts[1]
            day = String(parseInt(parts[2], 10))
          }
        } else {
          day = rawDate
        }
      }
    }
    if (dynamicSource.weddingMonth && typeof dynamicSource.weddingMonth === 'string') {
      month = dynamicSource.weddingMonth
    }
    if (dynamicSource.weddingYear && (typeof dynamicSource.weddingYear === 'string' || typeof dynamicSource.weddingYear === 'number')) {
      year = String(dynamicSource.weddingYear)
    }

    day = String(day || '12')
    month = String(month || 'November')
    year = String(year || '2026')

    const defaultWeddingEvent = base.events.find(e => e.id === 'wedding') || base.events[base.events.length - 1]
    const mahal = dynamicSource.mahalName || dynamicSource.venueData?.mahalName || defaultWeddingEvent?.venueName
    const addr = dynamicSource.venueAddress || dynamicSource.venueData?.venueAddress || defaultWeddingEvent?.venueLine1
    const cityState = `${dynamicSource.venueCity || dynamicSource.venueData?.venueCity || ''}${dynamicSource.state || dynamicSource.venueData?.state ? ', ' + (dynamicSource.state || dynamicSource.venueData?.state) : ''}`.trim() || defaultWeddingEvent?.venueLine2
    const map = dynamicSource.mapLink || dynamicSource.venueData?.mapLink || defaultWeddingEvent?.mapUrl

    // Photos: safely extract and merge slot by slot
    let mappedPhotos = base.moments.photos.map(p => ({ ...p }))
    const rawPhotos = dynamicSource.photos || dynamicSource.storyData?.photos
    if (rawPhotos && Array.isArray(rawPhotos)) {
      rawPhotos.forEach((item, i) => {
        if (i < 3 && item) {
          const imgUrl = typeof item === 'object' ? (item.image || item.url || item.secure_url) : item
          if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim() !== '') {
            mappedPhotos[i] = {
              ...(mappedPhotos[i] || { id: i + 1 }),
              id: i + 1,
              image: imgUrl
            }
          }
        }
      })
    }

    // Events
    let mappedEvents = base.events
    if (dynamicSource.events && Array.isArray(dynamicSource.events) && dynamicSource.events.length > 0) {
      mappedEvents = dynamicSource.events.map((ev, i) => {
        const baseEv = base.events[i] || base.events.find(b => b.id === ev.id) || base.events[base.events.length - 1]
        const evDate = ev.date || baseEv?.date || ''
        const evTime = ev.time || baseEv?.time || ''
        const dynamicDateTime = (evDate && evTime) ? `${evDate} • ${evTime}` : (evDate || evTime || ev.dateTimeLine || baseEv?.dateTimeLine || '')

        return {
          ...ev,
          id: ev.id || baseEv?.id || `custom-event-${i + 1}`,
          eventName: ev.eventName || ev.title || baseEv?.eventName || 'Ceremony',
          sectionLabel: ev.sectionLabel || ev.label || baseEv?.sectionLabel || 'Our Venue',
          dateTimeLine: ev.dateTimeLine || (ev.date && ev.time ? `${ev.date} • ${ev.time}` : (ev.date || ev.time || '')) || baseEv?.dateTimeLine,
          venueName: ev.venueName || ev.mahalName || baseEv?.venueName || mahal,
          venueLine1: ev.venueLine1 || ev.venueAddress || baseEv?.venueLine1 || addr,
          venueLine2: ev.venueLine2 || ev.venueCity || baseEv?.venueLine2 || cityState,
          mapUrl: ev.mapUrl || ev.mapLink || baseEv?.mapUrl || map,
          bgDesktop: (ev.bgDesktop ? ev.bgDesktop.replace(/\.(png|jpg|jpeg)$/i, '.webp') : null) || baseEv?.bgDesktop || (i === 0 ? "/backgrounds/midnight%20waltz/haldi-desktop.webp" : (i === 1 ? "/backgrounds/midnight%20waltz/reception-desktop.webp" : "/backgrounds/midnight%20waltz/temple-desktop.webp")),
          bgMobile: (ev.bgMobile ? ev.bgMobile.replace(/\.(png|jpg|jpeg)$/i, '.webp') : null) || baseEv?.bgMobile || (i === 0 ? "/backgrounds/midnight%20waltz/haldi-mobile.webp" : (i === 1 ? "/backgrounds/midnight%20waltz/reception-mobile.webp" : "/backgrounds/midnight%20waltz/temple-mobile.webp")),
          isWeddingOnly: ev.isWeddingOnly ?? (dynamicSource.events.length === 1 || i === dynamicSource.events.length - 1 || (ev.eventName && ev.eventName.toLowerCase().includes('wedding')))
        }
      })
    } else if (dynamicSource.scheduleItems || dynamicSource.scheduleData?.items) {
      const rawSchedule = dynamicSource.scheduleItems || dynamicSource.scheduleData?.items
      if (rawSchedule && rawSchedule.length > 0) {
        mappedEvents = rawSchedule.map((item, idx) => {
          const baseEv = base.events[idx] || base.events[base.events.length - 1]
          return {
            id: `evt-${idx + 1}`,
            label: item.title || baseEv?.label || 'Ceremony',
            sectionLabel: item.title || baseEv?.sectionLabel || 'Ceremony',
            eventName: item.title || baseEv?.eventName || 'Ceremony',
            dateTimeLine: `${day} ${month} ${year} • ${item.time || time}`.trim(),
            date: `${day} ${month} ${year}`.trim(),
            time: item.time || time,
            venueName: item.venueName || baseEv?.venueName || mahal,
            venueLine1: item.venueLine1 || baseEv?.venueLine1 || addr,
            venueLine2: item.venueLine2 || baseEv?.venueLine2 || cityState,
            mapUrl: item.mapUrl || baseEv?.mapUrl || map,
            bgDesktop: baseEv?.bgDesktop || (idx === 0 ? "/backgrounds/midnight%20waltz/haldi-desktop.webp" : (idx === 1 ? "/backgrounds/midnight%20waltz/reception-desktop.webp" : "/backgrounds/midnight%20waltz/temple-desktop.webp")),
            bgMobile: baseEv?.bgMobile || (idx === 0 ? "/backgrounds/midnight%20waltz/haldi-mobile.webp" : (idx === 1 ? "/backgrounds/midnight%20waltz/reception-mobile.webp" : "/backgrounds/midnight%20waltz/temple-mobile.webp")),
            isWeddingOnly: rawSchedule.length === 1 || idx === rawSchedule.length - 1 || (item.title && item.title.toLowerCase().includes('wedding'))
          }
        })
      }
    }

    const currentCode = dynamicSource.slug || dynamicSource.code || 'Pavitra-Sri'

    // Dynamic Story Mapping
    const storySectionLabel = dynamicSource.storySectionLabel || dynamicSource.invitationData?.storySectionLabel || dynamicSource.storyData?.sectionLabel || dynamicSource.story?.sectionLabel || base.story.sectionLabel || "Our Story"
    const storyHeading = dynamicSource.storyHeading || dynamicSource.invitationData?.storyHeading || dynamicSource.invitationData?.customSectionTitle || dynamicSource.storyData?.heading || dynamicSource.story?.heading || base.story.heading || "From A Chance Encounter to Forever"
    
    let storyParagraphs = []
    if (dynamicSource.storyParagraph1 || dynamicSource.storyParagraph2) {
      if (dynamicSource.storyParagraph1) storyParagraphs.push(dynamicSource.storyParagraph1)
      if (dynamicSource.storyParagraph2) storyParagraphs.push(dynamicSource.storyParagraph2)
    } else if (Array.isArray(dynamicSource.storyParagraphs) && dynamicSource.storyParagraphs.length > 0) {
      storyParagraphs = dynamicSource.storyParagraphs
    } else if (Array.isArray(dynamicSource.storyData?.paragraphs) && dynamicSource.storyData.paragraphs.length > 0) {
      storyParagraphs = dynamicSource.storyData.paragraphs
    } else if (Array.isArray(dynamicSource.story?.paragraphs) && dynamicSource.story.paragraphs.length > 0) {
      storyParagraphs = dynamicSource.story.paragraphs
    } else if (dynamicSource.storyMessage) {
      storyParagraphs = dynamicSource.storyMessage.split('\n\n').filter(Boolean)
    } else if (dynamicSource.customSectionContent) {
      storyParagraphs = dynamicSource.customSectionContent.split('\n\n').filter(Boolean)
    } else {
      storyParagraphs = base.story.paragraphs || []
    }

    const storyQuote = dynamicSource.storyQuote || dynamicSource.invitationData?.storyQuote || dynamicSource.invitationData?.customSectionSubtitle || dynamicSource.storyData?.quote || dynamicSource.story?.quote || dynamicSource.customSectionSubtitle || base.story.quote

    // Welcome message — reads from invitationData (where editor saves it)
    const welcomeLabel = dynamicSource.welcomeLabel || dynamicSource.invitationData?.welcomeLabel || base.welcome.label
    const welcomeHeading1 = dynamicSource.welcomeHeading1 || dynamicSource.invitationData?.welcomeHeadingLine1 || base.welcome.headingLine1
    const welcomeHeading2 = dynamicSource.welcomeHeading2 || dynamicSource.invitationData?.welcomeHeadingLine2 || base.welcome.headingLine2
    const welcomeMessage = dynamicSource.welcomeMessage || dynamicSource.invitationData?.welcomeMessage || dynamicSource.invitationData?.familyMessage || dynamicSource.familyMessage || base.welcome.message

    // Convert wedding date into a valid ISO string for countdown (e.g. 2026-11-12T09:00:00.000Z)
    let countdownISO = "2026-11-12T09:00:00.000Z"
    if (dynamicSource.countdownTargetDate && dynamicSource.countdownTargetDate.includes('-')) {
      countdownISO = `${dynamicSource.countdownTargetDate}T09:00:00.000Z`
    } else if (year && month && day) {
      const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"]
      const mIdx = monthNames.findIndex(m => m.startsWith(String(month).toLowerCase().slice(0, 3)))
      const mNum = mIdx !== -1 ? String(mIdx + 1).padStart(2, '0') : '11'
      const dNum = String(day).padStart(2, '0')
      countdownISO = `${year}-${mNum}-${dNum}T09:00:00.000Z`
    }

    // Find primary wedding ceremony event from mappedEvents
    const weddingEvent = mappedEvents.find(e => e.isWeddingOnly || (e.eventName && e.eventName.toLowerCase().includes('wedding')) || e.id === 'wedding') || mappedEvents[mappedEvents.length - 1]

    const weddingVenueName = weddingEvent?.venueName || mahal || ''
    const weddingLine1 = weddingEvent?.venueLine1 || addr || ''
    const weddingLine2 = weddingEvent?.venueLine2 || cityState || ''
    const weddingTime = weddingEvent?.time || time || '09:00 AM - 10:30 AM'

    const dynamicHeroAddressParts = [
      weddingVenueName,
      weddingLine1,
      weddingLine2
    ].filter(Boolean)

    return {
      ...base,
      hero: {
        ...base.hero,
        groomName: groom,
        brideName: bride,
        weddingDate: day,
        weddingMonth: month,
        weddingYear: year,
        weddingTime: weddingTime,
        venueName: weddingVenueName,
        venueCity: weddingLine2,
        venueLine1: weddingLine1,
        venueLine2: weddingLine2,
        addressParts: {
          desktop: dynamicHeroAddressParts,
          mobile: dynamicHeroAddressParts,
        },
        dateLine: `${day} ${month} ${year}`.trim(),
        subtitle: dynamicSource.heroSubtitle || base.hero.subtitle,
      },
      story: {
        ...base.story,
        sectionLabel: storySectionLabel,
        heading: storyHeading,
        paragraphs: storyParagraphs,
        quote: storyQuote,
      },
      moments: {
        ...base.moments,
        photos: mappedPhotos
      },
      welcome: {
        ...base.welcome,
        label: welcomeLabel,
        headingLine1: welcomeHeading1,
        headingLine2: welcomeHeading2,
        message: welcomeMessage,
      },
      events: mappedEvents,
      countdown: {
        ...base.countdown,
        targetDateTimeISO: countdownISO,
        targetDate: countdownISO,
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
  }, [variant, isPreview, draftData, liveInvite])


  // Filter events based on variant:
  // Variant "2" = Wedding ceremony venue only
  // Variant "1" (or default) = All configured venue sections (Haldi & Mehendi, Reception, Wedding)
  const filteredEvents = useMemo(() => {
    if (variant === '2') {
      const weddingEvents = data.events.filter(e => 
        e.isWeddingOnly === true || 
        e.id === 'wedding' || 
        (e.eventName && e.eventName.toLowerCase().includes('wedding')) || 
        (e.eventName && e.eventName.toLowerCase().includes('muhurtham')) ||
        (e.label && e.label.toLowerCase().includes('wedding'))
      )
      if (weddingEvents.length > 0) return weddingEvents
      if (data.events.length === 1) return data.events
      return [data.events[data.events.length - 1]]
    }
    return data.events && data.events.length > 0 ? data.events : pavitraSriData.events
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

  // Watermark status: Shown for preview / non-paid custom invites
  const isPaid = (
    liveInvite?.status?.toUpperCase?.() === 'PAID' ||
    liveInvite?.isPaid === true ||
    draftData?.status?.toUpperCase?.() === 'PAID' ||
    draftData?.isPaid === true
  )
  const showWatermark = false

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
