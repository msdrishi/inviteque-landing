import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer.jsx'
import { weddingData as staticData } from '../weddingData.js'
import WaterRevealImage from '../components/WaterRevealImage.jsx'

// Backgrounds (Cloudinary CDN with auto-format WebP)
const bgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600526/house-warming-hw1/hw1-hero-desktop.png"
const heroMobileBg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600529/house-warming-hw1/hw1-hero-mobile.png"

const welcomeBgMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600536/house-warming-hw1/hw1-welcome-house-warming.png"
const welcomeBgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600532/house-warming-hw1/hw1-welcome-desktop.png"

const locationBgMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600544/house-warming-hw1/hw1-location-mobile.png"
const locationBgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600540/house-warming-hw1/hw1-location-desktop.png"

const scheduleBgMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600556/house-warming-hw1/hw1-schedule.png"
const scheduleBgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600550/house-warming-hw1/hw1-schedule-desktop.png"

const countdownBgMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600570/house-warming-hw1/hw1-countdown.png"
const countdownBgDesktop = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600563/house-warming-hw1/hw1-count-desktop.png"
const scissorPng = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600573/house-warming-hw1/hw1-scissor.png"
const ribbonPng = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786600576/house-warming-hw1/hw1-ribbon.png"

// Slow staggered animation variants (hero section)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.7, // Very slow staggered entry line by line
      delayChildren: 0.4,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

// Line by line scroll trigger animation variants (all sections)
const scrollContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.45,
      delayChildren: 0.3
    }
  }
}

const scrollItemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.6, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
}

export default function TemplateModernHearth({ savedData }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  // Watermark status
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid

  // Ribbon cut state
  const [isRibbonCut, setIsRibbonCut] = useState(false)
  const [showRibbonOverlay, setShowRibbonOverlay] = useState(true)

  // Active data selection
  const activeData = savedData || (isPreview ? draftData : null)

  const showFamilySection = activeData 
    ? (activeData.showFamilySection !== undefined ? activeData.showFamilySection : activeData.invitationData?.showFamilySection)
    : true // Default to true for static template preview URL
  const showSchedule = activeData
    ? (activeData.showSchedule !== undefined 
        ? activeData.showSchedule 
        : (activeData.scheduleData?.showSchedule !== undefined 
            ? activeData.scheduleData.showSchedule 
            : activeData.invitationData?.showSchedule))
    : true // Default to true for static template preview URL
  const familyMessage = activeData 
    ? (activeData.familyMessage || activeData.invitationData?.familyMessage)
    : ''
  const familyPhoto = activeData 
    ? (activeData.familyPhoto || activeData.invitationData?.familyPhoto)
    : null

  const data = useMemo(() => {
    if (!activeData) return staticData

    // Build date string
    const dateStr = savedData
      ? `${savedData.heroData?.weddingDate || '11'} ${savedData.heroData?.weddingMonth || 'June'} ${savedData.heroData?.weddingYear || '2024'}`
      : `${draftData.weddingDate || '11'} ${draftData.weddingMonth || 'June'} ${draftData.weddingYear || '2024'}`

    const timeStr = savedData
      ? (savedData.heroData?.weddingTime || '9:00 AM')
      : (draftData.weddingTime || '9:00 AM')

    // For house warming: groomName = function title (e.g. "House Warming")
    const functionTitle = savedData
      ? (savedData.coupleData?.groomName || 'House Warming')
      : (draftData.groomName || 'House Warming')

    const hostName = savedData
      ? (savedData.coupleData?.groomName && savedData.coupleData?.brideName 
          ? `${savedData.coupleData.groomName} & ${savedData.coupleData.brideName}`
          : savedData.coupleData?.groomName || 'The Family')
      : (draftData.groomName && draftData.brideName
          ? `${draftData.groomName} & ${draftData.brideName}`
          : draftData.groomName || 'The Family')

    const houseName = (savedData ? (savedData.venueData?.mahalName || savedData.venueData?.venueName || savedData.heroData?.houseName || savedData.coupleData?.houseName) : (draftData.mahalName || draftData.venueName || draftData.houseName)) || 'Karthik Nest'

    const fullAddress = savedData
      ? [
          savedData.venueData?.venueAddress || savedData.venueName,
          savedData.venueData?.venueCity || savedData.venueCity,
          savedData.venueData?.state || savedData.state
        ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
      : [
          draftData.venueAddress,
          draftData.venueCity,
          draftData.state
        ].map(s => String(s || '').trim()).filter(Boolean).join(', ')

    // Build schedule/events items from saved or draft data
    const scheduleItems = savedData
      ? (savedData.scheduleData?.items || savedData.scheduleItems || [])
      : (draftData.scheduleItems || [])

    const eventsData = scheduleItems.length > 0
      ? {
          id: 'schedule',
          title: 'Ceremony Schedule',
          items: scheduleItems.map((s, index) => {
            const titleText = String(s.title || s.name || '').toLowerCase();
            let icon = '✦';
            if (titleText.includes('house') || titleText.includes('pooja') || titleText.includes('homam') || titleText.includes('ceremony') || titleText.includes('nest') || titleText.includes('warming')) {
              icon = '🏡';
            } else if (titleText.includes('food') || titleText.includes('lunch') || titleText.includes('dinner') || titleText.includes('feast') || titleText.includes('reception') || titleText.includes('vows') || titleText.includes('meal')) {
              icon = '🍛';
            } else {
              icon = ['🏡', '🍛', '✦', '◎', '✿', '◆', '♪'][index % 7];
            }
            return {
              icon,
              time: s.time,
              name: s.title || s.name,
              date: s.date,
            };
          })
        }
      : staticData.events

    // Build countdown from actual ceremony date
    const targetDate = savedData
      ? `${savedData.heroData?.weddingMonth || 'June'} ${savedData.heroData?.weddingDate || '1'}, ${savedData.heroData?.weddingYear || '2026'}`
      : `${draftData.weddingMonth || 'June'} ${draftData.weddingDate || '1'}, ${draftData.weddingYear || '2026'}`

    const countdownData = {
      ...staticData.countdown,
      targetDateTimeISO: new Date(targetDate).toISOString(),
    }

    return {
      ...staticData,
      hero: {
        functionTitle,
        hostName,
        houseName,
        dateLine: dateStr,
        weddingTime: timeStr,
        fullAddress: fullAddress || 'Karthik Nest, Sunflower Layout, Bengaluru, KA',
        mapUrl: savedData ? (savedData.venueData?.mapLink || savedData.mapLink) : draftData.mapLink,
      },
      events: eventsData,
      countdown: countdownData,
      venue: {
        ...staticData.venue,
        venueName: houseName || 'Our New Home',
        venueLine1: fullAddress || 'Karthik Nest, Sunflower Layout, Bengaluru, KA',
        mapLink: savedData ? (savedData.venueData?.mapLink || savedData.mapLink) : draftData.mapLink,
      }
    }
  }, [activeData, savedData, draftData])

  return (
    <div className="relative min-h-screen w-full bg-[#FBF3DE] font-saas text-[#6B351D] overflow-x-hidden">
      
      {/* Shared Root Background Images (Seamless Blur & Zoom) */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-[100svh] overflow-hidden">
        <img 
          src={heroMobileBg} 
          alt="" 
          className="xl:hidden w-full h-full object-cover" 
          style={{ 
            filter: isRibbonCut ? 'blur(0px)' : 'blur(8px)', 
            transform: isRibbonCut ? 'scale(1.24)' : 'scale(1.15)', 
            transformOrigin: 'top center', 
            transition: 'filter 3.5s ease-out, transform 4.5s cubic-bezier(0.16, 1, 0.3, 1)' 
          }} 
        />
        <img 
          src={bgDesktop} 
          alt="" 
          className="hidden xl:block w-full h-full object-cover" 
          style={{ 
            filter: isRibbonCut ? 'blur(0px)' : 'blur(8px)', 
            transform: isRibbonCut ? 'scale(1.18)' : 'scale(1.1)', 
            transformOrigin: 'top center', 
            transition: 'filter 3.5s ease-out, transform 4.5s cubic-bezier(0.16, 1, 0.3, 1)' 
          }} 
        />
      </div>

      {/* Ribbon Cutting Welcome Overlay */}
      <AnimatePresence>
        {showRibbonOverlay && (
          <RibbonOverlay 
            onCutComplete={() => {
              setIsRibbonCut(true)
              setTimeout(() => setShowRibbonOverlay(false), 800)
            }} 
          />
        )}
      </AnimatePresence>

      {/* Main Content (Revealed after cut, scrollable with fade-in animation) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isRibbonCut ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className={isRibbonCut ? 'relative z-10' : 'relative z-10 h-screen overflow-hidden'}
      >
        
        {/* Hero Section */}
        <section className="relative w-full h-[100svh] overflow-hidden flex flex-col items-center">

          {/* MOBILE LAYOUT FLOW */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView={isRibbonCut ? "show" : "hidden"}
            viewport={{ once: false, amount: 0.35 }}
            className="xl:hidden relative z-10 w-full flex flex-col items-center text-center px-5 pt-[32%] md:pt-[22%] space-y-1 md:space-y-2"
          >
            <motion.p variants={itemVariants} className="text-[10px] sm:text-[12px] md:text-[16px] md:tracking-[0.15em] font-semibold tracking-widest text-[#456B2B] uppercase mb-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              You are warmly invited to our
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-[#6B351D] select-none leading-[1.1] w-[85%] mb-0.5 text-[38px] sm:text-6xl md:text-[72px] font-bold font-heading" style={{ fontFamily: "'Priestacy', serif" }}>
              {data.hero.functionTitle || 'House Warming'}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-[18px] sm:text-[28px] md:text-[40px] text-[#B77A16] font-bold select-none leading-none mb-1 font-heading !mt-8 md:!mt-14" style={{ fontFamily: "'PrimorStylish', serif" }}>
              {data.hero.houseName || 'Karthik Nest'}
            </motion.p>
            <motion.p variants={itemVariants} className="text-[11px] sm:text-[13px] md:text-[18px] leading-relaxed max-w-[280px] md:max-w-[480px] text-[#776653] font-medium px-2 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Please join us in celebrating our new home with love and blessings.
            </motion.p>
            
            {/* Date + Time section with SVG icons */}
            <motion.div variants={itemVariants} className="w-full max-w-[290px] md:max-w-[460px] text-[#6B351D] mt-0.5 py-2 md:py-3 border-t border-b border-[#D3A34A]/30 flex items-center justify-between text-[10px] sm:text-xs md:text-[16px] !mt-4 md:!mt-8" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              <div className="w-[45%] flex items-center justify-center gap-1 md:gap-2 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#B77A16] flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>{data.hero.dateLine}</span>
              </div>
              <div className="w-[1px] h-5 md:h-6 bg-[#D3A34A]/30" />
              <div className="w-[45%] flex items-center justify-center gap-1 md:gap-2 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#B77A16] flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>{data.hero.weddingTime}</span>
              </div>
            </motion.div>
            
            {/* Address directly inside mobile hero flow with SVG location icon */}
            <motion.div variants={itemVariants} className="text-[10px] sm:text-[12px] md:text-[16px] font-semibold text-[#6B351D]/90 max-w-[270px] md:max-w-[480px] leading-relaxed flex items-center justify-center gap-1 !mt-2 md:!mt-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#B77A16] flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{data.hero.fullAddress}</span>
            </motion.div>
          </motion.div>

          {/* DESKTOP LAYOUT */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView={isRibbonCut ? "show" : "hidden"}
            viewport={{ once: false, amount: 0.35 }}
            className="hidden xl:flex absolute top-[55%] -translate-y-1/2 left-[18%] w-[min(44vw,520px)] flex-col items-center text-center z-10 space-y-6"
          >
            <motion.p variants={itemVariants} className="text-[0.8vw] xl:text-[0.7vw] font-semibold tracking-widest text-[#456B2B] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              You are warmly invited to our
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-[3.8vw] xl:text-[3.2vw] text-[#6B351D] font-bold my-1 drop-shadow-sm select-none leading-none font-heading" style={{ fontFamily: "'Priestacy', serif" }}>
              {data.hero.functionTitle || 'House Warming'}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-[2.6vw] xl:text-[2.2vw] text-[#B77A16] font-bold mb-2 drop-shadow-sm select-none leading-none font-heading" style={{ fontFamily: "'PrimorStylish', serif", marginTop: '64px' }}>
              {data.hero.houseName || 'Karthik Nest'}
            </motion.p>
            <motion.p variants={itemVariants} className="text-[0.9vw] xl:text-[0.8vw] leading-relaxed max-w-[420px] text-[#776653] font-medium mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Please join us in celebrating our new home with love and blessings.
            </motion.p>
            
            {/* Date + Time layout with SVG icons */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 text-[1vw] xl:text-[0.9vw] font-semibold border-t border-b border-[#D3A34A]/30 py-2 w-full" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[1.2vw] h-[1.2vw] text-[#B77A16] flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>{data.hero.dateLine}</span>
              </div>
              <span className="opacity-40">|</span>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[1.2vw] h-[1.2vw] text-[#B77A16] flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>{data.hero.weddingTime}</span>
              </div>
            </motion.div>
            
            {/* Address with SVG location icon */}
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 mt-4 pt-3 w-full" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <span className="text-[1vw] xl:text-[0.9vw] font-semibold tracking-wide text-[#6B351D] text-center leading-relaxed max-w-[420px] flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[1.3vw] h-[1.3vw] text-[#B77A16] flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {data.hero.fullAddress}
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* Family Section */}
        {showFamilySection && (
          <>
            <div className="xl:hidden">
              <HW1FamilySection message={familyMessage} photo={familyPhoto} bgImage={scheduleBgMobile} />
            </div>
            <div className="hidden xl:block">
              <HW1FamilySection message={familyMessage} photo={familyPhoto} bgImage={scheduleBgDesktop} isDesktop={true} />
            </div>
          </>
        )}

        {/* Welcome Section (Clean Backgrounds with color reveal & falling flowers) */}
        <section className="xl:hidden relative overflow-hidden min-h-[100svh]">
          <img src={welcomeBgMobile} alt="Welcome Mobile" className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none" />
          <FallingFlowers />
        </section>
        <section className="hidden xl:block relative overflow-hidden min-h-[100svh]">
          <img src={welcomeBgDesktop} alt="Welcome Desktop" className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none" />
          <FallingFlowers />
        </section>

        {/* Timing Section */}
        {showSchedule && (
          <>
            <div className="xl:hidden">
              <HW1Events data={data.events} bgImage={scheduleBgMobile} noOverlay={true} />
            </div>
            <div className="hidden xl:block">
              <HW1Events data={data.events} bgImage={scheduleBgDesktop} noOverlay={true} isDesktop={true} />
            </div>
          </>
        )}

        {/* Location Section */}
        <div className="xl:hidden">
          <HW1Venue data={data.venue} bgImage={locationBgMobile} />
        </div>
        <div className="hidden xl:block">
          <HW1Venue data={data.venue} bgImage={locationBgDesktop} isDesktop={true} />
        </div>

        {/* Countdown Section */}
        <div className="xl:hidden">
          <HW1Countdown data={data.countdown} bgImage={countdownBgMobile} style={{ minHeight: '100svh' }} />
        </div>
        <div className="hidden xl:block w-full">
          <HW1Countdown data={data.countdown} isDesktop={true} bgImage={countdownBgDesktop} style={{ minHeight: '100svh', aspectRatio: 'auto' }} />
        </div>

        {/* Footer */}
        <Footer data={data.footer} showWatermark={showWatermark} />
      </motion.div>

      {/* Fixed Watermark Overlay for Unpaid Previews */}
      {showWatermark && (
        <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.3] select-none">
          <span className="absolute top-[8%] left-1/2 -translate-x-1/2 text-[18px] font-bold tracking-[0.25em] text-[#B77A16] font-sans">
            PREVIEW-INVITEQUE
          </span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] font-bold tracking-[0.25em] text-[#B77A16] font-sans">
            PREVIEW-INVITEQUE
          </span>
          <span className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[18px] font-bold tracking-[0.25em] text-[#B77A16] font-sans">
            PREVIEW-INVITEQUE
          </span>
        </div>
      )}

      {/* Preview Action Buttons */}
      {isPreview && (
        <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#D3A34A]/35 bg-[#6B351D] py-3.5 text-xs font-bold text-[#FBF3DE] shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition hover:scale-105 active:scale-95"
            >
              ← Back
            </button>
            <button
              onClick={() => navigate('/payment', { state: { draftData, templateId: templateId || 'modernhearth' } })}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#D3A34A] py-3.5 text-xs font-bold text-[#3D2208] shadow-[0_20px_50px_rgba(211,163,74,0.4)] transition hover:scale-105 active:scale-95"
            >
              Proceed →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   FLOWER FALLING EFFECT (Slow, natural marigold petals)
   ========================================================================== */
function FallingFlowers() {
  const petals = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const left = Math.random() * 100
      const duration = 7 + Math.random() * 6
      const delay = Math.random() * 5
      const size = 12 + Math.random() * 12
      const xSpan = Math.random() * 80 - 40
      return { left, duration, delay, size, xSpan }
    })
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden w-full h-full">
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size,
            opacity: 0.85,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.xSpan, p.xSpan * 1.5],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path d="M12 2 C16 10, 18 14, 12 22 C6 14, 8 10, 12 2 Z" fill="#E89118" />
            <circle cx="12" cy="12" r="3.5" fill="#B77A16" opacity="0.6" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

/* ==========================================================================
   RIBBON CUTTING INTERACTION SYSTEM
   ========================================================================== */
function RibbonOverlay({ onCutComplete }) {
  const [isCut, setIsCut] = useState(false)
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  // Confetti Physics simulation
  const triggerExplosion = (startX, startY) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const colors = ['#E89118', '#B77A16', '#456B2B', '#687A3B', '#B85C32', '#6B351D']

    // Create 100 colorful paper confetti particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.7) * 22 - 5,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.45,
        friction: 0.98
      })
    }

    let animId
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let active = false

      particles.forEach(p => {
        p.vx *= p.friction
        p.vy *= p.friction
        p.vy += p.gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        if (p.y < canvas.height + 20) {
          active = true
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          ctx.restore()
        }
      })

      if (active) {
        animId = requestAnimationFrame(update)
      }
    }
    update()
  }

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.2, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col justify-between items-center py-16 px-6 touch-none overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-40 pointer-events-none w-full h-full" />

      {/* Ribbon Track - Single stretched ribbon, split via clip-path */}
      <div className="absolute inset-y-1/2 top-1/2 -translate-y-1/2 h-[600px] xl:h-[800px] w-[150%] -left-[24%] xl:w-full xl:left-0 pointer-events-none z-30">
        {/* Left Half - full-width image clipped to left 50% */}
        <motion.div 
          initial={{ x: 0, y: 0, rotate: 0, skewY: 0, scaleX: 1 }}
          animate={isCut ? { 
            x: [0, '-15%', '-50%', '-85%', '-110%'],
            y: [0, '20vh', '55vh', '85vh', '110vh'],
            rotate: [0, 30, 60, 75, 85],
            skewY: [0, 22, -15, 8, 0],
            scaleX: [1, 0.94, 0.87, 0.91, 0.82],
            transition: { duration: 3.8, times: [0, 0.25, 0.5, 0.75, 1], ease: [0.25, 1, 0.5, 1] }
          } : {}}
          className="absolute inset-0"
          style={{ clipPath: 'inset(0 50% 0 0)', transformOrigin: 'left center', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))' }}
        >
          <img src={ribbonPng} alt="" className="w-full h-full" style={{ objectFit: 'fill' }} />
        </motion.div>

        {/* Right Half - full-width image clipped to right 50% */}
        <motion.div 
          initial={{ x: 0, y: 0, rotate: 0, skewY: 0, scaleX: 1 }}
          animate={isCut ? { 
            x: [0, '15%', '50%', '85%', '110%'],
            y: [0, '20vh', '55vh', '85vh', '110vh'],
            rotate: [0, -30, -60, -75, -85],
            skewY: [0, -22, 15, -8, 0],
            scaleX: [1, 0.94, 0.87, 0.91, 0.82],
            transition: { duration: 3.8, times: [0, 0.25, 0.5, 0.75, 1], ease: [0.25, 1, 0.5, 1] }
          } : {}}
          className="absolute inset-0"
          style={{ clipPath: 'inset(0 0 0 50%)', transformOrigin: 'right center', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))' }}
        >
          <img src={ribbonPng} alt="" className="w-full h-full" style={{ objectFit: 'fill' }} />
        </motion.div>
      </div>

      {/* Top Welcome Title */}
      {!isCut && (
        <div className="text-center mt-10 z-10">
          <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#456B2B] uppercase font-montserrat mb-1">
            Welcome to our celebration
          </p>
          <h2 className="font-heading text-[32px] sm:text-[38px] font-bold text-[#6B351D]" style={{ fontFamily: "'Priestacy', serif" }}>
            Sweet Home
          </h2>
          <p className="text-xs text-[#776653] font-medium mt-3 max-w-[280px] mx-auto leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Drag the scissor from the bottom to the red bow in the center to cut the ribbon and enter
          </p>
        </div>
      )}


      {/* Draggable Scissor Element (Repositioned to the bottom area) */}
      {!isCut && (
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.15}
          onDrag={(event, info) => {
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect()
              const ribbonY = rect.height / 2
              const scissorY = info.point.y - rect.top
              const scissorX = info.point.x - rect.left

              // If scissor touches the center bow area, slice the ribbon!
              if (Math.abs(scissorY - ribbonY) < 45 && Math.abs(scissorX - rect.width / 2) < 45) {
                setIsCut(true)
                onCutComplete()
                triggerExplosion(rect.width / 2, ribbonY)
              }
            }
          }}
          className="absolute z-50 w-24 h-24 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
          style={{ bottom: '15%', left: 'calc(50% - 48px)' }}
          whileHover={{ scale: 1.1 }}
          whileDrag={{ scale: 1.15 }}
        >
          <img src={scissorPng} alt="Scissor" className="w-[84px] h-[84px] drop-shadow-[0_6px_14px_rgba(0,0,0,0.3)] pointer-events-none" />
          <div className="absolute top-[-28px] whitespace-nowrap bg-[#6B351D] text-[#FFFDF5] text-[9px] px-2.5 py-0.5 rounded font-montserrat font-bold tracking-widest shadow-md border border-[#D3A34A]/30 animate-pulse">
            DRAG ME TO BOW
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

/* ==========================================================================
   INDEPENDENT LOCAL HELPERS FOR HOUSE WARMING TEMPLATE (Zero External Dependency)
   ========================================================================== */

// 1. HW1Events (Schedule)
function HW1Events({ data, isDesktop, bgImage, noOverlay }) {
  const items = data && data.items && data.items.length > 0
    ? data.items
    : [
        { name: "Housewarming Ceremony", time: "09:00 AM – 10:30 AM", icon: "🏡" },
        { name: "Food / Lunch / Dinner", time: "12:00 PM onwards", icon: "🍛" }
      ]
  const title = data && data.title ? data.title : 'Housewarming Timings'

  return (
    <section 
      className="w-full min-h-[100svh] px-6 pt-28 pb-20 relative flex flex-col items-center justify-start overflow-hidden"
      style={{ backgroundColor: '#FBF3DE' }}
    >
      {bgImage && (
        <>
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
          />
          {!noOverlay && <div className="absolute inset-0 bg-[#FBF3DE]/80 z-[1] pointer-events-none" />}
        </>
      )}
      
      <motion.div
        variants={scrollContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.35 }}
        className="flex flex-col items-center text-center z-10 mb-12"
      >
        <motion.p variants={scrollItemVariants} className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#456B2B] uppercase font-montserrat mb-1">
          Celebrating the Day
        </motion.p>
        <motion.h2 
          variants={scrollItemVariants} 
          className="text-[28px] sm:text-[36px] font-bold text-[#6B351D] tracking-wide uppercase"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {title}
        </motion.h2>
        <motion.div variants={scrollItemVariants} className="w-12 h-[1.5px] bg-[#B77A16]/30 mt-3" />
      </motion.div>

      <motion.div 
        variants={scrollContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.35 }}
        className="relative w-full max-w-[480px] mx-auto z-10 flex flex-col gap-6 px-2"
      >
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            variants={scrollItemVariants}
            className="flex items-center gap-4 bg-[#FFFDF5]/95 border border-[#D3A34A]/25 p-5 rounded-2xl shadow-[0_6px_20px_rgba(80,50,20,0.04)]"
          >
            <div className="w-12 h-12 rounded-full bg-[#F5E8C8] flex items-center justify-center text-2xl">
              {item.icon || '✦'}
            </div>
            <div className="flex-1 flex flex-col text-left">
              <span className="text-xs font-semibold text-[#456B2B] tracking-wider uppercase font-montserrat">{item.time}</span>
              <span className="text-[16px] sm:text-[18px] font-bold text-[#6B351D] font-heading mt-0.5">{item.name}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// 2. HW1FamilySection (Optional Welcoming Section with Water Reveal Animation)
function HW1FamilySection({ message, photo, isDesktop, bgImage }) {
  const defaultPhoto = "/backgrounds/House Warming/family picture.png"
  const photoUrl = photo || defaultPhoto
  const displayMessage = message && message.trim() 
    ? message 
    : "We are starting a new chapter of our lives in our dream home. We warmly welcome you to celebrate this auspicious occasion with us and shower us with your blessings as we step into our sweet new home."

  // Limit characters / words for display
  const words = displayMessage.split(/\s+/);
  const truncatedMessage = words.length > 70 
    ? words.slice(0, 70).join(" ") + "..."
    : displayMessage;

  return (
    <section 
      className="w-full min-h-[100svh] px-6 py-20 relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FBF3DE' }}
    >
      {/* Background (Same plaster texture as schedule) */}
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
        />
      )}

      <motion.div
        variants={scrollContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.35 }}
        className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16 items-center"
      >
        {/* Left Side: Content */}
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left space-y-6">
          <motion.div variants={scrollItemVariants} className="flex flex-col items-center xl:items-start">
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#456B2B] uppercase font-montserrat mb-1">
              Welcome Message
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-[#6B351D] leading-tight font-heading" style={{ fontFamily: "'Priestacy', serif" }}>
              Our Sweet Home
            </h2>
            <div className="w-12 h-[1.5px] bg-[#B77A16]/30 mt-3" />
          </motion.div>

          <motion.p 
            variants={scrollItemVariants}
            className="text-sm sm:text-base md:text-lg leading-relaxed text-[#776653] font-medium max-w-[460px] font-montserrat"
          >
            {truncatedMessage}
          </motion.p>
        </div>

        {/* Right Side: Photo with Water Reveal Animation */}
        <div className="flex justify-center items-center relative py-6 xl:justify-end xl:pr-12">
          <WaterRevealImage
            src={photoUrl}
            alt="Family"
            className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] rounded-2xl"
            duration={4.5}
            triggerOnce={false}
            threshold={0.25}
          />
        </div>
      </motion.div>
    </section>
  )
}

// 3. HW1Venue (Location)
function HW1Venue({ data, bgImage, isDesktop }) {
  if (!data) return null

  const addressTextPretty = String(data.venueLine1 || data.location || '')
  const venueTitle = data.venueName || 'Our New Home'
  const targetMapLink = data.mapLink || "https://maps.google.com"

  return (
    <section 
      className="relative w-full min-h-[100svh] px-6 pt-28 xl:pt-0 pb-20 flex flex-col items-center justify-start xl:justify-center text-center overflow-hidden"
      style={{ backgroundColor: '#FBF3DE' }}
    >
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
        />
      )}

      <motion.div 
        variants={scrollContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.35 }}
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-20"
      >
        {/* Left Side: Title and Address details */}
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left max-w-[360px] gap-5">
          {/* Title */}
          <motion.div variants={scrollItemVariants} className="flex flex-col items-center xl:items-start">
            <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#456B2B] uppercase font-montserrat mb-1">
              Our Location
            </p>
            <h2 className="text-[18px] sm:text-[34px] font-bold text-[#6B351D] tracking-wide uppercase flex items-center justify-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#B77A16] flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{venueTitle}</span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#B77A16]/30 mt-3" />
          </motion.div>

          {/* Address */}
          <motion.address 
            variants={scrollItemVariants} 
            className="not-italic text-sm sm:text-base leading-relaxed text-[#6B351D] font-bold px-2 xl:px-0 font-montserrat tracking-wide"
          >
            {addressTextPretty}
          </motion.address>
        </div>

        {/* Right Side: QR Code and Map Link */}
        <motion.div
          variants={scrollItemVariants}
          className="flex flex-col items-center justify-center gap-3 bg-[#FFFDF5] border border-[#D3A34A]/25 shadow-[0_6px_20px_rgba(80,50,20,0.06)] p-4 rounded-2xl max-w-[180px] w-full mt-2 xl:mt-0"
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(String(targetMapLink))}&color=6B351D&bgcolor=FFFDF5`}
            alt="Scan Map Location"
            className="w-[100px] h-[100px] rounded-lg border border-[#D3A34A]/20 p-1"
            loading="lazy"
          />
          <a
            href={String(targetMapLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#F5E8C8] hover:bg-[#F5E8C8]/80 border border-[#D3A34A]/30 rounded-full text-[11px] font-semibold text-[#6B351D] transition-colors"
          >
            📍 Open in Maps
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

// 3. HW1Countdown (Countdown)
function HW1Countdown({ data, bgImage, isDesktop, style }) {
  if (!data) return null

  const targetDateTimeISO = data.targetDateTimeISO || '2026-12-31T00:00:00.000Z'
  const labels = data.labels || { days: 'Days', hours: 'Hours', minutes: 'Min', seconds: 'Sec' }

  const targetDate = useMemo(() => {
    const parsed = new Date(targetDateTimeISO)
    return Number.isNaN(parsed.getTime()) ? new Date('2026-12-31T00:00:00.000Z') : parsed
  }, [targetDateTimeISO])

  const [parts, setParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isZero, setIsZero] = useState(false)

  useEffect(() => {
    const tick = () => {
      const ms = targetDate.getTime() - Date.now()
      if (ms <= 0) {
        setIsZero(true)
        setParts({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      const totalSeconds = Math.floor(ms / 1000)
      const days = Math.floor(totalSeconds / (60 * 60 * 24))
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
      const seconds = totalSeconds % 60
      setParts({ days, hours, minutes, seconds })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const boxes = [
    { label: labels.days, val: parts.days },
    { label: labels.hours, val: parts.hours },
    { label: labels.minutes, val: parts.minutes },
    { label: labels.seconds, val: parts.seconds },
  ]

  return (
    <section 
      className="relative w-full overflow-hidden flex flex-col items-center justify-start pt-28 pb-20 px-6"
      style={{ backgroundColor: '#FBF3DE', ...style }}
    >
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
        />
      )}

      <motion.div 
        variants={scrollContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.35 }}
        className="relative z-10 w-full max-w-[420px] mx-auto text-center flex flex-col items-center"
      >
        {/* Title */}
        <motion.div variants={scrollItemVariants} className="flex flex-col items-center mb-4">
          <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#456B2B] uppercase font-montserrat mb-1">
            Countdown
          </p>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-[#6B351D] tracking-wide uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Event starts in
          </h2>
          <div className="w-12 h-[1.5px] bg-[#B77A16]/30 mt-3" />
        </motion.div>

        <motion.p variants={scrollItemVariants} className="text-[12px] sm:text-sm font-semibold tracking-wider text-[#6B351D] mb-4 font-montserrat italic">
          Welcoming you to share our joy as we step into our new home.
        </motion.p>
        
        {isZero ? (
          <motion.div 
            variants={scrollItemVariants}
            className="w-full mt-4 bg-[#FFFDF5]/90 border border-[#D3A34A]/25 p-6 rounded-2xl shadow-[0_6px_20px_rgba(80,50,20,0.05)]"
          >
            <h3 className="font-heading text-2xl font-bold text-[#6B351D]">Welcome to our new home!</h3>
          </motion.div>
        ) : (
          <motion.div 
            variants={scrollItemVariants}
            className="flex gap-4 items-center justify-center w-full mt-4 bg-[#FFFDF5]/90 border border-[#D3A34A]/25 p-5 rounded-2xl shadow-[0_6px_20px_rgba(80,50,20,0.05)]"
          >
            {boxes.map((box, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center">
                  <span className="text-[28px] sm:text-[34px] font-bold text-[#6B351D] font-heading leading-none">
                    {idx === 0 ? box.val : String(box.val).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[#776653] tracking-widest mt-1">
                    {box.label}
                  </span>
                </div>
                {idx < boxes.length - 1 && (
                  <div className="w-[1.5px] h-8 bg-[#D3A34A]/25 ml-4 sm:ml-4" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
