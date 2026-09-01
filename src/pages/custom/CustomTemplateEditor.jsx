import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import { pavitraSriData } from '../../data/custom/pavitraSriData.js'
import { shradhaData } from '../../data/custom/shradhaData.js'
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

import { compressImageToWebP } from '../../utils/imageCompressor.js'


const logo = "/assets/logo/inviteq-logo.png"

export default function CustomTemplateEditor() {
  const { templateId = 'midnight-waltz', customSlug = 'Pavitra-Sri', variant = '1' } = useParams()
  const { user, loading: authLoading, saveInvitation } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showSplash, setShowSplash] = useState(true)
  const [uploadingIndex, setUploadingIndex] = useState(null)

  const isShradha = customSlug?.toLowerCase() === 'shradha' || templateId?.toLowerCase() === 'everlastingvows'
  const activeBaseData = isShradha ? shradhaData : pavitraSriData

  const storageKey = useMemo(() => {
    return `inviteque_custom_data_${templateId}_${customSlug}_v${variant}`
  }, [templateId, customSlug, variant])

  const [activeTab, setActiveTab] = useState('couple') // couple, story, photos, welcome, events, countdown, rsvp, sections

  const tabsList = useMemo(() => [
    { id: 'couple', label: 'Couple & Date', icon: '💍', num: 1 },
    { id: 'story', label: 'Our Story', icon: '📖', num: 2 },
    { id: 'photos', label: 'Photo Moments', icon: '🖼️', num: 3 },
    { id: 'welcome', label: 'Welcome Note', icon: '💌', num: 4 },
    { id: 'events', label: 'Multi-Events', icon: '🏛️', num: 5 },
    { id: 'countdown', label: 'Countdown', icon: '⏳', num: 6 },
    { id: 'rsvp', label: 'RSVP & Registry', icon: '✍️', num: 7 },
    { id: 'sections', label: 'Section Toggles', icon: '⚙️', num: 8 },
  ], [])

  // Default events based on variant
  const defaultEvents = useMemo(() => {
    if (!isShradha && variant === '2') {
      const weddingEvents = pavitraSriData.events.filter(e => e.isWeddingOnly)
      return weddingEvents.length > 0 ? weddingEvents.map(e => ({ ...e })) : [pavitraSriData.events[pavitraSriData.events.length - 1]]
    }
    return activeBaseData.events.map(e => ({ ...e }))
  }, [variant, isShradha, activeBaseData])

  const [formData, setFormData] = useState(() => {
    let saved = null
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        saved = JSON.parse(raw)
      } else if (variant === '1') {
        const rawFallback = localStorage.getItem(`inviteque_custom_data_${templateId}_${customSlug}`)
        if (rawFallback) saved = JSON.parse(rawFallback)
      }
    } catch (e) {
      console.warn('Failed to load custom data:', e)
    }

    const defaultRsvpUrl = activeBaseData.celebrate?.rsvp?.url || `/templates/${templateId}/${isShradha ? 'SHRADHA' : 'PAVITRASRI'}/RSVP`

    return {
      // Couple & Hero
      groomName: saved?.groomName || activeBaseData.hero.groomName || (isShradha ? 'Aayush' : 'Sri'),
      brideName: saved?.brideName || activeBaseData.hero.brideName || (isShradha ? 'Shradha' : 'Pavitra'),
      weddingDate: saved?.weddingDate || activeBaseData.hero.weddingDate || (isShradha ? '18' : '12'),
      weddingMonth: saved?.weddingMonth || activeBaseData.hero.weddingMonth || (isShradha ? 'December' : 'November'),
      weddingYear: (saved?.weddingYear && parseInt(saved.weddingYear) >= 2000 && parseInt(saved.weddingYear) <= 2100) ? String(saved.weddingYear) : (activeBaseData.hero.weddingYear || '2026'),
      weddingTime: saved?.weddingTime || activeBaseData.hero.weddingTime || (isShradha ? '10:00 AM onwards' : '09:00 AM - 10:30 AM'),
      heroSubtitle: saved?.heroSubtitle || activeBaseData.hero.subtitle || (isShradha ? 'Roka & Engagement Ceremony' : 'Are Getting Married'),

      // Our Story
      storySectionLabel: saved?.storySectionLabel || activeBaseData.story?.sectionLabel || 'Our Story',
      storyHeading: saved?.storyHeading || activeBaseData.story?.heading || 'From A Chance Encounter to Forever',
      storyParagraph1: saved?.storyParagraph1 || (Array.isArray(saved?.storyParagraphs) ? saved.storyParagraphs[0] : null) || (saved?.storyMessage ? saved.storyMessage.split('\n\n')[0] : null) || activeBaseData.story?.paragraph1 || activeBaseData.story?.paragraphs?.[0] || 'What began as a simple conversation blossomed into a connection that felt like coming home. Through shared laughter, quiet evenings, and countless adventures, we discovered that life\'s most precious moments are the ones spent together.',
      storyParagraph2: saved?.storyParagraph2 || (Array.isArray(saved?.storyParagraphs) ? saved.storyParagraphs[1] : null) || (saved?.storyMessage?.includes('\n\n') ? saved.storyMessage.split('\n\n')[1] : null) || activeBaseData.story?.paragraph2 || activeBaseData.story?.paragraphs?.[1] || 'With the blessings of our parents and surrounded by the love of family and friends, we are thrilled to step into this new chapter of our lives hand in hand.',
      storyQuote: saved?.storyQuote || activeBaseData.story?.quote || '“In your arms, I have found my forever home and love.”',

      // Photo Moments (3 Photos)
      photos: (saved?.photos && Array.isArray(saved.photos) && saved.photos.length >= 3)
        ? saved.photos
        : (activeBaseData.moments?.photos?.map(p => (typeof p === 'object' ? (p.image || p.url) : p)) || []),

      // Welcome Message
      welcomeLabel: saved?.welcomeLabel || activeBaseData.welcome?.label || 'Welcome',
      welcomeHeading1: saved?.welcomeHeading1 || activeBaseData.welcome?.headingLine1 || 'Dear Friends',
      welcomeHeading2: saved?.welcomeHeading2 || activeBaseData.welcome?.headingLine2 || '& Family,',
      welcomeMessage: saved?.welcomeMessage || activeBaseData.welcome?.message || 'With great joy and grateful hearts, we invite you to be part of our celebrations. Your love and presence mean the world to us.',

      // Multi-Event Ceremonies
      events: (saved?.events && Array.isArray(saved.events) && saved.events.length > 0)
        ? saved.events.map((ev, i) => ({
            ...ev,
            bgDesktop: ev.bgDesktop?.replace(/\.(png|jpg|jpeg)$/i, '.webp') || defaultEvents[i]?.bgDesktop,
            bgMobile: ev.bgMobile?.replace(/\.(png|jpg|jpeg)$/i, '.webp') || defaultEvents[i]?.bgMobile,
          }))
        : defaultEvents,

      // Countdown
      countdownTargetDate: saved?.countdownTargetDate || (isShradha ? '2026-12-18' : '2026-11-12'),

      // RSVP & Registry
      rsvpTitle: saved?.rsvpTitle || activeBaseData.celebrate?.rsvp?.title || (isShradha ? 'RSVP For Roka & Engagement' : 'RSVP'),
      rsvpDescription: saved?.rsvpDescription || activeBaseData.celebrate?.rsvp?.description || 'Please let us know if you will be joining us.',
      rsvpUrl: saved?.rsvpUrl || defaultRsvpUrl,
      hasRsvp: saved?.hasRsvp !== undefined ? saved.hasRsvp : true,

      registryTitle: saved?.registryTitle || activeBaseData.celebrate?.registry?.title || 'Gift Registry',
      registryDescription: saved?.registryDescription || activeBaseData.celebrate?.registry?.description || 'For loved ones who have asked, view our curated wishlist.',
      registryUrl: saved?.registryUrl || activeBaseData.celebrate?.registry?.url || 'https://www.amazon.com/wedding',
      hasRegistry: saved?.hasRegistry !== undefined ? saved.hasRegistry : (activeBaseData.celebrate?.registry?.enabled ?? true),

      // Section Visibility Toggles
      sections: saved?.sections || {
        showHero: true,
        showStory: !isShradha,
        showGallery: !isShradha,
        showWelcome: !isShradha,
        showVenue: true,
        showCountdown: true,
        hasRsvp: true,
      }
    }
  })

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // 1. Authentication & DB Preload
  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setShowSplash(false), 600)
      return () => clearTimeout(timer)
    }
  }, [authLoading])

  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const headers = user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
        // Always fetch by slug — backend now supports case-insensitive slug lookup
        const slug = isShradha ? 'Shradha' : customSlug
        
        let inv = null
        try {
          const res = await fetch(`${API_URL}/api/invites/${slug}`, { headers })
          if (res.ok) {
            const data = await res.json()
            if (data && (data.groomName || data.coupleData || data.heroData || data.slug || data.code)) {
              inv = data
            }
          }
        } catch (e) {
          console.warn('DB fetch failed for slug', slug, e)
        }
        
        if (inv) {
            const groom = inv.groomName || inv.coupleData?.groomName
            const bride = inv.brideName || inv.coupleData?.brideName
            const day = (typeof inv.weddingDate === 'object' && inv.weddingDate ? inv.weddingDate.day : (typeof inv.weddingDate === 'string' ? inv.weddingDate : null)) || inv.heroData?.weddingDate
            const month = (typeof inv.weddingDate === 'object' && inv.weddingDate ? inv.weddingDate.month : null) || inv.heroData?.weddingMonth
            const rawYear = (typeof inv.weddingDate === 'object' && inv.weddingDate ? inv.weddingDate.year : null) || inv.heroData?.weddingYear
            const cleanYear = (rawYear && parseInt(rawYear) >= 2000 && parseInt(rawYear) <= 2100) ? String(rawYear) : undefined
            const time = inv.weddingTime || inv.heroData?.weddingTime
            const photos = inv.photos || inv.storyData?.photos
            const schedule = inv.eventSchedule || inv.scheduleData?.items

            const storySectionLabel = inv.storyData?.sectionLabel || inv.invitationData?.storySectionLabel
            const storyHeading = inv.storyData?.heading || inv.invitationData?.storyHeading || inv.invitationData?.customSectionTitle
            const storyPara1 = inv.storyData?.paragraph1 || inv.storyData?.paragraphs?.[0] || inv.invitationData?.storyParagraph1
            const storyPara2 = inv.storyData?.paragraph2 || inv.storyData?.paragraphs?.[1] || inv.invitationData?.storyParagraph2
            const storyQuote = inv.storyData?.quote || inv.invitationData?.customSectionSubtitle || inv.customSectionSubtitle

            setFormData(prev => ({
              ...prev,
              groomName: groom || prev.groomName,
              brideName: bride || prev.brideName,
              weddingDate: day || prev.weddingDate,
              weddingMonth: month || prev.weddingMonth,
              weddingYear: cleanYear || (prev.weddingYear && parseInt(prev.weddingYear) >= 2000 && parseInt(prev.weddingYear) <= 2100 ? prev.weddingYear : '2026'),
              weddingTime: time || prev.weddingTime,
              heroSubtitle: inv.heroData?.heroSubtitle || prev.heroSubtitle,
              photos: photos && Array.isArray(photos) && photos.filter(Boolean).length >= 3 ? photos : prev.photos,
              storySectionLabel: storySectionLabel || prev.storySectionLabel,
              storyHeading: storyHeading || prev.storyHeading,
              storyParagraph1: storyPara1 || prev.storyParagraph1,
              storyParagraph2: storyPara2 || prev.storyParagraph2,
              storyQuote: storyQuote || prev.storyQuote,
              welcomeLabel: inv.invitationData?.welcomeLabel || prev.welcomeLabel,
              welcomeHeading1: inv.invitationData?.welcomeHeadingLine1 || prev.welcomeHeading1,
              welcomeHeading2: inv.invitationData?.welcomeHeadingLine2 || prev.welcomeHeading2,
              welcomeMessage: inv.invitationData?.welcomeMessage || inv.invitationData?.familyMessage || inv.familyMessage || prev.welcomeMessage,
              events: (schedule && Array.isArray(schedule) && schedule.length > 0)
                ? (variant === '2' ? schedule.filter(e => e.isWeddingOnly || (e.title && e.title.toLowerCase().includes('wedding')) || (e.eventName && e.eventName.toLowerCase().includes('wedding'))) : schedule).map((ev, i) => {
                    const fallbackEv = prev.events[i] || prev.events[prev.events.length - 1]
                    return {
                      id: ev.id || fallbackEv?.id || `evt-${i + 1}`,
                      label: ev.eventName || ev.label || ev.title || fallbackEv?.label || 'Ceremony',
                      sectionLabel: ev.sectionLabel || ev.label || fallbackEv?.sectionLabel || 'Our Venue',
                      eventName: ev.eventName || ev.title || fallbackEv?.eventName || 'Ceremony',
                      date: ev.date || fallbackEv?.date || `${day || prev.weddingDate} ${month || prev.weddingMonth} ${year || prev.weddingYear}`,
                      time: ev.time || fallbackEv?.time || time || '10:00 AM onwards',
                      venueName: ev.venueName || inv.mahalName || inv.venueData?.mahalName || fallbackEv?.venueName || prev.events[0]?.venueName,
                      venueLine1: ev.venueLine1 || inv.venueAddress || inv.venueData?.venueAddress || fallbackEv?.venueLine1 || prev.events[0]?.venueLine1,
                      venueLine2: ev.venueLine2 || inv.venueCity || inv.venueData?.venueCity || fallbackEv?.venueLine2 || prev.events[0]?.venueLine2,
                      mapUrl: ev.mapUrl || inv.mapLink || inv.venueData?.mapLink || fallbackEv?.mapUrl || prev.events[0]?.mapUrl,
                      bgDesktop: ev.bgDesktop?.replace(/\.(png|jpg|jpeg)$/i, '.webp') || fallbackEv?.bgDesktop,
                      bgMobile: ev.bgMobile?.replace(/\.(png|jpg|jpeg)$/i, '.webp') || fallbackEv?.bgMobile,
                      isWeddingOnly: ev.isWeddingOnly ?? (variant === '2' || i === schedule.length - 1 || (ev.eventName && ev.eventName.toLowerCase().includes('wedding')))
                    }
                  })
                : prev.events
            }))
          }
      } catch (err) {
        console.warn('Initial DB fetch notice:', err)
      }
    }

    fetchDbData()
  }, [user, variant, isShradha])

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

  const compressImageToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const maxDimension = 1000
          let { width, height } = img
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width)
              width = maxDimension
            } else {
              width = Math.round((width * maxDimension) / height)
              height = maxDimension
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.onerror = () => resolve(e.target.result)
        img.src = e.target.result
      }
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(file)
    })
  }

  const handlePhotoUpload = async (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingIndex(index)

    try {
      // Compress ANY input image size into WebP (< 300KB - 500KB)
      const webpDataUrl = await compressImageToWebP(file, 1400, 400 * 1024)
      if (webpDataUrl) {
        setFormData(prev => {
          const newPhotos = [...(prev.photos || [])]
          newPhotos[index] = webpDataUrl
          return { ...prev, photos: newPhotos }
        })
      }
    } catch (err) {
      console.error('Photo upload error:', err)
      alert('Failed to process image. Please try another photo.')
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...formData.events]
    const updatedEv = { ...updatedEvents[index], [field]: value }
    const evDate = field === 'date' ? value : (updatedEv.date || '')
    const evTime = field === 'time' ? value : (updatedEv.time || '')
    updatedEv.dateTimeLine = (evDate && evTime) ? `${evDate} • ${evTime}` : (evDate || evTime || '')
    if (field === 'eventName') {
      updatedEv.label = value
    }
    updatedEvents[index] = updatedEv
    setFormData(prev => ({ ...prev, events: updatedEvents }))
  }

  const handleAddEvent = () => {
    const newEvent = {
      id: `custom-event-${Date.now()}`,
      label: 'Ceremony',
      eventName: 'New Ceremony Event',
      date: `${formData.weddingDate} ${formData.weddingMonth} ${formData.weddingYear}`,
      time: '04:00 PM - 06:00 PM',
      venueName: formData.events[0]?.venueName || 'Sri Venkateswara Royal Mandapam',
      venueLine1: formData.events[0]?.venueLine1 || 'Palace Road, Vasanth Nagar',
      venueLine2: formData.events[0]?.venueLine2 || 'Bengaluru, Karnataka',
      mapUrl: formData.events[0]?.mapUrl || 'https://maps.google.com/?q=Sri+Venkateswara+Royal+Mandapam+Palace+Road+Vasanth+Nagar+Bengaluru',
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
      // Save to backend database — this is the single source of truth
      const weddingEvt = formData.events.find(e => e.isWeddingOnly || (e.eventName && e.eventName.toLowerCase().includes('wedding')) || e.id === 'wedding') || formData.events[formData.events.length - 1]
      const slug = isShradha ? 'Shradha' : customSlug

      try {
        const payload = {
          templateId,
          slug,  // Backend does slug-based upsert (find-or-create by slug)
          coupleNames: `${formData.groomName || ''} & ${formData.brideName || ''}`.trim(),
          groomName: formData.groomName,
          brideName: formData.brideName,
          weddingDate: {
            day: formData.weddingDate,
            month: formData.weddingMonth,
            year: formData.weddingYear
          },
          weddingTime: formData.weddingTime,
          heroSubtitle: formData.heroSubtitle,
          mahalName: weddingEvt?.venueName || formData.events[0]?.venueName,
          venueName: weddingEvt?.venueName || formData.events[0]?.venueName,
          venueAddress: weddingEvt?.venueLine1 || formData.events[0]?.venueLine1,
          venueCity: weddingEvt?.venueLine2 || formData.events[0]?.venueLine2,
          mapLink: weddingEvt?.mapUrl || formData.events[0]?.mapUrl,
          state: formData.state || '',
          photos: formData.photos,
          eventSchedule: formData.events.map(ev => ({
            id: ev.id,
            time: ev.time,
            title: ev.eventName,
            eventName: ev.eventName,
            label: ev.eventName,
            date: ev.date,
            venueName: ev.venueName,
            venueLine1: ev.venueLine1,
            venueLine2: ev.venueLine2,
            mapUrl: ev.mapUrl,
            bgDesktop: ev.bgDesktop,
            bgMobile: ev.bgMobile,
            isWeddingOnly: ev.isWeddingOnly
          })),
          status: 'PAID',
          storyData: {
            sectionLabel: formData.storySectionLabel,
            heading: formData.storyHeading,
            paragraph1: formData.storyParagraph1,
            paragraph2: formData.storyParagraph2,
            paragraphs: [formData.storyParagraph1, formData.storyParagraph2].filter(Boolean),
            quote: formData.storyQuote,
            photos: formData.photos
          },
          invitationData: {
            showGallery: formData.sections?.showGallery ?? true,
            showSchedule: formData.sections?.showVenue ?? true,
            hasRsvp: Boolean(formData.sections?.hasRsvp),
            welcomeLabel: formData.welcomeLabel,
            welcomeHeadingLine1: formData.welcomeHeading1,
            welcomeHeadingLine2: formData.welcomeHeading2,
            welcomeMessage: formData.welcomeMessage,
            familyMessage: formData.welcomeMessage,
            storySectionLabel: formData.storySectionLabel,
            storyHeading: formData.storyHeading,
            storyParagraph1: formData.storyParagraph1,
            storyParagraph2: formData.storyParagraph2,
            storyQuote: formData.storyQuote,
            customSectionTitle: formData.storyHeading,
            customSectionSubtitle: formData.storyQuote,
            customSectionContent: [formData.storyParagraph1, formData.storyParagraph2].filter(Boolean).join('\n\n'),
          },
          rsvpData: {
            enabled: Boolean(formData.sections?.hasRsvp),
            allowGuestCount: true,
            rsvpTitle: formData.rsvpTitle,
            rsvpDescription: formData.rsvpDescription,
            rsvpUrl: formData.rsvpUrl,
            hasRsvp: Boolean(formData.sections?.hasRsvp),
            registryTitle: formData.registryTitle,
            registryDescription: formData.registryDescription,
            registryUrl: formData.registryUrl,
            hasRegistry: Boolean(formData.hasRegistry)
          }
        }

        const headers = { 'Content-Type': 'application/json' }
        if (user?.token) headers['Authorization'] = `Bearer ${user.token}`

        const res = await fetch(`${API_URL}/api/invites`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`Save failed (${res.status}): ${errText}`)
        }

        const saved = await res.json()
        console.log('✅ Saved to DB with slug:', saved.slug, 'code:', saved.code)
      } catch (dbErr) {
        console.error('Backend save error:', dbErr.message)
        throw dbErr
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err) {
      console.error('Save error:', err)
      alert(err.message || 'Failed to save changes. Please check your connection.')
    } finally {
      setSaving(false)
    }
  }

  const liveUrl = isShradha 
    ? `/template/everlastingvows/Shradha`
    : `/template/${templateId}/${customSlug}/${variant}`

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-saas text-slate-900 flex flex-col relative w-full overflow-x-hidden">
      {/* Luxury Splash Screen overlay (Identical to other templates) */}
      <SplashScreen loading={showSplash || authLoading} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md w-full">
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
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-6 overflow-x-hidden">
        
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
        <div className="sm:hidden flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full">
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

        {/* Responsive Section Selector Grid (All 8 sections visible without horizontal scrolling!) */}
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Section to Edit:
            </span>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
              Step {tabsList.findIndex(t => t.id === activeTab) + 1} of 8
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {tabsList.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-sm ${
                    isActive ? 'bg-white/20' : 'bg-slate-100'
                  }`}>
                    {tab.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className={`block text-[10px] font-bold uppercase tracking-wider ${
                      isActive ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      Section {tab.num}
                    </span>
                    <span className="block text-xs font-bold truncate">
                      {tab.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Panels */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6">
          
          {/* Quick Header Stepper */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{tabsList.find(t => t.id === activeTab)?.icon}</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Editing Section {tabsList.findIndex(t => t.id === activeTab) + 1} of 8
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {tabsList.find(t => t.id === activeTab)?.label}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={tabsList.findIndex(t => t.id === activeTab) === 0}
                onClick={() => {
                  const idx = tabsList.findIndex(t => t.id === activeTab)
                  if (idx > 0) setActiveTab(tabsList[idx - 1].id)
                }}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ◀ Prev
              </button>
              <button
                type="button"
                disabled={tabsList.findIndex(t => t.id === activeTab) === tabsList.length - 1}
                onClick={() => {
                  const idx = tabsList.findIndex(t => t.id === activeTab)
                  if (idx < tabsList.length - 1) setActiveTab(tabsList[idx + 1].id)
                }}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Next ▶
              </button>
            </div>
          </div>

          {activeTab === 'couple' && (
            <CoupleHeroTab formData={formData} handleFieldChange={handleFieldChange} />
          )}

          {activeTab === 'story' && (
            <OurStoryTab formData={formData} handleFieldChange={handleFieldChange} />
          )}

          {activeTab === 'photos' && (
            <PhotoMomentsTab formData={formData} handlePhotoUpload={handlePhotoUpload} uploadingIndex={uploadingIndex} />
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

          {/* Bottom In-Card Step Flow */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100">
            {tabsList.findIndex(t => t.id === activeTab) > 0 ? (
              <button
                type="button"
                onClick={() => {
                  const idx = tabsList.findIndex(t => t.id === activeTab)
                  setActiveTab(tabsList[idx - 1].id)
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
              >
                ◀ Back to {tabsList[tabsList.findIndex(t => t.id === activeTab) - 1]?.label}
              </button>
            ) : <div />}

            {tabsList.findIndex(t => t.id === activeTab) < tabsList.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  const idx = tabsList.findIndex(t => t.id === activeTab)
                  setActiveTab(tabsList[idx + 1].id)
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition flex items-center gap-1.5"
              >
                Next: {tabsList[tabsList.findIndex(t => t.id === activeTab) + 1]?.label} ▶
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-700">✓ All Sections Reviewed</span>
            )}
          </div>

        </div>

        {/* Sticky/Fixed Footer Actions */}
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
