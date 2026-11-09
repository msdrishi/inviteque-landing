import React, { useState, useEffect, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import FallingPetals from './FallingPetals'
import {
  COLORS,
  FONTS,
  ASSETS,
  LotusDivider,
  DiamondDivider,
  PinIcon,
  slowLineAnim,
  slowContainerAnim,
} from './theme'

export default function SouthernSerenadeHero({ data = {}, isDesktop = false, hasOpened = true }) {
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

  // Frame is strictly mobile sized (max-w-[440px])
  const isTablet = false

  // Fallback defaults matching the template
  const groomName = data.groomName || 'Abhishek'
  const brideName = data.brideName || 'Anaya'
  const groomScale = Math.min(1, 10 / Math.max(1, groomName.length))
  const brideScale = Math.min(1, 10 / Math.max(1, brideName.length))

  // Parse Date parts cleanly for royal 3-part layout (e.g., "26 NOVEMBER 2026")
  const dateParts = useMemo(() => {
    const raw = String(data.dateLine || '26 NOVEMBER 2026').trim().split(/\s+/)
    if (raw.length >= 3) {
      // Handles "26 NOVEMBER 2026" or "26 Nov 2026"
      return {
        day: raw[0],
        month: raw[1].toUpperCase(),
        year: raw[2],
      }
    }
    return { day: '26', month: 'NOVEMBER', year: '2026' }
  }, [data.dateLine])

  // Helper to ensure day of week is strictly a 3-letter abbreviation (MON, TUE, WED, THU, FRI, SAT, SUN)
  const formatShortDay = (val) => {
    if (!val) return 'THU'
    const clean = String(val).trim().toUpperCase()
    if (clean.startsWith('MON')) return 'MON'
    if (clean.startsWith('TUE')) return 'TUE'
    if (clean.startsWith('WED')) return 'WED'
    if (clean.startsWith('THU')) return 'THU'
    if (clean.startsWith('FRI')) return 'FRI'
    if (clean.startsWith('SAT')) return 'SAT'
    if (clean.startsWith('SUN')) return 'SUN'
    return clean.slice(0, 3)
  }

  const dayOfWeek = formatShortDay(data.dayOfWeek)
  const weddingTime = data.weddingTime !== undefined ? data.weddingTime : '11:00 AM ONWARDS'
  const venueName = data.venueName || 'SRI NARAYANA VANAM'
  const venueCity = data.venueCity || 'HYDERABAD, TELANGANA'

  return (
    <section
      id="hero"
      aria-label="Wedding Hero - Southern Serenade"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minHeight: isDesktop ? '100vh' : '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        // Carefully measured: begins below the feet illustration and flower petals
        paddingTop: isDesktop ? '44vh' : 'clamp(340px, 44svh, 430px)',
        paddingBottom: isDesktop ? '32px' : '18px',
        paddingLeft: isTablet ? 32 : 16,
        paddingRight: isTablet ? 32 : 16,
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Parallax Background Artwork */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          scale: isDesktop ? 1.18 : (isTablet ? 1.05 : 1.10),
          transformOrigin: 'center top',
          y: bgY,
        }}
      >
        <img
          src={ASSETS.heroBg}
          alt="South Indian Traditional Wedding Artwork"
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

      {/* Ambient Falling Flower Petals */}
      <FallingPetals count={20} />

      {/* ── Content Container: Strictly 100% Center-Aligned & Regal ── */}
      <motion.div
        initial="hidden"
        animate={hasOpened ? "show" : "hidden"}
        whileInView={hasOpened ? "show" : undefined}
        viewport={{ once: false, amount: 0.15 }}
        variants={slowContainerAnim}
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: isDesktop ? 540 : (isTablet ? 480 : 360),
        }}
      >
        {/* 1. Auspicious Header: THE WEDDING OF (optional) */}
        {!data.hideWeddingOf && data.headerText !== null && (
          <motion.p
            variants={slowLineAnim}
            style={{
              fontFamily: FONTS.label,
              fontSize: isDesktop ? '12px' : '11px',
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              color: COLORS.secondary,
              margin: '0 0 2px 0',
              fontWeight: 700,
            }}
          >
            {data.headerText || 'THE WEDDING OF'}
          </motion.p>
        )}

        {/* 2. Delicate Winged Lotus Divider */}
        <motion.div variants={slowLineAnim} style={{ marginBottom: 2 }}>
          <LotusDivider color={COLORS.gold} width={isDesktop ? 130 : 110} />
        </motion.div>

        {/* 3. GROOM NAME */}
        <motion.div
          variants={slowLineAnim}
          aria-label={groomName}
          style={{
            fontFamily: FONTS.heading,
            fontSize: isDesktop
              ? `calc(clamp(2.4rem, 4.0vw, 3.2rem) * ${groomScale})`
              : `calc(clamp(2.1rem, 7.6vw, 2.75rem) * ${groomScale})`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: COLORS.primary,
            lineHeight: 1.0,
            position: 'relative',
            width: '100%',
            padding: '0 6px',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ position: 'relative', display: 'block' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>{groomName}</span>
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: FONTS.heading,
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                lineHeight: 'inherit',
                display: 'block',
                background: 'linear-gradient(110deg, transparent 30%, rgba(235,220,185,0.7) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {groomName}
            </motion.span>
          </span>
        </motion.div>

        {/* 4. Elegant Centered Ligature: — & — */}
        <motion.div
          variants={slowLineAnim}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            margin: '0',
            width: '100%',
          }}
        >
          <span style={{ width: 32, height: 0.8, background: 'linear-gradient(to right, transparent, #C5A059)' }} />
          <span
            style={{
              fontFamily: FONTS.script,
              fontSize: isDesktop ? '2.1rem' : '1.8rem',
              color: COLORS.secondary,
              lineHeight: 0.8,
              transform: 'translateY(-2px)',
            }}
          >
            &
          </span>
          <span style={{ width: 32, height: 0.8, background: 'linear-gradient(to left, transparent, #C5A059)' }} />
        </motion.div>

        {/* 5. BRIDE NAME */}
        <motion.div
          variants={slowLineAnim}
          aria-label={brideName}
          style={{
            fontFamily: FONTS.heading,
            fontSize: isDesktop
              ? `calc(clamp(2.4rem, 4.0vw, 3.2rem) * ${brideScale})`
              : `calc(clamp(2.1rem, 7.6vw, 2.75rem) * ${brideScale})`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: COLORS.primary,
            lineHeight: 1.0,
            position: 'relative',
            width: '100%',
            padding: '0 6px',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ position: 'relative', display: 'block' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>{brideName}</span>
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear', delay: 1.2 }}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: FONTS.heading,
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                lineHeight: 'inherit',
                display: 'block',
                background: 'linear-gradient(110deg, transparent 30%, rgba(235,220,185,0.7) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {brideName}
            </motion.span>
          </span>
        </motion.div>

        {/* 6. ARE GETTING MARRIED */}
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: isDesktop ? '10px' : '9.5px',
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            margin: '3px 0 2px 0',
            fontWeight: 700,
          }}
        >
          ARE GETTING MARRIED
        </motion.p>

        {/* 7. Subtle Lotus Accent */}
        <motion.div variants={slowLineAnim} style={{ marginBottom: 2 }}>
          <LotusDivider color={COLORS.gold} width={isDesktop ? 120 : 100} />
        </motion.div>

        {/* 8. DISTINCTIVE ARCHITECTURAL CEREMONIAL DATE SEAL */}
        <motion.div
          variants={slowLineAnim}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '1px 0 2px 0',
            width: '100%',
            maxWidth: 320,
          }}
        >
          {/* Month Header */}
          <span
            style={{
              fontFamily: FONTS.label,
              fontSize: isDesktop ? '11.5px' : '10.5px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: COLORS.secondary,
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            {dateParts.month}
          </span>

          {/* Symmetrical 3-Column Date Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              gap: 12,
            }}
          >
            {/* Left: Day of Week */}
            <span
              style={{
                flex: 1,
                textAlign: 'right',
                fontFamily: FONTS.label,
                fontSize: isDesktop ? '12px' : '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: COLORS.primary,
                fontWeight: 700,
              }}
            >
              {dayOfWeek}
            </span>

            {/* Vertical Gold Divider */}
            <span
              style={{
                width: 1,
                height: 20,
                background: COLORS.gold,
                opacity: 0.65,
              }}
            />

            {/* Center: Prominent Day Number */}
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: isDesktop ? '2.5rem' : '2.15rem',
                color: COLORS.primary,
                fontWeight: 700,
                lineHeight: 1,
                padding: '0 4px',
              }}
            >
              {dateParts.day}
            </span>

            {/* Vertical Gold Divider */}
            <span
              style={{
                width: 1,
                height: 20,
                background: COLORS.gold,
                opacity: 0.65,
              }}
            />

            {/* Right: Year */}
            <span
              style={{
                flex: 1,
                textAlign: 'left',
                fontFamily: FONTS.label,
                fontSize: isDesktop ? '12px' : '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: COLORS.primary,
                fontWeight: 700,
              }}
            >
              {dateParts.year}
            </span>
          </div>

          {/* Centered Time (only if present) */}
          {weddingTime && (
            <span
              style={{
                fontFamily: FONTS.body,
                fontSize: isDesktop ? '14px' : '13px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: COLORS.secondary,
                marginTop: 2,
                fontWeight: 600,
              }}
            >
              {weddingTime}
            </span>
          )}
        </motion.div>

        {/* 9. VENUE (Strictly Centered — divider above address removed per request) */}
        <motion.div
          variants={slowLineAnim}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            margin: '2px 0 0 0',
            maxWidth: '92%',
          }}
        >
          <div style={{ marginBottom: 2 }}>
            <PinIcon size={14} color={COLORS.secondary} />
          </div>
          <p
            style={{
              fontFamily: FONTS.heading,
              fontSize: isDesktop ? '1.2rem' : '1.1rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: COLORS.primary,
              margin: '0 0 1px 0',
              lineHeight: 1.15,
              fontWeight: 600,
            }}
          >
            {venueName}
          </p>
          <p
            style={{
              fontFamily: FONTS.label,
              fontSize: isDesktop ? '10.5px' : '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: COLORS.secondary,
              margin: 0,
              lineHeight: 1.15,
              fontWeight: 700,
            }}
          >
            {venueCity}
          </p>
        </motion.div>
      </motion.div>

      {/* ── Scroll Down Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 'clamp(8px, 1.8vh, 16px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
        }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
        >
          <span
            style={{
              fontFamily: FONTS.label,
              fontSize: '9.5px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: COLORS.secondary,
              opacity: 0.75,
              fontWeight: 700,
            }}
          >
            SCROLL
          </span>
          <svg
            viewBox="0 0 16 10"
            width={12}
            height={7}
            fill="none"
            stroke={COLORS.secondary}
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ opacity: 0.75 }}
            aria-hidden="true"
          >
            <path d="M1 1.5 L8 8 L15 1.5" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
