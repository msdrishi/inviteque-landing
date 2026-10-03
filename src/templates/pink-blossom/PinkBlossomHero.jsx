import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, ASSETS } from './theme'

// ─── Animation Variants ───────────────────────────────────────
const lineAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
}

const letterContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
}

const letterAnim = {
  hidden: { opacity: 0, y: 20, rotateX: 90 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] } },
}

const sectionAnim = {
  hidden: { },
  visible: { transition: { staggerChildren: 0.4, delayChildren: 2.0 } }
}

// ─── Letter-by-Letter Couple Name with glassy glare sweep ─────
const AnimatedCoupleName = ({ name, style, variants }) => {
  const letters = Array.from(String(name || ''))
  const [showGlare, setShowGlare] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowGlare(true)
    }, (0.3 + letters.length * 0.1 + 1.2) * 1000)
    return () => clearTimeout(timer)
  }, [letters.length])

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

      {showGlare && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            backgroundPosition: ['200% center', '-200% center'] 
          }}
          transition={{ 
            opacity: { duration: 1.0 },
            backgroundPosition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', repeatDelay: 2.0 }
          }}
          aria-hidden="true"
          style={{
            ...style,
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 20,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            overflow: 'visible',
            width: '100%',
            background: `linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.85) 47%, rgba(255,200,220,0.95) 50%, rgba(255,255,255,0.85) 53%, transparent 75%)`,
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {name}
        </motion.span>
      )}
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
        className="absolute -top-8"
        style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.35, opacity: 0.85 }}
        initial={{ y: '-10vh', opacity: 0 }}
        animate={{
          y: ['0vh', '110vh'],
          x: [0, p.xDrift, p.xDrift * 0.4, p.xDrift],
          rotate: [0, 360],
          opacity: [0, 0.9, 0.9, 0.5, 0],
        }}
        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 24 32" width="100%" height="100%" fill="none" style={{ filter: `drop-shadow(0 2px 4px rgba(200,25,94,0.3))` }}>
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
  const groomName = data.hero.groomName || '';
  const brideName = data.hero.brideName || '';
  const groomScale = Math.min(1, 10 / Math.max(1, groomName.length));
  const brideScale = Math.min(1, 10 / Math.max(1, brideName.length));
  
  const groomNameSize = isDesktop ? `calc(60px * ${groomScale})` : (isTablet ? `calc(70px * ${groomScale})` : `calc(48px * ${groomScale})`)
  const brideNameSize = isDesktop ? `calc(60px * ${brideScale})` : (isTablet ? `calc(70px * ${brideScale})` : `calc(48px * ${brideScale})`)

  return (
    <section style={sectionStyle}>
      <motion.img 
        src={ASSETS.heroBg} 
        alt="Hero Background" 
        style={bgStyle} 
        initial={{ opacity: 0 }}
        animate={hasTriggeredHeroText ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      <FallingPinkPetals />
      
      <motion.div 
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 20px', paddingTop: '8vh' }}
        initial="hidden"
        animate={hasTriggeredHeroText ? "visible" : "hidden"}
        viewport={{ amount: 0.3 }}
        variants={sectionAnim}
      >
        
        {/* Intro text */}
        <motion.div variants={lineAnim} style={{ textAlign: 'center', marginBottom: '15px', marginTop: '-35px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', color: COLORS.textDark }}>TOGETHER</span>
          <span style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', color: COLORS.textDark }}>WITH OUR FAMILIES</span>
        </motion.div>

        {/* Names */}
        <AnimatedCoupleName name={groomName} style={{ ...cursive, fontSize: groomNameSize }} variants={letterContainer} />
        
        <motion.div variants={lineAnim} style={{ margin: '2px 0' }}>
          <span style={{ ...cursive, fontSize: '30px', color: COLORS.gold }}>&amp;</span>
        </motion.div>
        
        <AnimatedCoupleName name={brideName} style={{ ...cursive, fontSize: brideNameSize, marginBottom: '5px' }} variants={letterContainer} />

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

      </motion.div>
    </section>
  )
}
