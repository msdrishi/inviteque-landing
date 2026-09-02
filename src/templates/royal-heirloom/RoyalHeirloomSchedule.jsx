import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

export default function RoyalHeirloomSchedule({ scheduleItems, weddingDate, weddingMonth, weddingYear }) {
  // 5 events matching the user icons and reference timeline structure
  const events = [
    {
      time: "10:30 AM",
      title: "Haldi & Phoolon Ki Holi",
      iconSrc: "/assets/templates/royal-heirloom/icons/bouque.png",
      dateStr: `${weddingMonth.slice(0, 3)} ${weddingDate}, ${weddingYear}`
    },
    {
      time: "01:00 PM",
      title: "Royal Portrait Session",
      iconSrc: "/assets/templates/royal-heirloom/icons/photo-session.png",
      dateStr: `${weddingMonth.slice(0, 3)} ${weddingDate}, ${weddingYear}`
    },
    {
      time: "04:30 PM",
      title: "Varmala & Ring Ceremony",
      iconSrc: "/assets/templates/royal-heirloom/icons/engagement.png",
      dateStr: `${weddingMonth.slice(0, 3)} ${weddingDate}, ${weddingYear}`
    },
    {
      time: "07:00 PM",
      title: "Welcome Cocktails & Sangeet",
      iconSrc: "/assets/templates/royal-heirloom/icons/drinks.png",
      dateStr: `${weddingMonth.slice(0, 3)} ${weddingDate}, ${weddingYear}`
    },
    {
      time: "09:00 PM",
      title: "Grand Royal Feast & Dinner",
      iconSrc: "/assets/templates/royal-heirloom/icons/dinner.png",
      dateStr: `${weddingMonth.slice(0, 3)} ${weddingDate}, ${weddingYear}`
    }
  ]

  return (
    <section 
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-4 py-12 bg-[#422719] border-t border-[#6B422D] overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #563321 0%, #3F2417 65%, #2E1A10 100%)',
      }}
    >
      {/* Header */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <SectionHeader 
          subtitle="TIMELINE OF EVENTS"
          title="WEDDING SCHEDULE"
          description="Follow the rhythm of our sacred moments and festivities."
          light={true}
        />
      </div>

      {/* Sinuous S-Curve Line Timeline Matching User Reference */}
      <div className="relative z-10 w-full max-w-[420px] my-auto py-6">
        
        {/* Continuous S-Path Line with Deep Wine / Rose Hearts along the curves */}
        <svg 
          viewBox="0 0 380 720" 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="scheduleWarmCurve" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D9B48F" stopOpacity="0.35" />
              <stop offset="25%" stopColor="#E6C8A6" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FAF0E6" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#E6C8A6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#D9B48F" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* S-curve running from top across and down through each item */}
          <path
            d="M 280 20 
               C 100 80, 70 160, 200 230 
               C 330 300, 310 380, 180 450 
               C 50 520, 90 610, 280 690"
            stroke="url(#scheduleWarmCurve)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Heart markers along curve nodes matching reference */}
          <path 
            d="M 255 75 C 255 71 251 68 247 71 C 243 68 239 71 239 75 C 239 81 247 87 247 87 C 247 87 255 81 255 75 Z" 
            fill="#8B263E" 
            stroke="#E8C5BE" 
            strokeWidth="0.8" 
          />
          <path 
            d="M 125 390 C 125 386 121 383 117 386 C 113 383 109 386 109 390 C 109 396 117 402 117 402 C 117 402 125 396 125 390 Z" 
            fill="#8B263E" 
            stroke="#E8C5BE" 
            strokeWidth="0.8" 
          />
        </svg>

        {/* 5 Milestone Items Alternating in Left / Right Harmony */}
        <div className="relative z-10 flex flex-col gap-9 py-2">
          {events.map((evt, idx) => {
            const isLeft = idx % 2 === 0
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-center w-full min-h-[90px] ${
                  isLeft ? 'justify-start pl-4 sm:pl-8' : 'justify-end pr-4 sm:pr-8'
                }`}
              >
                <div className="flex flex-col items-center text-center max-w-[175px] select-none">
                  {/* Original Transparent PNG Icon on delicate ivory parchment badge */}
                  <div className="mb-2 flex items-center justify-center w-14 h-14 rounded-full bg-[#FAF5EB] border border-[#D5C6AC] shadow-[0_4px_14px_rgba(0,0,0,0.25)] p-2">
                    <img 
                      src={evt.iconSrc} 
                      alt={evt.title} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  {/* Elegant High-Waisted Serif Time Typography matching reference */}
                  <div 
                    className="font-['Cormorant_Garamond',_serif] text-[25px] sm:text-[27px] font-light tracking-wide text-[#FDF8F2] leading-none mb-1"
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    }}
                  >
                    {evt.time}
                  </div>

                  {/* Event Name in Refined Classical Script Typography */}
                  <h4 
                    className="font-['Cinzel',_serif] text-[11.5px] sm:text-[12px] font-bold tracking-[0.12em] text-[#EBD7C1] leading-snug uppercase mb-0.5"
                  >
                    {evt.title}
                  </h4>

                  {/* Date & Subtitle */}
                  <span className="font-['Cinzel'] text-[8.5px] tracking-widest uppercase text-[#CBB29C] opacity-90">
                    {evt.dateStr}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>

      <div className="h-4" />
    </section>
  )
}
