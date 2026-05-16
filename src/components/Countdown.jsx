import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import countdownBg from '../assets/backgrounds/countdown_bg.png'

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

  const headerTop = String(data.headerTop || 'COUNTING DOWN TO')

  return (
    <section
      id={data.id || 'countdown'}
      className="relative w-full min-h-[92svh] overflow-hidden"
    >
      {/* Background image (no overlay/filter) */}
      <img
        src={countdownBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlayed content */}
      <div className="absolute inset-0 z-10">
        <div className="relative h-full w-full">
          {/* 'COUNTING DOWN TO' (top area) */}
          <div className="absolute inset-x-0 top-[10%] flex justify-center px-14">
            <motion.div className="w-full max-w-[420px] text-center">
              {/* COUNTING DOWN */}
              <div className="flex justify-center h-8">
                <div className="flex gap-0">
                  {'COUNTING DOWN'.split('').map((letter, idx) => (
                    <motion.span
                      key={`letter-${idx}`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.25 }}
                      transition={{
                        duration: 0.75,
                        ease: [0.22, 1, 0.36, 1],
                        delay: idx * 0.08,
                      }}
                      className="inline-block text-[16px] font-bold uppercase tracking-[0.34em] text-primary/80"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </div>
              </div>
              {/* TO */}
              <div className="flex justify-center h-8">
                <div className="flex gap-0">
                  {'TO'.split('').map((letter, idx) => (
                    <motion.span
                      key={`to-letter-${idx}`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.25 }}
                      transition={{
                        duration: 0.75,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 'COUNTING DOWN'.length * 0.08 + idx * 0.08,
                      }}
                      className="inline-block text-[16px] font-bold uppercase tracking-[0.34em] text-primary/80"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Counter numbers (centered) */}
          <div
            className="absolute inset-x-0 top-[52%] flex justify-center px-10"
            style={{ transform: 'translateY(-65%)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[420px]"
            >
              <div className="grid grid-cols-4">
                {boxes.map((box, idx) => (
                  <div
                    key={box.key}
                    className={`px-3 py-6 text-center ${idx === 0 ? '' : 'border-l border-primary/25'}`}
                  >
                    <div
                      className="text-[32px] font-semibold leading-none text-primary/80"
                      style={{ fontFamily: "'Cinzel', serif", fontWeight: 650 }}
                    >
                      {box.key === 'days' ? String(box.value) : String(box.value).padStart(2, '0')}
                    </div>
                    <div
                      className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/65"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {String(box.label || '').toUpperCase()}
                    </div>
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
