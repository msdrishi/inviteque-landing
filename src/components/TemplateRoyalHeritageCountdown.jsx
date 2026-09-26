import React from 'react'
import { motion } from 'framer-motion'

const countdownBg = "/assets/templates/royal-heritage/countdown-mobile.webp"

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: "easeOut" } 
  },
}

const sectionAnim = {
  hidden: { },
  visible: { 
    transition: { staggerChildren: 0.3 } 
  }
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

export default function TemplateRoyalHeritageCountdown({ data, fontStyles, sectionStyle, bgStyle }) {
  const { cursive, serif, smallCaps } = fontStyles;

  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  React.useEffect(() => {
    const targetDate = new Date(data?.countdown?.targetDateTimeISO || "2026-11-28T09:00:00Z").getTime()
    
    const updateTimer = () => {
      const now = new Date().getTime()
      const diff = targetDate - now
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [data])

  return (
    <motion.section 
      style={{ ...sectionStyle, justifyContent: 'center' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionAnim}
    >
      <img src={countdownBg} alt="Countdown Background" style={bgStyle} />
      <FallingRoyalFlowers />
      <motion.div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '-15vh' }}>
        <motion.div variants={fadeAnim} style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ ...smallCaps, fontSize: '20px', letterSpacing: '0.25em', margin: 0, color: '#8A202A', lineHeight: 1.4 }}>
            THE COUNTDOWN
          </h2>
          <h2 style={{ ...smallCaps, fontSize: '20px', letterSpacing: '0.25em', margin: 0, color: '#8A202A', lineHeight: 1.4 }}>
            BEGINS
          </h2>
        </motion.div>
      <motion.div variants={fadeAnim} style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
         {[
           { label: 'DAYS', value: timeLeft.days }, 
           { label: 'HOURS', value: timeLeft.hours }, 
           { label: 'MINS', value: timeLeft.minutes }, 
           { label: 'SECS', value: timeLeft.seconds }
         ].map((item, idx) => (
           <div key={idx} style={{ textAlign: 'center', minWidth: '45px' }}>
             <div style={{ ...serif, fontSize: '38px', color: '#8A202A', fontWeight: 'bold', lineHeight: 1 }}>
               {String(item.value).padStart(2, '0')}
             </div>
             <div style={{ ...smallCaps, fontSize: '9px', marginTop: '10px', color: '#8A202A', letterSpacing: '0.15em', fontWeight: 'bold' }}>{item.label}</div>
           </div>
         ))}
      </motion.div>
      </motion.div>
    </motion.section>
  )
}
