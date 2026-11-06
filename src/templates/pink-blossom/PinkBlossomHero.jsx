import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, ASSETS } from './theme'
import ScrollDownIndicator from './ScrollDownIndicator'

// ─── Animation Variants ───────────────────────────────────────
const lineAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const letterContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } }
}

const letterAnim = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
}

const sectionAnim = {
  hidden: { },
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
}

// ─── Letter-by-Letter Couple Name ─────────────────────────────
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

// ─── Falling Flower Petals (Pink Lotus petals) ────────────────
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
          x: [0, p.xDrift, p.xDrift * 0.4, p.xDrift],
          rotate: [0, 360],
          opacity: [0, 0.9, 0.9, 0.5, 0],
        }}
        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 24 32" width="100%" height="100%" fill="none">
          <path
            d="M12 2 C6 7, 3 17, 12 30 C21 17, 18 7, 12 2 Z"
            fill={COLORS.primary}
            fillOpacity="0.75"
            stroke={COLORS.primaryDark}
            strokeWidth="0.7"
          />
          <path d="M12 4 C11 11, 10 19, 12 28" stroke={COLORS.primaryDark} strokeWidth="0.6" strokeLinecap="round" opacity="0.8" />
          <path d="M12 11 Q8 14 6 17" stroke={COLORS.primaryDark} strokeWidth="0.45" strokeLinecap="round" opacity="0.6" />
          <path d="M12 16 Q16 19 18 22" stroke={COLORS.primaryDark} strokeWidth="0.45" strokeLinecap="round" opacity="0.6" />
        </svg>
      </motion.div>
    ))}
  </div>
)

// ─── Hero Section ─────────────────────────────────────────────
export default function PinkBlossomHero({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet, hasTriggeredHeroText = true }) {
  const { cursive, serif, smallCaps } = fontStyles

  const dateObj = new Date(`${data.hero.weddingMonth || 'January'} ${data.hero.weddingDate || '14'}, ${data.hero.weddingYear || '2024'}`)
  let dayStr = 'SATURDAY'
  let monthStr = 'JANUARY'
  if (!isNaN(dateObj.getTime())) {
    dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    monthStr = dateObj.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
  }
  const isBrideFirst = data.hero.brideFirst || data.hero.reverseNames || false;
  const firstName = isBrideFirst ? (data.hero.brideName || '') : (data.hero.groomName || '');
  const secondName = isBrideFirst ? (data.hero.groomName || '') : (data.hero.brideName || '');

  const firstScale = (data.hero.coupleNameScale || 0.82) * Math.min(1, 10 / Math.max(1, firstName.length));
  const secondScale = (data.hero.coupleNameScale || 0.82) * Math.min(1, 10 / Math.max(1, secondName.length));
  
  const firstNameSize = isDesktop ? `calc(58px * ${firstScale})` : (isTablet ? `calc(66px * ${firstScale})` : `calc(46px * ${firstScale})`)
  const secondNameSize = isDesktop ? `calc(58px * ${secondScale})` : (isTablet ? `calc(66px * ${secondScale})` : `calc(46px * ${secondScale})`)
  const bgScale = data.hero.heroBgScale || 1.08

  return (
    <section 
      style={{
        ...sectionStyle,
        position: 'relative',
        width: '100%',
        minHeight: isDesktop ? '100vh' : '100svh',
        height: isDesktop ? '100vh' : '100svh',
        overflow: 'hidden',
        backgroundColor: COLORS.ivory,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {/* Background Image Container */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          willChange: 'opacity',
          transformOrigin: 'center center',
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0 }}
        animate={hasTriggeredHeroText ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      >
        <img 
          src={ASSETS.heroBg} 
          alt="Hero Background" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            transform: `scale(${bgScale})`,
            display: 'block',
          }}
          loading="eager"
        />
      </motion.div>

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
          paddingTop: '6vh',
          pointerEvents: 'auto'
        }}
        initial="hidden"
        animate={hasTriggeredHeroText ? "visible" : "hidden"}
        variants={sectionAnim}
      >
        
        {/* Intro text */}
        <motion.div variants={lineAnim} style={{ textAlign: 'center', marginBottom: data.hero.heroOnlyInvite ? '20px' : '15px', marginTop: '-35px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', color: COLORS.textDark, textWrap: 'balance' }}>
            {data.hero.heroIntroLine1 || 'TOGETHER WITH'}
          </span>
          <span style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', color: COLORS.textDark, textWrap: 'balance' }}>
            {data.hero.heroIntroLine2 || (data.hero.heroOnlyInvite ? 'LOVE' : 'OUR FAMILIES')}
          </span>
        </motion.div>

        {/* Names */}
        <AnimatedCoupleName name={firstName} style={{ ...cursive, fontSize: firstNameSize }} variants={letterContainer} />
        
        <motion.div variants={lineAnim} style={{ margin: '2px 0' }}>
          <span style={{ ...cursive, fontSize: '30px', color: COLORS.gold }}>&amp;</span>
        </motion.div>
        
        <AnimatedCoupleName name={secondName} style={{ ...cursive, fontSize: secondNameSize, marginBottom: '8px' }} variants={letterContainer} />

        {/* Hero-only-invite custom closing text or standard middle/date block */}
        {data.hero.heroOnlyInvite ? (
          <motion.div 
            variants={lineAnim} 
            style={{ 
              textAlign: 'center', 
              marginTop: '16px', 
              width: '80%', 
              maxWidth: '340px',
              padding: '0 8px'
            }}
          >
            <p style={{ 
              ...serif, 
              fontSize: '16px', 
              lineHeight: 1.6, 
              color: COLORS.textDark, 
              margin: 0,
              textWrap: 'balance',
              fontWeight: 500
            }}>
              invite you to celebrate the beginning of their forever.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Middle text */}
            <motion.div variants={lineAnim} style={{ textAlign: 'center', marginBottom: '10px', maxWidth: '240px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ ...smallCaps, fontSize: '10px', letterSpacing: '0.2em', color: COLORS.textDark, fontWeight: 'bold' }}>TWO HEARTS</span>
              <span style={{ ...smallCaps, fontSize: '10px', letterSpacing: '0.2em', color: COLORS.textDark, fontWeight: 'bold' }}>ONE BEAUTIFUL JOURNEY</span>
            </motion.div>

            {/* Decorative separator */}
            <motion.div variants={lineAnim} style={{ marginBottom: '10px' }}>
              <span style={{ color: COLORS.primary, fontSize: '16px' }}>♦</span>
            </motion.div>

            {/* Date Block */}
            <motion.div variants={lineAnim} style={{ textAlign: 'center', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', color: COLORS.textDark }}>
                {dayStr}
              </div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.15em', color: COLORS.primary }}>
                {data.hero.weddingDate || '22'} {monthStr} {data.hero.weddingYear || '2026'}
              </div>
              <div style={{ ...smallCaps, fontSize: '10px', letterSpacing: '0.2em', color: COLORS.textDark }}>
                AT {data.hero.weddingTime || '5:00 PM'} ONWARDS
              </div>
            </motion.div>

            {/* Decorative separator */}
            <motion.div variants={lineAnim} style={{ marginBottom: '10px' }}>
              <span style={{ color: COLORS.primary, fontSize: '16px' }}>♦</span>
            </motion.div>

            {/* Venue Location */}
            {(!data.hero.hideVenueLocation) && (
              <motion.div variants={lineAnim} style={{ paddingBottom: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ ...smallCaps, fontSize: '12px', fontWeight: 'bold', color: COLORS.primary, letterSpacing: '0.2em' }}>
                  {data.hero.mahalName}
                </span>
                <span style={{ ...smallCaps, fontSize: '10px', color: COLORS.textDark, letterSpacing: '0.2em', opacity: 0.9 }}>
                  {data.venue?.venueCity}
                </span>
              </motion.div>
            )}
          </>
        )}

      </motion.div>

      {/* Scroll Down Indicator */}
      <ScrollDownIndicator />
    </section>
  )
}
