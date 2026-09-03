import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

const defaultIconList = [
  "/assets/templates/royal-heirloom/icons/bouque.png",
  "/assets/templates/royal-heirloom/icons/photo-session.png",
  "/assets/templates/royal-heirloom/icons/engagement.png",
  "/assets/templates/royal-heirloom/icons/drinks.png",
  "/assets/templates/royal-heirloom/icons/dinner.png",
]

export default function RoyalHeirloomSchedule({ scheduleItems, weddingDate, weddingMonth, weddingYear }) {
  // Support 1 to 6+ dynamic events cleanly
  const events = useMemo(() => {
    if (Array.isArray(scheduleItems) && scheduleItems.length > 0) {
      return scheduleItems.map((item, idx) => ({
        time: item.time || "10:30 AM",
        title: item.title || item.name || "Celebration",
        iconSrc: item.iconSrc || defaultIconList[idx % defaultIconList.length],
        dateStr: item.date || `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}`
      }))
    }

    // Default 5 curated events
    return [
      {
        time: "10:30 AM",
        title: "Haldi & Phoolon Ki Holi",
        iconSrc: defaultIconList[0],
        dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}`
      },
      {
        time: "01:00 PM",
        title: "Royal Portrait Session",
        iconSrc: defaultIconList[1],
        dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}`
      },
      {
        time: "04:30 PM",
        title: "Varmala & Ring Ceremony",
        iconSrc: defaultIconList[2],
        dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}`
      },
      {
        time: "07:00 PM",
        title: "Welcome Cocktails & Sangeet",
        iconSrc: defaultIconList[3],
        dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}`
      },
      {
        time: "09:00 PM",
        title: "Grand Royal Feast & Dinner",
        iconSrc: defaultIconList[4],
        dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}`
      }
    ]
  }, [scheduleItems, weddingDate, weddingMonth, weddingYear])

  const n = events.length
  // Dynamic height based on number of events: 150px per item
  const itemRowHeight = 150
  const svgHeight = Math.max(400, n * itemRowHeight)

  // Dynamically compute S-curve path that weaves cleanly through the center gap (X: 160-240)
  // Cards sit at Left: X 10-145 and Right: X 255-390
  const { pathD, dotPoints } = useMemo(() => {
    if (n === 0) return { pathD: "", dotPoints: [] }
    
    // Calculate Y position for each event node exactly in the middle of its row
    const dots = Array.from({ length: n }).map((_, i) => ({
      x: 200,
      y: 25 + i * itemRowHeight + itemRowHeight / 2
    }))

    if (n === 1) {
      return {
        pathD: "",
        dotPoints: dots
      }
    }

    // Start line exactly at the first event dot (no straight lines!)
    let d = `M 200 ${dots[0].y} `
    const bowDepth = 45 // How far the curve swings from center (200 +/- 45)

    for (let i = 0; i < n - 1; i++) {
      const isLeft = i % 2 === 0
      const currentY = dots[i].y
      const nextY = dots[i+1].y
      const H = nextY - currentY
      
      // If event text/icon is on the left, we weave the curve to the RIGHT (+bowDepth)
      // so it never overlaps the content.
      const dX = isLeft ? bowDepth : -bowDepth
      
      // Control points for a perfectly smooth (C1 continuous) sine-like wave
      const cp1X = 200 + dX
      const cp1Y = currentY + H / 3
      
      const cp2X = 200 + dX
      const cp2Y = nextY - H / 3

      d += `C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, 200 ${nextY} `
    }

    return { pathD: d, dotPoints: dots }
  }, [n, svgHeight, itemRowHeight])

  return (
    <section 
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-4 py-12 bg-[#F6EBD8] border-t border-[#E8D9C5] overflow-hidden"
      style={{ backgroundColor: '#F6EBD8' }}
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
        {/* Dynamic S-Curve SVG: Auto-adjusts with number of events and never overlaps cards */}
        <svg 
          viewBox={`0 0 400 ${svgHeight}`} 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dynamicRegalGoldCurve" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8C5329" stopOpacity="0.3" />
              <stop offset="20%" stopColor="#5A2E14" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#8C5329" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#5A2E14" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#8C5329" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* S-curve path generated strictly in the center corridor */}
          <path
            d={pathD}
            stroke="url(#dynamicRegalGoldCurve)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Node dots along center trajectory */}
          {dotPoints.map((pt, idx) => (
            <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill="#5A2E14" opacity="0.85" />
          ))}
        </svg>

        {/* Dynamic Milestone Items strictly pinned to Left and Right flanks */}
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
                {/* Event Card: max width 145px with generous margin so curve never touches */}
                <div className="flex flex-col items-center text-center w-[138px] sm:w-[148px] select-none">
                  
                  {/* Floating Micro-Animated Icon Badge */}
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

                  {/* Time Typography */}
                  <div className="font-['Cinzel'] text-[15px] sm:text-[16px] font-bold tracking-[0.06em] text-[#4A2810] leading-none mb-1">
                    {evt.time}
                  </div>

                  {/* Event Title */}
                  <h4 className="font-['Cinzel'] text-[11.5px] sm:text-[12.5px] font-semibold tracking-[0.14em] text-[#6B401D] leading-snug uppercase mb-0.5">
                    {evt.title}
                  </h4>

                  {/* Date Subtitle */}
                  <span className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-[#8C5D38] font-semibold opacity-90">
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
