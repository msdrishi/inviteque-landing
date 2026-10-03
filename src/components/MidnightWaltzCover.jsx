import { motion, AnimatePresence } from 'framer-motion'
export default function MidnightWaltzCover({
  hasOpened,
  isPlaying,
  isVideoReady,
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
          exit={{ opacity: 0, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A0A12] max-w-[480px] md:max-w-[820px] mx-auto overflow-hidden cursor-pointer"
          onClick={handleOpenCover}
        >
          <div className="w-full h-full relative overflow-hidden">
            {/* Always mounted video element for immediate playback */}
            <video
              ref={videoRef}
              src={`${coverVideoSrc}#t=0.001`}
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload="auto"
              muted
              controls={false}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover select-none pointer-events-none scale-[1.04]"
            />

            {/* Floating star animations */}
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
                      className="absolute text-[10px] drop-shadow-[0_0_8px_rgba(176,144,96,0.8)]"
                      style={{ color: '#B09060' }}
                    >
                      ✦
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tap to open overlay */}
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
                    className="font-['Cinzel'] tracking-[0.38em] text-[15px] uppercase font-bold select-none"
                    style={{
                      color: '#4A3E20',
                      textShadow: `0 0 16px rgba(176, 144, 96, 0.6), 0 1px 1px rgba(255, 255, 255, 0.9)`,
                      filter: `drop-shadow(0 2px 8px rgba(176, 144, 96, 0.25))`
                    }}
                  >
                    Tap to Open
                  </span>
                  <div className="flex items-center gap-2 opacity-90">
                    <div className="w-6 h-[0.8px]" style={{ backgroundColor: '#4A3E20' }} />
                    <span className="text-[7px]" style={{ color: '#4A3E20' }}>✦</span>
                    <div className="w-6 h-[0.8px]" style={{ backgroundColor: '#4A3E20' }} />
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
