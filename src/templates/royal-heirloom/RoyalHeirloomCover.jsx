import { motion, AnimatePresence } from 'framer-motion'

export default function RoyalHeirloomCover({
  hasOpened,
  isPlaying,
  videoRef,
  coverVideoSrc,
  coverPosterSrc,
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412] overflow-hidden cursor-pointer select-none"
          onClick={handleOpenCover}
        >
          {/* Centered Phone / Mobile Frame */}
          <div className="relative w-full max-w-[440px] md:max-w-[480px] h-full overflow-hidden shadow-[0_0_80px_rgba(40,10,15,0.25)] flex items-center justify-center bg-[#1A1412]">
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

            {/* Restored exact original 6-star animation and styling */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
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
                      className="absolute text-[10px] text-[#F5D78E] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                    >
                      ✦
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeOut" } }}
                transition={{ duration: 0.8 }}
                className="absolute top-[20%] inset-x-0 flex flex-col items-center pointer-events-none z-20 px-6 text-center"
              >
                <motion.div
                  animate={{ 
                    opacity: [0.45, 1, 0.45],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span 
                    className="font-['Cinzel'] tracking-[0.38em] text-[15px] uppercase font-bold select-none text-[#5A2821]"
                    style={{
                      textShadow: '0 0 16px rgba(235, 190, 90, 0.8), 0 1px 1px rgba(255, 255, 255, 0.9)',
                      filter: 'drop-shadow(0 2px 8px rgba(90, 40, 33, 0.35))'
                    }}
                  >
                    Tap to Open
                  </span>
                  <div className="flex items-center gap-2 opacity-90">
                    <div className="w-6 h-[0.8px] bg-[#965545]" />
                    <span className="text-[7px] text-[#A85B49]">✦</span>
                    <div className="w-6 h-[0.8px] bg-[#965545]" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
