import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

export default function RoyalHeirloomCalendar({ calendarData, fullAddress }) {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-5 py-12 bg-[#ECE3D1] border-t border-[#D5C6AC] overflow-hidden">
      <div className="relative z-10 w-full flex flex-col items-center text-center">
        <SectionHeader 
          subtitle="MARK YOUR CALENDAR"
          title="THE DATE"
          description="Save the auspicious date and celebrate our sacred matrimony."
        />
      </div>

      {/* Monthly Calendar Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[360px] bg-[#FAF5EB]/95 backdrop-blur-md border border-[#CBB89D] rounded-[22px] p-6 shadow-[0_20px_50px_rgba(90,50,20,0.14)] flex flex-col items-center text-center my-auto"
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
        <div className="grid grid-cols-7 w-full gap-1 mb-2 text-center text-[#6B401D] font-['Cinzel'] text-[10px] sm:text-[11px] font-bold tracking-wider">
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
                    <span className="font-['Bodoni_Moda',_'Cinzel',_serif] text-[15px] font-bold leading-none z-10">
                      {item.day}
                    </span>
                    {/* Tiny Floating Heart Badge */}
                    <span className="absolute -top-1.5 -right-1 text-[11px] text-[#A64B2A] drop-shadow-sm select-none">
                      ♥
                    </span>
                  </motion.div>
                ) : (
                  <span 
                    className={`font-['Bodoni_Moda',_'Cinzel',_serif] text-[13.5px] sm:text-[14.5px] leading-none ${
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
        <div className="w-full border-t border-[#D5C6AC] mt-4 pt-3 flex items-center justify-between text-[#8C5D38] font-['Cinzel'] text-[10px] tracking-[0.24em] uppercase font-bold">
          <span>{calendarData.monthName}</span>
          <span className="text-[#A87442]">✦</span>
          <span>{calendarData.year}</span>
        </div>
      </motion.div>

      <div className="h-4" />
    </section>
  )
}
