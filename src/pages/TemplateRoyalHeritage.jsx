import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import { weddingData as staticData } from '../weddingData.js'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer.jsx'

// Import section components
import TemplateRoyalHeritageCover from '../components/TemplateRoyalHeritageCover.jsx'
import TemplateRoyalHeritageHero from '../components/TemplateRoyalHeritageHero.jsx'
import TemplateRoyalHeritageStory from '../components/TemplateRoyalHeritageStory.jsx'
import TemplateRoyalHeritageWelcome from '../components/TemplateRoyalHeritageWelcome.jsx'
import TemplateRoyalHeritageSchedule from '../components/TemplateRoyalHeritageSchedule.jsx'
import TemplateRoyalHeritageVenue from '../components/TemplateRoyalHeritageVenue.jsx'
import TemplateRoyalHeritageCalendar from '../components/TemplateRoyalHeritageCalendar.jsx'
import InviteQRSVP from '../components/InviteQRSVP.jsx'
import TemplateRoyalHeritageCountdown from '../components/TemplateRoyalHeritageCountdown.jsx'
import bgMusicSrc from '../assets/audio/bg-music-a-thousand-years.mp3'

// Simple SVG icon for Music On
const MusicOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
  </svg>
)

// Simple SVG icon for Music Off
const MusicOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
  </svg>
)

export default function TemplateRoyalHeritage({ savedData, groupSlug }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { draftData: _rawDraft } = useDraft();
  const draftData = new URLSearchParams(location.search).get('preview') === 'true' ? (_rawDraft || {}) : {};
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  
  const isPaid = savedData && (
    savedData.status === 'PAID' || 
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid
  const templateId = 'royal-heritage'

  const activeData = savedData || (isPreview ? draftData : null)
  const baseData = activeData || {}

  const data = {
    ...staticData,
    events: (() => {
      const draftEvents = Array.isArray(draftData?.scheduleItems) ? draftData.scheduleItems : []
      const savedEvents = savedData ? (savedData.scheduleData?.items || savedData.scheduleItems || []) : []
      const activeEvents = savedData ? savedEvents : draftEvents
      if (activeEvents && activeEvents.length > 0) {
        return activeEvents.map(item => ({
          time: item.time,
          title: item.title || item.name,
          name: item.title || item.name,
          date: item.date
        }))
      }
      return Array.isArray(staticData.events?.items) ? staticData.events.items : []
    })(),
    hero: {
      ...staticData.hero,
      groomName: baseData.groomName || draftData?.groomName || staticData.hero?.groomName || 'Groom',
      brideName: baseData.brideName || draftData?.brideName || staticData.hero?.brideName || 'Bride',
      weddingDate: (typeof baseData.weddingDate === 'object' ? baseData.weddingDate?.day : baseData.weddingDate) || draftData?.weddingDate || staticData.date?.day || '14',
      weddingMonth: (typeof baseData.weddingDate === 'object' ? baseData.weddingDate?.month : baseData.weddingMonth) || draftData?.weddingMonth || staticData.date?.month || 'January',
      weddingYear: (typeof baseData.weddingDate === 'object' ? baseData.weddingDate?.year : baseData.weddingYear) || draftData?.weddingYear || staticData.date?.year || '2024',
      mahalName: baseData.mahalName || draftData?.mahalName || staticData.venue?.venueName || 'Royal Palace',
      weddingTime: baseData.weddingTime || draftData?.weddingTime || staticData.hero?.weddingTime || '09:00 AM - 10:30 AM',
    },
    venue: {
      ...staticData.venue,
      mahalName: baseData.mahalName || draftData?.mahalName || staticData.venue?.venueName || 'Royal Palace',
      venueCity: baseData.venueCity || draftData?.venueCity || staticData.venue?.venueCity || 'Jaipur',
      venueAddress: baseData.venueAddress || draftData?.venueAddress || staticData.venue?.location || 'Heritage Road',
      state: baseData.state || draftData?.state || 'Rajasthan',
      mapUrl: baseData.mapLink || draftData?.mapLink || staticData.venue?.mapUrl || '',
    },
    countdown: {
      ...staticData.countdown,
      targetDateTimeISO: (() => {
        const dMonth = (typeof baseData.weddingDate === 'object' ? baseData.weddingDate?.month : baseData.weddingMonth) || draftData?.weddingMonth || staticData.date?.month || 'January'
        const dDate = (typeof baseData.weddingDate === 'object' ? baseData.weddingDate?.day : baseData.weddingDate) || draftData?.weddingDate || staticData.date?.day || '14'
        const dYear = (typeof baseData.weddingDate === 'object' ? baseData.weddingDate?.year : baseData.weddingYear) || draftData?.weddingYear || staticData.date?.year || '2024'
        const d = new Date(`${dMonth} ${dDate}, ${dYear}`)
        if (!isNaN(d.getTime())) return d.toISOString()
        return staticData.countdown?.targetDateTimeISO
      })()
    },
    photos: (() => {
      const photos = savedData
        ? (savedData.storyData?.photos || savedData.photos || [])
        : (draftData?.photos || [])
      const activePhotos = photos.filter(Boolean)
      return activePhotos.length > 0 ? activePhotos : null
    })(),
    welcomeMessage: activeData ? ((savedData ? savedData.invitationData?.welcomeMessage : draftData?.welcomeMessage) || staticData.invitation.message) : staticData.invitation.message,
  }

  const isGalleryView = !activeData;
  const showGallery = isGalleryView ? true : (savedData ? (savedData.invitationData?.showGallery ?? savedData.showGallery ?? true) : (draftData?.showGallery ?? true));
  const showSchedule = isGalleryView ? true : (savedData ? (savedData.invitationData?.showSchedule ?? savedData.showSchedule ?? true) : (draftData?.showSchedule ?? true));
  const showWelcome = isGalleryView ? true : (savedData ? (savedData.invitationData?.showWelcome ?? savedData.showWelcome ?? true) : (draftData?.showWelcome ?? true));
  const showVenue = isGalleryView ? true : (savedData ? (savedData.invitationData?.showVenue ?? savedData.showVenue ?? true) : (draftData?.showVenue ?? true));
  const showCountdown = isGalleryView ? true : (savedData ? (savedData.invitationData?.showCountdown ?? savedData.showCountdown ?? true) : (draftData?.showCountdown ?? true));

  const showRsvp = savedData 
    ? (savedData.invitationData?.hasRsvp !== undefined 
        ? Boolean(savedData.invitationData.hasRsvp) 
        : Boolean(savedData.rsvpData?.enabled || savedData.hasRsvp)) 
    : (draftData?.hasRsvp !== undefined ? Boolean(draftData.hasRsvp) : true)

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768
  )

  // Cover opening & splash state
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [hasTriggeredHeroText, setHasTriggeredHeroText] = useState(false)
  const [hasTriggeredHeroBg, setHasTriggeredHeroBg] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const videoRef = React.useRef(null)

  // Music state
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const audioRef = React.useRef(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!hasOpened) {
      window.scrollTo(0, 0)
      document.body.style.overflow = 'hidden'
    } else {
      window.scrollTo(0, 0)
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [hasOpened])

  useEffect(() => {
    if (hasOpened && audioRef.current && !isMusicMuted) {
      audioRef.current.muted = false
      audioRef.current.volume = 1
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [hasOpened, isMusicMuted])

  const toggleMusic = () => {
    setIsMusicMuted(!isMusicMuted)
    if (audioRef.current) {
      if (isMusicMuted) {
        audioRef.current.muted = false
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }

  const handleOpenCover = () => {
    if (hasOpened || isPlaying) return
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.muted = true
      audioRef.current.play().catch(() => {})
    }
    const vid = videoRef.current
    if (vid) {
      const playPromise = vid.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {})
      }
    }
  }

  const handleTimeUpdate = () => {
    const vid = videoRef.current
    if (vid) {
      if (vid.currentTime > 0.1 && !isVideoReady) {
        setIsVideoReady(true)
      }
      if (vid.duration && vid.currentTime > 0.5 && vid.currentTime >= vid.duration - 0.25) {
        if (!hasOpened) {
          setHasOpened(true)
          setHasTriggeredHeroBg(true)
          setHasTriggeredHeroText(true)
        }
      }
    }
  }

  const handleVideoEnded = () => {
    setHasOpened(true)
    setHasTriggeredHeroBg(true)
    setHasTriggeredHeroText(true)
  }

  const isDesktop = windowWidth > 1024
  const isTablet = windowWidth > 600 && windowWidth <= 1024

  const fontStyles = {
    cursive: {
      fontFamily: "'Modernline', 'Allura', 'Alex Brush', cursive",
      color: '#8A202A',
      fontWeight: 'normal',
      lineHeight: 1.15,
      textShadow: '0 1px 2px rgba(255,255,255,0.4)',
      fontSize: isDesktop ? '80px' : (isTablet ? '90px' : '65px'),
      margin: 0
    },
    serif: {
      fontFamily: "'Cormorant Garamond', serif",
      color: '#4A3E20',
      fontSize: isDesktop ? '18px' : '15px',
      lineHeight: 1.6,
      textShadow: '0 1px 2px rgba(255,255,255,0.4)',
    },
    smallCaps: {
      fontFamily: "'Cinzel', serif",
      color: '#8A202A',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      fontSize: isDesktop ? '14px' : (isTablet ? '16px' : '11px'),
      fontWeight: '600',
      textShadow: '0 1px 2px rgba(255,255,255,0.4)',
    }
  }

  const sectionStyle = {
    position: 'relative',
    width: '100%',
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'hidden',
    backgroundColor: 'transparent'
  }

  const bgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0
  }

  const commonProps = {
    data,
    fontStyles,
    sectionStyle,
    bgStyle,
    isDesktop,
    isTablet
  }

  const scheduleItems = data.events || []
  const fullAddress = `${data.venue?.venueAddress || ''}, ${data.venue?.venueCity || ''}`
  
  // Basic Calendar Logic
  const weddingDateStr = `${data.hero?.weddingDate} ${data.hero?.weddingMonth} ${data.hero?.weddingYear}`
  const targetDateObj = new Date(weddingDateStr)
  let calendarDays = []
  let monthName = data.hero?.weddingMonth
  let year = data.hero?.weddingYear
  
  if (!isNaN(targetDateObj.getTime())) {
    const y = targetDateObj.getFullYear()
    const m = targetDateObj.getMonth()
    const targetDay = targetDateObj.getDate()
    const firstDay = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ day: '', isTarget: false, isCurrent: false })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ day: i, isTarget: i === targetDay, isCurrent: true })
    }
    
    // Fill remaining slots for complete rows (up to 35 or 42)
    const remainingSlots = calendarDays.length > 35 ? 42 - calendarDays.length : 35 - calendarDays.length;
    for (let i = 0; i < remainingSlots; i++) {
      calendarDays.push({ day: '', isTarget: false, isCurrent: false })
    }

    monthName = targetDateObj.toLocaleString('default', { month: 'long' })
    year = targetDateObj.getFullYear()
  }

  const calendarData = {
    targetDateStr: weddingDateStr.toUpperCase(),
    monthName: (monthName || 'JANUARY').toUpperCase(),
    year: year || '2024',
    weekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    calendarDays: calendarDays.length ? calendarDays : [
      { day: '', isCurrent: false }, { day: '', isCurrent: false },
      { day: 1, isCurrent: true }, { day: 2, isCurrent: true }, { day: 3, isCurrent: true }, { day: 4, isCurrent: true }, { day: 5, isCurrent: true },
      { day: 6, isCurrent: true }, { day: 7, isCurrent: true }, { day: 8, isCurrent: true }, { day: 9, isCurrent: true }, { day: 10, isCurrent: true }, { day: 11, isCurrent: true }, { day: 12, isCurrent: true },
      { day: 13, isCurrent: true }, { day: 14, isTarget: true, isCurrent: true }, { day: 15, isCurrent: true }, { day: 16, isCurrent: true }, { day: 17, isCurrent: true }, { day: 18, isCurrent: true }, { day: 19, isCurrent: true },
    ]
  }

  const Watermark = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[100] opacity-[0.25] select-none">
      {['10%', '50%', '90%'].map(top => (
        <span
          key={top}
          className="absolute left-1/2 -translate-x-1/2 text-[17px] font-medium tracking-[0.2em] text-[#8A202A]"
          style={{ top, fontFamily: "'Montserrat', sans-serif" }}
        >
          preview-inviteque
        </span>
      ))}
    </div>
  ) : null

  const PreviewNav = () => isPreview ? (
    <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
      <div className="flex gap-3">
        <button onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })} className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[rgba(138,32,42,0.2)] bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#8A202A] shadow-xl hover:scale-105 active:scale-95">
          Back
        </button>
        <button onClick={() => navigate('/payment', { state: { draftData, templateId } })} className="flex-1 flex items-center justify-center gap-3 rounded-full bg-[#8A202A] py-4 text-sm font-bold text-[#F9F5EC] shadow-xl hover:scale-105 active:scale-95">
          Proceed
        </button>
      </div>
    </div>
  ) : null

  return (
    <div className="w-full bg-[#F9F5EC] overflow-x-hidden relative">
      <Watermark />
      <PreviewNav />
      
      <TemplateRoyalHeritageCover
        hasOpened={hasOpened}
        isPlaying={isPlaying}
        isVideoReady={isVideoReady}
        videoRef={videoRef}
        coverVideoSrc="/assets/templates/royal-heritage/cover-video.mp4"
        coverPosterSrc="/assets/templates/royal-heritage/entrance-video-frame.webp"
        handleOpenCover={handleOpenCover}
        handleTimeUpdate={handleTimeUpdate}
        handleVideoEnded={handleVideoEnded}
      />
      
      {/* Background Music Player */}
      <audio
        ref={audioRef}
        src={bgMusicSrc}
        loop
        playsInline
        preload="auto"
      />

      {/* Music Toggle Button */}
      {hasOpened && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onClick={toggleMusic}
          className="fixed bottom-6 right-4 z-50 p-3 rounded-full bg-[#8A202A]/80 backdrop-blur-sm text-[#F9F5EC] border border-[#F9F5EC]/30 shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all hover:scale-105 active:scale-95 hover:bg-[#8A202A]"
        >
          {isMusicMuted ? <MusicOffIcon /> : <MusicOnIcon />}
        </motion.button>
      )}

      <TemplateRoyalHeritageHero 
        {...commonProps} 
        hasTriggeredHeroBg={hasTriggeredHeroBg}
        hasTriggeredHeroText={hasTriggeredHeroText}
      />
      
      {showGallery && (
        <TemplateRoyalHeritageStory {...commonProps} />
      )}
      
      {showWelcome && (
        <TemplateRoyalHeritageWelcome {...commonProps} />
      )}
      
      {showSchedule && (
        <TemplateRoyalHeritageSchedule 
          scheduleItems={scheduleItems}
          weddingDate={data.hero?.weddingDate}
          weddingMonth={data.hero?.weddingMonth}
          weddingYear={data.hero?.weddingYear}
          fontStyles={fontStyles}
        />
      )}
      
      {showVenue && (
        <TemplateRoyalHeritageVenue {...commonProps} />
      )}
      
      <TemplateRoyalHeritageCalendar 
        calendarData={calendarData}
        fullAddress={fullAddress}
        {...commonProps}
      />
      
      {showRsvp && (
        <div style={{ backgroundColor: '#F9F5EC' }}>
          <InviteQRSVP
            events={scheduleItems}
            weddingCode={savedData?.code}
            groupSlug={groupSlug}
            isPreview={!savedData}
            theme="royal"
            config={savedData?.rsvpData}
          />
        </div>
      )}

      {showCountdown && (
        <TemplateRoyalHeritageCountdown {...commonProps} />
      )}

      <Footer 
        data={{ id: 'footer' }}
        theme={{
          background: '#4A3E20',
          text: '#F9F5EC',
          border: 'rgba(249, 245, 236, 0.2)'
        }} 
      />
    </div>
  )
}
