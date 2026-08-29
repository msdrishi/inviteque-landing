import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import { pavitraSriData } from '../../data/custom/pavitraSriData.js'
import { API_URL } from '../../config.js'

// Reusable Editor Tab Components
import CoupleHeroTab from '../../components/customEditor/CoupleHeroTab.jsx'
import OurStoryTab from '../../components/customEditor/OurStoryTab.jsx'
import PhotoMomentsTab from '../../components/customEditor/PhotoMomentsTab.jsx'
import WelcomeNoteTab from '../../components/customEditor/WelcomeNoteTab.jsx'
import MultiEventsTab from '../../components/customEditor/MultiEventsTab.jsx'
import CountdownTab from '../../components/customEditor/CountdownTab.jsx'
import RsvpRegistryTab from '../../components/customEditor/RsvpRegistryTab.jsx'
import SectionTogglesTab from '../../components/customEditor/SectionTogglesTab.jsx'
import SplashScreen from '../../components/SplashScreen.jsx'

const logo = "/assets/logo/inviteq-logo.png"

export default function CustomTemplateEditor() {
  const { templateId = 'midnight-waltz', customSlug = 'Pavitra-Sri', variant = '1' } = useParams()
  const { user, loading: authLoading, saveInvitation } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showSplash, setShowSplash] = useState(true)

  const storageKey = useMemo(() => {
    return `inviteque_custom_data_${templateId}_${customSlug}_v${variant}`
  }, [templateId, customSlug, variant])

  const [activeTab, setActiveTab] = useState('couple') // couple, story, photos, welcome, events, countdown, rsvp, sections

  // Default events based on variant
  const defaultEvents = useMemo(() => {
    if (variant === '2') {
      const weddingEvents = pavitraSriData.events.filter(e => e.isWeddingOnly)
      return weddingEvents.length > 0 ? weddingEvents.map(e => ({ ...e })) : [pavitraSriData.events[pavitraSriData.events.length - 1]]
    }
    return pavitraSriData.events.map(e => ({ ...e }))
  }, [variant])

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        return JSON.parse(saved)
      }
      // Also check fallback key without variant if variant is 1
      if (variant === '1') {
        const fallback = localStorage.getItem(`inviteque_custom_data_${templateId}_${customSlug}`)
        if (fallback) return JSON.parse(fallback)
      }
    } catch (e) {
      console.warn('Failed to load custom data:', e)
    }

    return {
      // Couple & Hero
      groomName: pavitraSriData.hero.groomName || 'Sri',
      brideName: pavitraSriData.hero.brideName || 'Pavitra',
      weddingDate: pavitraSriData.hero.weddingDate || '15',
      weddingMonth: pavitraSriData.hero.weddingMonth || 'July',
      weddingYear: pavitraSriData.hero.weddingYear || '2026',
      weddingTime: pavitraSriData.hero.weddingTime || '09:00 AM - 10:30 AM',
      heroSubtitle: pavitraSriData.hero.subtitle || 'Are Getting Married',

      // Our Story
      storyQuote: pavitraSriData.story.quote || '"Two lives, one shared dream of a lifetime together."',
      storyMessage: pavitraSriData.story.message || 'From casual conversations to unforgettable moments, our path led us to this special day. We are blessed to begin this new chapter filled with love, laughter, and lifelong partnership.',

      // Photo Moments (3 Photos)
      photos: pavitraSriData.moments.photos.map(p => p.image),

      // Welcome Message
      welcomeLabel: pavitraSriData.welcome.label || 'Welcome',
      welcomeHeading1: pavitraSriData.welcome.headingLine1 || 'Dear Friends',
      welcomeHeading2: pavitraSriData.welcome.headingLine2 || '& Family,',
      welcomeMessage: pavitraSriData.welcome.message || 'With great joy and grateful hearts, we invite you to be part of our wedding celebrations. Your love and presence mean the world to us.',

      // Multi-Event Ceremonies
      events: defaultEvents,

      // Countdown
      countdownTargetDate: pavitraSriData.countdown.targetDate || '2026-07-15',

      // RSVP & Registry
      rsvpTitle: pavitraSriData.celebrate.rsvp?.title || 'RSVP & Guest Confirmation',
      rsvpDescription: pavitraSriData.celebrate.rsvp?.description || 'Kindly let us know if you will be able to join us on our special day.',
      rsvpButtonLabel: pavitraSriData.celebrate.rsvp?.buttonLabel || 'RSVP Online',
      rsvpUrl: pavitraSriData.celebrate.rsvp?.url || `/template/${templateId}/${customSlug}/rsvp`,
      hasRsvp: true,

      registryTitle: pavitraSriData.celebrate.registry?.title || 'Wedding Registry',
      registryDescription: pavitraSriData.celebrate.registry?.description || 'Your presence is our present. Should you wish to honor us with a gift, details are available here.',
      registryButtonLabel: pavitraSriData.celebrate.registry?.buttonLabel || 'View Registry',
      registryUrl: pavitraSriData.celebrate.registry?.url || '#',
      hasRegistry: pavitraSriData.celebrate.registry?.enabled ?? true,

      // Section Visibility Toggles
      sections: {
        showHero: true,
        showStory: true,
        showGallery: true,
        showWelcome: true,
        showVenue: true,
        showCountdown: true,
        hasRsvp: true,
      }
    }
  })

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // 1. Authentication Guard & DB Preload
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true })
      } else {
        const timer = setTimeout(() => setShowSplash(false), 900)
        return () => clearTimeout(timer)
      }
    }
  }, [user, authLoading, navigate, location.pathname])

  useEffect(() => {
    const fetchDbData = async () => {
      if (!user?.token) return
      try {
        const res = await fetch(`${API_URL}/api/invites/PAVITRASRI`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        })
        if (res.ok) {
          const inv = await res.json()
          if (inv) {
            const groom = inv.groomName || inv.coupleData?.groomName
            const bride = inv.brideName || inv.coupleData?.brideName
            const day = inv.weddingDate || inv.heroData?.weddingDate
            const month = inv.weddingMonth || inv.heroData?.weddingMonth
            const year = inv.weddingYear || inv.heroData?.weddingYear
            const time = inv.weddingTime || inv.heroData?.weddingTime
            const photos = inv.photos || inv.storyData?.photos
            const schedule = inv.eventSchedule || inv.scheduleData?.items

            setFormData(prev => ({
              ...prev,
              groomName: groom || prev.groomName,
              brideName: bride || prev.brideName,
              weddingDate: day || prev.weddingDate,
              weddingMonth: month || prev.weddingMonth,
              weddingYear: year || prev.weddingYear,
              weddingTime: time || prev.weddingTime,
              photos: photos && Array.isArray(photos) && photos.filter(Boolean).length >= 3 ? photos : prev.photos,
              storyQuote: inv.invitationData?.customSectionSubtitle || inv.customSectionSubtitle || prev.storyQuote,
              storyMessage: inv.invitationData?.customSectionContent || inv.customSectionContent || prev.storyMessage,
              welcomeMessage: inv.invitationData?.familyMessage || inv.familyMessage || prev.welcomeMessage,
              events: (schedule && Array.isArray(schedule) && schedule.length > 0)
                ? (variant === '2' ? schedule.slice(schedule.length - 1) : schedule).map((ev, i) => ({
                    id: `evt-${i + 1}`,
                    label: ev.title || 'Ceremony',
                    eventName: ev.title || 'Ceremony',
                    date: `${day || prev.weddingDate} ${month || prev.weddingMonth} ${year || prev.weddingYear}`,
                    time: ev.time || time || '04:00 PM',
                    venueName: inv.mahalName || inv.venueData?.mahalName || prev.events[0]?.venueName,
                    venueLine1: inv.venueAddress || inv.venueData?.venueAddress || prev.events[0]?.venueLine1,
                    venueLine2: inv.venueCity || inv.venueData?.venueCity || prev.events[0]?.venueLine2,
                    mapUrl: inv.mapLink || inv.venueData?.mapLink || prev.events[0]?.mapUrl,
                    isWeddingOnly: i === 0
                  }))
                : prev.events
            }))
          }
        }
      } catch (err) {
        console.warn('Initial DB fetch notice:', err)
      }
    }

    fetchDbData()
  }, [user, variant])

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSectionToggle = (sectionName) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionName]: !prev.sections[sectionName]
      }
    }))
  }

  const handlePhotoUpload = (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('Photo must be under 10MB')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    const newPhotos = [...formData.photos]
    newPhotos[index] = previewUrl
    setFormData(prev => ({ ...prev, photos: newPhotos }))
  }

  // Multi-Event Handlers
  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...formData.events]
    updatedEvents[index] = { ...updatedEvents[index], [field]: value }
    setFormData(prev => ({ ...prev, events: updatedEvents }))
  }

  const handleAddEvent = () => {
    const newEvent = {
      id: `custom-event-${Date.now()}`,
      label: 'Ceremony',
      eventName: 'New Ceremony Event',
      date: `${formData.weddingDate} ${formData.weddingMonth} ${formData.weddingYear}`,
      time: '04:00 PM - 06:00 PM',
      venueName: formData.events[0]?.venueName || 'The Leela Palace',
      venueLine1: formData.events[0]?.venueLine1 || '23 Old Airport Road',
      venueLine2: formData.events[0]?.venueLine2 || 'Bangalore, Karnataka',
      mapUrl: formData.events[0]?.mapUrl || 'https://maps.google.com',
      isWeddingOnly: variant === '2',
    }
    setFormData(prev => ({ ...prev, events: [...prev.events, newEvent] }))
  }

  const handleDuplicateEvent = (index) => {
    const itemToClone = formData.events[index]
    if (!itemToClone) return
    const cloned = {
      ...itemToClone,
      id: `custom-event-${Date.now()}`,
      label: `${itemToClone.label || 'Ceremony'} (Copy)`,
      eventName: `${itemToClone.eventName || 'Ceremony'} (Copy)`
    }
    const newEvents = [...formData.events]
    newEvents.splice(index + 1, 0, cloned)
    setFormData(prev => ({ ...prev, events: newEvents }))
  }

  const handleDeleteEvent = (index) => {
    if (formData.events.length <= 1) {
      alert('You must have at least one ceremony event.')
      return
    }
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)

    try {
      // 1. Save locally for instant live reflection for this specific variant
      localStorage.setItem(storageKey, JSON.stringify(formData))
      localStorage.setItem(`inviteque_custom_data_${templateId}_${customSlug}`, JSON.stringify(formData))

      // 2. Persist to backend database gracefully
      if (user?.token && saveInvitation) {
        try {
          const payload = {
            templateId,
            code: 'PAVITRASRI',
            coupleNames: `${formData.groomName || ''} & ${formData.brideName || ''}`.trim(),
            groomName: formData.groomName,
            brideName: formData.brideName,
            weddingDate: {
              day: formData.weddingDate,
              month: formData.weddingMonth,
              year: formData.weddingYear
            },
            weddingTime: formData.weddingTime,
            mahalName: formData.events[0]?.venueName,
            venueAddress: formData.events[0]?.venueLine1,
            venueCity: formData.events[0]?.venueLine2,
            venueName: formData.events[0]?.venueName,
            mapLink: formData.events[0]?.mapUrl,
            photos: formData.photos,
            eventSchedule: formData.events.map(ev => ({ time: ev.time, title: ev.eventName })),
            status: 'PAID',
            hasRsvp: Boolean(formData.sections.hasRsvp),
            scheduleData: {
              showSchedule: formData.sections.showVenue,
              showGallery: formData.sections.showGallery,
              items: formData.events.map(ev => ({ time: ev.time, title: ev.eventName }))
            },
            storyData: {
              photos: formData.photos
            },
            invitationData: {
              showGallery: formData.sections.showGallery,
              showSchedule: formData.sections.showVenue,
              hasRsvp: Boolean(formData.sections.hasRsvp),
              familyMessage: formData.welcomeMessage,
              customSectionSubtitle: formData.storyQuote,
              customSectionContent: formData.storyMessage,
            },
            rsvpData: {
              enabled: Boolean(formData.sections.hasRsvp),
              allowGuestCount: true,
              allowEventSelection: true,
              allowMessage: true,
              allowMaybe: false,
            }
          }

          await saveInvitation(payload)
        } catch (dbErr) {
          console.warn('Backend DB sync note:', dbErr.message)
        }
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err) {
      console.error('Save error:', err)
      alert(err.message || 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const liveUrl = `/template/${templateId}/${customSlug}/${variant}`

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-saas text-slate-900 flex flex-col relative">
      {/* Luxury Splash Screen overlay (Identical to other templates) */}
      <SplashScreen loading={showSplash || authLoading} />
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Inviteque" className="h-7 w-auto" />
              <span className="font-parisienne text-xl font-normal text-slate-900 leading-none hidden sm:inline">Inviteque</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Bespoke Editor
              </span>
              <span className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                Variant {variant}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <Link
                to={`/template/${templateId}/${customSlug}/1/edit`}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  variant === '1' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Variant 1 (All Events)
              </Link>
              <Link
                to={`/template/${templateId}/${customSlug}/2/edit`}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  variant === '2' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Variant 2 (Wedding Only)
              </Link>
            </div>

            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <span>👁️</span> <span className="hidden sm:inline">View Live</span>
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 text-xs font-bold transition shadow-md flex items-center gap-1.5 disabled:opacity-50 active:scale-98"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 space-y-6">
        
        {/* Title Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Personalize Your Invitation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                Edition {variant}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {variant === '2'
                ? 'Editing Wedding Ceremony Only edition. Changes made here apply specifically to Variant 2.'
                : 'Editing Full Celebration edition (Haldi, Mehendi, Reception, Wedding). Changes apply to Variant 1.'}
            </p>
          </div>

          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 flex items-center gap-2 self-start"
            >
              <span>✓</span> Variant {variant} changes saved successfully!
            </motion.div>
          )}
        </div>

        {/* Variant Switcher on Mobile */}
        <div className="sm:hidden flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <Link
            to={`/template/${templateId}/${customSlug}/1/edit`}
            className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition ${
              variant === '1' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Variant 1 (All Events)
          </Link>
          <Link
            to={`/template/${templateId}/${customSlug}/2/edit`}
            className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition ${
              variant === '2' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Variant 2 (Wedding Only)
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {[
            { id: 'couple', label: '1. Couple & Date', icon: '💍' },
            { id: 'story', label: '2. Our Story', icon: '📖' },
            { id: 'photos', label: '3. Photo Moments', icon: '🖼️' },
            { id: 'welcome', label: '4. Welcome Note', icon: '💌' },
            { id: 'events', label: '5. Multi-Events', icon: '🏛️' },
            { id: 'countdown', label: '6. Countdown', icon: '⏳' },
            { id: 'rsvp', label: '7. RSVP & Registry', icon: '✍️' },
            { id: 'sections', label: '8. Section Toggles', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          
          {activeTab === 'couple' && (
            <CoupleHeroTab formData={formData} handleFieldChange={handleFieldChange} />
          )}

          {activeTab === 'story' && (
            <OurStoryTab formData={formData} handleFieldChange={handleFieldChange} />
          )}

          {activeTab === 'photos' && (
            <PhotoMomentsTab formData={formData} handlePhotoUpload={handlePhotoUpload} />
          )}

          {activeTab === 'welcome' && (
            <WelcomeNoteTab formData={formData} handleFieldChange={handleFieldChange} />
          )}

          {activeTab === 'events' && (
            <MultiEventsTab
              formData={formData}
              handleAddEvent={handleAddEvent}
              handleDuplicateEvent={handleDuplicateEvent}
              handleDeleteEvent={handleDeleteEvent}
              handleEventChange={handleEventChange}
            />
          )}

          {activeTab === 'countdown' && (
            <CountdownTab formData={formData} handleFieldChange={handleFieldChange} />
          )}

          {activeTab === 'rsvp' && (
            <RsvpRegistryTab formData={formData} handleFieldChange={handleFieldChange} />
          )}

          {activeTab === 'sections' && (
            <SectionTogglesTab formData={formData} handleSectionToggle={handleSectionToggle} />
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            <span>🔗</span> View Public Live Invitation (Variant {variant})
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-8 py-3.5 shadow-lg transition active:scale-98 disabled:opacity-50"
          >
            {saving ? 'Saving...' : `💾 Save & Update Live Invitation (Variant ${variant})`}
          </button>
        </div>

      </main>
    </div>
  )
}
