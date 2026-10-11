import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from './RajasthaniVowsShared.jsx'
import { FallingRoyalFlowers } from './RajasthaniVowsHero.jsx'

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

export default function RajasthaniVowsCountdown({
  data = {},
  isDesktop = false,
}) {
  const targetDateTimeISO = data.targetDate || data.targetDateTimeISO
  const targetDate = useMemo(() => {
    const fallback = '2026-12-18T09:00:00.000Z'
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

  const labels = data.labels || { days: 'DAYS', hours: 'HOURS', minutes: 'MIN', seconds: 'SEC' }
  const bgImage = isDesktop
    ? (data.bgImageDesktop || "/assets/templates/rajestani-vows/countdown-mobile.webp")
    : (data.bgImageMobile || "/assets/templates/rajestani-vows/countdown-mobile.webp")

  const boxes = [
    { key: 'days', value: parts.days, label: labels.days },
    { key: 'hours', value: parts.hours, label: labels.hours },
    { key: 'minutes', value: parts.minutes, label: labels.minutes },
    { key: 'seconds', value: parts.seconds, label: labels.seconds },
  ]

  return (
    <section
      id="countdown"
      aria-label="Countdown"
      className="relative w-full overflow-hidden flex flex-col items-center justify-start text-center"
      style={{
        minHeight: isDesktop ? '100vh' : '100svh',
        paddingTop: isDesktop ? '12vh' : '13svh',
        paddingBottom: '6svh',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Background Image */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover z-0"
      />

      {/* Royal Falling Flowers Petals Animation */}
      <FallingRoyalFlowers />

      {/* Centered in the top area of the section */}
      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center max-w-[420px] w-full"
      >
        {/* Consistent Section Header */}
        <SectionHeader
          subtitle={data.title || "COUNTING DOWN TO"}
          title={data.subtitle || "THE BIG DAY"}
        />

        {/* 4 Counter Boxes with Cinzel Typography — Staggered sequence */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          className="flex items-center justify-center gap-2.5 sm:gap-4 w-full mt-3"
        >
          {boxes.map((b) => (
            <motion.div
              key={b.key}
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              whileHover={{ scale: 1.05 }}
              className="flex-1 max-w-[80px] sm:max-w-[88px] flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-[#FAF5EB]/95 border-2 border-[#C59A4E]/50 shadow-[0_8px_24px_rgba(122,18,40,0.14)] backdrop-blur-sm"
            >
              <span className="font-['Cinzel'] text-[24px] sm:text-[30px] font-bold text-[#7A1228] leading-none mb-1">
                {String(b.value).padStart(2, '0')}
              </span>
              {b.label && (
                <span className="font-['Cinzel'] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase font-bold text-[#8A1D33]">
                  {b.label}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}