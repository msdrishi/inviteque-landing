import { motion } from 'framer-motion'

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
}

function AnimatedTitle({ text, className, style }) {
  return (
    <motion.h2 variants={letterContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className={className} style={style}>
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterAnim} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
      ))}
    </motion.h2>
  )
}

export default function Events({ data, isDesktop, theme, bgImage }) {
  if (!data) return null

  const colors = theme === 'green' ? {
    primary: '#3D5236',
    primaryDark: '#2B3B25',
    accentBg: '#EAF0E8',
    border: '#A7BCA3',
    textAccent: '#5F7C56',
    bg: '#FFFFFF',
    gold: '#D4AF37',
  } : {
    primary: '#8B1E2D',
    primaryDark: '#5C0A14',
    accentBg: '#fff0ec',
    border: '#d5b28c',
    textAccent: '#a07870',
    bg: '#FFFFFF',
    gold: '#D4AF37',
  }

  const defaultEvents = [
    {
      time: "11:00 AM",
      name: "Haldi Ceremony",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z" />
          <path d="M12 12V4M9 5l3-1 3 1" />
          <circle cx="7" cy="8" r="0.5" fill="currentColor" />
          <circle cx="17" cy="7" r="0.5" fill="currentColor" />
          <path d="M5 14l14 0" />
        </svg>
      )
    },
    {
      time: "04:00 PM",
      name: "Wedding Vows",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
          <path d="M9 7l1-2 1 2" />
        </svg>
      )
    },
    {
      time: "07:00 PM",
      name: "Grand Reception",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 15c0-4 3.5-7 7-7s7 3 7 7" />
          <path d="M12 8V6M10 6h4" />
          <path d="M3 15h18" />
          <path d="M4 17h16" />
        </svg>
      )
    }
  ]

  const items = (data.items !== undefined)
    ? (data.items || []).map((item, i) => ({
        icon: item.icon || defaultEvents[i % defaultEvents.length]?.icon || '✦',
        time: item.time || '',
        name: item.name || item.title || '',
        date: item.date || ''
      }))
    : defaultEvents.map((item) => ({
        ...item,
        date: ''
      }));

  if (items.length === 0) {
    return null
  }

  return (
    <section 
      id={data.id || 'events'} 
      className="w-full min-h-[100svh] md:min-h-screen px-6 py-28 relative flex flex-col items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ 
        backgroundImage: bgImage ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${bgImage})` : 'none',
        backgroundColor: colors.bg 
      }}
    >
      {/* ── Title Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center z-10 mb-16"
      >
        {theme === 'green' ? (
          <>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(11px, 2.8vw, 13px)',
                color: colors.gold,
                margin: '0 0 6px 0',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              Celebrating the Moments
            </p>
            <AnimatedTitle 
              text="WEDDING SCHEDULE"
              style={{
                fontFamily: "'Cinzel', serif",
                color: colors.primaryDark,
                fontSize: 'clamp(22px, 5vw, 32px)',
                fontWeight: 700,
                letterSpacing: '0.18em',
                margin: 0,
                textTransform: 'uppercase',
              }}
            />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3 opacity-60">
              <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.textAccent }}></div>
              <svg width="24" height="10" viewBox="0 0 24 10" fill="none">
                <path d="M12 0C12 5 7 5 0 5C7 5 12 5 12 10C12 5 17 5 24 5C17 5 12 5 12 0Z" fill={colors.textAccent}/>
              </svg>
              <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.textAccent }}></div>
            </div>

            <AnimatedTitle 
              text="WEDDING SCHEDULE"
              style={{ fontFamily: "'Cinzel', serif", color: colors.primaryDark, fontSize: 'clamp(18px, 4vw, 30px)', fontWeight: 700, letterSpacing: '0.08em' }}
            />

            <div className="flex items-center gap-3 mt-3 opacity-70">
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.textAccent }}></div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: colors.textAccent, fontSize: '10px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Celebrating Love, Together
              </p>
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.textAccent }}></div>
            </div>
          </>
        )}
      </motion.div>

      {/* ── Timeline Container ── */}
      <div className="relative w-full max-w-[800px] mx-auto z-10 flex flex-col gap-12 md:gap-16">
        {/* Central timeline line */}
        <div 
          className="absolute left-[24px] md:left-1/2 top-2 bottom-2 w-[1.5px] -translate-x-[0.75px]" 
          style={{ 
            backgroundImage: `linear-gradient(to bottom, transparent, ${colors.primary} 15%, ${colors.primary} 85%, transparent)`,
            opacity: 0.2 
          }}
        />

        {items.map((item, index) => {
          const isEven = index % 2 === 0
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col md:flex-row items-start md:items-center w-full relative ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Card component */}
              <div className={`w-full md:w-[45%] pl-[56px] md:pl-0 flex ${isEven ? 'md:justify-end md:pr-10' : 'md:justify-start md:pl-10'}`}>
                <div 
                  className="p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3.5 w-full text-left max-w-[290px] md:max-w-[320px] shadow-[0_6px_25px_rgba(61,82,54,0.03)] hover:shadow-[0_10px_30px_rgba(61,82,54,0.06)]"
                  style={{
                    borderColor: 'rgba(61, 82, 54, 0.1)',
                    background: colors.accentBg,
                    borderBottom: `3px solid ${colors.primary}`,
                  }}
                >
                  {/* Icon on the left */}
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: '#FFFFFF', color: colors.primary }}
                  >
                    {typeof item.icon === 'string' ? <span className="text-sm">{item.icon}</span> : item.icon}
                  </div>

                  {/* Content on the right */}
                  <div className="flex-1 min-w-0">
                    {/* Time + Date Badge */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span 
                        className="text-[8.5px] font-bold tracking-[0.16em] uppercase px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: colors.primaryDark,
                          fontFamily: "'Montserrat', sans-serif"
                        }}
                      >
                        {item.time}
                      </span>
                      {item.date && (
                        <span 
                          className="text-[8.5px] font-bold tracking-[0.16em] uppercase opacity-75"
                          style={{
                            color: colors.primary,
                            fontFamily: "'Montserrat', sans-serif"
                          }}
                        >
                          {item.date}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-xs md:text-sm font-semibold"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: colors.primaryDark,
                        letterSpacing: '0.02em',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Node Dot marker */}
              <div 
                className="absolute left-[24px] md:left-1/2 top-6 md:top-auto -translate-x-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center z-20 shadow-sm"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.primary,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.gold }}
                />
              </div>

              {/* Empty space for grid alignment on desktop */}
              <div className="hidden md:block w-[45%]" />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
