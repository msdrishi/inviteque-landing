/**
 * Custom Client Data: Shradha
 * Base Template: Everlasting Vows
 * Celebration: Rajasthani Roka & Engagement Ceremony
 * 
 * Traditional Rajasthani cultural theme celebrating the auspicious Roka followed by Engagement (Sagai).
 */

export const shradhaData = {
  hero: {
    groomName: "Aayush",
    brideName: "Shradha",
    dateLine: "18 December 2026",
    dayOfWeek: "Friday",
    weddingTime: "10:00 AM onwards",
    venueName: "The Royal Rajputana Palace",
    venueCity: "Jaipur, Rajasthan",
    addressParts: {
      desktop: [
        "The Royal Rajputana Palace & Heritage Lawns",
        "Amer Road, Jaipur, Rajasthan 302002"
      ],
      mobile: [
        "The Royal Rajputana Palace",
        "Amer Road, Jaipur, Rajasthan"
      ]
    },
    hashtag: "#ShradhaKiSagai",
    monogram: "S & A",
    location: "Jaipur, Rajasthan",
    subtitle: "Roka & Engagement Ceremony",
    topTag: "Padharo Mhare Des • Shubh Vivah Purv",
    invitationNote: "With the divine blessings of our elders and the grace of God, we joyfully invite you to celebrate our auspicious Roka & Engagement ceremony."
  },

  // Removed Photo Moments and Welcome Section as per requirements
  showGallery: false,
  showWelcome: false,

  // Multi-Event Schedule: Roka followed by Engagement
  events: [
    {
      id: "roka-ceremony",
      sectionLabel: "Auspicious Beginning",
      eventName: "Traditional Roka Ceremony",
      venueName: "The Heritage Darbar Courtyard",
      dateTimeLine: "Friday, 18 December 2026 • 10:30 AM onwards",
      venueLine1: "The Heritage Darbar Courtyard, Rajputana Palace",
      venueLine2: "Amer Road, Jaipur, Rajasthan 302002",
      dressCode: "Traditional Rajasthani / Bandhani & Royal Ethnic",
      description: "The sacred shagun ceremony, tilak rituals, exchange of auspicious tokens, and heartfelt blessings from elders marking the official union of two families.",
      mapUrl: "https://maps.google.com/?q=Jaipur+Rajasthan",
      bgDesktop: "/assets/templates/everlasting-vows/photo-desktop.webp",
      bgMobile: "/assets/templates/everlasting-vows/photo-mobile.webp",
    },
    {
      id: "engagement-ceremony",
      sectionLabel: "Ring Ceremony & Sangeet",
      eventName: "Engagement & Royal Sagai Celebration",
      venueName: "The Grand Royal Sheesh Lawns",
      dateTimeLine: "Friday, 18 December 2026 • 06:30 PM onwards",
      venueLine1: "The Grand Royal Sheesh Lawns, Rajputana Palace",
      venueLine2: "Amer Road, Jaipur, Rajasthan 302002",
      dressCode: "Royal Festive & Indo-Western Glamour",
      description: "Exchange of rings celebrating eternal commitment, followed by folk musical performances, Rajasthani cultural night, and a lavish royal banquet.",
      mapUrl: "https://maps.google.com/?q=Jaipur+Rajasthan",
      bgDesktop: "/assets/templates/everlasting-vows/venue-desktop.webp",
      bgMobile: "/assets/templates/everlasting-vows/venue-mobile.webp",
    },
  ],

  venue: {
    sectionLabel: "Celebration Venue",
    venueName: "The Royal Rajputana Palace",
    venueLine1: "The Royal Rajputana Palace & Heritage Lawns",
    venueLine2: "Amer Road, Jaipur, Rajasthan 302002",
    dateTime: "Friday, 18 December 2026",
    mapUrl: "https://maps.google.com/?q=Jaipur+Rajasthan",
  },

  countdown: {
    headerTop: "COUNTING DOWN TO THE AUSPICIOUS CEREMONY",
    targetDateTimeISO: "2026-12-18T10:30:00.000Z",
    labels: {
      days: "Days",
      hours: "Hours",
      minutes: "Min",
      seconds: "Sec",
    },
  },

  celebrate: {
    sectionLabel: "Celebrate & Bless Us",
    heading: "RSVP & Warm Wishes",
    subtitle: "Your warm presence, love, and blessings are the greatest gift as we begin this cherished chapter. Kindly grace us with your esteemed presence.",
    rsvp: {
      enabled: true,
      title: "RSVP For Roka & Engagement",
      description: "Please let us know if you will be gracing our celebration by December 05, 2026.",
      buttonLabel: "Confirm Attendance",
      url: "https://forms.google.com",
    },
    registry: {
      enabled: false,
      title: "Blessings & Wishes",
      description: "Only your auspicious blessings and gracious presence are requested.",
      url: "",
    }
  },

  footer: {
    closingText: "With Warm Regards & Best Compliments",
    familyNames: "The Sharma & Singhania Families",
    coupleNames: "Shradha & Aayush",
    footnote: "Padharo Mhare Des • We look forward to celebrating together!"
  }
}
