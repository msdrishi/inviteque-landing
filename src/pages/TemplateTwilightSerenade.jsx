import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import Countdown from '../components/Countdown.jsx'
import Events from '../components/Events.jsx'
import Footer from '../components/Footer.jsx'
import Invitation from '../components/InvitationTwilightSerenade.jsx'
import Story from '../components/StoryTwilightSerenade.jsx'
import Venue from '../components/Venue.jsx'
import { weddingData as staticData } from '../weddingData.js'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// Cloudinary background asset URLs
const desktopBg = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964581/desktop.png"
const smartphoneBg = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964627/smartphone.png"
const photoBgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964624/photo-section-desktop.png"
const photoBgMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964626/photo-section-mobile.png"
const messageBgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964619/message-section-desktop.png"
const messageBgMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964623/message-section-mobile.png"
const locationBgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964612/location-section-desktop.png"
const locationBgMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964614/location-section-mobile.png"
const countdownBgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964566/countdown-section-desktop.png"
const countdownBgMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964573/countdown-section-mobile.png"
const twilightPhoto1 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964628/twilight-photo-1.png"
const twilightPhoto2 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964629/twilight-photo-2.png"
const twilightPhoto3 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964631/twilight-photo-3.png"

const leafImg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029563/kozuh0rafoxa9zwysfjq.png"

const leafConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20; // 0-20% or 80-100%
  const duration = 6 + Math.random() * 8; // 6 to 14 seconds
  const delay = Math.random() * 5;
  const size = 5 + Math.random() * 10; // 20px to 40px (natural, visible size)
  const x1 = Math.random() * 60 - 30;
  const x2 = Math.random() * 60 - 30;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

function FallingLeaves() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100svh' }}>
      {leafConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size * 1.5, 
            opacity: 0.80,
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
          <svg viewBox="0 0 40 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {/* Main leaf body filled with #404D29 */}
            <path d="M 20 5 C 40 20, 35 45, 20 55 C 5 45, 0 20, 20 5 Z" fill="#404D29" />
            {/* Veins */}
            <path d="M 20 5 Q 16 30, 20 55" stroke="#2B351B" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 18 20 L 10 15" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 21 25 L 30 20" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 19 35 L 12 32" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 21 40 L 28 38" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            {/* Stem */}
            <path d="M 20 55 L 20 59" stroke="#2B351B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

function TwilightSerenadeHero({ data, isDesktop }) {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)

  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%'])
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animation variants
  const fadeInSlow = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 2.2, ease: "easeOut" } }
  }

  const nameContainerVariant = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.14, // Super slow stagger between letters
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
        duration: 1.8, // Super slow and smooth letter reveal
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  }

  // Parse the date (e.g., "18 August 2026") into day, month, year
  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      return {
        day: parts[0],
        month: parts[1],
        year: parts[2]
      }
    }
    // Fallback if formatting differs
    return { day: '18', month: '12', year: '2026' }
  }, [data.dateLine])

  return (
    <section 
      className={`relative overflow-hidden flex flex-col items-center text-center select-none ${
        isDesktop 
          ? 'h-screen w-full justify-center py-20 px-8' 
          : 'h-[100svh] w-full justify-start pt-[11svh] pb-8 px-6'
      }`}
    >
      {/* ── Parallax background ── */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.05, transformOrigin: 'center' }}
      >
        <img
          src={isLandscape ? smartphoneBg : desktopBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center top' }}
          loading="eager"
        />
      </motion.div>

      {/* Falling Leaves Component */}
      <FallingLeaves />

      {/* Hero Content Panel (Positioned perfectly to overlay inside the background arch) */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.35 } } // Paced stagger between text blocks
        }}
        className="relative z-20 flex flex-col items-center max-w-xl translate-x-[1.7%] md:-translate-y-[25%] md:translate-x-[1.5%] lg:-translate-x-[1.7%]"
      >
        {/* Top Icon/Monogram Accents */}
        <motion.div variants={fadeInSlow} className="mb-2">
          <svg viewBox="0 0 40 24" width="32" height="20" fill="none" className="stroke-[#3D5236] opacity-90">
            <path d="M20 2 L20 18" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 10 Q20 4 28 10" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M14 14 Q20 10 26 14" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="1.8" fill="#3D5236" />
          </svg>
        </motion.div>

        {/* Small Intro Tag */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#3D5236] font-bold mb-2 sm:mb-2.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Save the Date
        </motion.p>

        {/* Couple Names - styled exactly like the premium luxury layout with glassy glare */}
        <motion.h1 
          variants={nameContainerVariant}
          className={`text-[#3D5236] uppercase tracking-[0.06em] select-none font-bold ${
            isDesktop ? 'text-5xl md:text-6xl mb-2' : 'text-3xl sm:text-4xl mb-1.5'
          }`}
          style={{ fontFamily: "'Cinzel', serif", lineHeight: '1.2' }}
        >
          <span className="block mb-0.5 sm:mb-1 relative" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.groomName || '').split('').map((char, index) => (
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
              {(data.groomName || '').split('').map((char, index) => (
                <span key={`groom-glare-${index}`} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </motion.span>
          </span>
          <motion.span 
            variants={fadeInSlow}
            className="block my-0.5 text-2xl sm:text-3xl font-medium lowercase italic font-serif text-[#3D5236]/90"
          >
            &amp;
          </motion.span>
          <span className="block mt-0.5 sm:mt-1 relative" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.brideName || '').split('').map((char, index) => (
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
              {(data.brideName || '').split('').map((char, index) => (
                <span key={`bride-glare-${index}`} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </motion.span>
          </span>
        </motion.h1>

        {/* Small Tag */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] tracking-[0.25em] uppercase text-[#3D5236] font-bold mb-1.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Are Getting Married
        </motion.p>

        {/* Custom Dot/Star Divider */}
        <motion.div 
          variants={fadeInSlow} 
          className="flex items-center gap-3 w-32 my-1 opacity-50"
        >
          <div className="h-[0.9px] bg-[#3D5236] flex-1" />
          <span className="text-[#3D5236] text-[8px]">♥</span>
          <div className="h-[0.9px] bg-[#3D5236] flex-1" />
        </motion.div>

        {/* Wedding Date Row (18 | 12 | 2026 format) */}
        <motion.div 
          variants={fadeInSlow} 
          className={`text-[#3D5236] tracking-[0.12em] flex items-center justify-center my-1 font-bold ${
            isDesktop ? 'text-2xl md:text-3xl gap-3' : 'text-base sm:text-lg gap-1.5'
          }`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span>{dateParts.day}</span>
          <span className="text-[#3D5236]/40 font-bold text-lg sm:text-xl">|</span>
          <span>{dateParts.month}</span>
          <span className="text-[#3D5236]/40 font-bold text-lg sm:text-xl">|</span>
          <span>{dateParts.year}</span>
        </motion.div>

        {/* Day of Week */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#3D5236] font-bold mb-1.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.dayOfWeek || 'Friday'}
        </motion.p>

        {/* Time of Marriage */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#3D5236]/90 font-bold mb-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.weddingTime}
        </motion.p>
        {/* Venue details */}
        <motion.div variants={fadeInSlow} className="flex flex-col items-center">
          {/* Premium Vector Pin Icon */}
          <div className="mb-1.5">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3D5236" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3.2" />
            </svg>
          </div>
          <p 
            className="text-xs sm:text-sm text-[#3D5236] tracking-[0.18em] uppercase font-bold text-center leading-relaxed"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {data.venueName}
            <span className="block mt-0.5 text-[11px] sm:text-xs text-[#3D5236]/90 font-semibold tracking-[0.15em]">{data.venueCity}</span>
          </p>
        </motion.div>
      </motion.div>

      {/* ── Scroll button ── */}
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
            border: '1.5px solid rgba(61,82,54,0.3)',
            background: 'rgba(255,255,255,0.58)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 18 11" width="13" height="8" fill="none" aria-hidden="true">
            <path d="M1 1.5 L9 9.5 L17 1.5"
              stroke="#3D5236" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.8"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  )
}

export default function TemplateTwilightSerenade({ savedData }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  // Watermark is shown unless the invitation has been paid
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = false

  // Determine active data source
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
      venueName: (savedData ? savedData.venueData.mahalName : draftData.mahalName) || '',
      venueCity: (savedData ? savedData.venueData.venueCity : draftData.venueCity) || '',
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
        return isNaN(d.getTime()) ? 'Friday' : d.toLocaleDateString('en-US', { weekday: 'long' })
      })(),
    },
    venue: {
      ...staticData.venue,
      venueName: (savedData ? savedData.venueData.mahalName : draftData.mahalName) || '',
      location: savedData
        ? [savedData.venueData.mahalName, savedData.venueData.venueAddress, savedData.venueData.venueCity, savedData.venueData.state].filter(Boolean).join(', ')
        : [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean).join(', '),
      mapUrl: (savedData ? savedData.venueData.mapLink : draftData.mapLink) || staticData.venue.mapUrl,
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
              { image: twilightPhoto1 },
              { image: twilightPhoto2 },
              { image: twilightPhoto3 }
            ]
      })(),
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
    },
    invitation: {
      ...staticData.invitation,
      groomName: savedData ? savedData.coupleData.groomName : draftData.groomName,
      brideName: savedData ? savedData.coupleData.brideName : draftData.brideName,
    }
  } : {
    ...staticData,
    story: {
      ...staticData.story,
      items: [
        { image: twilightPhoto1 },
        { image: twilightPhoto2 },
        { image: twilightPhoto3 }
      ]
    }
  }

  const showGallery = savedData ? savedData.scheduleData?.showGallery : draftData.showGallery
  const showSchedule = savedData ? savedData.scheduleData?.showSchedule : draftData.showSchedule

  return (
    <div className="relative min-h-screen bg-[#FBF7F0] text-[#3D5236]">
      {/* MOBILE VIEW */}
      <div className="md:hidden flex justify-center items-start min-h-screen bg-[#1a1a1a]">
        <div className="relative w-full max-w-[430px] min-h-[100svh] bg-[#FBF7F0] text-[#3D5236] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          {/* Watermark */}
          {showWatermark && (
            <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.28] select-none text-[#3D5236]/30">
              <span className="absolute top-[8%] left-1/2 -translate-x-1/2 text-[18px] font-medium tracking-[0.2em]" style={{ fontFamily: "'Cinzel', serif" }}>
                PREVIEW
              </span>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] font-medium tracking-[0.2em]" style={{ fontFamily: "'Cinzel', serif" }}>
                PREVIEW
              </span>
            </div>
          )}

          {/* Back/Proceed Controls */}
          {isPreview && (
            <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#3D5236]/20 bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#3D5236] shadow-xl hover:scale-105 active:scale-95"
                >
                  Back
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

          <TwilightSerenadeHero data={data.hero} isDesktop={false} />
          {showGallery && <Story data={data.story} bgImage={photoBgMobile} />}
          <Invitation data={data.invitation} bgImage={messageBgMobile} />
          <Venue data={data.venue} bgImage={locationBgMobile} theme="green" />
          {showSchedule && <Events data={data.events} theme="green" bgImage={photoBgMobile} />}
          <Countdown data={data.countdown} bgImage={countdownBgMobile} theme="green" />
          <Footer data={data.footer} theme="green" />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block w-full min-h-screen bg-[#FBF7F0] relative">
        {showWatermark && (
          <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.18] select-none flex flex-col justify-around items-center text-[#3D5236]">
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>
              PREVIEW — TWILIGHT SERENADE
            </span>
          </div>
        )}

        {isPreview && (
          <div className="fixed bottom-8 right-8 z-[110] flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 rounded-full border border-[#3D5236]/25 bg-white/95 backdrop-blur-md text-sm font-bold text-[#3D5236] shadow-xl hover:scale-105 active:scale-95"
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

        <div className="w-full">
          <TwilightSerenadeHero data={data.hero} isDesktop={true} />
        </div>
        {showGallery && (
          <div className="w-full">
            <Story data={data.story} isDesktop={true} bgImage={photoBgDesktop} />
          </div>
        )}
        <div className="w-full">
          <Invitation data={data.invitation} isDesktop={true} bgImage={messageBgDesktop} />
        </div>
        <div className="w-full">
          <Venue data={data.venue} isDesktop={true} bgImage={locationBgDesktop} theme="green" />
        </div>
        {showSchedule && (
          <div className="w-full">
            <Events data={data.events} isDesktop={true} theme="green" bgImage={photoBgDesktop} />
          </div>
        )}
        <div className="w-full">
          <Countdown data={data.countdown} isDesktop={true} bgImage={countdownBgDesktop} theme="green" />
        </div>
        <div className="w-full">
          <Footer data={data.footer} isDesktop={true} theme="green" />
        </div>
      </div>
    </div>
  )
}
