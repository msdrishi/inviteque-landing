import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const calenderBg = "/assets/templates/royal-heritage/calender-mobile.webp"

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
}

export default function TemplateRoyalHeritageCalendar({ calendarData, fullAddress, fontStyles, sectionStyle, bgStyle }) {
  const { cursive, serif, smallCaps } = fontStyles || {
    cursive: { fontFamily: "'Parisienne', cursive", color: '#8A202A' },
    serif: { fontFamily: "'Cormorant Garamond', serif", color: '#4A3E20' },
    smallCaps: { fontFamily: "'Cinzel', serif", color: '#8A202A', textTransform: 'uppercase' }
  };
  
  const sectionRef = useRef(null)
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.15 })

  return (
    <section 
      ref={sectionRef}
      style={sectionStyle}
      className="flex flex-col items-center justify-center px-5 py-12"
    >
      <img 
        src={calenderBg} 
        alt="Calendar Background" 
        style={{
          ...bgStyle,
          objectPosition: 'center center',
          transform: 'scale(1.15)'
        }} 
      />

      {/* Title Content */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2 mb-8">
        <motion.p initial="hidden" whileInView="visible" variants={fadeAnim} viewport={{amount: 0.3}} style={{ ...smallCaps, marginBottom: '4px' }}>
          MARK YOUR CALENDAR
        </motion.p>
        <motion.h2 initial="hidden" whileInView="visible" variants={fadeAnim} viewport={{amount: 0.3}} style={{ ...smallCaps, fontSize: '24px', marginBottom: '8px' }}>
          THE DATE
        </motion.h2>
      </div>

      {/* Monthly Calendar Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[360px] bg-[rgba(249,245,236,0.95)] backdrop-blur-md border border-[rgba(138,32,42,0.3)] rounded-[12px] p-6 shadow-2xl flex flex-col items-center text-center my-auto"
      >
        {/* Big Target Date Summary */}
        <span style={{ ...smallCaps, fontSize: '11px', fontWeight: 'bold' }}>
          {calendarData.targetDateStr}
        </span>
        <span style={{ ...smallCaps, fontSize: '9.5px', color: '#4A3E20', marginTop: '4px' }}>
          {fullAddress}
        </span>

        <div className="w-full h-[1px] bg-[#8A202A] opacity-30 my-4" />

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 w-full gap-1 mb-2 text-center">
          {calendarData.weekDays.map((wd, idx) => (
            <span key={idx} style={{ ...smallCaps, fontSize: '12px', fontWeight: 'bold', color: '#4A3E20' }}>{wd}</span>
          ))}
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 w-full gap-1 text-center">
          {calendarData.calendarDays.map((item, idx) => {
            return (
              <div key={idx} className="relative flex items-center justify-center py-2 h-9">
                {item.isTarget ? (
                  <motion.div 
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#8A202A] text-[#F9F5EC] shadow-md"
                  >
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '17px', fontWeight: 'bold', zIndex: 10 }}>
                      {item.day}
                    </span>
                  </motion.div>
                ) : (
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: '16px', color: item.isCurrent ? '#4A3E20' : 'rgba(74,62,32,0.4)', fontWeight: item.isCurrent ? 'bold' : 'normal' }}>
                    {item.day}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Month & Year Label */}
        <div className="w-full border-t border-[rgba(138,32,42,0.3)] mt-4 pt-3 flex items-center justify-between">
          <span style={{ ...smallCaps, fontSize: '12px', fontWeight: 'bold' }}>{calendarData.monthName}</span>
          <span style={{ color: '#8A202A' }}>✦</span>
          <span style={{ ...smallCaps, fontSize: '12px', fontWeight: 'bold' }}>{calendarData.year}</span>
        </div>
      </motion.div>

    </section>
  )
}
