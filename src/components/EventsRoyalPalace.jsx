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

export default function EventsRoyalPalace({ data, isDesktop, bgImage }) {
  if (!data) return null

  // Red/Gold Theme colors for Royal Palace
  const colors = {
    primary: '#E3C57C',
    primaryDark: '#D4AF37',
    accentBg: 'transparent',
    border: 'rgba(227, 197, 124, 0.4)',
    textAccent: '#E3C57C',
    bg: 'transparent',
    gold: '#E3C57C',
  }

  const defaultEvents = [
    {
      time: "11:00 AM",
      name: "Haldi Ceremony",
      icon: "✦"
    },
    {
      time: "04:00 PM",
      name: "Wedding Vows",
      icon: "✦"
    },
    {
      time: "07:00 PM",
      name: "Grand Reception",
      icon: "✦"
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
      className="w-full min-h-[100svh] md:min-h-screen px-6 py-28 relative flex flex-col items-center justify-center overflow-hidden bg-[#5C0A14]"
    >
      {/* Background Image as native img tag for consistent composting */}
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
        />
      )}
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center z-10 mb-16"
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            color: colors.gold,
            margin: '0 0 6px 0',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          Celebrating the Moments
        </p>
        <AnimatedTitle 
          text="WEDDING SCHEDULE"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: colors.primary,
            fontSize: 'clamp(28px, 5vw, 36px)',
            fontWeight: 700,
            letterSpacing: '2px',
            margin: 0,
            textTransform: 'uppercase',
          }}
        />
      </motion.div>

      {/* Timeline Container */}
      <div className="relative w-full max-w-[800px] mx-auto z-10 flex flex-col gap-12 md:gap-16">
        {/* Central timeline line */}
        <div 
          className="absolute left-[24px] md:left-1/2 top-2 bottom-2 w-[1.5px] -translate-x-[0.75px]" 
          style={{ 
            backgroundImage: `linear-gradient(to bottom, transparent, ${colors.primary} 15%, ${colors.primary} 85%, transparent)`,
            opacity: 0.25 
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
              {/* Timeline dot / icon */}
              <div 
                className="absolute left-[13px] md:left-1/2 md:-translate-x-[22px] flex items-center justify-center w-11 h-11 rounded-full bg-[#FFFDF2]/10 border border-[#E3C57C] z-20 text-[#E3C57C]"
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                {typeof item.icon === 'string' ? item.icon : '✦'}
              </div>

              {/* Event card content */}
              <div className={`w-full md:w-[45%] pl-[52px] md:pl-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                <div 
                  className="p-6 flex flex-col gap-1.5"
                  style={{ background: 'transparent' }}
                >
                  {/* Event Time */}
                  <span className="text-[#E3C57C] uppercase" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, letterSpacing: '2px', fontSize: '11px' }}>
                    {item.time}
                  </span>
                  
                  {/* Event Name */}
                  <h3 className="text-[#E3C57C] tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 600 }}>
                    {item.name}
                  </h3>

                  {/* Event Date (if present) */}
                  {item.date && (
                    <span className="text-[#E3C57C]/80 uppercase" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, letterSpacing: '1px', fontSize: '10px' }}>
                      {item.date}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
