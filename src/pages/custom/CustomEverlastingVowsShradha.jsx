import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { shradhaData } from '../../data/custom/shradhaData.js'
import { weddingData as staticData } from '../../weddingData.js'
import Countdown from '../../components/Countdown.jsx'
import Events from '../../components/Events.jsx'
import Footer from '../../components/Footer.jsx'
import Venue from '../../components/Venue.jsx'
import InviteQRSVP from '../../components/InviteQRSVP.jsx'
import SplashScreen from '../../components/SplashScreen.jsx'
import { API_URL } from '../../config.js'
import cMapping from '../../everlastingVowsCloudinaryMapping.json'

// Background & Puppet WebP assets
const desktopBg = cMapping['hero_desktop.png'] || "/assets/templates/everlasting-vows/hero-desktop.webp"
const smartphoneBg = cMapping['hero_mobile.png'] || "/assets/templates/everlasting-vows/hero-mobile.webp"
const photoBgDesktop = cMapping['photo_desktop.png'] || "/assets/templates/everlasting-vows/photo-desktop.webp"
const photoBgMobile = cMapping['photo_mobile.png'] || "/assets/templates/everlasting-vows/photo-mobile.webp"
const locationBgDesktop = cMapping['venue_desktop.png'] || "/assets/templates/everlasting-vows/venue-desktop.webp"
const locationBgMobile = cMapping['venue_mobile.png'] || "/assets/templates/everlasting-vows/venue-mobile.webp"
const countdownBgDesktop = cMapping['countdown_desktop.png'] || "/assets/templates/everlasting-vows/countdown-desktop.webp"
const countdownBgMobile = cMapping['countdown_mobile.png'] || "/assets/templates/everlasting-vows/countdown-mobile.webp"

const puppetBgWebp = "/assets/templates/everlasting-vows/puppet-background.webp"
const puppetLeftWebp = "/assets/templates/everlasting-vows/puppet-left.webp"
const puppetRightWebp = "/assets/templates/everlasting-vows/puppet-right.webp"

// ── Falling Gold Petals ──────────────────────────────────────────────────────────
const petalConfig = Array.from({ length: 18 }).map((_, i) => {
  const isLeft = i % 2 === 0
  const leftPos = isLeft ? Math.random() * 25 : 75 + Math.random() * 25
  const duration = 6 + Math.random() * 8
  const delay = Math.random() * 5
  const size = 8 + Math.random() * 12
  const x1 = Math.random() * 50 - 25
  const x2 = Math.random() * 50 - 25
  return { left: leftPos, duration, delay, size, x1, x2 }
})

function FallingPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100svh' }}>
      {petalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            opacity: 0.85,
            filter: 'drop-shadow(0px 3px 6px rgba(138,110,30,0.2))'
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.x1, p.x2],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 0 C 35 10, 35 30, 20 40 C 5 30, 5 10, 20 0 Z" fill="rgba(212,175,55,0.88)" />
            <circle cx="20" cy="20" r="3" fill="#FFFDF2" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// ── Interactive Puppet Splash Screen ────────────────────────────────────────────
function PuppetSplashScreen({ isOpened, onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isOpened ? 0 : 1, 
        pointerEvents: isOpened ? 'none' : 'auto',
      }}
      transition={{ 
        duration: 4.0, 
        ease: [0.33, 1, 0.68, 1], 
        delay: isOpened ? 0.2 : 0 
      }}
      onClick={onOpen}
      className="fixed inset-0 z-[9999] flex flex-col justify-between items-center cursor-pointer select-none overflow-hidden bg-[#FDF6E2]"
    >
      {/* Background Yellow Floral Texture with subtle zoom on reveal */}
      <motion.img
        src={puppetBgWebp}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        animate={isOpened ? { scale: 1.05, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 4.0, ease: [0.33, 1, 0.68, 1] }}
      />

      {/* Falling Gold Petals / Flowers */}
      <FallingPetals />

      {/* Top Header Tag */}
      <motion.div 
        animate={isOpened ? { opacity: 0, y: -25 } : { opacity: 1, y: 0 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="relative z-10 text-center px-4 pt-10 sm:pt-14 max-w-lg"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-[#8A6E1E] uppercase tracking-[0.3em] text-[11px] sm:text-xs font-bold"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Padharo Mhare Des
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="text-[#705915] text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.12em] mt-1 uppercase"
          style={{
            fontFamily: "'Cinzel', serif",
            textShadow: '0 2px 14px rgba(255,253,242,0.95)'
          }}
        >
          Roka &amp; Engagement
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-[#8A6E1E]/90 text-[11px] sm:text-xs tracking-[0.22em] uppercase mt-1 font-bold"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Shradha &amp; Aayush
        </motion.p>
      </motion.div>

      {/* Left Puppet (Groom - 4.0s cinematic exit) */}
      <motion.div
        className="absolute z-20 pointer-events-none origin-top-left flex items-center justify-start"
        style={{
          top: '11svh',
          left: '-4%',
          width: 'clamp(210px, 52vw, 320px)',
          height: '63svh',
          maxHeight: '580px',
        }}
        animate={
          isOpened
            ? { x: '-180%', y: '-15%', rotate: -25, opacity: 0 }
            : { rotate: [-2.2, 2.8, -2.2], y: [0, 12, 0], x: [0, 4, 0] }
        }
        transition={
          isOpened
            ? { duration: 4.0, ease: [0.25, 1, 0.35, 1] }
            : { repeat: Infinity, duration: 4.8, ease: "easeInOut" }
        }
      >
        <img
          src={puppetLeftWebp}
          alt="Rajasthani Groom Puppet"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 20px 28px rgba(0,0,0,0.45)) drop-shadow(0 6px 14px rgba(138,110,30,0.32))'
          }}
          loading="eager"
        />
      </motion.div>

      {/* Right Puppet (Bride - 4.0s cinematic exit) */}
      <motion.div
        className="absolute z-20 pointer-events-none origin-top-right flex items-center justify-end"
        style={{
          top: '11svh',
          right: '-4%',
          width: 'clamp(210px, 52vw, 320px)',
          height: '63svh',
          maxHeight: '580px',
        }}
        animate={
          isOpened
            ? { x: '180%', y: '-15%', rotate: 25, opacity: 0 }
            : { rotate: [2.8, -2.2, 2.8], y: [8, -4, 8], x: [0, -4, 0] }
        }
        transition={
          isOpened
            ? { duration: 4.0, ease: [0.25, 1, 0.35, 1], delay: 0.08 }
            : { repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.25 }
        }
      >
        <img
          src={puppetRightWebp}
          alt="Rajasthani Bride Puppet"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 20px 28px rgba(0,0,0,0.45)) drop-shadow(0 6px 14px rgba(138,110,30,0.32))'
          }}
          loading="eager"
        />
      </motion.div>

      {/* Bottom Area: Animated "Tap to Open" Button */}
      <motion.div
        className="relative z-30 flex flex-col items-center pb-8 sm:pb-12 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isOpened ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 4px 15px rgba(138,110,30,0.25)',
              '0 8px 30px rgba(138,110,30,0.5)',
              '0 4px 15px rgba(138,110,30,0.25)'
            ]
          }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full border-2 border-[#8A6E1E]/40 bg-[#FFFDF2]/94 backdrop-blur-md shadow-2xl"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className="stroke-[#8A6E1E] animate-spin" style={{ animationDuration: '7s' }}>
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" fill="#D4AF37" strokeWidth="0.8" />
          </svg>
          <span
            className="text-[#705915] text-xs sm:text-sm font-bold tracking-[0.28em] uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Tap to Open
          </span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className="stroke-[#8A6E1E] animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}>
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" fill="#D4AF37" strokeWidth="0.8" />
          </svg>
        </motion.div>

        <motion.p
          animate={{ opacity: [0.5, 0.95, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[#8A6E1E]/85 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase mt-2.5 font-bold"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Touch anywhere to view invitation
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// ── Hero Section for Shradha (Everlasting Vows Clone) ───────────────────────────
function EverlastingVowsHero({ data, isDesktop, isOpened = true }) {
  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%'])
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  // Animation variants
  const fadeInSlow = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 2.2, ease: "easeOut" } }
  }

  const nameContainerVariant = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.14,
      }
    }
  }

  const letterAnimVariant = {
    hidden: { opacity: 0, y: 15, filter: 'blur(2px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      return {
        day: parts[0],
        month: parts[1],
        year: parts[2]
      }
    }
    return { day: '18', month: 'December', year: '2026' }
  }, [data.dateLine])

  return (
    <section
      className={`relative overflow-hidden flex flex-col items-center text-center select-none ${
        isDesktop
          ? 'h-screen w-full justify-start pt-[10vh] pb-16 px-8'
          : 'h-[100svh] w-full justify-start pt-[6svh] sm:pt-[8svh] pb-8 px-6'
      }`}
    >
      {/* Parallax background with smooth landing */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.05, transformOrigin: 'center' }}
        animate={isOpened ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0.88, filter: 'blur(3px)' }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <img
          src={isDesktop ? desktopBg : smartphoneBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center top' }}
          loading="eager"
        />
      </motion.div>

      {/* Falling Gold Petals */}
      <FallingPetals />

      {/* Hero Content Panel with smooth staggered landing */}
      <motion.div
        initial="hidden"
        animate={isOpened ? "show" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 15 },
          show: { 
            opacity: 1, 
            y: 0, 
            transition: { staggerChildren: 0.3, duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 } 
          }
        }}
        className="relative z-20 flex flex-col items-center max-w-xl md:translate-y-0"
      >
        {/* Top Monogram Ornament */}
        <motion.div variants={fadeInSlow} className="mb-2">
          <svg viewBox="0 0 40 24" width="32" height="20" fill="none" className="stroke-[#8A6E1E] opacity-90">
            <path d="M20 2 L20 18" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 10 Q20 4 28 10" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M14 14 Q20 10 26 14" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="1.8" fill="#8A6E1E" />
          </svg>
        </motion.div>

        {/* Top Tag */}
        <motion.p
          variants={fadeInSlow}
          className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#8A6E1E] font-bold mb-2.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.topTag || "Padharo Mhare Des • Save the Date"}
        </motion.p>

        {/* Couple Names with Gold Glare Animation */}
        <motion.h1
          variants={nameContainerVariant}
          className="text-[#8A6E1E] uppercase tracking-[0.1em] select-none font-bold mb-3"
          style={{
            fontFamily: "'Cinzel', serif",
            lineHeight: '1.2',
            fontSize: isDesktop ? 'clamp(2.2rem, 3.8vw, 3.4rem)' : 'clamp(1.8rem, 6.5vw, 2.5rem)'
          }}
        >
          {/* Bride Name First for Shradha */}
          <span className="block mb-0.5 sm:mb-1 relative" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.brideName || 'Shradha').split('').map((char, index) => (
                <motion.span
                  key={`bride-${index}`}
                  variants={letterAnimVariant}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.48) 50%, transparent 60%)',
                backgroundSize: '200% 250%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                zIndex: 2,
                display: 'block',
              }}
              aria-hidden="true"
            >
              {(data.brideName || 'Shradha').split('').map((char, index) => (
                <span key={`bride-glare-${index}`} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </motion.span>
          </span>

          <motion.span
            variants={fadeInSlow}
            className="block my-0.5 text-2xl sm:text-3xl font-medium lowercase italic font-serif text-[#8A6E1E]/90"
          >
            &amp;
          </motion.span>

          {/* Groom Name */}
          <span className="block mt-0.5 sm:mt-1 relative" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.groomName || 'Aayush').split('').map((char, index) => (
                <motion.span
                  key={`groom-${index}`}
                  variants={letterAnimVariant}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.48) 50%, transparent 60%)',
                backgroundSize: '200% 250%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                zIndex: 2,
                display: 'block',
              }}
              aria-hidden="true"
            >
              {(data.groomName || 'Aayush').split('').map((char, index) => (
                <span key={`groom-glare-${index}`} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </motion.span>
          </span>
        </motion.h1>

        {/* Ceremony Subtitle: Roka & Engagement (No Wedding Text) */}
        <motion.p
          variants={fadeInSlow}
          className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#8A6E1E] font-bold mb-2"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.subtitle || "Roka & Engagement Ceremony"}
        </motion.p>

        {/* Custom Divider Line */}
        <motion.div
          variants={fadeInSlow}
          className="flex items-center gap-3 w-32 my-1 opacity-60"
        >
          <div className="h-[0.9px] bg-[#8A6E1E] flex-1" />
          <span className="text-[#8A6E1E] text-[8px]">♥</span>
          <div className="h-[0.9px] bg-[#8A6E1E] flex-1" />
        </motion.div>

        {/* Date Row */}
        <motion.div
          variants={fadeInSlow}
          className={`text-[#8A6E1E] tracking-[0.12em] flex items-center justify-center my-1.5 font-bold ${
            isDesktop ? 'text-2xl md:text-3xl gap-3' : 'text-base sm:text-lg gap-1.5'
          }`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span>{dateParts.day}</span>
          <span className="text-[#8A6E1E]/40 font-bold text-lg sm:text-xl">|</span>
          <span>{dateParts.month}</span>
          <span className="text-[#8A6E1E]/40 font-bold text-lg sm:text-xl">|</span>
          <span>{dateParts.year}</span>
        </motion.div>

        {/* Day of Week */}
        <motion.p
          variants={fadeInSlow}
          className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#8A6E1E] font-bold mb-1.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.dayOfWeek || 'Friday'}
        </motion.p>

        {/* Time of Ceremony */}
        <motion.p
          variants={fadeInSlow}
          className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#8A6E1E]/90 font-bold mb-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.weddingTime || '10:00 AM onwards'}
        </motion.p>

        {/* Venue details */}
        <motion.div variants={fadeInSlow} className="flex flex-col items-center">
          <div className="mb-2">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8A6E1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3.2" />
            </svg>
          </div>
          {data.addressParts && data.addressParts.length > 0 ? (
            <div className="flex flex-col items-center gap-0.5">
              {data.addressParts.map((part, index) => (
                <p
                  key={index}
                  className="text-[#8A6E1E] tracking-[0.18em] uppercase font-bold text-center leading-relaxed"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: isDesktop
                      ? (index === 0 ? 'clamp(14px, 1.4vw, 17px)' : 'clamp(11px, 1.0vw, 13px)')
                      : (index === 0 ? 'clamp(11px, 1.5svh, 13px)' : 'clamp(9px, 1.2svh, 10.5px)'),
                    opacity: index === 0 ? 1 : 0.95
                  }}
                >
                  {part}
                </p>
              ))}
            </div>
          ) : (
            <p
              className="text-[#8A6E1E] tracking-[0.18em] uppercase font-bold text-center leading-relaxed"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: isDesktop ? 'clamp(14px, 1.4vw, 17px)' : 'clamp(11px, 1.5svh, 13px)'
              }}
            >
              {data.venueName}
              <span className="block mt-0.5 text-[#8A6E1E]/90 font-semibold tracking-[0.15em]" style={{ fontSize: isDesktop ? 'clamp(11px, 1.0vw, 13px)' : 'clamp(9px, 1.2svh, 10.5px)' }}>{data.venueCity}</span>
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.button
        type="button"
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
        }}
        aria-label="Scroll down"
        className="absolute z-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ bottom: 'clamp(20px, 4vh, 40px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '1.5px solid rgba(138,110,30,0.3)',
            background: 'rgba(255,253,242,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 18 11" width="13" height="8" fill="none" aria-hidden="true">
            <path d="M1 1.5 L9 9.5 L17 1.5"
              stroke="#8A6E1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.8"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  )
}

// ── Multi-Event Showcase Component (Roka followed by Engagement) ────────────────
function RokaEngagementEvents({ events = [], isDesktop = false }) {
  if (!events || events.length === 0) return null

  return (
    <section className="relative w-full py-16 px-4 md:px-8 bg-[#FFFDF2]/90 overflow-hidden">
      {/* Background Petal Accents */}
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#8A6E1E] font-bold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Auspicious Ceremonies
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#705915] font-bold tracking-[0.1em] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
            Roka &amp; Engagement Schedule
          </h2>
          <div className="flex items-center justify-center gap-3 w-36 mx-auto my-3 opacity-70">
            <div className="h-[1px] bg-[#8A6E1E] flex-1" />
            <span className="text-[#8A6E1E] text-xs">✦</span>
            <div className="h-[1px] bg-[#8A6E1E] flex-1" />
          </div>
          <p className="text-xs sm:text-sm text-[#8A6E1E]/80 max-w-lg mx-auto italic font-serif">
            Padharo Mhare Des — Join us as we perform the sacred rituals and rejoice in the joy of our coming together.
          </p>
        </div>

        {/* Event Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative rounded-2xl border border-[#8A6E1E]/25 bg-[#FFFDF2] p-6 sm:p-8 shadow-[0_8px_30px_rgba(138,110,30,0.08)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(138,110,30,0.14)] transition-all duration-300"
            >
              {/* Card Corner Ornament */}
              <div className="absolute top-3 right-3 text-[#8A6E1E]/40 font-serif text-sm font-bold">
                0{index + 1}
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-[#8A6E1E]/10 text-[#8A6E1E] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                  {event.sectionLabel || (index === 0 ? "Ceremony 1" : "Ceremony 2")}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-[#705915] mb-2 leading-snug" style={{ fontFamily: "'Cinzel', serif" }}>
                  {event.eventName}
                </h3>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8A6E1E] font-semibold mb-3">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{event.dateTimeLine}</span>
                </div>

                {/* Venue Details */}
                <div className="text-xs text-[#8A6E1E]/90 leading-relaxed mb-4">
                  <p className="font-bold text-[#705915]">{event.venueName || event.venueLine1}</p>
                  <p>{event.venueLine2}</p>
                </div>

                {/* Description / Ritual note */}
                {event.description && (
                  <p className="text-xs text-[#8A6E1E]/80 italic mb-4 leading-relaxed font-serif">
                    &ldquo;{event.description}&rdquo;
                  </p>
                )}

                {/* Dress Code */}
                {event.dressCode && (
                  <div className="text-[11px] text-[#8A6E1E] bg-[#FFF8E7] px-3 py-2 rounded-lg border border-[#8A6E1E]/15 mb-4">
                    <span className="font-bold uppercase tracking-wider">Attire: </span>
                    <span>{event.dressCode}</span>
                  </div>
                )}
              </div>

              {/* Map Link */}
              {event.mapUrl && (
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#8A6E1E]/30 bg-white/80 hover:bg-[#8A6E1E] text-[#8A6E1E] hover:text-white text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 shadow-sm"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Get Directions
                </a>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ── MAIN CUSTOM TEMPLATE COMPONENT (Shradha Roka & Engagement) ──────────────────
export default function CustomEverlastingVowsShradha() {
  const location = useLocation()
  const { variant = '1' } = useParams()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const [isOpened, setIsOpened] = useState(false)
  const [showBrandSplash, setShowBrandSplash] = useState(!isPreview)

  useEffect(() => {
    let isMounted = true
    const img1 = new Image()
    const img2 = new Image()
    const img3 = new Image()
    img1.src = puppetBgWebp
    img2.src = puppetLeftWebp
    img3.src = puppetRightWebp

    const timer = setTimeout(() => {
      if (isMounted) setShowBrandSplash(false)
    }, 1200)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [isPreview])

  // Load custom editor changes from localStorage or fallback to default shradhaData
  const [customData, setCustomData] = useState(() => {
    try {
      const saved = localStorage.getItem(`inviteque_custom_data_everlastingvows_Shradha_v${variant}`)
      if (saved) return JSON.parse(saved)
      const savedFallback = localStorage.getItem('inviteque_custom_data_everlastingvows_Shradha')
      if (savedFallback) return JSON.parse(savedFallback)
    } catch (e) {
      console.error('Failed to parse saved Shradha custom data', e)
    }
    return null
  })

  // Merge shradhaData with localStorage custom edits
  const mergedData = useMemo(() => {
    const base = shradhaData
    if (!customData) return base

    return {
      ...base,
      hero: {
        ...base.hero,
        groomName: customData.groomName || base.hero.groomName,
        brideName: customData.brideName || base.hero.brideName,
        weddingDate: customData.weddingDate || base.hero.weddingDate,
        weddingMonth: customData.weddingMonth || base.hero.weddingMonth,
        weddingYear: customData.weddingYear || base.hero.weddingYear,
        weddingTime: customData.weddingTime || base.hero.weddingTime,
        dateLine: customData.weddingDate && customData.weddingMonth && customData.weddingYear 
          ? `${customData.weddingDate} ${customData.weddingMonth} ${customData.weddingYear}` 
          : base.hero.dateLine,
        venueName: customData.venueName || base.hero.venueName,
        venueCity: customData.venueCity || base.hero.venueCity,
        subtitle: customData.heroSubtitle || base.hero.subtitle,
      },
      events: Array.isArray(customData.events) && customData.events.length > 0
        ? customData.events
        : base.events,
      venue: {
        ...base.venue,
        venueName: customData.venueName || base.venue.venueName,
        venueLine1: customData.venueLine1 || base.venue.venueLine1,
        venueLine2: customData.venueLine2 || base.venue.venueLine2,
        mapUrl: customData.mapUrl || base.venue.mapUrl,
      },
      countdown: {
        ...base.countdown,
        targetDateTimeISO: customData.countdownTargetDate 
          ? `${customData.countdownTargetDate}T10:30:00.000Z` 
          : base.countdown.targetDateTimeISO,
      },
      celebrate: {
        ...base.celebrate,
        rsvp: {
          ...base.celebrate.rsvp,
          title: customData.rsvpTitle || base.celebrate.rsvp.title,
          description: customData.rsvpDescription || base.celebrate.rsvp.description,
        }
      }
    }
  }, [customData])

  return (
    <div className="w-full min-h-screen bg-[#FFFDF2] text-[#8A6E1E] font-sans antialiased selection:bg-[#8A6E1E]/20 relative overflow-x-hidden">
      
      {/* Brand Identity Loading Splash Screen */}
      <SplashScreen loading={showBrandSplash} />

      {/* Interactive Puppet Tap-To-Open Splash Screen */}
      <PuppetSplashScreen isOpened={isOpened} onOpen={() => setIsOpened(true)} />

      {/* Floating Edit Button for Quick Customization */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <Link
          to={`/template/everlastingvows/Shradha/edit`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#8A6E1E]/40 bg-white/90 backdrop-blur-md text-[#8A6E1E] text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Customize
        </Link>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden w-full min-h-screen bg-[#FFFDF2] relative">
        <div className="w-full">
          <EverlastingVowsHero data={mergedData.hero} isDesktop={false} isOpened={isOpened} />
          
          {/* Multi-Events: Roka followed by Engagement */}
          <RokaEngagementEvents events={mergedData.events} isDesktop={false} />

          {/* Venue Card */}
          <Venue data={mergedData.venue} bgImage={locationBgMobile} theme="gold" isDesktop={false} />

          {/* RSVP */}
          <InviteQRSVP
            weddingCode="SHRADHA"
            isPreview={true}
            theme="everlasting"
            config={mergedData.celebrate?.rsvp}
          />

          {/* Countdown */}
          <Countdown data={mergedData.countdown} bgImage={countdownBgMobile} theme="gold" isDesktop={false} />

          {/* Footer */}
          <Footer data={mergedData.footer} theme="gold" />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block w-full min-h-screen bg-[#FFFDF2] relative">
        <div className="w-full">
          <EverlastingVowsHero data={mergedData.hero} isDesktop={true} isOpened={isOpened} />
        </div>
        
        {/* Multi-Events: Roka followed by Engagement */}
        <div className="w-full">
          <RokaEngagementEvents events={mergedData.events} isDesktop={true} />
        </div>

        {/* Venue Card */}
        <div className="w-full">
          <Venue data={mergedData.venue} isDesktop={true} bgImage={locationBgDesktop} theme="gold" />
        </div>

        {/* RSVP */}
        <div className="w-full">
          <InviteQRSVP
            weddingCode="SHRADHA"
            isPreview={true}
            theme="everlasting"
            config={mergedData.celebrate?.rsvp}
          />
        </div>

        {/* Countdown */}
        <div className="w-full">
          <Countdown data={mergedData.countdown} isDesktop={true} bgImage={countdownBgDesktop} theme="gold" />
        </div>

        {/* Footer */}
        <div className="w-full">
          <Footer data={mergedData.footer} isDesktop={true} theme="gold" />
        </div>
      </div>

    </div>
  )
}
