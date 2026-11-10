import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, ASSETS } from '../../../../templates/pink-blossom/theme'
import ScrollDownIndicator from '../../../../templates/pink-blossom/ScrollDownIndicator'

const lineAnim = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 2.0, ease: [0.22, 1, 0.36, 1] } },
}

const letterContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
}

const letterAnim = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } },
}

const sectionAnim = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.4 } }
}

const AnimatedCoupleName = ({ name, style, variants }) => {
  const letters = Array.from(String(name || ''))

  return (
    <div className="relative inline-flex items-center justify-center select-none overflow-visible px-4 my-0 w-full flex-wrap text-center">
      <motion.span variants={variants} className="relative z-10 flex items-center justify-center overflow-visible flex-wrap text-center" style={{ width: '100%' }}>
        {letters.map((char, i) => (
          <motion.span
            key={i}
            variants={letterAnim}
            style={{
              ...style,
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              textShadow: '0 1px 2px rgba(255,255,255,0.4)',
              overflow: 'visible'
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </div>
  )
}

const petalConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0
  const leftPos = isLeft ? Math.random() * 15 : 85 + Math.random() * 15
  const duration = 8 + Math.random() * 8
  const delay = Math.random() * 6
  const size = 12 + Math.random() * 10
  const xDrift = (isLeft ? 1 : -1) * (10 + Math.random() * 10)
  return { left: leftPos, duration, delay, size, xDrift }
})

const FallingPinkPetals = () => (
  <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden w-full h-full">
    {petalConfig.map((p, i) => (
      <motion.div
        key={i}
        className="absolute -top-8 pointer-events-none"
        style={{
          left: `${p.left}%`,
          width: p.size,
          height: p.size * 1.35,
          opacity: 0.85,
          willChange: 'transform'
        }}
        initial={{ y: '-10vh', opacity: 0 }}
        animate={{
          y: ['0vh', '110vh'],
          x: [0, p.xDrift, 0],
          rotate: [0, p.xDrift > 0 ? 180 : -180],
          opacity: [0, 0.85, 0.85, 0]
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <svg viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <path
            d="M10 0 C16 6 20 14 18 22 C16 28 10 28 8 28 C2 28 0 22 2 14 C4 6 8 0 10 0 Z"
            fill="#E05283"
            opacity="0.75"
          />
          <path
            d="M10 2 C14 8 16 14 15 20 C14 24 10 25 9 25 C5 25 4 20 5 14 C6 8 9 2 10 2 Z"
            fill="#F48FB1"
            opacity="0.9"
          />
        </svg>
      </motion.div>
    ))}
  </div>
)

const FloralGoldDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '180px', margin: '14px auto' }}>
    <div style={{ flex: 1, height: '0.8px', background: '#B8963E', opacity: 0.6 }} />
    <svg viewBox="0 0 24 24" width={18} height={18} fill="#B8963E">
      <circle cx="12" cy="7" r="2.2" />
      <circle cx="12" cy="17" r="2.2" />
      <circle cx="7" cy="12" r="2.2" />
      <circle cx="17" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="1.3" fill="#FAF3E4" />
    </svg>
    <div style={{ flex: 1, height: '0.8px', background: '#B8963E', opacity: 0.6 }} />
  </div>
)

export default function AlinaAndTanmayHero({
  isDesktop = false,
  isTablet = false,
  hasTriggeredHeroText = true,
}) {
  const firstName = 'Alina'
  const secondName = 'Tanmay'

  const firstNameSize = isDesktop ? '76px' : (isTablet ? '84px' : '62px')
  const secondNameSize = isDesktop ? '76px' : (isTablet ? '84px' : '62px')

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isDesktop ? '100vh' : '100svh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.ivory,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <img
          src={ASSETS.heroBg}
          alt="Hero Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            transform: 'scale(1.15)',
            display: 'block',
          }}
          loading="eager"
        />
      </div>

      <FallingPinkPetals />

      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '0 20px',
          paddingTop: '2vh',
          pointerEvents: 'auto'
        }}
        initial="hidden"
        animate={hasTriggeredHeroText ? "visible" : "hidden"}
        variants={sectionAnim}
      >
        {/* Intro text: "TOGETHER WITH LOVE" */}
        <motion.div variants={lineAnim} style={{ textAlign: 'center', marginBottom: '4px', marginTop: '-35px' }}>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '11px',
              letterSpacing: '0.28em',
              color: '#8C6D37',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            TOGETHER WITH LOVE
          </span>
        </motion.div>

        {/* Top Gold Floral Divider */}
        <motion.div variants={lineAnim}>
          <FloralGoldDivider />
        </motion.div>

        {/* Subtitle invitation line */}
        <motion.div variants={lineAnim} style={{ textAlign: 'center', marginBottom: '16px', maxWidth: '300px' }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: '#8C6D37',
              lineHeight: 1.7,
              margin: 0,
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            WE CORDIALLY INVITE YOU<br />
            TO THE WEDDING CELEBRATION OF
          </p>
        </motion.div>

        {/* Couple Names in elegant hot pink script */}
        <AnimatedCoupleName
          name={firstName}
          style={{
            fontFamily: "'Modernline', 'Allura', cursive",
            fontSize: firstNameSize,
            color: '#C8195E',
            lineHeight: 1.15,
          }}
          variants={letterContainer}
        />

        <motion.div variants={lineAnim} style={{ margin: '-2px 0 2px 0' }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '26px',
              color: '#B8963E',
            }}
          >
            &amp;
          </span>
        </motion.div>

        <AnimatedCoupleName
          name={secondName}
          style={{
            fontFamily: "'Modernline', 'Allura', cursive",
            fontSize: secondNameSize,
            color: '#C8195E',
            lineHeight: 1.15,
            marginBottom: '4px',
          }}
          variants={letterContainer}
        />

        {/* Bottom Gold Floral Divider matching artwork */}
        <motion.div variants={lineAnim}>
          <FloralGoldDivider />
        </motion.div>
      </motion.div>

      <ScrollDownIndicator />
    </section>
  )
}

