import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import { weddingData as staticData } from '../weddingData.js'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer.jsx'

// Assets
const coverVideoSrc = "/assets/templates/royal-heirloom/cover-opening-video.MP4"
const heroBgMobile = "/assets/templates/royal-heirloom/hero-bg-mobile.webp"
const ourPhotoBgMobile = "/assets/templates/royal-heirloom/our-photo.webp"
const ourVenueBgMobile = "/assets/templates/royal-heirloom/our-venue-mobile.webp"
const countdownBgMobile = "/assets/templates/royal-heirloom/countdown-mobile.webp"

// Pre-wedding shoot photos
const defaultPhoto1 = "/assets/templates/royal-heirloom/photo-1.webp"
const defaultPhoto2 = "/assets/templates/royal-heirloom/photo-2.webp"
const defaultPhoto3 = "/assets/templates/royal-heirloom/photo-3.webp"

// ── Lotus Motif Divider SVG ──────────────────────────────────────
const LotusDivider = ({ className = "" }) => (
  <div className={`flex items-center justify-center gap-2 select-none w-full max-w-[240px] mx-auto my-2 ${className}`}>
    <div className="flex-1 flex items-center justify-end">
      <div className="h-[0.8px] w-full bg-gradient-to-r from-transparent via-[#8C5D38]/50 to-[#6B401D]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#6B401D] mx-1" />
      <span className="text-[7px] text-[#6B401D] opacity-90 inline-block">✦</span>
    </div>

    <svg viewBox="0 0 54 36" className="w-8 h-5.5 fill-none flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M27 31 C18 29 9 22 7 13 C13 15 20 21 27 31 Z" fill="#D9C2A7" fillOpacity="0.45" stroke="#7A4B24" strokeWidth="0.9" />
      <path d="M27 31 C36 29 45 22 47 13 C41 15 34 21 27 31 Z" fill="#D9C2A7" fillOpacity="0.45" stroke="#7A4B24" strokeWidth="0.9" />
      <path d="M27 30 C20 24 13 15 14 6 C20 10 25 20 27 30 Z" fill="#E8D5C0" fillOpacity="0.6" stroke="#683C1A" strokeWidth="1" />
      <path d="M27 30 C34 24 41 15 40 6 C34 10 29 20 27 30 Z" fill="#E8D5C0" fillOpacity="0.6" stroke="#683C1A" strokeWidth="1" />
      <path d="M27 29 C23 20 22 10 27 3 C32 10 31 20 27 29 Z" fill="#C99863" fillOpacity="0.85" stroke="#522C10" strokeWidth="1.1" />
      <path d="M21 31 Q27 34 33 31" stroke="#522C10" strokeWidth="1.3" strokeLinecap="round" />
    </svg>

    <div className="flex-1 flex items-center justify-start">
      <span className="text-[7px] text-[#6B401D] opacity-90 inline-block">✦</span>
      <div className="w-1.5 h-1.5 rounded-full bg-[#6B401D] mx-1" />
      <div className="h-[0.8px] w-full bg-gradient-to-l from-transparent via-[#8C5D38]/50 to-[#6B401D]" />
    </div>
  </div>
)

// ── Replayable Section Header using Pure Classical Serif Typography (No couple cursive outside Hero) ──
const SectionHeader = ({ subtitle, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, filter: 'blur(3px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: false, amount: 0.25 }}
    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col items-center text-center px-4 mb-3"
  >
    {subtitle && (
      <span className="font-['Cinzel'] text-[10.5px] sm:text-[11.5px] tracking-[0.34em] uppercase font-bold text-[#8C5D38] mb-0.5">
        {subtitle}
      </span>
    )}
    <h2 className="font-['Cinzel_Decorative',_'Cinzel',_serif] text-[25px] sm:text-[28px] text-[#4A2810] font-bold tracking-wider leading-tight mb-1 select-none">
      {title}
    </h2>
    <LotusDivider />
    {description && (
      <p className="font-['Cormorant_Garamond'] italic text-[14.5px] text-[#6B4734] max-w-[320px] leading-snug mt-0.5">
        {description}
      </p>
    )}
  </motion.div>
)

// Letter-by-Letter Couple Name with Slow Majestic Glass Glare (Hero ONLY)
const AnimatedCoupleName = ({ name, isTriggered, delay = 0.2, fontSizeClass = "text-[50px] sm:text-[58px]" }) => {
  const letters = Array.from(String(name || ''))

  return (
    <div className="relative inline-block select-none overflow-visible px-2 my-0">
      <span className="relative z-10 flex items-center justify-center overflow-visible">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 14, scale: 0.92, filter: 'blur(2px)' }}
            animate={isTriggered ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: 14, scale: 0.92, filter: 'blur(2px)' }}
            transition={{
              duration: 2.4,
              delay: delay + i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`font-['Modernline',_'Allura',_'Alex_Brush',_cursive] ${fontSizeClass} leading-[1.15] inline-block font-normal overflow-visible`}
            style={{
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              color: '#4A2810',
              textShadow: '0 1px 1px rgba(255,255,255,0.6)',
              filter: 'drop-shadow(0px 1px 2px rgba(80, 40, 15, 0.25))',
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>

      <motion.span
        animate={isTriggered ? { backgroundPosition: ['200% center', '-200% center'] } : {}}
        transition={{ 
          repeat: Infinity, 
          duration: 8.5, 
          ease: 'easeInOut', 
          delay: delay + letters.length * 0.12 + 0.8,
          repeatDelay: 3.5 
        }}
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center font-['Modernline',_'Allura',_'Alex_Brush',_cursive] ${fontSizeClass} leading-[1.15] overflow-visible select-none`}
        style={{
          background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.9) 47%, rgba(255,230,150,0.98) 50%, rgba(255,255,255,0.9) 53%, transparent 75%)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {name}
      </motion.span>
    </div>
  )
}

export default function TemplateRoyalHeirloom({ savedData, groupSlug: propGroupSlug }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const groupSlug = propGroupSlug || new URLSearchParams(location.search).get('group')

  // Cover opening & splash state
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [hasTriggeredHeroText, setHasTriggeredHeroText] = useState(false)
  const [hasTriggeredHeroBg, setHasTriggeredHeroBg] = useState(false)
  const videoRef = useRef(null)

  // Interactive Story Photo Index
  const [activeStoryIdx, setActiveStoryIdx] = useState(0)

  // RSVP Form State
  const [rsvpGuestName, setRsvpGuestName] = useState('')
  const [rsvpAttending, setRsvpAttending] = useState('yes')
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState('2')
  const [rsvpWishes, setRsvpWishes] = useState('')
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)

  // Watermark
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid

  // Unified Proper Venue Details
  const venueLine1 = savedData?.venueData?.mahalName || draftData?.mahalName || 'THE TAJ MAHAL PALACE'
  const venueCity = savedData?.venueData?.venueCity || draftData?.venueCity || 'APOLLO BUNDER, COLABA, MUMBAI'
  const fullAddress = `${venueLine1}, ${venueCity}`
  const mapUrl = savedData?.venueData?.mapUrl || draftData?.mapUrl || 'https://maps.google.com/?q=The+Taj+Mahal+Palace+Mumbai'

  // Couple Data
  const groomName = savedData?.coupleData?.groomName || draftData?.groomName || 'Rohan'
  const brideName = savedData?.coupleData?.brideName || draftData?.brideName || 'Ananya'
  
  const weddingDate = savedData?.heroData?.weddingDate || draftData?.weddingDate || '3'
  const weddingMonth = savedData?.heroData?.weddingMonth || draftData?.weddingMonth || 'September'
  const weddingYear = savedData?.heroData?.weddingYear || draftData?.weddingYear || '2026'
  const weddingTime = savedData?.heroData?.weddingTime || draftData?.weddingTime || '09:00 AM'
  
  const formattedTime = weddingTime.toUpperCase().includes('AT') 
    ? weddingTime.toUpperCase() 
    : `AT ${weddingTime.toUpperCase().split('-')[0].trim()}`

  const dayOfWeek = useMemo(() => {
    try {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const mIndex = monthNames.findIndex(m => m.toLowerCase().startsWith(String(weddingMonth).toLowerCase().slice(0, 3)))
      if (mIndex !== -1 && weddingDate && weddingYear) {
        const d = new Date(parseInt(weddingYear), mIndex, parseInt(weddingDate))
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
        }
      }
    } catch (_) {}
    return 'THURSDAY'
  }, [weddingMonth, weddingDate, weddingYear])

  // Photos resolution
  const storyPhotos = useMemo(() => {
    const rawPhotos = savedData?.gallery || draftData?.gallery || []
    const cleanList = rawPhotos.filter(p => typeof p === 'string' && p.trim() && !p.includes('base64_or_url_photo'))
    if (cleanList.length >= 3) return cleanList.slice(0, 3)
    if (cleanList.length > 0) return [...cleanList, defaultPhoto1, defaultPhoto2, defaultPhoto3].slice(0, 3)
    return [defaultPhoto1, defaultPhoto2, defaultPhoto3]
  }, [savedData, draftData])

  // Wedding Schedule Items
  const scheduleItems = useMemo(() => {
    if (Array.isArray(savedData?.events) && savedData.events.length > 0) {
      return savedData.events
    }
    if (Array.isArray(draftData?.events) && draftData.events.length > 0) {
      return draftData.events
    }
    return [
      { title: 'Ganesh Pooja & Haldi', time: '09:00 AM', date: `${weddingDate} ${weddingMonth.toUpperCase()}`, venue: venueLine1, icon: '🪔' },
      { title: 'Mehendi & Sangeet', time: '05:30 PM', date: `${weddingDate} ${weddingMonth.toUpperCase()}`, venue: 'Grand Ball Room', icon: '✨' },
      { title: 'Muhurtham (Wedding Ceremony)', time: '09:00 AM', date: `${parseInt(weddingDate) + 1} ${weddingMonth.toUpperCase()}`, venue: venueLine1, icon: '🌸' },
      { title: 'Grand Royal Reception', time: '07:00 PM', date: `${parseInt(weddingDate) + 1} ${weddingMonth.toUpperCase()}`, venue: 'Palace Courtyard', icon: '🥂' },
    ]
  }, [savedData, draftData, weddingDate, weddingMonth, venueLine1])

  // Target Date for Countdown
  const targetDateISO = useMemo(() => {
    try {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const mIndex = monthNames.findIndex(m => m.toLowerCase().startsWith(String(weddingMonth).toLowerCase().slice(0, 3)))
      if (mIndex !== -1 && weddingDate && weddingYear) {
        return new Date(parseInt(weddingYear), mIndex, parseInt(weddingDate), 9, 0, 0).toISOString()
      }
    } catch (_) {}
    return '2026-09-03T09:00:00.000Z'
  }, [weddingMonth, weddingDate, weddingYear])

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const updateCountdown = () => {
      const difference = new Date(targetDateISO).getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [targetDateISO])

  // Story Photo Navigation
  const handlePrevPhoto = () => {
    setActiveStoryIdx(prev => (prev === 0 ? storyPhotos.length - 1 : prev - 1))
  }
  const handleNextPhoto = () => {
    setActiveStoryIdx(prev => (prev === storyPhotos.length - 1 ? 0 : prev + 1))
  }

  // Preload video & set to first frame
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0.01
    }
  }, [])

  // Handle Cover Opening Tap
  const handleOpenCover = () => {
    if (hasOpened || isPlaying) return
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setHasTriggeredHeroText(true)
        setHasTriggeredHeroBg(true)
        setHasOpened(true)
      })
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current
      if (duration > 0 && currentTime >= duration - 1.2) {
        setHasTriggeredHeroText(true)
      }
      if (duration > 0 && currentTime >= duration - 0.4) {
        setHasTriggeredHeroBg(true)
      }
    }
  }

  const handleVideoEnded = () => {
    setHasTriggeredHeroText(true)
    setHasTriggeredHeroBg(true)
    setHasOpened(true)
  }

  // QR Code URL for venue navigation
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(mapUrl)}&color=4A2810&bgcolor=ECE3D1`

  // Handle RSVP Submit
  const handleRsvpSubmit = (e) => {
    e.preventDefault()
    setRsvpSubmitted(true)
  }

  return (
    <div className="relative min-h-screen bg-[#181311] text-[#4A3326] flex justify-center selection:bg-[#E8C29D]/40">
      {/* Mobile/Tablet Screen Constraint Wrapper with exact requested #ECE3D1 background */}
      <main className="relative w-full max-w-[480px] bg-[#ECE3D1] shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">
        
        {/* ── 1. COVER OPENING / SPLASH SCREEN ── */}
        <AnimatePresence>
          {!hasOpened && (
            <motion.section
              key="cover-splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412] max-w-[480px] mx-auto overflow-hidden cursor-pointer"
              onClick={handleOpenCover}
            >
              <motion.div
                animate={!isPlaying ? { 
                  y: [0, 5, 0], 
                  rotate: [-0.5, 0.5, -0.5],
                  scale: [1.05, 1.065, 1.05]
                } : { 
                  y: 0, 
                  rotate: 0,
                  scale: 1.05 
                }}
                transition={!isPlaying ? { 
                  duration: 6.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                } : { 
                  duration: 0.1 
                }}
                style={{ transformOrigin: "50% 0%" }}
                className="w-full h-full relative overflow-hidden"
              >
                <video
                  ref={videoRef}
                  src={coverVideoSrc}
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  muted
                  controls={false}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-cover select-none pointer-events-none scale-[1.04]"
                />

                {!isPlaying && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {[...Array(6)].map((_, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: [0, 0.8, 0],
                          scale: [0.5, 1.2, 0.5],
                          y: [0, -15 - idx * 5, -30],
                          x: [(idx % 2 === 0 ? 1 : -1) * (10 + idx * 8)]
                        }}
                        transition={{
                          duration: 2.5 + idx * 0.4,
                          repeat: Infinity,
                          delay: idx * 0.5,
                          ease: "easeInOut"
                        }}
                        className="absolute text-[10px] text-[#F5D78E] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                      >
                        ✦
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>

              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.8 }}
                    className="absolute top-[20%] inset-x-0 flex flex-col items-center pointer-events-none z-20 px-6 text-center"
                  >
                    <motion.div
                      animate={{ 
                        opacity: [0.45, 1, 0.45],
                        scale: [0.98, 1.02, 0.98],
                      }}
                      transition={{ 
                        duration: 1.8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <span 
                        className="font-['Cinzel'] tracking-[0.38em] text-[15px] uppercase font-bold select-none text-[#5A2821]"
                        style={{
                          textShadow: '0 0 16px rgba(235, 190, 90, 0.8), 0 1px 1px rgba(255, 255, 255, 0.9)',
                          filter: 'drop-shadow(0 2px 8px rgba(90, 40, 33, 0.35))'
                        }}
                      >
                        Tap to Open
                      </span>
                      <div className="flex items-center gap-2 opacity-90">
                        <div className="w-6 h-[0.8px] bg-[#965545]" />
                        <span className="text-[7px] text-[#A85B49]">✦</span>
                        <div className="w-6 h-[0.8px] bg-[#965545]" />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── SECTION 1: HERO ── */}
        <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden bg-[#ECE3D1]">
          <motion.div
            initial={{ scale: 1.14, opacity: 0 }}
            animate={hasTriggeredHeroBg || hasOpened ? { scale: 1.0, opacity: 1 } : { scale: 1.14, opacity: 0 }}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage: `url(${heroBgMobile})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />

          <div 
            className="absolute inset-0 z-[1] pointer-events-none opacity-20 mix-blend-multiply"
            style={{
              background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.8) 0%, rgba(236, 227, 209, 0.4) 60%, rgba(210, 195, 175, 0.6) 100%)'
            }}
          />

          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center py-6 px-6 text-[#4A3223]">
            {/* Header: WEDDING INVITATION */}
            <motion.div 
              initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
              animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 10, filter: 'blur(3px)' }}
              transition={{ duration: 2.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-0.5 mb-3"
            >
              <span className="font-['Cinzel'] text-[12px] md:text-[13px] tracking-[0.36em] uppercase text-[#6B4330] font-semibold leading-tight">
                WEDDING
              </span>
              <span className="font-['Cinzel'] text-[12px] md:text-[13px] tracking-[0.36em] uppercase text-[#6B4330] font-semibold leading-tight">
                INVITATION
              </span>
            </motion.div>

            {/* Couple Names in signature calligraphy with glass glare */}
            <div className="flex flex-col items-center justify-center w-full my-3 overflow-visible">
              <AnimatedCoupleName 
                name={brideName} 
                isTriggered={hasTriggeredHeroText || hasOpened}
                delay={0.25} 
                fontSizeClass="text-[48px] sm:text-[56px]" 
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 1.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="my-[-6px] text-center"
              >
                <span 
                  className="font-['Modernline',_'Allura',_'Alex_Brush',_cursive] text-[28px] sm:text-[34px] leading-none inline-block select-none font-normal"
                  style={{
                    color: '#6B401D',
                    filter: 'drop-shadow(0px 1px 2px rgba(90, 45, 15, 0.25))',
                  }}
                >
                  &amp;
                </span>
              </motion.div>

              <AnimatedCoupleName 
                name={groomName} 
                isTriggered={hasTriggeredHeroText || hasOpened}
                delay={1.1} 
                fontSizeClass="text-[48px] sm:text-[56px]" 
              />
            </div>

            {/* Subtext, Date Module & Mumbai Address */}
            <div className="flex flex-col items-center w-full max-w-[340px] px-2 gap-2 mt-3">
              <motion.p 
                initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
                animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 10, filter: 'blur(2px)' }}
                transition={{ duration: 2.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-['Cinzel'] text-[9.5px] sm:text-[10px] tracking-[0.22em] uppercase text-[#6B4734] font-medium leading-[1.55] max-w-[280px]"
              >
                TOGETHER WITH THEIR FAMILIES INVITE YOU TO THEIR WEDDING CELEBRATION
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
                animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 10, filter: 'blur(2px)' }}
                transition={{ duration: 2.2, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center w-full max-w-[280px] pt-1 pb-1"
              >
                <span className="font-['Cinzel'] text-[11px] sm:text-[12px] tracking-[0.3em] uppercase text-[#543625] font-bold">
                  {weddingMonth.toUpperCase()}
                </span>

                <div className="flex items-center justify-between w-full my-1 gap-2">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="h-[0.8px] w-full bg-[#8C6044]/70 mb-1" />
                    <span className="font-['Cinzel'] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#6B4330] font-semibold text-center">
                      {dayOfWeek}
                    </span>
                    <div className="h-[0.8px] w-full bg-[#8C6044]/70 mt-1" />
                  </div>

                  <div className="px-2">
                    <span className="font-['Bodoni_Moda',_'Cinzel',_serif] text-[34px] sm:text-[38px] leading-none font-bold text-[#4F301D] tracking-tight">
                      {weddingDate}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="h-[0.8px] w-full bg-[#8C6044]/70 mb-1" />
                    <span className="font-['Cinzel'] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-[#6B4330] font-semibold text-center whitespace-nowrap">
                      {formattedTime}
                    </span>
                    <div className="h-[0.8px] w-full bg-[#8C6044]/70 mt-1" />
                  </div>
                </div>

                <span className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.28em] text-[#543625] font-semibold">
                  {weddingYear}
                </span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
                animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 10, filter: 'blur(2px)' }}
                transition={{ duration: 2.2, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-['Cinzel'] text-[8.5px] sm:text-[9.5px] tracking-[0.2em] uppercase text-[#73503D] opacity-90 max-w-[270px] leading-[1.45]"
              >
                {fullAddress}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
                animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 10, filter: 'blur(2px)' }}
                transition={{ duration: 2.2, delay: 2.9, ease: [0.16, 1, 0.3, 1] }}
                className="pt-0.5"
              >
                <span 
                  className="font-['Modernline',_'Allura',_'Alex_Brush',_cursive] text-[26px] sm:text-[30px] leading-none select-none"
                  style={{
                    color: '#6E4424',
                    filter: 'drop-shadow(0px 1px 1px rgba(90, 45, 15, 0.2))'
                  }}
                >
                  Save the Date
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: OUR STORY (50% BG OPACITY & BOAT FLOATING ANIMATION) ── */}
        <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-5 py-12 bg-[#ECE3D1] border-t border-[#D5C6AC] overflow-hidden">
          {/* Background image with 50% opacity */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-50 mix-blend-multiply"
            style={{
              backgroundImage: `url(${ourPhotoBgMobile})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10 w-full flex flex-col items-center">
            <SectionHeader 
              subtitle="CHAPTERS OF LOVE"
              title="OUR STORY"
              description="Cherished moments from our pre-wedding journey."
            />
          </div>

          {/* Interactive Photo Cards with Boat Floating Motion & Classical Serif Titles */}
          <div className="relative z-10 w-full max-w-[370px] flex flex-col items-center my-auto px-2">
            
            {/* Animated Floating Container (Boat Floating in the Sea Motion) */}
            <motion.div
              animate={{
                rotate: [-1.8, 1.8, -1.8],
                y: [-5, 6, -5],
                x: [-2, 2, -2],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full flex flex-col items-center"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStoryIdx}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-[#FAF5EB]/95 backdrop-blur-md p-3.5 pb-5 rounded-[18px] border border-[#CBB89D] shadow-[0_20px_50px_rgba(90,50,20,0.14)] flex flex-col items-center text-center relative"
                >
                  {/* Photo Display */}
                  <div className="relative w-full aspect-[4/4.8] rounded-[12px] overflow-hidden bg-[#E2D5C0] shadow-inner">
                    <img
                      src={storyPhotos[activeStoryIdx]}
                      alt={`Pre-wedding Moment ${activeStoryIdx + 1}`}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="absolute bottom-2.5 right-2.5 text-[10px] font-['Cinzel'] tracking-widest text-white/90 bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                      0{activeStoryIdx + 1} / 0{storyPhotos.length}
                    </span>
                  </div>

                  {/* Card Romantic Classical Typography (No cursive outside hero) */}
                  <div className="mt-3.5 px-2">
                    <h4 className="font-['Cinzel'] text-[15px] font-bold text-[#4A2810] tracking-wider uppercase mb-1">
                      {activeStoryIdx === 0 ? "Where It Began" : activeStoryIdx === 1 ? "A Timeless Promise" : "Forever & Always"}
                    </h4>
                    <p className="font-['Cormorant_Garamond'] italic text-[14.5px] text-[#6B4734] leading-snug">
                      {activeStoryIdx === 0
                        ? "Two souls serendipitously meeting under the stars, weaving a bond to last forever."
                        : activeStoryIdx === 1
                        ? "A quiet whisper of eternal devotion sealed with timeless love and fond laughter."
                        : "Hand in hand, stepping into a lifetime of endless romance and joyful adventures."}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Prev & Next Floating Controls */}
            <div className="flex items-center justify-between w-full max-w-[280px] mt-4 z-20">
              <button
                onClick={handlePrevPhoto}
                className="w-10 h-10 rounded-full bg-[#FAF5EB] border border-[#8C5D38] text-[#5A2C18] flex items-center justify-center shadow-md hover:bg-[#8C5D38] hover:text-white transition-all active:scale-90"
                aria-label="Previous Photo"
              >
                <span className="text-sm font-bold">←</span>
              </button>

              <div className="flex items-center gap-2">
                {storyPhotos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStoryIdx(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      activeStoryIdx === idx
                        ? 'w-6 h-2 bg-[#8C5D38]'
                        : 'w-2 h-2 bg-[#CBB89D] hover:bg-[#B39375]'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextPhoto}
                className="w-10 h-10 rounded-full bg-[#FAF5EB] border border-[#8C5D38] text-[#5A2C18] flex items-center justify-center shadow-md hover:bg-[#8C5D38] hover:text-white transition-all active:scale-90"
                aria-label="Next Photo"
              >
                <span className="text-sm font-bold">→</span>
              </button>
            </div>

          </div>

          <div className="h-4" />
        </section>

        {/* ── SECTION 3: OUR VENUE (DIRECT TEXT & QR CODE WITHOUT ANY CARD / DIV / BANNER) ── */}
        <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-6 py-10 bg-[#ECE3D1] border-t border-[#D5C6AC] overflow-hidden">
          {/* Custom Royal Heirloom Venue Background Image */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-top pointer-events-none"
            style={{
              backgroundImage: `url(${ourVenueBgMobile})`,
              backgroundSize: '100% auto',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top center',
            }}
          />

          {/* Top Title Area */}
          <div className="relative z-10 w-full flex flex-col items-center pt-2">
            <SectionHeader 
              subtitle="THE DESTINATION"
              title="OUR VENUE"
              description="A grand royal setting to celebrate our auspicious union."
            />
          </div>

          {/* Below / Mid Area: Pure direct address, QR code, and open location button (NO CARD WRAPPER / NO BANNER) */}
          <motion.div
            initial={{ opacity: 0, y: 22, filter: 'blur(3px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[340px] flex flex-col items-center text-center mt-auto mb-8"
          >
            {/* Direct Address Text */}
            <h3 className="font-['Cinzel'] text-[16px] font-bold text-[#4A2810] tracking-widest uppercase leading-snug">
              {venueLine1}
            </h3>

            <p className="font-['Cormorant_Garamond'] text-[15.5px] text-[#6B4734] font-medium max-w-[280px] leading-relaxed italic mt-1">
              {venueCity}
            </p>

            {/* Direct Clean QR Code (No wrapper card, transparent/matching background) */}
            <div className="my-4 flex flex-col items-center">
              <img
                src={qrCodeUrl}
                alt="Venue Location QR Code"
                className="w-24 h-24 object-contain rounded-[6px] shadow-sm"
              />
              <span className="font-['Cinzel'] text-[8.5px] tracking-[0.22em] text-[#8C5D38] uppercase font-bold mt-2">
                Scan for Map Navigation
              </span>
            </div>

            {/* Direct Open Location Button Below */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[260px] py-2.5 px-5 rounded-full bg-gradient-to-r from-[#6B3D1A] to-[#8C5329] text-[#FDEBD0] font-['Cinzel'] text-[11px] tracking-widest uppercase font-semibold flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <span>🗺️</span> Open Location on Map
            </a>
          </motion.div>

          <div className="h-2" />
        </section>

        {/* ── SECTION 4: WEDDING SCHEDULE ── */}
        <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-5 py-14 bg-[#ECE3D1] border-t border-[#D5C6AC]">
          <SectionHeader 
            subtitle="CELEBRATION TIMELINE"
            title="WEDDING SCHEDULE"
            description="Join us across each ceremony as we celebrate sacred rituals & joyous festivities."
          />

          {/* Schedule List: TIME • DATE on line 1, EVENT NAME in Classical Serif on line 2 */}
          <div className="w-full max-w-[380px] flex flex-col gap-3.5 my-2">
            {scheduleItems.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18, filter: 'blur(3px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.9, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[#FAF5EB]/90 backdrop-blur-sm border border-[#CBB89D] rounded-[16px] p-4 shadow-[0_6px_20px_rgba(100,60,30,0.05)] flex items-center gap-3.5 overflow-hidden group hover:border-[#8C5D38] transition-colors"
              >
                {/* Left Icon Badge */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#683C1D] to-[#995E33] text-[#FDEBD0] flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                  {event.icon || '🌸'}
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col text-left">
                  {/* Line 1: TIME • DATE */}
                  <div className="flex items-center gap-2 font-['Cinzel'] text-[10px] tracking-[0.22em] uppercase font-bold text-[#8C5D38]">
                    <span>{event.time}</span>
                    <span className="text-[#A87442]">•</span>
                    <span>{event.date}</span>
                  </div>

                  {/* Line 2: EVENT NAME in Classical Typography */}
                  <h4 className="font-['Cinzel'] text-[14.5px] font-bold text-[#4A2810] tracking-wide uppercase leading-tight select-none mt-0.5">
                    {event.title}
                  </h4>

                  {event.venue && (
                    <span className="font-['Cinzel'] text-[9px] text-[#8C5D38] tracking-wider uppercase opacity-90 mt-0.5">
                      📍 {event.venue}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: COUNTDOWN (CLEAN NORMAL VIEW WITHOUT OVERLAYS, RICH DARK FONT) ── */}
        <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-start px-6 pt-12 pb-16 bg-[#ECE3D1] border-t border-[#D5C6AC] overflow-hidden">
          {/* Custom Countdown Mobile Background Image (Clean without heavy dark overlay) */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-90"
            style={{
              backgroundImage: `url(${countdownBgMobile})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Top Area: Pure Direct Clean Countdown with Sharp Dark Typography */}
          <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
            <SectionHeader 
              subtitle="WAITING FOR THE BIG DAY"
              title="THE COUNTDOWN"
              description="Counting down every moment until our eternal celebration."
            />

            {/* Direct Floating Text Counters with Deep Rich Font (#3A1F10) */}
            <motion.div
              initial={{ opacity: 0, y: 18, filter: 'blur(3px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-6 sm:gap-8 w-full max-w-[360px] my-5 select-none"
            >
              {[
                { val: timeLeft.days, label: 'DAYS' },
                { val: timeLeft.hours, label: 'HOURS' },
                { val: timeLeft.minutes, label: 'MINUTES' },
                { val: timeLeft.seconds, label: 'SECONDS' },
              ].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span 
                    className="font-['Bodoni_Moda',_'Cinzel',_serif] text-[38px] sm:text-[46px] font-bold text-[#3A1F10] leading-none tracking-tight"
                    style={{
                      textShadow: '0 1px 2px rgba(255,255,255,0.7)',
                    }}
                  >
                    {String(unit.val).padStart(2, '0')}
                  </span>
                  <span 
                    className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#6B401D] font-bold mt-1.5"
                  >
                    {unit.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 6: THEMED ROYAL RSVP ── */}
        <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-5 py-14 bg-[#ECE3D1] border-t border-[#D5C6AC]">
          <SectionHeader 
            subtitle="PLEASE RESPOND"
            title="RSVP"
            description="Kindly confirm your gracious presence to help us prepare for your arrival."
          />

          <motion.div 
            initial={{ opacity: 0, y: 20, filter: 'blur(3px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.0 }}
            className="w-full max-w-[380px] bg-[#FAF5EB]/95 backdrop-blur-md border border-[#CBB89D] rounded-[20px] p-6 shadow-[0_15px_40px_rgba(90,50,20,0.08)] flex flex-col my-2"
          >
            {rsvpSubmitted ? (
              <div className="flex flex-col items-center text-center py-8">
                <span className="text-3xl mb-2">💌</span>
                <h4 className="font-['Cinzel'] text-[16px] font-bold text-[#4A2810] uppercase tracking-wider">
                  Thank You, {rsvpGuestName || 'Valued Guest'}!
                </h4>
                <p className="font-['Cormorant_Garamond'] text-[15px] text-[#6B4734] italic mt-2">
                  {rsvpAttending === 'yes' 
                    ? "We joyfully look forward to celebrating this special day together with you." 
                    : "Thank you for sending your warm wishes. You will be missed!"}
                </p>
                <button
                  onClick={() => setRsvpSubmitted(false)}
                  className="mt-5 text-[11px] font-['Cinzel'] text-[#8C5D38] underline tracking-widest uppercase font-semibold"
                >
                  Edit Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4 text-left">
                {/* Guest Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpGuestName}
                    onChange={(e) => setRsvpGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cinzel'] text-[12px] placeholder:text-[#A89882] focus:outline-none focus:border-[#8C5D38] transition-colors"
                  />
                </div>

                {/* Will you Attend */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                    Will you be joining us?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRsvpAttending('yes')}
                      className={`py-2 px-3 rounded-[10px] border font-['Cinzel'] text-[11px] font-bold uppercase tracking-wider transition-all ${
                        rsvpAttending === 'yes'
                          ? 'bg-[#6B3D1A] text-[#FDEBD0] border-[#6B3D1A] shadow-sm'
                          : 'bg-white text-[#6B401D] border-[#D5C6AC] hover:bg-[#FAF0E6]'
                      }`}
                    >
                      Joyfully Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpAttending('no')}
                      className={`py-2 px-3 rounded-[10px] border font-['Cinzel'] text-[11px] font-bold uppercase tracking-wider transition-all ${
                        rsvpAttending === 'no'
                          ? 'bg-[#6B3D1A] text-[#FDEBD0] border-[#6B3D1A] shadow-sm'
                          : 'bg-white text-[#6B401D] border-[#D5C6AC] hover:bg-[#FAF0E6]'
                      }`}
                    >
                      Regretfully Decline
                    </button>
                  </div>
                </div>

                {/* Number of Guests */}
                {rsvpAttending === 'yes' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                      Number of Guests
                    </label>
                    <select
                      value={rsvpGuestsCount}
                      onChange={(e) => setRsvpGuestsCount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cinzel'] text-[12px] focus:outline-none focus:border-[#8C5D38] transition-colors"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5+">5+ Guests</option>
                    </select>
                  </div>
                )}

                {/* Warm Wishes */}
                <div className="flex flex-col gap-1">
                  <label className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                    Warm Wishes / Note (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={rsvpWishes}
                    onChange={(e) => setRsvpWishes(e.target.value)}
                    placeholder="Leave a blessing for the couple..."
                    className="w-full px-3.5 py-2 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cormorant_Garamond'] text-[14px] placeholder:text-[#A89882] focus:outline-none focus:border-[#8C5D38] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-[#6B3D1A] to-[#8C5329] text-[#FDEBD0] font-['Cinzel'] text-[11px] tracking-widest uppercase font-semibold flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>✉️</span> Confirm RSVP
                </button>
              </form>
            )}
          </motion.div>
        </section>

        {/* ── SECTION 7: THEMED ROYAL FOOTER ── */}
        <Footer 
          data={savedData?.footer || staticData?.footer || {
            id: 'footer',
            coupleText: `${brideName} & ${groomName}`,
            tagline: 'With Love & Gratitude',
            hashtag: `#${brideName}${groomName}Forever`,
          }} 
          theme="royal" 
          isDesktop={false} 
        />

        {/* Watermark for unpaid invitations */}
        {showWatermark && (
          <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white/70 text-[10px] tracking-wider uppercase font-['Montserrat'] pointer-events-none">
            Inviteque Preview
          </div>
        )}

      </main>
    </div>
  )
}
