import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDraft } from '../context/DraftContext.jsx'
import Countdown from '../components/Countdown.jsx'
import Events from '../components/Events.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import Invitation from '../components/Invitation.jsx'
import Story from '../components/Story.jsx'
import Venue from '../components/Venue.jsx'
import { weddingData as staticData } from '../weddingData.js'

export default function TemplateRoyalWedding({ savedData }) {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  // Determine which data to use: Saved DB data > Local Draft data > Static Fallback
  const activeData = savedData || (isPreview ? draftData : null)

  const data = activeData ? {
    ...staticData,
    hero: {
      ...staticData.hero,
      names: savedData 
        ? `${savedData.coupleData.groomName} & ${savedData.coupleData.brideName}`
        : `${draftData.groomName} & ${draftData.brideName}`,
      groomName: savedData ? savedData.coupleData.groomName : draftData.groomName,
      brideName: savedData ? savedData.coupleData.brideName : draftData.brideName,
      dateLine: savedData 
        ? `${savedData.heroData.weddingDate} ${savedData.heroData.weddingMonth} ${savedData.heroData.weddingYear}`
        : `${draftData.weddingDate} ${draftData.weddingMonth} ${draftData.weddingYear}`,
      venueName: (savedData ? savedData.venueData.mahalName : draftData.mahalName) || '',
      venueCity: (savedData ? savedData.venueData.venueCity : draftData.venueCity) || '',
      addressParts: savedData 
        ? [savedData.venueData.mahalName, savedData.venueData.venueAddress, savedData.venueData.venueCity, savedData.venueData.state].filter(Boolean)
        : [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean),
      fullAddress: savedData 
        ? [savedData.venueData.mahalName, savedData.venueData.venueAddress, savedData.venueData.venueCity, savedData.venueData.state].filter(Boolean).join(', ')
        : [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean).join(', '),
      mapUrl: savedData ? savedData.venueData.mapLink : draftData.mapLink,
      hashtag: (() => {
        const groom = savedData ? savedData.coupleData.groomName : draftData.groomName
        const bride = savedData ? savedData.coupleData.brideName : draftData.brideName
        const gName = (groom || '').trim().replace(/\s+/g, '')
        const bName = (bride || '').trim().replace(/\s+/g, '')
        return `#${gName}${bName}Forever`
      })(),
      dayOfWeek: (() => {
        const month = savedData ? savedData.heroData.weddingMonth : draftData.weddingMonth
        const date = savedData ? savedData.heroData.weddingDate : draftData.weddingDate
        const year = savedData ? savedData.heroData.weddingYear : draftData.weddingYear
        const d = new Date(`${month} ${date}, ${year}`)
        return isNaN(d.getTime()) ? 'Wednesday' : d.toLocaleDateString('en-US', { weekday: 'long' })
      })(),
    },
    venue: {
      ...staticData.venue,
      venueName: (savedData ? savedData.venueData.mahalName : draftData.mahalName) || '',
      location: savedData
        ? [savedData.venueData.mahalName, savedData.venueData.venueAddress, savedData.venueData.venueCity, savedData.venueData.state].filter(Boolean).join(', ')
        : [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean).join(', '),
      mapUrl: savedData ? savedData.venueData.mapLink : draftData.mapLink,
    },
    countdown: {
      ...staticData.countdown,
      targetDateTimeISO: savedData
        ? new Date(`${savedData.heroData.weddingMonth} ${savedData.heroData.weddingDate}, ${savedData.heroData.weddingYear}`).toISOString()
        : new Date(`${draftData.weddingMonth} ${draftData.weddingDate}, ${draftData.weddingYear}`).toISOString(),
    },
    story: {
      ...staticData.story,
      items: (() => {
        const photos = savedData 
          ? (savedData.storyData?.photos || []) 
          : (draftData.photos || [])
        const activePhotos = photos.filter(Boolean)
        return activePhotos.length > 0 
          ? activePhotos.map(p => ({ image: p })) 
          : staticData.story.items
      })(),
    },
    events: {
      ...staticData.events,
      items: (() => {
        const scheduleItems = savedData 
          ? (savedData.scheduleData?.items || []) 
          : (Array.isArray(draftData.scheduleItems) ? draftData.scheduleItems : [])
        const icons = ['✦', '◎', '✿', '◆', '♪']
        return scheduleItems.map((item, index) => ({
          icon: icons[index % icons.length],
          time: item.time,
          name: item.title,
        }))
      })(),
    },
    invitation: {
      ...staticData.invitation,
      groomName: savedData ? savedData.coupleData.groomName : draftData.groomName,
      brideName: savedData ? savedData.coupleData.brideName : draftData.brideName,
    }
  } : staticData

  const showGallery = savedData ? savedData.scheduleData?.showGallery : draftData.showGallery
  const showSchedule = savedData ? savedData.scheduleData?.showSchedule : draftData.showSchedule

  return (
    <div className="flex justify-center items-start min-h-screen bg-[#1a1a1a]">
      {/* Mobile viewport container - max 430px like a phone */}
      <div className="relative w-full max-w-[430px] min-h-[100svh] bg-background text-primary shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        {/* Repeating Watermark Overlay */}
        {isPreview && (
          <div 
            className="pointer-events-none fixed inset-0 z-[100] opacity-[0.05] select-none"
            style={{
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 100px, currentColor 100px, currentColor 101px)`,
              maskImage: 'linear-gradient(to bottom, black, black)',
            }}
          >
            <div className="flex h-full w-full flex-wrap content-start justify-center gap-20 p-10 font-bold uppercase tracking-[0.2em]">
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} className="rotate-[-25deg] text-sm">Preview • Inviteque</span>
              ))}
            </div>
          </div>
        )}

        {/* Floating Continue Button for Preview */}
        {isPreview && (
          <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
            <div className="flex gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-iqBorder bg-white py-4 text-sm font-bold text-iqText shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition hover:scale-105 active:scale-95"
              >
                <span>←</span>
                Back
              </button>
              <button 
                onClick={() => navigate('/payment', { state: { draftData, templateId } })}
                className="flex-1 flex items-center justify-center gap-3 rounded-full bg-black py-4 text-sm font-bold text-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition hover:scale-105 active:scale-95"
              >
                Proceed
                <span className="text-xs opacity-50">→</span>
              </button>
            </div>
          </div>
        )}
        
        <Hero data={data.hero} />
        
        {/* Photo Gallery is optional (Mapped to Story component) */}
        {showGallery && <Story data={data.story} />}

        <Invitation data={data.invitation} />
        
        <Venue data={data.venue} />
        
        {/* Wedding Schedule is optional */}
        {showSchedule && <Events data={data.events} />}
        
        <Countdown data={data.countdown} />
        
        <Footer data={data.footer} />
      </div>
    </div>
  )
}
