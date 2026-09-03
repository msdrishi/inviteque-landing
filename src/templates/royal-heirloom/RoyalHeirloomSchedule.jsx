import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

export default function RoyalHeirloomSchedule({ scheduleItems, weddingDate, weddingMonth, weddingYear }) {
  // 5 events with icons directly used matching user reference
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

  const textureImg = "/assets/templates/royal-heirloom/texture.png"

  return (
    <section 
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-4 py-12 bg-[#B58A6E] border-t border-[#A4795E] overflow-hidden"
    >
      {/* Texture image on top of background as requested: without color overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${textureImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header matching royal heirloom palette */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <SectionHeader 
          subtitle="TIMELINE OF EVENTS"
          title="WEDDING SCHEDULE"
          description="Follow the rhythm of our sacred moments and festivities."
          light={false}
        />
      </div>

      {/* Sinuous Curved Line Timeline Matching User Reference */}
      <div className="relative z-10 w-full max-w-[440px] my-auto py-6">
        
        {/* Continuous Solid S-Path Line in regal warm umber/gold */}
        <svg 
          viewBox="0 0 400 820" 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="scheduleRegalGoldCurve" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8C5329" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#5A2E14" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#8C5329" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#5A2E14" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8C5329" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* S-curve: full solid line, accentuated curves weaving dynamically between cards */}
          <path
            d="M 240 10 
               C 340 80, 310 150, 200 210 
               C 90 270, 70 340, 200 410 
               C 330 480, 310 550, 200 620 
               C 90 690, 110 760, 220 810"
            stroke="url(#scheduleRegalGoldCurve)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Interactive trajectory node dots */}
          <circle cx="200" cy="210" r="3.5" fill="#5A2E14" />
          <circle cx="200" cy="410" r="3.5" fill="#5A2E14" />
          <circle cx="200" cy="620" r="3.5" fill="#5A2E14" />
        </svg>

        {/* 5 Milestone Items Alternating in Left / Right Harmony */}
        <div className="relative z-10 flex flex-col gap-9 py-2">
          {events.map((evt, idx) => {
            const isLeft = idx % 2 === 0
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.85, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-center w-full min-h-[90px] ${
                  isLeft ? 'justify-start pl-2 sm:pl-4' : 'justify-end pr-2 sm:pr-4'
                }`}
              >
                <div className="flex flex-col items-center text-center w-[150px] sm:w-[165px] select-none">
                  
                  {/* Floating Micro-Animated Icon with Circular Warm Parchment Badge */}
                  <motion.div 
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: isLeft ? [-2, 2, -2] : [2, -2, 2]
                    }}
                    transition={{
                      duration: 3.2 + (idx % 3) * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.35,
                    }}
                    className="mb-1.5 flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#FAF5EB]/95 border border-[#CBB89D] shadow-[0_5px_15px_rgba(70,35,15,0.18)] p-2 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img 
                      src={evt.iconSrc} 
                      alt={evt.title} 
                      className="w-full h-full object-contain" 
                    />
                  </motion.div>

                  {/* Refined Time Typography in warm espresso */}
                  <div 
                    className="font-['Cinzel'] text-[14px] sm:text-[15px] font-bold tracking-[0.08em] text-[#4A2810] leading-none mb-1"
                  >
                    {evt.time}
                  </div>

                  {/* Elegant Event Title in Cinzel matching theme */}
                  <h4 
                    className="font-['Cinzel'] text-[9.5px] sm:text-[10px] font-semibold tracking-[0.16em] text-[#6B401D] leading-snug uppercase mb-0.5"
                  >
                    {evt.title}
                  </h4>

                  {/* Date indicator in soft terracotta */}
                  <span className="font-['Cinzel'] text-[7.5px] sm:text-[8px] tracking-[0.14em] uppercase text-[#8C5D38] font-semibold opacity-90">
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
