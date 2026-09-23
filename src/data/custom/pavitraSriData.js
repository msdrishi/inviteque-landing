import photo3 from '../../pages/custom/images/IMG_4475.webp';
import photo2 from '../../pages/custom/images/IMG_4476.webp';
import photo1 from '../../pages/custom/images/IMG_4477.webp';

const sharedPhotos = [
  {
    id: 1,
    image: photo1,
    title: "Side by Side",
    quote: "In your arms, I have found my forever home.",
    rotation: -3,
  },
  {
    id: 2,
    image: photo2,
    title: "Shared Laughter",
    quote: "Every love story is beautiful, but ours is my favorite.",
    rotation: 3,
  },
  {
    id: 3,
    image: photo3,
    title: "Forever Us",
    quote: "Two hearts, one soul, a lifetime of beautiful memories.",
    rotation: -2,
  },
];

const sharedStory = {
  sectionLabel: "Our Story",
  heading: "From A Chance Encounter to Forever",
  paragraphs: [
    "Little did we know that we would fall in love with the person who lived right next door, our very own Leonard and Penny moment. Like Leonard, Sri fell for Pavi from the very beginning, and with his charm, patience, and incredibly kind heart, he slowly found his way into hers, too. Somewhere between friendship, endless conversations, shared laughter, and a little bit of fate, we found each other.",
    "What began unexpectedly grew into a love that stayed with us through distance, change, growing up, and everything life brought along the way.",
    "Two years later, on August 30, 2025, as the sun was setting over La Jolla Beach, Sri got down on one knee. Pavi said YES! 💍",
    "From next-door neighbors who had no idea what was coming, to best friends, to choosing each other for a lifetime, after all the almosts, the waiting, the miles, and the memories, here we are, ready for our forever. 💛",
    "With the blessings of our parents and surrounded by the love of family and friends, we are thrilled to step into this new chapter of our lives hand in hand."
  ],
  quote: "“In your arms, I have found my forever home and love.”",
};

const sharedCelebrate = {
  sectionLabel: "Celebrate & Bless Us",
  heading: "RSVP & Gift Registry",
  subtitle: "Your presence and blessings are our greatest gift. Kindly confirm your attendance or visit our registry below.",
  rsvp: {
    enabled: true,
    title: "RSVP",
    description: "Please let us know if you will be joining us.",
    buttonLabel: "RSVP Online",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSdDJpfkKVTDpoy3w2QSBeBbvPN5koVOAny9OiTjNEPj3Dm4KQ/viewform",
  },
  registry: {
    enabled: true,
    title: "Gift Registry",
    description: "For loved ones who have asked, view our curated wedding wishlist.",
    buttonLabel: "View Registry",
    url: "https://withjoy.com/pavithra-and-sriaurobindo/registry",
  },
};

const sharedFooter = {
  headline: "With Love & Gratitude",
  names: "Pavithra & Sri Aurobindo",
  watermark: "INVITEQUE",
};

export const variant1Data = {
  hero: {
    groomName: "Sri Aurobindo",
    brideName: "Pavithra",
    weddingDate: "16",
    weddingMonth: "November",
    weddingYear: "2026",
    dateLine: "16 November 2026",
    dayOfWeek: "Monday",
    weddingTime: "04:00 AM - 07:00 AM",
    venueName: "Sri Akilandaeswari Sametha Agatheeswarar Temple",
    addressParts: {
      desktop: [
        "Sri Akilandaeswari Sametha Agatheeswarar Temple",
        "1st Main St, Old Perungalathur, Tamil Nadu 600063, India"
      ],
      mobile: [
        "Sri Akilandaeswari Sametha Agatheeswarar Temple",
        "1st Main St, Old Perungalathur, Tamil Nadu"
      ]
    },
    subtitle: "Are Getting Married",
  },
  story: sharedStory,
  moments: {
    sectionLabel: "Our Moments",
    heading: "Glimpses of Forever",
    subtitle: "Every moment holds a lifetime of love and laughter",
    photos: sharedPhotos,
  },
  welcome: {
    label: "Welcome",
    headingLine1: "Dear Friends",
    headingLine2: "& Family,",
    message: "With hearts full of love and gratitude, we are so excited to celebrate this beautiful chapter of our lives with you. As we begin our forever together, it means the world to have our favorite people by our side. This website has everything you’ll need for our celebrations from event details and venues to all the little updates along the way. Come celebrate, laugh, dance, eat, bless us, and make memories with us as we say “I do!”",
  },
  events: [
    {
      id: "haldi-mehendi",
      sectionLabel: "Haldi, Mehandi & Sangeet",
      eventName: "Haldi, Mehandi & Sangeet",
      venueName: "Dspire Zone",
      date: "Saturday, 14 November 2026",
      time: "Haldi: 10:00 AM - 12:00 PM\nMehandi & Sangeet: 06:00 PM - 09:00 PM",
      dateTimeLine: "Saturday, 14 November 2026\nHaldi: 10:00 AM - 12:00 PM\nMehandi & Sangeet: 06:00 PM - 09:00 PM",
      venueLine1: "Dspire zone, 30 Srinivasa Perumal, Sannathi St",
      venueLine2: "New Perungalathur, Chennai, Tambaram, Tamil Nadu 600063",
      mapUrl: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x3a52f5ac74ed6709:0x5b1fb231c182e857",
      bgDesktop: "/backgrounds/midnight%20waltz/haldi-desktop.webp",
      bgMobile: "/backgrounds/midnight%20waltz/haldi-mobile.webp",
    },
    {
      id: "reception",
      sectionLabel: "Reception",
      eventName: "Wedding Reception",
      venueName: "Akshaya Grand Convention Hall",
      date: "Sunday, 15 November 2026",
      time: "06:00 PM - 09:00 PM",
      dateTimeLine: "Sunday, 15 November 2026 • 06:00 PM - 09:00 PM",
      venueLine1: "Akshaya Grand Convention Hall",
      venueLine2: "541, Tambaram - Mudichur - Walajabad Rd, Padappai, Tamil Nadu 601301",
      mapUrl: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x3a52f70059670129:0x2f36f3640de61d1f",
      bgDesktop: "/backgrounds/midnight%20waltz/reception-desktop.webp",
      bgMobile: "/backgrounds/midnight%20waltz/reception-mobile.webp",
    },
    {
      id: "wedding",
      sectionLabel: "Kalyanam Muhurtham",
      eventName: "Kalyanam Muhurtham",
      venueName: "Sri Akilandaeswari Sametha Agatheeswarar Temple",
      date: "Monday, 16 November 2026",
      time: "04:30 AM - 07:00 AM",
      dateTimeLine: "Monday, 16 November 2026 • 04:30 AM - 07:00 AM",
      venueLine1: "Sri Akilandaeswari Sametha Agatheeswarar Temple",
      venueLine2: "Old Perungalathur, Tamil Nadu",
      mapUrl: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x3a52f592cd2a8289:0x7218bb92cfc5499d",
      bgDesktop: "/backgrounds/midnight%20waltz/temple-desktop.webp",
      bgMobile: "/backgrounds/midnight%20waltz/temple-mobile.webp",
    },
  ],
  countdown: {
    headerTop: "COUNTING DOWN TO",
    targetDateTimeISO: "2026-11-16T04:30:00.000Z",
    labels: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
  },
  celebrate: sharedCelebrate,
  footer: sharedFooter,
};

export const variant2Data = {
  hero: {
    groomName: "Sri Aurobindo",
    brideName: "Pavithra",
    weddingDate: "15",
    weddingMonth: "November",
    weddingYear: "2026",
    dateLine: "15 November 2026",
    dayOfWeek: "Sunday",
    weddingTime: "06:00 PM - 09:00 PM",
    venueName: "Akshaya Grand Convention Hall",
    addressParts: {
      desktop: [
        "Akshaya Grand Convention Hall",
        "541, Tambaram - Mudichur - Walajabad Rd, Padappai, Tamil Nadu 601301"
      ],
      mobile: [
        "Akshaya Grand Convention Hall",
        "541, Tambaram - Mudichur - Walajabad Rd, Padappai, Tamil Nadu 601301"
      ]
    },
    subtitle: "Are Getting Married",
  },
  story: sharedStory,
  moments: {
    sectionLabel: "Our Moments",
    heading: "Glimpses of Forever",
    subtitle: "Every moment holds a lifetime of love and laughter",
    photos: sharedPhotos,
  },
  welcome: {
    label: "Welcome",
    headingLine1: "Dear Friends",
    headingLine2: "& Family,",
    message: "With hearts full of love and gratitude, we’re beginning our forever with an intimate temple wedding on November 16th, surrounded by our families. But our celebration wouldn’t be complete without the wonderful people who have been part of our journey! We warmly invite you to join us at our Wedding Reception to celebrate this beautiful new chapter. Come laugh, dance, feast, and make unforgettable memories with us. Most of all, come shower us with your love and blessings as we begin our forever together.",
  },
  events: [
    {
      id: "reception",
      sectionLabel: "Reception",
      eventName: "Wedding Reception",
      venueName: "Akshaya Grand Convention Hall",
      date: "Sunday, 15 November 2026",
      time: "06:00 PM - 09:00 PM",
      dateTimeLine: "Sunday, 15 November 2026 • 06:00 PM - 09:00 PM",
      venueLine1: "Akshaya Grand Convention Hall",
      venueLine2: "541, Tambaram - Mudichur - Walajabad Rd, Padappai, Tamil Nadu 601301",
      mapUrl: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x3a52f70059670129:0x2f36f3640de61d1f",
      bgDesktop: "/backgrounds/midnight%20waltz/reception-desktop.webp",
      bgMobile: "/backgrounds/midnight%20waltz/reception-mobile.webp",
    }
  ],
  countdown: {
    headerTop: "COUNTING DOWN TO",
    targetDateTimeISO: "2026-11-15T18:00:00.000Z",
    labels: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
  },
  celebrate: sharedCelebrate,
  footer: sharedFooter,
};
