import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

export default function RoyalHeirloomCalendar({ 
  calendarData, 
  fullAddress,
  rsvpSubmitted,
  rsvpGuestName,
  rsvpAttending,
  rsvpGuestsCount,
  rsvpWishes,
  setRsvpSubmitted,
  setRsvpGuestName,
  setRsvpAttending,
  setRsvpGuestsCount,
  setRsvpWishes,
  handleRsvpSubmit,
}) {
  const aeroplaneImg = "/assets/templates/royal-heirloom/aeroplane-savethedate.png"
  const sectionRef = useRef(null)
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.15 })

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-start px-5 py-12 bg-[#F6EBD8] border-t border-[#E8D9C5] overflow-hidden"
      style={{ backgroundColor: '#F6EBD8' }}
    >
      {/* Title Content */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <SectionHeader 
          subtitle="MARK YOUR CALENDAR"
          title="THE DATE"
          description="Save the auspicious date and celebrate our sacred matrimony."
        />
      </div>

      {/* Aeroplane Animation: flies diagonally across the calendar area only */}
      <div className="absolute top-0 left-0 right-0 h-[65svh] z-40 pointer-events-none overflow-hidden select-none">
        <motion.div
          animate={isSectionInView ? {
            x: ['-240px', '100vw'],
            y: ['50svh', '10svh'],
          } : {
            x: '-240px',
            y: '50svh'
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
        className="relative z-10 w-full max-w-[360px] bg-[#FAF5EB]/95 backdrop-blur-md border border-[#CBB89D] rounded-[22px] p-6 shadow-[0_20px_50px_rgba(90,50,20,0.12)] flex flex-col items-center text-center mb-6"
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

      {/* Merged RSVP Form — positioned seamlessly right below the calendar card with #F6EBD8 tone */}
      <motion.div 
        initial={{ opacity: 0, y: 22, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 1.0 }}
        className="relative z-10 w-full max-w-[360px] bg-[#FAF5EB]/95 backdrop-blur-md border border-[#CBB89D] rounded-[22px] p-6 shadow-[0_20px_50px_rgba(90,50,20,0.12)] flex flex-col mb-4"
      >
        <div className="flex flex-col items-center text-center mb-4">
          <span className="font-['Cinzel'] text-[10px] tracking-[0.28em] uppercase text-[#8C5D38] font-bold">
            PLEASE RESPOND
          </span>
          <h3 className="font-['Cinzel_Decorative',_'Cinzel',_serif] text-[20px] font-bold text-[#4A2810] mt-1">
            RSVP
          </h3>
          <p className="font-['Cormorant_Garamond'] italic text-[16px] text-[#6B4734] mt-1">
            Kindly confirm your gracious presence to help us prepare for your arrival.
          </p>
        </div>

        {rsvpSubmitted ? (
          <div className="flex flex-col items-center text-center py-6">
            <span className="text-[36px] sm:text-[40px] mb-3 text-[#8C5D38]">
              {rsvpAttending === 'yes' ? '🎉' : '🕊️'}
            </span>
            <h4 className="font-['Cinzel'] text-[17px] font-bold text-[#4A2810] uppercase tracking-wider">
              {rsvpAttending === 'yes' ? "Can't Wait!" : "With Regrets"}
            </h4>
            <p className="font-['Cormorant_Garamond'] text-[16px] sm:text-[18px] text-[#6B4734] italic mt-2">
              {rsvpAttending === 'yes' 
                ? "We joyfully look forward to celebrating this special day together with you." 
                : "Thank you for sending your warm wishes. You will be missed!"}
            </p>
            <button
              onClick={() => setRsvpSubmitted(false)}
              className="mt-4 text-[13.5px] font-['Cinzel'] text-[#8C5D38] underline tracking-widest uppercase font-semibold hover:text-[#4A2810]"
            >
              Edit Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-5 text-left">
            {/* Guest Name */}
            <div className="flex flex-col gap-2">
              <label className="font-['Cinzel'] text-[12.5px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={rsvpGuestName}
                onChange={(e) => setRsvpGuestName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cinzel'] text-[14.5px] placeholder:text-[#A89882] focus:outline-none focus:border-[#8C5D38] transition-colors"
              />
            </div>

            {/* Will you Attend */}
            <div className="flex flex-col gap-2">
              <label className="font-['Cinzel'] text-[12.5px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                Will you be joining us?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRsvpAttending('yes')}
                  className={`py-3 px-3 rounded-[10px] border font-['Cinzel'] text-[13.5px] font-bold uppercase tracking-wider transition-all ${
                    rsvpAttending === 'yes'
                      ? 'bg-[#6B3D1A] text-[#FDEBD0] border-[#6B3D1A] shadow-sm'
                      : 'bg-white text-[#6B401D] border-[#D5C6AC] hover:bg-[#FAF0E6]'
                  }`}
                >
                  Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpAttending('no')}
                  className={`py-3 px-3 rounded-[10px] border font-['Cinzel'] text-[13.5px] font-bold uppercase tracking-wider transition-all ${
                    rsvpAttending === 'no'
                      ? 'bg-[#6B3D1A] text-[#FDEBD0] border-[#6B3D1A] shadow-sm'
                      : 'bg-white text-[#6B401D] border-[#D5C6AC] hover:bg-[#FAF0E6]'
                  }`}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {/* Number of Guests */}
            {rsvpAttending === 'yes' && (
              <div className="flex flex-col gap-2">
                <label className="font-['Cinzel'] text-[12.5px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                  Number of Guests
                </label>
                <select
                  value={rsvpGuestsCount}
                  onChange={(e) => setRsvpGuestsCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cinzel'] text-[14.5px] focus:outline-none focus:border-[#8C5D38] transition-colors"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5+">5+ Guests</option>
                </select>
              </div>
            )}

            {/* Warm Wishes */}
            <div className="flex flex-col gap-2">
              <label className="font-['Cinzel'] text-[12.5px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                Warm Wishes / Note (Optional)
              </label>
              <textarea
                rows="2"
                value={rsvpWishes}
                onChange={(e) => setRsvpWishes(e.target.value)}
                placeholder="Leave a blessing for the couple..."
                className="w-full px-4 py-3 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cormorant_Garamond'] text-[17px] placeholder:text-[#A89882] focus:outline-none focus:border-[#8C5D38] transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-full bg-[#6B3D1A] text-[#FDEBD0] font-['Cinzel'] text-[13.5px] tracking-[0.25em] font-bold uppercase shadow-[0_6px_15px_rgba(90,50,20,0.2)] hover:bg-[#8C5D38] transition-colors active:scale-95 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Confirm RSVP</span>
            </button>
          </form>
        )}
      </motion.div>

      <div className="h-4" />
    </section>
  )
}
