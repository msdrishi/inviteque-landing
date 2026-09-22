import photo1 from './images/photo_2026-09-22_22-59-48.jpg';
import photo2 from './images/photo_2026-09-22_22-59-55.jpg';
import photo3 from './images/photo_2026-09-22_23-00-01.jpg';

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
        quote: "As the petals fall, our love story unfolds.",
        rotation: -3,
      },
      {
        id: 2,
        image: photo2,
        title: "Shared Laughter",
        quote: "In your arms, I have found my forever home.",
        rotation: 3,
      },
      {
        id: 3,
        image: photo3,
        title: "Forever Us",
        quote: "With love in our hearts, we step into forever.",
        rotation: -2,
      }
    ],
  },
  welcome: {
    label: "Welcome",
    headingLine1: "Dear Family",
    headingLine2: "& Friends,",
    message: "With hearts full of love and gratitude, we are so excited to celebrate this beautiful chapter of our lives with you. Come celebrate, laugh, dance, eat, bless us, and make memories with us as we say “I do!”",
  },
  events: [
    {
      id: "wedding-vows",
      sectionLabel: "Wedding Vows",
      eventName: "Wedding Vows",
      name: "Wedding Vows",
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
