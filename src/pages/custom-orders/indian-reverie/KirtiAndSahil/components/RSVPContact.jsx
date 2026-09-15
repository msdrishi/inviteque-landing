import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, slideInUp, slowReveal, fadeInUp, SectionLogo } from './Animations';

export default function RSVPContact({ rsvpData, contactData, bgImage }) {
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
        viewport={{ once: false, amount: 0.2 }}
        className="relative z-10 w-full px-6 flex flex-col items-center pt-[6vh] pb-[40vh]"
      >
        <SectionLogo />

        {/* RSVP Section */}
        <div className="w-full max-w-sm text-center mb-10">
          <motion.h2 
            variants={slowReveal} 
            className="font-['Religath'] text-2xl mb-2 uppercase"
            style={{ color: C.primary }}
          >
            {rsvpData.title}
          </motion.h2>
          <motion.p 
            variants={slideInUp} 
            className="font-['Cormorant_Garamond'] text-lg font-medium italic mb-8 opacity-90"
            style={{ color: C.primary }}
          >
            {rsvpData.subtitle}
          </motion.p>
          
          <motion.form variants={fadeInUp} className="space-y-4" onSubmit={e => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full bg-transparent border-b p-3 font-['Cormorant_Garamond'] font-bold uppercase tracking-widest placeholder:text-[#4A3E20]/50 focus:outline-none" 
              style={{ borderColor: `${C.gold}80`, color: C.primary }}
            />
            <select 
              className="w-full bg-transparent border-b p-3 font-['Cormorant_Garamond'] font-bold uppercase tracking-widest focus:outline-none appearance-none"
              style={{ borderColor: `${C.gold}80`, color: C.primary }}
            >
              <option value="" disabled selected>Number of Guests</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <button 
              className="w-full py-4 mt-6 uppercase tracking-widest text-xs font-bold"
              style={{ backgroundColor: C.primary, color: '#ECE3D1' }}
            >
              Send RSVP
            </button>
          </motion.form>
        </div>

        {/* Contact Section */}
        <div className="text-center w-full max-w-sm">
          <motion.h2 
            variants={slideInUp} 
            className="font-['Religath'] text-xl mb-4 uppercase"
            style={{ color: C.primary }}
          >
            {contactData.title}
          </motion.h2>
          
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <a 
              href={contactData.whatsappLink} 
              className="flex items-center justify-center gap-3 py-3 border rounded-full uppercase tracking-widest text-[10px] font-bold transition-transform hover:scale-[1.02]"
              style={{ borderColor: C.primary, color: C.primary }}
            >
              WhatsApp Us
            </a>
            <a 
              href={contactData.phoneLink} 
              className="flex items-center justify-center gap-3 py-3 rounded-full uppercase tracking-widest text-[10px] font-bold transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: C.primary, color: '#ECE3D1' }}
            >
              Call Us
            </a>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
}
