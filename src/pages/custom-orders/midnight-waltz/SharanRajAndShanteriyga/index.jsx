import React, { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Countdown from '../../../../components/Countdown.jsx'
import Events from '../../../../components/Events.jsx'
import Footer from '../../../../components/Footer.jsx'
import PhotoCardsMidnightWaltz from '../../../../components/PhotoCardsMidnightWaltz.jsx'
import WelcomeMidnightWaltz from '../../../../components/WelcomeMidnightWaltz.jsx'
import VenueMidnightWaltz from '../../../../components/VenueMidnightWaltz.jsx'
import CustomSection from '../../../../components/CustomSection.jsx'
import InviteQRSVP from '../../../../components/InviteQRSVP.jsx'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

import { customData as data } from './data.js'
import bgMusicSrc from '../../../../assets/audio/tamil-temple-bgm.mp3'

// Simple SVG icon for Music On
const MusicOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
  </svg>
)

// Simple SVG icon for Music Off
const MusicOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
  </svg>
)

// ── Background asset URLs (local Vercel CDN) ────────────────────────────────────────
const desktopHeroBg      = "/assets/templates/midnight-waltz/hero-desktop.webp"
const smartphoneHeroBg   = "/assets/templates/midnight-waltz/hero-mobile.webp"
const photoBgDesktop     = "/assets/templates/midnight-waltz/photo-bg-desktop.webp"
const photoBgMobile      = "/assets/templates/midnight-waltz/photo-bg-mobile.webp"
const messageBgDesktop   = "/assets/templates/midnight-waltz/welcome-desktop.webp"
const messageBgMobile    = "/assets/templates/midnight-waltz/welcome-mobile.webp"
const locationBgDesktop  = "/assets/templates/midnight-waltz/venue-desktop.webp"
const locationBgMobile   = "/assets/templates/midnight-waltz/venue-mobile.webp"
const countdownBgDesktop = "/assets/templates/midnight-waltz/countdown-desktop.webp"
const countdownBgMobile  = "/assets/templates/midnight-waltz/countdown-mobile.webp"
const rosePetalSrc       = "/assets/decorations/midnight-waltz-rosePetal.png"

// ── Petal configs — computed once at module level ────────────────
// Use a seeded-like approach for consistent rendering
const petalConfig = Array.from({ length: 22 }).map((_, i) => {
  const rand = (offset) => {
    const x = Math.sin(i * 9.301 + offset * 7.583) * 43758.5453
    return x - Math.floor(x)
  }
  
  const isLeft = i % 2 === 0
  // Left side petals: start at 0vw to 18vw
  // Right side petals: start at 82vw to 100vw
  const leftPos = isLeft ? rand(0) * 18 : 82 + rand(0) * 18
  
  // Constrain drift (x1, x2, x3) so left-side petals drift left (-10px to -50px)
  // and right-side petals drift right (+10px to +50px). This keeps the middle completely clean.
  const baseDrift = 10 + rand(4) * 40
  const driftDirection = isLeft ? -1 : 1

  return {
    left:      `${leftPos}vw`,
    duration:  9 + rand(1) * 14,                       // 9–23s
    delay:     rand(2) * 10,                           // 0–10s
    size:      10 + rand(3) * 12,                      // 10–22px
    x1:        driftDirection * baseDrift,
    x2:        driftDirection * (baseDrift * 0.7),
    x3:        driftDirection * (baseDrift * 0.4),
    initRot:   rand(7) * 360,
    rotAmount: (1.2 + rand(8)) * (rand(9) > 0.5 ? 360 : -360),
    opacity:   0.45 + rand(10) * 0.5,
    scale:     0.7 + rand(11) * 0.4,
  }
})

// ── Rose petal falling animation (PNG) ──────────────────────────
function FallingRosePetals() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      style={{ height: '100svh' }}
    >
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

// ── Small top ornament ───────────────────────────────────────────
function TopOrnament({ color = '#B09060', size = 32 }) {
  return (
    <svg
      viewBox="0 0 32 36"
      width={size}
      height={size * 1.12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Vertical stem */}
      <line x1="16" y1="28" x2="16" y2="34" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      {/* Teardrop / flame tip */}
      <path
        d="M16 2 C10 8 8 14 8 18 C8 23 11.5 26 16 26 C20.5 26 24 23 24 18 C24 14 22 8 16 2Z"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.1"
        opacity="0.8"
      />
      {/* Inner arch */}
      <path
        d="M11 18 Q16 10 21 18"
        stroke={color}
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Top dot */}
      <circle cx="16" cy="2" r="1.8" fill={color} opacity="0.75" />
      {/* Base dot */}
      <circle cx="16" cy="34" r="1.6" fill={color} opacity="0.6" />
    </svg>
  )
}

// ── Thin divider (—— • ——) ───────────────────────────────────────
function ThinDivider({ color = '#7A6840', width = 110 }) {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'center', gap: 7, width }}
    >
      <div style={{ flex: 1, height: 0.75, background: color, opacity: 0.6, borderRadius: 1 }} />
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: color,
          opacity: 0.75,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, height: 0.75, background: color, opacity: 0.6, borderRadius: 1 }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  HERO SECTION
// ═══════════════════════════════════════════════════════════════
function MidnightWaltzHero({ data, isDesktop }) {
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  )

  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%'])
  const bgY  = useSpring(rawY, { stiffness: 55, damping: 18 })

  useEffect(() => {
    const onResize = () => setIsLandscape(window.innerWidth > window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Animation variants ──────────────────────────────────────
  const lineAnim = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // ── Parse date "18 December 2026" ──────────────────────────
  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      const monthAbbr = parts[1].slice(0, 3).toUpperCase()
      return { day: parts[0], month: monthAbbr, year: parts[2] }
    }
    return { day: '18', month: 'DEC', year: '2026' }
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

  // ── Color palette ───────────────────────────────────────────
  const C = {
    primary:   '#4A3E20',   // deep warm olive — names, date, address
    secondary: '#7A6840',   // medium warm brown — labels, subtitles
    gold:      '#B09060',   // antique gold — ornament, "and"
  }

  return (
    <section
      id="hero"
      aria-label="Wedding hero — Midnight Waltz"
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

      {/* ── HERO CONTENT ──────────────────────────────────────── */}
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

        {/* 2. SAVE THE DATE — Modernline (Not capitalized) */}
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

        {/* 3. GROOM NAME — Religath */}
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
              {(data.groomName || 'Abhishek')}
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
              {(data.groomName || 'Abhishek')}
            </motion.span>
          </span>
        </motion.div>

        {/* 4. and — Modernline */}
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

        {/* 5. BRIDE NAME — Religath */}
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
              {(data.brideName || 'Kanika')}
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
              {(data.brideName || 'Kanika')}
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

        {/* 7. Divider  —— • —— */}
        <motion.div
          variants={lineAnim}
          style={{ marginBottom: isDesktop ? 8 : 6 }}
        >
          <ThinDivider color={C.secondary} width={isDesktop ? 120 : (isTablet ? 180 : 100)} />
        </motion.div>

        {/* 8. DATE ROW: DECEMBER | 18 | 2026 (Month - Date - Year format, Religath font, Date is bigger) */}
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

        {/* 9. Day of week ── Religath font */}
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
          {data.dayOfWeek || 'Friday'}
        </motion.p>

        {/* 10. Wedding time ── Religath font */}
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

        {/* 12. Full address ── pin code removed */}
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
              // Fallback if no addressParts
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
      {/* ── Scroll indicator ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 'clamp(14px, 3vh, 28px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          cursor: 'pointer',
        }}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 8,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#4A3E20',
              opacity: 0.55,
            }}
          >
            Scroll
          </span>
          <svg
            viewBox="0 0 18 11"
            width={13}
            height={8}
            fill="none"
            stroke="#4A3E20"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ opacity: 0.5 }}
            aria-hidden="true"
          >
            <path d="M1 1.5 L9 9.5 L17 1.5" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PAGE EXPORT
// ═══════════════════════════════════════════════════════════════
export default function TemplateMidnightWaltz({ savedData, groupSlug: propGroupSlug }) {
  const location    = useLocation()
  const { templateId } = useParams()
  const navigate    = useNavigate()
  const isPreview   = new URLSearchParams(location.search).get('preview') === 'true'
  const groupSlug   = propGroupSlug || new URLSearchParams(location.search).get('group')

  const isPaid = true
  const showWatermark = false

  // Music state
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = React.useRef(null)

  // Handle first interaction to autoplay music
  useEffect(() => {
    // Attempt immediate autoplay
    if (audioRef.current && !isMusicMuted && !hasInteracted) {
      audioRef.current.play().then(() => {
        setHasInteracted(true)
      }).catch(() => {
        // Autoplay was blocked, wait for user interaction
      })
    }

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        if (audioRef.current && !isMusicMuted) {
          audioRef.current.play().catch(() => {})
        }
      }
    }
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('touchstart', handleInteraction, { once: true })
    window.addEventListener('scroll', handleInteraction, { once: true })
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
    }
  }, [hasInteracted, isMusicMuted])

  const toggleMusic = () => {
    setIsMusicMuted(!isMusicMuted)
    if (audioRef.current) {
      if (isMusicMuted) {
        audioRef.current.muted = false
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }

  const groomPhoto  = "/backgrounds/Midnight Waltz/groom.png"
  const bridePhoto  = "/backgrounds/Midnight Waltz/bride.png"
  const showGallery = true
  const showSchedule = true
  const showRsvp = false

  const customSectionData = data.moments
  const userPhotos = data.moments.photos

  const showHero = true
  const showStory = true
  const showWelcome = true
  const showVenue = true
  const showCountdown = true

  // ── Watermark ─────────────────────────────────────────────────
  const WatermarkMobile = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.30] select-none">
      {['8%', '50%', '92%'].map(top => (
        <span
          key={top}
          className="absolute left-1/2 -translate-x-1/2 text-[17px] font-medium tracking-[0.2em] text-[#4A3E20]"
          style={{ top, fontFamily: "'Montserrat', sans-serif" }}
        >
          preview-inviteque
        </span>
      ))}
    </div>
  ) : null

  const WatermarkDesktop = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.18] select-none flex flex-col justify-around items-center text-[#4A3E20]">
      {['preview-inviteque', 'preview-inviteque'].map((t, i) => (
        <span key={i} className="text-[30px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {t}
        </span>
      ))}
    </div>
  ) : null

  // ── Preview nav ───────────────────────────────────────────────
  const PreviewNavMobile = () => isPreview ? (
    <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
      <div className="flex gap-3">
        <button onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })} className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#4A3E20]/20 bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#4A3E20] shadow-xl hover:scale-105 active:scale-95">
          Back
        </button>
        <button onClick={() => navigate('/payment', { state: { draftData, templateId } })} className="flex-1 flex items-center justify-center gap-3 rounded-full bg-[#4A3E20] py-4 text-sm font-bold text-[#FDFBF7] shadow-xl hover:scale-105 active:scale-95">
          Proceed
        </button>
      </div>
    </div>
  ) : null

  const PreviewNavDesktop = () => isPreview ? (
    <div className="fixed bottom-8 right-8 z-[110] flex gap-4">
      <button onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })} className="px-8 py-4 rounded-full border border-[#4A3E20]/25 bg-white/95 backdrop-blur-md text-sm font-bold text-[#4A3E20] shadow-xl hover:scale-105 active:scale-95">
        ← Back to Edit
      </button>
      <button onClick={() => navigate('/payment', { state: { draftData, templateId } })} className="px-10 py-4 rounded-full bg-[#4A3E20] text-sm font-bold text-[#FDFBF7] shadow-xl hover:scale-105 active:scale-95">
        Proceed →
      </button>
    </div>
  ) : null

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-[#4A3E20]">

      {/* ── MOBILE & TABLET VIEW ── */}
      <div className="lg:hidden flex justify-center items-start min-h-screen bg-[#F0E8D8]">
        <div className="relative w-full max-w-[768px] min-h-[100svh] bg-[#FDFBF7] shadow-[0_0_60px_rgba(0,0,0,0.10)]">
          <WatermarkMobile />
          <PreviewNavMobile />

          {showHero && (
  <MidnightWaltzHero data={data.hero} isDesktop={false} />
)}
          {showStory && (
  <CustomSection photoBgDesktop={photoBgDesktop} photoBgMobile={photoBgMobile} data={customSectionData} />
)}

          {showGallery && (
            <PhotoCardsMidnightWaltz
              groomName={data.hero.groomName}
              brideName={data.hero.brideName}
              groomPhoto={groomPhoto}
              bridePhoto={bridePhoto}
              photos={userPhotos}
              bgImageDesktop={photoBgDesktop}
              bgImageMobile={photoBgMobile}
              isDesktop={false}
            />
          )}

          {showWelcome && (
  <WelcomeMidnightWaltz
              data={data.welcome}
              bgImageDesktop={messageBgDesktop}
              bgImageMobile={messageBgMobile}
              isDesktop={false}
            />
)}

          {showVenue && (
  <VenueMidnightWaltz
              data={data.venue}
              bgImageDesktop={locationBgDesktop}
              bgImageMobile={locationBgMobile}
              isDesktop={false}
            />
)}

          {showSchedule && (
            <Events
              data={{ items: data.events }}
              theme="traditional"
              bgImage={photoBgMobile}
              isDesktop={false}
            />
          )}

          {showRsvp && (
            <InviteQRSVP
            events={data.events}
              weddingCode={savedData?.code}
              groupSlug={groupSlug}
              isPreview={!savedData}
              theme="midnight"
              config={savedData?.rsvpData}
            />
          )}

          {showCountdown && (
  <Countdown
              data={data.countdown}
              bgImage={countdownBgMobile}
              theme="traditional"
              position="bottom"
              isDesktop={false}
            />
)}

          <Footer data={data.footer} theme="traditional" />
        </div>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="hidden lg:block w-full min-h-screen bg-[#FDFBF7] relative">
        <WatermarkDesktop />
        <PreviewNavDesktop />

        <div className="w-full">
          {showHero && (
  <MidnightWaltzHero data={data.hero} isDesktop={true} />
)}
        </div>
        <div className="w-full">
          {showStory && (
  <CustomSection photoBgDesktop={photoBgDesktop} photoBgMobile={photoBgMobile} data={customSectionData} />
)}
        </div>

        {showGallery && (
          <div className="w-full">
            <PhotoCardsMidnightWaltz
              groomName={data.hero.groomName}
              brideName={data.hero.brideName}
              groomPhoto={groomPhoto}
              bridePhoto={bridePhoto}
              photos={userPhotos}
              bgImageDesktop={photoBgDesktop}
              bgImageMobile={photoBgMobile}
              isDesktop={true}
            />
          </div>
        )}

        <div className="w-full">
          {showWelcome && (
  <WelcomeMidnightWaltz
              data={data.welcome}
              bgImageDesktop={messageBgDesktop}
              bgImageMobile={messageBgMobile}
              isDesktop={true}
            />
)}
        </div>

        <div className="w-full">
          {showVenue && (
  <VenueMidnightWaltz
              data={data.venue}
              bgImageDesktop={locationBgDesktop}
              bgImageMobile={locationBgMobile}
              isDesktop={true}
            />
)}
        </div>

        {showSchedule && (
          <div className="w-full">
            <Events
              data={{ items: data.events }}
              theme="traditional"
              bgImage={photoBgDesktop}
              isDesktop={true}
            />
          </div>
        )}

        {showRsvp && (
          <div className="w-full">
            <InviteQRSVP
            events={data.events}
              weddingCode={savedData?.code}
              groupSlug={groupSlug}
              isPreview={!savedData}
              theme="midnight"
              config={savedData?.rsvpData}
            />
          </div>
        )}

        <div className="w-full">
          {showCountdown && (
  <Countdown
              data={data.countdown}
              bgImage={countdownBgDesktop}
              theme="traditional"
              position="bottom"
              isDesktop={true}
            />
)}
        </div>

        <div className="w-full">
          <Footer data={data.footer} theme="traditional" isDesktop={true} />
        </div>
      </div>
      
      {/* Persistent Background Audio Player */}
      <audio ref={audioRef} src={bgMusicSrc} loop autoPlay />

      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-4 z-50 p-3 rounded-full bg-[#3A1F10]/80 backdrop-blur-sm text-[#FDFBF7] border border-[#FDFBF7]/30 shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all hover:scale-105 hover:bg-[#3A1F10]"
        aria-label={isMusicMuted ? "Play Music" : "Mute Music"}
      >
        {isMusicMuted ? <MusicOffIcon /> : <MusicOnIcon />}
      </button>

    </div>
  )
}
