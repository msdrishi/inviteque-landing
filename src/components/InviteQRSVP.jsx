import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { API_URL } from '../config'

// Party Popper Celebration Effect
const fireCelebrationPoppers = () => {
  try {
    // 1. Initial burst
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#3D5236', '#E11D48', '#38BDF8', '#F59E0B', '#10B981']
    })

    // 2. Left and Right cannon bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#FFD700', '#FF69B4', '#00FFFF', '#FF4500']
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#FFD700', '#FF69B4', '#00FFFF', '#FF4500']
      })
    }, 200)

    // 3. Falling stars / lingering burst
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.5 },
        shapes: ['star', 'circle'],
        scalar: 1.2
      })
    }, 450)
  } catch (e) {
    console.error('Confetti animation error:', e)
  }
}

/**
 * Reusable RSVP Component for InviteQ
 * Perfectly matched to the reference design with Save The Date flourish,
 * attending toggles, headcount stepper, event cards, and wishes note.
 */
export default function InviteQRSVP({
  weddingCode,
  groupSlug,
  isPreview = false,
  events: propEvents,
  config: propConfig,
  theme = 'green',
  title: propTitle,
  subtitle: propSubtitle,
}) {
  const [loadingConfig, setLoadingConfig] = useState(!propConfig && !isPreview)
  const [config, setConfig] = useState(propConfig || null)
  const [eventsList, setEventsList] = useState(propEvents || [])
  
  // Form State
  const [guestName, setGuestName] = useState('')
  const [attendance, setAttendance] = useState('yes') // 'yes' | 'no'
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  
  // Default Sample Events
  const defaultSampleEvents = useMemo(() => [
    { id: 'haldi', name: 'HALDI CEREMONY', time: '11:00 AM' },
    { id: 'vows', name: 'WEDDING VOWS', time: '04:00 PM' },
    { id: 'reception', name: 'GRAND RECEPTION', time: '07:00 PM' }
  ], [])

  // Resolved list of events
  const resolvedEvents = useMemo(() => {
    if (eventsList && eventsList.length > 0) {
      return eventsList.map((e, idx) => ({
        id: e.id || `evt_${idx}`,
        name: typeof e === 'string' ? e.toUpperCase() : (e.title || e.name || `EVENT ${idx + 1}`).toUpperCase(),
        time: typeof e === 'object' && e.time ? e.time : ''
      }))
    }
    return defaultSampleEvents
  }, [eventsList, defaultSampleEvents])

  const [selectedEvents, setSelectedEvents] = useState(() => resolvedEvents.map(e => e.id))

  const toggleEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? (prev.length > 1 ? prev.filter(id => id !== eventId) : prev)
        : [...prev, eventId]
    )
  }
  
  // Submission State
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [idempotencyKey] = useState(() => 'idemp_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now())

  // Fetch Public Config if not supplied and not in preview mode
  useEffect(() => {
    let active = true
    if (!weddingCode || isPreview) {
      setLoadingConfig(false)
      return
    }

    async function fetchRsvpConfig() {
      try {
        const query = groupSlug ? `?group=${encodeURIComponent(groupSlug)}` : ''
        const res = await fetch(`${API_URL}/api/public/rsvp/config/${weddingCode}${query}`)
        if (res.ok) {
          const data = await res.json()
          if (active) {
            setConfig(prev => ({ ...data, ...(propConfig || {}) }))
            if (data.events && data.events.length > 0) {
              setEventsList(data.events)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load RSVP config:', err)
      } finally {
        if (active) setLoadingConfig(false)
      }
    }

    fetchRsvpConfig()
    return () => {
      active = false
    }
  }, [weddingCode, groupSlug, propConfig, isPreview])

  // Theme Styling Definition
  const themeStyles = useMemo(() => {
    switch (theme) {
      case 'green': // Twilight Serenade
        return {
          fontFamily: "'Cinzel', serif",
          bodyFont: "'Montserrat', sans-serif",
          cardBg: 'bg-[#FCFBF7] border-[#3D5236]/20 shadow-[0_20px_50px_rgba(61,82,54,0.08)]',
          headerText: 'text-[#3D5236]',
          bodyText: 'text-[#3D5236]/75',
          accentText: 'text-[#3D5236]',
          accentBtn: 'bg-[#3D5236] text-[#FCFBF7] hover:bg-[#32432c] shadow-md',
          secondaryBtn: 'border-[#3D5236]/30 text-[#3D5236] hover:bg-[#3D5236]/10',
          activeChoice: 'bg-[#3D5236] text-[#FCFBF7] border-[#3D5236]',
          inactiveChoice: 'bg-white text-[#3D5236]/80 border-[#3D5236]/25 hover:border-[#3D5236]',
          inputBg: 'bg-white border-[#3D5236]/25 focus:border-[#3D5236] text-[#3D5236]',
          divider: 'bg-[#3D5236]/25',
          badgeBg: 'bg-[#3D5236]/10 text-[#3D5236] border border-[#3D5236]/20',
          checkCircle: 'bg-[#3D5236] text-white',
          uncheckCircle: 'border-[#3D5236]/30 text-transparent',
        }
      case 'royal': // Royal Heirloom
        return {
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          bodyFont: "'Montserrat', sans-serif",
          cardBg: 'bg-[#F6EBD8] border-[#4A2810]/25 shadow-[0_20px_50px_rgba(74,40,16,0.10)]',
          headerText: 'text-[#4A2810]',
          bodyText: 'text-[#4A2810]/75',
          accentText: 'text-[#7E4520]',
          accentBtn: 'bg-[#4A2810] text-[#F5D78E] hover:bg-[#3A1F10] shadow-md',
          secondaryBtn: 'border-[#4A2810]/30 text-[#4A2810] hover:bg-[#4A2810]/10',
          activeChoice: 'bg-[#4A2810] text-[#F5D78E] border-[#4A2810]',
          inactiveChoice: 'bg-[#FAF3E5] text-[#4A2810]/80 border-[#4A2810]/25 hover:border-[#4A2810]',
          inputBg: 'bg-[#FAF3E5] border-[#4A2810]/25 focus:border-[#4A2810] text-[#4A2810]',
          divider: 'bg-[#4A2810]/20',
          badgeBg: 'bg-[#4A2810]/10 text-[#4A2810]',
          checkCircle: 'bg-[#4A2810] text-[#F5D78E]',
          uncheckCircle: 'border-[#4A2810]/30 text-transparent',
        }
      case 'gold': // Sunflower Fields / Royal Palace
        return {
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          bodyFont: "'Montserrat', sans-serif",
          cardBg: 'bg-[#FAF8F5] border-[#D4AF37]/35 shadow-[0_20px_50px_rgba(212,175,55,0.08)]',
          headerText: 'text-[#5C0A14]',
          bodyText: 'text-[#5C0A14]/75',
          accentText: 'text-[#8A6E1E]',
          accentBtn: 'bg-[#5C0A14] text-[#FAF8F5] hover:bg-[#4a0810] shadow-md',
          secondaryBtn: 'border-[#D4AF37]/40 text-[#5C0A14] hover:bg-[#D4AF37]/10',
          activeChoice: 'bg-[#5C0A14] text-white border-[#5C0A14]',
          inactiveChoice: 'bg-white text-[#5C0A14]/80 border-[#D4AF37]/35 hover:border-[#5C0A14]',
          inputBg: 'bg-white border-[#D4AF37]/35 focus:border-[#5C0A14] text-[#5C0A14]',
          divider: 'bg-[#D4AF37]/30',
          badgeBg: 'bg-[#D4AF37]/15 text-[#5C0A14]',
          checkCircle: 'bg-[#5C0A14] text-white',
          uncheckCircle: 'border-[#D4AF37]/40 text-transparent',
        }
      case 'traditional':
      case 'midnight': // Midnight Waltz
        return {
          fontFamily: "'Cinzel', serif",
          bodyFont: "'Montserrat', sans-serif",
          cardBg: 'bg-[#FDFBF7] border-[#4A3E20]/20 shadow-[0_20px_50px_rgba(74,62,32,0.08)]',
          headerText: 'text-[#4A3E20]',
          bodyText: 'text-[#4A3E20]/75',
          accentText: 'text-[#4A3E20]',
          accentBtn: 'bg-[#4A3E20] text-[#FDFBF7] hover:bg-[#382f18] shadow-md font-bold',
          secondaryBtn: 'border-[#4A3E20]/30 text-[#4A3E20] hover:bg-[#4A3E20]/10',
          activeChoice: 'bg-[#4A3E20] text-[#FDFBF7] border-[#4A3E20]',
          inactiveChoice: 'bg-white text-[#4A3E20]/80 border-[#4A3E20]/20 hover:border-[#4A3E20]',
          inputBg: 'bg-white border-[#4A3E20]/25 focus:border-[#4A3E20] text-[#4A3E20]',
          divider: 'bg-[#4A3E20]/20',
          badgeBg: 'bg-[#4A3E20]/10 text-[#4A3E20]',
          checkCircle: 'bg-[#4A3E20] text-white',
          uncheckCircle: 'border-[#4A3E20]/30 text-transparent',
        }
      case 'everlasting': // Everlasting Vows
        return {
          fontFamily: "'Cinzel', serif",
          bodyFont: "'Montserrat', sans-serif",
          cardBg: 'bg-[#FFFDF2] border-[#8A6E1E]/20 shadow-[0_20px_50px_rgba(138,110,30,0.08)]',
          headerText: 'text-[#8A6E1E]',
          bodyText: 'text-[#8A6E1E]/75',
          accentText: 'text-[#8A6E1E]',
          accentBtn: 'bg-[#8A6E1E] text-white hover:bg-[#725916] shadow-md',
          secondaryBtn: 'border-[#8A6E1E]/30 text-[#8A6E1E] hover:bg-[#8A6E1E]/10',
          activeChoice: 'bg-[#8A6E1E] text-white border-[#8A6E1E]',
          inactiveChoice: 'bg-white text-[#8A6E1E]/80 border-[#8A6E1E]/20 hover:border-[#8A6E1E]',
          inputBg: 'bg-white border-[#8A6E1E]/25 focus:border-[#8A6E1E] text-[#8A6E1E]',
          divider: 'bg-[#8A6E1E]/20',
          badgeBg: 'bg-[#8A6E1E]/10 text-[#8A6E1E]',
          checkCircle: 'bg-[#8A6E1E] text-white',
          uncheckCircle: 'border-[#8A6E1E]/30 text-transparent',
        }
      case 'rose':
      case 'blossom': // Aura of Elegance / Blossom Whisper
        return {
          fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
          bodyFont: "'Montserrat', sans-serif",
          cardBg: 'bg-[#FFFDFC] border-[#8A4B58]/20 shadow-[0_20px_50px_rgba(138,75,88,0.08)]',
          headerText: 'text-[#8A4B58]',
          bodyText: 'text-[#8A4B58]/75',
          accentText: 'text-[#8A4B58]',
          accentBtn: 'bg-[#8A4B58] text-white hover:bg-[#733e49] shadow-md',
          secondaryBtn: 'border-[#8A4B58]/30 text-[#8A4B58] hover:bg-[#8A4B58]/10',
          activeChoice: 'bg-[#8A4B58] text-white border-[#8A4B58]',
          inactiveChoice: 'bg-white text-[#8A4B58]/80 border-[#8A4B58]/20 hover:border-[#8A4B58]',
          inputBg: 'bg-white border-[#8A4B58]/25 focus:border-[#8A4B58] text-[#8A4B58]',
          divider: 'bg-[#8A4B58]/20',
          badgeBg: 'bg-[#8A4B58]/10 text-[#8A4B58]',
          checkCircle: 'bg-[#8A4B58] text-white',
          uncheckCircle: 'border-[#8A4B58]/30 text-transparent',
        }
      case 'terracotta': // Modern Hearth
        return {
          fontFamily: "'Playfair Display', serif",
          bodyFont: "'Montserrat', sans-serif",
          cardBg: 'bg-[#FBF3DE] border-[#6B351D]/20 shadow-[0_20px_50px_rgba(107,53,29,0.08)]',
          headerText: 'text-[#6B351D]',
          bodyText: 'text-[#6B351D]/75',
          accentText: 'text-[#6B351D]',
          accentBtn: 'bg-[#6B351D] text-white hover:bg-[#542814] shadow-md',
          secondaryBtn: 'border-[#6B351D]/30 text-[#6B351D] hover:bg-[#6B351D]/10',
          activeChoice: 'bg-[#6B351D] text-white border-[#6B351D]',
          inactiveChoice: 'bg-white text-[#6B351D]/80 border-[#6B351D]/20 hover:border-[#6B351D]',
          inputBg: 'bg-white border-[#6B351D]/25 focus:border-[#6B351D] text-[#6B351D]',
          divider: 'bg-[#6B351D]/20',
          badgeBg: 'bg-[#6B351D]/10 text-[#6B351D]',
          checkCircle: 'bg-[#6B351D] text-white',
          uncheckCircle: 'border-[#6B351D]/30 text-transparent',
        }
      default: // Everlasting / Classic
        return {
          fontFamily: "'Cinzel', serif",
          bodyFont: "'Montserrat', sans-serif",
          cardBg: 'bg-[#FDFCFB] border-[#705915]/25 shadow-[0_20px_50px_rgba(112,89,21,0.08)]',
          headerText: 'text-[#705915]',
          bodyText: 'text-[#705915]/75',
          accentText: 'text-[#705915]',
          accentBtn: 'bg-[#705915] text-white hover:bg-[#594610] shadow-md',
          secondaryBtn: 'border-[#705915]/30 text-[#705915] hover:bg-[#705915]/10',
          activeChoice: 'bg-[#705915] text-white border-[#705915]',
          inactiveChoice: 'bg-white text-[#705915]/80 border-[#705915]/25 hover:border-[#705915]',
          inputBg: 'bg-white border-[#705915]/25 focus:border-[#705915] text-[#705915]',
          divider: 'bg-[#705915]/20',
          badgeBg: 'bg-[#705915]/10 text-[#705915]',
          checkCircle: 'bg-[#705915] text-white',
          uncheckCircle: 'border-[#705915]/30 text-transparent',
        }
    }
  }, [theme])

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    if (!guestName.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }

    setSubmitting(true)
    setErrorMessage('')

    // In Preview mode: Instant dummy simulation without backend API call
    if (isPreview || !weddingCode) {
      setTimeout(() => {
        setSubmitting(false)
        setSubmitted(true)
        fireCelebrationPoppers()
      }, 400)
      return
    }

    try {
      const selectedEventObjects = resolvedEvents
        .filter(evt => selectedEvents.includes(evt.id))
        .map(evt => ({
          eventName: evt.name,
          response: 'yes'
        }))

      const payload = {
        weddingCode: weddingCode,
        invitationLink: groupSlug || null,
        guestName: guestName.trim(),
        attendance: attendance,
        guestCount: attendance === 'no' ? 0 : guestCount,
        message: message.trim() || null,
        idempotencyKey: idempotencyKey,
        events: attendance === 'yes' ? selectedEventObjects : [],
      }

      const res = await fetch(`${API_URL}/api/public/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Unable to submit RSVP. Please try again.')
      }

      setSubmitted(true)
      fireCelebrationPoppers()
    } catch (err) {
      console.error('RSVP Submission error:', err)
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const titleText = propTitle || config?.title || "WE'D LOVE TO CELEBRATE WITH YOU"
  const subtitleText = propSubtitle || config?.description || "Please let us know if you will be able to join our celebration."

  return (
    <section className="w-full min-h-[100svh] min-h-screen py-16 md:py-24 px-4 sm:px-6 relative flex flex-col items-center justify-center select-none">
      <div className="w-full max-w-[480px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`relative rounded-[32px] p-6 sm:p-10 border backdrop-blur-xl transition-all ${themeStyles.cardBg}`}
        >
          {/* Guest Group Badge if applicable */}
          {config?.groupName && (
            <div className="flex justify-center mb-3">
              <span 
                className={`px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${themeStyles.badgeBg}`}
                style={{ fontFamily: themeStyles.fontFamily }}
              >
                Special Invitation • {config.groupName}
              </span>
            </div>
          )}

          {/* Section Header */}
          <div className="text-center mb-6">
            <p 
              className={`text-[11px] font-bold uppercase tracking-[0.25em] ${themeStyles.bodyText} mb-2`}
              style={{ fontFamily: themeStyles.fontFamily }}
            >
              SAVE THE DATE
            </p>
            <h2
              className={`text-2xl sm:text-[28px] font-bold uppercase tracking-wider leading-snug ${themeStyles.headerText} mb-2`}
              style={{ fontFamily: themeStyles.fontFamily }}
            >
              {titleText}
            </h2>
            <p 
              className={`text-xs sm:text-[13px] max-w-xs sm:max-w-sm mx-auto leading-relaxed ${themeStyles.bodyText} mb-3`}
              style={{ fontFamily: themeStyles.bodyFont }}
            >
              {subtitleText}
            </p>
            
            {/* Center Heart Flourish */}
            <div className="flex items-center justify-center gap-3 opacity-60">
              <div className={`w-12 h-[1px] ${themeStyles.divider}`} />
              <span className={`text-xs ${themeStyles.headerText}`}>♥</span>
              <div className={`w-12 h-[1px] ${themeStyles.divider}`} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              /* Success State with Party Popper Animation */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="text-center py-6 px-2 space-y-4"
              >
                <div className="mx-auto text-4xl animate-bounce">
                  🎉
                </div>
                <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-800 text-xl font-bold shadow-inner">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 
                    className={`text-xl font-bold uppercase tracking-wider ${themeStyles.headerText}`}
                    style={{ fontFamily: themeStyles.fontFamily }}
                  >
                    {attendance === 'yes' ? 'You’re on the list!' : 'Response Recorded'}
                  </h3>
                  <p 
                    className={`text-xs sm:text-sm max-w-xs mx-auto leading-relaxed ${themeStyles.bodyText}`}
                    style={{ fontFamily: themeStyles.bodyFont }}
                  >
                    {attendance === 'yes'
                      ? `Thank you, ${guestName}! We are thrilled to celebrate with you${guestCount > 1 ? ` (${guestCount} guests)` : ''}.`
                      : `Thank you for letting us know, ${guestName}. You will be warmly remembered!`}
                  </p>
                </div>
                {isPreview && (
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-neutral-200/80 text-[10px] uppercase font-bold text-neutral-600 tracking-wider">
                      Preview Demo • Dummy Interactive Simulation
                    </span>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Sample Reference Form State */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                    {errorMessage}
                  </div>
                )}

                {/* 1. YOUR FULL NAME * */}
                <div className="space-y-1.5">
                  <label 
                    className={`block text-[11px] font-bold uppercase tracking-wider ${themeStyles.accentText}`}
                    style={{ fontFamily: themeStyles.fontFamily }}
                  >
                    YOUR FULL NAME <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-medium outline-none border transition-all ${themeStyles.inputBg}`}
                    style={{ fontFamily: themeStyles.bodyFont }}
                  />
                </div>

                {/* 2. WILL YOU BE ATTENDING? * */}
                <div className="space-y-1.5">
                  <label 
                    className={`block text-[11px] font-bold uppercase tracking-wider ${themeStyles.accentText}`}
                    style={{ fontFamily: themeStyles.fontFamily }}
                  >
                    WILL YOU BE ATTENDING? <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAttendance('yes')}
                      className={`py-3 px-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                        attendance === 'yes' ? themeStyles.activeChoice : themeStyles.inactiveChoice
                      }`}
                      style={{ fontFamily: themeStyles.fontFamily }}
                    >
                      <span>✦</span> JOYFULLY ACCEPT
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance('no')}
                      className={`py-3 px-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                        attendance === 'no' ? themeStyles.activeChoice : themeStyles.inactiveChoice
                      }`}
                      style={{ fontFamily: themeStyles.fontFamily }}
                    >
                      <span>—</span> REGRETFULLY DECLINE
                    </button>
                  </div>
                </div>

                {/* Attending Details: Stepper & Events */}
                {attendance === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-1"
                  >
                    {/* 3. TOTAL GUESTS ATTENDING */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                        <span className={themeStyles.accentText} style={{ fontFamily: themeStyles.fontFamily }}>
                          TOTAL GUESTS ATTENDING
                        </span>
                        <span className={`text-[10px] ${themeStyles.bodyText}`}>
                          {guestCount === 1 ? '1 GUEST (JUST YOU)' : `${guestCount} GUESTS (YOU + ${guestCount - 1})`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className={`h-11 w-12 rounded-2xl border font-bold text-base flex items-center justify-center transition-all ${themeStyles.secondaryBtn}`}
                        >
                          -
                        </button>
                        <div 
                          className={`flex-1 text-center py-2.5 rounded-2xl font-bold text-xs sm:text-sm border uppercase tracking-wider ${themeStyles.inputBg}`}
                          style={{ fontFamily: themeStyles.fontFamily }}
                        >
                          {guestCount} {guestCount === 1 ? 'GUEST' : 'GUESTS'}
                        </div>
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                          className={`h-11 w-12 rounded-2xl border font-bold text-base flex items-center justify-center transition-all ${themeStyles.secondaryBtn}`}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400 italic text-center">
                        * Includes yourself and any accompanying family / plus-one
                      </p>
                    </div>

                    {/* 4. SELECT EVENTS YOU WILL ATTEND */}
                    <div className="space-y-2">
                      <label 
                        className={`block text-[11px] font-bold uppercase tracking-wider ${themeStyles.accentText}`}
                        style={{ fontFamily: themeStyles.fontFamily }}
                      >
                        SELECT EVENTS YOU WILL ATTEND
                      </label>
                      <div className="space-y-2">
                        {resolvedEvents.map((evt) => {
                          const isSelected = selectedEvents.includes(evt.id)
                          return (
                            <div
                              key={evt.id}
                              onClick={() => toggleEvent(evt.id)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                isSelected ? 'border-[#3D5236] bg-white shadow-sm' : 'border-[#3D5236]/20 bg-white/60 hover:border-[#3D5236]/40'
                              }`}
                            >
                              <div>
                                <h4 
                                  className={`text-xs font-bold uppercase tracking-wider ${themeStyles.headerText}`}
                                  style={{ fontFamily: themeStyles.fontFamily }}
                                >
                                  {evt.name}
                                </h4>
                                {evt.time && (
                                  <p className="text-[10px] font-medium text-neutral-400 mt-0.5">
                                    {evt.time}
                                  </p>
                                )}
                              </div>
                              <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                isSelected ? themeStyles.checkCircle : `border ${themeStyles.uncheckCircle}`
                              }`}>
                                ✓
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. LEAVE A WISH OR NOTE (OPTIONAL) */}
                <div className="space-y-1.5">
                  <label 
                    className={`block text-[11px] font-bold uppercase tracking-wider ${themeStyles.accentText}`}
                    style={{ fontFamily: themeStyles.fontFamily }}
                  >
                    LEAVE A WISH OR NOTE (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a warm wish or special dietary requirement..."
                    className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium outline-none border transition-all resize-none ${themeStyles.inputBg}`}
                    style={{ fontFamily: themeStyles.bodyFont }}
                  />
                </div>

                {/* 6. SUBMIT RSVP → Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-4 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                      submitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'
                    } ${themeStyles.accentBtn}`}
                    style={{ fontFamily: themeStyles.fontFamily }}
                  >
                    {submitting ? 'SUBMITTING RSVP...' : 'SUBMIT RSVP →'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
