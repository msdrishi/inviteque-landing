import { useMemo, useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { shradhaData } from '../../data/custom/shradhaData.js'
import Countdown from '../../components/Countdown.jsx'
import Venue from '../../components/Venue.jsx'
import Footer from '../../components/Footer.jsx'
import SplashScreen from '../../components/SplashScreen.jsx'
import cMapping from '../../everlastingVowsCloudinaryMapping.json'

// Background & Puppet WebP assets
const desktopBg = cMapping['hero_desktop.png'] || "/assets/templates/everlasting-vows/hero-desktop.webp"
const smartphoneBg = cMapping['hero_mobile.png'] || "/assets/templates/everlasting-vows/hero-mobile.webp"
const locationBgDesktop = cMapping['venue_desktop.png'] || "/assets/templates/everlasting-vows/venue-desktop.webp"
const locationBgMobile = cMapping['venue_mobile.png'] || "/assets/templates/everlasting-vows/venue-mobile.webp"
const countdownBgDesktop = cMapping['countdown_desktop.png'] || "/assets/templates/everlasting-vows/countdown-desktop.webp"
const countdownBgMobile = cMapping['countdown_mobile.png'] || "/assets/templates/everlasting-vows/countdown-mobile.webp"

// Dedicated WebP backgrounds for Roka and Engagement events
const rokaDesktopBg = "/assets/templates/everlasting-vows/roka-event-desktop.webp"
const rokaMobileBg = "/assets/templates/everlasting-vows/roka-event-mobile.webp"
const engagementDesktopBg = "/assets/templates/everlasting-vows/engagement-desktop.webp"
const engagementMobileBg = "/assets/templates/everlasting-vows/engagement-mobile.webp"

const puppetBgWebp = "/assets/templates/everlasting-vows/puppet-background.webp"
const puppetLeftWebp = "/assets/templates/everlasting-vows/puppet-left.webp"
const puppetRightWebp = "/assets/templates/everlasting-vows/puppet-right.webp"

// ── Venue Matching Animation Variants ────────────────────────────────────────
const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const letterAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
}

function AnimatedTitle({ text, className, style }) {
  return (
    <motion.h2
      variants={letterContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.1 }}
      className={className}
      style={style}
    >
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterAnim} style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h2>
  )
}

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

// ── Rajasthani Bandhani Mandala / Rangoli SVG Component ───────────────────────
function BandhaniMandalaSVG({ size = 'clamp(280px, 80vw, 540px)', opacity = 1 }) {
  return (
    <div className="relative pointer-events-none flex items-center justify-center" style={{ opacity }}>
      {/* Outer Glow Halo */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size,
          height: size,
          background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(245,214,124,0.08) 45%, rgba(253,246,226,0) 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Main Rotating Bandhani Mandala SVG */}
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotate: 360, scale: [1, 1.02, 1] }}
        transition={{
          rotate: { repeat: Infinity, duration: 45, ease: 'linear' },
          scale: { repeat: Infinity, duration: 6, ease: 'easeInOut' }
        }}
      >
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(138,110,30,0.12)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="300" cy="300" r="285" stroke="#8A6E1E" strokeWidth="2.5" strokeDasharray="3 8" strokeOpacity="0.55" />
          <circle cx="300" cy="300" r="275" stroke="#B8860B" strokeWidth="3" strokeDasharray="6 7" strokeOpacity="0.75" />
          <circle cx="300" cy="300" r="263" stroke="#8A6E1E" strokeWidth="2" strokeOpacity="0.6" />
          <circle cx="300" cy="300" r="255" stroke="#D4AF37" strokeWidth="2" strokeDasharray="2 6" strokeOpacity="0.7" />

          {/* Outer Bandhani Dotted Chevrons */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16
            return (
              <g key={`outer-tri-${i}`} transform={`rotate(${angle} 300 300)`}>
                <path
                  d="M 300 45 L 340 100 L 260 100 Z"
                  stroke="#8A6E1E"
                  strokeWidth="2"
                  strokeDasharray="3 4.5"
                  fill="rgba(212,175,55,0.08)"
                />
                <circle cx="300" cy="68" r="3.2" fill="#8A6E1E" fillOpacity="0.85" />
                <circle cx="286" cy="85" r="2.6" fill="#B8860B" fillOpacity="0.8" />
                <circle cx="314" cy="85" r="2.6" fill="#B8860B" fillOpacity="0.8" />
                <circle cx="300" cy="88" r="3" fill="#8A6E1E" fillOpacity="0.9" />
                <circle cx="292" cy="76" r="1.8" fill="#D4AF37" />
                <circle cx="308" cy="76" r="1.8" fill="#D4AF37" />
              </g>
            )
          })}

          <circle cx="300" cy="300" r="200" stroke="#8A6E1E" strokeWidth="2.5" strokeOpacity="0.7" />
          <circle cx="300" cy="300" r="192" stroke="#B8860B" strokeWidth="3" strokeDasharray="4 6" strokeOpacity="0.8" />
          <circle cx="300" cy="300" r="184" stroke="#8A6E1E" strokeWidth="1.8" strokeOpacity="0.6" />

          {/* Middle Bandhani Lotus Petals */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12
            return (
              <g key={`mid-petal-${i}`} transform={`rotate(${angle} 300 300)`}>
                <path
                  d="M 255 184 C 270 120, 330 120, 345 184"
                  stroke="#8A6E1E"
                  strokeWidth="2.8"
                  strokeDasharray="3.5 5"
                  fill="none"
                />
                <path
                  d="M 270 184 C 282 140, 318 140, 330 184"
                  stroke="#B8860B"
                  strokeWidth="2.5"
                  strokeDasharray="2.5 4"
                  fill="rgba(212,175,55,0.12)"
                />
                <circle cx="300" cy="142" r="3.4" fill="#8A6E1E" />
                <circle cx="290" cy="155" r="2.6" fill="#B8860B" />
                <circle cx="310" cy="155" r="2.6" fill="#B8860B" />
                <circle cx="300" cy="168" r="3" fill="#8A6E1E" />
                <circle cx="282" cy="172" r="2" fill="#D4AF37" />
                <circle cx="318" cy="172" r="2" fill="#D4AF37" />
              </g>
            )
          })}

          <circle cx="300" cy="300" r="116" stroke="#8A6E1E" strokeWidth="2.5" strokeOpacity="0.75" />
          <circle cx="300" cy="300" r="108" stroke="#B8860B" strokeWidth="3" strokeDasharray="3.5 5" strokeOpacity="0.85" />
          <circle cx="300" cy="300" r="100" stroke="#8A6E1E" strokeWidth="2" strokeOpacity="0.65" />

          {/* Center 8-Petal Rosette */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8
            return (
              <g key={`inner-petal-${i}`} transform={`rotate(${angle} 300 300)`}>
                <path
                  d="M 278 245 C 285 210, 315 210, 322 245 C 315 260, 285 260, 278 245 Z"
                  stroke="#8A6E1E"
                  strokeWidth="2.4"
                  strokeDasharray="2.8 4"
                  fill="rgba(212,175,55,0.18)"
                />
                <circle cx="300" cy="230" r="3" fill="#8A6E1E" />
                <circle cx="292" cy="242" r="2.2" fill="#B8860B" />
                <circle cx="308" cy="242" r="2.2" fill="#B8860B" />
              </g>
            )
          })}

          <circle cx="300" cy="300" r="42" fill="rgba(212,175,55,0.25)" stroke="#8A6E1E" strokeWidth="2" />
          <circle cx="300" cy="300" r="34" stroke="#B8860B" strokeWidth="2.5" strokeDasharray="3 4.5" />
          <circle cx="300" cy="300" r="24" stroke="#8A6E1E" strokeWidth="1.8" />
          <circle cx="300" cy="300" r="15" fill="#8A6E1E" fillOpacity="0.9" />
          <circle cx="300" cy="300" r="5" fill="#FFFDF2" />
        </svg>
      </motion.div>
    </div>
  )
}

// ── Correctly Centered Bandhani Rangoli in Middle of Screen ───────────────────
function BandhaniRangoli({ isOpened }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[12] flex items-center justify-center">
      <motion.div
        animate={
          isOpened
            ? { opacity: [1, 1, 0.7, 0], scale: [1, 1.03, 1.12, 1.25] }
            : { opacity: 1, scale: 1 }
        }
        transition={{ 
          duration: 3.4, 
          ease: [0.25, 0.1, 0.25, 1], 
          times: [0, 0.65, 0.85, 1],
          delay: 0 
        }}
      >
        <BandhaniMandalaSVG size="clamp(280px, 78vw, 540px)" opacity={1} />
      </motion.div>
    </div>
  )
}

// ── Interactive Puppet Splash Screen with Opaque Backdrop Until Full Puppet Exit ──
function PuppetSplashScreen({ isOpened, onOpen, data }) {
  const bride = data?.brideName || "Shradha"
  const groom = data?.groomName || "Gagan"

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={
        isOpened
          ? { opacity: [1, 1, 0], pointerEvents: 'none' }
          : { opacity: 1, pointerEvents: 'auto' }
      }
      transition={{ 
        duration: 3.5, 
        ease: "easeInOut",
        times: [0, 0.75, 1], // Stays 100% opaque until 2.6s (75% of 3.5s) while puppets exit
        delay: 0 
      }}
      onClick={onOpen}
      className="fixed inset-0 z-[9999] flex flex-col justify-between items-center cursor-pointer select-none overflow-hidden bg-[#FDF6E2]"
    >
      {/* Background Image: Stays 100% opaque until puppets leave completely */}
      <motion.img
        src={puppetBgWebp}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        animate={
          isOpened
            ? { scale: [1, 1.02, 1.06], opacity: [1, 1, 0] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ 
          duration: 3.5, 
          ease: "easeInOut",
          times: [0, 0.75, 1],
          delay: 0
        }}
      />

      <div 
        className="absolute inset-0 pointer-events-none z-[8]"
        style={{
          background: 'linear-gradient(105deg, rgba(255,255,255,0.25) 0%, rgba(255,253,242,0.05) 50%, rgba(0,0,0,0.02) 100%)'
        }}
      />

      <FallingPetals />
      
      {/* Centered Rangoli in the middle of the screen */}
      <BandhaniRangoli isOpened={isOpened} />

      {/* Left Puppet (Groom) - Fully visible while gliding completely off-screen */}
      <motion.div
        className="absolute z-20 pointer-events-none origin-top-left flex items-center justify-start"
        style={{
          top: '9svh',
          left: '-4%',
          width: 'clamp(210px, 52vw, 320px)',
          height: '63svh',
          maxHeight: '580px',
        }}
        animate={
          isOpened
            ? {
                x: [0, '3%', '-8%', '-60%', '-230%'],
                y: [0, '-18px', '2px', '-8vh', '-26vh'],
                rotate: [-2, 3, -4, -12, -20],
                scale: [1, 1.04, 1.02, 0.98, 0.94],
                opacity: [1, 1, 1, 1, 0],
              }
            : { rotate: [-2.2, 2.8, -2.2], y: [0, 12, 0], x: [0, 4, 0] }
        }
        transition={
          isOpened
            ? { 
                duration: 2.7, 
                ease: [0.25, 0.1, 0.25, 1], 
                times: [0, 0.15, 0.35, 0.7, 1],
                delay: 0 
              }
            : { repeat: Infinity, duration: 4.8, ease: "easeInOut" }
        }
      >
        <img
          src={puppetLeftWebp}
          alt="Rajasthani Groom Puppet"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(5px 4px 8px rgba(0,0,0,0.18)) drop-shadow(2px 2px 4px rgba(138,110,30,0.12))'
          }}
          loading="eager"
        />
      </motion.div>

      {/* Right Puppet (Bride) - Fully visible while gliding completely off-screen */}
      <motion.div
        className="absolute z-20 pointer-events-none origin-top-right flex items-center justify-end"
        style={{
          top: '9svh',
          right: '-4%',
          width: 'clamp(210px, 52vw, 320px)',
          height: '63svh',
          maxHeight: '580px',
        }}
        animate={
          isOpened
            ? {
                x: [0, '-3%', '8%', '60%', '230%'],
                y: [0, '-18px', '2px', '-8vh', '-26vh'],
                rotate: [2, -3, 4, 12, 20],
                scale: [1, 1.04, 1.02, 0.98, 0.94],
                opacity: [1, 1, 1, 1, 0],
              }
            : { rotate: [2.8, -2.2, 2.8], y: [8, -4, 8], x: [0, -4, 0] }
        }
        transition={
          isOpened
            ? { 
                duration: 2.7, 
                ease: [0.25, 0.1, 0.25, 1], 
                times: [0, 0.15, 0.35, 0.7, 1],
                delay: 0.02 
              }
            : { repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.25 }
        }
      >
        <img
          src={puppetRightWebp}
          alt="Rajasthani Bride Puppet"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(6px 4px 8px rgba(0,0,0,0.18)) drop-shadow(2px 2px 4px rgba(138,110,30,0.12))'
          }}
          loading="eager"
        />
      </motion.div>

      <div className="w-full pt-4" />

      {/* Bottom Area: Text & Tap to Open (Fades out immediately on tap) */}
      <motion.div
        className="relative z-30 flex flex-col items-center text-center px-4 pb-8 sm:pb-12 max-w-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={isOpened ? { opacity: 0, y: 15, scale: 0.96 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: isOpened ? 0.6 : 1.2, 
          ease: "easeOut",
          delay: 0
        }}
      >
        <div className="mb-4 sm:mb-5">
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="text-[#8A6E1E] uppercase tracking-[0.3em] text-[11px] sm:text-xs font-bold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            पधारो सा • Padharo Sa
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35 }}
            className="text-[#705915] text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.12em] my-1 uppercase"
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
            transition={{ duration: 1.0, delay: 0.5 }}
            className="text-[#8A6E1E]/95 text-xs sm:text-sm tracking-[0.25em] uppercase font-bold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {bride} &amp; {groom}
          </motion.p>
        </div>

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

// ── Hero Section (Revealed Only After Splash Screen Completes Exit) ───────────
function EverlastingVowsHero({ data, isDesktop, isOpened = true }) {
  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%'])
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  const brideName = data?.brideName || "Shradha"
  const groomName = data?.groomName || "Gagan"
  const welcomeText = data?.welcomeMessage || "We warmly welcome you all and would love to have your gracious presence to celebrate our new beginning."

  return (
    <section
      className={`relative overflow-hidden flex flex-col items-center text-center select-none ${
        isDesktop
          ? 'min-h-screen w-full justify-start pt-[20vh] sm:pt-[22vh] pb-16 px-8'
          : 'min-h-[100svh] w-full justify-start pt-[18svh] sm:pt-[20svh] pb-12 px-6'
      }`}
    >
      {/* Parallax background: Stays hidden until splash screen animation completes, then smoothly reveals */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.05, transformOrigin: 'center' }}
        animate={isOpened ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(4px)' }}
        transition={{ duration: 1.2, delay: 2.6, ease: "easeOut" }}
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

      <FallingPetals />

      {/* Hero Content Panel positioned comfortably down inside palace arch window */}
      <motion.div
        initial="hidden"
        animate={isOpened ? "show" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 22, scale: 0.98 },
          show: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { staggerChildren: 0.16, duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 2.7 } 
          }
        }}
        className="relative z-20 flex flex-col items-center max-w-xl"
      >
        {/* Top Tag */}
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-[#8A6E1E]">✦</span>
          <p
            className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#8A6E1E] font-bold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {data?.topTag || "पधारो सा • Khamma Ghani"}
          </p>
          <span className="text-xs text-[#8A6E1E]">✦</span>
        </motion.div>

        {/* Couple Names with Gold Glare Animation */}
        <motion.h1
          variants={letterContainer}
          className="text-[#8A6E1E] uppercase tracking-[0.1em] select-none font-bold my-1 sm:my-2"
          style={{
            fontFamily: "'Cinzel', serif",
            lineHeight: '1.18',
            fontSize: isDesktop ? 'clamp(2.3rem, 4.0vw, 3.5rem)' : 'clamp(1.85rem, 7.0vw, 2.5rem)'
          }}
        >
          {/* Bride Name */}
          <span className="block mb-0.5 relative" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {brideName.split('').map((char, index) => (
                <motion.span
                  key={`bride-${index}`}
                  variants={letterAnim}
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
              {brideName.split('').map((char, index) => (
                <span key={`bride-glare-${index}`} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </motion.span>
          </span>

          <motion.span
            variants={fadeUp}
            className="block my-0.5 text-2xl sm:text-3xl font-medium lowercase italic font-serif text-[#8A6E1E]/90"
          >
            &amp;
          </motion.span>

          {/* Groom Name */}
          <span className="block mt-0.5 relative" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {groomName.split('').map((char, index) => (
                <motion.span
                  key={`groom-${index}`}
                  variants={letterAnim}
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
              {groomName.split('').map((char, index) => (
                <span key={`groom-glare-${index}`} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </motion.span>
          </span>
        </motion.h1>

        {/* Family Affiliation Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[#705915] font-bold mt-1 mb-1.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Together with the Soin &amp; Vashishth Families
        </motion.p>

        {/* Traditional Ornamental Divider */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 w-36 my-1.5 opacity-70"
        >
          <div className="h-[1px] bg-[#8A6E1E] flex-1" />
          <span className="text-[#8A6E1E] text-xs">✦</span>
          <div className="h-[1px] bg-[#8A6E1E] flex-1" />
        </motion.div>

        {/* Clean Minimal Welcoming Text */}
        <motion.p
          variants={fadeUp}
          className="text-xs sm:text-sm text-[#8A6E1E] leading-relaxed italic max-w-md mt-1.5 px-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          &ldquo;{welcomeText}&rdquo;
        </motion.p>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.button
        type="button"
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
        }}
        aria-label="Scroll down"
        className="absolute z-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ bottom: 'clamp(14px, 2.5vh, 28px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1.5px solid rgba(138,110,30,0.3)',
            background: 'rgba(255,253,242,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 18 11" width="12" height="7" fill="none" aria-hidden="true">
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

// ── Fullscreen Individual Event Section with Venue-Matching Typography & Animations ──
function FullscreenEventSection({ event, index, isDesktop }) {
  if (!event) return null
  const isRoka = index === 0
  
  // Dedicated background images without any overlay filter or opacity
  const bgImg = isRoka 
    ? (isDesktop ? rokaDesktopBg : rokaMobileBg)
    : (isDesktop ? engagementDesktopBg : engagementMobileBg)

  // Title: "Roka Ceremony" or "Engagement"
  const titleText = isRoka ? "Roka Ceremony" : "Engagement"

  return (
    <section className="relative w-full min-h-[100svh] md:h-screen flex flex-col justify-start pt-[22svh] sm:pt-[25svh] md:pt-[24vh] items-center text-center px-6 md:px-12 pb-16 overflow-hidden select-none">
      {/* Background Image pure and crisp without any overlay filter or opacity */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={bgImg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Clean Typography Content positioned down in the clear area */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={{
          hidden: { opacity: 0, y: 15 },
          show: { 
            opacity: 1, 
            y: 0, 
            transition: { staggerChildren: 0.15, duration: 1.0, ease: [0.22, 1, 0.36, 1] } 
          }
        }}
        className="relative z-10 max-w-xl flex flex-col items-center"
      >
        {/* Top Tag */}
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-[#8A6E1E]">✦</span>
          <p className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#8A6E1E] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
            {isRoka ? "पधारो सा • Shubh Shuruwaat" : "पधारो सा • Ring Ceremony"}
          </p>
          <span className="text-xs text-[#8A6E1E]">✦</span>
        </motion.div>

        {/* Ceremony Name with Venue-style AnimatedTitle letter animation */}
        <AnimatedTitle
          text={titleText}
          className="font-semibold uppercase tracking-[0.14em] my-1"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: isDesktop ? 'clamp(28px, 3.2vw, 38px)' : 'clamp(24px, 6.5vw, 30px)',
            fontWeight: 600,
            color: '#8A6E1E',
            textShadow: '0 4px 16px rgba(255, 253, 242, 0.8)'
          }}
        />

        {/* Ornamental Divider matching Venue style */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 w-36 my-2 opacity-70">
          <div className="h-[1px] bg-[#8A6E1E] flex-1" />
          <span className="text-[#8A6E1E] text-xs">✦</span>
          <div className="h-[1px] bg-[#8A6E1E] flex-1" />
        </motion.div>

        {/* Timing & Date Line - Clean Inline Layout using Montserrat matching Venue details */}
        <motion.div 
          variants={fadeUp} 
          className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#705915] font-semibold tracking-[0.08em] uppercase my-2 max-w-sm sm:max-w-md mx-auto"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-[#8A6E1E]">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="leading-snug">{event.dateTimeLine}</span>
        </motion.div>

        {/* Ritual Description matching Venue font */}
        {event.description && (
          <motion.p 
            variants={fadeUp} 
            className="text-xs sm:text-sm text-[#705915]/90 italic leading-relaxed max-w-md my-1.5 px-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            &ldquo;{event.description}&rdquo;
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}

// ── Plain Fullscreen Family Closing Section (#FAE9C3 Background with Centered Content & Top Semi-Circular Rangoli) ──
function FullscreenFamilyClosingSection() {
  return (
    <section 
      className="relative w-full min-h-[100svh] md:h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 py-16 overflow-hidden select-none"
      style={{ backgroundColor: '#FAE9C3' }}
    >
      {/* Semi-circular Rotating Bandhani Mandala Rangoli hanging gracefully from the top edge */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-0" style={{ transform: 'translateY(-50%)' }}>
        <BandhaniMandalaSVG size="clamp(320px, 90vw, 580px)" opacity={0.6} />
      </div>

      {/* Family Welcome Contents positioned in the exact center/middle of the section */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={{
          hidden: { opacity: 0, y: 15 },
          show: { 
            opacity: 1, 
            y: 0, 
            transition: { staggerChildren: 0.15, duration: 1.0, ease: [0.22, 1, 0.36, 1] } 
          }
        }}
        className="relative z-10 max-w-xl flex flex-col items-center my-auto"
      >
        {/* Traditional Slang Greeting */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl text-[#8A6E1E] font-bold tracking-[0.2em] mb-2 uppercase"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          “ पधारो सा ”
        </motion.h2>

        {/* Ornamental Divider */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 w-36 my-2 opacity-70">
          <div className="h-[1px] bg-[#8A6E1E] flex-1" />
          <span className="text-[#8A6E1E] text-xs">✦</span>
          <div className="h-[1px] bg-[#8A6E1E] flex-1" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-xs sm:text-sm text-[#705915] tracking-[0.25em] uppercase font-semibold my-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Warmly Invited &amp; With Best Compliments From
        </motion.p>

        {/* Both Family Names with AnimatedTitle - Wrapped to prevent trailing 'S' breaking off */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 my-2 max-w-full">
          <span className="whitespace-nowrap inline-block">
            <AnimatedTitle
              text="SOIN’S"
              className="font-semibold uppercase tracking-[0.12em] inline-block"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(20px, 4.2vw, 36px)',
                fontWeight: 700,
                color: '#705915',
              }}
            />
          </span>
          <span 
            className="text-[#8A6E1E] text-2xl sm:text-3xl font-serif font-normal italic lowercase px-1 inline-block"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            &amp;
          </span>
          <span className="whitespace-nowrap inline-block">
            <AnimatedTitle
              text="VASHISHTH’S"
              className="font-semibold uppercase tracking-[0.12em] inline-block"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(20px, 4.2vw, 36px)',
                fontWeight: 700,
                color: '#705915',
              }}
            />
          </span>
        </div>

        <motion.p 
          variants={fadeUp} 
          className="text-xs sm:text-sm text-[#705915]/95 italic max-w-md my-3 leading-relaxed px-4"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          The Soin Family &amp; The Vashishth Family joyfully look forward to celebrating this blessed union with you and your family.
        </motion.p>
      </motion.div>
    </section>
  )
}

// ── MAIN CUSTOM TEMPLATE COMPONENT (Shradha & Gagan Roka & Engagement) ────────
export default function CustomEverlastingVowsShradha() {
  const location = useLocation()
  const { variant = '1' } = useParams()
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
  const [customData] = useState(() => {
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
        venueName: customData.venueName || base.hero.venueName,
        venueCity: customData.venueCity || base.hero.venueCity,
        welcomeMessage: customData.welcomeMessage || base.hero.welcomeMessage,
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
          ? `${customData.countdownTargetDate}T11:00:00.000Z` 
          : base.countdown.targetDateTimeISO,
      }
    }
  }, [customData])

  // Watermark status (shown for preview unless paid)
  const isPaid = customData && (
    String(customData.status).toUpperCase() === 'PAID' ||
    customData.isPaid === true
  )
  const showWatermark = !isPaid

  return (
    <div className="w-full min-h-screen bg-[#FFFDF2] text-[#8A6E1E] font-sans antialiased selection:bg-[#8A6E1E]/20 relative overflow-x-hidden">
      
      {/* Brand Identity Loading Splash Screen */}
      <SplashScreen loading={showBrandSplash} />

      {/* Interactive Puppet Tap-To-Open Splash Screen */}
      <PuppetSplashScreen isOpened={isOpened} onOpen={() => setIsOpened(true)} data={mergedData.hero} />

      {/* Fixed Watermark Layer (Visible on Puppet Splash page and throughout the invitation) */}
      {showWatermark && (
        <>
          {/* Mobile Watermark */}
          <div className="md:hidden pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[10000] opacity-[0.35] select-none text-[#8A6E1E]">
            <span className="absolute top-[8%] left-1/2 -translate-x-1/2 text-[18px] font-medium tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] font-medium tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
            <span className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[18px] font-medium tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
          </div>

          {/* Desktop Watermark */}
          <div className="hidden md:flex pointer-events-none fixed inset-0 z-[10000] opacity-[0.22] select-none flex-col justify-around items-center text-[#8A6E1E]">
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
          </div>
        </>
      )}

      {/* MOBILE VIEW */}
      <div className="md:hidden w-full min-h-screen bg-[#FFFDF2] relative">
        <div className="w-full">
          {/* 1. Hero Section (Lowered into Arch Window) */}
          <EverlastingVowsHero data={mergedData.hero} isDesktop={false} isOpened={isOpened} />
          
          {/* 2. Fullscreen Roka Ceremony Section */}
          {mergedData.events?.[0] && (
            <FullscreenEventSection event={mergedData.events[0]} index={0} isDesktop={false} />
          )}

          {/* 3. Fullscreen Engagement Ceremony Section */}
          {mergedData.events?.[1] && (
            <FullscreenEventSection event={mergedData.events[1]} index={1} isDesktop={false} />
          )}

          {/* 4. Venue Details (With updated Google Maps link) */}
          <Venue data={mergedData.venue} bgImage={locationBgMobile} theme="gold" isDesktop={false} />

          {/* 5. Countdown (20th October 2026) */}
          <Countdown data={mergedData.countdown} bgImage={countdownBgMobile} theme="gold" isDesktop={false} />

          {/* 6. Plain #FAE9C3 Background Family Closing Section with Center Contents & Top Semi-Circular Rangoli */}
          <FullscreenFamilyClosingSection />

          {/* 7. Footer */}
          <Footer data={mergedData.footer} theme="gold" />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block w-full min-h-screen bg-[#FFFDF2] relative">
        <div className="w-full">
          {/* 1. Hero Section (Lowered into Arch Window) */}
          <EverlastingVowsHero data={mergedData.hero} isDesktop={true} isOpened={isOpened} />
        </div>
        
        {/* 2. Fullscreen Roka Ceremony Section */}
        {mergedData.events?.[0] && (
          <div className="w-full">
            <FullscreenEventSection event={mergedData.events[0]} index={0} isDesktop={true} />
          </div>
        )}

        {/* 3. Fullscreen Engagement Ceremony Section */}
        {mergedData.events?.[1] && (
          <div className="w-full">
            <FullscreenEventSection event={mergedData.events[1]} index={1} isDesktop={true} />
          </div>
        )}

        {/* 4. Venue Details (With updated Google Maps link) */}
        <div className="w-full">
          <Venue data={mergedData.venue} isDesktop={true} bgImage={locationBgDesktop} theme="gold" />
        </div>

        {/* 5. Countdown (20th October 2026) */}
        <div className="w-full">
          <Countdown data={mergedData.countdown} isDesktop={true} bgImage={countdownBgDesktop} theme="gold" />
        </div>

        {/* 6. Plain #FAE9C3 Background Family Closing Section with Center Contents & Top Semi-Circular Rangoli */}
        <div className="w-full">
          <FullscreenFamilyClosingSection />
        </div>

        {/* 7. Footer */}
        <div className="w-full">
          <Footer data={mergedData.footer} isDesktop={true} theme="gold" />
        </div>
      </div>

    </div>
  )
}
