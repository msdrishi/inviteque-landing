import photo1 from './images/IMG_4472.webp';
import photo2 from './images/IMG_4473.webp';
import photo3 from './images/IMG_4474.webp';

export const customData = {
  hero: {
    groomName: "SHARAN RAJ",
    brideName: "SHANTERIYGA",
    weddingDate: "01",
    weddingMonth: "NOV",
    weddingYear: "2026",
    dateLine: "01 NOV 2026",
    dayOfWeek: "SUNDAY",
    weddingTime: "08:00 AM - 10:00 AM",
    venueName: "",
    addressParts: {
      desktop: [],
      mobile: []
    },
    subtitle: "ARE GETTING MARRIED",
  },
  venue: {
    venueName: "KING HALL, MY FAME HOTEL",
    venueLine1: "Wisma City Kingdom, B3 Floor, Lebuhraya Seremban - Bukit Nanas",
    venueLine2: "70200 Seremban, Negeri Sembilan.",
    mapUrl: "https://share.google/jaI6o5WeR6pu5kBhH",
  },
  moments: {
    sectionLabel: "Our Moments",
    heading: "Celebrating the Moments",
    subtitle: "Every moment holds a lifetime of love and laughter",
    photos: [
      {
        id: 1,
        image: photo1,
        title: "Side by Side",
        quote: "With love in our hearts, we step into forever.",
        rotation: -3,
      },
      {
        id: 2,
        image: photo2,
        title: "Shared Laughter",
        quote: "As the petals fall, our love story unfolds.",
        rotation: 3,
      },
      {
        id: 3,
        image: photo3,
        title: "Forever Us",
        quote: "In your arms, I have found my forever home.",
        rotation: -2,
      }
    ],
  },
  welcome: {
    label: "Welcome",
    headingLine1: "Dear Family",
    headingLine2: "& Friends,",
    message: "Your presence is a cherished part of our celebration. Join us as we gather with love, laughter, and blessings to celebrate the beginning of our beautiful journey together.",
  },
  events: [
    {
      id: "wedding-vows",
      sectionLabel: "Wedding Vows",
      eventName: "Wedding Ceremony",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
          <path d="M9 7l1-2 1 2" />
        </svg>
      ),
      name: "Wedding Ceremony",
      venueName: "KING HALLY MY FAME HOTEL",
      date: "Sunday, 01 November 2026",
      time: "08:00 AM - 10:00 AM",
      dateTimeLine: "Sunday, 01 November 2026 • 08:00 AM - 10:00 AM",
      venueLine1: "King Hall, My Fame Hotel, Wisma City Kingdom, B3 Floor",
      venueLine2: "Lebuhraya Seremban - Bukit Nenas, Taman Ast, 70200 Seremban, Negeri Sembilan, Malaysia",
      mapUrl: "https://share.google/jaI6o5WeR6pu5kBhH",
      bgDesktop: "/assets/templates/midnight-waltz/venue-desktop.webp",
      bgMobile: "/assets/templates/midnight-waltz/venue-mobile.webp",
    },
    {
      id: "wedding-luncheon",
      sectionLabel: "Wedding Luncheon",
      eventName: "Wedding Luncheon",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 15c0-4 3.5-7 7-7s7 3 7 7" />
          <path d="M12 8V6M10 6h4" />
          <path d="M3 15h18" />
          <path d="M4 17h16" />
        </svg>
      ),
      name: "Wedding Luncheon",
      venueName: "KING HALLY MY FAME HOTEL",
      date: "Sunday, 01 November 2026",
      time: "10:15 AM",
      dateTimeLine: "Sunday, 01 November 2026 • 10:15 AM",
      venueLine1: "King Hall, My Fame Hotel, Wisma City Kingdom, B3 Floor",
      venueLine2: "Lebuhraya Seremban - Bukit Nenas, Taman Ast, 70200 Seremban, Negeri Sembilan, Malaysia",
      mapUrl: "https://share.google/jaI6o5WeR6pu5kBhH",
      bgDesktop: "/assets/templates/midnight-waltz/venue-desktop.webp",
      bgMobile: "/assets/templates/midnight-waltz/venue-mobile.webp",
    }
  ],
  countdown: {
    headerTop: "COUNTING DOWN TO",
    targetDateTimeISO: "2026-11-01T08:00:00.000Z",
    labels: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
  },
  celebrate: {
    sectionLabel: "Celebrate & Bless Us",
    heading: "RSVP & Gift Registry",
    subtitle: "Your presence and blessings are our greatest gift. Kindly confirm your attendance or visit our registry below.",
    rsvp: {
      enabled: false,
    },
    registry: {
      enabled: false,
    }
  },
  footer: {
    headline: "With Love & Gratitude",
    names: "Sharan Raj & Shanteriyga",
    watermark: "INVITEQUE",
  }
};
