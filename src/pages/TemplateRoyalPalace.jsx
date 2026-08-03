import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import Countdown from '../components/CountdownRoyalPalace.jsx'
import Events from '../components/EventsRoyalPalace.jsx'
import Footer from '../components/FooterRoyalPalace.jsx'
import Invitation from '../components/InvitationRoyalPalace.jsx'
import Story from '../components/StoryRoyalPalace.jsx'
import Venue from '../components/VenueRoyalPalace.jsx'
import { weddingData as staticData } from '../weddingData.js'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

import cMapping from '../royalPalaceCloudinaryMapping.json'

// Local Theme Background Assets (configured with absolute URL paths)
const heroBgDesktop = cMapping['hero-desktop.png'] || "/backgrounds/Royal Palace/hero-desktop.png"
const heroBgMobile = cMapping['hero-mobile.png'] || "/backgrounds/Royal Palace/hero-mobile.png"
const photoBgDesktop = cMapping['photo-desktop.png'] || "/backgrounds/Royal Palace/photo-desktop.png"
const photoBgMobile = cMapping['photo-mobile.png'] || "/backgrounds/Royal Palace/photo-mobile.png"
const messageBgDesktop = cMapping['message-desktop.png'] || "/backgrounds/Royal Palace/message-desktop.png"
const messageBgMobile = cMapping['message-moboile.png'] || "/backgrounds/Royal Palace/message-moboile.png"
const venueBgDesktop = cMapping['venue-desktop.png'] || "/backgrounds/Royal Palace/venue-desktop.png"
const venueBgMobile = cMapping['venue-mobile.png'] || "/backgrounds/Royal Palace/venue-mobile.png"
const countdownBgDesktop = cMapping['countdown-deskotp.png'] || "/backgrounds/Royal Palace/countdown-deskotp.png"
const countdownBgMobile = cMapping['countdown-mobile.png'] || "/backgrounds/Royal Palace/countdown-mobile.png"

const fallbackPhoto1 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964628/twilight-photo-1.png"
const fallbackPhoto2 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964629/twilight-photo-2.png"
const fallbackPhoto3 = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964631/twilight-photo-3.png"

const petalConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20;
  const duration = 6 + Math.random() * 8;
  const delay = Math.random() * 5;
  const size = 6 + Math.random() * 10;
  const x1 = Math.random() * 60 - 30;
  const x2 = Math.random() * 60 - 30;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

function FallingGoldPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100svh' }}>
      {petalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size, 
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
          <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 0 C 32 10, 32 30, 20 40 C 8 30, 8 10, 20 0 Z" fill="#D4AF37" />
            <circle cx="20" cy="20" r="3" fill="#FFF3CD" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

function RoyalPalaceHero({ data, isDesktop }) {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)

  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['2%', '-3%'], { clamp: true })
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    return { day: '18', month: '12', year: '2026' }
  }, [data.dateLine])

  return (
    <section 
      className={`relative overflow-hidden flex flex-col items-center text-center select-none ${
        isDesktop 
          ? 'h-screen w-full justify-center py-20 px-8' 
          : 'h-[100svh] w-full justify-start pt-[12svh] pb-8 px-6'
      }`}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.12, transformOrigin: 'center' }}
      >
        <img
          src={isDesktop ? heroBgDesktop : heroBgMobile}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center top' }}
          loading="eager"
        />
      </motion.div>

      {/* Falling Gold Petals */}
      <FallingGoldPetals />

      {/* Content panel */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.35 } }
        }}
        className="relative z-20 flex flex-col items-center max-w-xl md:-translate-y-[22%] translate-x-[0.5%]"
      >
        {/* Monogram Accents */}
        <motion.div variants={fadeInSlow} className="mb-2">
          <svg viewBox="0 0 40 40" width="36" height="36" fill="none" className="stroke-[#E3C57C] opacity-90">
            <circle cx="20" cy="20" r="18" strokeWidth="1.2" strokeDasharray="3,3" />
            <path d="M20 8 L20 32" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 18 Q20 10 28 18" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="2.5" fill="#E3C57C" stroke="none" />
          </svg>
        </motion.div>

        {/* Intro */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] sm:text-xs uppercase text-[#E3C57C] font-semibold mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '3px' }}
        >
          Royal Invitation
        </motion.p>

        {/* Couple Names - Cormorant Garamond Light */}
        <motion.h1 
          variants={nameContainerVariant}
          className={`text-[#E3C57C] uppercase select-none ${
            isDesktop ? 'text-[72px] mb-2' : 'text-[42px] mb-1.5'
          }`}
          style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontWeight: 300, 
            lineHeight: 0.95, 
            letterSpacing: '2px' 
          }}
        >
          <span className="block mb-1 relative" style={{ display: 'block', position: 'relative' }}>
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
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'inherit',
                fontWeight: 300,
                lineHeight: 0.95,
                letterSpacing: '2px',
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
          
          {/* Flourish flanking the Italic Ampersand */}
          <motion.div 
            variants={fadeInSlow}
            className="flex items-center justify-center gap-4 my-2 sm:my-3"
          >
            <svg viewBox="0 0 40 20" width="36" height="18" fill="none" stroke="#E3C57C" strokeWidth="1.0" className="opacity-80">
              <path d="M40 10 Q25 15 10 10 Q25 5 40 10" strokeLinecap="round" />
              <path d="M30 10 Q20 3 12 5" strokeLinecap="round" />
              <path d="M25 10 Q15 17 8 15" strokeLinecap="round" />
              <circle cx="5" cy="10" r="1.2" fill="#E3C57C" stroke="none" />
            </svg>
            <span 
              className={`font-normal lowercase text-[#E3C57C] leading-none ${
                isDesktop ? 'text-[64px]' : 'text-[36px]'
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            >
              &amp;
            </span>
            <svg viewBox="0 0 40 20" width="36" height="18" fill="none" stroke="#E3C57C" strokeWidth="1.0" className="opacity-80">
              <path d="M0 10 Q15 15 30 10 Q15 5 0 10" strokeLinecap="round" />
              <path d="M10 10 Q20 3 28 5" strokeLinecap="round" />
              <path d="M15 10 Q25 17 32 15" strokeLinecap="round" />
              <circle cx="35" cy="10" r="1.2" fill="#E3C57C" stroke="none" />
            </svg>
          </motion.div>

          <span className="block mt-1 relative" style={{ display: 'block', position: 'relative' }}>
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
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'inherit',
                fontWeight: 300,
                lineHeight: 0.95,
                letterSpacing: '2px',
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

        {/* Tag */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] sm:text-xs uppercase text-[#E3C57C] font-medium mb-2.5"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '3px' }}
        >
          Are Getting Married
        </motion.p>

        {/* Divider */}
        <motion.div 
          variants={fadeInSlow} 
          className="flex items-center gap-3 w-32 my-2 opacity-60"
        >
          <div className="h-[0.5px] bg-[#E3C57C]/50 flex-1" />
          <span className="text-[#E3C57C] text-[8px]">✦</span>
          <div className="h-[0.5px] bg-[#E3C57C]/50 flex-1" />
        </motion.div>

        {/* Date (18 | 12 | 2026 format) */}
        <motion.div 
          variants={fadeInSlow} 
          className={`text-[#E3C57C] flex items-center justify-center my-2 font-medium ${
            isDesktop ? 'text-[13px] gap-4' : 'text-[11px] gap-2.5'
          }`}
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '3px' }}
        >
          <span>{dateParts.day}</span>
          <span className="text-[#E3C57C]/30 font-light">|</span>
          <span>{dateParts.month}</span>
          <span className="text-[#E3C57C]/30 font-light">|</span>
          <span>{dateParts.year}</span>
        </motion.div>

        {/* Day of Week */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] sm:text-[11px] uppercase text-[#E3C57C] font-medium mb-1.5"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '3px' }}
        >
          {data.dayOfWeek || 'Friday'}
        </motion.p>

        {/* Time */}
        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] sm:text-[11px] uppercase text-[#E3C57C]/90 font-medium mb-5"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '3px' }}
        >
          {data.weddingTime}
        </motion.p>

        {/* Venue details */}
        <motion.div variants={fadeInSlow} className="flex flex-col items-center">
          <div className="mb-2">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E3C57C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-95">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3.2" />
            </svg>
          </div>
          {data.addressParts && data.addressParts.length > 0 ? (
            <div className="flex flex-col items-center gap-1">
              {data.addressParts.map((part, index) => (
                <p 
                  key={index}
                  className="text-[#E3C57C] uppercase font-medium text-center"
                  style={{ 
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: isDesktop 
                      ? (index === 0 ? '12px' : '10px') 
                      : (index === 0 ? '11px' : '9.5px'),
                    letterSpacing: '2px',
                    lineHeight: '1.8'
                  }}
                >
                  {part}
                </p>
              ))}
            </div>
          ) : (
            <p 
              className="text-[#E3C57C] uppercase font-medium text-center"
              style={{ 
                fontFamily: "'Montserrat', sans-serif",
                fontSize: isDesktop ? '12px' : '11px',
                letterSpacing: '2px',
                lineHeight: '1.8'
              }}
            >
              {data.venueName}
              <span className="block mt-0.5 text-[#E3C57C] font-medium" style={{ fontSize: isDesktop ? '10px' : '9.5px' }}>{data.venueCity}</span>
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
            border: '1.5px solid rgba(212,175,55,0.4)',
            background: 'rgba(255,253,242,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 18 11" width="13" height="8" fill="none" aria-hidden="true">
            <path d="M1 1.5 L9 9.5 L17 1.5"
              stroke="#7B0F1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.8"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  )
}

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

  // Active data
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
        return isNaN(d.getTime()) ? 'Friday' : d.toLocaleDateString('en-US', { weekday: 'long' })
      })(),
    },
    venue: {
      ...staticData.venue,
      venueName: (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData.mahalName) || '',
      venueLine1: savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData.mahalName,
            draftData.venueAddress
          ].map(s => String(s || '').trim()).filter(Boolean).join(', '),
      venueLine2: savedData
        ? [
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData.venueCity,
            draftData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', '),
      location: savedData
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
  const showSchedule = savedData ? savedData.scheduleData?.showSchedule : draftData.showSchedule

  return (
    <div className="relative min-h-screen bg-[#5C0A14] text-[#E3C57C]">
      {/* MOBILE VIEW */}
      <div className="md:hidden flex justify-center items-start min-h-screen bg-[#1a1a1a]">
        <div className="relative w-full max-w-[430px] min-h-[100svh] bg-[#5C0A14] text-[#E3C57C] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
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
                  onClick={() => navigate(-1)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#7B0F1A] shadow-xl hover:scale-105 active:scale-95"
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

          <RoyalPalaceHero data={data.hero} isDesktop={false} />
          {showGallery && <Story data={data.story} bgImage={photoBgMobile} />}
          <Invitation data={data.invitation} bgImage={messageBgMobile} />
          <Venue data={data.venue} bgImage={venueBgMobile} />
          {showSchedule && <Events data={data.events} bgImage={photoBgMobile} />}
          <Countdown data={data.countdown} bgImage={countdownBgMobile} />
          <Footer data={data.footer} />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block w-full min-h-screen bg-[#5C0A14] relative">
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
              onClick={() => navigate(-1)}
              className="px-8 py-4 rounded-full border border-[#D4AF37]/45 bg-white/95 backdrop-blur-md text-sm font-bold text-[#7B0F1A] shadow-xl hover:scale-105 active:scale-95"
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
          <RoyalPalaceHero data={data.hero} isDesktop={true} />
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
          <Venue data={data.venue} isDesktop={true} bgImage={venueBgDesktop} />
        </div>
        {showSchedule && (
          <div className="w-full">
            <Events data={data.events} isDesktop={true} bgImage={photoBgDesktop} />
          </div>
        )}
        <div className="w-full">
          <Countdown data={data.countdown} isDesktop={true} bgImage={countdownBgDesktop} />
        </div>
        <div className="w-full">
          <Footer data={data.footer} isDesktop={true} />
        </div>
      </div>
    </div>
  )
}
