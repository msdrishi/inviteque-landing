import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../../context/DraftContext.jsx'
import { weddingData as staticData } from '../../weddingData.js'

// Import Section Components
import EternalCovenantCoverAndHero from './EternalCovenantHero.jsx'
import EternalCovenantPhotoCards from './EternalCovenantPhotoCards.jsx'
import EternalCovenantWelcome from './EternalCovenantWelcome.jsx'
import EternalCovenantVenue from './EternalCovenantVenue.jsx'
import EternalCovenantSchedule from './EternalCovenantSchedule.jsx'
import EternalCovenantCountdown from './EternalCovenantCountdown.jsx'
import InviteQRSVP from '../../components/InviteQRSVP.jsx'
import Footer from '../../components/Footer.jsx'
import { resolveInvitationFeatures } from '../../utils/invitationFeatures.js'
import TemplatePreviewBar from '../../components/TemplatePreviewBar.jsx'
import { COLORS } from './theme.jsx'

// Audio control icons
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

export default function TemplateEternalCovenant({ savedData, groupSlug: propGroupSlug }) {
  const location = useLocation()
  const { templateId } = useParams()
  const navigate = useNavigate()
  const { draftData: _rawDraft } = useDraft()
  const isCustomPreview = new URLSearchParams(location.search).get('customPreview') === 'true'
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const draftData = isCustomPreview ? (_rawDraft || {}) : {}
  const groupSlug = propGroupSlug || new URLSearchParams(location.search).get('group')
  const activeData = savedData || (isCustomPreview ? draftData : null)

  // Tap-to-open interactive state
  const [hasOpened, setHasOpened] = useState(false)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const audioRef = useRef(null)

  // Responsive width check
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  )

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Audio initialization
  useEffect(() => {
    const audio = new Audio('/assets/audio/bg-music-a-thousand-years.mp3')
    audio.loop = true
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const handleOpenCover = () => {
    setHasOpened(true)
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true)
      }).catch((e) => {
        console.warn('Audio auto-play prevented:', e)
      })
    }
  }

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlayingMusic) {
      audioRef.current.pause()
      setIsPlayingMusic(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true)
      }).catch(e => console.warn(e))
    }
  }

  const defaultEvents = useMemo(() => [
    {
      id: 'thanksgiving',
      name: 'THANKSGIVING SERVICE',
      title: 'Thanksgiving Service',
      time: '04:00 PM',
      date: '27 NOVEMBER 2026',
      venue: 'Cathedral Chapel',
      description: 'Praise, prayer, and solemn family blessings.',
    },
    {
      id: 'nuptials',
      name: 'HOLY MATRIMONY',
      title: 'Holy Matrimony Nuptials',
      time: '05:30 PM',
      date: '27 NOVEMBER 2026',
      venue: 'Main Cathedral Altar',
      description: 'Exchange of vows, rings, and the sacred marital covenant.',
    },
    {
      id: 'reception',
      name: 'WEDDING BANQUET',
      title: 'Wedding Banquet & Toast',
      time: '07:00 PM',
      date: '27 NOVEMBER 2026',
      venue: 'The Grand Ballroom',
      description: 'Cake cutting, celebratory toasts, dinner, and music.',
    },
  ], [])

  // Centralized Feature Resolution per Rule 2
  const {
    isPaid,
    showWatermark,
    showRsvp,
    showPhotoCards,
    showGallery,
    showSchedule,
    showVenue,
    showWelcome,
    showCountdown,
    events,
    photos,
  } = resolveInvitationFeatures({
    savedData,
    draftData,
    isCustomPreview,
    isPreview,
  })

  // Format couple & event data
  const coupleData = {
    headerText: (savedData ? (savedData.heroData?.headerText || savedData.headerText) : draftData?.headerText) || 'Inviting you for our special day',
    brideName: (savedData ? (savedData.coupleData?.brideName || savedData.brideName) : draftData?.brideName) || 'SHREYA',
    groomName: (savedData ? (savedData.coupleData?.groomName || savedData.groomName) : draftData?.groomName) || 'SUMIT',
    weddingDate: (savedData ? (savedData.weddingDate) : draftData?.weddingDate) || '2026-11-27',
    weddingTime: (savedData ? (savedData.weddingTime) : draftData?.weddingTime) || '7:00 PM ONWARDS',
    churchName: (savedData ? (savedData.venueName) : draftData?.venueName) || 'St. Mary’s Cathedral',
    city: (savedData ? (savedData.city) : draftData?.city) || 'Bangalore, India',
    addressLine1: (savedData ? (savedData.addressLine1) : draftData?.addressLine1) || '80 Residency Road',
    addressLine2: (savedData ? (savedData.addressLine2) : draftData?.addressLine2) || 'Richmond Town, Bengaluru',
    pincode: (savedData ? (savedData.pincode) : draftData?.pincode) || 'Karnataka 560025',
    googleMapsUrl: (savedData ? (savedData.googleMapsUrl) : draftData?.googleMapsUrl) || 'https://maps.google.com',
  }

  const effectiveEvents = events && events.length > 0 ? events : defaultEvents

  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center select-none"
      style={{
        backgroundColor: COLORS.bgWhite,
        color: COLORS.darkText,
      }}
    >
      {/* Universal Builder Preview Bar per Rule 3 */}
      {isCustomPreview && (
        <TemplatePreviewBar
          templateId="eternal-covenant"
          draftData={draftData}
          primaryColor={COLORS.primary}
        />
      )}

      {/* Music Floating Action Button (Moved to Bottom-Right as requested!) */}
      {hasOpened && (
        <button
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? 'Mute Music' : 'Play Music'}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/90 backdrop-blur-md border border-[#B88E3E]/50 shadow-xl text-[#2D5A27] hover:scale-105 active:scale-95 transition-all"
        >
          {isPlayingMusic ? <MusicOnIcon /> : <MusicOffIcon />}
        </button>
      )}

      {/* Main Container - Standard mobile width max-w-[440px] for desktop centering */}
      <div className="w-full max-w-[440px] shadow-2xl relative flex flex-col items-center bg-white min-h-screen">
        {/* 1. Tap to Open Screen & Hero Section with Traveling Bouquet */}
        <EternalCovenantCoverAndHero
          data={coupleData}
          isDesktop={isDesktop}
          isPreview={isPreview || isCustomPreview}
          hasOpened={hasOpened}
          onOpen={handleOpenCover}
        />

        {/* Subsequent Sections - Visible after opening */}
        {hasOpened && (
          <div className="w-full flex flex-col items-center">
            {/* 2. Photo Cards / Journey */}
            {(showPhotoCards || showGallery) && (
              <EternalCovenantPhotoCards data={coupleData} photos={photos} />
            )}

            {/* 3. Welcome Note (Direct typography on white theme, no background image) */}
            {showWelcome && (
              <EternalCovenantWelcome data={coupleData} />
            )}

            {/* 4. Venue Section (Uses venue-mobile.webp with top area typography) */}
            {showVenue && (
              <EternalCovenantVenue data={coupleData} />
            )}

            {/* 5. Wedding Schedule (Order of Service) */}
            {showSchedule && (
              <EternalCovenantSchedule data={coupleData} events={effectiveEvents} />
            )}

            {/* 6. RSVP Section */}
            {showRsvp && (
              <section className="w-full min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 bg-white">
                <div className="w-full max-w-md">
                  <InviteQRSVP
                    events={effectiveEvents}
                    primaryColor={COLORS.primary}
                    accentColor={COLORS.gold}
                    groupSlug={groupSlug}
                  />
                </div>
              </section>
            )}

            {/* 7. Countdown */}
            {showCountdown && (
              <EternalCovenantCountdown data={coupleData} />
            )}

            {/* 8. Footer */}
            <Footer theme="light" />
          </div>
        )}
      </div>
    </div>
  )
}
