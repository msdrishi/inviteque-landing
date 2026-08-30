/**
 * Custom Client Data: Shradha & Gagan
 * Base Template: Everlasting Vows
 * Celebration: Rajasthani Roka & Engagement Ceremony
 */

export const shradhaData = {
  hero: {
    groomName: "Gagan",
    brideName: "Shradha",
    brideFamily: "Soin’s",
    groomFamily: "Vashishth’s",
    welcomeHeading: "Welcome You All",
    welcomeMessage: "We warmly welcome you all and would love to have your gracious presence to celebrate our new beginning.",
    dateLine: "20 October 2026",
    dayOfWeek: "Tuesday",
    weddingTime: "11:00 AM onwards",
    venueName: "Hotel Delite Grand, Faridabad",
    venueCity: "Faridabad, Haryana",
    addressParts: {
      desktop: [
        "Hotel Delite Grand, Faridabad",
        "A-5/B, Neelam Bata Road, Shahid Bhagat Singh Marg, NIT, Faridabad, Haryana 121001"
      ],
      mobile: [
        "Hotel Delite Grand, Faridabad",
        "Neelam Bata Road, NIT, Faridabad"
      ]
    },
    hashtag: "#ShradhaWedsGagan",
    monogram: "S & G",
    location: "Faridabad, Haryana",
    subtitle: "Together with their families",
    topTag: "पधारो सा • Khamma Ghani",
    invitationNote: "We warmly welcome you all and would love to have your gracious presence to celebrate our auspicious Roka & Engagement."
  },

  // Removed Photo Moments, Welcome, and RSVP sections as per requirements
  showGallery: false,
  showWelcome: false,
  showRsvp: false,

  // Multi-Event Schedule: Roka followed by Engagement
  events: [
    {
      id: "roka-ceremony",
      sectionLabel: "Shubh Shuruwaat",
      eventName: "Roka Ceremony",
      dateTimeLine: "Tuesday, 20 October 2026 • 11:00 AM Onwards",
      description: "The sacred shagun ceremony, tilak rituals, exchange of auspicious tokens, and heartfelt blessings from elders.",
      bgDesktop: "/assets/templates/everlasting-vows/roka-event-desktop.webp",
      bgMobile: "/assets/templates/everlasting-vows/roka-event-mobile.webp",
    },
    {
      id: "engagement-ceremony",
      sectionLabel: "Ring Ceremony",
      eventName: "Engagement",
      dateTimeLine: "Tuesday, 20 October 2026 • Followed by Engagement",
      description: "Followed after the Roka ceremony with ring exchange, celebratory music, and royal feast.",
      bgDesktop: "/assets/templates/everlasting-vows/engagement-desktop.webp",
      bgMobile: "/assets/templates/everlasting-vows/engagement-mobile.webp",
    },
  ],

  venue: {
    sectionLabel: "Celebration Venue",
    venueName: "Hotel Delite Grand, Faridabad",
    venueLine1: "A-5/B, Neelam Bata Road, Shahid Bhagat Singh Marg",
    venueLine2: "New Industrial Township, Faridabad, Haryana 121001",
    dateTime: "Tuesday, 20 October 2026",
    mapUrl: "https://maps.app.goo.gl/c5nfTwpDkq7cerDR8?g_st=ic",
  },

  countdown: {
    headerTop: "COUNTING DOWN TO THE AUSPICIOUS CEREMONY",
    targetDateTimeISO: "2026-10-20T11:00:00.000Z",
    labels: {
      days: "Days",
      hours: "Hours",
      minutes: "Min",
      seconds: "Sec",
    },
  },

  footer: {
    closingText: "Warmly Invited & With Best Compliments From",
    familyNames: "Soin’s & Vashishth’s",
    brideFamily: "Soin’s Family",
    groomFamily: "Vashishth’s Family",
    coupleNames: "Shradha & Gagan",
    footnote: "पधारो सा • We look forward to your gracious presence!"
  }
}
