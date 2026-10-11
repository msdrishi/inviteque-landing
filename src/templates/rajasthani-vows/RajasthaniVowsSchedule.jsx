import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from './RajasthaniVowsShared.jsx'

const defaultIconList = [
  "/assets/templates/royal-heirloom/icons/bouque.webp",
  "/assets/templates/royal-heirloom/icons/photo-session.webp",
  "/assets/templates/royal-heirloom/icons/engagement.webp",
  "/assets/templates/royal-heirloom/icons/drinks.webp",
  "/assets/templates/royal-heirloom/icons/dinner.webp",
]

export default function RajasthaniVowsSchedule({
  data = {},
  scheduleItems = [],
  weddingDate = '',
  weddingMonth = '',
  weddingYear = '',
  isDesktop = false,
}) {
  const bgImage = isDesktop
    ? (data.bgImageDesktop || "/assets/templates/rajestani-vows/background-general.webp")
    : (data.bgImageMobile || "/assets/templates/rajestani-vows/background-general.webp")

  // Resolve events list (4 default events)
  const events = useMemo(() => {
    if (Array.isArray(scheduleItems) && scheduleItems.length > 0) {
      return scheduleItems.map((item, idx) => ({
        time: item.time || '',
        title: item.title || item.name || '',
        description: item.description || null,
        iconSrc: item.iconSrc || defaultIconList[idx % defaultIconList.length],
        date: item.date || (weddingDate ? `${String(weddingMonth || 'DEC').slice(0, 3)} ${weddingDate}, ${weddingYear || '2026'}` : ''),
      }))
    }
    if (Array.isArray(data.items) && data.items.length > 0) {
      return data.items.map((item, idx) => ({
        time: item.time || '',
        title: item.title || item.name || '',
        description: item.description || null,
        iconSrc: item.iconSrc || defaultIconList[idx % defaultIconList.length],
        date: item.date || '',
      }))
    }
    return []
  }, [scheduleItems, data.items, weddingDate, weddingMonth, weddingYear])

  const n = events.length
  const itemRowHeight = 155
  const svgHeight = Math.max(400, n * itemRowHeight)

  // Dynamically compute S-curve path
  const { pathD, dotPoints } = useMemo(() => {
    if (n === 0) return { pathD: "", dotPoints: [] }

    const dots = Array.from({ length: n }).map((_, i) => ({
      x: 200,
      y: 25 + i * itemRowHeight + itemRowHeight / 2,
    }))

    if (n === 1) {
      return { pathD: "", dotPoints: dots }
    }

    let d = `M 200 ${dots[0].y} `
    const bowDepth = 45

    for (let i = 0; i < n - 1; i++) {
      const isLeft = i % 2 === 0
      const currentY = dots[i].y
      const nextY = dots[i + 1].y
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
      id="schedule"
      aria-label="Wedding Schedule"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-4 py-12 bg-[#FAF6EE] overflow-hidden"
    >
      {/* ── Background Illustration Image ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-40"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header — Consistent Font Size & Cinzel Typography */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <SectionHeader
          subtitle={data.subtitle || "TIMELINE OF EVENTS"}
          title={data.title || "WEDDING SCHEDULE"}
          description={data.description || "Follow the rhythm of our sacred moments and festivities."}
        />
      </div>

      {/* Dynamic S-Curve Timeline Container */}
      {n > 0 && (
        <div
          className="relative z-10 w-full max-w-[420px] my-auto py-4"
          style={{ minHeight: `${svgHeight}px` }}
        >
          {/* S-Curve SVG */}
          <svg
            viewBox={`0 0 400 ${svgHeight}`}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="rajasthaniRegalCurve" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C59A4E" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#7A1228" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#C59A4E" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#7A1228" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#C59A4E" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Glowing S-Curve Spine */}
            <path
              d={pathD}
              stroke="url(#rajasthaniRegalCurve)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="4 6"
              className="drop-shadow-[0_0_6px_rgba(197,154,78,0.4)]"
            />

            {/* Nodes on the path */}
            {dotPoints.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  fill="#FAF6EE"
                  stroke="#C59A4E"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
                <circle cx={pt.x} cy={pt.y} r="3" fill="#7A1228" />
              </g>
            ))}
          </svg>

          {/* Timeline Event Cards */}
          <div className="relative z-10 flex flex-col justify-between w-full h-full">
            {events.map((ev, idx) => {
              const isEven = idx % 2 === 0
              return (
                <div
                  key={idx}
                  className="w-full flex items-center"
                  style={{
                    height: `${itemRowHeight}px`,
                    justifyContent: isEven ? 'flex-start' : 'flex-end',
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: isEven ? -25 : 25, filter: 'blur(4px)' },
                      show: {
                        opacity: 1,
                        x: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.9, staggerChildren: 0.12, delayChildren: 0.1, ease: [0.16, 1, 0.3, 1] }
                      }
                    }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.2 }}
                    className="flex flex-col items-center text-center cursor-pointer select-none group"
                  >
                    {/* 1. SEPARATE EVENT ICON (Outside the banner) */}
                    {ev.iconSrc && (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          show: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
                        }}
                        className="w-12 h-12 mb-2 flex items-center justify-center p-2 rounded-full bg-[#FAF5EB] border-2 border-[#C59A4E] shadow-[0_4px_14px_rgba(122,18,40,0.14)] group-hover:scale-105 transition-transform"
                      >
                        <img
                          src={ev.iconSrc}
                          alt=""
                          className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(122,18,40,0.2)]"
                        />
                      </motion.div>
                    )}

                    {/* 2. BANNER FOR ONLY TEXT CONTENT — Staggered line by line */}
                    <div className="w-[158px] sm:w-[172px] px-3.5 py-2.5 rounded-xl bg-[#FAF5EB]/95 border border-[#C59A4E]/60 shadow-[0_8px_20px_rgba(122,18,40,0.09)] backdrop-blur-sm flex flex-col items-center text-center group-hover:shadow-[0_10px_26px_rgba(122,18,40,0.14)] transition-shadow">
                      {/* Time — Line 1 */}
                      {ev.time && (
                        <motion.span
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                          }}
                          className="font-['Cinzel'] text-[11px] font-bold tracking-[0.16em] uppercase text-[#8A1D33] block mb-0.5"
                        >
                          {ev.time}
                        </motion.span>
                      )}

                      {/* Title — Line 2 */}
                      {ev.title && (
                        <motion.span
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                          }}
                          className="font-['Cinzel'] text-[12px] sm:text-[13px] font-bold tracking-[0.06em] uppercase text-[#7A1228] block leading-tight"
                        >
                          {ev.title}
                        </motion.span>
                      )}

                      {/* Date — Line 3 */}
                      {ev.date && (
                        <motion.span
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                          }}
                          className="font-['Cinzel'] text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#C59A4E] block mt-1"
                        >
                          {ev.date}
                        </motion.span>
                      )}

                      {/* Description — Line 4 */}
                      {ev.description && (
                        <motion.span
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                          }}
                          className="font-['Cinzel'] text-[10px] tracking-wider text-[#8A1D33]/80 block mt-1"
                        >
                          {ev.description}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="h-2" />
    </section>
  )
}
