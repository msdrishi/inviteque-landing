import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import FallingPetals from './FallingPetals'
import {
  COLORS,
  FONTS,
  ASSETS,
  LotusDivider,
  slowLineAnim,
  slowContainerAnim,
} from './theme'

function calculateTimeLeft(targetDate) {
  const difference = +new Date(targetDate) - +new Date()
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export default function SouthernSerenadeCountdown({ data = {}, isDesktop = false }) {
  const targetISO = useMemo(() => {
    if (data.targetDateTimeISO) return data.targetDateTimeISO
    return '2026-11-26T11:00:00'
  }, [data.targetDateTimeISO])

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetISO))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetISO))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetISO])

  const timerUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ]

  return (
    <section
      id="countdown"
      aria-label="Wedding Countdown - Southern Serenade"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        paddingTop: isDesktop ? '14svh' : '11svh',
        paddingBottom: isDesktop ? '42svh' : '40svh', // Space for the bottom temple gopuram & elephant
        paddingLeft: 20,
        paddingRight: 20,
        boxSizing: 'border-box',
      }}
    >
      {/* Background Gopuram Artwork */}
      <img
        src={ASSETS.countdownBg}
        alt="Temple Gopuram Countdown Illustration"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Falling Flower Petals animation */}
      <FallingPetals count={18} />

      {/* ── Content Container: NO div banner! Clean floating typography directly on background ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={slowContainerAnim}
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: isDesktop ? 500 : 360,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Subtitle */}
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: isDesktop ? '12px' : '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            margin: '0 0 4px 0',
            fontWeight: 700,
          }}
        >
          AWAITING THE SACRED UNION
        </motion.p>

        {/* Refined, smaller heading */}
        <motion.h2
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.heading,
            fontSize: isDesktop ? '1.55rem' : '1.3rem',
            color: COLORS.primary,
            margin: '0 0 6px 0',
            letterSpacing: '0.05em',
            lineHeight: 1.2,
            fontWeight: 'normal',
          }}
        >
          Counting Down The Days
        </motion.h2>

        <motion.div variants={slowLineAnim} style={{ marginBottom: 18 }}>
          <LotusDivider color={COLORS.gold} width={120} />
        </motion.div>

        {/* 4 Floating Timer Units: NO WHITE BOXES, NO BANNERS */}
        <motion.div
          variants={slowLineAnim}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isDesktop ? 18 : 10,
            width: '100%',
            maxWidth: 340,
            margin: '0 auto',
          }}
        >
          {timerUnits.map((u, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: isDesktop ? 58 : 46,
                }}
              >
                {/* Clean Floating Number - No boxes or frames */}
                <span
                  style={{
                    display: 'block',
                    fontFamily: FONTS.heading,
                    fontSize: isDesktop ? '2.0rem' : '1.75rem',
                    color: COLORS.primary,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: '0.03em',
                  }}
                >
                  {String(u.value).padStart(2, '0')}
                </span>

                {/* Clear, Legible Unit Label */}
                <span
                  style={{
                    display: 'block',
                    fontFamily: FONTS.label,
                    fontSize: '10.5px',
                    letterSpacing: '0.18em',
                    color: COLORS.secondary,
                    marginTop: 6,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {u.label}
                </span>
              </div>

              {/* Subtle Gold Separator between units */}
              {i < timerUnits.length - 1 && (
                <span
                  style={{
                    color: COLORS.gold,
                    fontSize: '1.1rem',
                    opacity: 0.55,
                    marginBottom: 16,
                    userSelect: 'none',
                  }}
                >
                  :
                </span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
