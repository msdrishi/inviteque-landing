import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, slideInUp, fadeInUp, BlurText } from './Animations';

export default function Playlist({ data, bgImage }) {
  const C = {
    primary: '#4A3E20',
    secondary: '#7A6840',
    gold: '#B09060',
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-start items-center overflow-hidden bg-[#F9F6F0] pt-[15vh]">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover object-center opacity-90"
          draggable={false}
        />
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/30"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm"
      >
        <motion.div variants={fadeInUp} className="mb-6 drop-shadow-md">
          {/* Real YouTube Logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-16 h-16 text-[#FF0000]" fill="currentColor">
            <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
          </svg>
        </motion.div>

        <h2 
          className="font-['Cinzel'] text-3xl font-bold mb-4 leading-tight uppercase tracking-wider"
          style={{ color: C.primary }}
        >
          <BlurText text={data.title} />
        </h2>

        <motion.p
          variants={slideInUp}
          className="font-['Cormorant_Garamond'] text-lg md:text-xl font-medium leading-relaxed opacity-90 mb-8"
          style={{ color: C.primary }}
        >
          {data.description}
        </motion.p>

        <motion.a
          variants={slideInUp}
          href={data.youtubeLink}
          target="_blank"
          rel="noreferrer"
          className="px-8 py-3 rounded-full font-['Montserrat'] text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
          style={{ backgroundColor: '#FF0000', color: 'white' }}
        >
          <span>Add Your Favorites</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </motion.a>
      </motion.div>
    </section>
  );
}
