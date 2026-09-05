import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import { weddingData as staticData } from '../weddingData.js'
import Footer from '../components/Footer.jsx'
import InviteQRSVP from '../components/InviteQRSVP.jsx'
import CustomSection from '../components/CustomSection.jsx'

// Section Components
import RoyalHeirloomCover from '../templates/royal-heirloom/RoyalHeirloomCover.jsx'
import RoyalHeirloomHero from '../templates/royal-heirloom/RoyalHeirloomHero.jsx'
import RoyalHeirloomStory from '../templates/royal-heirloom/RoyalHeirloomStory.jsx'
import RoyalHeirloomStoryText from '../templates/royal-heirloom/RoyalHeirloomStoryText.jsx'
import RoyalHeirloomVenue from '../templates/royal-heirloom/RoyalHeirloomVenue.jsx'
import RoyalHeirloomSchedule from '../templates/royal-heirloom/RoyalHeirloomSchedule.jsx'
import RoyalHeirloomCalendar from '../templates/royal-heirloom/RoyalHeirloomCalendar.jsx'
import RoyalHeirloomCountdown from '../templates/royal-heirloom/RoyalHeirloomCountdown.jsx'
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

// Assets
const coverPosterSrc = "/assets/templates/royal-heirloom/cover-first-frame.webp"
const coverVideoSrc = "/assets/templates/royal-heirloom/cover-opening-video.MP4"
const heroBgMobile = "/assets/templates/royal-heirloom/hero-bg-mobile.webp"
const storyBgMobile = "/assets/templates/royal-heirloom/our-photo.webp"
const calendarBgMobile = "/assets/templates/royal-heirloom/photo-cards-bg.webp"
const ourVenueBgMobile = "/assets/templates/royal-heirloom/location-bg.webp"
const countdownBgMobile = "/assets/templates/royal-heirloom/countdown-mobile.webp"

// Pre-wedding shoot photos
const defaultPhoto1 = "/assets/templates/royal-heirloom/photo-1.webp"
const defaultPhoto2 = "/assets/templates/royal-heirloom/photo-2.webp"
const defaultPhoto3 = "/assets/templates/royal-heirloom/photo-3.webp"

export default function TemplateRoyalHeirloom({ savedData, groupSlug: propGroupSlug }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const groupSlug = propGroupSlug || new URLSearchParams(location.search).get('group')

  // ── Payment / Watermark ────────────────────────────────────────
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid

  // ── Data resolution (same pattern as MidnightWaltz) ────────────
  const groomName = (savedData ? (savedData.coupleData?.groomName || savedData.groomName) : draftData?.groomName) || 'Rohan'
  const brideName = (savedData ? (savedData.coupleData?.brideName || savedData.brideName) : draftData?.brideName) || 'Ananya'

  // Wedding date components
  const weddingDateStr = (() => {
    if (savedData?.heroData?.weddingDate) return savedData.heroData.weddingDate
    if (draftData?.weddingDate) return draftData.weddingDate
    return '28'
  })()
  const weddingMonth = (() => {
    if (savedData?.heroData?.weddingMonth) return savedData.heroData.weddingMonth
    if (draftData?.weddingMonth) return draftData.weddingMonth
    return 'November'
  })()
  const weddingYear = (() => {
    if (savedData?.heroData?.weddingYear) return savedData.heroData.weddingYear
    if (draftData?.weddingYear) return draftData.weddingYear
    return '2026'
  })()
  const weddingTime = (savedData ? (savedData.heroData?.weddingTime || savedData.weddingTime) : draftData?.weddingTime) || '09:00 AM - 10:30 AM'

  // Derive computed values from date components
  const eventDateObj = useMemo(() => {
    const d = new Date(`${weddingMonth} ${weddingDateStr}, ${weddingYear}`)
    return isNaN(d.getTime()) ? new Date('2026-11-28') : d
  }, [weddingMonth, weddingDateStr, weddingYear])

  const weddingDate = weddingDateStr
  const dayOfWeek = useMemo(() => {
    return eventDateObj.toLocaleString('en-US', { weekday: 'long' })
  }, [eventDateObj])

  const formattedTime = useMemo(() => {
    // If the time already has AM/PM, return as-is
    if (/[AaPp][Mm]/.test(weddingTime)) return weddingTime
    try {
      const [h, m] = weddingTime.split(':')
      const hour = parseInt(h, 10)
      if (isNaN(hour)) return "09:00 AM"
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const h12 = hour % 12 || 12
      return `${String(h12).padStart(2, '0')}:${m || '00'} ${ampm}`
    } catch {
      return "09:00 AM"
    }
  }, [weddingTime])

  // Venue data
  const venueTitle = (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData?.mahalName) || 'The Taj Mahal Palace'
  const venueAddress = (savedData ? (savedData.venueData?.venueAddress || savedData.venueAddress) : draftData?.venueAddress) || 'Apollo Bunder, Colaba'
  const venueCity = (savedData ? (savedData.venueData?.venueCity || savedData.venueCity) : draftData?.venueCity) || 'Mumbai'
  const venueState = (savedData ? (savedData.venueData?.state || savedData.state) : draftData?.state) || 'Maharashtra 400001'
  const fullAddress = [venueAddress, venueCity, venueState].filter(Boolean).join(', ')
  const mapUrl = (savedData ? (savedData.venueData?.mapLink || savedData.mapLink) : draftData?.mapLink) || `https://maps.google.com/?q=${encodeURIComponent(venueTitle + ', ' + fullAddress)}`

  // Story Photos (dynamic from Builder)
  const storyPhotos = useMemo(() => {
    const photos = savedData
      ? (savedData.storyData?.photos || savedData.photos || [])
      : (draftData?.photos || [])
    const active = photos.filter(Boolean)
    return active.length > 0 ? active : [defaultPhoto1, defaultPhoto2, defaultPhoto3]
  }, [savedData, draftData])

  // Schedule Items (dynamic 1-6 events from Builder)
  const scheduleItems = useMemo(() => {
    const items = savedData
      ? (savedData.scheduleData?.items || [])
      : (Array.isArray(draftData?.scheduleItems) ? draftData.scheduleItems : [])
    // If user provided schedule items, use them; otherwise fall back to defaults
    if (items.length > 0) return items
    return null // Let RoyalHeirloomSchedule use its built-in defaults
  }, [savedData, draftData])

  // Section visibility toggles
  const sections = savedData?.sections || draftData?.sections || {}
  const showHero = sections.showHero !== false
  const showStory = sections.showStory !== false
  const showWelcome = sections.showWelcome !== false
  const showVenue = sections.showVenue !== false
  const showCountdown = sections.showCountdown !== false

  // Show/hide features
  const showGallery = savedData
    ? (savedData.invitationData?.showGallery !== undefined
        ? Boolean(savedData.invitationData.showGallery)
        : (savedData.scheduleData?.showGallery !== undefined
            ? Boolean(savedData.scheduleData.showGallery)
            : true))
    : Boolean(draftData?.showGallery ?? true)

  const showSchedule = savedData
    ? (savedData.invitationData?.showSchedule !== undefined
        ? Boolean(savedData.invitationData.showSchedule)
        : (savedData.scheduleData?.showSchedule !== undefined
            ? Boolean(savedData.scheduleData.showSchedule)
            : true))
    : Boolean(draftData?.showSchedule ?? true)

  const showRsvp = savedData
    ? (savedData.invitationData?.hasRsvp !== undefined
        ? Boolean(savedData.invitationData.hasRsvp)
        : Boolean(savedData.rsvpData?.enabled || savedData.hasRsvp))
    : Boolean(draftData?.hasRsvp)

  const customSectionData = savedData ? (savedData.invitationData || {}) : draftData

  // Cover opening & splash state
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [hasTriggeredHeroText, setHasTriggeredHeroText] = useState(false)
  const [hasTriggeredHeroBg, setHasTriggeredHeroBg] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const videoRef = useRef(null)

  // Music state
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const audioRef = useRef(null)

  // Lock scroll while splash is active, and enforce scroll to top when opened
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

  // Handle background music: unmute after cover opens
  // The audio is started muted during the tap gesture (handleOpenCover),
  // so by the time hasOpened becomes true, the audio is already playing.
  // We just need to unmute it here.
  useEffect(() => {
    if (hasOpened && audioRef.current && !isMusicMuted) {
      audioRef.current.muted = false
      audioRef.current.volume = 1
      // If audio isn't playing yet (edge case), try to play
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

  // Interactive Story Photo Index
  const [activeStoryIdx, setActiveStoryIdx] = useState(0)

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Dynamic Calendar Calculation
  const calendarData = useMemo(() => {
    const validDate = isNaN(eventDateObj.getTime()) ? new Date("2026-11-28") : eventDateObj
    const year = validDate.getFullYear()
    const month = validDate.getMonth()
    const targetDay = validDate.getDate()

    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate()

    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const calendarDays = []

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      calendarDays.push({
        day: totalDaysInPrevMonth - i,
        isCurrent: false,
        isTarget: false,
      })
    }

    for (let i = 1; i <= totalDaysInMonth; i++) {
      calendarDays.push({
        day: i,
        isCurrent: true,
        isTarget: i === targetDay,
      })
    }

    const remainingSlots = 35 - calendarDays.length
    if (remainingSlots > 0) {
      for (let i = 1; i <= remainingSlots; i++) {
        calendarDays.push({
          day: i,
          isCurrent: false,
          isTarget: false,
        })
      }
    } else if (calendarDays.length > 35) {
      const extraSlots = 42 - calendarDays.length
      for (let i = 1; i <= extraSlots; i++) {
        calendarDays.push({
          day: i,
          isCurrent: false,
          isTarget: false,
        })
      }
    }

    const targetDateStr = `${validDate.toLocaleString('en-US', { weekday: 'long' })}, ${validDate.toLocaleString('en-US', { month: 'long' })} ${targetDay}, ${year}`

    return {
      weekDays,
      calendarDays,
      monthName: validDate.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
      year,
      targetDay,
      targetDateStr,
    }
  }, [eventDateObj])

  // Countdown timer logic
  const targetDateISO = useMemo(() => {
    try {
      return eventDateObj.getTime()
    } catch {
      return new Date("2026-11-28T09:00:00").getTime()
    }
  }, [eventDateObj])

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDateISO - now

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

  // Handle Cover Opening Tap — start audio MUTED during tap gesture for iOS autoplay
  const handleOpenCover = () => {
    if (hasOpened || isPlaying) return
    setIsPlaying(true)

    // Start audio muted immediately during the user gesture
    // This "reserves" the audio playback token on iOS/Android
    if (audioRef.current) {
      audioRef.current.muted = true
      audioRef.current.play().catch(() => {})
    }

    const vid = videoRef.current
    if (vid) {
      const playPromise = vid.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Video play interrupted/prevented:", err)
          setHasTriggeredHeroText(true)
          setHasTriggeredHeroBg(true)
          setHasOpened(true)
        })
      }

      // Failsafe timeout for mobile devices (video duration is ~3.5s)
      setTimeout(() => {
        if (!hasOpened) {
          setHasOpened(true)
          setHasTriggeredHeroBg(true)
          setHasTriggeredHeroText(true)
        }
      }, 5500)
    } else {
      setHasTriggeredHeroText(true)
      setHasTriggeredHeroBg(true)
      setHasOpened(true)
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

  // QR Code URL for venue navigation
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(mapUrl)}&color=4A2810&bgcolor=ECE3D1`

  // ── Watermark ─────────────────────────────────────────────────
  const Watermark = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[100] opacity-[0.30] select-none">
      {['8%', '50%', '92%'].map(top => (
        <span
          key={top}
          className="absolute left-1/2 -translate-x-1/2 text-[17px] font-medium tracking-[0.2em] text-[#4A2810]"
          style={{ top, fontFamily: "'Montserrat', sans-serif" }}
        >
          preview-inviteque
        </span>
      ))}
    </div>
  ) : null

  // ── Preview Nav ───────────────────────────────────────────────
  const PreviewNav = () => isPreview ? (
    <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
      <div className="flex gap-3">
        <button onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })} className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#4A2810]/20 bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#4A2810] shadow-xl hover:scale-105 active:scale-95">
          Back
        </button>
        <button onClick={() => navigate('/payment', { state: { draftData, templateId } })} className="flex-1 flex items-center justify-center gap-3 rounded-full bg-[#4A2810] py-4 text-sm font-bold text-[#F5D78E] shadow-xl hover:scale-105 active:scale-95">
          Proceed
        </button>
      </div>
    </div>
  ) : null

  return (
    <div className="relative min-h-screen bg-[#181311] text-[#4A3326] flex justify-center selection:bg-[#E8C29D]/40">
      {/* Mobile/Tablet Screen Constraint Wrapper with exact requested #ECE3D1 background */}
      <main className="relative w-full max-w-[480px] md:max-w-[820px] mx-auto bg-[#ECE3D1] shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">

        <Watermark />
        <PreviewNav />
        
        {/* ── 1. COVER OPENING / SPLASH SCREEN ── */}
        <RoyalHeirloomCover 
          hasOpened={hasOpened}
          isPlaying={isPlaying}
          isVideoReady={isVideoReady}
          videoRef={videoRef}
          coverVideoSrc={coverVideoSrc}
          coverPosterSrc={coverPosterSrc}
          handleOpenCover={handleOpenCover}
          handleTimeUpdate={handleTimeUpdate}
          handleVideoEnded={handleVideoEnded}
        />

        {/* ── SECTION 1: HERO ── */}
        {showHero && (
        <RoyalHeirloomHero 
          heroBgMobile={heroBgMobile}
          hasTriggeredHeroBg={hasTriggeredHeroBg}
          hasTriggeredHeroText={hasTriggeredHeroText}
          hasOpened={hasOpened}
          brideName={brideName}
          groomName={groomName}
          weddingMonth={weddingMonth}
          dayOfWeek={dayOfWeek}
          weddingDate={weddingDate}
          formattedTime={formattedTime}
          weddingYear={weddingYear}
          fullAddress={fullAddress}
        />
        )}

        {/* ── SECTION 1.5: CUSTOM SECTION ── */}
        <CustomSection 
          photoBgDesktop={storyBgMobile} 
          photoBgMobile={storyBgMobile} 
          data={customSectionData} 
          titleFontClass="font-['Cinzel']"
          bodyFontClass="font-['Cormorant_Garamond']"
          accentColorClass="text-[#8C5D38]"
        />

        {/* ── SECTION 2: OUR STORY (NEW NARRATIVE SECTION) ── */}
        {showWelcome && (
        <RoyalHeirloomStoryText 
          brideName={brideName}
          groomName={groomName}
        />
        )}

        {/* ── SECTION 3: OUR MOMENTS (PHOTO CARDS) ── */}
        {showStory && showGallery && (
        <RoyalHeirloomStory 
          ourPhotoBgMobile={storyBgMobile}
          storyPhotos={storyPhotos}
          defaultPhoto1={defaultPhoto1}
          defaultPhoto2={defaultPhoto2}
          defaultPhoto3={defaultPhoto3}
          brideName={brideName}
          groomName={groomName}
          weddingDate={weddingDate}
          weddingMonth={weddingMonth}
          weddingYear={weddingYear}
        />
        )}

        {/* ── SECTION 4: WEDDING SCHEDULE (DYNAMIC 1-6 EVENTS + S-CURVE) ── */}
        {showSchedule && (
        <RoyalHeirloomSchedule 
          scheduleItems={scheduleItems}
          weddingDate={weddingDate}
          weddingMonth={weddingMonth}
          weddingYear={weddingYear}
        />
        )}

        {/* ── SECTION 5: OUR VENUE ── */}
        {showVenue && (
        <RoyalHeirloomVenue 
          ourVenueBgMobile={ourVenueBgMobile}
          venueTitle={venueTitle}
          fullAddress={fullAddress}
          qrCodeUrl={qrCodeUrl}
          mapUrl={mapUrl}
        />
        )}

        {/* ── SECTION 6: WEDDING CALENDAR ── */}
        <RoyalHeirloomCalendar 
          calendarData={calendarData}
          fullAddress={fullAddress}
        />

        {/* ── SECTION 7: RSVP (via shared InviteQRSVP component) ── */}
        {showRsvp && (
          <InviteQRSVP
            events={typeof scheduleItems !== "undefined" ? scheduleItems : (typeof data !== "undefined" && data?.events ? data.events : [])}
            weddingCode={savedData?.code}
            groupSlug={groupSlug}
            isPreview={!savedData}
            theme="royal"
            config={savedData?.rsvpData}
          />
        )}

        {/* ── SECTION 8: COUNTDOWN ── */}
        {showCountdown && (
        <RoyalHeirloomCountdown 
          countdownBgMobile={countdownBgMobile}
          timeLeft={timeLeft}
        />
        )}

        {/* ── SECTION 9: THEMED ROYAL FOOTER ── */}
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

        {/* Persistent Background Audio Player */}
        <audio ref={audioRef} src={bgMusicSrc} loop />

        {/* Music Toggle Button - Visible only after opening */}
        {hasOpened && (
          <button
            onClick={toggleMusic}
            className="fixed bottom-6 right-4 z-50 p-3 rounded-full bg-[#3A1F10]/80 backdrop-blur-sm text-[#F5D78E] border border-[#F5D78E]/30 shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all hover:scale-105 hover:bg-[#3A1F10]"
            aria-label={isMusicMuted ? "Play Music" : "Mute Music"}
          >
            {isMusicMuted ? <MusicOffIcon /> : <MusicOnIcon />}
          </button>
        )}

      </main>
    </div>
  )
}
