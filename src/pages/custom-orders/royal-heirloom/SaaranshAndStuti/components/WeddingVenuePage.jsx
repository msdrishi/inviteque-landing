import React from 'react'
import { motion } from 'framer-motion'
import { FallingRoyalFlowers } from './CustomRoyalHeirloomHero.jsx'

const fadeInUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
}

export default function WeddingVenuePage({
  bgImage = "/assets/templates/royal-heirloom/location-bg.webp",
  venueTitle = "MorBagh",
  venueAddress = "16, Bandh Rd, Chattarpur, Delhi",
  mapUrl = "https://maps.app.goo.gl/tQaYREQqVQ21111V6?g_st=ic",
  qrCodeUrl,
  bestRegards = "Anu & Sumeet Chopra",
}) {
  const finalQrCodeUrl = qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(mapUrl)}&color=4A2810&bgcolor=ECE3D1`

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-start items-center px-6 pt-10 pb-8 bg-[#ECE3D1] overflow-hidden">
      {/* Background architectural heritage illustration */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Falling Royal Flower Petals */}
      <FallingRoyalFlowers />

      {/* Main Content Area */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.16 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="relative z-10 w-full max-w-[340px] mx-auto flex flex-col items-center text-center mt-4 sm:mt-6 mb-3"
      >
        {/* Changed 'WHERE WE UNITE' to '20th Dec' */}
        <motion.span 
          variants={fadeInUp} 
          className="font-['Cinzel'] text-[12px] sm:text-[13px] tracking-[0.28em] uppercase text-[#8C5D38] font-bold"
        >
          20th Dec
        </motion.span>

        {/* Changed 'OUR VENUE' to 'Wedding' */}
        <motion.h2 
          variants={fadeInUp} 
          className="font-['Cinzel_Decorative',_'Cinzel',_serif] text-[26px] sm:text-[30px] font-bold text-[#4A2810] mt-1 mb-1.5 tracking-widest select-none"
        >
          Wedding
        </motion.h2>

        <motion.div variants={fadeInUp} className="h-[0.8px] w-20 bg-[#8C5D38]/50 my-1" />

        {/* Venue Title */}
        <motion.h3 
          variants={fadeInUp} 
          className="font-['Cinzel_Decorative',_'Cinzel',_serif] text-[20px] sm:text-[22px] font-bold text-[#4A2810] mt-1.5 mb-0.5 select-none"
        >
          {venueTitle}
        </motion.h3>

        {/* Venue Address */}
        <motion.p 
          variants={fadeInUp} 
          className="font-['Cinzel'] text-[11px] sm:text-[11.5px] tracking-wider uppercase text-[#683C1A] leading-relaxed max-w-[270px] font-medium mt-1 mb-2.5"
        >
          {venueAddress}
        </motion.p>

        {/* QR Code Section */}
        {finalQrCodeUrl && (
          <motion.div variants={fadeInUp} className="my-1.5 flex flex-col items-center">
            <div className="p-1.5 bg-white/95 rounded-[10px] shadow-[0_4px_16px_rgba(70,35,15,0.12)] border border-[#CBB89D]/70">
              <img
                src={finalQrCodeUrl}
                alt="Scan for Directions"
                className="w-[66px] h-[66px] object-contain opacity-95"
              />
            </div>
            <span className="font-['Cinzel'] text-[9px] tracking-[0.28em] uppercase text-[#8C5D38] font-bold mt-1">
              Scan to Navigate
            </span>
          </motion.div>
        )}

        {/* 50% Smaller Google Maps Navigation Button with Translucent Brown Background */}
        {mapUrl && (
          <motion.a 
            variants={fadeInUp}
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/35 bg-[#3E2514]/70 backdrop-blur-md text-[#F5D78E] text-[8.5px] sm:text-[9px] uppercase tracking-[0.16em] font-['Montserrat'] font-semibold shadow-[0_4px_12px_rgba(40,20,10,0.2)] transition-all my-2"
          >
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-[#F5D78E] opacity-90" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span>Open in Google Maps</span>
          </motion.a>
        )}

        {/* Best Regards */}
        {bestRegards && (
          <motion.div variants={fadeInUp} className="mt-1 text-center">
            <p className="font-['Cinzel'] text-[9.5px] uppercase tracking-[0.25em] text-[#8C5D38] font-bold mb-0.5">
              Best Regards
            </p>
            <p className="font-['Cinzel'] text-[11.5px] sm:text-[12.5px] uppercase tracking-[0.16em] text-[#4A2810] font-semibold leading-tight">
              {bestRegards}
            </p>
          </motion.div>
        )}

        {/* Scroll Down for Event Schedule Indicator */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center justify-center gap-1.5 select-none pointer-events-none mt-3 pb-1"
        >
          <span className="font-['Cinzel'] text-[8.5px] sm:text-[9px] tracking-[0.25em] uppercase text-[#6B4330] font-bold opacity-85">
            Scroll down for event schedule
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-[#3E2514] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.35)]"
          >
            <svg
              className="w-4 h-4 text-[#F5D78E]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
