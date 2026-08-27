import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import Countdown from '../components/Countdown.jsx'
import Events from '../components/Events.jsx'
import Footer from '../components/Footer.jsx'
import Invitation from '../components/InvitationEverlastingVows.jsx'
import Story from '../components/StoryEverlastingVows.jsx'
import Venue from '../components/Venue.jsx'
import CustomSection from '../components/CustomSection.jsx'
import { weddingData as staticData } from '../weddingData.js'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

import cMapping from '../everlastingVowsCloudinaryMapping.json'

// Background assets (local Vercel CDN)
const desktopBg = cMapping['hero_desktop.png'] || "/assets/templates/everlasting-vows/hero-desktop.webp"
const smartphoneBg = cMapping['hero_mobile.png'] || "/assets/templates/everlasting-vows/hero-mobile.webp"
const photoBgDesktop = cMapping['photo_desktop.png'] || "/assets/templates/everlasting-vows/photo-desktop.webp"
const photoBgMobile = cMapping['photo_mobile.png'] || "/assets/templates/everlasting-vows/photo-mobile.webp"
const messageBgDesktop = "/assets/templates/everlasting-vows/wedding-message-desktop.webp"
const messageBgMobile = "/assets/templates/everlasting-vows/wedding-message-mobile.webp"
const locationBgDesktop = cMapping['venue_desktop.png'] || "/assets/templates/everlasting-vows/venue-desktop.webp"
const locationBgMobile = cMapping['venue_mobile.png'] || "/assets/templates/everlasting-vows/venue-mobile.webp"
const countdownBgDesktop = cMapping['countdown_desktop.png'] || "/assets/templates/everlasting-vows/countdown-desktop.webp"
const countdownBgMobile = cMapping['countdown_mobile.png'] || "/assets/templates/everlasting-vows/countdown-mobile.webp"

const defaultPhoto1 = cMapping['photocards/template-4-1.png'] || "/assets/templates/everlasting-vows/photocard-1.webp"
const defaultPhoto2 = cMapping['photocards/template-4-2.png'] || "/assets/templates/everlasting-vows/photocard-2.webp"
const defaultPhoto3 = cMapping['photocards/template-4-3.png'] || "/assets/templates/everlasting-vows/photocard-3.webp"

const petalConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20; // 0-20% or 80-100%
  const duration = 6 + Math.random() * 8; // 6 to 14 seconds
  const delay = Math.random() * 5;
  const size = 6 + Math.random() * 10; // 24px to 64px roughly
  const x1 = Math.random() * 60 - 30;
  const x2 = Math.random() * 60 - 30;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

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
            opacity: 0.80,
            filter: 'drop-shadow(0px 3px 5px rgba(138,110,30,0.15))'
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
            <path d="M 20 0 C 35 10, 35 30, 20 40 C 5 30, 5 10, 20 0 Z" fill="rgba(212,175,55,0.85)" />
            <circle cx="20" cy="20" r="3" fill="#FFFDF2" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

function EverlastingVowsHero({ data, isDesktop }) {
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

  // Parse the date (e.g., "18 December 2026")
  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      return {
        day: parts[0],
        month: parts[1],
        year: parts[2]
      }
    }
    return { day: '18', month: '12', year: '2026' }
  }, [data.dateLine])

  return (
    <section 
      className={`relative overflow-hidden flex flex-col items-center text-center select-none ${
        isDesktop 
          ? 'h-screen w-full justify-start pt-[10vh] pb-16 px-8' 
          : 'h-[100svh] w-full justify-start pt-[6svh] sm:pt-[8svh] pb-8 px-6'
      }`}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.05, transformOrigin: 'center' }}
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

      {/* Hero Content Panel (Positioned upper-center elegantly inside the palace arch) */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.35 } }
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

        {/* Small Intro Tag */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#8A6E1E] font-bold mb-2.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Save the Date
        </motion.p>

        {/* Couple Names - Reduced Desktop font size & responsive layout */}
        <motion.h1 
          variants={nameContainerVariant}
          className="text-[#8A6E1E] uppercase tracking-[0.1em] select-none font-bold mb-4"
          style={{ 
            fontFamily: "'Cinzel', serif", 
            lineHeight: '1.2',
            fontSize: isDesktop ? 'clamp(2.2rem, 3.8vw, 3.4rem)' : 'clamp(1.8rem, 6.5vw, 2.5rem)'
          }}
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
            className="block my-0.5 text-2xl sm:text-3xl font-medium lowercase italic font-serif text-[#8A6E1E]/90"
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
          className="text-[10px] tracking-[0.25em] uppercase text-[#8A6E1E] font-bold mb-2"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Are Getting Married
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

        {/* Wedding Date Row */}
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

        {/* Time of Marriage */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#8A6E1E]/90 font-bold mb-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.weddingTime}
        </motion.p>

        {/* Venue details */}
        <motion.div variants={fadeInSlow} className="flex flex-col items-center">
          {/* Pin Icon */}
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

      {/* Scroll button */}
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

export default function TemplateEverlastingVows({ savedData }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  // Watermark status
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid

  // Active data
  const hasDraft = draftData && (draftData.groomName || draftData.brideName)
  const activeData = savedData || (hasDraft ? draftData : null)

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
      venueName: (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData.mahalName) || 'The Leela Palace',
      venueCity: (savedData
        ? [savedData.venueData?.venueCity || savedData.venueCity, savedData.venueData?.state || savedData.state].filter(Boolean).join(', ')
        : [draftData.venueCity, draftData.state].filter(Boolean).join(', ')
      ) || 'New Delhi, India',
      addressParts: (() => {
        const rawParts = savedData
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
            ].map(s => String(s || '').trim()).filter(Boolean)

        if (rawParts.length > 0) {
          // Flatten comma-separated strings inside parts so each line is clean and distinct
          return rawParts.flatMap(part => part.split(',').map(s => s.trim()).filter(Boolean))
        }

        // Complete default venue address if no user inputs exist
        return [
          'The Leela Palace, Diplomatic Enclave, Chanakyapuri',
          'New Delhi, Delhi 110021'
        ]
      })(),
      fullAddress: (savedData
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
      ) || 'The Leela Palace, Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110021',
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
      venueName: (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData.mahalName) || 'The Leela Palace',
      venueLine1: (savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData.mahalName,
            draftData.venueAddress
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
      ) || 'The Leela Palace, Diplomatic Enclave, Chanakyapuri',
      venueLine2: (savedData
        ? [
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData.venueCity,
            draftData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
      ) || 'New Delhi, Delhi 110021',
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
      ) || 'The Leela Palace, Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110021',
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
              { image: defaultPhoto1 },
              { image: defaultPhoto2 },
              { image: defaultPhoto3 }
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
      groomName: (savedData ? savedData.coupleData.groomName : draftData.groomName) || 'Abhishek',
      brideName: (savedData ? savedData.coupleData.brideName : draftData.brideName) || 'Kanika',
    }
  } : {
    ...staticData,
    hero: {
      ...staticData.hero,
      names: 'Abhishek & Kanika',
      groomName: 'Abhishek',
      brideName: 'Kanika',
      dateLine: '18 December 2026',
      weddingTime: '09:00 AM - 10:30 AM',
      dayOfWeek: 'Friday',
      venueName: 'The Leela Palace',
      venueCity: 'New Delhi, India',
      addressParts: ['The Leela Palace, Diplomatic Enclave, Chanakyapuri', 'New Delhi, Delhi 110021'],
      fullAddress: 'The Leela Palace, Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110021',
    },
    venue: {
      ...staticData.venue,
      venueName: 'The Leela Palace',
      venueLine1: 'The Leela Palace, Diplomatic Enclave, Chanakyapuri',
      venueLine2: 'New Delhi, Delhi 110021',
      location: 'The Leela Palace, Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110021',
    },
    invitation: {
      ...staticData.invitation,
      groomName: 'Abhishek',
      brideName: 'Kanika',
    },
    story: {
      ...staticData.story,
      items: [
        { image: defaultPhoto1 },
        { image: defaultPhoto2 },
        { image: defaultPhoto3 }
      ]
    }
  }

  const showGallery = savedData ? savedData.scheduleData?.showGallery : draftData.showGallery
  const showSchedule = savedData ? savedData.scheduleData?.showSchedule : draftData.showSchedule
  const customSectionData = savedData ? (savedData.invitationData || {}) : draftData

  return (
    <div className="relative min-h-screen bg-[#FFFDF2] text-[#8A6E1E]">
      {/* MOBILE VIEW */}
      <div className="md:hidden flex justify-center items-start min-h-screen bg-[#1a1a1a]">
        <div className="relative w-full max-w-[430px] min-h-[100svh] bg-[#FFFDF2] text-[#8A6E1E] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          {/* Watermark */}
          {showWatermark && (
            <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.35] select-none text-[#8A6E1E]">
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

          {/* Back/Proceed Controls */}
          {isPreview && (
            <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#8A6E1E]/20 bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#8A6E1E] shadow-xl hover:scale-105 active:scale-95"
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

          <EverlastingVowsHero data={data.hero} isDesktop={false} />
          <CustomSection photoBgDesktop={photoBgDesktop} photoBgMobile={photoBgMobile} data={customSectionData} />
          {showGallery && <Story data={data.story} bgImage={photoBgMobile} isDesktop={false} />}
          <Invitation data={data.invitation} isDesktop={false} bgImage={messageBgMobile} />
          <Venue data={data.venue} bgImage={locationBgMobile} theme="gold" isDesktop={false} />
          {showSchedule && <Events data={data.events} theme="gold" bgImage={photoBgMobile} isDesktop={false} />}
          <Countdown data={data.countdown} bgImage={countdownBgMobile} theme="gold" isDesktop={false} />
          <Footer data={data.footer} theme="gold" />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block w-full min-h-screen bg-[#FFFDF2] relative">
        {showWatermark && (
          <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.22] select-none flex flex-col justify-around items-center text-[#8A6E1E]">
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
          </div>
        )}

        {isPreview && (
          <div className="fixed bottom-8 right-8 z-[110] flex gap-4">
            <button
              onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })}
              className="px-8 py-4 rounded-full border border-[#8A6E1E]/25 bg-white/95 backdrop-blur-md text-sm font-bold text-[#8A6E1E] shadow-xl hover:scale-105 active:scale-95"
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
          <EverlastingVowsHero data={data.hero} isDesktop={true} />
        </div>
        <div className="w-full">
          <CustomSection photoBgDesktop={photoBgDesktop} photoBgMobile={photoBgMobile} data={customSectionData} />
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
          <Venue data={data.venue} isDesktop={true} bgImage={locationBgDesktop} theme="gold" />
        </div>
        {showSchedule && (
          <div className="w-full">
            <Events data={data.events} isDesktop={true} theme="gold" bgImage={photoBgDesktop} />
          </div>
        )}
        <div className="w-full">
          <Countdown data={data.countdown} isDesktop={true} bgImage={countdownBgDesktop} theme="gold" />
        </div>
        <div className="w-full">
          <Footer data={data.footer} isDesktop={true} theme="gold" />
        </div>
      </div>
    </div>
  )
}
