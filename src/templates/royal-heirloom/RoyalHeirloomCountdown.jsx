import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'
import { FallingRoyalFlowers } from './RoyalHeirloomHero.jsx'

export default function RoyalHeirloomCountdown({ countdownBgMobile, timeLeft }) {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-start px-6 pt-6 pb-16 bg-[#ECE3D1] border-t border-[#D5C6AC] overflow-hidden">
      {/* Custom Countdown Mobile Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-90"
        style={{
          backgroundImage: `url(${countdownBgMobile})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <FallingRoyalFlowers />

      {/* Top Area: Pure Direct Clean Countdown with Sharp Elegant Typography */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <SectionHeader 
          subtitle="WAITING FOR THE BIG DAY"
          title="THE COUNTDOWN"
          description="Counting down every moment until our eternal celebration."
        />

        {/* Direct Floating Text Counters with Cormorant Garamond font */}
        <motion.div
          initial={{ opacity: 0, y: 18, filter: 'blur(3px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-[360px] mt-2 mb-4 select-none"
        >
          {[
            { val: timeLeft.days, label: 'DAYS' },
            { val: timeLeft.hours, label: 'HOURS' },
            { val: timeLeft.minutes, label: 'MINUTES' },
            { val: timeLeft.seconds, label: 'SECONDS' },
          ].map((unit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span 
                className="font-['Cormorant_Garamond'] text-[38px] sm:text-[44px] font-light italic text-[#3A1F10] leading-none tracking-tight"
                style={{
                  textShadow: '0 1px 2px rgba(255,255,255,0.7)',
                }}
              >
                {String(unit.val).padStart(2, '0')}
              </span>
              <span 
                className="font-['Cinzel'] text-[9.5px] sm:text-[11px] tracking-[0.2em] uppercase text-[#6B401D] font-bold mt-1"
              >
                {unit.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
