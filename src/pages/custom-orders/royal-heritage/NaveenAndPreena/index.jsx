import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import TemplateRoyalHeritageCover from '../../../../components/TemplateRoyalHeritageCover.jsx'
import TemplateRoyalHeritageHero from '../../../../components/TemplateRoyalHeritageHero.jsx'
import TemplateRoyalHeritageStory from '../../../../components/TemplateRoyalHeritageStory.jsx'
import TemplateRoyalHeritageWelcome from '../../../../components/TemplateRoyalHeritageWelcome.jsx'
import TemplateRoyalHeritageSchedule from '../../../../components/TemplateRoyalHeritageSchedule.jsx'
import TemplateRoyalHeritageVenue from '../../../../components/TemplateRoyalHeritageVenue.jsx'
import TemplateRoyalHeritageCalendar from '../../../../components/TemplateRoyalHeritageCalendar.jsx'
import TemplateRoyalHeritageCountdown from '../../../../components/TemplateRoyalHeritageCountdown.jsx'
import Footer from '../../../../components/Footer.jsx'

import bgMusicSrc from '../../../../assets/audio/bg-music-a-thousand-years.mp3'

// Icons
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

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
}

// Custom Local Components removed per request


export default function CustomRoyalHeritageNaveenAndPreena() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768)

  // Cover state
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
        audioRef.current.play().catch(() => { })
      }
    }
  }, [hasOpened, isMusicMuted])

  const toggleMusic = () => {
    setIsMusicMuted(!isMusicMuted)
    if (audioRef.current) {
      if (isMusicMuted) {
        audioRef.current.muted = false
        audioRef.current.play().catch(() => { })
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
      audioRef.current.play().catch(() => { })
    }
    const vid = videoRef.current
    if (vid) {
      const playPromise = vid.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => { })
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
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  }

  // --- OVERRIDE DATA ---
  const customData = {
    hero: {
      groomName: "Naveen",
      brideName: "Preena",
      weddingDate: "20",
      weddingMonth: "November",
      weddingYear: "2026",
      weddingTime: "3:00 PM",
      mahalName: "",
      hideVenueLocation: true,
      topMessageLine1: "TOGETHER WITH",
      topMessageLine2: "OUR FAMILIES",
      invitationMessage: "INVITE YOU TO CELEBRATE OUR WEDDING",
    },
    venueChurch: {
      venueAddress: "Hosur Road, Koramangala",
      venueCity: "Bengaluru",
      state: "",
      mahalName: "ST. ANTHONY’S FRIARY CHURCH",
      mapUrl: "https://share.google/DHMjraPdiIaBmhv92?utm_source=chatgpt.com",
      headerSubtitle: "WHERE WE UNITE",
      headerTitle: "OUR VENUE",
      time: "03:00 PM",
      headerDescription: "",
      bgImage: "/assets/custom-orders/naveen-and-preena/church.webp",
    },
    venueReception: {
      venueAddress: "Bannerghatta Main Road",
      venueCity: "Bengaluru",
      state: "",
      mahalName: "ROYALTON LEISURE – JIVA LAWNS",
      mapUrl: "https://share.google/sQ5TdtSQepbrqFZUO?utm_source=chatgpt.com",
      headerSubtitle: "WHERE WE UNITE",
      headerTitle: "OUR VENUE",
      time: "06:00 PM",
      headerDescription: "",
      bgImage: "/assets/custom-orders/naveen-and-preena/resort.webp",
    },
    events: [
      {
        time: "03:00 PM",
        title: "WEDDING MASS",
        description: "St. Anthony’s Friary Church"
      },
      {
        time: "06:00 PM",
        title: "WEDDING RECEPTION",
        description: "Royalton Leisure – Jiva Lawns"
      }
    ],
    storyTitles: ["Where It All Began", "A Beautiful Promise", "Forever & Always"],
    storyDescriptions: [
      "A beautiful beginning brought two hearts together.",
      "A journey filled with love, laughter and cherished moments.",
      "And now, they begin their forever together."
    ],
    welcomeMessage: "We welcome your presence to make our special day even more meaningful and memorable as we look forward to celebrating this beautiful beginning.",
    welcomeSignoff: "With love,\nNaveen & Preena"
  }

  const commonProps = {
    fontStyles,
    sectionStyle,
    bgStyle,
    isDesktop,
    isTablet,
  }

  // --- COMPUTE PROPS ---
  const scheduleItems = customData.events || []

  // Basic Calendar Logic
  const weddingDateStr = `${customData.hero.weddingDate} ${customData.hero.weddingMonth} ${customData.hero.weddingYear}`
  const targetDateObj = new Date(weddingDateStr)
  let calendarDays = []
  let monthName = customData.hero.weddingMonth
  let year = customData.hero.weddingYear

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

    const remainingSlots = calendarDays.length > 35 ? 42 - calendarDays.length : 35 - calendarDays.length;
    for (let i = 0; i < remainingSlots; i++) {
      calendarDays.push({ day: '', isTarget: false, isCurrent: false })
    }
    monthName = targetDateObj.toLocaleString('default', { month: 'long' })
    year = targetDateObj.getFullYear()
  }

  const calendarData = {
    targetDateStr: weddingDateStr.toUpperCase(),
    monthName: (monthName || 'NOVEMBER').toUpperCase(),
    year: year || '2026',
    weekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    calendarDays: calendarDays.length ? calendarDays : [
      { day: '', isCurrent: false }, { day: '', isCurrent: false },
      { day: 1, isCurrent: true }, { day: 2, isCurrent: true }, { day: 3, isCurrent: true }, { day: 4, isCurrent: true }, { day: 5, isCurrent: true },
      { day: 6, isCurrent: true }, { day: 7, isCurrent: true }, { day: 8, isCurrent: true }, { day: 9, isCurrent: true }, { day: 10, isCurrent: true }, { day: 11, isCurrent: true }, { day: 12, isCurrent: true },
      { day: 13, isCurrent: true }, { day: 14, isCurrent: true }, { day: 15, isCurrent: true }, { day: 16, isCurrent: true }, { day: 17, isCurrent: true }, { day: 18, isCurrent: true }, { day: 19, isCurrent: true },
      { day: 20, isTarget: true, isCurrent: true }, { day: 21, isCurrent: true }, { day: 22, isCurrent: true }, { day: 23, isCurrent: true }, { day: 24, isCurrent: true }, { day: 25, isCurrent: true },
    ]
  }

  return (
    <div className="w-full bg-[#F9F5EC] overflow-x-hidden relative">
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

      <audio
        ref={audioRef}
        src={bgMusicSrc}
        loop
        playsInline
        preload="auto"
      />

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

      {/* Hero */}
      <TemplateRoyalHeritageHero
        {...commonProps}
        data={{ hero: customData.hero, venue: { venueAddress: "" } }}
        hasTriggeredHeroBg={hasTriggeredHeroBg}
        hasTriggeredHeroText={hasTriggeredHeroText}
      />

      {/* Our Story */}
      <TemplateRoyalHeritageStory
        {...commonProps}
        data={{
          photos: [
            "/assets/custom-orders/naveen-and-preena/img_4555.webp",
            "/assets/custom-orders/naveen-and-preena/img_4557.webp",
            "/assets/custom-orders/naveen-and-preena/img_4558.webp"
          ],
          storyTitles: customData.storyTitles,
          storyDescriptions: customData.storyDescriptions
        }}
      />

      {/* Welcome */}
      <TemplateRoyalHeritageWelcome
        {...commonProps}
        data={{ 
          welcomeMessage: customData.welcomeMessage, 
          welcomeSignoff: customData.welcomeSignoff,
          welcomeSignoffNamesColor: '#000000'
        }}
      />

      {/* Schedule */}
      <TemplateRoyalHeritageSchedule
        scheduleItems={scheduleItems}
        weddingDate={customData.hero.weddingDate}
        weddingMonth={customData.hero.weddingMonth}
        weddingYear={customData.hero.weddingYear}
        fontStyles={fontStyles}
      />

      {/* Venue 1: Church */}
      <TemplateRoyalHeritageVenue
        {...commonProps}
        data={{ venue: customData.venueChurch }}
      />

      {/* Venue 2: Reception */}
      <TemplateRoyalHeritageVenue
        {...commonProps}
        data={{ venue: customData.venueReception }}
      />

      {/* Calendar */}
      <TemplateRoyalHeritageCalendar
        calendarData={calendarData}
        fullAddress=""
        {...commonProps}
        data={{ hero: customData.hero }}
      />

      {/* Countdown */}
      <TemplateRoyalHeritageCountdown
        {...commonProps}
        data={{
          hero: customData.hero,
          countdown: { targetDateTimeISO: new Date(weddingDateStr).toISOString() }
        }}
      />

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
