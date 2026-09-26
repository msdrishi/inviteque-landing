import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import { weddingData as staticData } from '../weddingData.js'
import Footer from '../components/Footer.jsx'

// Import section components
import TemplateRoyalHeritageHero from '../components/TemplateRoyalHeritageHero.jsx'
import TemplateRoyalHeritageStory from '../components/TemplateRoyalHeritageStory.jsx'
import TemplateRoyalHeritageWelcome from '../components/TemplateRoyalHeritageWelcome.jsx'
import TemplateRoyalHeritageSchedule from '../components/TemplateRoyalHeritageSchedule.jsx'
import TemplateRoyalHeritageVenue from '../components/TemplateRoyalHeritageVenue.jsx'
import TemplateRoyalHeritageCalendar from '../components/TemplateRoyalHeritageCalendar.jsx'
import InviteQRSVP from '../components/InviteQRSVP.jsx'
import TemplateRoyalHeritageCountdown from '../components/TemplateRoyalHeritageCountdown.jsx'

export default function TemplateRoyalHeritage({ savedData, groupSlug }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { draftData } = useDraft()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  
  const isPaid = savedData?.isPaid || false
  const showWatermark = !isPaid
  const templateId = 'royal-heritage'

  const activeData = savedData || (isPreview ? draftData : null)
  const baseData = activeData || {}

  const data = {
    ...staticData,
    hero: {
      ...staticData.hero,
      groomName: baseData.groomName || draftData?.groomName || staticData.hero?.groomName || 'Groom',
      brideName: baseData.brideName || draftData?.brideName || staticData.hero?.brideName || 'Bride',
      weddingDate: baseData.weddingDate || draftData?.weddingDate || staticData.date?.day || '14',
      weddingMonth: baseData.weddingMonth || draftData?.weddingMonth || staticData.date?.month || 'January',
      weddingYear: baseData.weddingYear || draftData?.weddingYear || staticData.date?.year || '2024',
      mahalName: baseData.mahalName || draftData?.mahalName || staticData.venue?.venueName || 'Royal Palace',
    },
    venue: {
      ...staticData.venue,
      mahalName: baseData.mahalName || draftData?.mahalName || staticData.venue?.venueName || 'Royal Palace',
      venueCity: baseData.venueCity || draftData?.venueCity || staticData.venue?.venueCity || 'Jaipur',
      venueAddress: baseData.venueAddress || draftData?.venueAddress || staticData.venue?.location || 'Heritage Road',
      state: baseData.state || draftData?.state || 'Rajasthan',
      mapUrl: baseData.mapLink || draftData?.mapLink || staticData.venue?.mapUrl || '',
    },
    countdown: {
      ...staticData.countdown,
      targetDateTimeISO: (() => {
        const dMonth = baseData.weddingMonth || draftData?.weddingMonth || staticData.date?.month || 'January'
        const dDate = baseData.weddingDate || draftData?.weddingDate || staticData.date?.day || '14'
        const dYear = baseData.weddingYear || draftData?.weddingYear || staticData.date?.year || '2024'
        const d = new Date(`${dMonth} ${dDate}, ${dYear}`)
        if (!isNaN(d.getTime())) return d.toISOString()
        return staticData.countdown?.targetDateTimeISO
      })()
    }
  }

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    width: '100vw',
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
    top: 0,
    left: 0,
    width: '100vw',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0
  }

  const commonProps = {
    data,
    fontStyles,
    sectionStyle,
    bgStyle,
    isDesktop,
    isTablet
  }

  const scheduleItems = data.events || []
  const fullAddress = `${data.venue?.venueAddress || ''}, ${data.venue?.venueCity || ''}`
  
  // Basic Calendar Logic
  const weddingDateStr = `${data.hero?.weddingDate} ${data.hero?.weddingMonth} ${data.hero?.weddingYear}`
  const targetDateObj = new Date(weddingDateStr)
  let calendarDays = []
  let monthName = data.hero?.weddingMonth
  let year = data.hero?.weddingYear
  
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
    
    // Fill remaining slots for complete rows (up to 35 or 42)
    const remainingSlots = calendarDays.length > 35 ? 42 - calendarDays.length : 35 - calendarDays.length;
    for (let i = 0; i < remainingSlots; i++) {
      calendarDays.push({ day: '', isTarget: false, isCurrent: false })
    }

    monthName = targetDateObj.toLocaleString('default', { month: 'long' })
    year = targetDateObj.getFullYear()
  }

  const calendarData = {
    targetDateStr: weddingDateStr.toUpperCase(),
    monthName: (monthName || 'JANUARY').toUpperCase(),
    year: year || '2024',
    weekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    calendarDays: calendarDays.length ? calendarDays : [
      { day: '', isCurrent: false }, { day: '', isCurrent: false },
      { day: 1, isCurrent: true }, { day: 2, isCurrent: true }, { day: 3, isCurrent: true }, { day: 4, isCurrent: true }, { day: 5, isCurrent: true },
      { day: 6, isCurrent: true }, { day: 7, isCurrent: true }, { day: 8, isCurrent: true }, { day: 9, isCurrent: true }, { day: 10, isCurrent: true }, { day: 11, isCurrent: true }, { day: 12, isCurrent: true },
      { day: 13, isCurrent: true }, { day: 14, isTarget: true, isCurrent: true }, { day: 15, isCurrent: true }, { day: 16, isCurrent: true }, { day: 17, isCurrent: true }, { day: 18, isCurrent: true }, { day: 19, isCurrent: true },
    ]
  }

  const Watermark = () => showWatermark ? (
    <div className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[100] opacity-[0.25] select-none">
      {['10%', '50%', '90%'].map(top => (
        <span
          key={top}
          className="absolute left-1/2 -translate-x-1/2 text-[17px] font-medium tracking-[0.2em] text-[#8A202A]"
          style={{ top, fontFamily: "'Montserrat', sans-serif" }}
        >
          preview-inviteque
        </span>
      ))}
    </div>
  ) : null

  const PreviewNav = () => isPreview ? (
    <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
      <div className="flex gap-3">
        <button onClick={() => navigate(`/builder/${templateId}?step=4`, { state: { step: 4 } })} className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[rgba(138,32,42,0.2)] bg-white/95 backdrop-blur-md py-4 text-sm font-bold text-[#8A202A] shadow-xl hover:scale-105 active:scale-95">
          Back
        </button>
        <button onClick={() => navigate('/payment', { state: { draftData, templateId } })} className="flex-1 flex items-center justify-center gap-3 rounded-full bg-[#8A202A] py-4 text-sm font-bold text-[#F9F5EC] shadow-xl hover:scale-105 active:scale-95">
          Proceed
        </button>
      </div>
    </div>
  ) : null

  return (
    <div className="w-full bg-[#F9F5EC] overflow-x-hidden relative">
      <Watermark />
      <PreviewNav />
      
      <TemplateRoyalHeritageHero {...commonProps} />
      <TemplateRoyalHeritageStory {...commonProps} />
      <TemplateRoyalHeritageWelcome {...commonProps} />
      
      <TemplateRoyalHeritageSchedule 
        scheduleItems={scheduleItems}
        weddingDate={data.hero?.weddingDate}
        weddingMonth={data.hero?.weddingMonth}
        weddingYear={data.hero?.weddingYear}
        fontStyles={fontStyles}
      />
      
      <TemplateRoyalHeritageVenue {...commonProps} />
      
      <TemplateRoyalHeritageCalendar 
        calendarData={calendarData}
        fullAddress={fullAddress}
        {...commonProps}
      />
      
      <div style={{ backgroundColor: '#F9F5EC' }}>
        <InviteQRSVP
          events={scheduleItems}
          weddingCode={savedData?.code}
          groupSlug={groupSlug}
          isPreview={!savedData}
          theme="royal"
          config={savedData?.rsvpData}
        />
      </div>

      <TemplateRoyalHeritageCountdown {...commonProps} />

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
