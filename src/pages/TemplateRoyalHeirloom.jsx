import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import { weddingData as staticData } from '../weddingData.js'
import Footer from '../components/Footer.jsx'

// Section Components
import RoyalHeirloomCover from '../templates/royal-heirloom/RoyalHeirloomCover.jsx'
import RoyalHeirloomHero from '../templates/royal-heirloom/RoyalHeirloomHero.jsx'
import RoyalHeirloomStory from '../templates/royal-heirloom/RoyalHeirloomStory.jsx'
import RoyalHeirloomStoryText from '../templates/royal-heirloom/RoyalHeirloomStoryText.jsx'
import RoyalHeirloomVenue from '../templates/royal-heirloom/RoyalHeirloomVenue.jsx'
import RoyalHeirloomSchedule from '../templates/royal-heirloom/RoyalHeirloomSchedule.jsx'
import RoyalHeirloomCalendar from '../templates/royal-heirloom/RoyalHeirloomCalendar.jsx'
import RoyalHeirloomCountdown from '../templates/royal-heirloom/RoyalHeirloomCountdown.jsx'
import RoyalHeirloomRsvp from '../templates/royal-heirloom/RoyalHeirloomRsvp.jsx'
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

  // Cover opening & splash state
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [hasTriggeredHeroText, setHasTriggeredHeroText] = useState(false)
  const [hasTriggeredHeroBg, setHasTriggeredHeroBg] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const videoRef = useRef(null)

  // Music state
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Preload critical cover poster to avoid blank screen
    const img = new Image()
    img.src = coverPosterSrc
    img.onload = () => setAssetsLoaded(true)
    img.onerror = () => setAssetsLoaded(true)
    
    // Failsafe timer if onload fails to fire
    const timer = setTimeout(() => setAssetsLoaded(true), 2500)
    return () => clearTimeout(timer)
  }, [])

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

  // Ramp up background music volume when cover opens
  useEffect(() => {
    if (hasOpened && audioRef.current && !isMusicMuted) {
      audioRef.current.muted = false
      audioRef.current.volume = 1
      audioRef.current.play().catch(e => console.warn("Audio autoplay blocked by browser:", e))
    }
  }, [hasOpened, isMusicMuted])

  const toggleMusic = () => {
    setIsMusicMuted(!isMusicMuted)
    if (audioRef.current) {
      if (isMusicMuted) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }

  // Interactive Story Photo Index
  const [activeStoryIdx, setActiveStoryIdx] = useState(0)

  // RSVP State
  const [rsvpGuestName, setRsvpGuestName] = useState('')
  const [rsvpAttending, setRsvpAttending] = useState('yes')
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState('1')
  const [rsvpWishes, setRsvpWishes] = useState('')
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Data resolution: Props -> DraftContext -> Static Mock Data
  const data = savedData || draftData || staticData

  const brideName = data?.couple?.brideName || "Ananya"
  const groomName = data?.couple?.groomName || "Rohan"

  const rawDate = data?.eventDetails?.date || "2026-11-28"
  const eventDateObj = useMemo(() => new Date(rawDate), [rawDate])
  const weddingDayNum = isNaN(eventDateObj.getDate()) ? 28 : eventDateObj.getDate()
  const weddingDate = String(weddingDayNum)
  const weddingMonth = isNaN(eventDateObj.getTime())
    ? "November"
    : eventDateObj.toLocaleString('en-US', { month: 'long' })
  const weddingYear = isNaN(eventDateObj.getFullYear()) ? "2026" : String(eventDateObj.getFullYear())
  const dayOfWeek = isNaN(eventDateObj.getTime())
    ? "Saturday"
    : eventDateObj.toLocaleString('en-US', { weekday: 'long' })

  const rawTime = data?.eventDetails?.time || "09:00"
  const formattedTime = useMemo(() => {
    try {
      const [h, m] = rawTime.split(':')
      const hour = parseInt(h, 10)
      if (isNaN(hour)) return "09:00 AM"
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const h12 = hour % 12 || 12
      return `${String(h12).padStart(2, '0')}:${m || '00'} ${ampm}`
    } catch {
      return "09:00 AM"
    }
  }, [rawTime])

  const venueTitle = data?.venue?.name || "The Taj Mahal Palace"
  const fullAddress = data?.venue?.address || "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001"
  const mapUrl = data?.venue?.mapUrl || `https://maps.google.com/?q=${encodeURIComponent("The Taj Mahal Palace, Apollo Bunder, Colaba, Mumbai, Maharashtra 400001")}`

  // Story Photos
  const storyPhotos = useMemo(() => {
    if (data?.story?.photos && Array.isArray(data.story.photos) && data.story.photos.length > 0) {
      return data.story.photos
    }
    return [defaultPhoto1, defaultPhoto2, defaultPhoto3]
  }, [data?.story?.photos])

  // Payment Watermark Check
  const paymentConfirmed = savedData?.paymentStatus === 'PAID'
  const isOwner = draftData?.invitationId && draftData?.invitationId === savedData?.invitationId
  const showWatermark = !paymentConfirmed && !isPreview && !isOwner

  // Wedding Schedule Items with Modern Elegant SVG Icons
  const scheduleItems = useMemo(() => {
    return [
      {
        time: "09:00 AM",
        title: "Ganpati Pooja & Haldi",
        desc: "Sacred invocation and turmeric blessings to commence festivities.",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        )
      },
      {
        time: "06:30 PM",
        title: "Sangeet & Musical Night",
        desc: "An evening of royal melodies, dance performances, and celebration.",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )
      },
      {
        time: "10:30 AM",
        title: "Baraat & Muhurtham",
        desc: "The royal procession followed by the auspicious wedding vows.",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="12" r="6" />
            <circle cx="15" cy="12" r="6" />
          </svg>
        )
      },
      {
        time: "07:30 PM",
        title: "Grand Heirloom Reception",
        desc: "A royal dinner feast and celebratory banquet with family and friends.",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 22h8" />
            <path d="M12 15v7" />
            <path d="M17 3H7c0 4.5 2.5 7 5 7s5-2.5 5-7z" />
          </svg>
        )
      }
    ]
  }, [])

  // Dynamic Calendar Calculation
  const calendarData = useMemo(() => {
    const validDate = isNaN(eventDateObj.getTime()) ? new Date("2026-09-03") : eventDateObj
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
      const timeClean = rawTime.length === 5 ? `${rawTime}:00` : "09:00:00"
      return new Date(`${rawDate}T${timeClean}`).getTime()
    } catch {
      return new Date("2026-09-03T09:00:00").getTime()
    }
  }, [rawDate, rawTime])

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

  // Handle Cover Opening Tap
  const handleOpenCover = () => {
    if (hasOpened || isPlaying) return
    setIsPlaying(true)

    const vid = videoRef.current
    if (vid) {
      const playPromise = vid.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Video play interrupted/prevented:", err)
          // Fallback to opening immediately if video play is blocked (e.g. low power mode)
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
      // Remove poster only when video has started pushing frames
      if (vid.currentTime > 0.1 && !isVideoReady) {
        setIsVideoReady(true)
      }
      
      // Robust mobile safeguard: trigger landing if video reaches near end (>= duration - 0.25s)
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
    // When video finishes, hero page lands and triggers the text & couple name letter animations
    setHasOpened(true)
    setHasTriggeredHeroBg(true)
    setHasTriggeredHeroText(true)
  }

  // QR Code URL for venue navigation
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(mapUrl)}&color=4A2810&bgcolor=ECE3D1`

  // Handle RSVP Submit
  const handleRsvpSubmit = (e) => {
    e.preventDefault()
    setRsvpSubmitted(true)
  }

  if (!assetsLoaded) {
    return (
      <div className="min-h-screen bg-[#181311] flex flex-col items-center justify-center selection:bg-[#E8C29D]/40">
        <div className="w-10 h-10 border-2 border-[#8C5D38]/30 border-t-[#8C5D38] rounded-full animate-spin"></div>
        <p className="mt-6 text-[#8C5D38] font-['Cinzel'] tracking-[0.3em] text-xs uppercase animate-pulse">
          Loading
        </p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#181311] text-[#4A3326] flex justify-center selection:bg-[#E8C29D]/40">
      {/* Mobile/Tablet Screen Constraint Wrapper with exact requested #ECE3D1 background */}
      <main className="relative w-full max-w-[480px] bg-[#ECE3D1] shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">
        
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

        {/* ── SECTION 2: OUR STORY (NEW NARRATIVE SECTION) ── */}
        <RoyalHeirloomStoryText 
          brideName={brideName}
          groomName={groomName}
        />

        {/* ── SECTION 3: OUR MOMENTS (PHOTO CARDS) ── */}
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

        {/* ── SECTION 4: WEDDING SCHEDULE (ABOVE OUR VENUE) ── */}
        <RoyalHeirloomSchedule 
          scheduleItems={scheduleItems}
          weddingDate={weddingDate}
          weddingMonth={weddingMonth}
          weddingYear={weddingYear}
        />

        {/* ── SECTION 5: OUR VENUE ── */}
        <RoyalHeirloomVenue 
          ourVenueBgMobile={ourVenueBgMobile}
          venueTitle={venueTitle}
          fullAddress={fullAddress}
          qrCodeUrl={qrCodeUrl}
          mapUrl={mapUrl}
        />

        {/* ── SECTION 6: WEDDING CALENDAR & RSVP (MERGED ON #F6EBD8) ── */}
        <RoyalHeirloomCalendar 
          calendarData={calendarData}
          fullAddress={fullAddress}
          rsvpSubmitted={rsvpSubmitted}
          rsvpGuestName={rsvpGuestName}
          rsvpAttending={rsvpAttending}
          rsvpGuestsCount={rsvpGuestsCount}
          rsvpWishes={rsvpWishes}
          setRsvpSubmitted={setRsvpSubmitted}
          setRsvpGuestName={setRsvpGuestName}
          setRsvpAttending={setRsvpAttending}
          setRsvpGuestsCount={setRsvpGuestsCount}
          setRsvpWishes={setRsvpWishes}
          handleRsvpSubmit={handleRsvpSubmit}
        />

        {/* ── SECTION 7: COUNTDOWN ── */}
        <RoyalHeirloomCountdown 
          countdownBgMobile={countdownBgMobile}
          timeLeft={timeLeft}
        />

        {/* ── SECTION 8: THEMED ROYAL FOOTER ── */}
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
