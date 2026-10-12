import photo1 from './components/photos/photo-1.webp'
import photo2 from './components/photos/photo-2.webp'
import photo3 from './components/photos/photo-3.webp'

const baseHero = {
  groomName: "Major Jaskaran",
  brideName: "Rishika",
  coupleTitle: "Rishika weds Major Jaskaran",
  hashtag: "#HeartsOnDuty",
  location: "Delhi",
  city: "Delhi",
  dateLine: "6th - 7th December 2026",
  weddingMonth: "DEC",
  weddingDate: "6, 7",
  weddingYear: "2026",
  ganeshaLogo: "/assets/templates/royal-heirloom/ganesha-logo.webp",
};

const baseWelcome = {
  line1: "Shree Ganeshay Namah",
  line2: "Smt Swadesh Sharma",
  line3: "(W/O Sh. Upender Prakash Kashyap)",
  line4: "cordially invite you to the Wedding of their beloved grandaughter",
  bride: "Rishika",
  brideParent: "(D/o Bindu and Ashutosh Kashyap)",
  conjunction: "With",
  groom: "Major Jaskaran",
  groomParent: "(S/o Sukhwinder Kaur and\nHon. Capt Rajinder Pal Singh (Retd) )",
};

const haldiEvent = {
  id: "haldi",
  name: "Sundowner Haldi & Sagai",
  title: "Sundowner Haldi & Sagai",
  date: "6th December 2026",
  dayNumber: "6",
  ordinal: "th",
  monthYear: "December 2026",
  time: "4:00 PM Onwards",
  icon: "✨",
  iconSrc: "/assets/templates/royal-heirloom/icons/bouque.webp",
  venue: "1, Chelmsford Rd, Railway Colony, Connaught Place",
  mapLink: "https://maps.app.goo.gl/1vvJdEZEcwsR2F4S8?g_st=ic",
};

const anandKarajEvent = {
  id: "anand-karaj",
  name: "Anand Karaj",
  title: "Anand Karaj",
  date: "7th December 2026",
  dayNumber: "7",
  ordinal: "th",
  monthYear: "December 2026",
  time: "10:00 AM",
  icon: "🌸",
  iconSrc: "/assets/templates/royal-heirloom/icons/engagement.webp",
  venue: "Gurudwara Sahib Sardar Bazar, Delhi Cantt",
  mapLink: "https://maps.app.goo.gl/j6neZVbWhRoXf2Av7?g_st=ic",
};

const weddingReceptionEvent = {
  id: "reception",
  name: "Sundowner Pheras & Wedding Reception",
  titleLine1: "Sundowner Pheras",
  connector: "followed by",
  titleLine2: "Wedding Reception",
  date: "7th December 2026",
  dayNumber: "7",
  ordinal: "th",
  monthYear: "December 2026",
  icon: "🥂",
  iconSrc: "/assets/templates/royal-heirloom/icons/drinks.webp",
  venue: "28 The Mall, Delhi Cantonment, Abdul Hamid Dwar, Lawn 1 Akanksha",
  mapLink: "https://maps.app.goo.gl/WLdJv6QiDoZ2oURW7?g_st=ic",
};

const scheduleItems = [
  {
    time: "4:30 PM",
    title: "Sundowner Pheras",
    date: "7th December 2026",
    iconSrc: "/assets/templates/royal-heirloom/icons/engagement.webp",
  },
  {
    time: "7:00 PM",
    title: "Wedding Reception",
    date: "7th December 2026",
    iconSrc: "/assets/templates/royal-heirloom/icons/drinks.webp",
  },
];

const baseStory = {
  subtitle: "CHAPTERS OF LOVE",
  title: "OUR MOMENTS",
  description: "Cherished moments from our pre-wedding journey.",
  photos: [
    {
      image: photo1,
      title: "Where It Began",
    },
    {
      image: photo2,
      title: "A Timeless Promise",
    },
    {
      image: photo3,
      title: "Forever & Always",
    },
  ],
  footerSignature: "Forever in Love",
};

const baseRegards = {
  message: "As we celebrate the new beginnings, your presence and blessings will make this day unforgettable and truly special",
  regards: "With warm regards,",
  signoff: "Kashyap’s",
};

const baseFooter = {
  closingMessage: "As we celebrate the new beginnings, your presence and blessings will make this day unforgettable and truly special",
  familyMessage: "With warm regards,\nKashyap’s",
  names: "Rishika weds Major Jaskaran",
  thankYouMessage: "Thank You",
};

// 1. Complete Invitation
export const weddingDataComplete = {
  hero: baseHero,
  welcome: baseWelcome,
  story: baseStory,
  events: {
    items: [haldiEvent, anandKarajEvent, weddingReceptionEvent],
    schedule: scheduleItems,
  },
  regards: baseRegards,
  footer: baseFooter,
};

// 2. Customized Invitation
export const weddingDataCustom = {
  hero: baseHero,
  welcome: baseWelcome,
  story: baseStory,
  events: {
    items: [haldiEvent, anandKarajEvent, weddingReceptionEvent],
    schedule: scheduleItems,
  },
  regards: baseRegards,
  footer: baseFooter,
};

// 3. Hindu Wedding Invitation
export const weddingDataHindu = {
  hero: baseHero,
  welcome: baseWelcome,
  story: baseStory,
  events: {
    items: [haldiEvent, anandKarajEvent, weddingReceptionEvent],
    schedule: scheduleItems,
  },
  regards: baseRegards,
  footer: baseFooter,
};
