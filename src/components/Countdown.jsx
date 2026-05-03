import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import bgImage from '../assets/story/bg_image.png'

const C = {
  primary: '#b95462',
  text:    '#4a3a3a',
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

  const labels = data.labels || { days: 'Days', hours: 'Hours', minutes: 'Min', seconds: 'Sec' }

  const boxes = [
    { key: 'days', value: parts.days, label: labels.days },
    { key: 'hours', value: parts.hours, label: labels.hours },
    { key: 'minutes', value: parts.minutes, label: labels.minutes },
    { key: 'seconds', value: parts.seconds, label: labels.seconds },
  ]

  return (
    <section
      id={data.id}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        width: '100%',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: 'clamp(20px, 5vw, 40px)',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(185, 84, 98, 0.15)',
          border: '1px solid rgba(185, 84, 98, 0.2)',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h2 style={{
          fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
          fontSize: 'clamp(36px, 8vw, 48px)',
          color: C.primary,
          margin: '0 0 10px 0',
          fontWeight: 400,
        }}>
          {data.title || "The Big Day"}
        </h2>
        
        {/* Heart Divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
          <svg viewBox="0 0 100 20" width="40" height="8" fill="none">
            <path d="M10 10 Q30 0 50 10 Q70 20 90 10" stroke={C.primary} strokeWidth="1" opacity="0.4"/>
          </svg>
          <svg viewBox="0 0 24 24" width="12" height="12" fill={C.primary}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg viewBox="0 0 100 20" width="40" height="8" fill="none">
            <path d="M10 10 Q30 0 50 10 Q70 20 90 10" stroke={C.primary} strokeWidth="1" opacity="0.4"/>
          </svg>
        </div>

        {/* Single Line Format: Days - Hours - Min - Sec */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(4px, 1.5vw, 15px)',
        }}>
          {boxes.map((box, index) => (
            <div key={box.key} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1.5vw, 15px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'clamp(40px, 12vw, 70px)' }}>
                <span style={{
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                  fontSize: 'clamp(28px, 8vw, 42px)',
                  fontWeight: '300',
                  color: C.text,
                  lineHeight: '1',
                }}>
                  {String(box.value).padStart(2, '0')}
                </span>
                <span style={{
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                  fontSize: 'clamp(9px, 2.5vw, 13px)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: C.primary,
                  marginTop: '10px',
                }}>
                  {box.label}
                </span>
              </div>
              
              {/* Separator - */}
              {index < boxes.length - 1 && (
                <span style={{
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                  fontSize: 'clamp(20px, 5vw, 28px)',
                  fontWeight: '300',
                  color: C.primary,
                  opacity: 0.4,
                  transform: 'translateY(-12px)'
                }}>
                  —
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
