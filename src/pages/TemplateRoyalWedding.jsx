import Countdown from '../components/Countdown.jsx'
import Events from '../components/Events.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import Invitation from '../components/Invitation.jsx'
import RSVP from '../components/RSVP.jsx'
import Story from '../components/Story.jsx'
import Venue from '../components/Venue.jsx'
import { weddingData } from '../weddingData.js'

export default function TemplateRoyalWedding() {
  return (
    <div className="min-h-[100svh] w-full bg-background text-primary">
      <Hero data={weddingData.hero} />
      <Story data={weddingData.story} />
      <Invitation data={weddingData.invitation} />
      <Venue data={weddingData.venue} />
      <Events data={weddingData.events} />
      <Countdown data={weddingData.countdown} />
      <RSVP data={weddingData.rsvp} />
      <Footer data={weddingData.footer} />
    </div>
  )
}
