import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, slideInUp, fadeInUp, SectionLogo, BlurText } from './Animations';

export default function TravelGuide({ data, bgImage }) {
  const C = {
    primary:   '#4A3E20',
    gold:      '#B09060',
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-start items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: false, amount: 0.4 }}
        className="relative z-10 w-full max-w-sm px-6 pt-[8vh] pb-[40vh] text-center flex flex-col items-center"
      >
        <SectionLogo />

        <h2 
          className="font-['Cinzel'] text-3xl font-bold mb-6 leading-tight uppercase tracking-wider"
          style={{ color: C.primary }}
        >
          <BlurText text={data.title} />
        </h2>

        <motion.div 
          variants={fadeInUp} 
          className="mb-8 p-4 w-full"
        >
          <p className="font-['Cormorant_Garamond'] text-xl font-bold uppercase mb-2 drop-shadow-md" style={{ color: C.primary }}>
            {data.venueName}
          </p>
          <p className="font-['Cormorant_Garamond'] text-sm uppercase tracking-widest font-semibold mb-6 drop-shadow-md" style={{ color: C.primary }}>
            {data.location}
          </p>
          
          <div className="space-y-3 font-['Cormorant_Garamond'] text-sm font-bold uppercase tracking-widest drop-shadow-md" style={{ color: C.primary }}>
            {data.directions.map((dir, idx) => (
              <p key={idx}>{dir}</p>
            ))}
          </div>
        </motion.div>

        <motion.div variants={slideInUp} className="flex flex-col items-center mt-2 mb-6">
          <div className="p-2 bg-white rounded-xl shadow-lg border border-white/20 mb-4">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.mapUrl)}`} 
              alt="Scan for Directions"
              className="w-24 h-24 object-contain"
            />
          </div>
          <a 
            href={data.mapUrl}
            target="_blank" 
            rel="noreferrer"
            className="inline-block px-8 py-3 uppercase tracking-[0.2em] font-['Montserrat'] font-bold text-[10px] rounded-full shadow-md"
            style={{ backgroundColor: C.primary, color: '#ECE3D1' }}
          >
            Get Directions
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
