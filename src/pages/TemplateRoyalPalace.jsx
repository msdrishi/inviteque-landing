import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import { weddingData as staticData } from '../weddingData.js'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import cMapping from '../royalPalaceCloudinaryMapping.json'

// Background Assets (Directly from local public directory)
const heroBgDesktop = "/backgrounds/Royal Palace/Hero_Desktop.png"
const heroBgMobile = "/backgrounds/Royal Palace/Hero_Mobile.png"
const photoBgDesktop = cMapping['photo-desktop.png'] || "/backgrounds/Royal Palace/photo-desktop.png"
const photoBgMobile = cMapping['photo-mobile.png'] || "/backgrounds/Royal Palace/photo-mobile.png"
const messageBgDesktop = cMapping['message-desktop.png'] || "/backgrounds/Royal Palace/message-desktop.png"
const messageBgMobile = cMapping['message-moboile.png'] || "/backgrounds/Royal Palace/message-moboile.png"
const venueBgDesktop = cMapping['venue-desktop.png'] || "/backgrounds/Royal Palace/venue-desktop.png"
const venueBgMobile = cMapping['venue-mobile.png'] || "/backgrounds/Royal Palace/venue-mobile.png"
const countdownBgDesktop = cMapping['countdown-deskotp.png'] || "/backgrounds/Royal Palace/countdown-deskotp.png"
const countdownBgMobile = cMapping['countdown-mobile.png'] || "/backgrounds/Royal Palace/countdown-mobile.png"

const fallbackPhoto1 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1779029555/yrekh9qkgebpcds6dplq.png"
const fallbackPhoto2 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1779029557/lly3pbmivrtjn203eclo.png"
const fallbackPhoto3 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1779029558/enoivgqhs1oi2bxery8n.png"

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

// Inline Symmetrical Dividers
const LeafDivider = ({ color = '#C59B3F' }) => (
  <div className="flex items-center justify-center gap-1.5 my-1 select-none w-full max-w-[280px]">
    {/* Left Line */}
    <div className="flex-1 flex items-center justify-end">
      <div className="h-[0.7px] w-full" style={{ backgroundColor: color, opacity: 0.35 }} />
      <div className="w-1.5 h-1.5 rounded-full mx-1" style={{ backgroundColor: color }} />
      <span className="text-[8px] inline-block" style={{ color, transform: 'rotate(180deg)' }}>❥</span>
    </div>

    {/* Center branch */}
    <svg viewBox="0 0 80 40" className="w-12 h-6 fill-current flex-shrink-0" style={{ color }}>
      <rect x="39" y="10" width="2" height="24" rx="1" />
      <path d="M40,2 C42,7 42,12 40,14 C38,12 38,7 40,2 Z" />
      <path d="M40,12 C35,11 29,13 27,17 C31,18 36,16 40,12 Z" />
      <path d="M40,12 C45,11 51,13 53,17 C49,18 44,16 40,12 Z" />
      <path d="M40,22 C34,22 28,25 26,29 C30,30 36,27 40,22 Z" />
      <path d="M40,22 C46,22 52,25 54,29 C50,30 44,27 40,22 Z" />
    </svg>

    {/* Right Line */}
    <div className="flex-1 flex items-center justify-start">
      <span className="text-[8px] inline-block" style={{ color }}>❥</span>
      <div className="w-1.5 h-1.5 rounded-full mx-1" style={{ backgroundColor: color }} />
      <div className="h-[0.7px] w-full" style={{ backgroundColor: color, opacity: 0.35 }} />
    </div>
  </div>
)

const HeartDivider = ({ color = '#C59B3F' }) => (
  <div className="flex items-center justify-center gap-3 w-full max-w-[180px] my-1 select-none">
    <div className="h-[0.8px] flex-1" style={{ backgroundColor: color, opacity: 0.4 }} />
    <span className="text-xs text-[#C59B3F] leading-none" style={{ color }}>♥</span>
    <div className="h-[0.8px] flex-1" style={{ backgroundColor: color, opacity: 0.4 }} />
  </div>
)

const AmpersandDivider = ({ color = '#C59B3F' }) => (
  <div className="flex items-center justify-center gap-5 my-0.5 text-[#C59B3F] select-none w-full max-w-[280px]">
    {/* Left Branch */}
    <svg viewBox="0 0 60 20" className="w-12 h-4 fill-current flex-shrink-0" style={{ color, transform: 'scaleX(-1)' }}>
      <rect x="0" y="9" width="45" height="1.5" rx="0.5" />
      <path d="M45,10 C50,8 55,6 60,10 C55,14 50,12 45,10 Z" />
      <path d="M15,9 C12,5 7,4 5,7 C9,9 12,9 15,9 Z" />
      <path d="M30,9 C27,5 22,4 20,7 C24,9 27,9 30,9 Z" />
      <path d="M15,10.5 C12,14.5 7,15.5 5,12.5 C9,10.5 12,10.5 15,10.5 Z" />
      <path d="M30,10.5 C27,14.5 22,15.5 20,12.5 C24,10.5 27,10.5 30,10.5 Z" />
    </svg>

    {/* Center Ampersand in GreatVibes font */}
    <span className="text-[32px] leading-[0.8] text-[#C59B3F] flex-shrink-0 pb-0.5" style={{ fontFamily: "'GreatVibes', cursive" }}>
      &amp;
    </span>

    {/* Right Branch */}
    <svg viewBox="0 0 60 20" className="w-12 h-4 fill-current flex-shrink-0" style={{ color }}>
      <rect x="0" y="9" width="45" height="1.5" rx="0.5" />
      <path d="M45,10 C50,8 55,6 60,10 C55,14 50,12 45,10 Z" />
      <path d="M15,9 C12,5 7,4 5,7 C9,9 12,9 15,9 Z" />
      <path d="M30,9 C27,5 22,4 20,7 C24,9 27,9 30,9 Z" />
      <path d="M15,10.5 C12,14.5 7,15.5 5,12.5 C9,10.5 12,10.5 15,10.5 Z" />
      <path d="M30,10.5 C27,14.5 22,15.5 20,12.5 C24,10.5 27,10.5 30,10.5 Z" />
    </svg>
  </div>
)

const LocationIcon = ({ color = '#C59B3F' }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="text-[#C59B3F] mb-1 flex-shrink-0" style={{ color }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const CornerAccent = ({ top, left, right, bottom, color = '#C59B3F' }) => (
  <div 
    className="absolute w-4 h-4 pointer-events-none"
    style={{
      top, left, right, bottom,
      borderTop: (top !== undefined) ? `1.2px solid ${color}` : undefined,
      borderBottom: (bottom !== undefined) ? `1.2px solid ${color}` : undefined,
      borderLeft: (left !== undefined) ? `1.2px solid ${color}` : undefined,
      borderRight: (right !== undefined) ? `1.2px solid ${color}` : undefined,
      opacity: 0.7,
      zIndex: 5
    }}
  />
)

function toPascalCase(str) {
  return String(str || '')
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Name Typewriter Animation Variants (Slower & Smoother Stagger + Soft Blur Fade)
const groomContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 1.1
    }
  }
}

const brideContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 2.1
    }
  }
}

const letterAnimVariants = {
  hidden: { opacity: 0, y: 6, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: "easeOut" }
  }
}

/* ─────────────────────────────────────────
   1. HERO SECTION
   ───────────────────────────────────────── */
function RoyalPalaceHero({ data, isDesktop }) {
  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      return {
        day: parts[0],
        month: parts[1],
        year: parts[2]
      }
    }
    return { day: '25', month: 'MAY', year: '2025' }
  }, [data.dateLine])

  const groomNameText = toPascalCase(data.groomName || "Rohan")
  const brideNameText = toPascalCase(data.brideName || "Anaya")

  return (
    <section 
      className="relative w-full h-[100svh] min-h-[600px] flex flex-col items-center justify-start overflow-hidden bg-[#FFFDF6] text-[#5A2C16]"
    >
      {/* Background Container */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {isDesktop ? (
          <img 
            src={heroBgDesktop} 
            alt="" 
            className="w-full h-full object-cover object-center" 
          />
        ) : (
          <video
            src="/backgrounds/Royal Palace/Sunflowers_swaying_in_wind.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          />
        )}
        {/* Soft overlay to blend top portion with text */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF6]/45 via-transparent to-[#FFFDF6]/15" />
      </div>



      {/* Hero content wrapper (Restricted to top 50% of viewport) */}
      <div className="relative z-20 flex flex-col items-center justify-start w-[92%] sm:w-[85%] max-w-[700px] text-center mt-[2.5svh] gap-1">
        
        {/* Header Block (Intro Text + Leaf + Heart) */}
        <div className="flex flex-col items-center w-full">
          {/* Top decorative branch */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <LeafDivider color="#C59B3F" />
          </motion.div>

          {/* Staggered Intro lines */}
          <motion.p 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.25em] font-semibold text-[#5A2C16] opacity-90 text-center"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            TOGETHER WITH THEIR FAMILIES
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[8px] sm:text-[8.5px] uppercase tracking-[0.2em] text-[#7D553E] text-center mt-0.5"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            WE INVITE YOU TO CELEBRATE
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[8px] sm:text-[8.5px] uppercase tracking-[0.2em] text-[#7D553E] text-center mt-0.5"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            THE WEDDING OF
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeartDivider color="#C59B3F" />
          </motion.div>
        </div>

        {/* Center Block: couple names animated last with glare shine */}
        <div className="flex flex-col items-center w-full mt-0.5">
          {/* Groom Name (Rohan) */}
          <motion.h1 
            initial="hidden"
            animate="show"
            variants={groomContainerVariants}
            className="text-[#5A2C16] font-normal leading-normal tracking-[0.03em] text-[46px] sm:text-[58px] md:text-[68px] lg:text-[76px] relative flex justify-center items-center flex-wrap h-auto min-h-[1.2em]"
            style={{ fontFamily: "'PrimorStylish', serif" }}
          >
            <span className="relative z-10 flex justify-center items-center flex-wrap">
              {groomNameText.split('').map((char, index) => (
                <motion.span key={index} variants={letterAnimVariants} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                  {char}
                </motion.span>
              ))}
            </span>
            <motion.span
              animate={{ backgroundPosition: ['120% center', '-220% center'] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute inset-0 pointer-events-none z-20 flex justify-center items-center flex-wrap"
              style={{
                fontFamily: "'PrimorStylish', serif",
                fontSize: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'none',
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              {groomNameText.split('').map((char, index) => (
                <motion.span key={index} variants={letterAnimVariants} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h1>

          {/* Ampersand */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 1.0, ease: "easeOut" }}
            className="flex items-center justify-center w-full"
          >
            <AmpersandDivider color="#C59B3F" />
          </motion.div>

          {/* Bride Name (Anaya) */}
          <motion.h1 
            initial="hidden"
            animate="show"
            variants={brideContainerVariants}
            className="text-[#5A2C16] font-normal leading-normal tracking-[0.03em] text-[46px] sm:text-[58px] md:text-[68px] lg:text-[76px] relative flex justify-center items-center flex-wrap h-auto min-h-[1.2em]"
            style={{ fontFamily: "'PrimorStylish', serif" }}
          >
            <span className="relative z-10 flex justify-center items-center flex-wrap">
              {brideNameText.split('').map((char, index) => (
                <motion.span key={index} variants={letterAnimVariants} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                  {char}
                </motion.span>
              ))}
            </span>
            <motion.span
              animate={{ backgroundPosition: ['120% center', '-220% center'] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear', delay: 1.2 }}
              className="absolute inset-0 pointer-events-none z-20 flex justify-center items-center flex-wrap"
              style={{
                fontFamily: "'PrimorStylish', serif",
                fontSize: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'none',
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              {brideNameText.split('').map((char, index) => (
                <motion.span key={index} variants={letterAnimVariants} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h1>
        </div>

        {/* Date, Time, and Venue block */}
        <div className="flex flex-col items-center w-full mt-0.5">
          {/* Marriage Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 3.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.25em] font-bold text-[#C59B3F] text-center mb-1.5"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            ARE GETTING MARRIED
          </motion.p>

          <div className="flex flex-col items-center gap-1 w-full">
            <motion.span 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 3.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-[#7D553E] mb-0.5"
            >
              {(data.dayOfWeek || "SUNDAY").toUpperCase()}
            </motion.span>

            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 3.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3"
            >
              <div className="border-t border-b border-[#C59B3F]/40 py-1 px-2.5">
                <span className="text-[11px] tracking-[0.25em] font-bold text-[#5A2C16]">
                  {(dateParts.month || "MAY").toUpperCase().slice(0, 3)}
                </span>
              </div>

              <div className="border-l border-r border-[#C59B3F]/50 px-4">
                <span className="text-[35px] font-bold leading-none text-[#C59B3F]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                  {dateParts.day || "25"}
                </span>
              </div>

              <div className="border-t border-b border-[#C59B3F]/40 py-1 px-2.5">
                <span className="text-[11px] tracking-[0.25em] font-bold text-[#5A2C16]">
                  {dateParts.year || "2025"}
                </span>
              </div>
            </motion.div>

            <motion.span 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 3.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.2em] text-[#7D553E] mt-1"
            >
              {(data.weddingTime || "AT 6:00 PM ONWARDS").toUpperCase()}
            </motion.span>
          </div>
        </div>

        {/* Location & Resort Address Details */}
        <div className="flex flex-col items-center text-center w-full mt-0.5">
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 3.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <LeafDivider color="#C59B3F" />
          </motion.div>

          <div className="flex flex-col items-center text-center mt-0.5">
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 4.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <LocationIcon color="#C59B3F" />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 4.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.1em] text-[#5A2C16] uppercase max-w-[280px] mt-1"
            >
              {data.venueName || "SUNSHINE GARDEN RESORT"}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 4.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[7.5px] tracking-[0.15em] text-[#7D553E] uppercase mt-0.5 max-w-[260px] leading-relaxed"
            >
              {data.venueCity || "KANAKAPURA ROAD, BENGALURU, KARNATAKA 560062"}
            </motion.p>
          </div>
        </div>

      </div>

      {/* Scroll indicator - absolutely positioned at bottom of screen (bottom 4% area) */}
      <motion.button
        type="button"
        onClick={() => {
          const el = document.getElementById('story')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        className="absolute bottom-[3%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center focus:outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 4.8, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-7 h-7 rounded-full border border-[#C59B3F]/40 flex items-center justify-center bg-white/70"
        >
          <span className="text-[8px] text-[#5A2C16]">▼</span>
        </motion.div>
      </motion.button>
    </section>
  )
}

/* ─────────────────────────────────────────
   2. PHOTO CARDS (Moments / Story)
   ───────────────────────────────────────── */
function RoyalPalaceStory({ data, isDesktop }) {
  const items = data.items || []
  if (items.length === 0) return null

  return (
    <section 
      id="story"
      className="relative w-full py-16 px-6 bg-[#FFFDF6] text-[#5A2C16] flex flex-col items-center overflow-hidden"
    >
      <div className="absolute inset-[14px] md:inset-[22px] border border-[#C59B3F]/15 pointer-events-none z-10" />

      {/* Section Title */}
      <div className="text-center mb-10 relative z-20">
        <span className="text-[9.5px] uppercase tracking-[0.25em] font-bold text-[#C59B3F]">OUR MOMENTS</span>
        <h2 className="text-2xl font-light tracking-widest uppercase mt-1" style={{ fontFamily: "'Cinzel', serif" }}>
          Captured Love
        </h2>
        <LeafDivider color="#C59B3F" />
      </div>

      {/* Grid wrapper */}
      <div className="w-full max-w-[1000px] z-20">
        {isDesktop ? (
          // Desktop: side-by-side row layout
          <div className="flex justify-center items-stretch gap-6">
            {items.slice(0, 3).map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, delay: idx * 0.15 }}
                className="flex-1 bg-white p-3.5 border border-[#C59B3F]/30 shadow-md relative"
              >
                <CornerAccent top="4px" left="4px" />
                <CornerAccent top="4px" right="4px" />
                <CornerAccent bottom="4px" left="4px" />
                <CornerAccent bottom="4px" right="4px" />
                
                <div className="w-full aspect-[4/5] overflow-hidden border border-[#C59B3F]/15">
                  <img src={item.image} alt="" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Mobile: stacked layouts
          <div className="flex flex-col gap-8 w-full max-w-[340px] mx-auto">
            {items.slice(0, 3).map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-3 border border-[#C59B3F]/25 shadow-sm relative"
              >
                <CornerAccent top="4px" left="4px" />
                <CornerAccent top="4px" right="4px" />
                <CornerAccent bottom="4px" left="4px" />
                <CornerAccent bottom="4px" right="4px" />

                <div className="w-full aspect-[4/5] overflow-hidden border border-[#C59B3F]/10">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   3. WELCOMING MESSAGE (Invitation)
   ───────────────────────────────────────── */
function RoyalPalaceInvitation({ data, isDesktop }) {
  if (!data) return null
  const defaultMsg = "We are excited to invite you to celebrate our wedding with us. This special day would not be complete without your presence."
  const paragraphs = String(data.message || defaultMsg).split('\n').filter(Boolean)

  return (
    <section className="relative w-full py-20 px-6 bg-[#FFFDF6] text-[#5A2C16] flex flex-col items-center overflow-hidden">
      <div className="absolute inset-[14px] md:inset-[22px] border border-[#C59B3F]/15 pointer-events-none z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="w-full max-w-[550px] bg-white p-8 md:p-12 border border-[#C59B3F]/35 shadow-lg relative z-20 text-center flex flex-col items-center"
      >
        <CornerAccent top="8px" left="8px" />
        <CornerAccent top="8px" right="8px" />
        <CornerAccent bottom="8px" left="8px" />
        <CornerAccent bottom="8px" right="8px" />

        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#C59B3F] mb-1">THE INVITATION</span>
        <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
          Welcome Message
        </h2>
        
        <LeafDivider color="#C59B3F" />

        <div className="mt-4 flex flex-col gap-4 text-xs md:text-sm text-[#7D553E] leading-relaxed max-w-[420px] mx-auto">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p.trim()}</p>
          ))}
        </div>

        <span className="text-[#C59B3F] text-xs mt-6">♥</span>
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────
   4. VENUE SECTION
   ───────────────────────────────────────── */
function RoyalPalaceVenue({ data, isDesktop }) {
  if (!data) return null
  const addressText = String(data.location || data.venueLine1 || '')

  return (
    <section 
      id="venue"
      className="relative w-full py-16 px-6 bg-[#FFFDF6] text-[#5A2C16] flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      <div className="absolute inset-[14px] md:inset-[22px] border border-[#C59B3F]/15 pointer-events-none z-10" />

      {/* Section Title */}
      <div className="text-center mb-10 relative z-20">
        <span className="text-[9.5px] uppercase tracking-[0.25em] font-bold text-[#C59B3F]">OUR VENUE</span>
        <h2 className="text-2xl font-light tracking-widest uppercase mt-1" style={{ fontFamily: "'Cinzel', serif" }}>
          The Location
        </h2>
        <LeafDivider color="#C59B3F" />
      </div>

      {/* Layout wrapper */}
      <div className="w-full max-w-[850px] z-20 flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Left Side: Address Details */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4"
        >
          <div className="flex items-center gap-2 text-[#C59B3F]">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Wedding Destination
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold uppercase tracking-[0.05em] text-[#5A2C16] max-w-[340px]">
            {data.venueName || "Sunshine Garden Resort"}
          </h3>

          <div className="flex flex-col gap-1 text-xs md:text-sm text-[#7D553E] max-w-[320px] leading-relaxed">
            {data.venueLine1 && <p>{data.venueLine1}</p>}
            {data.venueLine2 && <p>{data.venueLine2}</p>}
            {!data.venueLine1 && !data.venueLine2 && <p>{addressText}</p>}
          </div>

          <HeartDivider color="#C59B3F" />
        </motion.div>

        {/* Right Side: QR Code Map Card */}
        {data.mapUrl && (
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0 }}
            className="bg-white p-5 border border-[#C59B3F]/35 shadow-md flex flex-col items-center relative max-w-[280px]"
          >
            <CornerAccent top="5px" left="5px" />
            <CornerAccent top="5px" right="5px" />
            <CornerAccent bottom="5px" left="5px" />
            <CornerAccent bottom="5px" right="5px" />

            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(String(data.mapUrl))}&color=5a2c16&bgcolor=ffffff`}
              alt="Google Maps QR Code"
              width={130}
              height={130}
              className="border border-[#C59B3F]/15 p-1 bg-white mb-4"
              loading="lazy"
            />

            <span className="text-[8.5px] uppercase tracking-[0.2em] font-bold text-[#7D553E] mb-3">Scan to locate</span>

            <a 
              href={String(data.mapUrl)}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-[#C59B3F] bg-[#5A2C16] text-[9.5px] text-[#FFFDF6] font-bold uppercase tracking-[0.2em] transition hover:bg-white hover:text-[#5A2C16]"
            >
              📍 Open in Maps
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   5. COUNTDOWN SECTION
   ───────────────────────────────────────── */
function RoyalPalaceCountdown({ data }) {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })

  useEffect(() => {
    if (!data.targetDateTimeISO) return

    const calculateTime = () => {
      const difference = +new Date(data.targetDateTimeISO) - +new Date()
      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        return
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const m = Math.floor((difference / 1000 / 60) % 60)
      const s = Math.floor((difference / 1000) % 60)

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [data.targetDateTimeISO])

  return (
    <section className="relative w-full py-20 px-6 bg-[#FFFDF6] text-[#5A2C16] flex flex-col items-center overflow-hidden">
      <div className="absolute inset-[14px] md:inset-[22px] border border-[#C59B3F]/15 pointer-events-none z-10" />

      {/* Title */}
      <div className="text-center mb-8 relative z-20">
        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#C59B3F]">COUNTDOWN</span>
        <h2 className="text-xl font-light tracking-widest uppercase mt-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
          Days Remaining
        </h2>
        <LeafDivider color="#C59B3F" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-[340px] w-full z-20">
        {[
          { label: 'Days', val: timeLeft.days },
          { label: 'Hours', val: timeLeft.hours },
          { label: 'Mins', val: timeLeft.minutes },
          { label: 'Secs', val: timeLeft.seconds }
        ].map((unit, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col items-center bg-white p-3.5 border border-[#C59B3F]/25 shadow-sm relative"
          >
            <CornerAccent top="3px" left="3px" />
            <CornerAccent top="3px" right="3px" />
            <CornerAccent bottom="3px" left="3px" />
            <CornerAccent bottom="3px" right="3px" />

            <span className="text-xl sm:text-2xl font-bold tracking-[0.02em] font-sans leading-none text-[#5A2C16]">
              {unit.val}
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.15em] text-[#7D553E] mt-2 font-semibold">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   6. FOOTER SECTION
   ───────────────────────────────────────── */
function RoyalPalaceFooter({ data }) {
  if (!data) return null
  const paragraphs = String(data.message || '').split('\n').filter(Boolean)
  const creditLines = String(data.names || '').split('\n').filter(Boolean)

  return (
    <footer className="relative w-full py-16 px-6 bg-[#FFFDF6] text-[#5A2C16] flex flex-col items-center text-center overflow-hidden">
      <div className="absolute inset-[14px] md:inset-[22px] border border-[#C59B3F]/15 pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col items-center max-w-[320px] w-full">
        {/* Monogram or Icon */}
        <div className="text-xl text-[#C59B3F] mb-3 font-serif">❦</div>

        {/* Message */}
        {paragraphs.map((p, idx) => (
          <p key={idx} className="text-xs italic text-[#7D553E] leading-relaxed max-w-[280px]">
            {p.trim()}
          </p>
        ))}

        <div className="w-12 h-[0.7px] bg-[#C59B3F]/35 my-4" />

        {/* Credit details */}
        {creditLines.map((line, idx) => (
          <p key={idx} className="text-[10px] tracking-[0.25em] font-bold text-[#5A2C16] uppercase mt-0.5">
            {line.trim()}
          </p>
        ))}

        {/* Branding watermark */}
        <div className="mt-8 text-[7px] tracking-[0.3em] font-bold uppercase text-[#C59B3F]/60">
          INVITEQUE
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────
   MAIN PAGE EXPORT
   ───────────────────────────────────────── */
export default function TemplateRoyalPalace({ savedData }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  // Watermark logic
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid

  // Select active data set
  const activeData = savedData || (isPreview ? draftData : null)

  const data = activeData ? {
    ...staticData,
    hero: {
      ...staticData.hero,
      names: savedData
        ? `${savedData.coupleData.groomName} & ${savedData.coupleData.brideName}`
        : `${draftData.groomName} & ${draftData.brideName}`,
      groomName: savedData ? savedData.coupleData.groomName : draftData.groomName,
      brideName: savedData ? savedData.coupleData.brideName : draftData.brideName,
      dateLine: savedData
        ? `${savedData.heroData.weddingDate} ${savedData.heroData.weddingMonth} ${savedData.heroData.weddingYear}`
        : `${draftData.weddingDate} ${draftData.weddingMonth} ${draftData.weddingYear}`,
      weddingTime: savedData
        ? (savedData.heroData?.weddingTime || '09:00 AM - 10:30 AM')
        : (draftData.weddingTime || '09:00 AM - 10:30 AM'),
      venueName: (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData.mahalName) || '',
      venueCity: (savedData
        ? [savedData.venueData?.venueCity || savedData.venueCity, savedData.venueData?.state || savedData.state].filter(Boolean).join(', ')
        : [draftData.venueCity, draftData.state].filter(Boolean).join(', ')
      ) || '',
      addressParts: savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName,
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean)
        : [
            draftData.mahalName,
            draftData.venueAddress,
            draftData.venueCity,
            draftData.state
          ].map(s => String(s || '').trim()).filter(Boolean),
      fullAddress: savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName,
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData.mahalName,
            draftData.venueAddress,
            draftData.venueCity,
            draftData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', '),
      hashtag: (() => {
        const groom = savedData ? savedData.coupleData.groomName : draftData.groomName
        const bride = savedData ? savedData.coupleData.brideName : draftData.brideName
        const gName = (groom || '').trim().replace(/\s+/g, '')
        const bName = (bride || '').trim().replace(/\s+/g, '')
        return `#${gName}${bName}Forever`
      })(),
      dayOfWeek: (() => {
        const month = savedData ? savedData.heroData.weddingMonth : draftData.weddingMonth
        const date = savedData ? savedData.heroData.weddingDate : draftData.weddingDate
        const year = savedData ? savedData.heroData.weddingYear : draftData.weddingYear
        const d = new Date(`${month} ${date}, ${year}`)
        return isNaN(d.getTime()) ? 'SUNDAY' : d.toLocaleDateString('en-US', { weekday: 'long' })
      })(),
    },
    venue: {
      ...staticData.venue,
      venueName: (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData.mahalName) || staticData.venue.venueName,
      venueLine1: (savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData.mahalName,
            draftData.venueAddress
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
      ) || staticData.venue.venueLine1,
      venueLine2: (savedData
        ? [
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData.venueCity,
            draftData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
      ) || staticData.venue.venueLine2,
      location: (savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName,
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData.mahalName,
            draftData.venueAddress,
            draftData.venueCity,
            draftData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
      ) || staticData.venue.location,
      mapUrl: (savedData ? (savedData.venueData?.mapLink || savedData.mapLink) : draftData.mapLink) || staticData.venue.mapUrl,
    },
    countdown: {
      ...staticData.countdown,
      targetDateTimeISO: (() => {
        if (savedData?.heroData?.weddingMonth && savedData?.heroData?.weddingDate && savedData?.heroData?.weddingYear) {
          const d = new Date(`${savedData.heroData.weddingMonth} ${savedData.heroData.weddingDate}, ${savedData.heroData.weddingYear}`)
          if (!isNaN(d.getTime())) return d.toISOString()
        }
        if (draftData?.weddingMonth && draftData?.weddingDate && draftData?.weddingYear) {
          const d = new Date(`${draftData.weddingMonth} ${draftData.weddingDate}, ${draftData.weddingYear}`)
          if (!isNaN(d.getTime())) return d.toISOString()
        }
        return staticData.countdown.targetDateTimeISO
      })(),
    },
    story: {
      ...staticData.story,
      items: (() => {
        const photos = savedData
          ? (savedData.storyData?.photos || [])
          : (draftData.photos || [])
        const activePhotos = photos.filter(Boolean)
        return activePhotos.length > 0
          ? activePhotos.map(p => ({ image: p }))
          : [
              { image: fallbackPhoto1 },
              { image: fallbackPhoto2 },
              { image: fallbackPhoto3 }
            ]
      })(),
    },
    invitation: {
      ...staticData.invitation,
      groomName: savedData ? savedData.coupleData.groomName : draftData.groomName,
      brideName: savedData ? savedData.coupleData.brideName : draftData.brideName,
      message: savedData ? savedData.invitationData?.message : draftData.message,
    }
  } : {
    ...staticData,
    story: {
      ...staticData.story,
      items: [
        { image: fallbackPhoto1 },
        { image: fallbackPhoto2 },
        { image: fallbackPhoto3 }
      ]
    }
  }

  const showGallery = savedData ? savedData.scheduleData?.showGallery : draftData.showGallery

  return (
    <div className="relative min-h-screen bg-[#FFFDF6] text-[#5A2C16]">
      {/* MOBILE VIEW */}
      <div className="md:hidden flex justify-center items-start min-h-screen bg-[#1a1a1a]">
        <div className="relative w-full max-w-[430px] min-h-[100svh] bg-[#FFFDF6] text-[#5A2C16] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          
          {/* Fixed Watermark Overlay */}
          {showWatermark && (
            <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.28] select-none text-[#C59B3F]">
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
          )}

          {/* Floating Controls for Preview */}
          {isPreview && (
            <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#C59B3F]/30 bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#5A2C16] shadow-xl hover:scale-105 active:scale-95"
                >
                  ← Back
                </button>
                <button
                  onClick={() => navigate('/payment', { state: { draftData, templateId } })}
                  className="flex-1 flex items-center justify-center gap-3 rounded-full bg-black py-4 text-sm font-bold text-white shadow-xl hover:scale-105 active:scale-95"
                >
                  Proceed
                </button>
              </div>
            </div>
          )}

          {/* Render the 6 Sections in Order */}
          <RoyalPalaceHero data={data.hero} isDesktop={false} />
          {showGallery && <RoyalPalaceStory data={data.story} isDesktop={false} />}
          <RoyalPalaceInvitation data={data.invitation} isDesktop={false} />
          <RoyalPalaceVenue data={data.venue} isDesktop={false} />
          <RoyalPalaceCountdown data={data.countdown} />
          <RoyalPalaceFooter data={data.footer} />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block w-full min-h-screen bg-[#FFFDF6] relative">
        
        {/* Fixed Watermark Overlay */}
        {showWatermark && (
          <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.22] select-none flex flex-col justify-around items-center text-[#C59B3F]">
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              PREVIEW — INVITEQUE
            </span>
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              PREVIEW — INVITEQUE
            </span>
          </div>
        )}

        {/* Floating Controls for Preview */}
        {isPreview && (
          <div className="fixed bottom-8 right-8 z-[110] flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 rounded-full border border-[#C59B3F]/45 bg-white/95 backdrop-blur-md text-sm font-bold text-[#5A2C16] shadow-xl hover:scale-105 active:scale-95"
            >
              ← Back to Edit
            </button>
            <button
              onClick={() => navigate('/payment', { state: { draftData, templateId } })}
              className="px-10 py-4 rounded-full bg-black text-sm font-bold text-white shadow-xl hover:scale-105 active:scale-95"
            >
              Proceed →
            </button>
          </div>
        )}

        {/* Render the 6 Sections in Order */}
        <div className="w-full">
          <RoyalPalaceHero data={data.hero} isDesktop={true} />
        </div>
        {showGallery && (
          <div className="w-full">
            <RoyalPalaceStory data={data.story} isDesktop={true} />
          </div>
        )}
        <div className="w-full">
          <RoyalPalaceInvitation data={data.invitation} isDesktop={true} />
        </div>
        <div className="w-full">
          <RoyalPalaceVenue data={data.venue} isDesktop={true} />
        </div>
        <div className="w-full">
          <RoyalPalaceCountdown data={data.countdown} />
        </div>
        <div className="w-full">
          <RoyalPalaceFooter data={data.footer} />
        </div>
      </div>
    </div>
  )
}
