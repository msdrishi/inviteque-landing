import { motion, AnimatePresence } from 'framer-motion'

export default function CustomCover({
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
          exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412] max-w-[480px] md:max-w-[820px] mx-auto overflow-hidden cursor-pointer"
          onClick={handleOpenCover}
        >
          <div className="w-full h-full relative overflow-hidden">
            {/* Video element - plays fully until ended */}
            <video
              ref={videoRef}
              src={coverVideoSrc}
              poster={coverPosterSrc}
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

            {/* First frame floating poster - removed when video starts rendering */}
            <AnimatePresence>
              {!isVideoReady && (
                <motion.img
                  key="floating-poster"
                  src={coverPosterSrc}
                  onError={(e) => {
                    e.currentTarget.src = "/assets/templates/royal-heirloom/cover-first-frame.jpg"
                  }}
                  alt="Wedding Invitation Cover"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none scale-[1.04] z-10"
                />
              )}
            </AnimatePresence>

            {/* Sparkle animation before playing */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
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

          {/* Click Here to Open Badge */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeOut" } }}
                transition={{ duration: 0.8 }}
                className="absolute top-[18%] sm:top-[20%] inset-x-0 flex flex-col items-center pointer-events-none z-20 px-6 text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.04, 1],
                    boxShadow: [
                      '0 4px 18px rgba(74, 40, 16, 0.25)',
                      '0 8px 28px rgba(180, 130, 60, 0.45)',
                      '0 4px 18px rgba(74, 40, 16, 0.25)',
                    ]
                  }}
                  transition={{ 
                    duration: 2.2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="flex flex-col items-center gap-1 px-6 py-2.5 rounded-full bg-[#FAF5EB]/95 border-2 border-[#8C5D38] shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-['Cinzel'] tracking-[0.24em] text-[13px] sm:text-[14px] uppercase font-bold select-none text-[#4A2810]"
                      style={{
                        textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Click Here to Open
                    </span>
                    <span className="text-[10px] text-[#8C5D38] animate-bounce">▼</span>
                  </div>
                </motion.div>
                <span className="font-['Cinzel'] text-[9px] tracking-[0.28em] uppercase text-[#6B4330] mt-2 opacity-85 font-semibold drop-shadow-sm select-none">
                  Tap anywhere on card
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
