import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDraft } from '../../context/DraftContext.jsx'
import { weddingData as staticData } from '../../weddingData.js'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../../components/Footer.jsx'
import InviteQRSVP from '../../components/InviteQRSVP.jsx'
import bgMusicSrc from '../../assets/audio/bg-music-a-thousand-years.mp3'

// Import Pink Blossom section components (all self-contained in this folder)
import { COLORS, ASSETS, getFontStyles, sectionStyle, bgStyle } from './theme'
import PinkBlossomCover from './PinkBlossomCover.jsx'
import PinkBlossomHero from './PinkBlossomHero.jsx'
import PinkBlossomStory from './PinkBlossomStory.jsx'
import PinkBlossomWelcome from './PinkBlossomWelcome.jsx'
import PinkBlossomSchedule from './PinkBlossomSchedule.jsx'
import PinkBlossomVenue from './PinkBlossomVenue.jsx'
import PinkBlossomCalendar from './PinkBlossomCalendar.jsx'
import PinkBlossomCountdown from './PinkBlossomCountdown.jsx'

// ─── Music Icons ──────────────────────────────────────────────
const MusicOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
  </svg>
)

const MusicOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
  </svg>
)

// ─── Main Template Orchestrator ───────────────────────────────
export default function TemplatePinkBlossom({ savedData, groupSlug }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { draftData } = useDraft()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  
  const isPaid = savedData && (
    savedData.status === 'PAID' || 
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid
  const templateId = 'pink-blossom'

  const activeData = savedData || (isPreview ? draftData : null)
  const baseData = activeData || {}

  const data = {
    ...staticData,
    ...baseData, // Allows any root-level overrides from custom data
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
    welcomeMessage: activeData ? (savedData ? savedData.invitationData?.welcomeMessage : draftData?.welcomeMessage) : '',
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
    : Boolean(draftData?.hasRsvp)

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
    return () => { document.body.style.overflow = '' }
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
      vid.currentTime = 0
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

  const fontStyles = getFontStyles(isDesktop, isTablet)

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
  
  // Calendar Logic
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
    
    const remainingSlots = calendarDays.length > 35 ? 42 - calendarDays.length : 35 - calendarDays.length
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
          className="absolute left-1/2 -translate-x-1/2 text-[17px] font-medium tracking-[0.2em]"
          style={{ top, fontFamily: "'Montserrat', sans-serif", color: COLORS.primary }}
        >
          preview-inviteque
        </span>
      ))}
    </div>
  ) : null

  const PreviewNav = () => isPreview ? (
    <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
      <div className="flex gap-3">
        <button onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })} className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white/95 backdrop-blur-md py-4 text-sm font-bold shadow-xl hover:scale-105 active:scale-95" style={{ border: `1px solid rgba(200,25,94,0.2)`, color: COLORS.primary }}>
          Back
        </button>
        <button onClick={() => navigate('/payment', { state: { draftData, templateId } })} className="flex-1 flex items-center justify-center gap-3 rounded-full py-4 text-sm font-bold shadow-xl hover:scale-105 active:scale-95" style={{ backgroundColor: COLORS.primary, color: COLORS.ivory }}>
          Proceed
        </button>
      </div>
    </div>
  ) : null

  return (
    <div className="w-full overflow-x-hidden relative" style={{ backgroundColor: COLORS.ivory }}>
      <Watermark />
      <PreviewNav />
      
      <PinkBlossomCover
        hasOpened={hasOpened}
        isPlaying={isPlaying}
        isVideoReady={isVideoReady}
        videoRef={videoRef}
        coverVideoSrc={ASSETS.coverVideo}
        coverPosterSrc={ASSETS.coverPoster}
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
          className="fixed bottom-6 right-4 z-50 p-3 rounded-full backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all hover:scale-105 active:scale-95"
          style={{ 
            backgroundColor: `${COLORS.primary}CC`, 
            color: COLORS.ivory, 
            border: `1px solid ${COLORS.ivory}4D` 
          }}
        >
          {isMusicMuted ? <MusicOffIcon /> : <MusicOnIcon />}
        </motion.button>
      )}

      <PinkBlossomHero 
        {...commonProps} 
        hasTriggeredHeroBg={hasTriggeredHeroBg}
        hasTriggeredHeroText={hasTriggeredHeroText}
      />
      {showGallery && <PinkBlossomStory {...commonProps} />}
      {showWelcome && <PinkBlossomWelcome {...commonProps} />}
      
      {showSchedule && (
        <PinkBlossomSchedule 
          scheduleItems={scheduleItems}
          weddingDate={data.hero?.weddingDate}
          weddingMonth={data.hero?.weddingMonth}
          weddingYear={data.hero?.weddingYear}
          fontStyles={fontStyles}
        />
      )}
      
      {showVenue && <PinkBlossomVenue {...commonProps} />}
      
      <PinkBlossomCalendar 
        calendarData={calendarData}
        fullAddress={fullAddress}
        {...commonProps}
      />
      
      {showRsvp && (
        <div style={{ backgroundColor: COLORS.ivory }}>
          {baseData.rsvpUrl ? (
            <section 
              className="min-h-[100svh] px-4 flex flex-col items-center justify-center text-center py-20 relative"
              style={{
                backgroundImage: `url('/assets/templates/pinkblossom/PinkBlossom-light-background.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <p style={{ ...fontStyles.smallCaps, fontSize: '11px', letterSpacing: '0.2em', color: COLORS.textDark, marginBottom: '8px' }}>
                JOIN OUR CELEBRATION
              </p>
              <h2 style={{ ...fontStyles.smallCaps, fontSize: '28px', color: COLORS.primaryDark, marginBottom: '16px' }}>
                RSVP & CONTACT
              </h2>
              <p style={{ ...fontStyles.serif, fontSize: '15px', color: COLORS.textDark, maxWidth: '340px', marginBottom: '36px', lineHeight: 1.6 }}>
                We would be absolutely thrilled to have you join us in celebrating our special day. Please confirm your presence or reach out to us below.
              </p>
              <div className="flex flex-col gap-5 w-full max-w-[260px]">
                <a 
                  href={baseData.rsvpUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-[0_4px_14px_rgba(200,25,94,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{ backgroundColor: COLORS.primary, color: COLORS.ivory, fontFamily: fontStyles.smallCaps.fontFamily }}
                >
                  RSVP Here
                </a>
                {baseData.whatsappNumber && (
                  <a 
                    href={`https://wa.me/${baseData.whatsappNumber}?text=${encodeURIComponent(baseData.whatsappMessage || 'Hello!')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-[0_4px_14px_rgba(37,211,102,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                    style={{ backgroundColor: '#25D366', color: '#fff', fontFamily: fontStyles.smallCaps.fontFamily }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    WhatsApp
                  </a>
                )}
              </div>
            </section>
          ) : (
            <InviteQRSVP
              events={scheduleItems}
              weddingCode={savedData?.code}
              groupSlug={groupSlug}
              isPreview={!savedData}
              theme="pink-blossom"
              config={savedData?.rsvpData}
            />
          )}
        </div>
      )}

      {showCountdown && <PinkBlossomCountdown {...commonProps} />}

      {/* Floating WhatsApp Button - Show ONLY if there is no rsvpUrl */}
      {baseData.whatsappNumber && !baseData.rsvpUrl && (
        <a 
          href={`https://wa.me/${baseData.whatsappNumber}?text=${encodeURIComponent(baseData.whatsappMessage || 'Hello, I have a query regarding the wedding invitation.')}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-24 right-4 z-50 p-3 rounded-full bg-[#25D366] text-white shadow-[0_4px_15px_rgba(37,211,102,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Contact on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      )}

      <Footer 
        data={{ id: 'footer' }}
        theme={{
          background: COLORS.primaryDark,
          text: COLORS.ivory,
          border: `rgba(250, 243, 228, 0.2)`
        }} 
      />
    </div>
  )
}
