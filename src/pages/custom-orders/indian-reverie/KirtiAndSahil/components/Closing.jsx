import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, slowReveal, slideInUp, SectionLogo, BlurText } from './Animations';

export default function Closing({ data, bgImage, borderImage }) {
  const C = {
    primary: '#4A3E20',
    gold: '#B09060',
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Vintage Border Layer (Multiply blend mode makes white transparent) */}
      {borderImage && (
        <div className="absolute inset-4 md:inset-8 z-10 pointer-events-none mix-blend-multiply opacity-80">
          <img
            src={borderImage}
            alt=""
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
      )}

      {/* Logo at the top */}
      <div className="absolute top-[8vh] left-0 w-full flex justify-center z-30">
        <SectionLogo />
      </div>

      {/* Content Layer */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        className="relative z-20 w-full max-w-sm text-center px-8 flex flex-col items-center justify-center h-full mt-10"
      >

        <h2
          className="font-['Cinzel'] text-xl md:text-2xl font-bold mb-4 leading-tight uppercase tracking-wider"
          style={{ color: C.primary }}
        >
          <BlurText text={data.title} />
        </h2>

        <motion.p
          variants={slideInUp}
          className="font-['Cormorant_Garamond'] text-sm md:text-base italic leading-relaxed opacity-90 max-w-[200px] mx-auto font-medium"
          style={{ color: C.primary }}
        >
          We are overjoyed to have you celebrate this beautiful beginning with us. Your presence, love, and blessings mean the world to us.
        </motion.p>


      </motion.div>

      {/* Date floating at the bottom outside the main border focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        viewport={{ once: false, amount: 0.4 }}
        className="absolute bottom-[8vh] left-0 w-full text-center z-30"
      >
        <p className="font-['Cinzel'] text-sm md:text-base tracking-[0.3em] font-bold uppercase" style={{ color: C.primary }}>
          {data.date}
        </p>
      </motion.div>
    </section>
  );
}
