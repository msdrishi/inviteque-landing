import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

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

const petalConfig = Array.from({ length: 12 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20;
  const duration = 6 + Math.random() * 8;
  const delay = Math.random() * 4;
  const size = 6 + Math.random() * 8;
  const x1 = Math.random() * 50 - 25;
  const x2 = Math.random() * 50 - 25;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

function FallingGoldPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100%' }}>
      {petalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size, 
            opacity: 0.8,
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))'
          }}
          animate={{
            y: ['0%', '110%'],
            x: [0, p.x1, p.x2],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 0 C 32 10, 32 30, 20 40 C 8 30, 8 10, 20 0 Z" fill="#D4AF37" />
            <circle cx="20" cy="20" r="3" fill="#FFF3CD" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

const zeroParts = { days: 0, hours: 0, minutes: 0, seconds: 0 }

export default function CountdownRoyalPalace({ data, isDesktop, bgImage, centerText }) {
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

  // Royal Palace Theming Colors
  const colors = {
    text: '#E3C57C',
    label: '#E3C57C',
    border: '#E3C57C',
    bg: 'transparent'
  }

  return (
    <section
      id={data.id || 'countdown'}
      className="relative w-full overflow-hidden bg-[#5C0A14]"
      style={isDesktop ? { aspectRatio: '3 / 2', minHeight: 'auto' } : { minHeight: '92svh' }}
    >
      {/* Background image */}
      <img
        src={bgImage}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Falling Gold Petals Effect */}
      <FallingGoldPetals />

      {/* Overlayed content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center">
        <div className="relative h-full w-full flex flex-col justify-center items-center">
          
          <div
            className={`absolute inset-x-0 flex justify-center px-4 md:px-10 ${
              centerText 
                ? 'top-1/2 -translate-y-1/2 md:top-[40%]' 
                : (isDesktop ? 'top-[34%]' : 'top-[30%]')
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 1.1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center justify-center py-8 px-6 sm:px-10"
              style={isDesktop ? { maxWidth: '58vw' } : { maxWidth: '420px' }}
            >
              {/* COUNT DOWN Title */}
              <div className="flex justify-center h-6 mb-5">
                <div className="flex gap-0">
                  {'COUNTDOWN'.split('').map((letter, idx) => (
                    <motion.span
                      key={`countdown-letter-${idx}`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.25 }}
                      transition={{
                        duration: 1.0,
                        ease: [0.22, 1, 0.36, 1],
                        delay: idx * 0.08,
                      }}
                      className="inline-block text-[18px] md:text-[22px] font-semibold uppercase tracking-[0.2em]"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: colors.text }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Simple Countdown Numbers Track */}
              <div 
                className={`flex justify-center items-center ${isDesktop ? '' : 'gap-1.5 sm:gap-3'}`}
                style={isDesktop ? { gap: 'clamp(8px, 1.5vw, 24px)' } : undefined}
              >
                {boxes.map((box, idx) => (
                  <div key={box.key} className="flex items-center">
                    <div 
                      className={`text-center ${isDesktop ? '' : 'px-1.5 sm:px-3'} py-2`}
                      style={isDesktop ? { paddingLeft: 'clamp(3px, 0.6vw, 10px)', paddingRight: 'clamp(3px, 0.6vw, 10px)' } : undefined}
                    >
                      <div
                        className={`leading-none ${isDesktop ? '' : 'text-[28px] md:text-[34px]'}`}
                        style={isDesktop ? { 
                          fontFamily: "'Cormorant Garamond', serif", 
                          fontWeight: 300,
                          fontSize: 'clamp(28px, 3.5vw, 44px)',
                          color: colors.text 
                        } : {
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 300,
                          color: colors.text
                        }}
                      >
                        {String(box.value).padStart(2, '0')}
                      </div>
                      <div
                        className="text-[9px] md:text-[11px] tracking-[0.2em] font-medium mt-2"
                        style={{ fontFamily: "'Montserrat', sans-serif", color: colors.label }}
                      >
                        {box.label}
                      </div>
                    </div>

                    {idx < boxes.length - 1 && (
                      <span 
                        className={`font-bold select-none ${isDesktop ? '' : 'text-lg'}`}
                        style={{ 
                          fontFamily: "'Cinzel', serif", 
                          color: colors.border,
                          fontSize: isDesktop ? 'clamp(18px, 2.2vw, 32px)' : undefined,
                          opacity: 0.7,
                          paddingBottom: '24px'
                        }}
                      >
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
