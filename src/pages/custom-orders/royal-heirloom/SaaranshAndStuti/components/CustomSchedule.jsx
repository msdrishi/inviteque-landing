import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '../../../../../templates/royal-heirloom/RoyalHeirloomShared.jsx'

const defaultIconList = [
  "/assets/templates/royal-heirloom/icons/bouque.webp",
  "/assets/templates/royal-heirloom/icons/photo-session.webp",
  "/assets/templates/royal-heirloom/icons/engagement.webp",
  "/assets/templates/royal-heirloom/icons/drinks.webp",
  "/assets/templates/royal-heirloom/icons/dinner.webp",
]

export default function CustomSchedule({ scheduleItems, weddingDate, weddingMonth, weddingYear }) {
  // Support 1 to 6+ dynamic events cleanly
  const events = useMemo(() => {
    if (Array.isArray(scheduleItems) && scheduleItems.length > 0) {
      return scheduleItems.map((item, idx) => ({
        time: item.time || "10:30 AM",
        title: item.title || item.name || "Celebration",
        description: item.description || null,
        iconSrc: item.iconSrc || defaultIconList[idx % defaultIconList.length],
        dateStr: item.date || `${String(weddingMonth || 'Dec').slice(0, 3)} ${weddingDate || '20'}, ${weddingYear || '2026'}`
      }))
    }

    return [
      {
        time: "3:00 PM",
        title: "Assembly of Baraat",
        description: "At Morbagh",
        iconSrc: defaultIconList[0],
        dateStr: `${String(weddingMonth || 'Dec').slice(0, 3)} ${weddingDate || '20'}, ${weddingYear || '2026'}`
      },
      {
        time: "6:00 PM",
        title: "Wedding Vows",
        description: "The sacred ceremony",
        iconSrc: defaultIconList[2],
        dateStr: `${String(weddingMonth || 'Dec').slice(0, 3)} ${weddingDate || '20'}, ${weddingYear || '2026'}`
      },
      {
        time: "08:00 PM Onwards",
        title: "Reception Dinner",
        description: "Dinner, drinks & dancing",
        iconSrc: defaultIconList[4],
        dateStr: `${String(weddingMonth || 'Dec').slice(0, 3)} ${weddingDate || '20'}, ${weddingYear || '2026'}`
      }
    ]
  }, [scheduleItems, weddingDate, weddingMonth, weddingYear])

  const n = events.length
  const itemRowHeight = 150
  const svgHeight = Math.max(400, n * itemRowHeight)

  const { pathD, dotPoints } = useMemo(() => {
    if (n === 0) return { pathD: "", dotPoints: [] }
    
    const dots = Array.from({ length: n }).map((_, i) => ({
      x: 200,
      y: 25 + i * itemRowHeight + itemRowHeight / 2
    }))

    if (n === 1) {
      return { pathD: "", dotPoints: dots }
    }

    let d = `M 200 ${dots[0].y} `
    const bowDepth = 45

    for (let i = 0; i < n - 1; i++) {
      const isLeft = i % 2 === 0
      const currentY = dots[i].y
      const nextY = dots[i+1].y
      const H = nextY - currentY
      const dX = isLeft ? bowDepth : -bowDepth
      
      const cp1X = 200 + dX
      const cp1Y = currentY + H / 3
      const cp2X = 200 + dX
      const cp2Y = nextY - H / 3

      d += `C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, 200 ${nextY} `
    }

    return { pathD: d, dotPoints: dots }
  }, [n, itemRowHeight])

  return (
    <section 
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-4 py-12 bg-[#ECE3D1] overflow-hidden"
      style={{ backgroundColor: '#ECE3D1' }}
    >
      {/* Header matching royal heirloom palette */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <SectionHeader 
          subtitle="TIMELINE OF EVENTS"
          title="WEDDING SCHEDULE"
          description="Follow the rhythm of our sacred moments and festivities."
          light={false}
        />
      </div>

      {/* Dynamic S-Curve Timeline Container */}
      <div 
        className="relative z-10 w-full max-w-[420px] my-auto py-4"
        style={{ minHeight: `${svgHeight}px` }}
      >
        <svg 
          viewBox={`0 0 400 ${svgHeight}`} 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dynamicRegalGoldCurveSaaransh" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8C5329" stopOpacity="0.3" />
              <stop offset="20%" stopColor="#5A2E14" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#8C5329" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#5A2E14" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#8C5329" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <path
            d={pathD}
            stroke="url(#dynamicRegalGoldCurveSaaransh)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {dotPoints.map((pt, idx) => (
            <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill="#5A2E14" opacity="0.85" />
          ))}
        </svg>

        {/* Dynamic Milestone Items */}
        <div className="relative z-10 flex flex-col w-full">
          {events.map((evt, idx) => {
            const isLeft = idx % 2 === 0
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.85, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ minHeight: `${itemRowHeight}px` }}
                className={`relative flex items-center w-full ${
                  isLeft ? 'justify-start pl-1 sm:pl-2' : 'justify-end pr-1 sm:pr-2'
                }`}
              >
                <div className="flex flex-col items-center text-center w-[138px] sm:w-[148px] select-none">
                  <motion.div 
                    animate={{ 
                      y: [0, -4, 0],
                      rotate: isLeft ? [-2, 2, -2] : [2, -2, 2]
                    }}
                    transition={{
                      duration: 3.2 + (idx % 3) * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.3,
                    }}
                    className="mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5EB]/95 border border-[#CBB89D] shadow-[0_4px_12px_rgba(70,35,15,0.15)] p-2 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img 
                      src={evt.iconSrc} 
                      alt={evt.title} 
                      className="w-full h-full object-contain" 
                    />
                  </motion.div>

                  <div className="font-['Cinzel'] text-[15px] sm:text-[16px] font-bold tracking-[0.06em] text-[#4A2810] leading-none mb-1">
                    {evt.time}
                  </div>

                  <h4 className="font-['Cinzel'] text-[11.5px] sm:text-[12.5px] font-semibold tracking-[0.14em] text-[#6B401D] leading-snug uppercase mb-0.5">
                    {evt.title}
                  </h4>

                  <span className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-[#8C5D38] font-semibold opacity-90">
                    {evt.dateStr}
                  </span>

                  {evt.description && (
                    <p className="font-['Cormorant_Garamond'] text-[12px] sm:text-[13px] leading-tight text-[#4A2810]/80 mt-1.5 italic px-2">
                      {evt.description}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
