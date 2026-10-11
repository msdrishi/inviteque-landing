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
  const families = [
    "Saadhvi, Sidharth, Sumiti, Sumer",
    "Mahima, Yash, Abhinav & Pranavya",
    "Tanisha, Vanya & Aarika"
  ]

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-6 py-12 bg-[#ECE3D1] overflow-hidden">
      {/* Background Ornate Frame Mural */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${thanksBg})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Falling Royal Flower Petals */}
      <FallingRoyalFlowers />

      {/* Main Content inside the ornate frame */}
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
        className="relative z-10 w-full max-w-[340px] mx-auto flex flex-col items-center text-center my-auto px-4"
      >
        {/* Subtitle */}
        <motion.span 
          variants={fadeInUp} 
          className="font-['Cinzel'] text-[11px] sm:text-[12px] tracking-[0.3em] uppercase text-[#8C5D38] font-bold mb-2"
        >
          THANK YOU
        </motion.span>

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

        {/* Three Family Groups */}
        <div className="flex flex-col items-center gap-3 w-full my-2">
          {families.map((group, idx) => (
            <React.Fragment key={idx}>
              <motion.p 
                variants={fadeInUp}
                className="font-['Cinzel'] text-[12px] sm:text-[13.5px] tracking-[0.14em] uppercase text-[#4A2810] font-semibold leading-relaxed"
              >
                {group}
              </motion.p>
              {idx < families.length - 1 && (
                <motion.div 
                  variants={fadeInUp}
                  className="w-16 h-[0.6px] bg-[#8C5D38]/30 my-0.5" 
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Heart icon accent */}
        <motion.div variants={fadeInUp} className="mt-4 opacity-75">
          <span className="font-['Cinzel'] text-[12px] text-[#8C5D38]">✦</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
