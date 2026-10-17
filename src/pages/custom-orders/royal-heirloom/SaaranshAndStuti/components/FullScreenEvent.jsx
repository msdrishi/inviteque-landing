import React from 'react';
import { motion } from 'framer-motion';

import cocktailBg from '../../../../../templates/royal-heirloom/cocktail.webp';
import haldiBg from '../../../../../templates/royal-heirloom/haldi.webp';
import poojaBg from '../../../../../templates/royal-heirloom/pooja.webp';

const bgMap = {
  pooja: poojaBg,
  cocktail: cocktailBg,
  haldi: haldiBg
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function FullScreenEvent({ event }) {
  if (!event) return null;

  const bgImage = bgMap[event.id];
  const isHaldi = event.id === 'haldi';

  return (
    <section 
      className="relative min-h-[100dvh] w-full flex flex-col justify-start items-center overflow-hidden bg-[#ECE3D1] px-6 pt-[7.5svh] sm:pt-[9svh] pb-6 bg-cover"
      style={bgImage ? { 
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      } : {}}
    >
      {/* Blue Watercolor Elements for Haldi & Mehendi */}
      {isHaldi && (
        <>
          {/* Subtle blue watercolor wash overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-[1] mix-blend-color opacity-35"
            style={{
              background: 'radial-gradient(circle at 50% 30%, #3B82F6 0%, #1D4ED8 40%, transparent 75%)'
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none z-[1] opacity-20"
            style={{
              background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(29, 78, 216, 0.18) 100%)'
            }}
          />
          {/* Floating subtle blue petals / shimmer */}
          <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2.5 h-3.5 rounded-full bg-[#60A5FA]/30 blur-[0.5px]"
                style={{
                  top: `${15 + i * 18}%`,
                  left: `${(i % 2 === 0 ? 10 : 82) + (i * 3)}%`,
                }}
                animate={{
                  y: [0, 15, 0],
                  x: [0, (i % 2 === 0 ? 6 : -6), 0],
                  opacity: [0.3, 0.65, 0.3]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Main Event Content — Positioned cleanly in the upper top sky area */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.12 } }
        }}
        className="relative z-10 flex flex-col items-center justify-start w-full text-center max-w-sm mx-auto mt-1 sm:mt-2 mb-auto"
      >
        <motion.p variants={fadeInUp} className="font-['Cinzel'] font-bold uppercase tracking-[0.2em] mb-1 text-[#8C5D38] text-[11px] sm:text-xs">
          {event.date}
        </motion.p>
        
        <motion.h2 variants={fadeInUp} className="font-['Cinzel'] text-2xl sm:text-[28px] font-bold mb-1 leading-none uppercase tracking-widest text-[#4A2810]">
          {event.title}
        </motion.h2>

        <motion.p variants={fadeInUp} className="font-['Cinzel'] text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] mb-2 text-[#4A2810]/75">
          {event.time}
        </motion.p>

        {/* Dress Code Badge (Haldi & Mehendi) */}
        {event.dressCode && (
          <motion.div variants={fadeInUp} className="mb-2 px-3.5 py-1 rounded-full bg-[#1E3A8A]/10 border border-[#1E3A8A]/30 backdrop-blur-xs">
            <p className="font-['Cinzel'] text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#1E3A8A]">
              {event.dressCode}
            </p>
          </motion.div>
        )}

        {event.message && (
          <motion.div variants={fadeInUp} className="mb-2 w-full px-2">
            <p className="font-['Cormorant_Garamond'] text-[14.5px] sm:text-[16px] font-medium leading-snug text-[#4A2810] whitespace-pre-line italic">
              {event.message}
            </p>
          </motion.div>
        )}

        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-0 mb-2">
          <p className="font-['Cormorant_Garamond'] text-[13px] sm:text-sm font-bold text-[#4A2810] uppercase tracking-widest">
            Venue
          </p>
          <p className="font-['Cormorant_Garamond'] text-[14.5px] sm:text-[15.5px] font-semibold text-[#4A2810]/90">
            {event.venueName}
          </p>
          {event.venueCity && (
            <p className="font-['Cormorant_Garamond'] text-[12.5px] sm:text-[13px] text-[#4A2810]/75">
              {event.venueCity}
            </p>
          )}
        </motion.div>

        {/* 50% Smaller Google Maps Button with Translucent Brown Background */}
        {event.mapLink && (
          <motion.a 
            variants={fadeInUp}
            href={event.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full border border-[#D4AF37]/35 bg-[#3E2514]/70 backdrop-blur-md text-[#F5D78E] text-[8px] sm:text-[8.5px] uppercase tracking-[0.16em] font-['Montserrat'] font-semibold shadow-[0_4px_12px_rgba(40,20,10,0.2)] transition-all mb-2"
          >
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-[#F5D78E] opacity-90" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span>Open in Google Maps</span>
          </motion.a>
        )}

        {/* Best Regards Block - Expanded width, beautiful solid card */}
        {event.bestRegards && (
          <motion.div 
            variants={fadeInUp} 
            className="mt-2 w-full max-w-[340px] px-6 py-2.5 rounded-2xl bg-[#FAF5EB] border border-[#CBB89D]/70 shadow-[0_4px_16px_rgba(70,35,15,0.12)] text-center mx-auto"
          >
            <p className="font-['Cinzel'] text-[9.5px] uppercase tracking-[0.25em] text-[#8C5D38] font-bold mb-1">
              Best Regards
            </p>
            <div 
              className="font-['Cinzel'] text-[12px] sm:text-[13px] uppercase tracking-[0.16em] text-[#3A1F0D] font-bold leading-relaxed whitespace-pre-line"
            >
              {event.id === 'pooja' ? 'Mamta & Anil Sachdeva' : event.bestRegards}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom Area Scroll Indicator - High Visibility Solid Rounded Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 flex items-center justify-center mt-auto pb-3 pointer-events-none select-none"
      >
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
    </section>
  );
}
