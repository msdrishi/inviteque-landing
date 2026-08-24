import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import { weddingData as staticData } from '../weddingData.js'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import cMapping from '../royalPalaceCloudinaryMapping.json'

import Events from '../components/Events.jsx'
import Footer from '../components/Footer.jsx'
import CustomSection from '../components/CustomSection.jsx'

// Background Assets (Served exclusively via Cloudinary)
const firstFrameDesktop = cMapping['hero-first-frame-desktop.jpg'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1787081254/ri2nmgysb6h1jhpa8h70.png"
const firstFrameMobile = cMapping['hero-first-frame-mobile.jpg'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1787081256/dngashc5t91odh16rpho.png"
const venueBgDesktop = cMapping['venue-desktop.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1786305381/sunflower-venue-desktop-1786305372189.png"
const venueBgMobile = cMapping['venue-mobile.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1786305382/sunflower-venue-mobile-1786305372189.png"
const countdownBgDesktop = cMapping['countdown-deskotp.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1787081263/b85gcp3bu3axm47tklqj.png"
const countdownBgMobile = cMapping['countdown-mobile.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1787081265/gboahybckqj0m781fkkp.png"

const fallbackPhoto1 = cMapping['sunflower-1.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1786304159/sunflower-gallery-1-1786304145513.png"
const fallbackPhoto2 = cMapping['sunflower-2.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1786304161/sunflower-gallery-2-1786304145513.png"
const fallbackPhoto3 = cMapping['sunflower-3.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1786304163/sunflower-gallery-3-1786304145513.png"

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

// Inline Symmetrical Dividers
const LeafDivider = ({ color = '#C59B3F' }) => (
  <div className="flex items-center justify-center gap-1.5 my-0.5 select-none w-full max-w-[280px] md:max-w-[340px]">
    {/* Left Line */}
    <div className="flex-1 flex items-center justify-end">
      <div className="h-[0.7px] w-full" style={{ backgroundColor: color, opacity: 0.35 }} />
      <div className="w-1.5 h-1.5 rounded-full mx-1" style={{ backgroundColor: color }} />
      <span className="text-[8px] md:text-[10px] inline-block" style={{ color, transform: 'rotate(180deg)' }}>❥</span>
    </div>

    {/* Center branch */}
    <svg viewBox="0 0 80 40" className="w-12 h-6 md:w-14 md:h-7 fill-current flex-shrink-0" style={{ color }}>
      <rect x="39" y="10" width="2" height="24" rx="1" />
      <path d="M40,2 C42,7 42,12 40,14 C38,12 38,7 40,2 Z" />
      <path d="M40,12 C35,11 29,13 27,17 C31,18 36,16 40,12 Z" />
      <path d="M40,12 C45,11 51,13 53,17 C49,18 44,16 40,12 Z" />
      <path d="M40,22 C34,22 28,25 26,29 C30,30 36,27 40,22 Z" />
      <path d="M40,22 C46,22 52,25 54,29 C50,30 44,27 40,22 Z" />
    </svg>

    {/* Right Line */}
    <div className="flex-1 flex items-center justify-start">
      <span className="text-[8px] md:text-[10px] inline-block" style={{ color }}>❥</span>
      <div className="w-1.5 h-1.5 rounded-full mx-1" style={{ backgroundColor: color }} />
      <div className="h-[0.7px] w-full" style={{ backgroundColor: color, opacity: 0.35 }} />
    </div>
  </div>
)

const HeartDivider = ({ color = '#C59B3F' }) => (
  <div className="flex items-center justify-center gap-3 w-full max-w-[180px] md:max-w-[240px] my-0.5 select-none">
    <div className="h-[1.2px] flex-1" style={{ backgroundColor: color, opacity: 0.75 }} />
    <span className="text-xs md:text-sm text-[#C59B3F] leading-none" style={{ color }}>♥</span>
    <div className="h-[1.2px] flex-1" style={{ backgroundColor: color, opacity: 0.75 }} />
  </div>
)

const AmpersandDivider = ({ color = '#C59B3F' }) => (
  <div className="flex items-center justify-center gap-4 md:gap-5 my-0 text-[#C59B3F] select-none w-full max-w-[280px] md:max-w-[340px]">
    {/* Left Branch */}
    <svg viewBox="0 0 60 20" className="w-10 h-3.5 md:w-12 md:h-4 fill-current flex-shrink-0" style={{ color, transform: 'scaleX(-1)' }}>
      <rect x="0" y="9" width="45" height="1.5" rx="0.5" />
      <path d="M45,10 C50,8 55,6 60,10 C55,14 50,12 45,10 Z" />
      <path d="M15,9 C12,5 7,4 5,7 C9,9 12,9 15,9 Z" />
      <path d="M30,9 C27,5 22,4 20,7 C24,9 27,9 30,9 Z" />
      <path d="M15,10.5 C12,14.5 7,15.5 5,12.5 C9,10.5 12,10.5 15,10.5 Z" />
      <path d="M30,10.5 C27,14.5 22,15.5 20,12.5 C24,10.5 27,10.5 30,10.5 Z" />
    </svg>

    {/* Center Ampersand in GreatVibes font */}
    <span className="text-[28px] md:text-[34px] leading-[0.8] text-[#C59B3F] flex-shrink-0 pb-0.5" style={{ fontFamily: "'GreatVibes', cursive" }}>
      &amp;
    </span>

    {/* Right Branch */}
    <svg viewBox="0 0 60 20" className="w-10 h-3.5 md:w-12 md:h-4 fill-current flex-shrink-0" style={{ color }}>
      <rect x="0" y="9" width="45" height="1.5" rx="0.5" />
      <path d="M45,10 C50,8 55,6 60,10 C55,14 50,12 45,10 Z" />
      <path d="M15,9 C12,5 7,4 5,7 C9,9 12,9 15,9 Z" />
      <path d="M30,9 C27,5 22,4 20,7 C24,9 27,9 30,9 Z" />
      <path d="M15,10.5 C12,14.5 7,15.5 5,12.5 C9,10.5 12,10.5 15,10.5 Z" />
      <path d="M30,10.5 C27,14.5 22,15.5 20,12.5 C24,10.5 27,10.5 30,10.5 Z" />
    </svg>
  </div>
)

const LocationIcon = ({ color = '#C59B3F', className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-[#C59B3F] mb-0.5 md:mb-1 flex-shrink-0 w-[16px] h-[16px] md:w-[22px] md:h-[22px] ${className}`} style={{ color }}>
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
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRef = useRef(null)

  const videoSrc = isDesktop
    ? (cMapping['Sunflowers_moving_in_wind_1080p_desktop.mp4'] || "https://res.cloudinary.com/djbxuk2xr/video/upload/v1786304410/sunflower-wind-desktop-1786304384411.mp4")
    : (cMapping['Sunflowers_swaying_in_wind.mp4'] || "https://res.cloudinary.com/djbxuk2xr/video/upload/v1786304414/sunflower-swaying-mobile-1786304384411.mp4")

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Enforce DOM attributes required by WebKit / iOS Safari for autoplay
    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')

    let isSubscribed = true

    const markPlaying = () => {
      if (isSubscribed) setVideoPlaying(true)
    }

    video.addEventListener('playing', markPlaying)
    video.addEventListener('canplay', () => {
      if (video.paused) {
        video.play().then(markPlaying).catch(() => {})
      }
    })

    // Attempt play programmatically
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.then(markPlaying).catch(() => {
        // Autoplay blocked by iOS low power mode or user policy -> trigger on first touch/scroll/click
        const handleInteraction = () => {
          if (video && video.paused) {
            video.play().then(markPlaying).catch(() => {})
          }
          window.removeEventListener('touchstart', handleInteraction)
          window.removeEventListener('click', handleInteraction)
          window.removeEventListener('scroll', handleInteraction)
        }

        window.addEventListener('touchstart', handleInteraction, { passive: true, once: true })
        window.addEventListener('click', handleInteraction, { passive: true, once: true })
        window.addEventListener('scroll', handleInteraction, { passive: true, once: true })
      })
    }

    return () => {
      isSubscribed = false
      if (video) {
        video.removeEventListener('playing', markPlaying)
      }
    }
  }, [videoSrc])

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
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#FFFDF6]">
        {/* Static First Frame Backdrop (Visible immediately) */}
        <img
          src={isDesktop ? firstFrameDesktop : firstFrameMobile}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ transform: 'scale(1.01)' }}
        />

        {/* Video Element (Smoothly fades in once it actually starts playing) */}
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          controls={false}
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setVideoPlaying(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-1000 ease-in-out ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'scale(1.01)' }}
        />
        {/* Soft overlay to blend top portion with text */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF6]/45 via-transparent to-[#FFFDF6]/15" />
      </div>



      {/* Hero content wrapper (Restricted strictly within top 60% of viewport) */}
      <div className="relative z-20 flex flex-col items-center justify-between w-[92%] sm:w-[85%] max-w-[760px] text-center pt-[1.5svh] md:pt-[2svh] pb-1 h-auto max-h-[58svh] gap-1 md:gap-1.5">

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
            className="text-[10.5px] sm:text-[11.5px] md:text-[13px] lg:text-[14px] uppercase tracking-[0.25em] md:tracking-[0.28em] font-semibold text-[#5A2C16] opacity-90 text-center"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            TOGETHER WITH THEIR FAMILIES
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] sm:text-[9.5px] md:text-[11.5px] lg:text-[12.5px] uppercase tracking-[0.2em] md:tracking-[0.24em] text-[#7D553E] text-center mt-0.5"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            WE INVITE YOU TO CELEBRATE
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] sm:text-[9.5px] md:text-[11.5px] lg:text-[12.5px] uppercase tracking-[0.2em] md:tracking-[0.24em] text-[#7D553E] text-center mt-0.5"
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
        <div className="flex flex-col items-center w-full mt-0">
          {/* Groom Name (Rohan) */}
          <motion.h1
            initial="hidden"
            animate="show"
            variants={groomContainerVariants}
            className="text-[#5A2C16] font-normal leading-tight tracking-[0.03em] text-[38px] sm:text-[44px] md:text-[50px] lg:text-[56px] relative flex justify-center items-center flex-wrap h-auto min-h-[1.1em]"
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
            className="flex items-center justify-center w-full my-0"
          >
            <AmpersandDivider color="#C59B3F" />
          </motion.div>

          {/* Bride Name (Anaya) */}
          <motion.h1
            initial="hidden"
            animate="show"
            variants={brideContainerVariants}
            className="text-[#5A2C16] font-normal leading-tight tracking-[0.03em] text-[38px] sm:text-[44px] md:text-[50px] lg:text-[56px] relative flex justify-center items-center flex-wrap h-auto min-h-[1.1em]"
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
        <div className="flex flex-col items-center w-full mt-0">
          {/* Marriage Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9.5px] sm:text-[10.5px] md:text-[12px] lg:text-[13px] uppercase tracking-[0.25em] md:tracking-[0.28em] font-bold text-[#C59B3F] text-center mb-0.5 md:mb-1"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            ARE GETTING MARRIED
          </motion.p>

          <div className="flex flex-col items-center gap-0.5 md:gap-1 w-full">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] sm:text-[11px] md:text-[13px] lg:text-[14.5px] uppercase tracking-[0.2em] md:tracking-[0.25em] font-semibold text-[#7D553E] mb-0"
            >
              {(data.dayOfWeek || "SUNDAY").toUpperCase()}
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-2 md:gap-3"
            >
              <div className="border-t border-b border-[#C59B3F]/40 py-0.5 md:py-1 px-2.5 md:px-3.5">
                <span className="text-[12px] sm:text-[12.5px] md:text-[14px] lg:text-[15.5px] tracking-[0.2em] md:tracking-[0.24em] font-bold text-[#5A2C16]">
                  {(dateParts.month || "MAY").toUpperCase().slice(0, 3)}
                </span>
              </div>

              <div className="border-l border-r border-[#C59B3F]/50 px-3.5 md:px-5">
                <span className="text-[34px] md:text-[40px] lg:text-[44px] font-bold leading-none text-[#C59B3F]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                  {dateParts.day || "25"}
                </span>
              </div>

              <div className="border-t border-b border-[#C59B3F]/40 py-0.5 md:py-1 px-2.5 md:px-3.5">
                <span className="text-[12px] sm:text-[12.5px] md:text-[14px] lg:text-[15.5px] tracking-[0.2em] md:tracking-[0.24em] font-bold text-[#5A2C16]">
                  {dateParts.year || "2025"}
                </span>
              </div>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] sm:text-[10.5px] md:text-[12.5px] lg:text-[13.5px] uppercase tracking-[0.2em] md:tracking-[0.24em] font-medium text-[#7D553E] mt-0.5"
            >
              {(data.weddingTime || "AT 6:00 PM ONWARDS").toUpperCase()}
            </motion.span>
          </div>
        </div>

        {/* Location & Resort Address Details */}
        <div className="flex flex-col items-center text-center w-full mt-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <LeafDivider color="#C59B3F" />
          </motion.div>

          <div className="flex flex-col items-center text-center mt-0">
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
              className="text-[11px] sm:text-[12px] md:text-[14.5px] lg:text-[16px] font-bold tracking-[0.1em] md:tracking-[0.14em] text-[#5A2C16] uppercase max-w-[290px] md:max-w-[480px] mt-0.5"
            >
              {data.venueName || "SUNSHINE GARDEN RESORT"}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[8.5px] sm:text-[9.5px] md:text-[11px] lg:text-[12px] tracking-[0.12em] md:tracking-[0.14em] text-[#7D553E] uppercase mt-0.5 max-w-[280px] md:max-w-[460px] leading-relaxed font-medium"
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
// Elegant line-art Sunflower SVG watermark texture
const SunflowerSVG = ({ className, style }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="50" cy="50" r="14" strokeWidth="1.5" />
    <path d="M43,43 L57,57 M43,57 L57,43" />
    <path d="M38,50 L62,50 M50,38 L50,62" />
    <path d="M41,46 A14,14 0 0,0 59,54" />
    <path d="M46,41 A14,14 0 0,0 54,59" />
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16;
      return (
        <path
          key={`p1-${i}`}
          d="M50,36 C47,20 53,20 50,36"
          transform={`rotate(${angle} 50 50)`}
        />
      );
    })}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = ((i * 360) / 16) + 11.25;
      return (
        <path
          key={`p2-${i}`}
          d="M50,36 C48,25 52,25 50,36"
          transform={`rotate(${angle} 50 50)`}
          opacity="0.7"
        />
      );
    })}
    <path d="M22,78 C12,70 15,55 32,60 C38,62 30,76 22,78 Z" />
    <path d="M22,78 L32,60" />
    <path d="M78,78 C88,70 85,55 68,60 C62,62 70,76 78,78 Z" />
    <path d="M78,78 L68,60" />
  </svg>
)

// Shattered Gold & Sunflower Petals Background Overlay
function RoyalPalaceBackgroundShatter() {
  const scatteredPetals = [
    { top: '8%', left: '12%', size: '32px', rotate: 25, delay: 0 },
    { top: '15%', right: '10%', size: '24px', rotate: -40, delay: 1 },
    { top: '45%', left: '6%', size: '28px', rotate: 85, delay: 1.5 },
    { top: '55%', right: '8%', size: '36px', rotate: 120, delay: 0.5 },
    { bottom: '12%', left: '15%', size: '22px', rotate: -15, delay: 2 },
    { bottom: '10%', right: '14%', size: '30px', rotate: 60, delay: 1.2 },
    { top: '30%', right: '25%', size: '26px', rotate: 45, delay: 0.8 },
    { bottom: '25%', left: '28%', size: '34px', rotate: -70, delay: 1.8 }
  ];
  return (
    <>
      {/* Gold Shattered Lines & Polygons */}
      <div className="absolute inset-0 select-none pointer-events-none opacity-[0.06] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="10%" x2="100%" y2="85%" stroke="#C59B3F" strokeWidth="1.5" />
          <line x1="0" y1="75%" x2="100%" y2="25%" stroke="#C59B3F" strokeWidth="1.5" />
          <line x1="25%" y1="0" x2="85%" y2="100%" stroke="#C59B3F" strokeWidth="1.5" />
          <line x1="80%" y1="0" x2="15%" y2="100%" stroke="#C59B3F" strokeWidth="1.5" />
          <line x1="0" y1="45%" x2="100%" y2="55%" stroke="#C59B3F" strokeWidth="1.5" />

          <polygon points="10,50 150,150 50,220" fill="none" stroke="#C59B3F" strokeWidth="1.2" />
          <polygon points="90%,15% 95%,35% 85%,25%" fill="none" stroke="#C59B3F" strokeWidth="1.2" />
          <polygon points="80%,75% 95%,90% 70%,95%" fill="none" stroke="#C59B3F" strokeWidth="1.2" />
          <polygon points="5%,80% 20%,95% 3%,90%" fill="none" stroke="#C59B3F" strokeWidth="1.2" />
        </svg>
      </div>
      {/* Floating Scattered Petals */}
      {scatteredPetals.map((petal, i) => (
        <motion.div
          key={i}
          className="absolute z-10 pointer-events-none select-none"
          style={{
            top: petal.top,
            left: petal.left,
            right: petal.right,
            bottom: petal.bottom,
            width: petal.size,
            height: petal.size,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [petal.rotate, petal.rotate + 15, petal.rotate],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: petal.delay,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 2C11.5 6 8 9 5 12c4 1 7 4.5 7 8 0.5-4 4-7 7-10-4-1-7-4.5-7-8z" fill="#C59B3F" opacity="0.35" />
            <path d="M12 3C11.5 6.5 8.5 9 5.5 11.5c3.5 1 6 4 6 7 0.5-3 3.5-6 6-8.5-3.5-1-6-4-6-7z" fill="#FBBF24" opacity="0.85" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

function RoyalPalaceStory({ data, isDesktop }) {
  const items = data.items || []
  if (items.length === 0) return null

  // Slice items to 3 max
  const activeItems = items.slice(0, 3)
  const viewport = { once: false, amount: 0.12 }

  const wordContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const wordAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  return (
    <section
      id="story"
      className="relative w-full overflow-hidden flex flex-col items-center justify-between text-center py-20 px-6 text-[#735C2A] min-h-[100svh]"
      style={{
        backgroundColor: '#FEF1D6',
        backgroundImage: `
          radial-gradient(circle at 20% 35%, rgba(255, 255, 255, 0.45) 0%, transparent 60%),
          url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L40 80 M0 40 L80 40' stroke='rgba(90,44,22,0.024)' stroke-width='1.2'/%3E%3Ccircle cx='40' cy='40' r='3.5' fill='rgba(197,155,63,0.06)'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A2C16' fill-opacity='0.015'%3E%3Cpath d='M5 0h1L0 6V5zm1 5v1H5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        backgroundSize: '100% 100%, 80px 80px, 6px 6px',
      }}
    >
      {/* Shattered Gold Geometric and Petals Background Layout */}
      <RoyalPalaceBackgroundShatter />

      {/* Sunflower Background Texture SVG elements */}
      <SunflowerSVG className="absolute -top-12 -left-12 w-64 h-64 text-[#5A2C16] opacity-[0.06] select-none pointer-events-none" />
      <SunflowerSVG className="absolute -bottom-12 -right-12 w-64 h-64 text-[#5A2C16] opacity-[0.06] select-none pointer-events-none" />
      <SunflowerSVG className="absolute top-[20%] -right-16 w-48 h-48 text-[#5A2C16] opacity-[0.04] select-none pointer-events-none" />
      <SunflowerSVG className="absolute bottom-[20%] -left-16 w-48 h-48 text-[#5A2C16] opacity-[0.04] select-none pointer-events-none" />

      {/* 1. Section Title & Header at the Top */}
      <motion.div
        variants={wordContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="text-center px-6 relative z-10 mt-2 w-full flex flex-col items-center"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#D48825] block">
          {"OUR MOMENTS".split(' ').map((word, wIdx) => (
            <motion.span key={wIdx} variants={wordAnim} className="inline-block mr-2">
              {word}
            </motion.span>
          ))}
        </span>
        <h2
          className="text-4xl sm:text-5xl tracking-wide mt-2 mb-3 text-[#735C2A] capitalize"
          style={{ fontFamily: "'Parisienne', cursive" }}
        >
          {"Captured Love".split(' ').map((word, wIdx) => (
            <motion.span key={wIdx} variants={wordAnim} className="inline-block mr-3">
              {word}
            </motion.span>
          ))}
        </h2>
        <div className="w-full flex justify-center opacity-70 mt-1">
          <LeafDivider color="#D48825" />
        </div>
      </motion.div>

      {/* 2. Grid of photo cards in the Middle */}
      <div className="relative z-20 w-full flex-1 flex items-center justify-center my-6">
        <div className="relative w-full max-w-[1150px] flex flex-col xl:flex-row justify-center items-center gap-0 xl:gap-8 px-2 mt-[-10px] xl:mt-[-40px]">
          {/* Card 0 - Double gold border with Stamp style */}
          {activeItems[0] && (
            <motion.div
              initial={{ opacity: 0, x: -80, y: -40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={viewport}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
              style={{
                rotate: -4,
                filter: 'drop-shadow(0px 16px 36px rgba(0,0,0,0.18))',
                background: 'linear-gradient(#FFF9ED, #FFF9ED) no-repeat center/calc(100% - 12px) calc(100% - 12px), repeating-linear-gradient(90deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) top/100% 6px no-repeat, repeating-linear-gradient(90deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) bottom/100% 6px no-repeat, repeating-linear-gradient(0deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) left/6px 100% no-repeat, repeating-linear-gradient(0deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) right/6px 100% no-repeat',
                padding: isDesktop ? '10px 10px 18px 10px' : '16px 16px 24px 16px',
              }}
              className="relative w-[75%] md:w-[320px] xl:w-[42%] xl:max-w-[470px] mr-[18%] md:mr-[10%] xl:mr-0 flex flex-col select-none pointer-events-none z-10"
            >
              {/* Double border details */}
              <div className="absolute inset-[18px] xl:inset-[12px] border border-[#C59B3F]/60 pointer-events-none z-10" />
              <div className="absolute inset-[24px] xl:inset-[16px] border border-[#735C2A]/20 pointer-events-none z-10" />

              <div className="w-full aspect-[4/3] bg-[#FFF9ED] overflow-hidden rounded-none border border-[#C59B3F]/15 relative">
                <div className="absolute inset-0 border border-[#735C2A]/10 pointer-events-none z-10" />
                <img
                  src={activeItems[0].image}
                  alt="Our moment 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3 px-2 text-[10px] sm:text-xs text-[#735C2A] italic font-serif leading-relaxed z-20">
                "In your arms, I have found my forever home."
              </div>
            </motion.div>
          )}

          {/* Card 1 - Corner accent border with Stamp style */}
          {activeItems[1] && (
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.25 }}
              style={{
                rotate: isDesktop ? 4 : 5,
                filter: 'drop-shadow(0px 16px 36px rgba(0,0,0,0.18))',
                background: 'linear-gradient(#FFF9ED, #FFF9ED) no-repeat center/calc(100% - 12px) calc(100% - 12px), repeating-linear-gradient(90deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) top/100% 6px no-repeat, repeating-linear-gradient(90deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) bottom/100% 6px no-repeat, repeating-linear-gradient(0deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) left/6px 100% no-repeat, repeating-linear-gradient(0deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) right/6px 100% no-repeat',
                padding: isDesktop ? '10px 10px 18px 10px' : '16px 16px 24px 16px',
              }}
              className="relative w-[80%] md:w-[330px] xl:w-[45%] xl:max-w-[490px] ml-[18%] md:ml-[10%] xl:ml-0 mt-[-22%] md:mt-[-50px] xl:mt-[-16px] flex flex-col select-none pointer-events-none z-20"
            >
              {/* Corner accents inside the card borders */}
              <div className="absolute inset-[18px] xl:inset-[12px] border border-[#C59B3F]/35 pointer-events-none z-10" />
              <CornerAccent top={isDesktop ? "14px" : "20px"} left={isDesktop ? "14px" : "20px"} color="#C59B3F" />
              <CornerAccent top={isDesktop ? "14px" : "20px"} right={isDesktop ? "14px" : "20px"} color="#C59B3F" />
              <CornerAccent bottom={isDesktop ? "14px" : "20px"} left={isDesktop ? "14px" : "20px"} color="#C59B3F" />
              <CornerAccent bottom={isDesktop ? "14px" : "20px"} right={isDesktop ? "14px" : "20px"} color="#C59B3F" />

              <div className="w-full aspect-[4/3] bg-[#FFF9ED] overflow-hidden rounded-none border border-[#C59B3F]/15 relative">
                <div className="absolute inset-0 border border-[#735C2A]/10 pointer-events-none z-10" />
                <img
                  src={activeItems[1].image}
                  alt="Our moment 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3 px-2 text-[10px] sm:text-xs text-[#735C2A] italic font-serif leading-relaxed z-20">
                "Every love story is beautiful, but ours is my favorite."
              </div>
            </motion.div>
          )}

          {/* Card 2 - Dotted inset border with Stamp style */}
          {activeItems[2] && (
            <motion.div
              initial={{ opacity: 0, x: 80, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={viewport}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.4 }}
              style={{
                rotate: -3,
                filter: 'drop-shadow(0px 16px 36px rgba(0,0,0,0.18))',
                background: 'linear-gradient(#FFF9ED, #FFF9ED) no-repeat center/calc(100% - 12px) calc(100% - 12px), repeating-linear-gradient(90deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) top/100% 6px no-repeat, repeating-linear-gradient(90deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) bottom/100% 6px no-repeat, repeating-linear-gradient(0deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) left/6px 100% no-repeat, repeating-linear-gradient(0deg, transparent, transparent 6px, #FFF9ED 6px, #FFF9ED 12px) right/6px 100% no-repeat',
                padding: isDesktop ? '10px 10px 18px 10px' : '16px 16px 24px 16px',
              }}
              className="relative w-[78%] md:w-[310px] xl:w-[41%] xl:max-w-[450px] mr-[20%] md:mr-[8%] xl:mr-0 mt-[-22%] md:mt-[-40px] xl:mt-8 flex flex-col select-none pointer-events-none z-30"
            >
              {/* Dotted border details */}
              <div className="absolute inset-[18px] xl:inset-[12px] border-2 border-dotted border-[#C59B3F]/55 pointer-events-none z-10" />

              <div className="w-full aspect-[4/3] bg-[#FFF9ED] overflow-hidden rounded-none border border-[#C59B3F]/15 relative">
                <div className="absolute inset-0 border border-[#735C2A]/10 pointer-events-none z-10" />
                <img
                  src={activeItems[2].image}
                  alt="Our moment 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3 px-2 text-[10px] sm:text-xs text-[#735C2A] italic font-serif leading-relaxed z-20">
                "Two hearts, one soul, a lifetime of beautiful moments."
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 3. Spacer to push middle content up cleanly */}
      <div className="w-full h-8 pointer-events-none" />
    </section>
  )
}

const petalColors = ["#FBBF24", "#F59E0B", "#D97706", "#C59B3F"]
const flowerPetalConfig = Array.from({ length: 16 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 30 : 70 + Math.random() * 30; // sides
  const duration = 6 + Math.random() * 7;
  const delay = Math.random() * 4;
  const size = 6 + Math.random() * 8; // 24px to 56px roughly
  const x1 = Math.random() * 60 - 30;
  const x2 = Math.random() * 60 - 30;
  const color = petalColors[i % petalColors.length];
  return { left: leftPos, duration, delay, size, x1, x2, color };
});

function FallingYellowFlowers() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100%' }}>
      {flowerPetalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            opacity: 0.85,
            filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.15))'
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
            <path d="M 20 0 C 35 10, 35 30, 20 40 C 5 30, 5 10, 20 0 Z" fill={p.color} />
            <circle cx="20" cy="20" r="2.5" fill="#FFFDF6" opacity="0.8" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function InvitationTitle({ text, className, style }) {
  return (
    <motion.p
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
    </motion.p>
  )
}

function RoyalPalaceInvitation({ data, isDesktop }) {
  const containerRef = useRef(null)
  if (!data) return null

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-6%']), { stiffness: 45, damping: 15 })

  const rawBannerY = useTransform(scrollYProgress, [0.15, 0.50], ['50%', '15%'])
  const bannerY = useSpring(rawBannerY, { stiffness: 35, damping: 15 })
  const bannerScale = useTransform(scrollYProgress, [0.15, 0.50], [0.9, 1.15])
  const bannerRotateX = useTransform(scrollYProgress, [0.15, 0.50], [12, 0])

  const bgImage = isDesktop ? (cMapping['welcome-desktop.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1787081259/w0jjcqo8t9alalmp51dr.png") : (cMapping['welcome-mobile.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1787081261/gt9aq4niaubtfvsm4mvc.png")
  const dividerFlowersMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964586/divider-flowers-mobile.png"

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-between items-center py-20 px-6"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.2, transformOrigin: 'center' }}
      >
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Soft blur overlay: top & middle blurred, bottom fades out blur */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 backdrop-blur-[3px]"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)'
          }}
        />
      </motion.div>

      {/* Falling Yellow Flowers */}
      <FallingYellowFlowers />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-[550px] flex flex-col items-center text-center mt-6">
        <div className="mb-4">
          <InvitationTitle
            text="Our story, our journey,"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(16px, 4vw, 22px)',
              color: '#5A2C16',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '0.12em',
            }}
          />
          <InvitationTitle
            text="ours forever"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(24px, 6vw, 32px)',
              color: '#5A2C16',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '0.12em',
            }}
          />
        </div>
      </div>

      {/* 3D Parallax Banner Image */}
      <motion.div
        className="absolute bottom-4 sm:bottom-0 inset-x-0 w-full z-20 will-change-transform pointer-events-none origin-bottom flex justify-center"
        style={{
          y: bannerY,
          scale: bannerScale,
          rotateX: bannerRotateX,
        }}
      >
        <img
          src={cMapping['welcome-banner.png'] || "https://res.cloudinary.com/djbxuk2xr/image/upload/v1786304156/sunflower-welcome-banner-1786304145513.png"}
          alt=""
          aria-hidden="true"
          className="w-[130%] sm:w-[120%] lg:w-[110%] h-auto object-contain object-bottom min-h-[350px] md:min-h-[420px] max-h-[680px]"
        />
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────
   4. VENUE SECTION
   ───────────────────────────────────────── */
function RoyalPalaceVenue({ data, isDesktop }) {
  if (!data) return null
  const addressTextRaw = String(data.location || data.venueLine1 || '')
  const bgImage = isDesktop ? venueBgDesktop : venueBgMobile
  const viewport = { once: false, amount: 0.15 }

  return (
    <section
      id="venue"
      className="relative w-full overflow-hidden px-6 flex flex-col items-center justify-between text-center pt-20 pb-8"
      style={{
        minHeight: '100svh',
      }}
    >
      {/* Background Image - 100% visible, no overlay */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
      />

      <div className="absolute inset-[14px] md:inset-[22px] border border-[#C59B3F]/20 pointer-events-none z-10" />

      {/* Classic Corner Accents */}
      <CornerAccent top="18px" left="18px" color="#C59B3F" />
      <CornerAccent top="18px" right="18px" color="#C59B3F" />
      <CornerAccent bottom="18px" left="18px" color="#C59B3F" />
      <CornerAccent bottom="18px" right="18px" color="#C59B3F" />

      {/* 1. Title & Address at the Top */}
      <div className="relative z-20 w-full flex flex-col items-center gap-4 mt-2">
        {/* Title & Accent Pin */}
        <div className="flex flex-col items-center">
          <InvitationTitle
            text="OUR VENUE"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(26px, 3.2vw, 36px)',
              letterSpacing: '0.14em',
              fontWeight: 600,
              color: '#5A2C16',
              margin: 0,
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={fadeUp}
            className="flex items-center justify-center gap-3 mt-3 mb-2"
          >
            <span style={{ width: '56px', height: '1px', backgroundColor: '#C59B3F' }} />
            <LocationIcon color="#C59B3F" />
            <span style={{ width: '56px', height: '1px', backgroundColor: '#C59B3F' }} />
          </motion.div>
        </div>

        {/* Address details */}
        <motion.address
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          className="flex flex-col items-center text-center not-italic gap-1 max-w-[480px] w-full"
        >
          <h3 className="font-semibold text-base sm:text-lg uppercase tracking-[0.08em] text-[#5A2C16]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {data.venueName || "Sunshine Garden Resort"}
          </h3>

          <div className="flex flex-col gap-1 text-xs sm:text-sm text-[#7D553E] leading-relaxed mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {data.venueLine1 && <p>{data.venueLine1}</p>}
            {data.venueLine2 && <p>{data.venueLine2}</p>}
            {!data.venueLine1 && !data.venueLine2 && <p>{addressTextRaw}</p>}
          </div>
        </motion.address>
      </div>

      {/* 2. QR Code / Map Link at the Bottom */}
      {data.mapUrl && (
        <div className="relative z-20 w-full flex justify-center mt-4 mb-0">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={fadeUp}
            style={{
              background: '#FFFDF6',
              border: '1px solid rgba(197, 155, 63, 0.4)',
              borderRadius: '16px',
              boxShadow: '0 15px 35px rgba(138, 110, 30, 0.08)',
              padding: isDesktop ? '8px 16px' : '6px',
              display: 'flex',
              alignItems: 'center',
              gap: isDesktop ? '12px' : '6px',
              maxWidth: isDesktop ? '310px' : '114px',
              width: '100%',
            }}
            className="flex flex-col sm:flex-row items-center justify-center animate-fade-in"
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(String(data.mapUrl))}&color=5a2c16&bgcolor=ffffff`}
              alt="Google Maps QR Code"
              width={isDesktop ? 90 : 100}
              height={isDesktop ? 90 : 100}
              className="border border-[#C59B3F]/15 p-1 bg-white shrink-0 rounded-lg"
              loading="lazy"
            />

            <div className="flex flex-col items-center sm:items-start gap-1.5 w-full">
              {isDesktop && (
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-semibold text-[#7D553E]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Scan to locate or
                </span>
              )}
              <a
                href={String(data.mapUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-[#C59B3F] bg-[#5A2C16] text-[#FFFDF6] font-bold uppercase transition hover:bg-white hover:text-[#5A2C16] shrink-0 ${isDesktop ? 'px-4 py-2 text-[9px] tracking-[0.2em]' : 'px-2 py-1 text-[7px] tracking-[0.1em] w-full text-center'
                  }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                📍 Open in Maps
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────
   5. COUNTDOWN SECTION
   ───────────────────────────────────────── */
function FlyingBirds({ isDesktop }) {
  if (isDesktop) return null

  const flapWings = {
    d: [
      "M 0 0 Q 8 -12 18 -6 Q 10 -1 0 0 Q -10 -1 -18 -6 Q -8 -12 0 0 Z",
      "M 0 0 Q 9 -6 19 0 Q 10 1 0 0 Q -10 1 -19 0 Q -9 -6 0 0 Z",
      "M 0 0 Q 8 8 18 12 Q 10 2 0 0 Q -10 2 -18 12 Q -8 8 0 0 Z",
      "M 0 0 Q 9 -6 19 0 Q 10 1 0 0 Q -10 1 -19 0 Q -9 -6 0 0 Z",
      "M 0 0 Q 8 -12 18 -6 Q 10 -1 0 0 Q -10 -1 -18 -6 Q -8 -12 0 0 Z"
    ]
  };

  const flock = [
    // Group 1 (13 birds)
    { delay: 0.0, scale: 0.42, yOffset: 12, xOffset: 0, speed: 1.3 },
    { delay: 0.2, scale: 0.35, yOffset: 2, xOffset: 25, speed: 1.4 },
    { delay: 0.1, scale: 0.32, yOffset: 22, xOffset: -20, speed: 1.2 },
    { delay: 0.4, scale: 0.30, yOffset: -5, xOffset: 45, speed: 1.5 },
    { delay: 0.3, scale: 0.38, yOffset: 28, xOffset: -40, speed: 1.3 },
    { delay: 0.5, scale: 0.28, yOffset: 8, xOffset: 65, speed: 1.6 },
    { delay: 0.25, scale: 0.34, yOffset: -12, xOffset: -60, speed: 1.4 },
    { delay: 0.6, scale: 0.25, yOffset: 18, xOffset: 85, speed: 1.5 },
    { delay: 0.15, scale: 0.36, yOffset: -22, xOffset: -80, speed: 1.3 },
    { delay: 0.7, scale: 0.24, yOffset: 32, xOffset: 105, speed: 1.7 },
    { delay: 0.35, scale: 0.40, yOffset: -30, xOffset: -105, speed: 1.2 },
    { delay: 0.8, scale: 0.22, yOffset: -2, xOffset: 125, speed: 1.6 },
    { delay: 0.45, scale: 0.31, yOffset: 40, xOffset: -125, speed: 1.4 },

    // Group 2 (13 birds - offset horizontally by -300px to -550px)
    { delay: 0.8, scale: 0.40, yOffset: 10, xOffset: -300, speed: 1.3 },
    { delay: 1.0, scale: 0.34, yOffset: -2, xOffset: -275, speed: 1.45 },
    { delay: 0.9, scale: 0.31, yOffset: 20, xOffset: -320, speed: 1.25 },
    { delay: 1.2, scale: 0.29, yOffset: -8, xOffset: -255, speed: 1.55 },
    { delay: 1.1, scale: 0.36, yOffset: 26, xOffset: -340, speed: 1.35 },
    { delay: 1.3, scale: 0.27, yOffset: 5, xOffset: -235, speed: 1.65 },
    { delay: 1.05, scale: 0.32, yOffset: -15, xOffset: -360, speed: 1.4 },
    { delay: 1.4, scale: 0.24, yOffset: 15, xOffset: -215, speed: 1.5 },
    { delay: 0.95, scale: 0.35, yOffset: -25, xOffset: -380, speed: 1.3 },
    { delay: 1.5, scale: 0.23, yOffset: 30, xOffset: -195, speed: 1.7 },
    { delay: 1.15, scale: 0.38, yOffset: -32, xOffset: -405, speed: 1.2 },
    { delay: 1.6, scale: 0.21, yOffset: -5, xOffset: -175, speed: 1.6 },
    { delay: 1.25, scale: 0.30, yOffset: 38, xOffset: -425, speed: 1.4 },
  ];

  return (
    <div className="absolute top-[8%] left-0 right-0 h-[80px] overflow-hidden pointer-events-none z-10">
      <motion.div
        className="absolute w-full h-full flex items-center"
        initial={{ x: "-35%" }}
        animate={{ x: "115%" }}
        transition={{
          duration: isDesktop ? 30 : 22,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative w-full h-full">
          {flock.map((bird, idx) => (
            <motion.div
              key={idx}
              className="absolute left-1/2"
              style={{
                top: `calc(40% + ${bird.yOffset}px)`,
                marginLeft: `${bird.xOffset}px`,
              }}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: bird.delay * 2,
              }}
            >
              <svg
                viewBox="-25 -25 50 50"
                className="w-10 h-10 fill-black opacity-80"
                style={{ transform: `scale(${bird.scale})` }}
              >
                <motion.path
                  animate={flapWings}
                  transition={{
                    duration: bird.speed,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: bird.delay,
                  }}
                />
              </svg>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function RoyalPalaceCountdown({ data, isDesktop }) {
  const containerRef = useRef(null)
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const bgImage = isDesktop ? countdownBgDesktop : countdownBgMobile

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ['-5%', '0%']), { stiffness: 45, damping: 15 })

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
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden px-6 flex flex-col items-center justify-start text-center pt-28 md:pt-24 pb-20"
      style={{
        minHeight: '100svh',
      }}
    >
      {/* Background Image - full cover image without zoom-in effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <FlyingBirds isDesktop={isDesktop} />

      <div className="absolute inset-[14px] md:inset-[22px] border border-[#C59B3F]/15 pointer-events-none z-10" />

      {/* Centered Group container */}
      <div className="relative z-20 flex flex-col items-center gap-4 md:gap-6 mt-4">
        {/* 1. Title directly above the counters */}
        <div
          className="text-center mb-1"
          style={{
            opacity: 0.95,
          }}
        >
          <span
            className="text-[14px] md:text-[18px] font-bold uppercase tracking-[0.26em] md:tracking-[0.84em] text-[#5A2C16] block"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            COUNT DOWN
          </span>
        </div>

        {/* 2. Twilight-style Counters Row */}
        <div className="flex justify-center items-center gap-0">
          {[
            { label: 'Days', val: timeLeft.days },
            { label: 'Hours', val: timeLeft.hours },
            { label: 'Mins', val: timeLeft.minutes },
            { label: 'Secs', val: timeLeft.seconds }
          ].map((unit, index) => (
            <div key={unit.label} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.12 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                className="flex flex-col items-center px-1.5 sm:px-3 py-1 text-center"
              >
                <span
                  className={`font-semibold leading-none ${isDesktop ? '' : 'text-[28px] md:text-[34px]'} text-[#5A2C16]`}
                  style={isDesktop ? {
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 650,
                    fontSize: 'clamp(30px, 4vw, 60px)'
                  } : { fontFamily: "'Cinzel', serif", fontWeight: 650 }}
                >
                  {unit.val}
                </span>
                <span
                  className={`mt-2 font-semibold uppercase tracking-[0.2em] text-[#7D553E] ${isDesktop ? '' : 'text-[10px]'}`}
                  style={isDesktop ? {
                    fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(9px, 0.9vw, 14px)'
                  } : { fontFamily: "'Cinzel', serif" }}
                >
                  {unit.label}
                </span>
              </motion.div>
              {index < 3 && (
                <div
                  className="self-center bg-[#C59B3F]/35"
                  style={{
                    width: '1.5px',
                    height: isDesktop ? 'clamp(16px, 2.5vw, 36px)' : '24px',
                    marginLeft: isDesktop ? 'clamp(3px, 0.5vw, 8px)' : '6px',
                    marginRight: isDesktop ? 'clamp(3px, 0.5vw, 8px)' : '6px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Spacer to push middle content up cleanly */}
      <div className="w-full h-8 pointer-events-none" />
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
export default function TemplateSunflowersFields({ savedData }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  const warmGoldBgStyle = {
    backgroundColor: '#FEF1D6',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L40 80 M0 40 L80 40' stroke='rgba(90,44,22,0.018)' stroke-width='1'/%3E%3Ccircle cx='40' cy='40' r='2' fill='rgba(197,155,63,0.04)'/%3E%3C/svg%3E")`,
    backgroundSize: '80px 80px',
  }

  const eventsWatermarks = (
    <>
      <RoyalPalaceBackgroundShatter />
      <SunflowerSVG className="absolute -top-12 -left-12 w-64 h-64 text-[#735C2A] opacity-[0.05] select-none pointer-events-none z-0" />
      <SunflowerSVG className="absolute -bottom-12 -right-12 w-64 h-64 text-[#735C2A] opacity-[0.05] select-none pointer-events-none z-0" />
      <SunflowerSVG className="absolute top-[20%] -right-16 w-48 h-48 text-[#735C2A] opacity-[0.03] select-none pointer-events-none z-0" />
      <SunflowerSVG className="absolute bottom-[20%] -left-16 w-48 h-48 text-[#735C2A] opacity-[0.03] select-none pointer-events-none z-0" />
    </>
  )

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
          ? (savedData.storyData?.photos || savedData.photos || [])
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
    },
    events: {
      ...staticData.events,
      items: (() => {
        const scheduleItems = savedData
          ? (savedData.scheduleData?.items || [])
          : (Array.isArray(draftData.scheduleItems) ? draftData.scheduleItems : [])
        const icons = ['✦', '◎', '✿', '◆', '♪']
        return scheduleItems.map((item, index) => ({
          icon: icons[index % icons.length],
          time: item.time,
          name: item.title,
          date: item.date,
        }))
      })(),
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
    },
    events: {
      ...staticData.events,
      items: [
        { time: "11:00 AM", name: "Haldi Ceremony", icon: "✦", date: "" },
        { time: "04:00 PM", name: "Wedding Vows", icon: "◎", date: "" },
        { time: "07:00 PM", name: "Grand Reception", icon: "✿", date: "" }
      ]
    }
  }

  const showGallery = savedData ? savedData.scheduleData?.showGallery : draftData.showGallery
  const showSchedule = savedData ? savedData.scheduleData?.showSchedule : draftData.showSchedule
  const customSectionData = savedData ? (savedData.invitationData || {}) : draftData

  const sunflowerStoryBgStyle = {
    backgroundColor: '#FEF1D6',
    backgroundImage: `
      radial-gradient(circle at 20% 35%, rgba(255, 255, 255, 0.45) 0%, transparent 60%),
      url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L40 80 M0 40 L80 40' stroke='rgba(90,44,22,0.024)' stroke-width='1.2'/%3E%3Ccircle cx='40' cy='40' r='3.5' fill='rgba(197,155,63,0.06)'/%3E%3C/svg%3E"),
      url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A2C16' fill-opacity='0.015'%3E%3Cpath d='M5 0h1L0 6V5zm1 5v1H5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
    backgroundSize: '100% 100%, 80px 80px, 6px 6px',
  }

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
                  onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })}
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

          {/* Render the Sections in Order */}
          <RoyalPalaceHero data={data.hero} isDesktop={false} />
          <CustomSection
            bgStyle={sunflowerStoryBgStyle}
            titleStyle={{ fontFamily: "'PrimorStylish', serif", color: '#5A2C16' }}
            subtitleStyle={{ fontFamily: "'Montserrat', sans-serif", color: '#C59B3F', letterSpacing: '0.15em' }}
            bodyStyle={{ fontFamily: "'Montserrat', sans-serif", color: '#5A2C16' }}
            dividerColor="#C59B3F"
            data={customSectionData}
          >
            <RoyalPalaceBackgroundShatter />
            <SunflowerSVG className="absolute -top-12 -left-12 w-64 h-64 text-[#5A2C16] opacity-[0.06] select-none pointer-events-none" />
            <SunflowerSVG className="absolute -bottom-12 -right-12 w-64 h-64 text-[#5A2C16] opacity-[0.06] select-none pointer-events-none" />
          </CustomSection>
          {showGallery && <RoyalPalaceStory data={data.story} isDesktop={false} />}
          <RoyalPalaceInvitation data={data.invitation} isDesktop={false} />
          <RoyalPalaceVenue data={data.venue} isDesktop={false} />
          {showSchedule && (
            <Events data={data.events} isDesktop={false} theme="gold" style={warmGoldBgStyle}>
              {eventsWatermarks}
            </Events>
          )}
          <RoyalPalaceCountdown data={data.countdown} isDesktop={false} />
          <Footer data={data.footer} theme="gold" />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block w-full min-h-screen bg-[#FFFDF6] relative">

        {/* Fixed Watermark Overlay */}
        {showWatermark && (
          <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.15] select-none flex flex-col justify-between items-center py-10 text-[#C59B3F]">
            <span className="text-[28px] md:text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              PREVIEW — INVITEQUE
            </span>
            <span className="text-[28px] md:text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              PREVIEW — INVITEQUE
            </span>
          </div>
        )}

        {/* Floating Controls for Preview */}
        {isPreview && (
          <div className="fixed bottom-8 right-8 z-[110] flex gap-4">
            <button
              onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })}
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

        {/* Render the Sections in Order */}
        <div className="w-full">
          <RoyalPalaceHero data={data.hero} isDesktop={true} />
        </div>
        <div className="w-full">
          <CustomSection
            bgStyle={sunflowerStoryBgStyle}
            titleStyle={{ fontFamily: "'PrimorStylish', serif", color: '#5A2C16' }}
            subtitleStyle={{ fontFamily: "'Montserrat', sans-serif", color: '#C59B3F', letterSpacing: '0.15em' }}
            bodyStyle={{ fontFamily: "'Montserrat', sans-serif", color: '#5A2C16' }}
            dividerColor="#C59B3F"
            data={customSectionData}
          >
            <RoyalPalaceBackgroundShatter />
            <SunflowerSVG className="absolute -top-12 -left-12 w-64 h-64 text-[#5A2C16] opacity-[0.06] select-none pointer-events-none" />
            <SunflowerSVG className="absolute -bottom-12 -right-12 w-64 h-64 text-[#5A2C16] opacity-[0.06] select-none pointer-events-none" />
          </CustomSection>
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
        {showSchedule && (
          <div className="w-full">
            <Events data={data.events} isDesktop={true} theme="gold" style={warmGoldBgStyle}>
              {eventsWatermarks}
            </Events>
          </div>
        )}
        <div className="w-full">
          <RoyalPalaceCountdown data={data.countdown} isDesktop={true} />
        </div>
        <div className="w-full">
          <Footer data={data.footer} theme="gold" />
        </div>
      </div>
    </div>
  )
}
