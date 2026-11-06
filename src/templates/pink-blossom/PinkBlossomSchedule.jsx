import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { COLORS, ASSETS } from './theme'
import ScrollDownIndicator from './ScrollDownIndicator'

// ─── Crisp Vector Event Icons for Indian Wedding Traditions (Increased Size) ───
const HaldiIcon = () => (
  <svg viewBox="0 0 36 36" width="38" height="38" fill="none" className="drop-shadow-sm">
    <ellipse cx="18" cy="27" rx="11" ry="3" fill="#D4AF37" opacity="0.3" />
    <path d="M9 19 C9 26, 27 26, 27 19 L25 15 L11 15 Z" fill="#E6A117" stroke="#B87B08" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M11 15 Q18 10 25 15 Z" fill="#FFC93C" stroke="#B87B08" strokeWidth="1" />
    <circle cx="18" cy="12" r="2.5" fill="#D47A00" />
    <circle cx="14" cy="14" r="1.5" fill="#E6A117" />
    <circle cx="22" cy="14" r="1.5" fill="#E6A117" />
    <path d="M12 15 C10 11, 10 8, 13 8 C14 10, 14 13, 12 15 Z" fill="#3D5A3A" />
    <path d="M24 15 C26 11, 26 8, 23 8 C22 10, 22 13, 24 15 Z" fill="#3D5A3A" />
    <path d="M18 12 C18 7, 18 5, 18 4 C18 5, 19 8, 18 12 Z" stroke="#3D5A3A" strokeWidth="1.2" />
    <path d="M7 10 L8 8 L10 7 L8 6 L7 4 L6 6 L4 7 L6 8 Z" fill="#D4AF37" opacity="0.8" />
    <path d="M29 9 L30 7.5 L31.5 7 L30 6.5 L29 5 L28 6.5 L26.5 7 L28 7.5 Z" fill="#D4AF37" opacity="0.8" />
  </svg>
)

const EngagementSangeetIcon = () => (
  <svg viewBox="0 0 36 36" width="38" height="38" fill="none" className="drop-shadow-sm">
    <circle cx="14" cy="20" r="7.5" stroke="#B8963E" strokeWidth="1.8" fill="none" />
    <circle cx="21" cy="19" r="7.5" stroke="#C8195E" strokeWidth="1.8" fill="none" />
    <path d="M14 12 L12 8 L16 8 Z" fill="#EBDCB9" stroke="#B8963E" strokeWidth="0.8" />
    <path d="M14 6 L12 8 L16 8 Z" fill="#FAF3E4" stroke="#B8963E" strokeWidth="0.8" />
    <path d="M14 3 L15 5 L17 6 L15 7 L14 9 L13 7 L11 6 L13 5 Z" fill="#C8195E" />
    <path d="M27 6 L27 14 A2.5 2.5 0 1 1 24.5 11.5 L27 11.5 L27 6 Z" fill="#8B1848" />
    <circle cx="24.5" cy="14" r="2.2" fill="#8B1848" />
  </svg>
)

const WeddingMandapIcon = () => (
  <svg viewBox="0 0 36 36" width="38" height="38" fill="none" className="drop-shadow-sm">
    <path d="M6 30 L30 30" stroke="#B8963E" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 30 L8 14" stroke="#B8963E" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M28 30 L28 14" stroke="#B8963E" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6 14 C6 8, 30 8, 30 14" stroke="#C8195E" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M16 8 C16 5, 20 5, 20 8 Z" fill="#B8963E" />
    <circle cx="18" cy="4" r="1.5" fill="#C8195E" />
    <path d="M14 28 L22 28 L20 25 L16 25 Z" fill="#B8963E" stroke="#8B1848" strokeWidth="0.8" />
    <path d="M18 25 C16 22, 16 19, 18 17 C20 19, 20 22, 18 25 Z" fill="#E6A117" />
    <path d="M18 24 C17 22, 17 20, 18 19 C19 20, 19 22, 18 24 Z" fill="#FFC93C" />
  </svg>
)

const ReceptionIcon = () => (
  <svg viewBox="0 0 36 36" width="38" height="38" fill="none" className="drop-shadow-sm">
    <path d="M11 7 L16 16 C16 18, 13 19, 11 18 L11 7 Z" fill="#EBDCB9" stroke="#B8963E" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M13.5 17.5 L11.5 27" stroke="#B8963E" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 27 L15 27" stroke="#B8963E" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M25 7 L20 16 C20 18, 23 19, 25 18 L25 7 Z" fill="#EBDCB9" stroke="#C8195E" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M22.5 17.5 L24.5 27" stroke="#C8195E" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 27 L28 27" stroke="#C8195E" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="18" cy="11" r="1.5" fill="#C8195E" />
    <path d="M18 6 L18 8 M18 14 L18 16 M13 11 L15 11 M21 11 L23 11" stroke="#B8963E" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const MehendiIcon = () => (
  <svg viewBox="0 0 36 36" width="38" height="38" fill="none" className="drop-shadow-sm">
    <circle cx="18" cy="18" r="10" stroke="#8B1848" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
    <circle cx="18" cy="18" r="6" stroke="#B8963E" strokeWidth="1.2" fill="#EBDCB9" />
    <circle cx="18" cy="18" r="2.5" fill="#C8195E" />
    <path d="M18 5 L18 8 M18 28 L18 31 M5 18 L8 18 M28 18 L31 18" stroke="#8B1848" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="18" cy="4" r="1" fill="#B8963E" />
    <circle cx="18" cy="32" r="1" fill="#B8963E" />
    <circle cx="4" cy="18" r="1" fill="#B8963E" />
    <circle cx="32" cy="18" r="1" fill="#B8963E" />
  </svg>
)

// Helper to choose the most suitable icon based on title/event type
function renderEventIcon(evt) {
  if (evt.customIcon) return evt.customIcon
  const title = (evt.title || evt.name || '').toLowerCase()
  if (title.includes('haldi') || title.includes('turmeric') || title.includes('pithi')) {
    return <HaldiIcon />
  }
  if (title.includes('engagement') || title.includes('ring') || title.includes('roka') || title.includes('sangeet')) {
    return <EngagementSangeetIcon />
  }
  if (title.includes('wedding') || title.includes('vow') || title.includes('phera') || title.includes('mandap') || title.includes('muhurtham') || title.includes('ceremony')) {
    return <WeddingMandapIcon />
  }
  if (title.includes('reception') || title.includes('dinner') || title.includes('cocktail') || title.includes('party') || title.includes('celebration')) {
    return <ReceptionIcon />
  }
  if (title.includes('mehendi') || title.includes('henna')) {
    return <MehendiIcon />
  }
  if (evt.iconSrc) {
    return <img src={evt.iconSrc} alt={evt.title} className="w-full h-full object-contain" />
  }
  return <WeddingMandapIcon />
}

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
}

export default function PinkBlossomSchedule({ scheduleItems, weddingDate, weddingMonth, weddingYear, fontStyles }) {
  const { serif, smallCaps } = fontStyles || {
    serif: { fontFamily: "'Cormorant Garamond', serif", color: COLORS.textDark },
    smallCaps: { fontFamily: "'Cinzel', serif", color: COLORS.primary, textTransform: 'uppercase' }
  }

  const events = useMemo(() => {
    if (Array.isArray(scheduleItems) && scheduleItems.length > 0) {
      return scheduleItems.map((item) => ({
        time: item.time || "10:30 AM",
        title: item.title || item.name || "Celebration",
        description: item.description || null,
        venue: item.venue || null,
        iconSrc: item.iconSrc || null,
        dateStr: item.date || `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}`
      }))
    }
    return [
      { time: "10:30 AM", title: "Haldi Ceremony", venue: null, dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` },
      { time: "04:30 PM", title: "Engagement & Sangeet", venue: null, dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` },
      { time: "12:14 PM", title: "Wedding Ceremony", venue: null, dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` },
      { time: "07:30 PM", title: "Reception", venue: null, dateStr: `${String(weddingMonth || 'Nov').slice(0, 3)} ${weddingDate || '28'}, ${weddingYear || '2026'}` }
    ]
  }, [scheduleItems, weddingDate, weddingMonth, weddingYear])

  const n = events.length
  const itemRowHeight = 175
  const svgHeight = Math.max(420, n * itemRowHeight)

  const { pathD, dotPoints } = useMemo(() => {
    if (n === 0) return { pathD: "", dotPoints: [] }
    const dots = Array.from({ length: n }).map((_, i) => ({ x: 200, y: 25 + i * itemRowHeight + itemRowHeight / 2 }))
    if (n === 1) return { pathD: "", dotPoints: dots }
    
    let d = `M 200 ${dots[0].y} `
    const bowDepth = 48 
    for (let i = 0; i < n - 1; i++) {
      const isLeft = i % 2 === 0
      const currentY = dots[i].y
      const nextY = dots[i+1].y
      const H = nextY - currentY
      const dX = isLeft ? bowDepth : -bowDepth
      d += `C ${200 + dX} ${currentY + H / 3}, ${200 + dX} ${nextY - H / 3}, 200 ${nextY} `
    }
    return { pathD: d, dotPoints: dots }
  }, [n, itemRowHeight])

  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: COLORS.ivory,
        paddingTop: '64px',
        paddingBottom: '80px',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxSizing: 'border-box',
      }}
      className="relative w-full flex flex-col items-center justify-center select-none"
    >
      {/* Background with texture / subtle light illustration */}
      <img 
        src={ASSETS.scheduleBg} 
        alt="Schedule Background" 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }} 
      />

      <div className="relative z-10 w-full flex flex-col items-center text-center mb-6">
        <motion.p 
          initial="hidden" 
          whileInView="visible" 
          variants={fadeAnim} 
          viewport={{ once: false, amount: 0.3 }} 
          style={{ ...smallCaps, marginBottom: '6px', letterSpacing: '0.24em' }}
        >
          TIMELINE OF EVENTS
        </motion.p>
        <motion.h2 
          initial="hidden" 
          whileInView="visible" 
          variants={fadeAnim} 
          viewport={{ once: false, amount: 0.3 }} 
          style={{ ...smallCaps, fontSize: '24px', margin: 0, letterSpacing: '0.18em' }}
        >
          WEDDING SCHEDULE
        </motion.h2>
      </div>

      <div className="relative z-10 w-full max-w-[420px] my-auto py-2" style={{ minHeight: `${svgHeight}px` }}>
        <svg viewBox={`0 0 400 ${svgHeight}`} className="absolute inset-0 w-full h-full pointer-events-none z-0" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pbScheduleCurve" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.3" />
              <stop offset="50%" stopColor={COLORS.primary} stopOpacity="0.8" />
              <stop offset="100%" stopColor={COLORS.primary} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path d={pathD} stroke="url(#pbScheduleCurve)" strokeWidth="2.2" strokeLinecap="round" />
          {dotPoints.map((pt, idx) => (
            <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill={COLORS.primary} opacity="0.85" />
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
                <div className="flex flex-col items-center text-center w-[148px] sm:w-[160px] select-none">
                  {/* Enlarged Icon Badge */}
                  <motion.div 
                    animate={{ y: [0, -4, 0], rotate: isLeft ? [-2, 2, -2] : [2, -2, 2] }}
                    transition={{ duration: 3.2 + (idx % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                    className="mb-2 flex items-center justify-center w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full shadow-md p-2.5 backdrop-blur-sm"
                    style={{ backgroundColor: `${COLORS.ivory}F6`, border: `1.5px solid rgba(200,25,94,0.25)` }}
                  >
                    {renderEventIcon(evt)}
                  </motion.div>
                  <div style={{...smallCaps, fontSize: '15px', fontWeight: 'bold', color: COLORS.textDark, marginBottom: '4px'}}>
                    {evt.time}
                  </div>
                  <h4 style={{...smallCaps, fontSize: '11px', color: COLORS.primary, marginBottom: '2px'}}>
                    {evt.title}
                  </h4>
                  <span style={{...smallCaps, fontSize: '10px', color: COLORS.textDark, opacity: 0.9}}>
                    {evt.dateStr}
                  </span>
                  {evt.venue && (
                    <span style={{...smallCaps, fontSize: '9px', color: COLORS.primaryDark, marginTop: '2px', fontWeight: 'bold'}}>
                      {evt.venue}
                    </span>
                  )}
                  {evt.description && (
                    <p style={{...serif, fontSize: '12px', marginTop: '6px', color: COLORS.textDark}}>
                      {evt.description}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <ScrollDownIndicator />
    </section>
  )
}
