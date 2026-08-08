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
const heroBgDesktop = cMapping['hero-desktop.png'] || "/backgrounds/Royal Palace/desktop-hero.png"
const heroBgMobile = cMapping['hero-mobile.png'] || "/backgrounds/Royal Palace/mobile-hero.png"
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
  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      return {
        day: parts[0],
        month: parts[1],
        year: parts[2]
      }
    }
    return { day: '22', month: 'Nov', year: '2026' }
  }, [data.dateLine])



  return (
    <section 
      className="relative w-full h-[100svh] min-h-[600px] flex flex-col items-center justify-start pt-[28vh] md:pt-[10vh] overflow-hidden bg-[#5C0A14]"
    >
      {/* Background Images without Scrollable Animation or Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <img 
          src={isDesktop ? heroBgDesktop : heroBgMobile} 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Royal double border framing the page */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="absolute inset-[11px] md:inset-[18px] lg:inset-[26px] border border-[#D6A24A]/40" />
        <div className="absolute inset-[15px] md:inset-[22px] lg:inset-[30px] border border-[#D6A24A]/15 border-dashed" />
        
        {/* Decorative gold corner brackets */}
        <div className="absolute top-[9px] md:top-[16px] lg:top-[24px] left-[9px] md:left-[16px] lg:left-[24px] w-6 h-6 border-t border-l border-[#D6A24A]" />
        <div className="absolute top-[9px] md:top-[16px] lg:top-[24px] right-[9px] md:right-[16px] lg:right-[24px] w-6 h-6 border-t border-r border-[#D6A24A]" />
        <div className="absolute bottom-[9px] md:bottom-[16px] lg:bottom-[24px] left-[9px] md:left-[16px] lg:left-[24px] w-6 h-6 border-b border-l border-[#D6A24A]" />
        <div className="absolute bottom-[9px] md:bottom-[16px] lg:bottom-[24px] right-[9px] md:right-[16px] lg:right-[24px] w-6 h-6 border-b border-r border-[#D6A24A]" />
      </div>

      {/* Hero content wrapper (Static position in top 70% of screen) */}
      <motion.div 
        initial="hidden"
        animate="show"
        className="relative z-20 flex flex-col items-center w-[85%] sm:w-[75%] lg:w-[65%] max-w-[800px] text-center select-none"
      >
        {/* Intro Line 1 */}
        <motion.p 
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 1.0, ease: "easeOut" } }
          }}
          className="text-[7.5px] sm:text-[8px] lg:text-[9px] uppercase text-[#E2BF77] font-semibold mb-0.5 tracking-[0.3em]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>
        
        {/* Intro Line 2 */}
        <motion.p 
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 0.8, y: 0, transition: { delay: 0.6, duration: 1.0, ease: "easeOut" } }
          }}
          className="text-[7px] sm:text-[7.5px] lg:text-[8px] uppercase text-[#E2BF77]/80 font-medium mb-3 sm:mb-4 tracking-[0.25em]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          JOYFULLY INVITE YOU TO CELEBRATE THE WEDDING OF
        </motion.p>

        {/* Groom Name with Glass Shine */}
        <motion.h1 
          variants={{
            hidden: { opacity: 0, y: 15 },
            show: { opacity: 1, y: 0, transition: { delay: 3.0, duration: 2.5, ease: "easeOut" } }
          }}
          className="text-[#E8C36A] font-light leading-none tracking-[0.1em] uppercase text-[48px] sm:text-[64px] md:text-[72px] lg:text-[80px] relative select-none"
          style={{ fontFamily: "'Argeta', serif", fontWeight: 200 }}
        >
          <span className="relative block" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.groomName || "Arjun").toUpperCase()}
            </span>
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              style={{
                fontFamily: "'Argeta', serif",
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
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
              {(data.groomName || "Arjun").toUpperCase()}
            </motion.span>
          </span>
        </motion.h1>

        {/* Flanked Ampersand */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { delay: 3.6, duration: 1.5, ease: "easeOut" } }
          }}
          className="flex items-center justify-center gap-3 my-0.5 md:my-1 text-[#D6A24A]"
        >
          <span 
            className="text-[28px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-normal italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            &amp;
          </span>
        </motion.div>

        {/* Bride Name with Glass Shine */}
        <motion.h1 
          variants={{
            hidden: { opacity: 0, y: 15 },
            show: { opacity: 1, y: 0, transition: { delay: 4.2, duration: 2.5, ease: "easeOut" } }
          }}
          className="text-[#E8C36A] font-light leading-none tracking-[0.1em] uppercase text-[48px] sm:text-[64px] md:text-[72px] lg:text-[80px] mb-2 md:mb-3"
          style={{ fontFamily: "'Argeta', serif", fontWeight: 200 }}
        >
          <span className="relative block" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.brideName || "Meera").toUpperCase()}
            </span>
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear', delay: 1.0 }}
              style={{
                fontFamily: "'Argeta', serif",
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
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
              {(data.brideName || "Meera").toUpperCase()}
            </motion.span>
          </span>
        </motion.h1>

        {/* Marriage Subtitle */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 1.0, ease: "easeOut" } }
          }}
          className="text-[9px] sm:text-[10px] lg:text-[11.5px] uppercase text-[#E2BF77] font-semibold mt-2.5 mb-2.5 tracking-[0.3em]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          ARE GETTING MARRIED
        </motion.p>

        {/* Date, Time, and Venue Container (Staggered Children) */}
        <div className="flex flex-col items-center gap-1 mb-4">
          {/* Date Line */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { delay: 1.2, duration: 1.0, ease: "easeOut" } }
            }}
            className="text-[#E8C36A] flex items-center justify-center gap-2.5 font-semibold text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.3em]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span>{(dateParts.day || '').toUpperCase()}</span>
            <span className="text-[#D6A24A]/40">|</span>
            <span>{(dateParts.month || '').toUpperCase()}</span>
            <span className="text-[#D6A24A]/40">|</span>
            <span>{(dateParts.year || '').toUpperCase()}</span>
          </motion.div>
          
          {/* Time Line */}
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { delay: 1.5, duration: 1.0, ease: "easeOut" } }
            }}
            className="text-[7px] sm:text-[7.5px] lg:text-[8px] uppercase text-[#E2BF77] font-medium tracking-[0.25em]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {(data.weddingTime || '').toUpperCase()}
          </motion.p>
          
          {/* Venue Line */}
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { delay: 1.8, duration: 1.0, ease: "easeOut" } }
            }}
            className="text-[7.5px] sm:text-[8.5px] lg:text-[9px] uppercase text-[#E8C36A] font-semibold tracking-[0.2em] mt-1 max-w-[280px] sm:max-w-md"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {(data.venueName || '').toUpperCase()}
            <span className="block text-[6.5px] sm:text-[7.5px] lg:text-[8px] text-[#E2BF77] font-medium mt-0.5 tracking-[0.15em]">
              {(data.venueCity || '').toUpperCase()}
            </span>
          </motion.p>
        </div>
      </motion.div>
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
            <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.45] select-none text-[#E2BF77]">
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
          <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.32] select-none flex flex-col justify-around items-center text-[#E2BF77]">
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
