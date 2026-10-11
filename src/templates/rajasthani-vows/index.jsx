import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../../context/DraftContext.jsx'
import Footer from '../../components/Footer.jsx'
import CustomSection from '../../components/CustomSection.jsx'
import InviteQRSVP from '../../components/InviteQRSVP.jsx'
import RajasthaniVowsCover from './RajasthaniVowsCover.jsx'
import RajasthaniVowsHero from './RajasthaniVowsHero.jsx'
import RajasthaniVowsWelcome from './RajasthaniVowsWelcome.jsx'
import RajasthaniVowsStory from './RajasthaniVowsStory.jsx'
import RajasthaniVowsSchedule from './RajasthaniVowsSchedule.jsx'
import RajasthaniVowsVenue from './RajasthaniVowsVenue.jsx'
import RajasthaniVowsCountdown from './RajasthaniVowsCountdown.jsx'
import defaultTemplateData from './rajasthaniVowsData.json'
import bgMusicSrc from '../../assets/audio/bg-music-a-thousand-years.mp3'
import { motion } from 'framer-motion'

// ── Music Icons ───────────────────────────────────────────────
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

export default function TemplateRajasthaniVows({ savedData, groupSlug: propGroupSlug }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData: _rawDraft } = useDraft()
  const isCustomPreview = new URLSearchParams(location.search).get('customPreview') === 'true'
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const draftData = isCustomPreview ? (_rawDraft || {}) : {}
  const navigate = useNavigate()
  const groupSlug = propGroupSlug || new URLSearchParams(location.search).get('group')

  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = isPreview || isCustomPreview || !isPaid

  // Cover opening state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasTriggeredHeroBg, setHasTriggeredHeroBg] = useState(false)
  const [hasTriggeredHeroText, setHasTriggeredHeroText] = useState(false)
  const [hasOpened, setHasOpened] = useState(
    new URLSearchParams(location.search).get('opened') === 'true'
  )
  const videoRef = useRef(null)

  // Music state
  const [isMusicMuted, setIsMusicMuted] = useState(false)
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

    // Pre-arm audio token on user tap gesture for iOS/Android
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

  // ── Fully Configurable Section Data Assembly ─────────────────
  const groomName = (savedData ? (savedData.coupleData?.groomName || savedData.groomName) : draftData?.groomName) || defaultTemplateData.hero.groomName
  const brideName = (savedData ? (savedData.coupleData?.brideName || savedData.brideName) : draftData?.brideName) || defaultTemplateData.hero.brideName
  const weddingDate = (savedData ? (savedData.heroData?.weddingDate || savedData.weddingDate) : draftData?.weddingDate) || defaultTemplateData.hero.weddingDate
  const weddingMonth = (savedData ? (savedData.heroData?.weddingMonth || savedData.weddingMonth) : draftData?.weddingMonth) || defaultTemplateData.hero.weddingMonth
  const weddingYear = (savedData ? (savedData.heroData?.weddingYear || savedData.weddingYear) : draftData?.weddingYear) || defaultTemplateData.hero.weddingYear
  const weddingTime = (savedData ? (savedData.heroData?.weddingTime || savedData.weddingTime) : draftData?.weddingTime) || defaultTemplateData.hero.weddingTime
  const venueName = (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData?.mahalName) || defaultTemplateData.hero.venueName

  const dayOfWeek = useMemo(() => {
    if (weddingMonth && weddingDate && weddingYear) {
      const d = new Date(`${weddingMonth} ${weddingDate}, ${weddingYear}`)
      if (!isNaN(d.getTime())) return d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    }
    return defaultTemplateData.hero.dayOfWeek
  }, [weddingMonth, weddingDate, weddingYear])

  const addressLines = useMemo(() => {
    if (savedData?.venueData?.venueAddress || savedData?.venueAddress) {
      return [
        savedData.venueData?.venueAddress || savedData.venueAddress,
        savedData.venueData?.venueCity || savedData.venueCity,
        savedData.venueData?.state || savedData.state
      ].filter(Boolean)
    }
    if (draftData?.venueAddress) {
      return [
        draftData.venueAddress,
        draftData.venueCity,
        draftData.state
      ].filter(Boolean)
    }
    return defaultTemplateData.hero.addressLines
  }, [savedData, draftData])

  const mapUrl = (savedData ? (savedData.venueData?.mapLink || savedData.mapLink) : draftData?.mapLink) || defaultTemplateData.venue.mapUrl

  // 1. Hero Section Data
  const heroData = useMemo(() => ({
    ...defaultTemplateData.hero,
    groomName,
    brideName,
    weddingDate,
    weddingMonth,
    weddingYear,
    dayOfWeek,
    weddingTime,
    venueName,
    addressLines,
  }), [groomName, brideName, weddingDate, weddingMonth, weddingYear, dayOfWeek, weddingTime, venueName, addressLines])

  // 2. Welcome Section Data
  const welcomeData = useMemo(() => {
    const customMessage = savedData ? savedData.invitationData?.welcomeMessage : draftData?.welcomeMessage
    return {
      ...defaultTemplateData.welcome,
      message: customMessage !== undefined && customMessage !== null && customMessage !== ''
        ? customMessage
        : defaultTemplateData.welcome.message,
    }
  }, [savedData, draftData])

  // 3. Story Section Data & User Photos
  const userPhotos = useMemo(() => {
    return (savedData ? (savedData.storyData?.photos || savedData.photos) : draftData?.photos) || []
  }, [savedData, draftData])

  const dateStr = useMemo(() => {
    return `${weddingDate}.${String(weddingMonth || 'DEC').slice(0, 3)}.${weddingYear}`
  }, [weddingDate, weddingMonth, weddingYear])

  const storyData = useMemo(() => ({
    ...defaultTemplateData.story,
  }), [])

  // 4. Schedule Section Data
  const userScheduleItems = useMemo(() => {
    return (savedData ? savedData.scheduleData?.items : draftData?.scheduleItems) || []
  }, [savedData, draftData])

  const scheduleData = useMemo(() => ({
    ...defaultTemplateData.schedule,
  }), [])

  // 5. Venue Section Data
  const venueData = useMemo(() => ({
    ...defaultTemplateData.venue,
    venueName,
    venueLine1: addressLines[0] || defaultTemplateData.venue.venueLine1,
    venueLine2: addressLines.slice(1).join(', ') || defaultTemplateData.venue.venueLine2,
    mapUrl,
  }), [venueName, addressLines, mapUrl])

  // 6. Countdown Section Data
  const countdownData = useMemo(() => {
    const targetISO = (() => {
      if (weddingMonth && weddingDate && weddingYear) {
        const d = new Date(`${weddingMonth} ${weddingDate}, ${weddingYear} 09:00:00`)
        if (!isNaN(d.getTime())) return d.toISOString()
      }
      return defaultTemplateData.countdown.targetDate
    })()
    return {
      ...defaultTemplateData.countdown,
      targetDate: targetISO,
    }
  }, [weddingMonth, weddingDate, weddingYear])

  // Section visibility controls
  const activeData = savedData || (isPreview ? draftData : null)
  const isGalleryView = !activeData
  const showHero = activeData?.sections?.showHero !== false
  const showWelcome = isGalleryView ? true : (savedData ? (savedData.invitationData?.showWelcome ?? savedData.showWelcome ?? true) : (draftData?.showWelcome ?? true))
  const showStory = isGalleryView ? true : (savedData ? (savedData.invitationData?.showGallery ?? savedData.showGallery ?? true) : (draftData?.showGallery ?? true))
  const showSchedule = isGalleryView ? true : (savedData ? (savedData.invitationData?.showSchedule ?? savedData.showSchedule ?? true) : (draftData?.showSchedule ?? true))
  const showVenue = isGalleryView ? true : (savedData ? (savedData.invitationData?.showVenue ?? savedData.showVenue ?? true) : (draftData?.showVenue ?? true))
  const showCountdown = isGalleryView ? true : (savedData ? (savedData.invitationData?.showCountdown ?? savedData.showCountdown ?? true) : (draftData?.showCountdown ?? true))
  const showRsvp = savedData
    ? (savedData.invitationData?.hasRsvp !== undefined
        ? Boolean(savedData.invitationData.hasRsvp)
        : Boolean(savedData.rsvpData?.enabled || savedData.hasRsvp))
    : (draftData?.hasRsvp !== undefined ? Boolean(draftData.hasRsvp) : true)

  const customSectionData = savedData ? (savedData.invitationData || {}) : draftData

  // ── Watermark ─────────────────────────────────────────────────
  const WatermarkMobile = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.25] select-none">
      {['8%', '50%', '92%'].map(top => (
        <span
          key={top}
          className="absolute left-1/2 -translate-x-1/2 text-[16px] font-medium tracking-[0.22em] text-[#54121B]"
          style={{ top, fontFamily: "'Montserrat', sans-serif" }}
        >
          preview-inviteque
        </span>
      ))}
    </div>
  ) : null

  const WatermarkDesktop = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.16] select-none flex flex-col justify-around items-center text-[#54121B]">
      {['preview-inviteque', 'preview-inviteque'].map((t, i) => (
        <span key={i} className="text-[28px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {t}
        </span>
      ))}
    </div>
  ) : null

  // ── Preview nav ───────────────────────────────────────────────
  const PreviewNavMobile = () => isCustomPreview ? (
    <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
      <div className="flex gap-3">
        <button onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })} className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#54121B]/20 bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#54121B] shadow-xl hover:scale-105 active:scale-95">
          Back
        </button>
        <button onClick={() => navigate('/payment', { state: { draftData, templateId } })} className="flex-1 flex items-center justify-center gap-3 rounded-full bg-[#54121B] py-4 text-sm font-bold text-[#FDFBF7] shadow-xl hover:scale-105 active:scale-95">
          Proceed
        </button>
      </div>
    </div>
  ) : null

  const PreviewNavDesktop = () => isCustomPreview ? (
    <div className="fixed bottom-8 right-8 z-[110] flex gap-4">
      <button onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })} className="px-8 py-4 rounded-full border border-[#54121B]/25 bg-white/95 backdrop-blur-md text-sm font-bold text-[#54121B] shadow-xl hover:scale-105 active:scale-95">
        ← Back to Edit
      </button>
      <button onClick={() => navigate('/payment', { state: { draftData, templateId } })} className="px-10 py-4 rounded-full bg-[#54121B] text-sm font-bold text-[#FDFBF7] shadow-xl hover:scale-105 active:scale-95">
        Proceed →
      </button>
    </div>
  ) : null

  return (
    <div className="relative min-h-screen bg-[#FAF6EE] text-[#54121B]">
      {/* Background Music Player */}
      <audio
        ref={audioRef}
        src={data?.musicUrl || data?.music || bgMusicSrc}
        loop
        playsInline
        preload="auto"
      />

      {/* Floating Music Button */}
      {hasOpened && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onClick={toggleMusic}
          className="fixed bottom-6 right-4 z-50 p-3 rounded-full backdrop-blur-sm shadow-[0_4px_15px_rgba(84,18,27,0.35)] transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `#54121BEE`,
            color: '#FDFBF7',
            border: `1px solid #B8860B66`,
          }}
          aria-label="Toggle music"
        >
          {isMusicMuted ? <MusicOffIcon /> : <MusicOnIcon />}
        </motion.button>
      )}

      {/* Tap to Open Cover */}
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

      {/* ── MOBILE & TABLET VIEW ── */}
      <div className="lg:hidden flex justify-center items-start min-h-screen bg-[#F0E8D8]">
        <div className="relative w-full max-w-[768px] min-h-[100svh] bg-[#FAF6EE] shadow-[0_0_60px_rgba(0,0,0,0.10)]">
          <WatermarkMobile />
          <PreviewNavMobile />

          {/* 1. Hero Section */}
          {showHero && (
            <RajasthaniVowsHero
              data={heroData}
              isDesktop={false}
              hasTriggeredHeroBg={hasTriggeredHeroBg}
              hasTriggeredHeroText={hasTriggeredHeroText}
              hasOpened={hasOpened}
            />
          )}

          {/* Optional CustomSection if configured */}
          {customSectionData?.customTitle && (
            <CustomSection
              photoBgDesktop={defaultTemplateData.story.bgImageDesktop}
              photoBgMobile={defaultTemplateData.story.bgImageMobile}
              data={customSectionData}
            />
          )}

          {/* 2. Welcome Section */}
          {showWelcome && (
            <RajasthaniVowsWelcome
              data={welcomeData}
              isDesktop={false}
            />
          )}

          {/* 3. Story Section (Royal Heirloom style cascading polaroids) */}
          {showStory && (
            <RajasthaniVowsStory
              data={storyData}
              userPhotos={userPhotos}
              dateStr={dateStr}
              isDesktop={false}
            />
          )}

          {/* 4. Wedding Schedule Section (Royal Heirloom style S-Curve timeline) */}
          {showSchedule && (
            <RajasthaniVowsSchedule
              data={scheduleData}
              scheduleItems={userScheduleItems}
              weddingDate={weddingDate}
              weddingMonth={weddingMonth}
              weddingYear={weddingYear}
              isDesktop={false}
            />
          )}

          {/* 5. Venue Section */}
          {showVenue && (
            <RajasthaniVowsVenue
              data={venueData}
              isDesktop={false}
            />
          )}

          {/* 6. RSVP Section */}
          {showRsvp && (
            <InviteQRSVP
              events={userScheduleItems.length > 0 ? userScheduleItems : scheduleData.items}
              weddingCode={savedData?.code}
              groupSlug={groupSlug}
              isPreview={!savedData}
              theme="rajasthani"
              config={savedData?.rsvpData}
            />
          )}

          {/* 7. Countdown Section (Centered in top area) */}
          {showCountdown && (
            <RajasthaniVowsCountdown
              data={countdownData}
              isDesktop={false}
            />
          )}

          {/* 8. Footer */}
          <Footer
            data={{
              id: 'footer',
              gratitude: defaultTemplateData.footer.gratitude,
              family: defaultTemplateData.footer.family,
              names: `${heroData.groomName} & ${heroData.brideName}`,
            }}
            theme="rajasthani"
            isDesktop={false}
          />
        </div>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="hidden lg:block w-full min-h-screen bg-[#FAF6EE] relative">
        <WatermarkDesktop />
        <PreviewNavDesktop />

        <div className="w-full">
          {showHero && (
            <RajasthaniVowsHero
              data={heroData}
              isDesktop={true}
              hasTriggeredHeroBg={hasTriggeredHeroBg}
              hasTriggeredHeroText={hasTriggeredHeroText}
              hasOpened={hasOpened}
            />
          )}
        </div>

        {customSectionData?.customTitle && (
          <div className="w-full">
            <CustomSection
              photoBgDesktop={defaultTemplateData.story.bgImageDesktop}
              photoBgMobile={defaultTemplateData.story.bgImageMobile}
              data={customSectionData}
            />
          </div>
        )}

        <div className="w-full">
          {showWelcome && (
            <RajasthaniVowsWelcome
              data={welcomeData}
              isDesktop={true}
            />
          )}
        </div>

        {showStory && (
          <div className="w-full">
            <RajasthaniVowsStory
              data={storyData}
              userPhotos={userPhotos}
              dateStr={dateStr}
              isDesktop={true}
            />
          </div>
        )}

        {showSchedule && (
          <div className="w-full">
            <RajasthaniVowsSchedule
              data={scheduleData}
              scheduleItems={userScheduleItems}
              weddingDate={weddingDate}
              weddingMonth={weddingMonth}
              weddingYear={weddingYear}
              isDesktop={true}
            />
          </div>
        )}

        <div className="w-full">
          {showVenue && (
            <RajasthaniVowsVenue
              data={venueData}
              isDesktop={true}
            />
          )}
        </div>

        {showRsvp && (
          <div className="w-full">
            <InviteQRSVP
              events={userScheduleItems.length > 0 ? userScheduleItems : scheduleData.items}
              weddingCode={savedData?.code}
              groupSlug={groupSlug}
              isPreview={!savedData}
              theme="rajasthani"
              config={savedData?.rsvpData}
            />
          </div>
        )}

        <div className="w-full">
          {showCountdown && (
            <RajasthaniVowsCountdown
              data={countdownData}
              isDesktop={true}
            />
          )}
        </div>

        <div className="w-full">
          <Footer
            data={{
              id: 'footer',
              gratitude: defaultTemplateData.footer.gratitude,
              family: defaultTemplateData.footer.family,
              names: `${heroData.groomName} & ${heroData.brideName}`,
            }}
            theme="rajasthani"
            isDesktop={true}
          />
        </div>
      </div>
    </div>
  )
}
