import { useMemo } from 'react'
import { motion } from 'framer-motion'

const defaultIconList = [
  "/assets/templates/royal-heirloom/icons/bouque.png",
  "/assets/templates/royal-heirloom/icons/photo-session.png",
  "/assets/templates/royal-heirloom/icons/engagement.png",
  "/assets/templates/royal-heirloom/icons/drinks.png",
  "/assets/templates/royal-heirloom/icons/dinner.png",
]

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
}

export default function TemplateRoyalHeritageSchedule({ scheduleItems, weddingDate, weddingMonth, weddingYear, fontStyles }) {
  const { cursive, serif, smallCaps } = fontStyles || {
    cursive: { fontFamily: "'Parisienne', cursive", color: '#8A202A' },
    serif: { fontFamily: "'Cormorant Garamond', serif", color: '#4A3E20' },
    smallCaps: { fontFamily: "'Cinzel', serif", color: '#8A202A', textTransform: 'uppercase' }
  };

  const events = useMemo(() => {
    if (Array.isArray(scheduleItems) && scheduleItems.length > 0) {
      return scheduleItems.map((item, idx) => ({
        time: item.time || "10:30 AM",
        title: item.title || item.name || "Celebration",
        description: item.description || null,
        iconSrc: item.iconSrc || defaultIconList[idx % defaultIconList.length],
        dateStr: item.date || `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}`
      }))
    }
    return [
      { time: "10:30 AM", title: "Haldi", iconSrc: defaultIconList[0], dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` },
      { time: "01:00 PM", title: "Portrait", iconSrc: defaultIconList[1], dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` },
      { time: "04:30 PM", title: "Ceremony", iconSrc: defaultIconList[2], dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` },
      { time: "07:00 PM", title: "Sangeet", iconSrc: defaultIconList[3], dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` },
      { time: "09:00 PM", title: "Dinner", iconSrc: defaultIconList[4], dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` }
    ]
  }, [scheduleItems, weddingDate, weddingMonth, weddingYear])

  const n = events.length
  const itemRowHeight = 150
  const svgHeight = Math.max(400, n * itemRowHeight)

  const { pathD, dotPoints } = useMemo(() => {
    if (n === 0) return { pathD: "", dotPoints: [] }
    const dots = Array.from({ length: n }).map((_, i) => ({ x: 200, y: 25 + i * itemRowHeight + itemRowHeight / 2 }))
    if (n === 1) return { pathD: "", dotPoints: dots }
    
    let d = `M 200 ${dots[0].y} `
    const bowDepth = 45 
    for (let i = 0; i < n - 1; i++) {
      const isLeft = i % 2 === 0
      const currentY = dots[i].y
      const nextY = dots[i+1].y
      const H = nextY - currentY
      const dX = isLeft ? bowDepth : -bowDepth
      d += `C ${200 + dX} ${currentY + H / 3}, ${200 + dX} ${nextY - H / 3}, 200 ${nextY} `
    }
    return { pathD: d, dotPoints: dots }
  }, [n, svgHeight, itemRowHeight])

  return (
    <section 
      className="relative w-full flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
      style={{ backgroundColor: '#F7E8D2', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h18v2H22v18H20V20.5z\' fill=\'%238a202a\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}
    >
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <motion.p initial="hidden" whileInView="visible" variants={fadeAnim} viewport={{amount: 0.3}} style={{ ...smallCaps, marginBottom: '4px' }}>
          TIMELINE OF EVENTS
        </motion.p>
        <motion.h2 initial="hidden" whileInView="visible" variants={fadeAnim} viewport={{amount: 0.3}} style={{ ...smallCaps, fontSize: '24px', marginBottom: '8px' }}>
          WEDDING SCHEDULE
        </motion.h2>
      </div>

      <div className="relative z-10 w-full max-w-[420px] my-auto py-4" style={{ minHeight: `${svgHeight}px` }}>
        <svg viewBox={`0 0 400 ${svgHeight}`} className="absolute inset-0 w-full h-full pointer-events-none z-0" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="scheduleCurve" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8A202A" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8A202A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8A202A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path d={pathD} stroke="url(#scheduleCurve)" strokeWidth="2.2" strokeLinecap="round" />
          {dotPoints.map((pt, idx) => (
            <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill="#8A202A" opacity="0.85" />
          ))}
        </svg>

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
                className={`relative flex items-center w-full ${isLeft ? 'justify-start pl-1 sm:pl-2' : 'justify-end pr-1 sm:pr-2'}`}
              >
                <div className="flex flex-col items-center text-center w-[138px] sm:w-[148px] select-none">
                  <motion.div 
                    animate={{ y: [0, -4, 0], rotate: isLeft ? [-2, 2, -2] : [2, -2, 2] }}
                    transition={{ duration: 3.2 + (idx % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                    className="mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5EB]/95 border border-[rgba(138,32,42,0.2)] shadow-sm p-2"
                  >
                    <img src={evt.iconSrc} alt={evt.title} className="w-full h-full object-contain" />
                  </motion.div>
                  <div style={{...smallCaps, fontSize: '15px', fontWeight: 'bold', color: '#4A3E20', marginBottom: '4px'}}>
                    {evt.time}
                  </div>
                  <h4 style={{...smallCaps, fontSize: '11px', color: '#8A202A', marginBottom: '2px'}}>
                    {evt.title}
                  </h4>
                  <span style={{...smallCaps, fontSize: '10px', color: '#4A3E20', opacity: 0.9}}>
                    {evt.dateStr}
                  </span>
                  {evt.description && (
                    <p style={{...serif, fontSize: '12px', marginTop: '6px', color: '#4A3E20'}}>
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
