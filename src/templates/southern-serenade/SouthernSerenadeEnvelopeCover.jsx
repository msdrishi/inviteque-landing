import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FallingPetals from './FallingPetals'
import { COLORS, FONTS, ASSETS } from './theme'

const ENVELOPE_COVER_SRC = '/assets/templates/southern-serenade/envelope-cover.webp'

/**
 * SouthernSerenadeEnvelopeCover
 * 
 * Luxury Royal Red Velvet & Gold Brooch Envelope Experience:
 * - Plain parchment background (plain-bg.webp) with subtle top & bottom filigree motifs.
 * - Perfectly centered envelope assembly.
 * - Invitation card sits tucked naturally inside the envelope, elevated above the pocket rim.
 * - Buttery-smooth swipe-up / tap extraction: The envelope drops away while the card glides
 *   and blossoms seamlessly into the full-screen Hero section with ZERO break or offset.
 */
export default function SouthernSerenadeEnvelopeCover({
  hasOpened,
  onOpen,
  onComplete,
  heroBg = ASSETS.heroBg,
}) {
  const [isExtracting, setIsExtracting] = useState(false)
  const isTriggeredRef = useRef(false)

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isDesktop = windowWidth >= 1024
  const isTablet = !isDesktop && windowWidth >= 600
  const heroScale = isDesktop ? 1.18 : (isTablet ? 1.05 : 1.10)

  const triggerExtraction = () => {
    if (isTriggeredRef.current || hasOpened) return
    isTriggeredRef.current = true
    setIsExtracting(true)
    if (onOpen) onOpen()

    // Smoothly hand off right as the card reaches full screen
    setTimeout(() => {
      if (onComplete) onComplete()
    }, 900)
  }

  return (
    <AnimatePresence>
      {!hasOpened && (
        <motion.div
          key="southern-serenade-envelope-cover"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeOut' } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden select-none"
          style={{
            touchAction: isExtracting ? 'none' : 'pan-x',
          }}
          onClick={triggerExtraction}
        >
          {/* ═══════════════════════════════════════════════════════════════
              1. PLAIN PARCHMENT BACKGROUND FOR SWIPE UP PAGE
          ═══════════════════════════════════════════════════════════════ */}
          <motion.div 
            animate={isExtracting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          >
            <img
              src="/assets/templates/southern-serenade/plain-bg.webp"
              alt="Parchment Background"
              className="w-full h-full object-cover object-center block"
              loading="eager"
            />
            
            {/* Ambient Falling Jasmine & Rose Petals */}
            <FallingPetals count={16} />

            {/* Soft Luminous Golden Glow behind the envelope */}
            <motion.div
              initial={{ opacity: 0.25, scale: 0.95 }}
              animate={{ 
                opacity: [0.22, 0.40, 0.22],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none rounded-full w-[380px] h-[380px] filter blur-3xl"
              style={{ backgroundColor: 'rgba(218, 185, 110, 0.22)' }}
            />
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              2. TOP BANNER: SWIPE UP TO REVEAL
          ═══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {!isExtracting && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25, transition: { duration: 0.2 } }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-40 pt-8 sm:pt-10 flex flex-col items-center pointer-events-auto cursor-pointer"
                onClick={triggerExtraction}
              >
                {/* Floating Gold Zari Banner Pill */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full shadow-[0_10px_28px_rgba(90,10,20,0.18)] transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #ECC876 0%, #C5A059 50%, #99742A 100%)',
                    border: '1.5px solid #FFF5DB',
                    boxShadow: '0 8px 24px rgba(90,10,20,0.16), inset 0 1px 2px rgba(255,255,255,0.6)',
                  }}
                >
                  <motion.svg
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#3B050D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 15l-6-6-6 6" />
                  </motion.svg>
                  <span
                    className="text-[11px] sm:text-[12px] tracking-[0.28em] font-bold uppercase select-none leading-none"
                    style={{
                      fontFamily: FONTS.label,
                      color: '#3B050D',
                      textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                    }}
                  >
                    SWIPE UP TO REVEAL
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════════════
              3. UNIFIED ENVELOPE & CARD ASSEMBLY
              - Perfectly centered on screen horizontally (mx-auto).
              - When swipe occurs, the card scales up smoothly to 100vw x 100svh
                while the sleeve slides down.
          ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="relative z-10 w-full flex flex-col items-center justify-end pb-4 sm:pb-7"
            style={{
              maxWidth: '380px',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            {/* The Envelope Stage: Strictly Centered */}
            <div 
              className="relative w-full max-w-[340px] flex items-end justify-center"
              style={{
                aspectRatio: '826 / 907',
              }}
            >
              {/* 3A. ENVELOPE BACK PANEL (Behind Card, z-10) */}
              <motion.div
                animate={isExtracting ? { y: 320, opacity: 0, scale: 0.92 } : { y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-[22px] overflow-hidden pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(180deg, #6B101D 0%, #4D0913 60%, #30030A 100%)',
                  border: '1.5px solid rgba(212, 175, 55, 0.40)',
                  boxShadow: '0 25px 60px rgba(50, 5, 12, 0.35), 0 8px 24px rgba(0, 0, 0, 0.15)',
                }}
              >
                {/* Gold Inner Liner Trim */}
                <div 
                  className="absolute inset-2 rounded-[18px] pointer-events-none"
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
                  }}
                />
              </motion.div>

              {/* 3B. THE INVITATION CARD (Nested Centered, Smoothly Expands to Full Screen) */}
              <motion.div
                drag={!isExtracting ? 'y' : false}
                dragConstraints={{ top: -280, bottom: 0 }}
                dragElastic={0.06}
                onDragEnd={(e, info) => {
                  if (info.offset.y < -35 || info.velocity.y < -180) {
                    triggerExtraction()
                  }
                }}
                animate={
                  isExtracting
                    ? {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100svh',
                        maxWidth: '100vw',
                        maxHeight: '100svh',
                        borderRadius: 0,
                        borderWidth: 0,
                        y: 0,
                        zIndex: 45,
                        boxShadow: 'none',
                      }
                    : {
                        position: 'absolute',
                        bottom: '20px',
                        left: '6%',
                        right: '6%',
                        width: '88%',
                        // Elevated above the cover
                        height: '112%',
                        borderRadius: 14,
                        borderWidth: 1.5,
                        borderColor: 'rgba(197, 160, 89, 0.65)',
                        y: 0,
                        zIndex: 20,
                        boxShadow: `
                          0 -12px 28px rgba(45, 10, 15, 0.22),
                          0 15px 35px rgba(30, 4, 8, 0.38),
                          0 4px 12px rgba(0, 0, 0, 0.20)
                        `,
                      }
                }
                transition={{
                  duration: isExtracting ? 0.9 : 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="overflow-hidden flex flex-col items-center justify-between cursor-grab active:cursor-grabbing border-solid"
                style={{
                  touchAction: 'none',
                  backgroundColor: COLORS.bgIvory,
                }}
              >
                {/* Card Artwork: The exact Southern Serenade Hero Background */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                  <motion.img
                    src={heroBg}
                    alt="Wedding Invitation Card"
                    className="w-full h-full object-cover object-top block"
                    animate={{
                      scale: isExtracting ? heroScale : 1.0,
                    }}
                    transition={{
                      duration: isExtracting ? 0.9 : 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      transformOrigin: 'center top',
                    }}
                    loading="eager"
                  />
                </div>

                {/* Spacer */}
                <div />
              </motion.div>

              {/* 3C. ENVELOPE FRONT POCKET (In Front of Card, z-30) */}
              <motion.div
                animate={isExtracting ? { y: 320, opacity: 0, scale: 0.92 } : { y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full pointer-events-none z-30 flex items-end justify-center"
              >
                {/* The Ornate Velvet & Gold Brooch Pocket Image */}
                <img
                  src={ENVELOPE_COVER_SRC}
                  alt="Traditional Wedding Envelope Cover"
                  className="w-full h-full object-contain object-bottom block select-none pointer-events-none"
                  style={{
                    filter: 'drop-shadow(0 20px 40px rgba(60, 5, 15, 0.35)) drop-shadow(0 8px 18px rgba(0, 0, 0, 0.15))',
                  }}
                  loading="eager"
                />
              </motion.div>

            </div>
          </div>

          {/* Bottom spacing anchor */}
          <div className="h-1" />

        </motion.div>
      )}
    </AnimatePresence>
  )
}
