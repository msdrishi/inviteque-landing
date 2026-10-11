import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { weddingDataComplete, weddingDataCustom, weddingDataHindu } from './data.js'

import RajasthaniVowsCover from '../../../../templates/rajasthani-vows/RajasthaniVowsCover.jsx'
import RajasthaniVowsHero from '../../../../templates/rajasthani-vows/RajasthaniVowsHero.jsx'
import RishikaWelcome from './components/RishikaWelcome.jsx'
import RishikaEventSection from './components/RishikaEventSection.jsx'
import RajasthaniVowsStory from '../../../../templates/rajasthani-vows/RajasthaniVowsStory.jsx'
import RajasthaniVowsSchedule from '../../../../templates/rajasthani-vows/RajasthaniVowsSchedule.jsx'
import RajasthaniVowsVenue from '../../../../templates/rajasthani-vows/RajasthaniVowsVenue.jsx'
import RajasthaniVowsCountdown from '../../../../templates/rajasthani-vows/RajasthaniVowsCountdown.jsx'
import Footer from '../../../../components/Footer.jsx'

export default function RishikaAndJaskaranTemplate() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const version = searchParams.get('version') || 'complete'

  let activeData = weddingDataComplete
  if (version === 'custom') activeData = weddingDataCustom
  else if (version === 'hindu') activeData = weddingDataHindu

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 1024 : false
  )

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Cover Opening Video & Music State ──────────────────────
  const [hasOpened, setHasOpened] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasTriggeredHeroBg, setHasTriggeredHeroBg] = useState(false)
  const [hasTriggeredHeroText, setHasTriggeredHeroText] = useState(false)
  const [isMusicMuted, setIsMusicMuted] = useState(false)

  const videoRef = useRef(null)
  const audioRef = useRef(null)

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

    // Pre-arm audio token on user tap gesture
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
          if (err.name !== 'AbortError') {
            setHasOpened(true)
            setHasTriggeredHeroBg(true)
            setHasTriggeredHeroText(true)
          }
        })
      }
    } else {
      setHasTriggeredHeroText(true)
      setHasTriggeredHeroBg(true)
      setHasOpened(true)
    }
  }

  const handleTimeUpdate = () => {
    const vid = videoRef.current
    if (vid) {
      if (vid.currentTime > 0.05 && !isVideoReady) {
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

  const messageBgDesktop = "/assets/templates/rajestani-vows/welcome-mobile.webp"
  const messageBgMobile = "/assets/templates/rajestani-vows/welcome-mobile.webp"
  const sangeetBg = "/assets/templates/rajestani-vows/sangeet.webp"
  const anandKarajBg = "/assets/templates/rajestani-vows/anand karaj.webp"
  const receptionBg = "/assets/templates/rajestani-vows/reception.webp"

  return (
    <>
      {/* Background Music Audio Element */}
      <audio
        ref={audioRef}
        src="/assets/templates/rajestani-vows/Anbil Avan.mp3"
        loop
        preload="auto"
      />

      {/* Floating Music Control Button */}
      {hasOpened && (
        <button
          onClick={toggleMusic}
          aria-label={isMusicMuted ? 'Play Music' : 'Mute Music'}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#FAF5EB]/90 backdrop-blur-md border border-[#C59A4E]/60 shadow-[0_4px_16px_rgba(122,18,40,0.18)] flex items-center justify-center text-[#7A1228] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isMusicMuted ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
      )}

      {/* Cover Splash Overlay with Video Opening Flow */}
      <RajasthaniVowsCover
        hasOpened={hasOpened}
        isPlaying={isPlaying}
        isVideoReady={isVideoReady}
        videoRef={videoRef}
        coverVideoSrc="/assets/templates/rajestani-vows/rajastani-cover-opening.mp4"
        coverPosterSrc="/assets/templates/rajestani-vows/cover-first-frame.webp"
        handleOpenCover={handleOpenCover}
        handleTimeUpdate={handleTimeUpdate}
        handleVideoEnded={handleVideoEnded}
      />

      <main className="bg-[#FAF6EE] min-h-screen overflow-x-hidden">
        {/* 1. Hero Section (Water spread bloom, falling flowers, Ganesha emblem, couple in Modernline) */}
        <RajasthaniVowsHero
          data={activeData.hero}
          isDesktop={isDesktop}
          hasTriggeredHeroBg={hasTriggeredHeroBg}
          hasTriggeredHeroText={hasTriggeredHeroText}
          hasOpened={hasOpened}
        />

        {/* 2. Welcome Section */}
        <RishikaWelcome
          data={activeData.welcome}
          isDesktop={isDesktop}
          bgImageDesktop={messageBgDesktop}
          bgImageMobile={messageBgMobile}
        />

        {/* 3. Our Moments / Photo Cards Section (Directly below Welcome section) */}
        <RajasthaniVowsStory
          data={activeData.story}
          userPhotos={activeData.story?.photos?.map(p => p.image)}
          isDesktop={isDesktop}
        />

        {/* 4. Custom Sangeet / Haldi Section (Middle area, middle 60% width) */}
        {activeData.events.items[0] && (
          <RishikaEventSection
            title={activeData.events.items[0].name || activeData.events.items[0].title}
            date={activeData.events.items[0].date}
            time={activeData.events.items[0].time}
            location={activeData.events.items[0].venue}
            mapLink={activeData.events.items[0].mapLink}
            bgImage={sangeetBg}
            position="middle"
            isDesktop={isDesktop}
          />
        )}

        {/* 5. Custom Anand Karaj Section (Top area, framed by floral arch) */}
        {activeData.events.items.find(e => e.name === "Anand Karaj") && (
          <RishikaEventSection
            title="Anand Karaj"
            date="7th December 2026"
            time="10:00 AM"
            location="Gurudwara Sahib Sardar Bazar, Delhi Cantt"
            mapLink="https://maps.app.goo.gl/j6neZVbWhRoXf2Av7?g_st=ic"
            bgImage={anandKarajBg}
            position="top"
            isDesktop={isDesktop}
          />
        )}

        {/* 6. Custom Reception Section (Top area, framed by open watercolor sky above mandap) */}
        {activeData.events.items.find(e => e.name === "Wedding Reception & Dinner") && (
          <RishikaEventSection
            title="Wedding Reception"
            date="7th December 2026"
            time="7:00 PM Onwards"
            location="28 The Mall, Delhi Cantonment, Abdul Hamid Dwar, Lawn 1 Akanksha"
            mapLink="https://maps.app.goo.gl/WLdJv6QiDoZ2oURW7?g_st=ic"
            bgImage={receptionBg}
            position="top"
            isDesktop={isDesktop}
          />
        )}

        {/* 7. Wedding Schedule Section (Original S-curve timeline with separate icon badges & text banners) */}
        <RajasthaniVowsSchedule
          scheduleItems={activeData.events.items}
          isDesktop={isDesktop}
        />

        {/* 8. Venue Section */}
        <RajasthaniVowsVenue
          data={{
            venueName: "28 The Mall, Delhi Cantonment",
            venueLine1: "Abdul Hamid Dwar, Lawn 1 Akanksha",
            venueLine2: "Delhi Cantt, New Delhi",
            venueAddress: "28 The Mall, Delhi Cantonment, Abdul Hamid Dwar, Lawn 1 Akanksha",
            venueCity: "Delhi Cantt",
            state: "New Delhi",
            mapUrl: "https://maps.app.goo.gl/WLdJv6QiDoZ2oURW7?g_st=ic",
          }}
          isDesktop={isDesktop}
        />

        {/* 9. Countdown Section (Original with falling flower petals & royal glass boxes) */}
        <RajasthaniVowsCountdown
          data={{ targetDateTimeISO: "2026-12-06T16:00:00.000Z" }}
          isDesktop={isDesktop}
        />

        {/* 10. Footer */}
        <Footer
          data={{
            id: 'footer',
            gratitude: activeData.footer?.closingMessage || "As we celebrate the new beginnings, your presence and blessings will make this day unforgettable and truly special.",
            family: activeData.footer?.familyMessage || "With warm regards,\nKashyap’s",
            names: "Rishika & Major Jaskaran",
          }}
          theme="rajasthani"
          isDesktop={isDesktop}
        />
      </main>
    </>
  )
}
