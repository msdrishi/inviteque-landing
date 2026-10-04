import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, ASSETS, TEXTURE_SVG } from './theme'

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
}

const sectionAnim = {
  hidden: { },
  visible: { transition: { staggerChildren: 0.3 } }
}

export default function PinkBlossomStory({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet }) {
  const { cursive, serif, smallCaps } = fontStyles
  const defaultPhotos = [
    "/assets/templates/royal-heirloom/photo-1.webp", 
    "/assets/templates/royal-heirloom/photo-2.webp", 
    "/assets/templates/royal-heirloom/photo-3.webp"
  ]
  const storyPhotos = data.photos || defaultPhotos

  return (
    <motion.section 
      style={{ 
        ...sectionStyle, 
        paddingBottom: '80px',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={sectionAnim}
    >
      <img src={ASSETS.storyBg} alt="Story Background" style={bgStyle} />
      <div className="relative z-10 w-full flex flex-col items-center pt-12">
        <motion.div variants={fadeAnim} style={{ marginBottom: '30px' }}>
          <h2 style={{ ...smallCaps, margin: 0, fontSize: '24px', letterSpacing: '0.15em' }}>
            OUR STORY
          </h2>
        </motion.div>
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
          {storyPhotos[0] && (
            <div className="w-full flex justify-start pl-1 sm:pl-4 z-10">
              <motion.div
                initial={{ opacity: 0, x: -24, rotate: -8, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, rotate: -5, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
                className="w-[195px] sm:w-[215px] p-2.5 pb-4 rounded-[4px] shadow-xl cursor-pointer select-none transition-shadow relative"
                style={{ backgroundColor: COLORS.cardBg, border: `1px solid rgba(200,25,94,0.25)` }}
              >
                <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px]" style={{ backgroundColor: COLORS.ivory }}>
                  <img src={storyPhotos[0]} alt="Moment 1" className="w-full h-full object-cover select-none pointer-events-none" />
                </div>
                <div className="mt-2 text-center">
                  <span style={{...serif, fontSize: '14px', fontStyle: 'italic', display: 'block', fontWeight: 'bold'}}>{data.storyTitles?.[0] || 'Where It Began'}</span>
                  {data.storyDescriptions?.[0] && <span style={{...serif, fontSize: '11px', display: 'block', opacity: 0.85, marginTop: '4px', lineHeight: '1.4', padding: '0 8px'}}>{data.storyDescriptions[0]}</span>}
                </div>
              </motion.div>
            </div>
          )}

          {/* Card 2 */}
          {storyPhotos[1] && (
            <div className="w-full flex justify-end pr-1 sm:pr-4 -mt-10 sm:-mt-12 z-20">
              <motion.div
                initial={{ opacity: 0, x: 24, rotate: 10, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, rotate: 6, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
                className="w-[200px] sm:w-[220px] p-2.5 pb-4 rounded-[4px] shadow-xl cursor-pointer select-none transition-shadow relative"
                style={{ backgroundColor: COLORS.cardBg, border: `1px solid rgba(200,25,94,0.25)` }}
              >
                <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px]" style={{ backgroundColor: COLORS.ivory }}>
                  <img src={storyPhotos[1]} alt="Moment 2" className="w-full h-full object-cover select-none pointer-events-none" />
                </div>
                <div className="mt-2 text-center">
                  <span style={{...serif, fontSize: '14px', fontStyle: 'italic', display: 'block', fontWeight: 'bold'}}>{data.storyTitles?.[1] || 'A Timeless Promise'}</span>
                  {data.storyDescriptions?.[1] && <span style={{...serif, fontSize: '11px', display: 'block', opacity: 0.85, marginTop: '4px', lineHeight: '1.4', padding: '0 8px'}}>{data.storyDescriptions[1]}</span>}
                </div>
              </motion.div>
            </div>
          )}

          {/* Card 3 */}
          {storyPhotos[2] && (
            <div className="w-full flex justify-start pl-3 sm:pl-7 -mt-10 sm:-mt-12 z-30">
              <motion.div
                initial={{ opacity: 0, y: 28, rotate: -8, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, rotate: -4, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.4, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
                className="w-[195px] sm:w-[215px] p-2.5 pb-4 rounded-[4px] shadow-xl cursor-pointer select-none transition-shadow relative"
                style={{ backgroundColor: COLORS.cardBg, border: `1px solid rgba(200,25,94,0.25)` }}
              >
                <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px]" style={{ backgroundColor: COLORS.ivory }}>
                  <img src={storyPhotos[2]} alt="Moment 3" className="w-full h-full object-cover select-none pointer-events-none" />
                </div>
                <div className="mt-2 text-center">
                  <span style={{...serif, fontSize: '14px', fontStyle: 'italic', display: 'block', fontWeight: 'bold'}}>{data.storyTitles?.[2] || 'Forever & Always'}</span>
                  {data.storyDescriptions?.[2] && <span style={{...serif, fontSize: '11px', display: 'block', opacity: 0.85, marginTop: '4px', lineHeight: '1.4', padding: '0 8px'}}>{data.storyDescriptions[2]}</span>}
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </motion.section>
  )
}
