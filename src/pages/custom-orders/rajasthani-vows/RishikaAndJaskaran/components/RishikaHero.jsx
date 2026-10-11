import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { FallingRoyalFlowers } from '../../../../../templates/rajasthani-vows/RajasthaniVowsHero.jsx'
import defaultGaneshaLogo from '../../../../../templates/royal-heirloom/ganesha-logo.webp'

const desktopHeroBg = "/assets/templates/rajestani-vows/hero-mobile.webp"
const smartphoneHeroBg = "/assets/templates/rajestani-vows/hero-mobile.webp"

/* ──────────────────────────────────────────────────────────
   Aura of Elegance Style Animation Variants
────────────────────────────────────────────────────────── */
const nameReveal = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
  },
}

const nameLetters = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const nameLetter = {
  hidden: { opacity: 0, y: 14, x: -8, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
}

// Thin decorative divider with diamond ornament in dark ruby
function ThinDivider({ color = '#7A1228', width = 110 }) {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width }}
    >
      <div style={{ flex: 1, height: 0.8, background: color, opacity: 0.45, borderRadius: 1 }} />
      <div
        style={{
          width: 5,
          height: 5,
          transform: 'rotate(45deg)',
          background: color,
          opacity: 0.75,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, height: 0.8, background: color, opacity: 0.45, borderRadius: 1 }} />
    </div>
  )
}

export default function RishikaHero({
  data = {},
  isDesktop = false,
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
  const bgSrc = isDesktop ? desktopHeroBg : smartphoneHeroBg

  // Colors: Rich dark ruby & burgundy (no yellow text!)
  const colors = {
    primary: '#7A1228',   // Deep royal ruby crimson
    dark: '#54121B',      // Deepest wine maroon
    secondary: '#8A1D33', // Deep wine rose
  }

  const isHeroActive = hasTriggeredHeroBg || hasOpened
  const isTextActive = hasTriggeredHeroText || hasOpened

  const brideName = "Rishika"
  const groomName = "Major Jaskaran"

  return (
    <section
      id="hero"
      aria-label="Wedding hero — Rishika weds Major Jaskaran"
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
        paddingBottom: '24px',
        paddingLeft: '12px',
        paddingRight: '12px',
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

      {/* Royal Falling Flower Petals Animation */}
      {isHeroActive && <FallingRoyalFlowers />}

      {/* ── HERO CONTENT ── */}
      <motion.div
        initial="hidden"
        animate={isTextActive ? "show" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.16,
              delayChildren: 0.2,
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
          maxWidth: isDesktop ? 680 : '100%',
          margin: '0 auto',
          padding: '0 8px',
          boxSizing: 'border-box',
        }}
      >
        {/* Sacred Ganesha Emblem */}
        <motion.div variants={fadeUp} style={{ marginBottom: isDesktop ? 8 : 6 }}>
          <img
            src={data.ganeshaLogo || defaultGaneshaLogo}
            alt="Om Ganesha"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain opacity-95 drop-shadow-[0_2px_4px_rgba(122,18,40,0.18)]"
          />
        </motion.div>

        {/* ── Couple Name: Exactly in 3 Lines (Bride, weds, Groom) in Refined Font with Full-Cover Glare ── */}
        <div
          className="relative flex flex-col items-center justify-center my-0.5 select-none w-full"
          style={{
            fontFamily: "'Hiragenda', serif",
            lineHeight: 1.2,
          }}
        >
          {/* Line 1: Bride Name (Rishika) — Exact same font size as Groom */}
          <motion.div
            variants={nameReveal}
            style={{
              position: 'relative',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              marginBottom: isDesktop ? 3 : 1,
            }}
          >
            {/* Base text: 100% solid, fully visible at all times */}
            <span
              style={{
                fontFamily: "'Hiragenda', serif",
                fontSize: isDesktop
                  ? 'clamp(2.8rem, 4.4vw, 3.8rem)'
                  : (isTablet ? 'clamp(2.2rem, 4.6vw, 2.8rem)' : 'clamp(22px, 6.2vw, 27px)'),
                color: colors.primary,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
                letterSpacing: '0.04em',
                textShadow: '0 2px 14px rgba(122,18,40,0.18)',
              }}
            >
              {brideName}
            </span>

            {/* Crystal reflection glare overlay — reflects strictly within font */}
            <motion.span
              animate={{ backgroundPosition: ['150% center', '-150% center'] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'linear' }}
              style={{
                fontFamily: "'Hiragenda', serif",
                fontSize: isDesktop
                  ? 'clamp(2.8rem, 4.4vw, 3.8rem)'
                  : (isTablet ? 'clamp(2.2rem, 4.6vw, 2.8rem)' : 'clamp(22px, 6.2vw, 27px)'),
                letterSpacing: '0.04em',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                background:
                  'linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.55) 50%, transparent 60%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                zIndex: 2,
                display: 'inline-block',
              }}
              aria-hidden="true"
            >
              {brideName}
            </motion.span>
          </motion.div>

          {/* Line 2: weds with comfortable breathing room */}
          <motion.div variants={fadeUp} style={{ margin: isDesktop ? '6px 0' : '4px 0', whiteSpace: 'nowrap' }}>
            <span
              style={{
                fontFamily: "'Hiragenda', serif",
                fontSize: isDesktop
                  ? 'clamp(1.2rem, 1.5vw, 1.45rem)'
                  : (isTablet ? 'clamp(1.1rem, 2.0vw, 1.3rem)' : 'clamp(1.0rem, 3.2vw, 1.2rem)'),
                color: colors.primary,
                opacity: 0.92,
                letterSpacing: '0.12em',
                display: 'block',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 6px rgba(122,18,40,0.12)',
              }}
            >
              weds
            </span>
          </motion.div>

          {/* Line 3: Groom Name (Major Jaskaran) — Solid visible font with crystal glare overlay */}
          <motion.div
            variants={nameReveal}
            style={{
              position: 'relative',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              marginTop: isDesktop ? 3 : 1,
            }}
          >
            {/* Base text: 100% solid, fully visible at all times */}
            <span
              style={{
                fontFamily: "'Hiragenda', serif",
                fontSize: isDesktop
                  ? 'clamp(2.8rem, 4.4vw, 3.8rem)'
                  : (isTablet ? 'clamp(2.2rem, 4.6vw, 2.8rem)' : 'clamp(22px, 6.2vw, 27px)'),
                color: colors.primary,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
                letterSpacing: '0.04em',
                textShadow: '0 2px 14px rgba(122,18,40,0.18)',
              }}
            >
              {groomName}
            </span>

            {/* Crystal reflection glare overlay — reflects strictly within font */}
            <motion.span
              animate={{ backgroundPosition: ['150% center', '-150% center'] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'linear' }}
              style={{
                fontFamily: "'Hiragenda', serif",
                fontSize: isDesktop
                  ? 'clamp(2.8rem, 4.4vw, 3.8rem)'
                  : (isTablet ? 'clamp(2.2rem, 4.6vw, 2.8rem)' : 'clamp(22px, 6.2vw, 27px)'),
                letterSpacing: '0.04em',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                background:
                  'linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.55) 50%, transparent 60%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                zIndex: 2,
                display: 'inline-block',
              }}
              aria-hidden="true"
            >
              {groomName}
            </motion.span>
          </motion.div>
        </div>

        {/* Thin Ornamental Divider in Dark Ruby with generous vertical spacing */}
        <motion.div
          variants={fadeUp}
          style={{
            marginTop: isDesktop ? 22 : 18,
            marginBottom: isDesktop ? 18 : 14,
          }}
        >
          <ThinDivider color={colors.primary} width={isDesktop ? 120 : (isTablet ? 110 : 95)} />
        </motion.div>

        {/* ── Date Row: DEC | 6, 7 | 2026 (Dark colors, NOT yellow!) ── */}
        <motion.div
          variants={fadeUp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isDesktop ? 14 : 11,
            lineHeight: 1,
            marginBottom: isDesktop ? 12 : 10,
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: isDesktop ? '1.05rem' : '0.92rem',
              color: colors.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
            }}
          >
            DEC
          </span>

          <span style={{ color: colors.primary, fontSize: '0.9rem', opacity: 0.45, fontFamily: 'serif' }}>|</span>

          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: isDesktop ? '1.85rem' : '1.62rem',
              color: colors.primary,
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            6, 7
          </span>

          <span style={{ color: colors.primary, fontSize: '0.9rem', opacity: 0.45, fontFamily: 'serif' }}>|</span>

          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: isDesktop ? '1.05rem' : '0.92rem',
              color: colors.primary,
              letterSpacing: '0.12em',
            }}
          >
            2026
          </span>
        </motion.div>

        {/* ── Location: Delhi ── */}
        <motion.div
          variants={fadeUp}
          style={{
            marginBottom: isDesktop ? 11 : 9,
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              fontSize: isDesktop ? '14px' : (isTablet ? '13.5px' : '12.5px'),
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color: colors.primary,
              display: 'inline-block',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)',
            }}
          >
            {data.city || data.location || "Delhi"}
          </span>
        </motion.div>

        {/* ── #HeartsOnDuty Hashtag (Dark color, NOT yellow!) ── */}
        <motion.div
          variants={fadeUp}
          style={{
            marginTop: isDesktop ? 2 : 0,
            marginBottom: isDesktop ? 12 : 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: isDesktop ? '13px' : (isTablet ? '12.5px' : '11.5px'),
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: colors.primary,
              display: 'inline-block',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)',
            }}
          >
            {data.hashtag || "#HeartsOnDuty"}
          </span>
        </motion.div>
      </motion.div>

      {/* ── Scroll Down Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.0 }}
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
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              fontSize: 8.5,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: colors.secondary,
              opacity: 0.7,
            }}
          >
            Scroll
          </span>
          <svg
            viewBox="0 0 18 11"
            width={11}
            height={7}
            fill="none"
            stroke={colors.secondary}
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ opacity: 0.7 }}
            aria-hidden="true"
          >
            <path d="M1 1.5 L9 9.5 L17 1.5" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
