import React from 'react'
import { motion } from 'framer-motion'

const heroBg = "/assets/templates/royal-heritage/hero-mobile.webp"

// Line animation for text
const lineAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: "easeOut" } 
  },
}

// Letter animation for couple name
const letterContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
}

const letterAnim = {
  hidden: { opacity: 0, y: 20, rotateX: 90 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] } 
  },
}

const sectionAnim = {
  hidden: { },
  visible: { 
    transition: { staggerChildren: 0.3 } 
  }
}

// Letter-by-Letter Couple Name with glassy glare sweep
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
    <div className="relative inline-flex items-center justify-center select-none overflow-visible px-2 my-0">
      <motion.span variants={variants} className="relative z-10 flex items-center justify-center overflow-visible">
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
            backgroundPosition: {
              repeat: Infinity, 
              duration: 4.5, 
              ease: 'easeInOut', 
              repeatDelay: 2.0 
            }
          }}
          aria-hidden="true"
          style={{
            ...style,
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
            background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.85) 47%, rgba(255,200,200,0.95) 50%, rgba(255,255,255,0.85) 53%, transparent 75%)',
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

const petalConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0
  const leftPos = isLeft ? Math.random() * 15 : 85 + Math.random() * 15
  const duration = 8 + Math.random() * 8
  const delay = Math.random() * 6
  const size = 12 + Math.random() * 10
  const xDrift = (isLeft ? 1 : -1) * (10 + Math.random() * 10)
  return { left: leftPos, duration, delay, size, xDrift }
})

const FallingRoyalFlowers = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden w-full h-full">
      {petalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute -top-8"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size * 1.35,
            opacity: 0.85,
          }}
          initial={{ y: '-10vh', opacity: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.xDrift, p.xDrift * 0.4, p.xDrift],
            rotate: [0, 360],
            opacity: [0, 0.9, 0.9, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 24 32" width="100%" height="100%" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(138,32,42,0.3))' }}>
            <path
              d="M12 2 C6 7, 3 17, 12 30 C21 17, 18 7, 12 2 Z"
              fill="#B22222"
              fillOpacity="0.85"
              stroke="#8A202A"
              strokeWidth="0.7"
            />
            <path
              d="M12 4 C11 11, 10 19, 12 28"
              stroke="#8A202A"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path d="M12 11 Q8 14 6 17" stroke="#8A202A" strokeWidth="0.45" strokeLinecap="round" opacity="0.6" />
            <path d="M12 16 Q16 19 18 22" stroke="#8A202A" strokeWidth="0.45" strokeLinecap="round" opacity="0.6" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

export default function TemplateRoyalHeritageHero({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet }) {
  const { cursive, serif, smallCaps } = fontStyles;

  const dateObj = new Date(`${data.hero.weddingMonth || 'January'} ${data.hero.weddingDate || '14'}, ${data.hero.weddingYear || '2024'}`);
  let dayStr = 'SATURDAY';
  let monthStr = 'JANUARY';
  if (!isNaN(dateObj.getTime())) {
    dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    monthStr = dateObj.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  }
  
  const nameSize = isDesktop ? '70px' : (isTablet ? '80px' : '55px');

  return (
    <section style={sectionStyle}>
      <img src={heroBg} alt="Hero Background" style={bgStyle} />
      <FallingRoyalFlowers />
      
      <motion.div 
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 20px', paddingTop: '8vh' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        variants={sectionAnim}
      >
        
        {/* Intro text */}
        <motion.div variants={lineAnim} style={{ textAlign: 'center', marginBottom: '35px', marginTop: '-35px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', color: '#8A202A' }}>WEDDING</span>
          <span style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', color: '#8A202A' }}>INVITATION</span>
        </motion.div>

        {/* Names */}
        <AnimatedCoupleName name={data.hero.groomName} style={{ ...cursive, fontSize: nameSize }} variants={letterContainer} />
        
        <motion.div variants={lineAnim} style={{ margin: '2px 0' }}>
          <span style={{ ...cursive, fontSize: '30px', color: '#8A202A' }}>&amp;</span>
        </motion.div>
        
        <AnimatedCoupleName name={data.hero.brideName} style={{ ...cursive, fontSize: nameSize, marginBottom: '12px' }} variants={letterContainer} />

        <motion.div variants={lineAnim} style={{ textAlign: 'center', marginBottom: '15px', maxWidth: '240px' }}>
          <p style={{ ...smallCaps, fontSize: '8.5px', letterSpacing: '0.18em', lineHeight: '1.5', color: '#4A3E20' }}>
            TOGETHER WITH THEIR FAMILIES INVITE YOU TO THEIR WEDDING CELEBRATION
          </p>
        </motion.div>

        {/* Date Block */}
        <motion.div variants={lineAnim} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px',
          width: '100%',
          maxWidth: '280px',
        }}>
          <span style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', fontWeight: 'bold', color: '#8A202A' }}>
            {monthStr}
          </span>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: '8px 0' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: '1px', width: '90%', backgroundColor: '#4A3E20', opacity: 0.5, marginBottom: '6px' }} />
              <span style={{ ...smallCaps, fontSize: '8.5px', letterSpacing: '0.15em', color: '#4A3E20' }}>{dayStr}</span>
              <div style={{ height: '1px', width: '90%', backgroundColor: '#4A3E20', opacity: 0.5, marginTop: '6px' }} />
            </div>
            
            <div style={{ padding: '0 15px' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', 'Cinzel', serif", fontSize: '38px', fontWeight: 'bold', color: '#8A202A', lineHeight: 1 }}>
                {data.hero.weddingDate || '14'}
              </span>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: '1px', width: '90%', backgroundColor: '#4A3E20', opacity: 0.5, marginBottom: '6px' }} />
              <span style={{ ...smallCaps, fontSize: '8.5px', letterSpacing: '0.12em', whiteSpace: 'nowrap', color: '#4A3E20' }}>{data.hero.weddingTime?.split('-')[0].trim() || '1:00 PM'}</span>
              <div style={{ height: '1px', width: '90%', backgroundColor: '#4A3E20', opacity: 0.5, marginTop: '6px' }} />
            </div>
          </div>

          <span style={{ ...smallCaps, fontSize: '11px', letterSpacing: '0.25em', fontWeight: 'bold', color: '#8A202A' }}>
            {data.hero.weddingYear || '2024'}
          </span>
        </motion.div>

        {/* Venue Location Full */}
        <motion.div variants={lineAnim} style={{ paddingBottom: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '4px' }}>
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#8A202A"/>
          </svg>
          <span style={{ ...smallCaps, fontSize: '10px', fontWeight: 'bold', color: '#8A202A', marginBottom: '2px', letterSpacing: '0.15em' }}>
            {data.hero.mahalName}
          </span>
          <p style={{ ...smallCaps, fontSize: '8px', color: '#4A3E20', letterSpacing: '0.15em', lineHeight: '1.5', maxWidth: '240px', opacity: 0.9 }}>
            {data.venue?.venueAddress}, {data.venue?.venueCity}, {data.venue?.state}
          </p>
        </motion.div>

        <motion.div variants={lineAnim}>
          <span style={{ ...cursive, fontSize: '24px', color: '#8A202A' }}>
            #{data.hero.groomName}{data.hero.brideName}
          </span>
        </motion.div>

      </motion.div>
    </section>
  )
}
