import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

export default function RoyalHeirloomRsvp({
  rsvpBgMobile,
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
  const bgImg = rsvpBgMobile || "/assets/templates/royal-heirloom/texture.png"

  return (
    <section 
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-5 py-14 bg-[#B58A6E] border-t border-[#A4795E] overflow-hidden"
    >
      {/* Texture background rendered as it is without any overlay color */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center">
        <SectionHeader 
          subtitle="PLEASE RESPOND"
          title="RSVP"
          description="Kindly confirm your gracious presence to help us prepare for your arrival."
          light={false}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.0 }}
        className="relative z-10 w-full max-w-[380px] bg-[#FAF5EB]/95 backdrop-blur-md border border-[#CBB89D] rounded-[20px] p-6 shadow-[0_20px_50px_rgba(70,35,15,0.22)] flex flex-col my-2"
      >
        {rsvpSubmitted ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-12 h-12 rounded-full bg-[#6B3D1A] text-[#FDEBD0] flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h4 className="font-['Cinzel'] text-[16px] font-bold text-[#4A2810] uppercase tracking-wider">
              Thank You, {rsvpGuestName || 'Valued Guest'}!
            </h4>
            <p className="font-['Cormorant_Garamond'] text-[15px] text-[#6B4734] italic mt-2">
              {rsvpAttending === 'yes' 
                ? "We joyfully look forward to celebrating this special day together with you." 
                : "Thank you for sending your warm wishes. You will be missed!"}
            </p>
            <button
              onClick={() => setRsvpSubmitted(false)}
              className="mt-5 text-[11px] font-['Cinzel'] text-[#8C5D38] underline tracking-widest uppercase font-semibold hover:text-[#4A2810]"
            >
              Edit Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4 text-left">
            {/* Guest Name */}
            <div className="flex flex-col gap-1">
              <label className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={rsvpGuestName}
                onChange={(e) => setRsvpGuestName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cinzel'] text-[12px] placeholder:text-[#A89882] focus:outline-none focus:border-[#8C5D38] transition-colors"
              />
            </div>

            {/* Will you Attend */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                Will you be joining us?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRsvpAttending('yes')}
                  className={`py-2 px-3 rounded-[10px] border font-['Cinzel'] text-[11px] font-bold uppercase tracking-wider transition-all ${
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
                  className={`py-2 px-3 rounded-[10px] border font-['Cinzel'] text-[11px] font-bold uppercase tracking-wider transition-all ${
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
              <div className="flex flex-col gap-1">
                <label className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                  Number of Guests
                </label>
                <select
                  value={rsvpGuestsCount}
                  onChange={(e) => setRsvpGuestsCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cinzel'] text-[12px] focus:outline-none focus:border-[#8C5D38] transition-colors"
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
            <div className="flex flex-col gap-1">
              <label className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B401D]">
                Warm Wishes / Note (Optional)
              </label>
              <textarea
                rows="2"
                value={rsvpWishes}
                onChange={(e) => setRsvpWishes(e.target.value)}
                placeholder="Leave a blessing for the couple..."
                className="w-full px-3.5 py-2 rounded-[10px] bg-white border border-[#D5C6AC] text-[#4A2810] font-['Cormorant_Garamond'] text-[14px] placeholder:text-[#A89882] focus:outline-none focus:border-[#8C5D38] transition-colors resize-none"
              />
            </div>

            {/* Submit Button with Modern SVG Envelope */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-[#6B3D1A] to-[#8C5329] text-[#FDEBD0] font-['Cinzel'] text-[11px] tracking-widest uppercase font-semibold flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Confirm RSVP</span>
            </button>
          </form>
        )}
      </motion.div>
    </section>
  )
}
