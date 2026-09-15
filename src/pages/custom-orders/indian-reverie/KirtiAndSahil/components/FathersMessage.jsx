import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, slowReveal, SectionLogo, BlurText } from './Animations';

export default function FathersMessage({ message, bgImage, isSticky, zIndex }) {
  const C = {
    primary: '#4A3E20',
    gold: '#B09060',
  };

  return (
    <section
      className={`relative min-h-[100dvh] w-full flex flex-col justify-start pt-[12vh] items-center overflow-hidden bg-[#F9F6F0]
        ${isSticky ? 'sticky top-0' : ''}
      `}
      style={{ zIndex }}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover rotate-180"
          draggable={false}
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        className="relative z-10 max-w-[90%] px-8 text-center w-full mx-auto"
      >
        <SectionLogo />

        <h2
          className="font-['Cinzel'] text-3xl font-bold mb-6 leading-tight uppercase tracking-wider"
          style={{ color: C.primary }}
        >
          <BlurText text="A Father's Blessing" />
        </h2>

        <motion.p
          variants={slowReveal}
          className="font-['Cormorant_Garamond'] text-xl md:text-2xl font-bold leading-relaxed mb-10 drop-shadow-md px-2 text-center"
          style={{ color: C.primary }}
        >
          {message}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="w-16 h-[1px] mx-auto"
          style={{ backgroundColor: C.gold }}
        />
      </motion.div>
    </section>
  );
}
