import React, { useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { COLORS, FONTS, CovenantCrossDivider, slowLineAnim, slowContainerAnim } from './theme'

export default function EternalCovenantWelcome({ data }) {
  const hostText = data?.hostText || 'Along with their families'
  const bride = data?.brideName || 'SHREYA'
  const groom = data?.groomName || 'SUMIT'
  const message = data?.welcomeMessage ||
    'Request the honour of your presence and blessings as they exchange sacred vows of holy matrimony and enter into God’s eternal covenant of love, faith, and grace.'

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = React.useRef(null)
  const inView = useInView(containerRef, { once: false, amount: 0.35 })

  // Trigger high-end envelope opening sequence once scrolled into view
  React.useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(false)
    }
  }, [inView])

  return (
    <section
      ref={containerRef}
      className="w-full min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden py-16 px-4"
      style={{
        backgroundColor: COLORS.bgWhite,
        color: COLORS.darkText,
      }}
    >
      {/* Background Architectural & Cathedral Sketch Elements in Theme Green */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 400 700" className="w-full h-full object-cover" fill="none" stroke="#2D5A27">
          <circle cx="200" cy="350" r="160" strokeWidth="1" strokeDasharray="6,4" />
          <circle cx="200" cy="350" r="140" strokeWidth="0.8" />
          <path d="M50 350 L350 350 M200 200 L200 500" strokeWidth="0.8" strokeDasharray="4,4" />
          <path d="M120 270 C160 220 240 220 280 270" strokeWidth="1.2" />
        </svg>
      </div>

      <motion.div
        variants={slowContainerAnim}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        className="relative z-10 w-full max-w-sm px-4 text-center flex flex-col items-center my-auto"
      >
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            fontWeight: 700,
            marginBottom: '6px',
          }}
        >
          Solemn Invitation
        </motion.p>

        <motion.h2
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.heading,
            fontSize: '26px',
            color: COLORS.primary,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          {hostText}
        </motion.h2>

        <motion.div variants={slowLineAnim} className="mb-6">
          <CovenantCrossDivider color={COLORS.gold} width={130} />
        </motion.div>

        {/* ── HIGH-END GRAPHIC DESIGNER LEVEL 3D ENVELOPE UNPACKING FLOW ── */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full max-w-[330px] cursor-pointer mx-auto flex flex-col items-center select-none"
          style={{
            perspective: 1200,
            paddingTop: '110px',
            paddingBottom: '30px',
          }}
        >
          {/* ENVELOPE BACK INTERIOR LINING (Gold embossed cathedral interior) */}
          <div
            className="absolute top-28 left-0 right-0 h-44 rounded-t-lg pointer-events-none z-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, #2A5424 0%, #1E3F1A 100%)',
              border: '1px solid rgba(184, 142, 62, 0.4)',
              borderBottom: 'none',
              boxShadow: 'inset 0 10px 25px rgba(0,0,0,0.3)',
            }}
          />

          {/* TOP FOLDING TRIANGULAR FLAP (3D Flips upwards at 180deg) */}
          <motion.div
            initial={false}
            animate={{
              rotateX: isOpen ? 180 : 0,
              zIndex: isOpen ? 5 : 25,
            }}
            transition={{
              duration: 0.9,
              ease: [0.33, 1, 0.68, 1],
            }}
            style={{
              position: 'absolute',
              top: '112px',
              left: 0,
              right: 0,
              height: '85px',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Front of Flap with Gold Wax Seal (when closed) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                filter: 'drop-shadow(0px 6px 12px rgba(0,0,0,0.3))',
              }}
            >
              <svg viewBox="0 0 330 85" className="w-full h-full" preserveAspectRatio="none">
                <polygon points="0,0 330,0 165,85" fill="#2D5A27" stroke="#B88E3E" strokeWidth="1" />
              </svg>
              {/* Wax Seal Medallion */}
              <div
                className="absolute left-1/2 bottom-[-16px] -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#B88E3E',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
                  border: '1px solid #FDF5E6',
                }}
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#FFFFFF" strokeWidth="2.2">
                  <path d="M12 2v20M7 8h10" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Backside of Flap (visible when flipped open) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateX(180deg)',
              }}
            >
              <svg viewBox="0 0 330 85" className="w-full h-full" preserveAspectRatio="none">
                <polygon points="0,0 330,0 165,85" fill="#244B20" stroke="#B88E3E" strokeWidth="0.8" />
              </svg>
            </div>
          </motion.div>

          {/* THE LUXURY INVITATION CARD (Glides out gracefully and levitates above) */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? {
                    y: -95,
                    scale: 1.03,
                    opacity: 1,
                    rotateX: 0,
                    zIndex: 15,
                  }
                : {
                    y: 20,
                    scale: 0.94,
                    opacity: 0.8,
                    rotateX: 4,
                    zIndex: 5,
                  }
            }
            transition={{
              duration: 1.25,
              delay: isOpen ? 0.35 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-[90%] p-5 rounded-md relative"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.2px solid #B88E3E',
              boxShadow: isOpen
                ? '0 20px 45px rgba(45, 90, 39, 0.22), 0 4px 14px rgba(184, 142, 62, 0.3)'
                : '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {/* Fine Inner Liturgical Border */}
            <div
              className="p-4 flex flex-col items-center text-center rounded-[2px]"
              style={{
                border: '0.8px solid rgba(184, 142, 62, 0.4)',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF9F5 100%)',
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.label,
                  fontSize: '9.5px',
                  letterSpacing: '0.24em',
                  color: COLORS.secondary,
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                HOLY MATRIMONY
              </span>

              <p
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '14.5px',
                  lineHeight: 1.75,
                  color: COLORS.darkText,
                }}
              >
                {message}
              </p>

              <div className="w-14 h-[1px] bg-[#B88E3E] opacity-60 my-3" />

              <p
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: '16px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: COLORS.primary,
                  fontWeight: 700,
                }}
              >
                {bride} &amp; {groom}
              </p>
            </div>
          </motion.div>

          {/* FRONT ENVELOPE POCKET (Stays in front of card) */}
          <div
            className="relative w-full h-36 rounded-b-lg overflow-hidden pointer-events-none z-20"
            style={{
              marginTop: '-110px',
              backgroundColor: '#2D5A27',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)',
              borderBottom: '1px solid #B88E3E',
            }}
          >
            {/* Crisp Graphic Shading */}
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 330 144"
            >
              {/* Left flap */}
              <polygon points="0,0 165,95 0,144" fill="rgba(35, 72, 30, 0.98)" stroke="rgba(184,142,62,0.4)" strokeWidth="0.8" />
              {/* Right flap */}
              <polygon points="330,0 165,95 330,144" fill="rgba(30, 65, 26, 0.98)" stroke="rgba(184,142,62,0.4)" strokeWidth="0.8" />
              {/* Bottom fold */}
              <polygon points="0,144 165,75 330,144" fill="#2D5A27" stroke="#B88E3E" strokeWidth="1" />
            </svg>

            {/* Embossed gold cross on bottom center of pouch */}
            <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex items-center justify-center opacity-85">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#EBDCB9" strokeWidth="1.5">
                <path d="M12 2v20M7 8h10" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <span
            style={{
              fontFamily: FONTS.label,
              fontSize: '9.5px',
              letterSpacing: '0.2em',
              color: COLORS.secondary,
              marginTop: '16px',
              fontWeight: 600,
            }}
          >
            {isOpen ? 'TAP TO TUCK' : 'TAP TO READ INVITATION'}
          </span>
        </div>
      </motion.div>
    </section>
  )
}
