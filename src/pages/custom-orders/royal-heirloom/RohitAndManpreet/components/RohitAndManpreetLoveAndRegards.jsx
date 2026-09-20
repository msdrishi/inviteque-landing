import { motion } from 'framer-motion'
import { SectionHeader } from '../../../../../templates/royal-heirloom/RoyalHeirloomShared.jsx'

export default function RohitAndManpreetLoveAndRegards({
  ourPhotoBgMobile,
  headline,
  familyNames
}) {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-6 py-16 bg-[#F6EBD8] border-t border-[#E6D6C0] overflow-hidden">
      {/* Specific Thanks and Regards background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(/assets/templates/royal-heirloom/thanks-regards.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Adding a subtle dark overlay so white/gold text stands out on the image */}
      {/* <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none" /> */}

      <div className="relative z-10 w-full flex flex-col items-center text-center max-w-[280px]">
        <SectionHeader 
          title={headline || "LOVE & REGARDS"}
        />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full mt-2"
        >
          <p className="font-['Cinzel'] text-[14px] sm:text-[16px] font-bold tracking-[0.25em] uppercase text-[#6B401D] leading-relaxed break-words w-full whitespace-pre-line">
            {familyNames || "Methwanis and Sohals\nFamily"}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
