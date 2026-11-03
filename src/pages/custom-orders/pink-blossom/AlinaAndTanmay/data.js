import photo1 from './photos/photo_1_2026-10-29_00-06-56.jpg'
import photo2 from './photos/photo_2_2026-10-29_00-06-56.jpg'
import photo3 from './photos/photo_3_2026-10-29_00-06-56.jpg'
import tumTakSong from './music/Tum Tak (From Raanjhanaa).mp3'

export const alinaTanmayData = {
  isPaid: true,
  code: 'ALINA_TANMAY',
  hasRsvp: true,

  // Custom Background Music (Tum Tak – Raanjhanaa)
  musicSrc: tumTakSong,

  // 1. Opening Screen:
  // Text positioned below the envelope, using an elegant cursive script font matching the parchment "Welcome" section
  // Presented inside a stylish rounded pill button
  coverTapText: 'Tap to Open',
  coverTapBelow: true,
  coverTapAsPill: true,
  coverTapFont: "'Pinyon Script', 'Alex Brush', cursive",
  coverTapColor: '#3B2210',
  hideTapUnderline: true,

  // Couple names — strictly names without 'Chi.' as requested
  groomName: 'Tanmay',
  brideName: 'Alina',
  weddingDate: '28',
  weddingMonth: 'February',
  weddingYear: '2027',

  // 1. Hero Page Configuration:
  // Couple names reversed: Alina & Tanmay
  reverseNames: true,
  brideFirst: true,
  heroIntroLine1: 'TOGETHER WITH',
  heroIntroLine2: 'LOVE',
  heroOnlyInvite: true,
  coupleNameScale: 0.95,
  heroBgScale: 1.15,

  // 2. New 2nd Page (Family Invitation directly on background without white banner):
  familyInvitation: {
    bgImage: '/assets/templates/pinkblossom/PinkBlossom-light-background.webp',
    noCard: true, // removes white banner, keeps text directly on the section
    introQuote: 'Two families, two hearts, one beautiful celebration of love.\nJoin us as we begin our forever.',
    brideName: 'Alina',
    brideParents: 'D/O Mrs. Akhilesh Sharma & Mr. Salman Kausar',
    connector: 'Weds',
    groomName: 'Tanmay',
    groomParents: 'S/O Mrs. Sheetal and\n& Mr. Vikas Ramchandra Deshmukh',
    weddingDateDetails: 'SUNDAY, 28TH FEBRUARY 2027',
    weddingTimeDetails: '12:14PM ONWARDS',
    venueName: 'THE BLUE ROOF CLUB',
    venueLocation: 'Ovala, Ghodbunder Road, Thane (West) – 400 615',
  },

  // Parent details for reference
  brideParents: 'D/O Mrs. Akhilesh Sharma & Mr. Salman Kausar',
  groomParents: 'S/O Mrs. Sheetal and\n& Mr. Vikas Ramchandra Deshmukh',

  // 5. Main Venue Details & slide configuration:
  // Remove "WHERE WE UNITE" etc and only keep "CELEBRATION VENUE & DIRECTIONS"
  mahalName: 'The Blue Roof Club',
  venueCity: 'Thane (West)',
  venueAddress: 'Ovala, Ghodbunder Road, Thane (West) – 400 615',
  state: 'Maharashtra',
  mapLink: 'https://maps.app.goo.gl/WPjBqwyyp7s99Lns9',
  headerOnlyVenue: true,
  sectionTitle: 'CELEBRATION VENUE & DIRECTIONS',
  // Mandap background:
  bgImage: '/assets/templates/pinkblossom/venue-mandap-refined.webp',

  // 1. Keep preview watermark
  showWatermark: true,

  // 6. Remove photo card section
  photos: [],

  // 3. 3rd Page — Welcome Note slide content & updated typography:
  // (7. Signoff with parent names removed from welcome note)
  invitationData: {
    hasRsvp: true,
    showGallery: false, // removes the photo card section
    showSchedule: true,
    showWelcome: true,
    showVenue: true,
    showCountdown: true,
    welcomeMessage: '“We joyfully invite you to be a part of the wedding celebrations of our children.\n\nYour presence will make this beautiful journey even more memorable.”',
  },
  welcomeMessageFont: "'Cormorant Garamond', 'Spectral', serif",
  welcomeTitleFont: "'Pinyon Script', cursive",

  // 7. Remove parent signoff in welcome section
  welcomeSignoff: null,

  // 8. 4th Slide — Wedding Schedule:
  // All 4 events, time formatted without space like 12:00PM
  scheduleItems: [
    {
      time: '6:00PM ONWARDS',
      title: 'Engagement & Sangeet',
      date: '27th February 2027',
      venue: 'The Blue Roof Club, Thane (West)',
      iconSrc: '/assets/templates/royal-heirloom/icons/engagement.webp',
    },
    {
      time: '7:00AM',
      title: 'Haldi Ceremony',
      date: '28th February 2027',
      venue: 'To be confirmed',
      iconSrc: '/assets/templates/royal-heirloom/icons/bouque.webp',
    },
    {
      time: '12:14PM',
      title: 'Wedding Ceremony',
      date: '28th February 2027',
      venue: 'The Blue Roof Club, Thane (West)',
      iconSrc: '/assets/templates/royal-heirloom/icons/dinner.webp',
    },
    {
      time: '7:30PM ONWARDS',
      title: 'Reception',
      date: '28th February 2027',
      venue: 'The Blue Roof Club, Thane (West)',
      iconSrc: '/assets/templates/royal-heirloom/icons/drinks.webp',
    },
  ],

  // Wedding time
  weddingTime: '12:14PM ONWARDS',

  // 3 & 4. RSVP Section: Keep only Google Form link (removes in-page interactive form)
  rsvpUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfvH3dxbYRhvQeQ8XRjLLjJ2Q562KJGBS_KzXhF_NzQ7--fuQ/viewform?usp=publish-editor',

  // 2. Remove WhatsApp icon (both floating and in RSVP)
  whatsappNumber: null,
  whatsappMessage: null,

  // 8. Countdown slide: keep existing template background
  countdown: {},

  // 9. 9th slide — Remove invitique logo and everything
  hideFooter: true,
};
