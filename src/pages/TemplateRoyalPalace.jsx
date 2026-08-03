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
  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], [0, -60], { clamp: true })
  const contentY = useSpring(rawY, { stiffness: 55, damping: 20 })

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

  const heroBgDesktop = "/backgrounds/Royal Palace/hero-desktop.png"
  const heroBgMobile = "/backgrounds/Royal Palace/hero-mobile.png"

  return (
    <section 
      className="relative w-full h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#7D000A]"
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0 pointer-events-none">
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

      {/* Paisleys in corners */}
      {/* Top-Left Paisley */}
      <svg 
        viewBox="0 0 200 300" 
        className="absolute top-[15px] md:top-[22px] lg:top-[30px] left-[15px] md:left-[22px] lg:left-[30px] w-[30%] sm:w-[25%] lg:w-[20%] max-w-[200px] pointer-events-none z-20 text-[#D6A24A]/35"
        fill="currentColor"
      >
        <path d="M 0 0 C 60 15, 120 50, 150 110 C 165 140, 158 182, 120 196 C 90 207, 45 189, 30 154 C 22 133, 38 112, 60 119 C 82 126, 75 154, 98 157 C 112 159, 128 133, 112 105 C 90 63, 30 28, 0 0 Z" />
        <circle cx="170" cy="120" r="4.5" />
        <circle cx="150" cy="160" r="3.5" />
        <circle cx="120" cy="190" r="3" />
        <path d="M0,60 Q45,90 75,150" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3,3" />
        <path d="M60,0 Q90,45 150,75" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3,3" />
      </svg>

      {/* Bottom-Right Paisley */}
      <svg 
        viewBox="0 0 200 200" 
        className="absolute bottom-[15px] md:bottom-[22px] lg:bottom-[30px] right-[15px] md:right-[22px] lg:right-[30px] w-[28%] sm:w-[25%] lg:w-[18%] max-w-[180px] pointer-events-none z-20 text-[#D6A24A]/35"
        fill="currentColor"
      >
        <g transform="rotate(180 100 100)">
          <path d="M 0 0 C 50 20, 110 60, 135 120 C 148 148, 138 180, 105 190 C 78 198, 38 178, 30 148 C 25 127, 39 110, 58 116 C 76 122, 70 148, 88 150 C 100 151, 112 128, 100 100 C 80 60, 30 25, 0 0 Z" />
          <circle cx="155" cy="130" r="3" />
          <circle cx="135" cy="165" r="4" />
          <circle cx="108" cy="188" r="2" />
          <path d="M0,50 Q40,75 65,125" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3,3" />
        </g>
      </svg>

      {/* Hero content wrapper */}
      <motion.div 
        initial="hidden"
        animate="show"
        style={{ y: contentY }}
        className="relative z-20 flex flex-col items-center w-[85%] sm:w-[75%] lg:w-[65%] max-w-[800px] text-center select-none"
      >
        {/* Monogram */}
        <motion.div 
          variants={{
            hidden: { scale: 0.8, opacity: 0 },
            show: { scale: 1, opacity: 0.85, transition: { delay: 0.6, duration: 0.8 } }
          }}
          className="mb-3 sm:mb-4"
        >
          <svg viewBox="0 0 40 40" width="36" height="36" fill="none" className="stroke-[#E8C36A]">
            <circle cx="20" cy="20" r="18" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M20 8 L20 32" strokeWidth="1" strokeLinecap="round" />
            <path d="M12 18 Q20 10 28 18" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="2" fill="#E8C36A" stroke="none" />
          </svg>
        </motion.div>

        {/* Intro */}
        <motion.p 
          variants={{
            hidden: { y: 15, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { delay: 0.7, duration: 0.6 } }
          }}
          className="text-[9px] sm:text-[11px] uppercase text-[#E2BF77] font-semibold mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '4px' }}
        >
          Together with their families
        </motion.p>
        
        <motion.p 
          variants={{
            hidden: { y: 15, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { delay: 0.8, duration: 0.6 } }
          }}
          className="text-[8px] sm:text-[10px] uppercase text-[#E2BF77]/80 font-medium mb-5 sm:mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '3px' }}
        >
          Joyfully Invite You To Celebrate The Wedding Of
        </motion.p>

        {/* Groom Name */}
        <motion.h1 
          variants={{
            hidden: { y: 20, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="text-[#E8C36A] font-light leading-none uppercase tracking-wider text-[46px] sm:text-[62px] lg:text-[76px]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {data.groomName || "Arjun"}
        </motion.h1>

        {/* Flanked Ampersand */}
        <motion.div 
          variants={{
            hidden: { scale: 0.7, opacity: 0 },
            show: { scale: 1, opacity: 1, transition: { delay: 1.05, duration: 0.6 } }
          }}
          className="flex items-center justify-center gap-3 my-2 sm:my-3 text-[#D6A24A]"
        >
          {/* Floral Sprig */}
          <svg viewBox="0 0 100 20" className="w-16 sm:w-20 text-[#D6A24A] opacity-70" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M10 10 C35 15, 65 5, 90 10" strokeLinecap="round" />
            <path d="M30 12 Q20 3 15 8 Q25 15 30 12 Z" fill="currentColor" opacity="0.4" />
            <path d="M50 10 Q45 1 40 5 Q48 11 50 10 Z" fill="currentColor" opacity="0.5" />
            <path d="M70 8 Q65 1 60 5 Q68 11 70 8 Z" fill="currentColor" opacity="0.6" />
            <circle cx="22" cy="11" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="82" cy="9" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span 
            className="text-[28px] sm:text-[36px] lg:text-[44px] font-normal italic lowercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            &amp;
          </span>
          <svg viewBox="0 0 100 20" className="w-16 sm:w-20 text-[#D6A24A] opacity-70 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M10 10 C35 15, 65 5, 90 10" strokeLinecap="round" />
            <path d="M30 12 Q20 3 15 8 Q25 15 30 12 Z" fill="currentColor" opacity="0.4" />
            <path d="M50 10 Q45 1 40 5 Q48 11 50 10 Z" fill="currentColor" opacity="0.5" />
            <path d="M70 8 Q65 1 60 5 Q68 11 70 8 Z" fill="currentColor" opacity="0.6" />
            <circle cx="22" cy="11" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="82" cy="9" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </motion.div>

        {/* Bride Name */}
        <motion.h1 
          variants={{
            hidden: { y: 20, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="text-[#E8C36A] font-light leading-none uppercase tracking-wider text-[46px] sm:text-[62px] lg:text-[76px] mb-6 sm:mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {data.brideName || "Meera"}
        </motion.h1>

        {/* Date Line */}
        <motion.div 
          variants={{
            hidden: { y: 15, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { delay: 1.4, duration: 0.8 } }
          }}
          className="flex flex-col items-center gap-2"
        >
          <div 
            className="text-[#E8C36A] flex items-center justify-center gap-3 font-semibold text-[11px] sm:text-[13px]"
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '4px' }}
          >
            <span>{dateParts.day}</span>
            <span className="text-[#D6A24A]/40">|</span>
            <span>{dateParts.month}</span>
            <span className="text-[#D6A24A]/40">|</span>
            <span>{dateParts.year}</span>
          </div>
          
          <p 
            className="text-[9px] sm:text-[11px] uppercase text-[#E2BF77] font-medium tracking-[3px]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            At Six O'clock In The Evening
          </p>
          
          {/* Venue Line */}
          <p 
            className="text-[10px] sm:text-[12px] uppercase text-[#E8C36A] font-semibold tracking-[2px] mt-2 max-w-[280px] sm:max-w-md"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {data.venueName}
            <span className="block text-[9px] sm:text-[10px] text-[#E2BF77] font-medium mt-1">{data.venueCity}</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Palace illustration rising gently from bottom */}
      <motion.div 
        variants={{
          hidden: { y: 120, opacity: 0 },
          show: { y: 0, opacity: 1, transition: { delay: 1.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
        }}
        initial="hidden"
        animate="show"
        className="absolute bottom-0 w-[110%] sm:w-[95%] lg:w-[80%] max-w-[1200px] z-10 pointer-events-none"
      >
        <svg 
          viewBox="0 0 1200 400" 
          className="w-full text-[#D6A24A]/25 pointer-events-none" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M 0 380 L 1200 380" strokeWidth="3" />
          <path d="M 520 380 V 220 C 520 160, 550 130, 600 130 C 650 130, 680 160, 680 220 V 380" />
          <path d="M 550 380 V 250 Q 600 200 650 250 V 380" />
          <path d="M 600 130 V 90" strokeWidth="2" />
          <circle cx="600" cy="90" r="3" fill="currentColor" />
          <circle cx="600" cy="105" r="5" fill="currentColor" />
          <path d="M 570 380 Q 600 340 630 380" strokeWidth="2" />
          <path d="M 360 380 V 260 C 360 210, 390 190, 420 190 C 450 190, 480 210, 480 260 V 380" />
          <path d="M 420 190 V 160" />
          <circle cx="420" cy="160" r="2" fill="currentColor" />
          <path d="M 390 380 Q 420 345 450 380" />
          <path d="M 720 380 V 260 C 720 210, 750 190, 780 190 C 810 190, 840 210, 840 260 V 380" />
          <path d="M 780 190 V 160" />
          <circle cx="780" cy="160" r="2" fill="currentColor" />
          <path d="M 750 380 Q 780 345 810 380" />
          <path d="M 240 380 V 180 H 280 V 380" />
          <path d="M 230 180 H 290" />
          <path d="M 240 180 C 240 150, 260 140, 260 140 C 260 140, 280 150, 280 180" fill="currentColor" opacity="0.2" />
          <path d="M 260 140 V 120" />
          <path d="M 920 380 V 180 H 960 V 380" />
          <path d="M 910 180 H 970" />
          <path d="M 920 180 C 920 150, 940 140, 940 140 C 940 140, 960 150, 960 180" fill="currentColor" opacity="0.2" />
          <path d="M 940 140 V 120" />
          <path d="M 120 380 V 220 H 150 V 380" />
          <path d="M 1050 380 V 220 H 1080 V 380" />
          <path d="M 150 320 H 240 M 280 320 H 360 M 480 320 H 520 M 680 320 H 720 M 840 320 H 920 M 960 320 H 1050" strokeDasharray="4,4" />
        </svg>
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
