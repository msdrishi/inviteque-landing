import photo1 from './photos/photo_1_2026-10-29_00-06-56.jpg'
import photo2 from './photos/photo_2_2026-10-29_00-06-56.jpg'
import photo3 from './photos/photo_3_2026-10-29_00-06-56.jpg'

export const alinaTanmayData = {
  isPaid: true,
  code: 'ALINA_TANMAY',
  hasRsvp: true,

  // Couple names (with Chi. prefix as requested)
  groomName: 'Chi. Tanmay',
  brideName: 'Chi. Alina',
  weddingDate: '28',
  weddingMonth: 'February',
  weddingYear: '2027',

  // Parent details (displayed in welcome signoff)
  brideParents: 'D/O Mrs. Akhilesh Sharma & Mr. Salman Kausar',
  groomParents: 'S/O Mrs. Sheetal & Mr. Vikas Ramchandra Deshmukh',

  // Main Venue (Wedding Ceremony)
  mahalName: 'The Blue Roof Club',
  venueCity: 'Thane (West)',
  venueAddress: 'Ovala, Ghodbunder Road, Thane (West) – 400 615',
  state: 'Maharashtra',
  mapLink: 'https://share.google/NSB9iZG2V9JIQ4DuI',

  // Watermark preview
  showWatermark: true,

  // Photos for the story/photo card section
  photos: [photo1, photo2, photo3],

  // Invitation data — controls sections visibility and welcome message
  invitationData: {
    hasRsvp: true,
    showGallery: true,   // enabled — photo cards will show
    showSchedule: true,
    showWelcome: true,
    showVenue: true,
    showCountdown: true,
    welcomeMessage: 'We joyfully invite you to be a part of our wedding celebrations. Your presence will make this beautiful journey even more special and memorable for us.',
  },

  // Hero visual controls
  coupleNameScale: 0.88,
  heroBgScale: 1.15,

  // Welcome signoff with full parent names
  // User requested normal font style for "With love & blessings," so everything matches the parent names
  welcomeSignoff: 'With love & blessings,\nMrs. Akhilesh Sharma & Mr. Salman Kausar\nMrs. Sheetal & Mr. Vikas Ramchandra Deshmukh',
  welcomeSignoffUniformFont: true,
  welcomeSignoffFontSize: '17px',
  welcomeSignoffNamesFontSize: '16px',
  welcomeSignoffFirstLineStyle: 'normal',

  // Wedding Itinerary — exact details as provided
  // scheduleItems is read by the Pink Blossom template engine
  scheduleItems: [
    {
      time: '6:00 PM onwards',
      title: 'Engagement & Sangeet',
      date: '27th February 2027',
      venue: 'The Blue Roof Club, Ovala, Ghodbunder Road, Thane (West) – 400 615',
      description: 'Engagement & Sangeet Ceremony followed by Cocktail Party',
      iconSrc: '/assets/templates/royal-heirloom/icons/engagement.webp',
    },
    {
      time: '8:00 AM',
      title: 'Haldi Ceremony',
      date: '28th February 2027',
      venue: 'To be confirmed',
      iconSrc: '/assets/templates/royal-heirloom/icons/bouque.webp',
    },
    {
      time: '12:14 PM',
      title: 'Wedding Ceremony',
      date: '28th February 2027',
      venue: 'The Blue Roof Club, Ovala, Ghodbunder Road, Thane (West) – 400 615',
      iconSrc: '/assets/templates/royal-heirloom/icons/dinner.webp',
    },
    {
      time: '7:30 PM onwards',
      title: 'Reception',
      date: '28th February 2027',
      venue: 'The Blue Roof Club, Ovala, Ghodbunder Road, Thane (West) – 400 615',
      iconSrc: '/assets/templates/royal-heirloom/icons/drinks.webp',
    },
  ],

  // Hero wedding time (shown on the hero slide — main wedding ceremony time)
  weddingTime: '12:14 PM',

  // RSVP — replace the URL below with the actual Google Form link
  // e.g. 'https://forms.gle/xxxxxxxxxxx'
  rsvpUrl: 'https://forms.gle/REPLACE_WITH_ACTUAL_LINK',
  whatsappNumber: '919876543210',
  whatsappMessage: 'Hi! I am reaching out regarding the wedding invitation for Chi. Alina & Chi. Tanmay.',

  footer: {
    id: 'footer',
    coupleText: 'Chi. Alina & Chi. Tanmay',
    tagline: 'With Love & Gratitude',
    hashtag: '#AlinaWedsTanmay',
  },
};
