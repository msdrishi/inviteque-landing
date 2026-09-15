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
          className="font-['Cinzel'] text-xl font-bold mb-6 leading-none uppercase tracking-wider drop-shadow-md bg-white/40 backdrop-blur-sm px-4 py-1 rounded-full inline-block"
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
          <p className="font-['Cormorant_Garamond'] text-sm uppercase tracking-widest font-semibold mb-8 drop-shadow-md" style={{ color: C.primary }}>
            {data.location}
          </p>
          
          <div className="w-full flex flex-col items-center gap-6 drop-shadow-md">
            {/* Route 1: Pune */}
            <div className="relative w-full h-10 flex items-center">
              <div className="w-16 text-right pr-2 font-['Cinzel'] text-xs font-bold" style={{ color: C.primary }}>PUNE</div>
              <div className="flex-1 relative h-0">
                <div className="absolute inset-0 border-t border-dashed" style={{ borderColor: C.primary, opacity: 0.4 }} />
                <motion.div
                  initial={{ left: '0%' }}
                  whileInView={{ left: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                  className="absolute top-1/2 -translate-y-[60%] -translate-x-1/2 drop-shadow-sm w-6 h-6 text-[#B09060]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                    <circle cx="7.5" cy="14.5" r="1.5" />
                    <circle cx="16.5" cy="14.5" r="1.5" />
                  </svg>
                </motion.div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 font-['Cormorant_Garamond'] text-[10px] font-bold tracking-widest bg-white/50 px-2 rounded-full" style={{ color: C.primary }}>
                  40 KM
                </div>
              </div>
              <div className="w-16 pl-2 flex items-center justify-start">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: C.gold }} />
              </div>
            </div>

            {/* Route 2: Mumbai */}
            <div className="relative w-full h-10 flex items-center">
              <div className="w-16 text-right pr-2 font-['Cinzel'] text-xs font-bold" style={{ color: C.primary }}>MUMBAI</div>
              <div className="flex-1 relative h-0">
                <div className="absolute inset-0 border-t border-dashed" style={{ borderColor: C.primary, opacity: 0.4 }} />
                <motion.div
                  initial={{ left: '0%' }}
                  whileInView={{ left: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 8, ease: 'easeOut', delay: 1 }}
                  className="absolute top-1/2 -translate-y-[60%] -translate-x-1/2 drop-shadow-sm w-6 h-6 text-[#B09060]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                    <circle cx="7.5" cy="14.5" r="1.5" />
                    <circle cx="16.5" cy="14.5" r="1.5" />
                  </svg>
                </motion.div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 font-['Cormorant_Garamond'] text-[10px] font-bold tracking-widest bg-white/50 px-2 rounded-full" style={{ color: C.primary }}>
                  180 KM
                </div>
              </div>
              <div className="w-16 pl-2 flex items-center justify-start">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: C.gold }} />
              </div>
            </div>
            
            <p className="font-['Cormorant_Garamond'] text-xs font-bold uppercase tracking-widest mt-2" style={{ color: C.primary }}>
              Valet Parking Available
            </p>
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
