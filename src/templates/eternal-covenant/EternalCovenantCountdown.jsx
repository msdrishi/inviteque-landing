import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { COLORS, FONTS, slowLineAnim, slowContainerAnim, CovenantCrossDivider } from './theme'
import FallingPetals from './FallingPetals'

export default function EternalCovenantCountdown({ data }) {
  const targetDateStr = data?.weddingDate || '2026-11-27T19:00:00'

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDateStr) - +new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [targetDateStr])

  const timeUnits = [
    { label: 'DAYS', val: timeLeft.days },
    { label: 'HOURS', val: timeLeft.hours },
    { label: 'MINUTES', val: timeLeft.minutes },
    { label: 'SECONDS', val: timeLeft.seconds },
  ]

  return (
    <section
      className="w-full min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: COLORS.bgWhite,
        color: COLORS.darkText,
      }}
    >
      <FallingPetals count={18} height="100svh" />

      <motion.div
        variants={slowContainerAnim}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        className="relative z-10 w-full max-w-md px-6 text-center flex flex-col items-center my-auto pt-16 pb-12"
      >
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          Counting Down The Moments
        </motion.p>

        <motion.h2
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.heading,
            fontSize: '28px',
            color: COLORS.primary,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          Until We Say "I Do"
        </motion.h2>

        <motion.div variants={slowLineAnim} className="my-2">
          <CovenantCrossDivider color={COLORS.gold} width={130} />
        </motion.div>

        {/* Timer Boxes */}
        <motion.div
          variants={slowLineAnim}
          className="grid grid-cols-4 gap-3 w-full max-w-sm mt-8 mb-6"
        >
          {timeUnits.map((u, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-4 px-2"
              style={{
                backgroundColor: 'rgba(251, 249, 245, 0.95)',
                border: `1px solid ${COLORS.borderGold}`,
                borderRadius: '4px',
                boxShadow: '0 4px 15px rgba(45,90,39,0.06)',
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: '28px',
                  lineHeight: 1,
                  color: COLORS.primary,
                  fontWeight: 700,
                }}
              >
                {String(u.val).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: FONTS.label,
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  color: COLORS.secondary,
                  fontWeight: 600,
                  marginTop: '6px',
                }}
              >
                {u.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.body,
            fontSize: '15px',
            color: COLORS.mutedText,
            marginTop: '12px',
          }}
        >
          "Love never fails." — 1 Corinthians 13:8
        </motion.p>
      </motion.div>
    </section>
  )
}
