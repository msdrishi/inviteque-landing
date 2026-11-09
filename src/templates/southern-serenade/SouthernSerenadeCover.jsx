import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, FONTS, ASSETS } from './theme'

/**
 * SouthernSerenadeCover
 * 
 * Midnight Waltz Architecture for Southern Serenade:
 * - Direct video asset with `#t=0.001` to instantly decode frame 0 without flash.
 * - Initial poster image (envelope-poster.webp) with gold lotus wax seal.
 * - Elegant "TAP TO OPEN" prompt with gold zari gradient pill and traditional star motif.
 * - Audio unlocking during user gesture, followed by smooth 1.4s cross-fade exit
 *   into the eagerly loaded Hero section as video concludes.
 */
export default function SouthernSerenadeCover({
  hasOpened,
  isPlaying,
  videoRef,
  coverVideoSrc = ASSETS.coverVideo,
  coverPosterSrc = ASSETS.coverPoster,
  handleOpenCover,
  handleTimeUpdate,
  handleVideoEnded,
}) {
  return (
    <AnimatePresence>
      {!hasOpened && (
        <motion.section
          key="cover-splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } 
          }}
          style={{ pointerEvents: hasOpened ? 'none' : 'auto' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#EBDCB9] overflow-hidden cursor-pointer select-none"
          onClick={handleOpenCover}
        >
          {/* Centered Phone / Mobile Frame */}
          <div className="relative w-full max-w-[440px] h-full overflow-hidden shadow-[0_0_80px_rgba(40,10,15,0.25)] flex items-center justify-center bg-[#1A050A]">
            {/* Always mounted video element for immediate playback */}
            <video
              ref={videoRef}
              src={`${coverVideoSrc}#t=0.001`}
              poster={coverPosterSrc}
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload="auto"
              muted
              controls={false}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover select-none pointer-events-none scale-[1.01]"
            />

            {/* Floating golden sparkle decorations (visible prior to tap) */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
                >
                  {[...Array(6)].map((_, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.85, 0],
                        scale: [0.5, 1.25, 0.5],
                        y: [0, -18 - idx * 6, -35],
                        x: [(idx % 2 === 0 ? 1 : -1) * (14 + idx * 10)],
                      }}
                      transition={{
                        duration: 2.6 + idx * 0.4,
                        repeat: Infinity,
                        delay: idx * 0.45,
                        ease: 'easeInOut',
                      }}
                      className="absolute text-[11px] drop-shadow-[0_0_8px_rgba(197,160,89,0.9)]"
                      style={{ color: '#ECC876' }}
                    >
                      ✦
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tap to open overlay */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: 'easeOut' } }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-[20%] inset-x-0 flex flex-col items-center pointer-events-none z-20 px-6 text-center"
                >
                  <motion.div
                    animate={{
                      opacity: [0.85, 1, 0.85],
                      scale: [0.98, 1.02, 0.98],
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 2.0,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full shadow-[0_8px_24px_rgba(115,25,36,0.22)]"
                      style={{
                        background: 'linear-gradient(135deg, #ECC876 0%, #C5A059 50%, #99742A 100%)',
                        border: '1.5px solid #FFF5DB',
                        boxShadow: '0 8px 24px rgba(115,25,36,0.20), inset 0 1px 2px rgba(255,255,255,0.7)',
                      }}
                    >
                      <span
                        className="text-[11.5px] sm:text-[12.5px] tracking-[0.28em] font-bold uppercase select-none leading-none"
                        style={{
                          fontFamily: FONTS.label,
                          color: '#3B050D',
                          textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                        }}
                      >
                        TAP TO OPEN
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-85">
                      <div className="w-6 h-[0.8px] bg-[#8B6834]" />
                      <span className="text-[8px] text-[#731924]">✦</span>
                      <div className="w-6 h-[0.8px] bg-[#8B6834]" />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

