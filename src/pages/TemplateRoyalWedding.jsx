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

export default function TemplateRoyalWedding() {
  const location = useLocation()
  const { templateId } = useParams()
  const { draftData } = useDraft()
  const navigate = useNavigate()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'

  // Merge static data with user's draft data for preview
  const data = isPreview ? {
    ...staticData,
    hero: {
      ...staticData.hero,
      names: `${draftData.groomName} & ${draftData.brideName}`,
      groomName: draftData.groomName,
      brideName: draftData.brideName,
      dateLine: `${draftData.weddingDate} ${draftData.weddingMonth} ${draftData.weddingYear}`,
      venueName: draftData.mahalName || '',
        fullAddress: [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean).join(', '),
        addressParts: [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean),
    },
    venue: {
      ...staticData.venue,
      venueName: draftData.mahalName || '',
        location: [draftData.mahalName, draftData.venueAddress, draftData.venueCity, draftData.state].filter(Boolean).join(', '),
      mapUrl: draftData.mapLink,
        venueCity: draftData.venueCity || '',
    },
    countdown: {
      ...staticData.countdown,
      targetDateTimeISO: new Date(`${draftData.weddingMonth} ${draftData.weddingDate}, ${draftData.weddingYear}`).toISOString(),
    },
    story: {
      ...staticData.story,
      items: (() => {
        const photos = (draftData.photos || []).filter(Boolean)
        return photos.length ? photos.map(p => ({ image: p })) : staticData.story.items
      })(),
    },
    events: {
      ...staticData.events,
      title: staticData.events?.title || 'Wedding Schedule',
      items: (() => {
        const scheduleItems = Array.isArray(draftData.scheduleItems) ? draftData.scheduleItems : []
        const icons = ['✦', '◎', '✿', '◆', '♪']
        return scheduleItems.map((item, index) => ({
          icon: icons[index % icons.length],
          time: item.time,
          name: item.title,
        }))
      })(),
    }
  } : staticData

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
                Confirm
                <span className="text-xs opacity-50">→</span>
              </button>
            </div>
          </div>
        )}
        
        <Hero data={data.hero} />
        
        {/* Photo Gallery is optional (Mapped to Story component) */}
        {draftData.showGallery && <Story data={data.story} />}

        <Invitation data={data.invitation} />
        
        <Venue data={data.venue} />
        
        {/* Wedding Schedule is optional */}
        {draftData.showSchedule && <Events data={data.events} />}
        
        <Countdown data={data.countdown} />
        
        <Footer data={data.footer} />
      </div>
    </div>
  )
}
