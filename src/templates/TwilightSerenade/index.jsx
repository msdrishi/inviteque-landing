import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../../context/DraftContext.jsx'
import Countdown from '../../components/Countdown.jsx'
import Events from '../../components/Events.jsx'
import Footer from '../../components/Footer.jsx'
import Invitation from './Invitation.jsx'
import Story from './Story.jsx'
import Venue from '../../components/Venue.jsx'
import CustomSection from '../../components/CustomSection.jsx'
import InviteQRSVP from '../../components/InviteQRSVP.jsx'
import TwilightSerenadeHero from './Hero.jsx'
import { weddingData as staticData } from '../../weddingData.js'

// Background asset URLs (local Vercel CDN)
const photoBgDesktop = "/assets/templates/twilight-serenade/photo-section-desktop.webp"
const photoBgMobile = "/assets/templates/twilight-serenade/photo-section-mobile.webp"
const messageBgDesktop = "/assets/templates/twilight-serenade/message-section-desktop.webp"
const messageBgMobile = "/assets/templates/twilight-serenade/message-section-mobile.webp"
const locationBgDesktop = "/assets/templates/twilight-serenade/location-section-desktop.webp"
const locationBgMobile = "/assets/templates/twilight-serenade/location-section-mobile.webp"
const countdownBgDesktop = "/assets/templates/twilight-serenade/countdown-section-desktop.webp"
const countdownBgMobile = "/assets/templates/twilight-serenade/countdown-section-mobile.webp"
const twilightPhoto1 = "/assets/templates/twilight-serenade/twilight-photo-1.webp"
const twilightPhoto2 = "/assets/templates/twilight-serenade/twilight-photo-2.webp"
const twilightPhoto3 = "/assets/templates/twilight-serenade/twilight-photo-3.webp"

export default function TemplateTwilightSerenade({ savedData, groupSlug: propGroupSlug }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const groupSlug = propGroupSlug || new URLSearchParams(location.search).get('group')

  // Watermark is shown unless the invitation has been paid
  const isPaid = savedData && (
    String(savedData.status).toUpperCase() === 'PAID' ||
    savedData.isPaid === true ||
    (savedData.coupleData && savedData.coupleData.isPaid === true)
  )
  const showWatermark = !isPaid

  // Determine active data source
  const activeData = savedData || (isPreview ? draftData : null)

  const data = activeData ? {
    ...staticData,
    hero: {
      ...staticData.hero,
      names: savedData
        ? `${savedData.coupleData?.groomName || savedData.groomName || 'Groom'} & ${savedData.coupleData?.brideName || savedData.brideName || 'Bride'}`
        : `${draftData?.groomName || 'Groom'} & ${draftData?.brideName || 'Bride'}`,
      groomName: savedData ? (savedData.coupleData?.groomName || savedData.groomName) : draftData?.groomName,
      brideName: savedData ? (savedData.coupleData?.brideName || savedData.brideName) : draftData?.brideName,
      dateLine: savedData
        ? `${savedData.heroData?.weddingDate || savedData.weddingDate?.day || savedData.weddingDate || '18'} ${savedData.heroData?.weddingMonth || savedData.weddingDate?.month || savedData.weddingMonth || 'December'} ${savedData.heroData?.weddingYear || savedData.weddingDate?.year || savedData.weddingYear || '2026'}`
        : `${draftData?.weddingDate || '18'} ${draftData?.weddingMonth || 'December'} ${draftData?.weddingYear || '2026'}`,
      weddingTime: savedData
        ? (savedData.heroData?.weddingTime || savedData.weddingTime || '09:00 AM - 10:30 AM')
        : (draftData?.weddingTime || '09:00 AM - 10:30 AM'),
      venueName: (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData?.mahalName) || '',
      venueCity: (savedData
        ? [savedData.venueData?.venueCity || savedData.venueCity, savedData.venueData?.state || savedData.state].filter(Boolean).join(', ')
        : [draftData?.venueCity, draftData?.state].filter(Boolean).join(', ')
      ) || '',
      addressParts: savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName,
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean)
        : [
            draftData?.mahalName,
            draftData?.venueAddress,
            draftData?.venueCity,
            draftData?.state
          ].map(s => String(s || '').trim()).filter(Boolean),
      fullAddress: savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName,
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData?.mahalName,
            draftData?.venueAddress,
            draftData?.venueCity,
            draftData?.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', '),
      hashtag: (() => {
        const groom = savedData ? (savedData.coupleData?.groomName || savedData.groomName) : draftData?.groomName
        const bride = savedData ? (savedData.coupleData?.brideName || savedData.brideName) : draftData?.brideName
        const gName = (groom || 'Groom').trim().replace(/\s+/g, '')
        const bName = (bride || 'Bride').trim().replace(/\s+/g, '')
        return `#${gName}${bName}Forever`
      })(),
      dayOfWeek: (() => {
        const month = savedData ? (savedData.heroData?.weddingMonth || savedData.weddingDate?.month) : draftData?.weddingMonth
        const date = savedData ? (savedData.heroData?.weddingDate || savedData.weddingDate?.day) : draftData?.weddingDate
        const year = savedData ? (savedData.heroData?.weddingYear || savedData.weddingDate?.year) : draftData?.weddingYear
        const d = new Date(`${month || 'December'} ${date || '18'}, ${year || '2026'}`)
        return isNaN(d.getTime()) ? 'Friday' : d.toLocaleDateString('en-US', { weekday: 'long' })
      })(),
    },
    venue: {
      ...staticData.venue,
      venueName: (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData?.mahalName) || '',
      venueLine1: savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData?.mahalName,
            draftData?.venueAddress
          ].map(s => String(s || '').trim()).filter(Boolean).join(', '),
      venueLine2: savedData
        ? [
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData?.venueCity,
            draftData?.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', '),
      location: savedData
        ? [
            savedData.venueData?.mahalName || savedData.mahalName,
            savedData.venueData?.venueAddress || savedData.venueName,
            savedData.venueData?.venueCity || savedData.venueCity,
            savedData.venueData?.state || savedData.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [
            draftData?.mahalName,
            draftData?.venueAddress,
            draftData?.venueCity,
            draftData?.state
          ].map(s => String(s || '').trim()).filter(Boolean).join(', '),
      mapUrl: (savedData ? (savedData.venueData?.mapLink || savedData.mapLink) : draftData?.mapLink) || staticData.venue.mapUrl,
    },
    countdown: {
      ...staticData.countdown,
      targetDateTimeISO: (() => {
        const m = savedData?.heroData?.weddingMonth || draftData?.weddingMonth
        const d = savedData?.heroData?.weddingDate || draftData?.weddingDate
        const y = savedData?.heroData?.weddingYear || draftData?.weddingYear
        if (m && d && y) {
          const dt = new Date(`${m} ${d}, ${y}`)
          if (!isNaN(dt.getTime())) return dt.toISOString()
        }
        return staticData.countdown.targetDateTimeISO
      })(),
    },
    story: {
      ...staticData.story,
      items: (() => {
        const photos = savedData
          ? (savedData.storyData?.photos || savedData.photos || [])
          : (draftData?.photos || [])
        const activePhotos = photos.filter(Boolean)
        return activePhotos.length > 0
          ? activePhotos.map(p => ({ image: p }))
          : [
              { image: twilightPhoto1 },
              { image: twilightPhoto2 },
              { image: twilightPhoto3 }
            ]
      })(),
    },
    events: {
      ...staticData.events,
      items: (() => {
        const scheduleItems = savedData
          ? (savedData.scheduleData?.items || savedData.eventSchedule || [])
          : (Array.isArray(draftData?.scheduleItems) ? draftData.scheduleItems : [])
        const icons = ['✦', '◎', '✿', '◆', '♪']
        return scheduleItems.map((item, index) => ({
          icon: icons[index % icons.length],
          time: item.time,
          name: item.title,
          date: item.date,
        }))
      })(),
    },
    invitation: {
      ...staticData.invitation,
      groomName: savedData ? (savedData.coupleData?.groomName || savedData.groomName) : draftData?.groomName,
      brideName: savedData ? (savedData.coupleData?.brideName || savedData.brideName) : draftData?.brideName,
    }
  } : {
    ...staticData,
    story: {
      ...staticData.story,
      items: [
        { image: twilightPhoto1 },
        { image: twilightPhoto2 },
        { image: twilightPhoto3 }
      ]
    }
  }

  const showGallery = savedData
    ? (savedData.invitationData?.showGallery !== undefined 
        ? Boolean(savedData.invitationData.showGallery)
        : (savedData.scheduleData?.showGallery !== undefined
            ? Boolean(savedData.scheduleData.showGallery)
            : true))
    : (draftData?.showGallery !== undefined ? Boolean(draftData.showGallery) : true)

  const showSchedule = savedData
    ? (savedData.invitationData?.showSchedule !== undefined 
        ? Boolean(savedData.invitationData.showSchedule)
        : (savedData.scheduleData?.showSchedule !== undefined
            ? Boolean(savedData.scheduleData.showSchedule)
            : true))
    : (draftData?.showSchedule !== undefined ? Boolean(draftData.showSchedule) : true)

  const customSectionData = savedData ? (savedData.invitationData || {}) : (draftData || {})
  const showRsvp = savedData 
    ? (savedData.invitationData?.hasRsvp !== undefined 
        ? Boolean(savedData.invitationData.hasRsvp) 
        : Boolean(savedData.rsvpData?.enabled || savedData.hasRsvp !== false)) 
    : (draftData?.hasRsvp !== undefined ? Boolean(draftData.hasRsvp) : true)

  const showCountdown = savedData
    ? (savedData.invitationData?.showCountdown !== undefined
        ? Boolean(savedData.invitationData.showCountdown)
        : (savedData.countdownData?.showCountdown !== undefined
            ? Boolean(savedData.countdownData.showCountdown)
            : true))
    : (draftData?.showCountdown !== undefined ? Boolean(draftData.showCountdown) : true)

  return (
    <div className="relative min-h-screen bg-[#FBF7F0] text-[#3D5236]">
      {/* MOBILE VIEW */}
      <div className="md:hidden flex justify-center items-start min-h-screen bg-[#1a1a1a]">
        <div className="relative w-full max-w-[430px] min-h-[100svh] bg-[#FBF7F0] text-[#3D5236] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          {/* Watermark */}
          {showWatermark && (
            <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.35] select-none text-[#3D5236]">
              <span className="absolute top-[8%] left-1/2 -translate-x-1/2 text-[18px] font-medium tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                preview-inviteque
              </span>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] font-medium tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                preview-inviteque
              </span>
              <span className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[18px] font-medium tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                preview-inviteque
              </span>
            </div>
          )}

          {/* Back/Proceed Controls */}
          {isPreview && (
            <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#3D5236]/20 bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#3D5236] shadow-xl hover:scale-105 active:scale-95"
                >
                  Back
                </button>
                <button
                  onClick={() => navigate('/payment', { state: { draftData, templateId } })}
                  className="flex-1 flex items-center justify-center gap-3 rounded-full bg-black py-4 text-sm font-bold text-white shadow-xl hover:scale-105 active:scale-95"
                >
                  Proceed
                </button>
              </div>
            </div>
          )}

          <TwilightSerenadeHero data={data.hero} isDesktop={false} />
          <CustomSection photoBgDesktop={photoBgDesktop} photoBgMobile={photoBgMobile} data={customSectionData} />
          {showGallery && <Story data={data.story} bgImage={photoBgMobile} />}
          <Invitation data={data.invitation} bgImage={messageBgMobile} />
          <Venue data={data.venue} bgImage={locationBgMobile} theme="green" />
          {showSchedule && <Events data={data.events} theme="green" bgImage={photoBgMobile} />}
          {showRsvp && (
            <InviteQRSVP
              events={data?.events?.items || []}
              weddingCode={savedData?.code}
              groupSlug={groupSlug}
              isPreview={!savedData}
              theme="green"
              config={savedData?.rsvpData}
            />
          )}
          {showCountdown && (
            <Countdown data={data.countdown} bgImage={countdownBgMobile} theme="green" />
          )}
          <Footer data={data.footer} theme="green" />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block w-full min-h-screen bg-[#FBF7F0] relative">
        {showWatermark && (
          <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.22] select-none flex flex-col justify-around items-center text-[#3D5236]">
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
            <span className="text-[32px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              preview-inviteque
            </span>
          </div>
        )}

        {isPreview && (
          <div className="fixed bottom-8 right-8 z-[110] flex gap-4">
            <button
              onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })}
              className="px-8 py-4 rounded-full border border-[#3D5236]/25 bg-white/95 backdrop-blur-md text-sm font-bold text-[#3D5236] shadow-xl hover:scale-105 active:scale-95"
            >
              ← Back to Edit
            </button>
            <button
              onClick={() => navigate('/payment', { state: { draftData, templateId } })}
              className="px-10 py-4 rounded-full bg-black text-sm font-bold text-white shadow-xl hover:scale-105 active:scale-95"
            >
              Proceed →
            </button>
          </div>
        )}

        <div className="w-full">
          <TwilightSerenadeHero data={data.hero} isDesktop={true} />
        </div>
        <div className="w-full">
          <CustomSection photoBgDesktop={photoBgDesktop} photoBgMobile={photoBgMobile} data={customSectionData} />
        </div>
        {showGallery && (
          <div className="w-full">
            <Story data={data.story} isDesktop={true} bgImage={photoBgDesktop} />
          </div>
        )}
        <div className="w-full">
          <Invitation data={data.invitation} isDesktop={true} bgImage={messageBgDesktop} />
        </div>
        <div className="w-full">
          <Venue data={data.venue} isDesktop={true} bgImage={locationBgDesktop} theme="green" />
        </div>
        {showSchedule && (
          <div className="w-full">
            <Events data={data.events} isDesktop={true} theme="green" bgImage={photoBgDesktop} />
          </div>
        )}
        {showRsvp && (
          <div className="w-full">
            <InviteQRSVP
              events={data?.events?.items || []}
              weddingCode={savedData?.code}
              groupSlug={groupSlug}
              isPreview={!savedData}
              theme="green"
              config={savedData?.rsvpData}
            />
          </div>
        )}
        <div className="w-full">
          {showCountdown && (
            <Countdown data={data.countdown} isDesktop={true} bgImage={countdownBgDesktop} theme="green" />
          )}
        </div>
        <div className="w-full">
          <Footer data={data.footer} isDesktop={true} theme="green" />
        </div>
      </div>
    </div>
  )
}
