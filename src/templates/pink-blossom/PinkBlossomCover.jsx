import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from './theme'

export default function PinkBlossomCover({
  hasOpened,
  isPlaying,
  videoRef,
  coverVideoSrc,
  coverPosterSrc,
  handleOpenCover,
  handleTimeUpdate,
  handleVideoEnded,
  coverTapText,
  coverTapBelow,
  coverTapFont,
  coverTapColor,
  hideTapUnderline,
  coverTapAsPill,
}) {
  return (
    <AnimatePresence>
      {!hasOpened && (
        <motion.section
          key="cover-splash"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.04, 
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
          }}
          style={{ pointerEvents: hasOpened ? 'none' : 'auto' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A0A12] max-w-[480px] md:max-w-[820px] mx-auto overflow-hidden cursor-pointer select-none"
          onClick={handleOpenCover}
        >
          <div className="w-full h-full relative overflow-hidden">
            {/* Directly mounted video element with poster for instant playback */}
            <video
              ref={videoRef}
              src={coverVideoSrc}
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload="auto"
              muted
              controls={false}
              poster={coverPosterSrc}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onError={handleVideoEnded}
              className="w-full h-full object-cover select-none pointer-events-none scale-[1.04]"
              style={{
                display: 'block',
              }}
            />

            {/* Floating star decorations (only visible prior to tap) */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
                >
                  {[...Array(6)].map((_, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.2, 0.5],
                        y: [0, -15 - idx * 5, -30],
                        x: [(idx % 2 === 0 ? 1 : -1) * (10 + idx * 8)]
                      }}
                      transition={{
                        duration: 2.5 + idx * 0.4,
                        repeat: Infinity,
                        delay: idx * 0.5,
                        ease: "easeInOut"
                      }}
                      className="absolute text-[10px] drop-shadow-[0_0_8px_rgba(200,25,94,0.8)]"
                      style={{ color: COLORS.gold }}
                    >
                      ✦
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tap to open overlay (disappears immediately upon tap for lag-free video start) */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: "easeOut" } }}
                transition={{ duration: 0.8 }}
                className={`absolute ${coverTapBelow ? 'bottom-[18%] sm:bottom-[22%]' : 'top-[20%]'} inset-x-0 flex flex-col items-center pointer-events-none z-20 px-6 text-center`}
              >
                <motion.div
                  animate={{ 
                    opacity: [0.88, 1, 0.88],
                    scale: [0.97, 1.03, 0.97],
                  }}
                  transition={{ 
                    duration: 2.2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className={`flex flex-col items-center gap-1.5 ${
                    coverTapAsPill
                      ? 'px-7 py-2.5 rounded-full backdrop-blur-md bg-white/80 border border-[#B01050]/25 shadow-[0_8px_24px_rgba(59,34,16,0.18),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                      : ''
                  }`}
                >
                  {(() => {
                    const isScriptFont = coverTapFont && (coverTapFont.includes('Pinyon') || coverTapFont.includes('cursive') || coverTapFont.includes('Script'));
                    return (
                      <span 
                        className={`select-none ${isScriptFont ? 'text-[24px] sm:text-[28px] font-normal tracking-wide' : 'tracking-[0.24em] text-[15px] sm:text-[17px] uppercase font-bold'}`}
                        style={{
                          fontFamily: coverTapFont || "'Cinzel', 'Montserrat', serif",
                          color: coverTapColor || '#2B1A0E',
                          textShadow: `0 1px 2px rgba(255, 255, 255, 0.9)`,
                          filter: `drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))`,
                          textDecoration: 'none',
                          textTransform: isScriptFont ? 'none' : 'uppercase',
                          lineHeight: 1.2,
                        }}
                      >
                        {coverTapText || 'Tap to Open'}
                      </span>
                    );
                  })()}
                  {!hideTapUnderline && !coverTapAsPill && (
                    <div className="flex items-center gap-2 opacity-90">
                      <div className="w-6 h-[0.8px]" style={{ backgroundColor: COLORS.textDark }} />
                      <span className="text-[7px]" style={{ color: COLORS.primary }}>✦</span>
                      <div className="w-6 h-[0.8px]" style={{ backgroundColor: COLORS.textDark }} />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
