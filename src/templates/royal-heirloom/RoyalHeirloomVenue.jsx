import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'
import { FallingRoyalFlowers } from './RoyalHeirloomHero.jsx'

const itemVariants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(3px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] } 
  }
}

export default function RoyalHeirloomVenue({
  ourVenueBgMobile,
  venueTitle,
  fullAddress,
  qrCodeUrl,
  mapUrl,
}) {
  const bgImg = ourVenueBgMobile || "/assets/templates/royal-heirloom/location-bg.webp"

  return (
    <section className="relative w-full aspect-[941/1672] min-h-[100svh] flex flex-col px-6 pt-10 pb-8 bg-[#F4EDE2] border-t border-[#D5C6AC] overflow-hidden">
      {/* Background architectural heritage illustration: location-bg.webp */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <FallingRoyalFlowers />

      {/* Top Heading */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-3 sm:pt-4">
        <SectionHeader 
          subtitle="WHERE WE UNITE"
          title="OUR VENUE"
          description="A royal architectural heritage where our vows will be celebrated."
        />
      </div>

      {/* Venue Address, QR code & Navigation button positioned from top to middle area */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="relative z-10 w-full max-w-[340px] mx-auto flex flex-col items-center text-center mt-2 sm:mt-4"
      >
        <motion.span variants={itemVariants} className="font-['Cinzel'] text-[13px] sm:text-[14px] tracking-[0.26em] uppercase text-[#8C5D38] font-bold">
          CELEBRATION VENUE
        </motion.span>
        <motion.h3 variants={itemVariants} className="font-['Cinzel_Decorative',_'Cinzel',_serif] text-[24px] sm:text-[26px] font-bold text-[#4A2810] mt-1 mb-1.5 select-none">
          {venueTitle}
        </motion.h3>

        <motion.div variants={itemVariants} className="h-[0.8px] w-24 bg-[#8C5D38]/50 my-1" />

        <motion.p variants={itemVariants} className="font-['Cinzel'] text-[13px] sm:text-[14px] tracking-wider uppercase text-[#683C1A] leading-relaxed max-w-[280px] font-medium">
          {fullAddress}
        </motion.p>

        {/* Crisp QR Code */}
        <motion.div variants={itemVariants} className="mt-2.5 flex flex-col items-center">
          <div className="p-1.5 bg-white/95 rounded-[10px] shadow-[0_6px_20px_rgba(70,35,15,0.15)] border border-[#CBB89D]/70">
            <img
              src={qrCodeUrl}
              alt="Scan for Directions"
              className="w-[70px] h-[70px] object-contain opacity-90"
            />
          </div>
          <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#8C5D38] font-bold mt-2">
            Scan to Navigate
          </span>
        </motion.div>

        {/* Navigation Button */}
        <motion.a 
          variants={itemVariants}
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 px-8 py-2.5 rounded-full bg-gradient-to-r from-[#8C5329] to-[#6B3D1A] text-[#FDEBD0] font-['Cinzel'] text-[12px] sm:text-[12.5px] tracking-[0.25em] uppercase font-bold flex items-center justify-center gap-2 shadow-[0_8px_15px_rgba(90,50,20,0.2)] hover:shadow-[0_12px_20px_rgba(90,50,20,0.3)] hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-300"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span className="pt-[1px]">Get Directions</span>
        </motion.a>
      </motion.div>

      {/* Bottom area left completely open to showcase the palace lakeside illustration */}
      <div className="flex-1 min-h-[140px] pointer-events-none" />
    </section>
  )
}
