import React from 'react'
import { motion } from 'framer-motion'

const storyBg = "/assets/templates/royal-heritage/story-mobile.webp"

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: "easeOut" } 
  },
}

const sectionAnim = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 1.5, staggerChildren: 0.3 } 
  }
}

export default function TemplateRoyalHeritageStory({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet }) {
  const { cursive, serif, smallCaps } = fontStyles;
  const storyPhotos = data.photos || [
    "/assets/templates/royal-heirloom/photo-1.webp", 
    "/assets/templates/royal-heirloom/photo-2.webp", 
    "/assets/templates/royal-heirloom/photo-3.webp"
  ];

  return (
    <motion.section 
      style={sectionStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={sectionAnim}
    >
      <img src={storyBg} alt="Story Background" style={bgStyle} />
      
      <div className="relative z-10 w-full flex flex-col items-center pt-8">
        <motion.h2 variants={fadeAnim} style={{ ...smallCaps, marginBottom: '40px', fontSize: '24px' }}>
          OUR STORY
        </motion.h2>
      </div>

      <div className="relative z-10 w-full max-w-[430px] my-auto py-2 px-3">
        
        {/* Ambient Romantic Handwritten Lettering Background */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex flex-col justify-between py-2 px-1">
          <div style={{...cursive, fontSize: '24px', opacity: 0.15, transform: 'rotate(-6deg)', paddingLeft: '8px'}}>
            i love you • i love you • i love you • i love you
          </div>
          <div style={{...cursive, fontSize: '24px', opacity: 0.15, transform: 'rotate(3deg)', paddingRight: '8px', textAlign: 'right'}}>
            forever &amp; always • eternal devotion
          </div>
          <div style={{...cursive, fontSize: '24px', opacity: 0.15, transform: 'rotate(-3deg)', paddingLeft: '16px'}}>
            i love you • i love you • my whole heart
          </div>
        </div>

        {/* Vertical Cascading Cards */}
        <div className="relative w-full flex flex-col items-center gap-0">
          
          {/* Card 1 */}
          <div className="w-full flex justify-start pl-1 sm:pl-4 z-10">
            <motion.div
              initial={{ opacity: 0, x: -24, rotate: -8, scale: 0.94 }}
              whileInView={{ opacity: 1, x: 0, rotate: -5, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
              className="w-[195px] sm:w-[215px] bg-[#F9F5EC] p-2.5 pb-4 rounded-[4px] shadow-xl border border-[rgba(138,32,42,0.3)] cursor-pointer select-none transition-shadow relative"
            >
              <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px] bg-[#E8DDD0]">
                <img src={storyPhotos[0]} alt="Moment 1" className="w-full h-full object-cover select-none pointer-events-none" />
              </div>
              <div className="mt-2 text-center">
                <span style={{...serif, fontSize: '14px', fontStyle: 'italic', display: 'block', fontWeight: 'bold'}}>Where It Began</span>
              </div>
            </motion.div>
          </div>

          {/* Card 2 */}
          <div className="w-full flex justify-end pr-1 sm:pr-4 -mt-10 sm:-mt-12 z-20">
            <motion.div
              initial={{ opacity: 0, x: 24, rotate: 10, scale: 0.94 }}
              whileInView={{ opacity: 1, x: 0, rotate: 6, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
              className="w-[200px] sm:w-[220px] bg-[#F9F5EC] p-2.5 pb-4 rounded-[4px] shadow-xl border border-[rgba(138,32,42,0.3)] cursor-pointer select-none transition-shadow relative"
            >
              <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px] bg-[#E8DDD0]">
                <img src={storyPhotos[1]} alt="Moment 2" className="w-full h-full object-cover select-none pointer-events-none" />
              </div>
              <div className="mt-2 text-center">
                <span style={{...serif, fontSize: '14px', fontStyle: 'italic', display: 'block', fontWeight: 'bold'}}>A Timeless Promise</span>
              </div>
            </motion.div>
          </div>

          {/* Card 3 */}
          <div className="w-full flex justify-start pl-3 sm:pl-7 -mt-10 sm:-mt-12 z-30">
            <motion.div
              initial={{ opacity: 0, y: 28, rotate: -8, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, rotate: -4, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.4, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
              className="w-[195px] sm:w-[215px] bg-[#F9F5EC] p-2.5 pb-4 rounded-[4px] shadow-xl border border-[rgba(138,32,42,0.3)] cursor-pointer select-none transition-shadow relative"
            >
              <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px] bg-[#E8DDD0]">
                <img src={storyPhotos[2]} alt="Moment 3" className="w-full h-full object-cover select-none pointer-events-none" />
              </div>
              <div className="mt-2 text-center">
                <span style={{...serif, fontSize: '14px', fontStyle: 'italic', display: 'block', fontWeight: 'bold'}}>Forever & Always</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  )
}
