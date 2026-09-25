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
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 1.5, staggerChildren: 0.3 } 
  }
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
      style={sectionStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={sectionAnim}
    >
      <img src={countdownBg} alt="Countdown Background" style={bgStyle} />
      <motion.h2 variants={fadeAnim} style={{ ...smallCaps, fontSize: '24px', marginBottom: '30px' }}>
        THE COUNTDOWN BEGINS
      </motion.h2>
      <motion.div variants={fadeAnim} style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
         {[
           { label: 'DAYS', value: timeLeft.days }, 
           { label: 'HOURS', value: timeLeft.hours }, 
           { label: 'MINS', value: timeLeft.minutes }, 
           { label: 'SECS', value: timeLeft.seconds }
         ].map((item, idx) => (
           <div key={idx} style={{ textAlign: 'center', width: '50px' }}>
             <div style={{ ...serif, fontSize: '32px', color: '#8A202A', fontWeight: 'bold', lineHeight: 1 }}>
               {String(item.value).padStart(2, '0')}
             </div>
             <div style={{ ...smallCaps, fontSize: '10px', marginTop: '5px' }}>{item.label}</div>
           </div>
         ))}
      </motion.div>
    </motion.section>
  )
}
