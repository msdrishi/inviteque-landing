import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, slideInUp, slowReveal, SectionLogo, BlurText, WatercolorSplash } from './Animations';

export default function EventScene({ dayData, bgImage, isSticky, zIndex, topRounded }) {
  const [showPopup, setShowPopup] = useState(false);
  const C = {
    primary: '#4A3E20',
    gold: '#B09060',
  };

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => { 
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = '';
    }
  }, [showPopup]);

  if (!dayData) return null;

  const isDayOne = !dayData.title; // haldi/engagement have empty title

  return (
    <section
      className={`relative min-h-[100dvh] w-full flex flex-col justify-start items-center overflow-hidden bg-[#F9F6F0]
        ${isSticky ? 'sticky top-0' : ''} 
        ${topRounded ? 'rounded-t-[3rem] md:rounded-t-[4rem] shadow-[0_-15px_40px_rgba(0,0,0,0.25)] mt-[-2rem]' : ''}
      `}
      style={{ zIndex }}
    >
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
        viewport={{ once: false, amount: 0.2 }}
        className="relative z-10 flex flex-col items-center px-6 pt-[6vh] pb-[45vh] w-full text-center"
      >
        <SectionLogo />

        <motion.p
          variants={slideInUp}
          className={`font-['Cinzel'] font-bold uppercase tracking-[0.2em] mb-2 whitespace-pre-line leading-snug ${isDayOne ? 'text-sm md:text-base' : 'text-xl md:text-2xl'}`}
          style={{ color: C.primary }}
        >
          {dayData.date}
        </motion.p>

        {!isDayOne && (
          <>
            <h2
              className="font-['Cinzel'] text-xl font-bold mb-2 leading-none uppercase tracking-wider drop-shadow-md bg-white/40 backdrop-blur-sm px-4 py-1 rounded-full inline-block"
              style={{ color: C.primary }}
            >
              <BlurText text={dayData.title} />
            </h2>
            {dayData.subtitle && (
              <p className="font-['Cinzel'] text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: C.primary }}>
                {dayData.subtitle}
              </p>
            )}
          </>
        )}

        {/* Day 1 Layout (Direct Info) */}
        {isDayOne && dayData.events[0] && (
          <motion.div variants={slideInUp} className="flex flex-col items-center mt-0 w-full max-w-[90%] mx-auto">
            <h3 className="font-['Cinzel'] text-xl font-bold mb-2 leading-none uppercase tracking-wider drop-shadow-md bg-white/40 backdrop-blur-sm px-4 py-1 rounded-full" style={{ color: C.primary }}>
              <BlurText text={dayData.events[0].title} />
            </h3>
            <span className="font-['Cinzel'] text-[10px] uppercase tracking-[0.3em] font-bold mb-3 drop-shadow-sm bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full" style={{ color: C.primary }}>
              {dayData.events[0].time}
            </span>
            {dayData.events[0].description && (
              <p className="font-['Cormorant_Garamond'] text-sm md:text-base leading-snug whitespace-pre-line mb-3 font-bold max-w-[320px] drop-shadow-md text-center" style={{ color: C.primary }}>
                {dayData.events[0].description}
              </p>
            )}
            
            {dayData.events[0].expectations && (
              <div className="w-full text-left mb-4 px-2">
                <p className="font-['Cormorant_Garamond'] text-base font-bold mb-1 flex items-center gap-2 drop-shadow-md" style={{ color: C.primary }}>
                  ✨ What to Expect
                </p>
                <ul className="list-disc pl-5 font-['Cormorant_Garamond'] text-sm md:text-base leading-snug font-bold space-y-1 drop-shadow-md" style={{ color: C.primary }}>
                  {dayData.events[0].expectations.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {dayData.events[0].dressCodeArray && (
              <div className="w-full text-left bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white relative overflow-hidden">
                <WatercolorSplash colors={dayData.events[0].dressCodeArray.map(d => d.color).filter(Boolean)} />
                <div className="relative z-10">
                <p className="font-['Cormorant_Garamond'] text-base font-bold mb-2 flex items-center gap-2" style={{ color: C.primary }}>
                  👗 Dress Code
                </p>
                <ul className="font-['Cormorant_Garamond'] text-sm md:text-base leading-snug font-semibold space-y-1.5" style={{ color: C.primary }}>
                  {dayData.events[0].dressCodeArray.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {item.color && (
                        <span className="w-3 h-3 rounded-full mt-[5px] shrink-0 shadow-sm border border-black/10" style={{ backgroundColor: item.color }}></span>
                      )}
                      <span><strong>{item.label}:</strong> {item.desc}</span>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            )}

            {dayData.events[0].dressCode && !dayData.events[0].dressCodeArray && (
              <div className="w-full pt-3 border-t border-black/10 max-w-[280px]">
                <p className="font-['Cormorant_Garamond'] text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.gold }}>👗 Dress Code</p>
                <p className="font-['Cormorant_Garamond'] text-sm md:text-base leading-snug opacity-90 whitespace-pre-line font-medium" style={{ color: C.primary }}>
                  {dayData.events[0].dressCode}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Day 2 Layout (Popup Button) */}
        {!isDayOne && (
          <motion.button
            variants={slideInUp}
            onClick={() => setShowPopup(true)}
            className="mt-6 px-8 py-4 rounded-full border border-black/10 text-[10px] uppercase tracking-[0.2em] font-['Montserrat'] font-bold bg-white/80 backdrop-blur-md shadow-md hover:bg-white transition-colors"
            style={{ color: C.primary }}
          >
            View Full Itinerary
          </motion.button>
        )}
      </motion.div>

      {/* Full Itinerary Modal / Popup for Day 2 */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
            style={{ overscrollBehavior: 'none' }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8 hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-black hover:bg-black/10 transition-colors z-10"
              >
                ✕
              </button>

              <div className="text-center mb-8 mt-2">
                <p className="font-['Cinzel'] text-xs uppercase tracking-[0.2em] mb-2 font-bold tabular-nums" style={{ color: C.gold }}>
                  {dayData.date}
                </p>
                <h3 className="font-['Cinzel'] text-3xl font-bold uppercase tracking-widest" style={{ color: C.primary }}>
                  {dayData.title}
                </h3>
              </div>

              <div className="flex flex-col gap-8 pb-4">
                {dayData.events.map((evt, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    {idx % 2 === 0 ? (
                      <>
                        <div className="w-1/2 aspect-square rounded-2xl overflow-hidden shadow-md shrink-0">
                          <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-1/2 flex flex-col items-start text-left">
                          <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold leading-none mb-1" style={{ color: C.primary }}>{evt.title}</h4>
                          <span className="font-['Cinzel'] text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: C.gold }}>{evt.time}</span>
                          <p className="font-['Cormorant_Garamond'] text-lg font-medium leading-relaxed opacity-90" style={{ color: C.primary }}>{evt.desc}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-1/2 flex flex-col items-end text-right">
                          <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold leading-none mb-1" style={{ color: C.primary }}>{evt.title}</h4>
                          <span className="font-['Cinzel'] text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: C.gold }}>{evt.time}</span>
                          <p className="font-['Cormorant_Garamond'] text-lg font-medium leading-relaxed opacity-90" style={{ color: C.primary }}>{evt.desc}</p>
                        </div>
                        <div className="w-1/2 aspect-square rounded-2xl overflow-hidden shadow-md shrink-0">
                          <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
