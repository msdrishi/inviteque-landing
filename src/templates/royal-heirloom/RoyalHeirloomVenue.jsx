import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

export default function RoyalHeirloomVenue({
  ourVenueBgMobile,
  venueTitle,
  fullAddress,
  qrCodeUrl,
  mapUrl,
}) {
  return (
    <section className="relative w-full aspect-[941/1672] min-h-[100svh] flex flex-col justify-between px-6 pt-10 pb-8 bg-[#ECE3D1] border-t border-[#D5C6AC] overflow-hidden">
      {/* Background architectural heritage illustration locked 1:1 with section frame */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${ourVenueBgMobile})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Top Heading - positioned comfortably down */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-6 sm:pt-8">
        <SectionHeader 
          subtitle="WHERE WE UNITE"
          title="OUR VENUE"
          description="A royal architectural heritage where our vows will be celebrated."
        />
      </div>

      {/* Venue Address, QR code & Navigation button permanently anchored at the bottom (raised further up) */}
      <motion.div 
        initial={{ opacity: 0, y: 22, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[340px] mx-auto flex flex-col items-center text-center mt-auto pb-20 sm:pb-24"
      >
        <span className="font-['Cinzel'] text-[10.5px] sm:text-[11px] tracking-[0.26em] uppercase text-[#8C5D38] font-bold">
          CELEBRATION VENUE
        </span>
        <h3 className="font-['Cinzel_Decorative',_'Cinzel',_serif] text-[20px] sm:text-[22px] font-bold text-[#4A2810] mt-1 mb-1.5 select-none">
          {venueTitle}
        </h3>

        <div className="h-[0.8px] w-24 bg-[#8C5D38]/50 my-1.5" />

        <p className="font-['Cinzel'] text-[10.5px] sm:text-[11.5px] tracking-wider uppercase text-[#683C1A] leading-relaxed max-w-[280px] font-medium">
          {fullAddress}
        </p>

        {/* Crisp QR Code - more compact sizing */}
        <div className="mt-3 flex flex-col items-center">
          <div className="p-1.5 bg-white/95 rounded-[10px] shadow-[0_6px_20px_rgba(70,35,15,0.15)] border border-[#CBB89D]/70">
            <img
              src={qrCodeUrl}
              alt="Scan for Directions"
              className="w-[72px] h-[72px] object-contain rounded-[4px]"
            />
          </div>
          <span className="font-['Cinzel'] text-[8.5px] tracking-[0.2em] text-[#8C5D38] mt-1 font-semibold uppercase">
            Scan to Navigate Location
          </span>
        </div>

        {/* Clean Map Button */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 px-6 py-2 rounded-full bg-[#FAF5EB]/95 border border-[#8C5D38] text-[#5A2C18] font-['Cinzel'] text-[10.5px] tracking-widest uppercase font-bold flex items-center gap-2 shadow-[0_4px_16px_rgba(70,35,15,0.12)] hover:bg-[#8C5D38] hover:text-white transition-all active:scale-95"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>View on Google Maps</span>
        </a>
      </motion.div>
    </section>
  )
}
