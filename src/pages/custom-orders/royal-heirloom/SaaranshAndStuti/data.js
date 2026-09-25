export const customData = {
  code: 'SAARANSH',
  status: 'PAID',
  groomName: 'Saaransh',
  groomFamily: 'Son of Mrs Sapna & Nitin Chopra',
  brideName: 'Stuti',
  brideFamily: 'Daughter of Mrs Meenakshi & Rajiv Puri',
  heroData: {
    weddingDate: '20',
    weddingMonth: 'December',
    weddingYear: '2026',
    weddingTime: '5:00 PM Onwards',
  },
  welcomeMessage: "Two families brought us together, but destiny had already written our story. What began as a formal introduction quickly blossomed into endless conversations, shared laughter, and a profound connection. We found not just a partner, but a soulmate in one another.",
  venueData: {
    mahalName: 'MorBagh',
    venueAddress: '16, Bandh Rd, Chattarpur',
    venueCity: 'Delhi',
    state: '',
    mapLink: 'https://maps.app.goo.gl/tQaYREQqVQ21111V6?g_st=ic'
  },
  storyData: {
    photos: [] 
  },
  eventsData: [
    {
      id: "pooja",
      title: "Pooja",
      date: "13th Dec, 2026",
      time: "11:30 AM",
      message: "Auspicious start to the event",
      venueName: "E-2420, Palam Vihar",
      venueCity: "Gurgaon",
      mapLink: "https://maps.app.goo.gl/5vq8cidzAw3TkDcA9?g_st=ic"
    },
    {
      id: "cocktail",
      title: "Cocktail",
      date: "18th Dec, 2026",
      time: "8:30 PM onwards",
      message: "Join us for an evening of drinks, dance and celebration.",
      venueName: "Amarai Farms",
      venueCity: "Delhi Ggn Rd, Kapas Hera, New Delhi",
      mapLink: "https://maps.app.goo.gl/2iquCoZgx6heyMmVA?g_st=ic"
    },
    {
      id: "haldi",
      title: "Haldi & Mehendi",
      date: "19th Dec, 2026",
      time: "3:00 PM",
      message: "Vibrant colors, love, and laughter.",
      venueName: "E-2420, Palam Vihar",
      venueCity: "Gurgaon",
      mapLink: "https://maps.app.goo.gl/5vq8cidzAw3TkDcA9?g_st=ic"
    }
  ],
  scheduleData: {
    items: [
      { time: "03:00 PM", title: "Assembly of Baraat", desc: "Join us at Morbagh, Chattarpur" },
      { time: "05:00 PM", title: "Wedding Vows", desc: "The sacred ceremony" },
      { time: "08:00 PM", title: "Reception Dinner", desc: "Dinner, drinks & dancing" }
    ],
    showSchedule: true,
    showGallery: true
  },
  rsvpData: {
    enabled: true,
    collectHeadcount: true,
    collectEvents: false,
    collectMessage: true,
  },
  sections: {
    showHero: true,
    showStory: false, // Turn off default story if not needed, they didn't provide photos
    showWelcome: true,
    showVenue: true, // we can keep the main venue at the end
    showCountdown: true
  },
  footer: {
    coupleText: 'Stuti & Saaransh',
    tagline: 'With Love & Gratitude',
    hashtag: '#StutiWedsSaaransh',
  }
};
