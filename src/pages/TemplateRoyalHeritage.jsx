import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  const { draftData } = useDraft()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  const activeData = savedData || (isPreview ? draftData : null)

  const data = activeData ? {
    ...staticData,
    hero: {
      groomName: (savedData ? savedData.groomName : draftData?.groomName) || 'Groom',
      brideName: (savedData ? savedData.brideName : draftData?.brideName) || 'Bride',
      weddingDate: (savedData ? savedData.weddingDate : draftData?.weddingDate) || '14',
      weddingMonth: (savedData ? savedData.weddingMonth : draftData?.weddingMonth) || 'January',
      weddingYear: (savedData ? savedData.weddingYear : draftData?.weddingYear) || '2024',
      mahalName: (savedData ? savedData.mahalName : draftData?.mahalName) || 'Royal Palace',
    },
    venue: {
      mahalName: (savedData ? savedData.mahalName : draftData?.mahalName) || 'Royal Palace',
      venueCity: (savedData ? savedData.venueCity : draftData?.venueCity) || 'Jaipur',
      venueAddress: (savedData ? savedData.venueAddress : draftData?.venueAddress) || 'Heritage Road',
      state: (savedData ? savedData.state : draftData?.state) || 'Rajasthan',
      mapUrl: (savedData ? savedData.mapLink : draftData?.mapLink) || staticData.venue?.mapUrl || '',
    },
    countdown: {
      targetDateTimeISO: (() => {
        const dMonth = (savedData ? savedData.weddingMonth : draftData?.weddingMonth) || 'January'
        const dDate = (savedData ? savedData.weddingDate : draftData?.weddingDate) || '14'
        const dYear = (savedData ? savedData.weddingYear : draftData?.weddingYear) || '2024'
        const d = new Date(`${dMonth} ${dDate}, ${dYear}`)
        if (!isNaN(d.getTime())) return d.toISOString()
        return staticData.countdown.targetDateTimeISO
      })()
    }
  } : staticData

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
      fontFamily: "'Parisienne', 'Great Vibes', cursive",
      color: '#8A202A',
      fontWeight: 'normal',
      lineHeight: 1.2,
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
      fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
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
    overflow: 'hidden',
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

  return (
    <div className="w-full bg-[#F9F5EC] overflow-x-hidden">
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
