import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  COLORS,
  FONTS,
  ASSETS,
  LotusDivider,
  slowLineAnim,
  slowContainerAnim,
} from './theme'

export default function SouthernSerenadeSchedule({ data = {}, isDesktop = false }) {
  // Default 3 synchronized events: Haldi, Wedding, Reception
  const defaultEvents = [
    {
      time: '10:00 AM',
      title: 'Haldi Ceremony',
      dateStr: '25 NOVEMBER 2026',
      description: 'Auspicious turmeric ceremony filled with love and familial warmth.',
    },
    {
      time: '11:00 AM',
      title: 'Wedding Ceremony',
      dateStr: '26 NOVEMBER 2026',
      description: 'The sacred hour of Mangalya Dharana and the Seven Sacred Steps.',
    },
    {
      time: '07:00 PM',
      title: 'Grand Reception',
      dateStr: '26 NOVEMBER 2026',
      description: 'An evening of celebration with loved ones, dinner, and blessings.',
    },
  ]

  const incomingItems = data.items || []
  const events = useMemo(() => {
    if (Array.isArray(incomingItems) && incomingItems.length > 0) {
      return incomingItems.map((item, idx) => ({
        time: item.time || '11:00 AM',
        title: item.title || item.name || `Celebration ${idx + 1}`,
        dateStr: item.date || '26 NOVEMBER 2026',
        description: item.description || '',
      }))
    }
    return defaultEvents
  }, [incomingItems])

  const n = events.length
  const itemRowHeight = 155
  const svgHeight = Math.max(390, n * itemRowHeight)

  // Dynamically compute the S-curve path that weaves cleanly through the center gap (X: 200)
  const { pathD, dotPoints } = useMemo(() => {
    if (n === 0) return { pathD: '', dotPoints: [] }

    const dots = Array.from({ length: n }).map((_, i) => ({
      x: 200,
      y: 25 + i * itemRowHeight + itemRowHeight / 2,
    }))

    if (n === 1) {
      return { pathD: '', dotPoints: dots }
    }

    let d = `M 200 ${dots[0].y} `
    const bowDepth = 45

    for (let i = 0; i < n - 1; i++) {
      const isLeft = i % 2 === 0
      const currentY = dots[i].y
      const nextY = dots[i + 1].y
      const H = nextY - currentY

      const dX = isLeft ? bowDepth : -bowDepth
      const cp1X = 200 + dX
      const cp1Y = currentY + H / 3
      const cp2X = 200 + dX
      const cp2Y = nextY - H / 3

      d += `C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, 200 ${nextY} `
    }

    return { pathD: d, dotPoints: dots }
  }, [n, itemRowHeight])

  return (
    <section
      id="schedule"
      aria-label="Wedding Schedule - Southern Serenade"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isDesktop ? '90px 24px' : '70px 16px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Background Texture */}
      <img
        src={ASSETS.plainBg}
        alt=""
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

      {/* ── Header Container: NO div banner! Clean typography directly on background ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={slowContainerAnim}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          marginBottom: isDesktop ? 44 : 30,
        }}
      >
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: isDesktop ? '12px' : '11.5px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            margin: '0 0 5px 0',
            fontWeight: 700,
          }}
        >
          TIMELINE OF EVENTS
        </motion.p>
        <motion.h2
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.heading,
            fontSize: isDesktop ? '2.5rem' : '2.05rem',
            color: COLORS.primary,
            margin: '0 0 6px 0',
            letterSpacing: '0.04em',
            fontWeight: 'normal',
          }}
        >
          Wedding Schedule
        </motion.h2>
        <motion.div variants={slowLineAnim}>
          <LotusDivider color={COLORS.gold} width={140} />
        </motion.div>
      </motion.div>

      {/* ── Dynamic Royal-Heirloom Style S-Curve Timeline Container ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 430,
          minHeight: `${svgHeight}px`,
          margin: '0 auto',
        }}
      >
        {/* Dynamic S-Curve SVG */}
        <svg
          viewBox={`0 0 400 ${svgHeight}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="southernGoldCurve" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B6834" stopOpacity="0.3" />
              <stop offset="25%" stopColor="#731924" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#C5A059" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#731924" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#8B6834" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* S-curve path generated strictly in the center corridor */}
          <path
            d={pathD}
            stroke="url(#southernGoldCurve)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Center Trajectory Dots */}
          {dotPoints.map((pt, idx) => (
            <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill="#731924" opacity="0.9" />
          ))}
        </svg>

        {/* Dynamic Milestone Items strictly pinned to Left and Right flanks */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', width: '100%' }}>
          {events.map((evt, idx) => {
            const isLeft = idx % 2 === 0
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  minHeight: `${itemRowHeight}px`,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  paddingLeft: isLeft ? '6px' : 0,
                  paddingRight: !isLeft ? '6px' : 0,
                  boxSizing: 'border-box',
                }}
              >
                {/* Event Milestone Item: width ~152px so curve never overlaps */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: 152,
                    userSelect: 'none',
                  }}
                >
                  {/* Floating Micro-Animated Icon Badge */}
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                      rotate: isLeft ? [-2, 2, -2] : [2, -2, 2],
                    }}
                    transition={{
                      duration: 3.2 + (idx % 3) * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: idx * 0.3,
                    }}
                    style={{
                      marginBottom: 7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      background: '#FAF6EF',
                      border: `1.2px solid ${COLORS.borderGold}`,
                      boxShadow: '0 4px 12px rgba(115, 25, 36, 0.12)',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Auspicious Icon SVG: Lotus / Lamp */}
                    <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
                      <path
                        d="M12 21 C12 21 6 15 4 10 C7 12 9.5 13 12 13 C14.5 13 17 12 20 10 C18 15 12 21 12 21Z"
                        fill={COLORS.primary}
                        opacity="0.85"
                      />
                      <circle cx="12" cy="7" r="2.2" fill={COLORS.secondary} />
                    </svg>
                  </motion.div>

                  {/* Time Typography */}
                  <div
                    style={{
                      fontFamily: FONTS.label,
                      fontSize: '15.5px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: COLORS.primary,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {evt.time}
                  </div>

                  {/* Event Title */}
                  <h4
                    style={{
                      fontFamily: FONTS.heading,
                      fontSize: '13.5px',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      color: COLORS.secondary,
                      lineHeight: 1.25,
                      textTransform: 'uppercase',
                      margin: '0 0 3px 0',
                    }}
                  >
                    {evt.title}
                  </h4>

                  {/* Date Subtitle */}
                  <span
                    style={{
                      fontFamily: FONTS.label,
                      fontSize: '11px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: COLORS.primary,
                      fontWeight: 700,
                      opacity: 0.88,
                    }}
                  >
                    {evt.dateStr}
                  </span>

                  {/* Optional Description */}
                  {evt.description && (
                    <p
                      style={{
                        fontFamily: FONTS.body,
                        fontSize: '13px',
                        lineHeight: 1.35,
                        color: COLORS.darkText,
                        margin: '6px 0 0 0',
                        fontStyle: 'italic',
                        opacity: 0.9,
                      }}
                    >
                      {evt.description}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
