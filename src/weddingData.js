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

function getCouple(inviteData) {
  return inviteData.couple || inviteData.content || {}
}

function getWeddingDateLine(inviteData) {
  if (inviteData.couple?.weddingDate) return inviteData.couple.weddingDate
  const c = inviteData.content
  if (c?.weddingDate && c?.weddingMonth && c?.weddingYear) {
    return `${c.weddingDate} ${c.weddingMonth} ${c.weddingYear}`
  }
  return ''
}

function isUsableImageString(value) {
  if (!value) return false
  const s = String(value).trim()
  if (!s) return false
  if (s.includes('base64_or_url_photo')) return false
  return (
    s.startsWith('data:image/') ||
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('/')
  )
}

function buildStoryItems(inviteData) {
  if (Array.isArray(inviteData.story) && inviteData.story.length > 0) {
    return inviteData.story.map((s, index) => ({
      title: s.title,
      body: s.description,
      image: s.customImage || storyImages[index] || storyImages[storyImages.length - 1],
      number: String(index + 1).padStart(2, '0'),
    }))
  }

  const gallery = Array.isArray(inviteData.content?.gallery) ? inviteData.content.gallery : []
  const usableGallery = gallery.filter(isUsableImageString)
  const images = (usableGallery.length ? usableGallery : storyImages).slice(0, 3)

  return images.map((image, index) => ({
    title: '',
    body: '',
    image,
    number: String(index + 1).padStart(2, '0'),
  }))
}

export const weddingData = {
  hero: {
    id: 'top',
    title: inviteData.hero?.title,
    subtitle: 'Are Getting Married',
    dateLine: getWeddingDateLine(inviteData),
    names: coupleNames(getCouple(inviteData)),
    groomName: getCouple(inviteData)?.groomName || '',
    brideName: getCouple(inviteData)?.brideName || '',
    tagline: inviteData.hero?.tagline,
    dayOfWeek: (() => {
      const d = new Date(getWeddingDateLine(inviteData) || '')
      return isNaN(d) ? 'Wednesday' : d.toLocaleDateString('en-US', { weekday: 'long' })
    })(),
    venueName: inviteData.event?.venueName || inviteData.content?.venueAddress?.split?.(',')?.[0] || '',
    fullAddress: inviteData.content?.venueAddress || 'Palace Grounds, Bellary Rd',
    addressParts: (inviteData.content?.venueAddress || 'Palace Grounds, Bellary Rd').split(',').map(s => s.trim()),
    hashtag: `#${getCouple(inviteData)?.groomName || 'Groom'}${getCouple(inviteData)?.brideName || 'Bride'}Forever`,
    monogram: `${getCouple(inviteData)?.groomName?.[0] || 'A'} & ${getCouple(inviteData)?.brideName?.[0] || 'M'}`,
    backgroundImage: heroBg || heroArch,
    scrollToId: inviteData.hero?.scrollToId,
    scrollLabel: inviteData.hero?.scrollLabel,
  },
  story: {
    id: 'story',
    title: inviteData.storySection?.title,
    items: buildStoryItems(inviteData),
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
    venueName: inviteData.event?.venueName || inviteData.content?.venueAddress,
    location: inviteData.event?.address || inviteData.content?.venueAddress,
    venueCity: (() => {
      const addr = inviteData.event?.address || inviteData.content?.venueAddress || ''
      const parts = String(addr).split(',').map(s => s.trim()).filter(Boolean)
      if (parts.length >= 2) return parts[parts.length - 2]
      if (parts.length === 1) return parts[0]
      return ''
    })(),
    mapLabel: inviteData.event?.mapLabel,
    mapUrl: inviteData.event?.mapUrl || inviteData.content?.mapLink,
    backgroundImage: locationImg,
  },
  date: {
    id: 'date',
    title: inviteData.hero?.title,
    ...parseWeddingDate(getWeddingDateLine(inviteData)),
  },
  events: {
    id: 'schedule',
    title: inviteData.scheduleSection?.title || 'Wedding Schedule',
    items: (() => {
      const schedule = Array.isArray(inviteData.schedule)
        ? inviteData.schedule
        : Array.isArray(inviteData.content?.schedule)
          ? inviteData.content.schedule
          : []

      return schedule.map((s, index) => ({
        icon: ['✦', '◎', '✿', '◆', '♪'][index % 5],
        time: s.time,
        name: s.title,
      }))
    })(),
  },
  countdown: {
    id: 'countdown',
    headerTop: 'COUNTING DOWN TO',
    // Example format: 2026-08-18T00:00:00.000Z
    // We can parse it from inviteData.couple.weddingDate
    targetDateTimeISO: new Date(getWeddingDateLine(inviteData) || '2026-08-18').toISOString(),
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
    names: `${inviteData.footer?.withLove || ''}\n${coupleNames(getCouple(inviteData))}`.trim(),
    socials: [],
  },
}
