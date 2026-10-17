import React from 'react'
import { motion } from 'framer-motion'
import thanksBg from '../../../../../templates/royal-heirloom/thanks-regards.webp'
import { FallingRoyalFlowers } from './CustomRoyalHeirloomHero.jsx'

const fadeInUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
}

export default function ThankYouSection() {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-6 py-12 bg-[#ECE3D1] overflow-hidden">
      {/* Background Ornate Frame Mural - Zoomed in more */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div 
          className="w-full h-full scale-125 sm:scale-135 origin-center"
          style={{
            backgroundImage: `url(${thanksBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* Falling Royal Flower Petals */}
      <FallingRoyalFlowers />

      {/* Main Content inside the ornate frame - narrowed text width */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.22 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
        className="relative z-10 w-full max-w-[280px] sm:max-w-[295px] mx-auto flex flex-col items-center text-center my-auto px-2"
      >
        {/* Heading: Adding Love to the Celebration */}
        <motion.h2 
          variants={fadeInUp} 
          className="font-['Cinzel_Decorative',_'Cinzel',_serif] text-[20px] sm:text-[23px] font-bold text-[#4A2810] mb-2 leading-snug tracking-wider select-none"
          style={{
            textShadow: '0 1px 2px rgba(255,255,255,0.7)',
            filter: 'drop-shadow(0px 1px 2px rgba(80, 40, 15, 0.2))',
          }}
        >
          Adding Love to the Celebration
        </motion.h2>

        {/* Ornamental Divider */}
        <motion.div variants={fadeInUp} className="flex items-center gap-2 my-3 opacity-70">
          <div className="w-10 h-[0.8px] bg-[#8C5D38]" />
          <span className="text-[9px] text-[#8C5D38]">❦</span>
          <div className="w-10 h-[0.8px] bg-[#8C5D38]" />
        </motion.div>

        {/* Family Groups */}
        <div className="flex flex-col items-center gap-3 w-full my-2">
          {/* Saadhvi's name on top in single line */}
          <motion.p 
            variants={fadeInUp}
            className="font-['Cinzel'] text-[12.5px] sm:text-[14px] tracking-[0.16em] uppercase text-[#4A2810] font-bold leading-relaxed whitespace-nowrap"
          >
            Saadhvi
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="w-16 h-[0.6px] bg-[#8C5D38]/30 my-0.5" 
          />

          {/* Rest of the names below */}
          <motion.p 
            variants={fadeInUp}
            className="font-['Cinzel'] text-[12px] sm:text-[13.5px] tracking-[0.14em] uppercase text-[#4A2810] font-semibold leading-relaxed"
          >
            Sidharth, Sumiti &amp; Sumer
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="w-16 h-[0.6px] bg-[#8C5D38]/30 my-0.5" 
          />

          <motion.p 
            variants={fadeInUp}
            className="font-['Cinzel'] text-[12px] sm:text-[13.5px] tracking-[0.14em] uppercase text-[#4A2810] font-semibold leading-relaxed"
          >
            Mahima, Yash, Abhinav &amp; Pranavya
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="w-16 h-[0.6px] bg-[#8C5D38]/30 my-0.5" 
          />

          <motion.p 
            variants={fadeInUp}
            className="font-['Cinzel'] text-[12px] sm:text-[13.5px] tracking-[0.14em] uppercase text-[#4A2810] font-semibold leading-relaxed"
          >
            Tanisha, Vanya &amp; Aarika
          </motion.p>

          {/* After space - Add Chopras & Puris */}
          <motion.div 
            variants={fadeInUp}
            className="w-24 h-[0.8px] bg-[#8C5D38]/50 mt-3 mb-1" 
          />

          <motion.p 
            variants={fadeInUp}
            className="font-['Cinzel'] text-[13px] sm:text-[14.5px] tracking-[0.2em] uppercase text-[#6B401D] font-bold leading-relaxed"
          >
            Chopras &amp; Puris
          </motion.p>
        </div>

        {/* Heart icon accent */}
        <motion.div variants={fadeInUp} className="mt-4 opacity-75">
          <span className="font-['Cinzel'] text-[12px] text-[#8C5D38]">✦</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
