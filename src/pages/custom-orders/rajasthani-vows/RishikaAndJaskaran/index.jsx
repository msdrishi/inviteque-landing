import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { weddingDataComplete, weddingDataCustom, weddingDataHindu } from './data.js'

import RajasthaniVowsCover from '../../../../templates/rajasthani-vows/RajasthaniVowsCover.jsx'
import RishikaHero from './components/RishikaHero.jsx'
import RishikaWelcome from './components/RishikaWelcome.jsx'
import RishikaStory from './components/RishikaStory.jsx'
import RishikaEventSection from './components/RishikaEventSection.jsx'
import RishikaSchedule from './components/RishikaSchedule.jsx'
import RishikaWarmRegards from './components/RishikaWarmRegards.jsx'
import RajasthaniVowsCountdown from '../../../../templates/rajasthani-vows/RajasthaniVowsCountdown.jsx'
import Footer from '../../../../components/Footer.jsx'
import rishikaBgMusic from './components/audio/ik-onkar-the-wedding-version_sxms83Cp.mp3'

export default function RishikaAndJaskaranTemplate() {
  const location = useLocation()
  const { variant } = useParams()
  const searchParams = new URLSearchParams(location.search)
  const versionParam = variant || searchParams.get('version') || '1'

  // Version 1 (default): Haldi + Anand Karaj + Reception
  // Version 2 (/2): Without Anand Karaj (Haldi + Reception)
  // Version 3 (/3): With Sangeet & Anand Karaj + Reception
  let activeData = weddingDataComplete
  if (versionParam === '2' || versionParam === 'custom' || versionParam === 'without-anandkaraj') {
    activeData = weddingDataCustom
  } else if (versionParam === '3' || versionParam === 'hindu' || versionParam === 'sangeet-anandkaraj') {
    activeData = weddingDataHindu
  }

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
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [hasOpened, isMusicMuted])

  const toggleMusic = () => {
    const nextMuted = !isMusicMuted
    setIsMusicMuted(nextMuted)
    if (audioRef.current) {
      if (nextMuted) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {})
      }
    }
  }

  // Tap to open: music starts playing IMMEDIATELY parallely with the opening video
  const handleOpenCover = () => {
    if (hasOpened || isPlaying) return
    setIsPlaying(true)

    // Unmute & start audio playback on direct user gesture
    if (audioRef.current) {
      audioRef.current.muted = false
      audioRef.current.volume = 1
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => {
        console.warn("Audio play prevented:", err)
      })
    }

    const vid = videoRef.current
    if (vid) {
      vid.muted = true
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

  const haldiEvent = activeData.events.items.find(e => e.id === "haldi")
  const sangeetEvent = activeData.events.items.find(e => e.id === "sangeet")
  const anandKarajEvent = activeData.events.items.find(e => e.id === "anand-karaj" || e.name === "Anand Karaj")
  const receptionEvent = activeData.events.items.find(e => e.id === "reception" || e.titleLine1 || e.titleLine2)

  return (
    <>
      {/* Background Music Audio Element — ik-onkar-the-wedding-version */}
      <audio
        ref={audioRef}
        src={rishikaBgMusic}
        loop
        preload="auto"
      />

      {/* Preview Watermark Overlay */}
      {isDesktop ? (
        <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.16] select-none flex flex-col justify-around items-center text-[#54121B]">
          {['preview-inviteque', 'preview-inviteque', 'preview-inviteque'].map((t, i) => (
            <span key={i} className="text-[28px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {t}
            </span>
          ))}
        </div>
      ) : (
        <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.25] select-none">
          {['8%', '35%', '65%', '92%'].map(top => (
            <span
              key={top}
              className="absolute left-1/2 -translate-x-1/2 text-[16px] font-medium tracking-[0.22em] text-[#54121B]"
              style={{ top, fontFamily: "'Montserrat', sans-serif" }}
            >
              preview-inviteque
            </span>
          ))}
        </div>
      )}

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
        {/* 1. Hero Section: Hiragenda font, movie title letter animation, light glare, #HeartsOnDuty, 6, 7 date */}
        <RishikaHero
          data={activeData.hero}
          isDesktop={isDesktop}
          hasTriggeredHeroBg={hasTriggeredHeroBg}
          hasTriggeredHeroText={hasTriggeredHeroText}
          hasOpened={hasOpened}
        />

        {/* 2. Welcome Section: Exact requested text, no bold for Swadesh Sharma, bold for couple, prominent D/o S/o, 60-70% middle area */}
        <RishikaWelcome
          data={activeData.welcome}
          isDesktop={isDesktop}
          bgImageDesktop={messageBgDesktop}
          bgImageMobile={messageBgMobile}
        />

        {/* 3. Photo Cards Section: Photos 1, 2, 3 in order, no Moment 1, 2, 3 text */}
        <RishikaStory
          data={activeData.story}
          isDesktop={isDesktop}
        />

        {/* 4a. Event Section: Haldi (if included in version) */}
        {haldiEvent && (
          <RishikaEventSection
            title={haldiEvent.name || haldiEvent.title}
            date={haldiEvent.date}
            time={haldiEvent.time}
            location={haldiEvent.venue}
            mapLink={haldiEvent.mapLink}
            bgImage={sangeetBg}
            position="middle"
            isDesktop={isDesktop}
          />
        )}

        {/* 4b. Event Section: Sangeet (if included in version, e.g. Version 3) */}
        {sangeetEvent && (
          <RishikaEventSection
            title={sangeetEvent.name || sangeetEvent.title}
            date={sangeetEvent.date}
            time={sangeetEvent.time}
            location={sangeetEvent.venue}
            mapLink={sangeetEvent.mapLink}
            bgImage={sangeetBg}
            position="middle"
            isDesktop={isDesktop}
          />
        )}

        {/* 5. Event Section: Anand Karaj (if included in version, e.g. Version 1 & Version 3) */}
        {anandKarajEvent && (
          <RishikaEventSection
            title={anandKarajEvent.name || anandKarajEvent.title}
            date={anandKarajEvent.date}
            time={anandKarajEvent.time}
            location={anandKarajEvent.venue}
            mapLink={anandKarajEvent.mapLink}
            bgImage={anandKarajBg}
            position="top"
            isDesktop={isDesktop}
          />
        )}

        {/* 6. Event Section: Wedding Reception (Sundowner Pheras line 1 big + wedding reception small, with 7th superscript) */}
        {receptionEvent && (
          <RishikaEventSection
            titleLine1={receptionEvent.titleLine1 || "Sundowner Pheras"}
            connectorText={receptionEvent.connector || "followed by"}
            titleLine2={receptionEvent.titleLine2 || "Wedding Reception"}
            date={receptionEvent.date}
            time={receptionEvent.time}
            location={receptionEvent.venue}
            mapLink={receptionEvent.mapLink}
            bgImage={receptionBg}
            position="top"
            isDesktop={isDesktop}
          />
        )}

        {/* 6. Wedding Schedule: Only 2 events (4:30 pm sundowner pheras, 7 pm wedding reception) */}
        <RishikaSchedule
          scheduleItems={activeData.events.schedule}
          isDesktop={isDesktop}
        />

        {/* 7. Warm Regards Section: Replaces Venue with blessings message and Kashyap’s signoff */}
        <RishikaWarmRegards
          data={activeData.regards}
          isDesktop={isDesktop}
        />

        {/* 8. Countdown Section */}
        <RajasthaniVowsCountdown
          data={{
            targetDateTimeISO: (versionParam === '3' || versionParam === 'hindu' || versionParam === 'sangeet-anandkaraj')
              ? "2026-12-07T16:30:00.000Z"
              : "2026-12-06T16:00:00.000Z"
          }}
          isDesktop={isDesktop}
        />

        {/* 9. Footer */}
        <Footer
          data={{
            id: 'footer',
            gratitude: activeData.footer?.closingMessage,
            family: activeData.footer?.familyMessage,
            names: activeData.footer?.names || "Rishika weds Major Jaskaran",
          }}
          theme="rajasthani"
          isDesktop={isDesktop}
        />
      </main>
    </>
  )
}
