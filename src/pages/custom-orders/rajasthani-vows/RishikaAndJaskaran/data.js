const baseHero = {
  groomName: "Major Jaskaran",
  brideName: "Rishika",
  dateLine: "6th - 7th December 2026",
  weddingMonth: "DEC",
  weddingDate: "06, 07",
  weddingYear: "2026",
  dayOfWeek: "WEEKEND",
  weddingTime: "DELHI",
  venueName: "DELHI CANTONMENT",
  venueCity: "New Delhi",
  addressParts: {
    desktop: ["Delhi Cantt, New Delhi"],
    mobile: ["Delhi Cantt, New Delhi"],
  },
  addressLines: ["Delhi Cantt, New Delhi"],
  ganeshaLogo: "/assets/templates/royal-heirloom/ganesha-logo.webp",
  andText: "and",
  subtitle: "ARE GETTING MARRIED",
};

const baseWelcome = {
  introText: "cordially invite you to the Wedding of the beloved granddaughter of",
  headingLine1: "Smt Swadesh Sharma",
  headingLine2: "(W/O Lt Sh. Upender Prakash Kashyap)",
  message: "cordially invite you to the Wedding of their beloved granddaughter Rishika (D/o Bindu and Ashutosh Kashyap) With Major Jaskaran (S/o Sukhwinder Kaur and Hon. Capt Rajinder Pal Singh (Retd))",
  closingMessage: "As we celebrate the new beginnings, your presence and blessings will make this day unforgettable and truly special",
  warmRegards: "With warm regards,",
  familySignoff: "Kashyap’s family",
};

const baseFooter = {
  closingMessage: "As we celebrate the new beginnings, your presence and blessings will make this day unforgettable and truly special",
  familyMessage: "With warm regards,\nKashyap’s family",
  thankYouMessage: "Thank You"
};

const haldiEvent = {
  name: "Sundowner Haldi & Sagai",
  title: "Sundowner Haldi & Sagai",
  date: "6th December 2026",
  time: "4:00 PM Onwards",
  icon: "✨",
  iconSrc: "/assets/templates/royal-heirloom/icons/bouque.webp",
  venue: "1, Chelmsford Rd, Railway Colony, Connaught Place",
  mapLink: "https://maps.app.goo.gl/1vvJdEZEcwsR2F4S8?g_st=ic"
};

const anandKarajEvent = {
  name: "Anand Karaj",
  title: "Anand Karaj",
  date: "7th December 2026",
  time: "10:00 AM",
  icon: "🙏",
  iconSrc: "/assets/templates/royal-heirloom/icons/engagement.webp",
  venue: "Gurudwara Sahib Sardar Bazar, Delhi Cantt",
  mapLink: "https://maps.app.goo.gl/j6neZVbWhRoXf2Av7?g_st=ic"
};

const pherasEvent = {
  name: "Sundowner Pheras",
  title: "Sundowner Pheras",
  date: "7th December 2026",
  time: "4:30 PM",
  icon: "🔥",
  iconSrc: "/assets/templates/royal-heirloom/icons/drinks.webp",
  venue: "28 The Mall, Delhi Cantonment, Abdul Hamid Dwar, Lawn 1 Akanksha",
  mapLink: "https://maps.app.goo.gl/WLdJv6QiDoZ2oURW7?g_st=ic"
};

const receptionEvent = {
  name: "Wedding Reception & Dinner",
  title: "Wedding Reception",
  date: "7th December 2026",
  time: "7:00 PM Onwards",
  icon: "🥂",
  iconSrc: "/assets/templates/royal-heirloom/icons/dinner.webp",
  venue: "28 The Mall, Delhi Cantonment, Abdul Hamid Dwar, Lawn 1 Akanksha",
  mapLink: "https://maps.app.goo.gl/WLdJv6QiDoZ2oURW7?g_st=ic"
};

const baseStory = {
  subtitle: "CHAPTERS OF LOVE",
  title: "OUR MOMENTS",
  description: "Cherished moments from our pre-wedding journey.",
  photos: [
    {
      image: "https://pub-4ca73fd30e93414984c8221837b12dc5.r2.dev/rajasthani-vows/1791655962106-photo_1_2026-10-10_23-33-37.webp",
      title: "Where It Began",
      momentTag: "MOMENT 01"
    },
    {
      image: "https://pub-4ca73fd30e93414984c8221837b12dc5.r2.dev/rajasthani-vows/1791655977055-photo_2_2026-10-10_23-33-37.webp",
      title: "A Timeless Promise",
      momentTag: "MOMENT 02"
    },
    {
      image: "https://pub-4ca73fd30e93414984c8221837b12dc5.r2.dev/rajasthani-vows/1791655985459-photo_3_2026-10-10_23-33-37.webp",
      title: "Forever & Always",
      momentTag: "MOMENT 03"
    }
  ],
  footerSignature: "Forever in Love"
};

// 1. Complete Invitation
export const weddingDataComplete = {
  hero: baseHero,
  welcome: baseWelcome,
  story: baseStory,
  events: {
    items: [haldiEvent, anandKarajEvent, pherasEvent, receptionEvent]
  },
  footer: baseFooter
};

// 2. Customized Invitation (Excludes Anand Karaj)
export const weddingDataCustom = {
  hero: baseHero,
  welcome: baseWelcome,
  story: baseStory,
  events: {
    items: [haldiEvent, pherasEvent, receptionEvent]
  },
  footer: baseFooter
};

// 3. Hindu Wedding Invitation (Only relevant Hindu events - assuming Haldi, Pheras, Reception)
export const weddingDataHindu = {
  hero: baseHero,
  welcome: baseWelcome,
  story: baseStory,
  events: {
    items: [haldiEvent, pherasEvent, receptionEvent]
  },
  footer: baseFooter
};
