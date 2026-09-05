import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

export default function RoyalHeirloomCalendar({ 
  calendarData, 
  fullAddress,
}) {
  const aeroplaneImg = "/assets/templates/royal-heirloom/aeroplane-savethedate.png"
  const sectionRef = useRef(null)
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.15 })

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-5 py-12 bg-[#F6EBD8] border-t border-[#E8D9C5] overflow-hidden"
    >
      {/* Elegant Curvy Lines Texture */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 Q25 5, 50 20 T100 20' fill='none' stroke='%238C5329' stroke-width='1.5'/%3E%3Cpath d='M0 40 Q25 25, 50 40 T100 40' fill='none' stroke='%238C5329' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 40px'
        }}
      />

      {/* Title Content */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2 mb-8">
        <SectionHeader 
          subtitle="MARK YOUR CALENDAR"
          title="THE DATE"
          description="Save the auspicious date and celebrate our sacred matrimony."
        />
      </div>

      {/* Aeroplane Animation: flies diagonally across the calendar area only */}
      <div className="absolute top-0 left-0 right-0 h-[80svh] z-40 pointer-events-none overflow-hidden select-none">
        <motion.div
          animate={isSectionInView ? {
            x: ['-240px', '100vw'],
            y: ['60svh', '10svh'],
          } : {
            x: '-240px',
            y: '60svh'
          }}
          transition={isSectionInView ? {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          } : { duration: 0 }}
          className="absolute top-0 w-[240px] drop-shadow-[0_4px_10px_rgba(70,35,15,0.3)] select-none"
        >
          {/* Add a slight upward tilt so it naturally points along the diagonal path */}
          <img
            src={aeroplaneImg}
            alt="Aeroplane"
            className="w-full h-auto object-contain pointer-events-none transform -rotate-12"
          />
        </motion.div>
      </div>

      {/* Monthly Calendar Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[360px] bg-[#FAF5EB]/95 backdrop-blur-md border border-[#CBB89D] rounded-[22px] p-6 shadow-[0_20px_50px_rgba(90,50,20,0.12)] flex flex-col items-center text-center my-auto"
      >
        {/* Big Target Date Summary */}
        <span className="font-['Cinzel'] text-[11px] tracking-[0.28em] uppercase text-[#8C5D38] font-bold">
          {calendarData.targetDateStr}
        </span>
        <span className="font-['Cinzel'] text-[9.5px] tracking-widest text-[#7A5540] uppercase mt-0.5">
          {fullAddress}
        </span>

        <div className="w-full h-[0.8px] bg-[#D5C6AC] my-4" />

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 w-full gap-1 mb-2 text-center text-[#6B401D] font-['Cinzel'] text-[12px] sm:text-[13px] font-bold tracking-wider">
          {calendarData.weekDays.map((wd, idx) => (
            <span key={idx}>{wd}</span>
          ))}
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 w-full gap-1 text-center">
          {calendarData.calendarDays.map((item, idx) => {
            return (
              <div 
                key={idx} 
                className="relative flex items-center justify-center py-2 h-9"
              >
                {item.isTarget ? (
                  /* Wedding Date Highlight with Soft Heart Accent */
                  <motion.div 
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#8C5329] text-[#FFF6E5] shadow-md"
                  >
                    <span className="font-['Bodoni_Moda',_'Cinzel',_serif] text-[17px] font-bold leading-none z-10">
                      {item.day}
                    </span>
                    {/* Tiny Floating Heart Badge */}
                    <span className="absolute -top-1.5 -right-1 text-[13px] text-[#A64B2A] drop-shadow-sm select-none">
                      ♥
                    </span>
                  </motion.div>
                ) : (
                  <span 
                    className={`font-['Bodoni_Moda',_'Cinzel',_serif] text-[16px] sm:text-[17px] leading-none ${
                      item.isCurrent 
                        ? 'text-[#4A2810] font-semibold' 
                        : 'text-[#C5B49D]/60 font-normal'
                    }`}
                  >
                    {item.day}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Month & Year Label */}
        <div className="w-full border-t border-[#D5C6AC] mt-4 pt-3 flex items-center justify-between text-[#8C5D38] font-['Cinzel'] text-[12px] sm:text-[13px] tracking-[0.24em] uppercase font-bold">
          <span>{calendarData.monthName}</span>
          <span className="text-[#A87442]">✦</span>
          <span>{calendarData.year}</span>
        </div>
      </motion.div>

    </section>
  )
}
