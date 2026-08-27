/**
 * Custom Client Data: Pavitra & Sri
 * Base Template: Midnight Waltz
 * 
 * Edit this file anytime to update text, dates, venues, addresses, Google Maps links, and RSVP/Registry links.
 */

export const pavitraSriData = {
  hero: {
    groomName: "Sri",
    brideName: "Pavitra",
    dateLine: "12 November 2026",
    dayOfWeek: "Thursday",
    weddingTime: "09:00 AM - 10:30 AM",
    venueName: "Sri Venkateswara Royal Mandapam",
    venueCity: "Bengaluru, Karnataka",
    addressParts: {
      desktop: [
        "Sri Venkateswara Royal Mandapam",
        "Palace Road, Vasanth Nagar, Bengaluru, Karnataka"
      ],
      mobile: [
        "Sri Venkateswara Royal Mandapam",
        "Palace Road, Vasanth Nagar, Bengaluru"
      ]
    },
    hashtag: "#PavitraWedsSri",
    monogram: "P & S",
    location: "Bengaluru, Karnataka",
  },

  story: {
    sectionLabel: "Our Story",
    heading: "From A Chance Encounter to Forever",
    paragraphs: [
      "What began as a simple conversation blossomed into a connection that felt like coming home. Through shared laughter, quiet evenings, and countless adventures, we discovered that life's most precious moments are the ones spent together.",
      "With the blessings of our parents and surrounded by the love of family and friends, we are thrilled to step into this new chapter of our lives hand in hand.",
    ],
    quote: "“In your arms, I have found my forever home.”",
  },

  moments: {
    sectionLabel: "Our Moments",
    heading: "Glimpses of Forever",
    subtitle: "Every moment holds a lifetime of love and laughter",
    photos: [
      {
        id: 1,
        image: "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto,w_800/v1786831801/midnight-waltz-image-1.png",
        title: "Side by Side",
        quote: "In your arms, I have found my forever home.",
        rotation: -3,
      },
      {
        id: 2,
        image: "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto,w_800/v1786831803/midnight-waltz-image-2.png",
        title: "Shared Laughter",
        quote: "Every love story is beautiful, but ours is my favorite.",
        rotation: 3,
      },
      {
        id: 3,
        image: "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto,w_800/v1786831805/midnight-waltz-image-3.png",
        title: "Forever Us",
        quote: "Two hearts, one soul, a lifetime of beautiful memories.",
        rotation: -2,
      },
    ],
  },

  welcome: {
    label: "Welcome",
    headingLine1: "Dear Friends",
    headingLine2: "& Family,",
    message: "Your presence is a cherished part of our celebration. Join us as we gather with love, laughter, and blessings to celebrate the beginning of our beautiful journey together.",
  },

  // Multi-Event Venues (Each rendered as a full-screen Midnight Waltz venue section)
  events: [
    {
      id: "haldi-mehendi",
      sectionLabel: "Haldi & Mehendi",
      eventName: "Haldi & Mehendi Ceremony",
      venueName: "The Grand Pavilion Lawns",
      dateTimeLine: "Tuesday, 10 November 2026 • 10:00 AM onwards",
      venueLine1: "The Grand Pavilion, Banquet Lawns",
      venueLine2: "123 Blossom Avenue, Chennai, Tamil Nadu 600028",
      dressCode: "Yellow & Festive Pastels",
      mapUrl: "https://maps.google.com/?q=Chennai+Tamil+Nadu",
      bgDesktop: "/backgrounds/midnight%20waltz/haldi-desktop.png",
      bgMobile: "/backgrounds/midnight%20waltz/haldi-mobile.png",
      isWeddingOnly: false, // Excluded in Variant 2
    },
    {
      id: "reception",
      sectionLabel: "Wedding Reception",
      eventName: "Evening Sangeet & Reception",
      venueName: "The Leela Grand Ballroom",
      dateTimeLine: "Wednesday, 11 November 2026 • 07:00 PM onwards",
      venueLine1: "The Leela Palace, Diplomatic Enclave",
      venueLine2: "Chanakyapuri, New Delhi, Delhi 110021",
      dressCode: "Formal & Indo-Western Glamour",
      mapUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi",
      bgDesktop: "/backgrounds/midnight%20waltz/reception-desktop.png",
      bgMobile: "/backgrounds/midnight%20waltz/reception-mobile.png",
      isWeddingOnly: false, // Excluded in Variant 2
    },
    {
      id: "wedding",
      sectionLabel: "Our Venue",
      eventName: "Muhurtham & Wedding Ceremony",
      venueName: "Sri Venkateswara Royal Mandapam",
      dateTimeLine: "Thursday, 12 November 2026 • 09:00 AM - 10:30 AM",
      venueLine1: "Sri Venkateswara Kalyana Mandapam",
      venueLine2: "Palace Road, Vasanth Nagar, Bengaluru 560052",
      dressCode: "Traditional Silk / Ethnic Attire",
      mapUrl: "https://maps.google.com/?q=Bangalore+Palace+Bengaluru",
      bgDesktop: "/backgrounds/midnight%20waltz/temple-desktop.png",
      bgMobile: "/backgrounds/midnight%20waltz/temple-mobile.png",
      isWeddingOnly: true, // Included in both Variant 1 & Variant 2
    },
  ],

  countdown: {
    headerTop: "COUNTING DOWN TO",
    targetDateTimeISO: "2026-11-12T09:00:00.000Z",
    labels: {
      days: "Days",
      hours: "Hours",
      minutes: "Min",
      seconds: "Sec",
    },
  },

  // Celebrate & Bless Us (RSVP & Gift Registry)
  celebrate: {
    sectionLabel: "Celebrate & Bless Us",
    heading: "RSVP & Gift Registry",
    subtitle: "Your presence and blessings are our greatest gift. Kindly confirm your attendance or visit our registry below.",
    rsvp: {
      enabled: true,
      title: "RSVP",
      description: "Please let us know if you will be joining us by October 25, 2026.",
      buttonLabel: "RSVP Online",
      url: "https://forms.google.com",
    },
    registry: {
      enabled: true,
      title: "Gift Registry",
      description: "For loved ones who have asked, view our curated wedding wishlist.",
      buttonLabel: "View Registry",
      url: "https://www.amazon.com/wedding",
    },
  },

  footer: {
    headline: "With Love & Gratitude",
    names: "Pavitra & Sri",
    watermark: "INVITEQUE",
  },
}
