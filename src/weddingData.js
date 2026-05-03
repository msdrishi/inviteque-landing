import inviteData from './inviteData.json'
import envelope from './assets/illustrations/envelope.svg'
import heroArch from './assets/illustrations/hero-arch.svg'
import heroBg from './assets/hero_bg.png'
import photo1 from './assets/story/story-1.png'
import photo2 from './assets/story/story-2.png'
import photo3 from './assets/story/story-3.png'
import locationImg from './assets/place/location.png'

function parseWeddingDate(dateString) {
  const tokens = String(dateString || '').trim().split(/\s+/)
  if (tokens.length < 3) {
    return { day: '', month: '', year: '', fullDate: String(dateString || '') }
  }
  const day = tokens[0]
  const year = tokens[tokens.length - 1]
  const month = tokens.slice(1, -1).join(' ')
  return { day, month, year, fullDate: tokens.join(' ') }
}

function coupleNames(couple) {
  const groom = couple?.groomName || ''
  const bride = couple?.brideName || ''
  return [groom, bride].filter(Boolean).join(' & ')
}

const storyImages = [photo1, photo2, photo3]

export const weddingData = {
  hero: {
    id: 'top',
    title: inviteData.hero?.title,
    subtitle: 'Are Getting Married',
    dateLine: inviteData.couple?.weddingDate,
    names: coupleNames(inviteData.couple),
    groomName: inviteData.couple?.groomName || '',
    brideName: inviteData.couple?.brideName || '',
    tagline: inviteData.hero?.tagline,
    dayOfWeek: (() => {
      const d = new Date(inviteData.couple?.weddingDate || '')
      return isNaN(d) ? 'Wednesday' : d.toLocaleDateString('en-US', { weekday: 'long' })
    })(),
    venueName: inviteData.event?.venueName,
    venueCity: 'Bangalore, India',
    hashtag: `#${inviteData.couple?.groomName || 'Groom'}${inviteData.couple?.brideName || 'Bride'}Forever`,
    monogram: `${inviteData.couple?.groomName?.[0] || 'A'} & ${inviteData.couple?.brideName?.[0] || 'M'}`,
    backgroundImage: heroBg || heroArch,
    scrollToId: inviteData.hero?.scrollToId,
    scrollLabel: inviteData.hero?.scrollLabel,
  },
  story: {
    id: 'story',
    title: inviteData.storySection?.title,
    items: Array.isArray(inviteData.story)
      ? inviteData.story.map((s, index) => ({
          title: s.title,
          body: s.description,
          // customImage (from JSON) overrides the default asset
          image: s.customImage || storyImages[index] || storyImages[storyImages.length - 1],
          number: String(index + 1).padStart(2, '0'),
        }))
      : [],
  },
  invitation: {
    id: 'invitation',
    cardTitle: inviteData.invitation?.cardTitle,
    title: inviteData.invitation?.title,
    message: inviteData.invitation?.message,
    illustration: envelope,
  },
  venue: {
    id: 'venue',
    title: inviteData.event?.sectionTitle,
    venueName: inviteData.event?.venueName,
    location: inviteData.event?.address,
    mapLabel: inviteData.event?.mapLabel,
    mapUrl: inviteData.event?.mapUrl,
    backgroundImage: locationImg,
  },
  date: {
    id: 'date',
    title: inviteData.hero?.title,
    ...parseWeddingDate(inviteData.couple?.weddingDate),
  },
  events: {
    id: 'schedule',
    title: inviteData.scheduleSection?.title,
    items: Array.isArray(inviteData.schedule)
      ? inviteData.schedule.map((s, index) => ({
          icon: ['✦', '◎', '✿', '◆', '♪'][index % 5],
          time: s.time,
          name: s.title,
        }))
      : [],
  },
  countdown: {
    id: 'countdown',
    title: 'Countdown',
    // Example format: 2026-08-18T00:00:00.000Z
    // We can parse it from inviteData.couple.weddingDate
    targetDateTimeISO: new Date(inviteData.couple?.weddingDate || '2026-08-18').toISOString(),
    labels: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Min',
      seconds: 'Sec',
    },
  },
  rsvp: {
    id: 'rsvp',
    title: inviteData.rsvp?.title,
    message: inviteData.rsvp?.subtitle,
    illustration: envelope,
    primary: {
      label: inviteData.rsvp?.primary,
      href: '#',
      icon: '❤️',
    },
    secondary: {
      label: inviteData.rsvp?.secondary,
      href: '#',
      icon: '💔',
    },
  },
  footer: {
    id: 'footer',
    message: `${inviteData.footer?.headline || ''}`.trim(),
    names: `${inviteData.footer?.withLove || ''}\n${coupleNames(inviteData.couple)}`.trim(),
    socials: [],
  },
}
