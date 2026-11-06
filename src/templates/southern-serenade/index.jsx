import React, { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../../context/DraftContext.jsx'
import { weddingData as staticData } from '../../weddingData.js'

// Import Section Components (Each separate and easily modifiable)
import SouthernSerenadeHero from './SouthernSerenadeHero.jsx'
import SouthernSerenadePhotoCards from './SouthernSerenadePhotoCards.jsx'
import SouthernSerenadeWelcome from './SouthernSerenadeWelcome.jsx'
import SouthernSerenadeVenue from './SouthernSerenadeVenue.jsx'
import SouthernSerenadeSchedule from './SouthernSerenadeSchedule.jsx'
import SouthernSerenadeCountdown from './SouthernSerenadeCountdown.jsx'
import SouthernSerenadeEventSection from './SouthernSerenadeEventSection.jsx'
import InviteQRSVP from '../../components/InviteQRSVP.jsx'
import Footer from '../../components/Footer.jsx'
import { resolveInvitationFeatures } from '../../utils/invitationFeatures.js'
import TemplatePreviewBar from '../../components/TemplatePreviewBar.jsx'
import { ASSETS } from './theme.jsx'

export default function TemplateSouthernSerenade({ savedData, groupSlug: propGroupSlug }) {
  const location = useLocation()
  const { templateId } = useParams()
  const navigate = useNavigate()
  const { draftData: _rawDraft } = useDraft()
  const isCustomPreview = new URLSearchParams(location.search).get('customPreview') === 'true'
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const draftData = isCustomPreview ? (_rawDraft || {}) : {}
  const groupSlug = propGroupSlug || new URLSearchParams(location.search).get('group')
  const activeData = savedData || (isCustomPreview ? draftData : null)

  // Standard synchronized default events: Haldi, Wedding, Reception
  const defaultEvents = useMemo(() => [
    {
      id: 'haldi',
      name: 'HALDI CEREMONY',
      title: 'Haldi Ceremony',
      time: '10:00 AM',
      date: '25 NOVEMBER 2026',
      description: 'Auspicious turmeric ceremony filled with love and familial warmth.',
    },
    {
      id: 'wedding',
      name: 'WEDDING CEREMONY',
      title: 'Wedding Ceremony',
      time: '11:00 AM',
      date: '26 NOVEMBER 2026',
      description: 'The sacred hour of Mangalya Dharana and the Seven Sacred Steps.',
    },
    {
      id: 'reception',
      name: 'GRAND RECEPTION',
      title: 'Grand Reception',
      time: '07:00 PM',
      date: '26 NOVEMBER 2026',
      description: 'An evening of celebration with loved ones, dinner, and blessings.',
    },
  ], [])

  // ── Data assembly ─────────────────────────────────────────────
  const data = activeData ? {
    ...staticData,
    hero: {
      ...staticData.hero,
      groomName: (savedData ? (savedData.coupleData?.groomName || savedData.groomName) : draftData?.groomName) || 'Abhishek',
      brideName: (savedData ? (savedData.coupleData?.brideName || savedData.brideName) : draftData?.brideName) || 'Anaya',
      dateLine: (() => {
        if (savedData?.heroData?.weddingDate && savedData?.heroData?.weddingMonth) {
          return `${savedData.heroData.weddingDate} ${savedData.heroData.weddingMonth} ${savedData.heroData.weddingYear || ''}`.trim()
        }
        if (draftData?.weddingDate && draftData?.weddingMonth) {
          return `${draftData.weddingDate} ${draftData.weddingMonth} ${draftData.weddingYear || ''}`.trim()
        }
        return '26 NOVEMBER 2026'
      })(),
      dayOfWeek: (() => {
        const month = savedData ? (savedData.heroData?.weddingMonth || savedData.weddingMonth) : draftData?.weddingMonth
        const date  = savedData ? (savedData.heroData?.weddingDate || savedData.weddingDate)   : draftData?.weddingDate
        const year  = savedData ? (savedData.heroData?.weddingYear || savedData.weddingYear)   : draftData?.weddingYear
        if (month && date && year) {
          const d = new Date(`${month} ${date}, ${year}`)
          if (!isNaN(d.getTime())) return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
        }
        return 'THU'
      })(),
      weddingTime: (savedData && savedData.heroData?.weddingTime !== undefined)
        ? savedData.heroData.weddingTime
        : ((savedData && savedData.weddingTime !== undefined)
            ? savedData.weddingTime
            : (draftData?.weddingTime || (savedData ? null : '11:00 AM ONWARDS'))),
      venueName: (savedData ? (savedData.heroData?.mahalName || savedData.venueData?.mahalName || savedData.mahalName) : draftData?.mahalName) || 'SRI NARAYANA VANAM',
      venueCity: (savedData ? (savedData.heroData?.venueCity || savedData.venueData?.venueCity || savedData.venueCity) : draftData?.venueCity) || 'HYDERABAD, TELANGANA',
    },
    venue: {
      ...staticData.venue,
      venueName: (savedData ? (savedData.venueData?.mahalName || savedData.mahalName) : draftData?.mahalName) || 'SRI NARAYANA VANAM',
      venueLine1: savedData
        ? [savedData.venueData?.mahalName, savedData.venueData?.venueAddress].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [draftData?.mahalName, draftData?.venueAddress].map(s => String(s || '').trim()).filter(Boolean).join(', ') || 'Sri Narayana Vanam Mahal, Financial District',
      venueLine2: savedData
        ? [savedData.venueData?.venueCity, savedData.venueData?.state].map(s => String(s || '').trim()).filter(Boolean).join(', ')
        : [draftData?.venueCity, draftData?.state].map(s => String(s || '').trim()).filter(Boolean).join(', ') || 'Gachibowli, Hyderabad, Telangana',
      mapUrl: (savedData ? (savedData.venueData?.mapLink || savedData.mapLink) : draftData?.mapLink) || staticData.venue?.mapUrl || 'https://maps.google.com',
    },
    countdown: {
      ...staticData.countdown,
      targetDateTimeISO: (() => {
        if (savedData?.countdown?.targetDateTimeISO) return savedData.countdown.targetDateTimeISO
        if (savedData?.heroData?.weddingMonth && savedData?.heroData?.weddingDate && savedData?.heroData?.weddingYear) {
          const d = new Date(`${savedData.heroData.weddingMonth} ${savedData.heroData.weddingDate}, ${savedData.heroData.weddingYear}`)
          if (!isNaN(d.getTime())) return d.toISOString()
        }
        if (draftData?.weddingMonth && draftData?.weddingDate && draftData?.weddingYear) {
          const d = new Date(`${draftData.weddingMonth} ${draftData.weddingDate}, ${draftData.weddingYear}`)
          if (!isNaN(d.getTime())) return d.toISOString()
        }
        return '2026-11-26T11:00:00'
      })(),
    },
    story: {
      ...staticData.story,
      items: (() => {
        const photos = savedData ? (savedData.storyData?.photos || []) : (draftData?.photos || [])
        const active = photos.filter(Boolean)
        return active.length > 0 ? active.map(p => ({ image: p })) : []
      })(),
    },
    events: {
      ...staticData.events,
      items: (() => {
        const scheduleItems = savedData
          ? (savedData.scheduleData?.items || [])
          : (Array.isArray(draftData?.scheduleItems) && draftData.scheduleItems.length > 0 ? draftData.scheduleItems : defaultEvents)
        return scheduleItems
      })(),
    },
    invitation: {
      ...staticData.invitation,
      message: activeData ? (savedData ? (savedData.invitationData?.welcomeMessage || savedData.invitation?.message) : draftData?.welcomeMessage) : '',
    },
  } : {
    ...staticData,
    hero: {
      groomName: 'Abhishek',
      brideName: 'Anaya',
      dateLine: '26 NOVEMBER 2026',
      dayOfWeek: 'THURSDAY',
      weddingTime: '11:00 AM ONWARDS',
      venueName: 'SRI NARAYANA VANAM',
      venueCity: 'HYDERABAD, TELANGANA',
    },
    venue: {
      venueName: 'SRI NARAYANA VANAM',
      venueLine1: 'Sri Narayana Vanam Mahal, Financial District',
      venueLine2: 'Gachibowli, Hyderabad, Telangana',
      mapUrl: 'https://maps.google.com',
    },
    countdown: {
      targetDateTimeISO: '2026-11-26T11:00:00',
    },
    story: {
      items: [],
    },
    events: {
      items: defaultEvents,
    },
    invitation: {
      message: 'With the divine blessings of the Almighty and our ancestors, we cordially invite you and your family to celebrate the auspicious union of our children. Your presence and heartfelt blessings will make this sacred occasion truly memorable.',
    },
  }

  const customEvents = activeData?.customEvents || savedData?.customEvents || null

  // Centralized, dynamic feature & visibility resolution across all templates
  const {
    showWatermark,
    showRsvp: effectiveShowRsvp,
    showPhotoCards,
    showSchedule,
    showVenue,
    photos: userPhotos,
  } = resolveInvitationFeatures({
    savedData,
    draftData,
    isCustomPreview,
    isPreview,
    customEvents,
  })

  // ── Preview Watermarks ─────────────────────────────────────────
  const WatermarkMobile = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] opacity-[0.28] select-none">
      {['8%', '50%', '92%'].map(top => (
        <span
          key={top}
          className="absolute left-1/2 -translate-x-1/2 text-[17px] font-medium tracking-[0.2em] text-[#731924]"
          style={{ top, fontFamily: "'Montserrat', sans-serif" }}
        >
          preview-inviteque
        </span>
      ))}
    </div>
  ) : null

  const WatermarkDesktop = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.16] select-none flex flex-col justify-around items-center text-[#731924]">
      {['preview-inviteque', 'preview-inviteque'].map((t, i) => (
        <span key={i} className="text-[30px] font-medium tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {t}
        </span>
      ))}
    </div>
  ) : null

  // ── Render Template Sections ──────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#F8F3EA] text-[#352520]">
      {/* ── MOBILE & TABLET VIEW ── */}
      <div className="lg:hidden flex justify-center items-start min-h-screen bg-[#F0E8D8]">
        <div className="relative w-full max-w-[768px] min-h-[100svh] bg-[#F8F3EA] shadow-[0_0_60px_rgba(0,0,0,0.10)]">
          <WatermarkMobile />
          {isCustomPreview && (
            <TemplatePreviewBar templateId="southern-serenade" draftData={draftData} primaryColor="#731924" />
          )}

          {/* 1. Hero Section */}
          <SouthernSerenadeHero data={data.hero} isDesktop={false} />

          {/* 2. Photo Cards Section */}
          {showPhotoCards && (
            <SouthernSerenadePhotoCards
              groomName={data.hero.groomName}
              brideName={data.hero.brideName}
              photos={userPhotos}
              isDesktop={false}
            />
          )}

          {/* 3. Welcome Section (using Welcome Tray artwork directly, no div banner) */}
          <SouthernSerenadeWelcome data={data.invitation} isDesktop={false} />

          {/* Dedicated Custom Event Sections (if provided) */}
          {customEvents && customEvents.map((event) => (
            <SouthernSerenadeEventSection key={event.id} event={event} isDesktop={false} />
          ))}

          {/* 4. Venue Section (directly on venue artwork, no div banner) */}
          {showVenue && (
            <SouthernSerenadeVenue data={data.venue} isDesktop={false} />
          )}

          {/* 5. Wedding Schedule (Royal Heirloom style S-Curve, Haldi/Wedding/Reception) */}
          {showSchedule && (
            <SouthernSerenadeSchedule data={data.events} isDesktop={false} />
          )}

          {/* 6. Default RSVP with matching theme color & matching events */}
          {effectiveShowRsvp && (
            <div className="relative w-full overflow-hidden">
              <img
                src={ASSETS.plainBg}
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <InviteQRSVP
                  events={data?.events?.items || defaultEvents}
                  weddingCode={savedData?.code}
                  groupSlug={groupSlug}
                  isPreview={!savedData}
                  theme="southern-serenade"
                  config={savedData?.rsvpData}
                />
              </div>
            </div>
          )}

          {/* 7. Countdown Section (directly on gopuram artwork, no div banner) */}
          <SouthernSerenadeCountdown data={data.countdown} isDesktop={false} />

          {/* 8. InviteQue Footer */}
          <Footer data={data.footer} theme="traditional" isDesktop={false} />
        </div>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="hidden lg:block w-full min-h-screen bg-[#F8F3EA] relative">
        <WatermarkDesktop />
        {isCustomPreview && (
          <TemplatePreviewBar templateId="southern-serenade" draftData={draftData} primaryColor="#731924" />
        )}

        {/* 1. Hero Section */}
        <SouthernSerenadeHero data={data.hero} isDesktop={true} />

        {/* 2. Photo Cards Section */}
        {showPhotoCards && (
          <SouthernSerenadePhotoCards
            groomName={data.hero.groomName}
            brideName={data.hero.brideName}
            photos={userPhotos}
            isDesktop={true}
          />
        )}

        {/* 3. Welcome Section */}
        <SouthernSerenadeWelcome data={data.invitation} isDesktop={true} />

        {/* Dedicated Custom Event Sections (if provided) */}
        {customEvents && customEvents.map((event) => (
          <SouthernSerenadeEventSection key={event.id} event={event} isDesktop={true} />
        ))}

        {/* 4. Venue Section */}
        {showVenue && (
          <SouthernSerenadeVenue data={data.venue} isDesktop={true} />
        )}

        {/* 5. Wedding Schedule */}
        {showSchedule && (
          <SouthernSerenadeSchedule data={data.events} isDesktop={true} />
        )}

        {/* 6. Default RSVP */}
        {effectiveShowRsvp && (
          <div className="relative w-full overflow-hidden py-10">
            <img
              src={ASSETS.plainBg}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 0,
              }}
            />
            <div className="relative z-10 w-full max-w-2xl mx-auto">
              <InviteQRSVP
                events={data?.events?.items || defaultEvents}
                weddingCode={savedData?.code}
                groupSlug={groupSlug}
                isPreview={!savedData}
                theme="southern-serenade"
                config={savedData?.rsvpData}
              />
            </div>
          </div>
        )}

        {/* 7. Countdown Section */}
        <SouthernSerenadeCountdown data={data.countdown} isDesktop={true} />

        {/* 8. InviteQue Footer */}
        <Footer data={data.footer} theme="traditional" isDesktop={true} />
      </div>
    </div>
  )
}
