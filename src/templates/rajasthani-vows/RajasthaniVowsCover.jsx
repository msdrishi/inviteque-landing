import { motion, AnimatePresence } from 'framer-motion'

export default function RajasthaniVowsCover({
  hasOpened,
  isPlaying,
  isVideoReady,
  videoRef,
  coverVideoSrc = "/assets/templates/rajestani-vows/rajastani-cover-opening.mp4",
  coverPosterSrc = "/assets/templates/rajestani-vows/cover-first-frame.webp",
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
          exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF6EE] overflow-hidden cursor-pointer"
          onClick={handleOpenCover}
        >
          <div className="w-full h-full max-w-[480px] md:max-w-[720px] relative overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Real Video Element for opening animation */}
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
              className="w-full h-full object-cover select-none pointer-events-none scale-[1.01]"
            />

            {/* 1st Frame Poster Image (Displayed before video starts rendering) */}
            <AnimatePresence>
              {!isVideoReady && (
                <motion.img
                  key="cover-first-frame"
                  src={coverPosterSrc}
                  alt="Wedding Invitation Cover"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none scale-[1.01] z-10"
                />
              )}
            </AnimatePresence>

            {/* Floating Golden Stars around the seal */}
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
                        opacity: [0, 0.85, 0],
                        scale: [0.5, 1.25, 0.5],
                        y: [0, -15 - idx * 6, -32],
                        x: [(idx % 2 === 0 ? 1 : -1) * (14 + idx * 9)],
                      }}
                      transition={{
                        duration: 2.6 + idx * 0.4,
                        repeat: Infinity,
                        delay: idx * 0.4,
                        ease: "easeInOut",
                      }}
                      className="absolute text-[11px] drop-shadow-[0_0_8px_rgba(197,154,78,0.85)]"
                      style={{ color: '#C59A4E' }}
                    >
                      ✦
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tap to Open Overlay positioned in the lower watercolor space */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeOut" } }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute bottom-[8%] sm:bottom-[10%] inset-x-0 flex flex-col items-center pointer-events-none z-20 px-6 text-center"
                >
                  <motion.div
                    animate={{
                      opacity: [0.8, 1, 0.8],
                      scale: [0.98, 1.025, 0.98],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="px-5 py-2.5 rounded-full bg-white/75 backdrop-blur-md border border-[#C59A4E]/50 shadow-[0_4px_20px_rgba(122,18,40,0.12)] flex items-center gap-2.5">
                      <span className="text-[10px] text-[#C59A4E]">✦</span>
                      <span
                        className="font-['Cinzel'] tracking-[0.32em] text-[13px] sm:text-[15px] uppercase font-bold select-none text-[#7A1228]"
                        style={{
                          textShadow: `0 1px 2px rgba(255, 255, 255, 0.9)`,
                        }}
                      >
                        Tap to Open
                      </span>
                      <span className="text-[10px] text-[#C59A4E]">✦</span>
                    </div>
                    <span className="text-[10px] font-['Cinzel'] tracking-[0.25em] uppercase text-[#A87B32] opacity-85">
                      A Royal Invitation
                    </span>
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
