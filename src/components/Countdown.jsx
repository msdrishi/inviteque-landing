import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
const countdownBg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029546/jm1zlmjcwdjwvxkbjts7.png"

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

const leafConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20; // 0-20% or 80-100%
  const duration = 6 + Math.random() * 8; // 6 to 14 seconds
  const delay = Math.random() * 5;
  const size = 5 + Math.random() * 10; // 20px to 40px (natural, visible size)
  const x1 = Math.random() * 60 - 30;
  const x2 = Math.random() * 60 - 30;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

function FallingLeaves() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100%' }}>
      {leafConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size * 1.5, 
            opacity: 0.80,
            filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.15))'
          }}
          animate={{
            y: ['0vh', '110vh'],
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
          <svg viewBox="0 0 40 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {/* Main leaf body filled with #404D29 */}
            <path d="M 20 5 C 40 20, 35 45, 20 55 C 5 45, 0 20, 20 5 Z" fill="#404D29" />
            {/* Veins */}
            <path d="M 20 5 Q 16 30, 20 55" stroke="#2B351B" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 18 20 L 10 15" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 21 25 L 30 20" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 19 35 L 12 32" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 21 40 L 28 38" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            {/* Stem */}
            <path d="M 20 55 L 20 59" stroke="#2B351B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

const zeroParts = { days: 0, hours: 0, minutes: 0, seconds: 0 }

export default function Countdown({ data, isDesktop, bgImage, theme, centerText }) {
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

  const headerTop = String(data.headerTop || 'COUNTING DOWN TO')
  const isGreen = theme === 'green'
  const textColor = isGreen ? '#3D5236' : '#7B0F1A'
  const labelColor = isGreen ? '#5F7C56' : '#9C5E67'
  const bevelColor = isGreen ? '#2B3B25' : '#5C0A14'

  return (
    <section
      id={data.id || 'countdown'}
      className="relative w-full overflow-hidden"
      style={isDesktop ? { aspectRatio: '3 / 2', minHeight: 'auto' } : { minHeight: '92svh' }}
    >
      {/* Background image (no overlay/filter) */}
      <img
        src={bgImage || (isDesktop ? "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782033909/gmefgowakcfmgpx49vmi.png" : countdownBg)}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Falling Leaves Effect for Green Theme (Twilight Serenade) */}
      {isGreen && <FallingLeaves />}

      {/* Overlayed content */}
      <div className="absolute inset-0 z-10">
        <div className="relative h-full w-full">
          {/* Counter numbers (aligned a little down from the top of the section) */}
          <div
            className={`absolute inset-x-0 flex justify-center px-4 md:px-10 ${
              centerText 
                ? 'top-1/2 -translate-y-1/2' 
                : (isDesktop ? 'top-[34%]' : 'top-[30%]')
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 1.1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
              style={isDesktop ? { maxWidth: '58vw' } : { maxWidth: '420px' }}
            >
              {/* COUNT DOWN Title */}
              <div className="flex justify-center h-6 mb-4">
                <div className="flex gap-0">
                  {'COUNT DOWN'.split('').map((letter, idx) => (
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
                      className="inline-block text-[14px] md:text-[18px] font-bold uppercase tracking-[0.26em] md:tracking-[0.34em]"
                      style={{ fontFamily: "'Cinzel', serif", color: textColor, opacity: 0.8 }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
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
                        className={`font-semibold leading-none ${isDesktop ? '' : 'text-[24px] md:text-[30px]'}`}
                        style={isDesktop ? { 
                          fontFamily: "'Cinzel', serif", 
                          fontWeight: 650,
                          fontSize: 'clamp(24px, 3.6vw, 56px)',
                          color: textColor
                        } : { fontFamily: "'Cinzel', serif", fontWeight: 650, color: textColor }}
                      >
                        {box.key === 'days' ? String(box.value) : String(box.value).padStart(2, '0')}
                      </div>
                      <div
                        className={`mt-2 font-semibold uppercase tracking-[0.2em] ${isDesktop ? '' : 'text-[10px]'}`}
                        style={isDesktop ? { 
                          fontFamily: "'Cinzel', serif",
                          fontSize: 'clamp(7.5px, 0.85vw, 13px)',
                          color: labelColor
                        } : { fontFamily: "'Cinzel', serif", color: labelColor }}
                      >
                        {String(box.label || '').toUpperCase()}
                      </div>
                    </div>
                    {idx < boxes.length - 1 && (
                      <div 
                        className="self-center" 
                        style={{
                          backgroundColor: isGreen ? 'rgba(61, 82, 54, 0.25)' : 'rgba(123, 15, 26, 0.25)',
                          width: '1.5px',
                          height: isDesktop ? 'clamp(16px, 2.5vw, 36px)' : '24px',
                          marginLeft: isDesktop ? 'clamp(3px, 0.5vw, 8px)' : '6px',
                          marginRight: isDesktop ? 'clamp(3px, 0.5vw, 8px)' : '6px',
                        }}
                      />
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
