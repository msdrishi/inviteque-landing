import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import Countdown from '../components/Countdown.jsx'
import Events from '../components/Events.jsx'
import Footer from '../components/Footer.jsx'
import { weddingData as staticData } from '../weddingData.js'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// Local Theme Assets
import heroBg from '../assets/themes/template3/hero_bg.png'
import messageBg from '../assets/themes/template3/message_bg.png'
import venueBg from '../assets/themes/template3/venue_bg.png'
import desktopBg from '../assets/themes/template3/desktop_bg.png'

export default function TemplateRoyalPalace({ savedData }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  // Watermark is shown unless paid
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid

  // Determine active dataset
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
      addressParts: savedData
        ? [savedData.venueData.mahalName, savedData.venueData.venueAddress, savedData.venueData.venueCity, savedData.venueData.state].filter(Boolean)
        : [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean),
      fullAddress: savedData
        ? [savedData.venueData.mahalName, savedData.venueData.venueAddress, savedData.venueData.venueCity, savedData.venueData.state].filter(Boolean).join(', ')
        : [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean).join(', '),
      mapUrl: savedData ? savedData.venueData.mapLink : draftData.mapLink,
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
        return isNaN(d.getTime()) ? 'Saturday' : d.toLocaleDateString('en-US', { weekday: 'long' })
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
          : staticData.story.items
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
  } : staticData

  const showGallery = savedData ? savedData.scheduleData?.showGallery : draftData.showGallery
  const showSchedule = savedData ? savedData.scheduleData?.showSchedule : draftData.showSchedule

  return (
    <div 
      className="flex justify-center items-start min-h-screen bg-[#3A0007] bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${desktopBg})` }}
    >
      <div className="relative w-full max-w-[430px] min-h-[100svh] bg-[#7A0010] text-[#EAD8B1] shadow-[0_0_85px_rgba(0,0,0,0.85)] overflow-hidden font-serif">
        
        {/* Watermark Overlay for Unpaid Previews */}
        {showWatermark && (
          <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.35] select-none">
            <span className="absolute top-[8%] left-1/2 -translate-x-1/2 text-[18px] font-bold tracking-[0.25em] text-[#D4AF37] font-sans">
              PREVIEW-INVITEQUE
            </span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] font-bold tracking-[0.25em] text-[#D4AF37] font-sans">
              PREVIEW-INVITEQUE
            </span>
            <span className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[18px] font-bold tracking-[0.25em] text-[#D4AF37] font-sans">
              PREVIEW-INVITEQUE
            </span>
          </div>
        )}

        {/* Action Buttons for Preview State */}
        {isPreview && (
          <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#3A0007] py-3.5 text-xs font-bold text-[#EAD8B1] shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition hover:scale-105 active:scale-95"
              >
                ← Back
              </button>
              <button
                onClick={() => navigate('/payment', { state: { draftData, templateId } })}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] py-3.5 text-xs font-bold text-black shadow-[0_20px_50px_rgba(212,175,87,0.4)] transition hover:scale-105 active:scale-95"
              >
                Proceed →
              </button>
            </div>
          </div>
        )}

        {/* ── SECTION 1: HERO ── */}
        <RoyalPalaceHero data={data.hero} />

        {/* ── SECTION 2: PHOTO STORY (Diagonal slide out) ── */}
        {showGallery && <RoyalPalaceStory data={data.story} />}

        {/* ── SECTION 3: HEART MESSAGE (Palace arch theme) ── */}
        <RoyalPalaceMessage data={data.invitation} />

        {/* ── SECTION 4: LOCATION / VENUE (Animated Map compass/pin & QR code) ── */}
        <RoyalPalaceVenue data={data.venue} />

        {/* ── SECTION 5: TIMELINE SCHEDULE ── */}
        {showSchedule && (
          <div className="bg-[#7A0010] py-6 border-b border-[#D4AF37]/15">
            <Events data={data.events} theme="red" />
          </div>
        )}

        {/* ── SECTION 6: COUNTDOWN ── */}
        <RoyalPalaceCountdown data={data.countdown} />

        {/* ── SECTION 7: FOOTER ── */}
        <Footer data={data.footer} theme="red" />
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   1. HERO COMPONENT
   ────────────────────────────────────────────────────────────────────────── */
function RoyalPalaceHero({ data }) {
  // Parsing date values
  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      return { day: parts[0], month: parts[1], year: parts[2] }
    }
    return { day: '22', month: 'October', year: '2026' }
  }, [data.dateLine])

  return (
    <section 
      className="relative min-h-[100svh] flex flex-col items-center justify-between text-center py-14 px-6 overflow-hidden bg-cover bg-top"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Border overlay */}
      <div className="absolute inset-4 border border-[#D4AF37]/20 pointer-events-none z-10" />

      {/* Invitation Header Text */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-20 w-full mt-6"
      >
        <p className="font-sans text-[8.5px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold mb-1">
          Together with their families
        </p>
        <p className="font-sans text-[8.5px] uppercase tracking-[0.25em] text-[#EAD8B1]/90">
          Request the pleasure of your company
        </p>
      </motion.div>

      {/* Couple Names - Luxury Letter Reveal */}
      <div className="relative z-20 my-auto py-8">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-normal tracking-[0.04em] uppercase text-[#D4AF37] flex flex-col items-center"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span className="block relative">
            {data.groomName}
            {/* Elegant Shine overlay */}
            <motion.span
              animate={{ backgroundPosition: ['150% center', '-150% center'] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              aria-hidden="true"
            >
              {data.groomName}
            </motion.span>
          </span>

          <span className="block my-2 text-2xl font-normal font-parisienne lowercase text-[#EAD8B1]/85">&amp;</span>

          <span className="block relative">
            {data.brideName}
            <motion.span
              animate={{ backgroundPosition: ['150% center', '-150% center'] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear', delay: 3 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              aria-hidden="true"
            >
              {data.brideName}
            </motion.span>
          </span>
        </motion.h1>

        {/* Premium Divider */}
        <div className="flex items-center justify-center gap-3 mt-4 opacity-50">
          <div className="h-[0.7px] bg-[#D4AF37] w-8" />
          <span className="text-[#D4AF37] text-xs">✦</span>
          <div className="h-[0.7px] bg-[#D4AF37] w-8" />
        </div>
      </div>

      {/* Date & Time Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        className="relative z-20 w-full mb-6"
      >
        <p className="text-sm tracking-[0.2em] text-[#EAD8B1] font-medium" style={{ fontFamily: "'Cinzel', serif" }}>
          {data.dayOfWeek.toUpperCase()}, {dateParts.month.toUpperCase()} {dateParts.day}
        </p>
        <p className="text-xs tracking-[0.15em] text-[#EAD8B1]/80 mt-1 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
          {data.weddingTime}
        </p>

        <p className="font-sans text-[8.5px] uppercase tracking-[0.25em] text-[#D4AF37] mt-3.5 font-bold">
          {data.venueName}
        </p>
        <p className="font-sans text-[7.5px] uppercase tracking-[0.2em] text-[#EAD8B1]/80 mt-0.5">
          {data.venueCity}
        </p>
      </motion.div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   2. PHOTO STORY COMPONENT (Diagonal Reveal)
   ────────────────────────────────────────────────────────────────────────── */
function RoyalPalaceStory({ data }) {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3
  })

  // Animation values to slide left/right cards diagonally out from behind center card
  const leftX = useTransform(smoothProgress, [0.1, 0.9], ['0px', '-110px'])
  const leftY = useTransform(smoothProgress, [0.1, 0.9], ['0px', '22px'])
  const leftRot = useTransform(smoothProgress, [0.1, 0.9], [0, -11])
  const leftScale = useTransform(smoothProgress, [0.1, 0.9], [0.94, 0.98])

  const rightX = useTransform(smoothProgress, [0.1, 0.9], ['0px', '110px'])
  const rightY = useTransform(smoothProgress, [0.1, 0.9], ['0px', '22px'])
  const rightRot = useTransform(smoothProgress, [0.1, 0.9], [0, 11])
  const rightScale = useTransform(smoothProgress, [0.1, 0.9], [0.94, 0.98])

  const centerScale = useTransform(smoothProgress, [0.1, 0.9], [1.0, 1.05])

  const items = (data?.items || []).slice(0, 3)
  if (items.length === 0) return null

  return (
    <div ref={containerRef} className="relative w-full h-[200vh] bg-[#5A000A]">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-cover bg-center">
        {/* Subtle background red mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3A0007]/50 via-transparent to-[#3A0007]/50" />

        <div className="absolute top-[10%] text-center px-4 z-10">
          <h2 className="text-[#D4AF37] text-lg tracking-[0.25em] uppercase font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
            Our Love Story
          </h2>
          <p className="text-[10px] text-[#EAD8B1]/70 uppercase tracking-[0.2em] mt-1 font-sans">
            Capturing the beautiful path together
          </p>
        </div>

        {/* Diagonal Photo Stack Viewport */}
        <div className="relative w-full max-w-[360px] h-[320px] flex items-center justify-center mt-8">
          
          {/* Card 2 (Left photo card) */}
          {items[1] && (
            <motion.div
              style={{
                x: leftX,
                y: leftY,
                rotate: leftRot,
                scale: leftScale,
                zIndex: 10,
              }}
              className="absolute w-[180px] h-[240px] bg-[#2E0004] p-2.5 rounded shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-[#D4AF37]/20 flex flex-col"
            >
              <div className="w-full h-full overflow-hidden border border-[#D4AF37]/15">
                <img src={items[1].image} alt="Moment Left" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          )}

          {/* Card 3 (Right photo card) */}
          {items[2] && (
            <motion.div
              style={{
                x: rightX,
                y: rightY,
                rotate: rightRot,
                scale: rightScale,
                zIndex: 10,
              }}
              className="absolute w-[180px] h-[240px] bg-[#2E0004] p-2.5 rounded shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-[#D4AF37]/20 flex flex-col"
            >
              <div className="w-full h-full overflow-hidden border border-[#D4AF37]/15">
                <img src={items[2].image} alt="Moment Right" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          )}

          {/* Card 1 (Center upright photo card, stays on top) */}
          {items[0] && (
            <motion.div
              style={{
                scale: centerScale,
                zIndex: 20,
              }}
              className="absolute w-[190px] h-[250px] bg-[#1a0002] p-2.5 rounded shadow-[0_20px_45px_rgba(0,0,0,0.65)] border border-[#D4AF37]/35 flex flex-col"
            >
              <div className="w-full h-full overflow-hidden border border-[#D4AF37]/25">
                <img src={items[0].image} alt="Moment Center" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          )}

        </div>

        <div className="absolute bottom-[10%] text-center px-6">
          <p className="text-[11px] tracking-[0.1em] text-[#EAD8B1]/80 italic max-w-[280px]">
            "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day."
          </p>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   3. MESSAGE COMPONENT
   ────────────────────────────────────────────────────────────────────────── */
function RoyalPalaceMessage({ data }) {
  return (
    <section 
      className="relative min-h-[100svh] flex flex-col items-center justify-center py-20 px-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${messageBg})` }}
    >
      {/* Symmetrical Arch content */}
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0 }}
        className="max-w-[280px] text-center mt-6 flex flex-col items-center"
      >
        <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#8B0000] font-bold">
          A Message From Our Hearts
        </p>

        <div className="w-8 h-[1px] bg-[#8B0000]/30 my-3" />

        <h3 className="font-parisienne text-3xl text-[#5C0A14] font-semibold my-2">
          Dearest Friends &amp; Family,
        </h3>

        <p className="text-[11px] sm:text-xs text-[#2E0004]/90 font-serif leading-relaxed tracking-[0.03em] mt-3">
          Two hearts, two families, one love. We joyfully invite you to celebrate the beginning of our forever. Your presence will make our special day even more memorable.
        </p>

        <p className="text-[11px] sm:text-xs text-[#2E0004]/90 font-serif leading-relaxed tracking-[0.03em] mt-3.5 font-semibold">
          We can't wait to celebrate with you!
        </p>

        <div className="flex items-center gap-1.5 mt-6 opacity-60">
          <div className="w-1 h-1 rotate-45 bg-[#8B0000]"></div>
          <span className="text-[9px] text-[#8B0000]">❦</span>
          <div className="w-1 h-1 rotate-45 bg-[#8B0000]"></div>
        </div>
      </motion.div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   4. VENUE COMPONENT (Compass / QR Code Map Interaction)
   ────────────────────────────────────────────────────────────────────────── */
function RoyalPalaceVenue({ data }) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=d4af37&bgcolor=2e0004&data=${encodeURIComponent(data.mapUrl || 'https://maps.google.com')}`

  return (
    <section 
      className="relative min-h-[100svh] flex flex-col items-center justify-between py-16 px-6 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${venueBg})` }}
    >
      <div className="absolute inset-4 border border-[#D4AF37]/20 pointer-events-none z-10" />

      {/* Section Title */}
      <div className="relative z-20 text-center w-full mt-6">
        <h2 className="text-[#D4AF37] text-lg tracking-[0.25em] uppercase font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
          Venue Details
        </h2>
        <div className="w-12 h-[0.7px] bg-[#D4AF37]/40 mx-auto mt-2" />
      </div>

      {/* Stylized Location Card Mockup */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="w-full max-w-[360px] bg-[#2E0004]/90 border border-[#D4AF37]/35 p-6 rounded-none shadow-[0_20px_45px_rgba(0,0,0,0.65)] relative z-20 flex flex-col items-center text-center my-auto"
      >
        {/* Pulsing Location Pin Mockup */}
        <div className="relative w-12 h-12 flex items-center justify-center mb-4">
          <motion.div 
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40"
          />
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#D4AF37;" strokeWidth="1.6" className="relative z-10">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        {/* Address Info */}
        <h3 className="text-base font-bold text-[#D4AF37] tracking-[0.05em] uppercase mb-2">
          {data.venueName}
        </h3>
        <p className="text-xs text-[#EAD8B1]/90 leading-relaxed font-sans max-w-[280px]">
          {data.location}
        </p>

        {/* Ornate Gold line divider */}
        <div className="w-24 h-[0.8px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent my-5" />

        {/* Animated Scan Line QR Code Box */}
        <div className="flex flex-col items-center">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#EAD8B1]/70 mb-3 font-sans">
            Scan to Open in Google Maps
          </p>

          <div className="relative w-[150px] h-[150px] bg-[#1a0002] border border-[#D4AF37]/25 p-2 rounded shadow-inner overflow-hidden">
            {/* Scan animation line */}
            <motion.div 
              animate={{ top: ['0%', '98%', '0%'] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_8px_#D4AF37] z-20"
            />
            
            <img 
              src={qrCodeUrl} 
              alt="Google Maps QR Code" 
              className="w-full h-full object-contain relative z-10 rounded-sm opacity-90 hover:opacity-100 transition" 
            />
          </div>
        </div>

        <a 
          href={data.mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-none border border-[#D4AF37]/50 bg-[#1a0002] text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em] shadow-lg transition duration-300 hover:bg-[#D4AF37] hover:text-black hover:border-transparent active:scale-95"
        >
          View on Map 🗺️
        </a>
      </motion.div>

      {/* Decorative Spacer */}
      <div className="w-full relative z-20 h-4" />
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   6. COUNTDOWN COMPONENT
   ────────────────────────────────────────────────────────────────────────── */
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
    <section className="bg-[#5A000A] py-20 px-6 border-b border-[#D4AF37]/15 relative text-center">
      {/* Small design patterns */}
      <div className="absolute top-4 left-4 text-[#D4AF37]/15 text-lg">✦</div>
      <div className="absolute top-4 right-4 text-[#D4AF37]/15 text-lg">✦</div>

      <h2 className="text-[#D4AF37] text-base tracking-[0.25em] uppercase font-bold mb-8" style={{ fontFamily: "'Cinzel', serif" }}>
        Countdown to Our Big Day
      </h2>

      {/* Counter Grid Layout */}
      <div className="grid grid-cols-4 gap-2.5 max-w-[340px] mx-auto">
        {[
          { label: 'Days', val: timeLeft.days },
          { label: 'Hours', val: timeLeft.hours },
          { label: 'Mins', val: timeLeft.minutes },
          { label: 'Secs', val: timeLeft.seconds }
        ].map((unit, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col items-center bg-[#2E0004] border border-[#D4AF37]/25 p-3 rounded shadow-md"
          >
            <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] tracking-[0.02em] font-mono leading-none">
              {unit.val}
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.18em] text-[#EAD8B1]/70 mt-2 font-sans font-semibold">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
