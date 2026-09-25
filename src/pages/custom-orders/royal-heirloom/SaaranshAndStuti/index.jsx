import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../../../../context/DraftContext.jsx'
import { weddingData as staticData } from '../../../../weddingData.js'
import SplashScreen from '../../../../components/SplashScreen.jsx'
import Footer from '../../../../components/Footer.jsx'
import InviteQRSVP from '../../../../components/InviteQRSVP.jsx'
import CustomSection from '../../../../components/CustomSection.jsx'

// Section Components
import RoyalHeirloomCover from '../../../../templates/royal-heirloom/RoyalHeirloomCover.jsx'
import CustomRoyalHeirloomHero from './components/CustomRoyalHeirloomHero.jsx'
import RoyalHeirloomStory from '../../../../templates/royal-heirloom/RoyalHeirloomStory.jsx'
import StoryText from './components/StoryText.jsx'
import RoyalHeirloomVenue from '../../../../templates/royal-heirloom/RoyalHeirloomVenue.jsx'
import RoyalHeirloomSchedule from '../../../../templates/royal-heirloom/RoyalHeirloomSchedule.jsx'
import RoyalHeirloomCalendar from '../../../../templates/royal-heirloom/RoyalHeirloomCalendar.jsx'
import RoyalHeirloomCountdown from '../../../../templates/royal-heirloom/RoyalHeirloomCountdown.jsx'
import bgMusicSrc from '../../../../assets/audio/Annie Ahluwalia.mp4'

import { customData } from './data.js'
import FullScreenEvent from './components/FullScreenEvent.jsx'

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

export default function CustomRoyalHeirloomSaaranshAndStuti({ groupSlug: propGroupSlug }) {
  const location = useLocation()
  const { templateId, variant } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const groupSlug = propGroupSlug || new URLSearchParams(location.search).get('group')

  // Use customData for this specific template
  const savedData = customData

  // ── Payment / Watermark ────────────────────────────────────────
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid

  // ── Data resolution (same pattern as MidnightWaltz) ────────────
  const groomName = (savedData ? (savedData.coupleData?.groomName || savedData.groomName) : draftData?.groomName) || 'Rohan'
  const groomFamily = (savedData ? savedData.groomFamily : null)
  const brideName = (savedData ? (savedData.coupleData?.brideName || savedData.brideName) : draftData?.brideName) || 'Ananya'
  const brideFamily = (savedData ? savedData.brideFamily : null)

  // Wedding date components
  // Variant Overrides
  let variantDateStr = (() => {
    if (savedData?.heroData?.weddingDate) return savedData.heroData.weddingDate
    if (draftData?.weddingDate) return draftData.weddingDate
    return '28'
  })()
  let variantMonth = (() => {
    if (savedData?.heroData?.weddingMonth) return savedData.heroData.weddingMonth
    if (draftData?.weddingMonth) return draftData.weddingMonth
    return 'November'
  })()
  let variantYear = (() => {
    if (savedData?.heroData?.weddingYear) return savedData.heroData.weddingYear
    if (draftData?.weddingYear) return draftData.weddingYear
    return '2026'
  })()
  
  const weddingTime = (savedData ? (savedData.heroData?.weddingTime || savedData.weddingTime) : draftData?.weddingTime) || '09:00 AM - 10:30 AM'
  let invitationText = "Together with their families, we joyfully invite you\nto grace the auspicious occasion of their wedding celebration."
  let heroTitleTop = "WEDDING"
  let heroTitleBottom = "INVITATION"

  if (variant === '4') {
    variantDateStr = '18'
    variantMonth = 'December'
    invitationText = "Together with their families, we joyfully invite you\nto grace the auspicious occasion of their sagan celebration."
    heroTitleTop = "SAGAN"
    heroTitleBottom = "CELEBRATION"
  } else if (variant === '5') {
    variantDateStr = '20'
    variantMonth = 'December'
  } else if (variant === '2') {
    variantDateStr = '13'
    variantMonth = 'December'
    invitationText = "Together with their families, we joyfully invite you\nto grace the auspicious occasion of their pre-wedding celebrations."
    heroTitleTop = "WEDDING"
    heroTitleBottom = "CELEBRATIONS"
  } else if (variant === '3') {
    // Cocktail + Wedding - maybe we leave it as 20 Dec?
  }

  // Derive computed values from date components
  const eventDateObj = useMemo(() => {
    const d = new Date(`${variantMonth} ${variantDateStr}, ${variantYear}`)
    return isNaN(d.getTime()) ? new Date('2026-11-28') : d
  }, [variantMonth, variantDateStr, variantYear])

  const weddingDate = variantDateStr
  const weddingMonth = variantMonth
  const weddingYear = variantYear

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
  let venueTitle = (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData?.mahalName) || 'The Taj Mahal Palace'
  let venueAddress = (savedData ? (savedData.venueData?.venueAddress || savedData.venueAddress) : draftData?.venueAddress) || 'Apollo Bunder, Colaba'
  let venueCity = (savedData ? (savedData.venueData?.venueCity || savedData.venueCity) : draftData?.venueCity) || 'Mumbai'
  let venueState = (savedData ? (savedData.venueData?.state || savedData.state) : draftData?.state) || 'Maharashtra 400001'
  let mapUrl = (savedData ? (savedData.venueData?.mapLink || savedData.mapLink) : draftData?.mapLink) || `https://maps.google.com/?q=${encodeURIComponent(venueTitle + ', ' + venueAddress)}`

  if (variant === '4') {
    venueTitle = 'Amarai Farms'
    venueAddress = 'Delhi Ggn Rd, Kapas Hera'
    venueCity = 'New Delhi'
    venueState = ''
    mapUrl = 'https://maps.app.goo.gl/2iquCoZgx6heyMmVA?g_st=ic'
  }

  const fullAddress = [venueTitle, venueAddress, venueCity, venueState].filter(Boolean).join(', ')
  const venueDateTime = `${weddingDate} ${weddingMonth}, ${weddingYear} • ${formattedTime}`

  // Story Photos (dynamic from Builder)
  const storyPhotos = useMemo(() => {
    const photos = savedData
      ? (savedData.storyData?.photos || savedData.photos || [])
      : (draftData?.photos || [])
    const active = photos.filter(Boolean)
    return active.length > 0 ? active : [defaultPhoto1, defaultPhoto2, defaultPhoto3]
  }, [savedData, draftData])

  // Custom RSVP Multi-Link Variants
  const filteredRsvpEvents = useMemo(() => {
    // We explicitly define the 4 core events for the RSVP dropdown
    const allRsvpEvents = [
      { id: 'pooja', title: 'Pooja', date: '13th Dec, 2026', time: '11:30 AM' },
      { id: 'cocktail', title: 'Cocktail', date: '18th Dec, 2026', time: '8:30 PM onwards' },
      { id: 'haldi', title: 'Haldi & Mehendi', date: '19th Dec, 2026', time: '3:00 PM' },
      { id: 'wedding', title: 'Wedding', date: '20th Dec, 2026', time: '5:00 PM' }
    ]

    if (variant === '2') return allRsvpEvents.filter(e => ['pooja', 'cocktail', 'haldi'].includes(e.id))
    if (variant === '3') return allRsvpEvents.filter(e => ['cocktail', 'wedding'].includes(e.id))
    if (variant === '4') return allRsvpEvents.filter(e => ['cocktail'].includes(e.id))
    if (variant === '5') return allRsvpEvents.filter(e => ['wedding'].includes(e.id))
    return allRsvpEvents
  }, [variant])

  // Schedule Items (dynamic 1-6 events from Builder)
  const scheduleItems = useMemo(() => {
    const items = savedData
      ? (savedData.scheduleData?.items || [])
      : (Array.isArray(draftData?.scheduleItems) ? draftData.scheduleItems : [])
    
    // If no custom schedule is provided, use default but filter them based on variant!
    const baseItems = items.length > 0 ? items : [
      { time: "11:30 AM", title: "Pooja", iconSrc: "/assets/templates/royal-heirloom/icons/bouque.png", date: "13th Dec, 2026" },
      { time: "08:30 PM", title: "Cocktail", iconSrc: "/assets/templates/royal-heirloom/icons/drinks.png", date: "18th Dec, 2026" },
      { time: "03:00 PM", title: "Haldi & Mehendi", iconSrc: "/assets/templates/royal-heirloom/icons/engagement.png", date: "19th Dec, 2026" },
      { time: "05:00 PM", title: "Wedding", iconSrc: "/assets/templates/royal-heirloom/icons/dinner.png", date: "20th Dec, 2026" },
    ]

    // The schedule represents the breakdown of the Wedding day itself.
    // Since we already hide the schedule entirely for variants that don't include the wedding,
    // we can just return the base items here without filtering out the specific sub-events.
    return baseItems
  }, [savedData, draftData])

  // Filter Full Screen Events based on the variant allowed events
  const filteredFullScreenEvents = useMemo(() => {
    if (!savedData?.eventsData) return []
    const allowedIds = filteredRsvpEvents.map(e => e.id)
    return savedData.eventsData.filter(evt => allowedIds.includes(evt.id))
  }, [savedData, filteredRsvpEvents])

  // Section visibility toggles
  const sections = savedData?.sections || draftData?.sections || {}
  const showHero = sections.showHero !== false
  const showStory = sections.showStory !== false
  const showWelcome = sections.showWelcome !== false
  
  // The main venue and schedule are specifically for the Wedding Day
  // Hide them if the variant does not include the wedding (variants 2 and 4)
  const isWeddingIncluded = !['2', '4'].includes(variant)
  const showVenue = sections.showVenue !== false && isWeddingIncluded
  const showSchedule = isWeddingIncluded
  
  const showCountdown = sections.showCountdown !== false

  // Show/hide features
  const showGallery = savedData
    ? (savedData.invitationData?.showGallery !== undefined
        ? Boolean(savedData.invitationData.showGallery)
        : (savedData.scheduleData?.showGallery !== undefined
            ? Boolean(savedData.scheduleData.showGallery)
            : true))
    : Boolean(draftData?.showGallery ?? true)

  // Remove RSVP entirely based on user request
  const showRsvp = false

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

  // Handle Cover Opening Tap — start audio unmuted along with the video
  const handleOpenCover = () => {
    if (hasOpened || isPlaying) return
    setIsPlaying(true)

    if (audioRef.current) {
      audioRef.current.muted = false
      audioRef.current.volume = 1
      audioRef.current.play().catch((e) => console.warn("Audio play prevented:", e))
    }

    const vid = videoRef.current
    if (vid) {
      const playPromise = vid.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Video play interrupted/prevented:", err)
          // Only skip forcefully if it's a fatal error like NotSupportedError
          if (err.name !== 'AbortError') {
            setHasOpened(true)
            setHasTriggeredHeroBg(true)
            setHasTriggeredHeroText(true)
          }
        })
      }
      // Removed the 5.5s hardcoded timeout to guarantee 100% video flow
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
      
      {/* ── LOADING SPLASH REMOVED ── */}

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
        <CustomRoyalHeirloomHero 
          heroBgMobile={heroBgMobile}
          hasTriggeredHeroBg={hasTriggeredHeroBg}
          hasTriggeredHeroText={hasTriggeredHeroText}
          hasOpened={hasOpened}
          brideName={brideName}
          brideFamily={brideFamily}
          groomName={groomName}
          groomFamily={groomFamily}
          weddingMonth={weddingMonth}
          dayOfWeek={dayOfWeek}
          weddingDate={weddingDate}
          formattedTime={formattedTime}
          weddingYear={weddingYear}
          fullAddress={fullAddress}
          invitationText={invitationText}
          heroTitleTop={heroTitleTop}
          heroTitleBottom={heroTitleBottom}
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
        <StoryText 
          brideName={brideName}
          groomName={groomName}
          customMessage={savedData.welcomeMessage}
        />
        )}

        {/* ── CUSTOM SECTION: FULL SCREEN EVENTS ── */}
        {filteredFullScreenEvents.map((evt, idx) => (
          <FullScreenEvent key={evt.id || idx} event={evt} />
        ))}

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
          dateTime={venueDateTime}
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
            events={filteredRsvpEvents}
            weddingCode={savedData?.code}
            groupSlug={groupSlug}
            isPreview={!savedData?.code}
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
