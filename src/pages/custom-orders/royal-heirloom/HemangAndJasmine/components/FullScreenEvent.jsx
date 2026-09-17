import React from 'react';
import { motion } from 'framer-motion';

import genericBg from '../../../../../templates/royal-heirloom/photo-cards-bg.webp';
import saganBg from '../../../../../templates/royal-heirloom/engagement-majestic.webp';
import receptionBg from '../../../../../templates/royal-heirloom/reception-bg.webp';

const bgMap = {
  sagan: saganBg,
  wedding: genericBg,
  reception: receptionBg
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function FullScreenEvent({ event }) {
  if (!event) return null;

  const bgImage = bgMap[event.id];

  return (
    <section 
      className="relative min-h-[100dvh] w-full flex flex-col justify-start items-center overflow-hidden bg-[#ECE3D1] border-t border-[#4A2810]/10 px-6 pt-8 bg-cover bg-center"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } }
        }}
        className="relative z-10 flex flex-col items-center justify-center w-full text-center max-w-sm mx-auto min-h-[45dvh] -mt-4"
      >
        <motion.p variants={fadeInUp} className="font-['Cinzel'] font-bold uppercase tracking-[0.2em] mb-4 text-[#8C5D38] text-sm">
          {event.date}
        </motion.p>
        
        <motion.h2 variants={fadeInUp} className="font-['Cinzel'] text-3xl font-bold mb-3 leading-none uppercase tracking-widest text-[#4A2810]">
          {event.title}
        </motion.h2>

        <motion.p variants={fadeInUp} className="font-['Cinzel'] text-xs font-bold uppercase tracking-[0.2em] mb-6 text-[#4A2810]/70">
          {event.time}
        </motion.p>

        <motion.div variants={fadeInUp} className="mb-8 w-full">
          <p className="font-['Cormorant_Garamond'] text-lg md:text-xl font-medium leading-relaxed text-[#4A2810] whitespace-pre-line">
            {event.message}
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-1 mb-8">
          <p className="font-['Cormorant_Garamond'] text-xl font-bold text-[#4A2810] uppercase tracking-widest">
            Venue
          </p>
          <p className="font-['Cormorant_Garamond'] text-xl font-medium text-[#4A2810]/90">
            {event.venueName}
          </p>
          <p className="font-['Cormorant_Garamond'] text-base text-[#4A2810]/80">
            {event.venueCity}
          </p>
        </motion.div>

        {event.mapLink && (
          <motion.a 
            variants={fadeInUp}
            href={event.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-[#4A2810]/20 bg-[#4A2810] text-[#F5D78E] text-[10px] uppercase tracking-[0.2em] font-['Montserrat'] font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Open in Google Maps
          </motion.a>
        )}
      </motion.div>
    </section>
  );
}
