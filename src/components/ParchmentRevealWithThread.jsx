import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

/**
 * ParchmentRevealWithThread — A premium scroll parchment that opens
 * when the user drags (pulls) a decorative thread hanging from the top.
 * 
 * Every time this section scrolls into view, the parchment resets to 
 * its closed state, and the user can pull the thread again to reveal.
 */
export default function ParchmentRevealWithThread({ children }) {
  const containerRef = useRef(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)

  // Drag value for the thread
  const dragY = useMotionValue(0)
  const maxDrag = 180 // max drag distance in px

  // Parchment opening progress: 0 (closed) → 1 (fully open)
  const parchmentProgress = useMotionValue(0)

  // Parchment height animated from closed to open
  const heightStr = useTransform(parchmentProgress, [0, 1], ['8vh', '75vh'])

  // Roller rotations for realistic feel
  const bgPosYTop = useTransform(parchmentProgress, [0, 1], ['0%', '-120%'])
  const bgPosYBottom = useTransform(parchmentProgress, [0, 1], ['0%', '120%'])

  // Reset when section leaves viewport and comes back
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Entering viewport - reset state for fresh interaction
          setIsRevealed(false)
          setHasBeenInView(true)
          dragY.set(0)
          parchmentProgress.set(0)
        }
      },
      { threshold: 0.15 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [dragY, parchmentProgress])

  // Handle drag end — snap open if dragged past threshold, else snap back
  const handleDragEnd = useCallback(() => {
    const currentVal = dragY.get()
    if (currentVal > maxDrag * 0.4) {
      // Threshold reached: animate thread hiding upwards, then open parchment
      animate(dragY, -300, {
        duration: 0.6,
        ease: 'easeIn'
      }).then(() => {
        setIsRevealed(true)
        animate(parchmentProgress, 1, {
          type: 'spring',
          stiffness: 80,
          damping: 20
        })
      })
    } else {
      // Snap back to closed
      animate(dragY, 0, {
        type: 'spring',
        stiffness: 200,
        damping: 25
      })
    }
  }, [dragY, maxDrag, parchmentProgress])

  // SVG ornamental corner flourish
  const CornerFlourish = ({ rotation = 0, position }) => (
    <div
      className="absolute pointer-events-none z-10"
      style={{
        ...position,
        transform: `rotate(${rotation}deg)`,
        width: '48px',
        height: '48px',
      }}
    >
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M4 4C4 4 12 4 18 8C24 12 28 20 30 28C32 20 36 12 42 8C48 4 56 4 56 4"
          stroke="#B58A45" strokeWidth="1" strokeLinecap="round" opacity="0.6" fill="none" />
        <path d="M4 4C4 4 8 12 8 20C8 28 6 36 4 44"
          stroke="#B58A45" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#B58A45" opacity="0.5" />
        <circle cx="18" cy="10" r="1.2" fill="#B58A45" opacity="0.35" />
        <path d="M6 6C10 6 14 8 16 12" stroke="#B58A45" strokeWidth="0.6" opacity="0.3" fill="none" />
        <path d="M8 8Q14 6 16 14Q10 12 8 8Z" fill="#B58A45" opacity="0.12" />
        <path d="M10 4Q16 2 20 8Q14 10 10 4Z" fill="#B58A45" opacity="0.1" />
      </svg>
    </div>
  )

  // Center ornament for top/bottom borders
  const CenterOrnament = ({ flip = false }) => (
    <svg viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-[100px] h-[20px]"
      style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
    >
      <circle cx="60" cy="12" r="6" stroke="#B58A45" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="60" cy="12" r="3" stroke="#B58A45" strokeWidth="0.6" fill="none" opacity="0.4" />
      <circle cx="60" cy="12" r="1.2" fill="#B58A45" opacity="0.45" />
      <path d="M54 12C50 8 42 6 34 8C38 10 42 14 46 12C44 16 38 18 32 16"
        stroke="#B58A45" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M40 9C38 7 34 6 30 7" stroke="#B58A45" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M24 12L16 12" stroke="#B58A45" strokeWidth="0.5" fill="none" opacity="0.25" />
      <circle cx="30" cy="10" r="1" fill="#B58A45" opacity="0.3" />
      <circle cx="22" cy="12" r="0.8" fill="#B58A45" opacity="0.25" />
      <path d="M66 12C70 8 78 6 86 8C82 10 78 14 74 12C76 16 82 18 88 16"
        stroke="#B58A45" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M80 9C82 7 86 6 90 7" stroke="#B58A45" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M96 12L104 12" stroke="#B58A45" strokeWidth="0.5" fill="none" opacity="0.25" />
      <circle cx="90" cy="10" r="1" fill="#B58A45" opacity="0.3" />
      <circle cx="98" cy="12" r="0.8" fill="#B58A45" opacity="0.25" />
    </svg>
  )

  return (
    <div ref={containerRef} className="relative w-full min-h-[115vh] z-20">
      <div className="sticky top-0 left-0 w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden pointer-events-none">

        {/* ═══ Decorative Thread hanging from the top ═══ */}
        {!isRevealed && (
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-50 touch-none pt-2 sm:pt-4"
            style={{ y: dragY }}
            drag="y"
            dragConstraints={{ top: 0, bottom: maxDrag }}
            dragElastic={0} // Strict drag limit
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top center' }}
              className="flex flex-col items-center cursor-grab active:cursor-grabbing"
            >
              {/* Thread line connecting to the top (Extends off-screen but shorter) */}
              <div
                className="w-[3px] sm:w-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-10"
                style={{
                  height: '400px', // Reduced height for shorter thread
                  marginTop: '-360px', // Leaves 40px visible
                  background: 'repeating-linear-gradient(45deg, #C8195E, #C8195E 4px, #8B1848 4px, #8B1848 8px)',
                  borderRadius: '999px',
                }}
              />

              {/* Removed the large floral tassel ornament as per user request to keep only the arrow indication */}

              {/* Simple arrow indicator with circular highlight */}
              <motion.div
                className="mt-2 flex items-center justify-center z-10 cursor-grab bg-[#FAF3E4]/95 backdrop-blur-md w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(200,25,94,0.4)] relative"
                animate={{ opacity: [0.8, 1, 0.8], y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ border: '2px solid rgba(200,25,94,0.6)' }}
              >
                {/* Thin inner gold ring for elegance */}
                <div className="absolute inset-[3px] rounded-full border border-[#d4af37]/60 pointer-events-none" />
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 mt-0.5" stroke="#C8195E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* ═══ Parchment Container ═══ */}
        <div className="relative w-[90%] max-w-[440px] flex flex-col items-center justify-center pointer-events-auto">

          {/* ═══ Top Roller ═══ */}
          <motion.div
            className="relative w-[106%] h-[28px] shrink-0 z-30 shadow-[0_15px_25px_rgba(74,40,16,0.4)] rounded-full"
            style={{
              background: 'linear-gradient(to bottom, #724e1d 0%, #d4b581 20%, #f5e7d3 50%, #b6985a 80%, #573a14 100%)',
              backgroundSize: '100% 200%',
              backgroundPositionY: bgPosYTop,
            }}
          >
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-[36px] rounded-l-md shadow-md" style={{ background: 'linear-gradient(to bottom, #724e1d, #d4af37, #573a14)' }} />
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-[20px] rounded-l-full shadow-md" style={{ background: 'linear-gradient(to bottom, #573a14, #d4af37, #3d280d)' }} />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-[36px] rounded-r-md shadow-md" style={{ background: 'linear-gradient(to bottom, #724e1d, #d4af37, #573a14)' }} />
            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-3 h-[20px] rounded-r-full shadow-md" style={{ background: 'linear-gradient(to bottom, #573a14, #d4af37, #3d280d)' }} />
          </motion.div>

          {/* ═══ Parchment Sheet ═══ */}
          <motion.div
            className="relative w-full flex flex-col items-center overflow-hidden"
            style={{
              height: heightStr,
              background: '#FDF8EF',
              boxShadow: 'inset 0 0 40px rgba(138,100,39,0.15), 0 20px 40px rgba(0,0,0,0.15)',
              borderLeft: '1px solid rgba(181, 138, 69, 0.3)',
              borderRight: '1px solid rgba(181, 138, 69, 0.3)',
              transformOrigin: 'top center',
            }}
          >
            {/* Parchment texture overlay - made more grainy (opacity 0.35) */}
            <div
              className="absolute inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              }}
            />
            {/* Side edge shading */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(138,100,39,0.15) 0%, transparent 6%, transparent 94%, rgba(138,100,39,0.15) 100%)' }} />
            <div className="absolute top-0 left-0 w-full h-8 opacity-60 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 w-full h-8 opacity-60 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.1) 0%, transparent 100%)' }} />

            {/* ═══ Inner Content Area ═══ */}
            <div className="absolute top-0 left-0 w-full h-[75vh] p-5 sm:p-8 pointer-events-auto flex flex-col items-center justify-center">
              {/* ─── Grand Ornamental Border ─── */}
              <div className="w-full h-full relative p-4 flex flex-col items-center justify-center text-center"
                style={{
                  border: '1px solid rgba(181,138,69,0.45)',
                }}
              >
                {/* Double outer border */}
                <div className="absolute -inset-[5px] pointer-events-none"
                  style={{
                    border: '1px solid rgba(181,138,69,0.2)',
                  }}
                />
                {/* Triple border — outermost whisper */}
                <div className="absolute -inset-[9px] pointer-events-none"
                  style={{
                    border: '0.5px solid rgba(181,138,69,0.1)',
                  }}
                />

                {/* Decorative dot line — inner border detail */}
                <div className="absolute inset-[3px] pointer-events-none"
                  style={{
                    border: '1px dotted rgba(181,138,69,0.2)',
                  }}
                />

                {/* Corner Flourishes — all four corners */}
                <CornerFlourish rotation={0} position={{ top: '-6px', left: '-6px' }} />
                <CornerFlourish rotation={90} position={{ top: '-6px', right: '-6px' }} />
                <CornerFlourish rotation={270} position={{ bottom: '-6px', left: '-6px' }} />
                <CornerFlourish rotation={180} position={{ bottom: '-6px', right: '-6px' }} />

                {/* Top center ornament */}
                <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 pointer-events-none">
                  <CenterOrnament />
                </div>
                {/* Bottom center ornament */}
                <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 pointer-events-none">
                  <CenterOrnament flip />
                </div>

                {/* Side ornamental details — left */}
                <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg viewBox="0 0 8 60" fill="none" className="w-[6px] h-[50px]">
                    <circle cx="4" cy="10" r="1.5" fill="#B58A45" opacity="0.25" />
                    <circle cx="4" cy="30" r="2" fill="#B58A45" opacity="0.3" />
                    <circle cx="4" cy="50" r="1.5" fill="#B58A45" opacity="0.25" />
                    <path d="M4 14V26" stroke="#B58A45" strokeWidth="0.4" opacity="0.2" />
                    <path d="M4 34V46" stroke="#B58A45" strokeWidth="0.4" opacity="0.2" />
                  </svg>
                </div>
                {/* Side ornamental details — right */}
                <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg viewBox="0 0 8 60" fill="none" className="w-[6px] h-[50px]">
                    <circle cx="4" cy="10" r="1.5" fill="#B58A45" opacity="0.25" />
                    <circle cx="4" cy="30" r="2" fill="#B58A45" opacity="0.3" />
                    <circle cx="4" cy="50" r="1.5" fill="#B58A45" opacity="0.25" />
                    <path d="M4 14V26" stroke="#B58A45" strokeWidth="0.4" opacity="0.2" />
                    <path d="M4 34V46" stroke="#B58A45" strokeWidth="0.4" opacity="0.2" />
                  </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ═══ Bottom Roller ═══ */}
          <motion.div
            className="relative w-[106%] h-[28px] shrink-0 z-30 shadow-[0_15px_30px_rgba(74,40,16,0.4)] rounded-full -mt-[1px]"
            style={{
              background: 'linear-gradient(to top, #724e1d 0%, #d4b581 20%, #f5e7d3 50%, #b6985a 80%, #573a14 100%)',
              backgroundSize: '100% 200%',
              backgroundPositionY: bgPosYBottom,
            }}
          >
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-[36px] rounded-l-md shadow-md" style={{ background: 'linear-gradient(to bottom, #724e1d, #d4af37, #573a14)' }} />
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-[20px] rounded-l-full shadow-md" style={{ background: 'linear-gradient(to bottom, #573a14, #d4af37, #3d280d)' }} />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-[36px] rounded-r-md shadow-md" style={{ background: 'linear-gradient(to bottom, #724e1d, #d4af37, #573a14)' }} />
            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-3 h-[20px] rounded-r-full shadow-md" style={{ background: 'linear-gradient(to bottom, #573a14, #d4af37, #3d280d)' }} />
          </motion.div>

        </div>
      </div>
    </div>
  )
}
