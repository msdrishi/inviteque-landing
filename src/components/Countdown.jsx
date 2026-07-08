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

const zeroParts = { days: 0, hours: 0, minutes: 0, seconds: 0 }

export default function Countdown({ data, isDesktop }) {
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

  return (
    <section
      id={data.id || 'countdown'}
      className={isDesktop ? "relative w-full overflow-hidden countdown-section" : "relative w-full overflow-hidden"}
      style={isDesktop ? {} : { minHeight: '92svh' }}
    >
      {/* Background image (no overlay/filter) */}
      <img
        src={isDesktop ? "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782033909/gmefgowakcfmgpx49vmi.png" : countdownBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlayed content */}
      <div className="absolute inset-0 z-10">
        <div className="relative h-full w-full">
          {/* Counter numbers (centered) */}
          <div
            className={`absolute inset-x-0 flex justify-center px-4 md:px-10 ${isDesktop ? 'top-[42%]' : 'top-1/2'}`}
            style={{ transform: 'translateY(-50%)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
              style={isDesktop ? { maxWidth: '58vw' } : { maxWidth: '420px' }}
            >
              {/* COUNT DOWN Title (hidden on desktop) */}
              {!isDesktop && (
                <div className="flex justify-center h-6 mb-2">
                  <div className="flex gap-0">
                    {'COUNT DOWN'.split('').map((letter, idx) => (
                      <motion.span
                        key={`countdown-letter-${idx}`}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.25 }}
                        transition={{
                          duration: 0.75,
                          ease: [0.22, 1, 0.36, 1],
                          delay: idx * 0.08,
                        }}
                        className="inline-block text-[14px] md:text-[18px] font-bold uppercase tracking-[0.26em] md:tracking-[0.34em] text-primary/80"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {letter === ' ' ? '\u00A0' : letter}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              <div 
                className={`flex justify-center items-center ${isDesktop ? '' : 'gap-3 sm:gap-6'}`}
                style={isDesktop ? { gap: 'clamp(12px, 3.2vw, 56px)' } : undefined}
              >
                {boxes.map((box, idx) => (
                  <div key={box.key} className="flex items-center">
                    <div 
                      className={`text-center ${isDesktop ? '' : 'px-3 sm:px-5'} py-3`}
                      style={isDesktop ? { paddingLeft: 'clamp(6px, 1.2vw, 20px)', paddingRight: 'clamp(6px, 1.2vw, 20px)' } : undefined}
                    >
                      <div
                        className={`font-semibold leading-none text-primary/80 ${isDesktop ? '' : 'text-[24px] md:text-[30px]'}`}
                        style={isDesktop ? { 
                          fontFamily: "'Cinzel', serif", 
                          fontWeight: 650,
                          fontSize: 'clamp(24px, 3.6vw, 56px)'
                        } : { fontFamily: "'Cinzel', serif", fontWeight: 650 }}
                      >
                        {box.key === 'days' ? String(box.value) : String(box.value).padStart(2, '0')}
                      </div>
                      <div
                        className={`mt-2 font-semibold uppercase tracking-[0.2em] text-primary/65 ${isDesktop ? '' : 'text-[10px]'}`}
                        style={isDesktop ? { 
                          fontFamily: "'Cinzel', serif",
                          fontSize: 'clamp(7.5px, 0.85vw, 13px)'
                        } : { fontFamily: "'Cinzel', serif" }}
                      >
                        {String(box.label || '').toUpperCase()}
                      </div>
                    </div>
                    {idx < boxes.length - 1 && (
                      <div 
                        className={`bg-primary/25 self-center ${isDesktop ? '' : 'w-[1px] h-8'}`} 
                        style={isDesktop ? {
                          width: '1.5px',
                          height: 'clamp(20px, 3vw, 48px)',
                          marginLeft: 'clamp(6px, 1vw, 16px)',
                          marginRight: 'clamp(6px, 1vw, 16px)',
                        } : undefined}
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
