import { motion } from "framer-motion"

export default function MidnightWaltzCalendar({
  calendarData,
  fullAddress
}) {

  // Standard lineAnim for headers to match hero and other sections
  const lineAnim = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-start pt-[10vh] px-4 overflow-hidden"
      style={{
        backgroundImage: `url('/backgrounds/midnight waltz/background-car.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated Airplane */}
      <motion.img
        src="/backgrounds/midnight waltz/aeroplane-savethedate.webp"
        alt="aeroplane"
        initial={{ x: "100vw" }}
        animate={{ x: "-100vw" }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] -translate-y-1/2 w-48 md:w-64 z-20 pointer-events-none opacity-100"
      />

      {/* Content Container (No background, pure transparency, contained within top 60%) */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.25 } } }}
        className="relative z-10 w-full flex flex-col items-center"
      >

        {/* Save the Date */}
        <motion.h1
          variants={lineAnim}
          className="font-['Modernline',sans-serif] text-[1.8rem] md:text-[2.5rem] text-[#4A3E20] mb-2 drop-shadow-sm leading-none"
        >
          Save the Date
        </motion.h1>

        {/* Separator */}
        <motion.div
          variants={lineAnim}
          className="flex items-center gap-3 mb-4 text-[#4A3E20]/60"
        >
          <div className="w-16 h-[1px] bg-[#4A3E20]/40"></div>
          <span className="text-[12px] rotate-45 transform">❖</span>
          <div className="w-16 h-[1px] bg-[#4A3E20]/40"></div>
        </motion.div>

        {/* ARE GETTING MARRIED */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] text-[10px] md:text-[12px] tracking-[0.4em] text-[#4A3E20] font-semibold mb-3 uppercase"
        >
          ARE GETTING MARRIED
        </motion.p>

        {/* MONTH & YEAR */}
        <motion.h2
          variants={lineAnim}
          className="font-['Cinzel'] text-[18px] md:text-[22px] text-[#4A3E20] tracking-widest font-semibold mb-4 uppercase"
        >
          {calendarData.monthName} {calendarData.year}
        </motion.h2>

        {/* Calendar Grid (Transparent) */}
        <motion.div
          variants={lineAnim}
          className="w-full max-w-[280px] md:max-w-[320px] mb-4"
        >
          <div className="grid grid-cols-7 w-full gap-y-2 gap-x-1 text-center">
            {/* Days of Week Header */}
            {calendarData.weekDays.map((wd, idx) => (
              <span key={`header-${idx}`} className="font-['Cinzel'] text-[12px] md:text-[13px] font-bold text-[#4A3E20]">
                {wd.charAt(0)}
              </span>
            ))}

            {/* Calendar Dates Grid */}
            {calendarData.calendarDays.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="relative flex items-center justify-center py-1 h-8"
                >
                  {item.isTarget ? (
                    <div className="relative flex items-center justify-center w-8 h-8">
                      {/* Heart Highlight */}
                      <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-[#C07765] drop-shadow-md" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span className="font-['Bodoni_Moda','Cinzel',serif] text-[#FDFBF7] text-[13px] font-bold leading-none z-10 -mt-0.5">
                        {item.day}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`font-['Bodoni_Moda','Cinzel',serif] text-[13px] md:text-[15px] leading-none ${item.isCurrent
                        ? 'text-[#4A3E20] font-medium'
                        : 'text-[#4A3E20]/30 font-light'
                        }`}
                    >
                      {item.day}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* WEDNESDAY & Time */}
        <motion.div
          variants={lineAnim}
          className="flex flex-col items-center"
        >
          <h3 className="font-['Cinzel'] text-[14px] md:text-[16px] text-[#4A3E20] tracking-widest font-semibold mb-1 uppercase">
            WEDNESDAY
          </h3>
          <p className="font-['Cormorant_Garamond',serif] text-[12px] md:text-[14px] tracking-[0.1em] text-[#4A3E20]/80 mb-4 uppercase">
            04:30 AM - 06:00 AM
          </p>
        </motion.div>

        {/* Separator */}
        <motion.div
          variants={lineAnim}
          className="mb-4 text-[#4A3E20]/50"
        >
          <span className="text-[12px] rotate-45 transform block">❖</span>
        </motion.div>

      </motion.div>
    </section>
  )
}
