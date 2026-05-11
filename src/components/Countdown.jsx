import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import countdownBanner from '../assets/backgrounds/countdown-banner.png'
import bgTexture from '../assets/backgrounds/bg-texture.png'

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function AnimatedTitle({ text, className, style }) {
  return (
    <motion.h2 variants={letterContainer} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className={className} style={style}>
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterAnim} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
      ))}
    </motion.h2>
  )
}

function clampToZero(value) {
  return value < 0 ? 0 : value
}

function getRemainingMs(targetDate) {
  return targetDate.getTime() - Date.now()
}

function toParts(ms) {
  const totalSeconds = Math.floor(clampToZero(ms) / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

const zeroParts = { days: 0, hours: 0, minutes: 0, seconds: 0 }

export default function Countdown({ data }) {
  const targetDateTimeISO = data?.targetDateTimeISO

  const targetDate = useMemo(() => {
    const fallback = '1970-01-01T00:00:00.000Z'
    const parsed = new Date(targetDateTimeISO || fallback)
    return Number.isNaN(parsed.getTime()) ? new Date(fallback) : parsed
  }, [targetDateTimeISO])

  const [parts, setParts] = useState(zeroParts)

  useEffect(() => {
    const tick = () => {
      setParts(toParts(getRemainingMs(targetDate)))
    }

    tick()
    const intervalId = window.setInterval(tick, 1000)
    return () => window.clearInterval(intervalId)
  }, [targetDate])

  if (!data) return null

  const labels = data.labels || { days: 'DAYS', hours: 'HOURS', minutes: 'MIN', seconds: 'SEC' }

  const boxes = [
    { key: 'days', value: parts.days, label: labels.days },
    { key: 'hours', value: parts.hours, label: labels.hours },
    { key: 'minutes', value: parts.minutes, label: labels.minutes },
    { key: 'seconds', value: parts.seconds, label: labels.seconds },
  ]

  return (
    <section id={data.id || 'countdown'} className="w-full min-h-[75svh] overflow-hidden px-4 py-16 relative flex flex-col justify-center items-center gap-12" style={{ backgroundImage: `url(${bgTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative w-[130%] sm:w-[115%] md:w-full max-w-[950px] z-10 flex justify-center items-center"
      >
        {/* The Beautiful Banner Background Image */}
        <img 
          src={countdownBanner} 
          alt="Countdown Banner Frame" 
          className="w-full h-auto pointer-events-none"
          style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))' }}
        />

        {/* The Overlay Content bounded strictly to the empty red space of the banner */}
        <div className="absolute top-[30%] bottom-[22%] left-[10%] right-[10%] flex flex-col items-center justify-between py-[1%]">
          
          <div className="flex flex-col items-center justify-center w-full">
            <AnimatedTitle 
              text="COUNTDOWN"
              style={{ fontFamily: "'Cinzel', serif", color: '#ffffff', fontSize: 'clamp(20px, 5vw, 34px)', fontWeight: 600, letterSpacing: '0.15em', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            />
            <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#e8c9a3', fontSize: 'clamp(5px, 1vw, 10px)', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '2%' }}>
              THE BIG DAY IS ALMOST HERE
            </p>
          </div>

          {/* Tiles Wrapper - Flex container taking the remaining height */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 w-full h-[55%] mt-auto mb-auto">
            {boxes.map((box, i) => (
              <div key={box.key} className="flex items-center h-full">
                
                {/* Light Color Number Tile with Strong Shadow */}
                <div 
                  className="bg-[#fdf8f7] relative flex flex-col items-center justify-center h-full aspect-[1/1.25] max-h-[110px] max-w-[85px] rounded-[12px]"
                  style={{
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.9)'
                  }}
                >
                  <div className="absolute inset-[3px] border-[1px] border-[#d5b28c] opacity-40 rounded-[9px] pointer-events-none"></div>

                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(20px, 5vw, 38px)', fontWeight: 600, color: '#721c24', lineHeight: 1, marginTop: '4px' }}>
                    {box.key === 'days' ? String(box.value) : String(box.value).padStart(2, '0')}
                  </span>
                  
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(5px, 1vw, 9px)', fontWeight: 700, color: '#a07870', marginTop: '12%', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    {box.label}
                  </span>
                </div>

                {/* Single Gold Dot Separator */}
                {i < boxes.length - 1 && (
                  <div className="flex ml-2 sm:ml-4 md:ml-5 -mr-[3px] sm:-mr-[4px] md:-mr-[5px]">
                    <div className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] rounded-full bg-[#e8c9a3]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </motion.div>

      {/* Thank You Note below banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-10 px-6 max-w-[600px] mb-4"
      >
        <p style={{ fontFamily: "'Parisienne', cursive", color: '#721c24', fontSize: 'clamp(28px, 6vw, 36px)', lineHeight: 1.2, margin: '0 0 12px 0' }}>
          We can't wait to celebrate with you!
        </p>
        <div className="flex items-center justify-center gap-4 mb-4 opacity-70">
          <div className="w-12 h-[1px] bg-[#721c24]"></div>
          <span style={{ color: '#721c24', fontSize: '10px' }}>♥</span>
          <div className="w-12 h-[1px] bg-[#721c24]"></div>
        </div>
      </motion.div>

    </section>
  )
}
