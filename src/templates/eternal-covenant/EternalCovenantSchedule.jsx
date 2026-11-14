import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, FONTS, slowLineAnim, slowContainerAnim, CovenantDiamondDivider } from './theme'

export default function EternalCovenantSchedule({ data, events: customEvents }) {
  const defaultEvents = [
    {
      title: 'Thanksgiving Service',
      time: '04:00 PM',
      date: 'Friday, Nov 27, 2026',
      venue: 'Cathedral Chapel',
      desc: 'Praise, prayer, and solemn family blessings.',
    },
    {
      title: 'Holy Matrimony Nuptials',
      time: '05:30 PM',
      date: 'Friday, Nov 27, 2026',
      venue: 'Main Cathedral Altar',
      desc: 'Exchange of sacred vows, rings, and marital blessing.',
    },
    {
      title: 'Wedding Banquet & Toast',
      time: '07:00 PM',
      date: 'Friday, Nov 27, 2026',
      venue: 'The Grand Ballroom',
      desc: 'Dinner, celebratory toasts, cake cutting, and music.',
    },
  ]

  const eventsList = (customEvents && customEvents.length > 0) ? customEvents : defaultEvents

  return (
    <section
      className="w-full min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden py-16 px-4"
      style={{
        backgroundColor: COLORS.bgWhite,
        color: COLORS.darkText,
      }}
    >
      {/* Background Cathedral Floorplan & Stained Glass Filigree Art in Theme Green (#2D5A27) */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 400 800" className="w-full h-full object-cover" fill="none" stroke="#2D5A27">
          {/* Symmetrical Church Spire / Aisle Line Art */}
          <path d="M200 60 L140 180 L260 180 Z" strokeWidth="1.2" />
          <path d="M140 180 L140 750 M260 180 L260 750" strokeWidth="1" strokeDasharray="6,4" />
          {/* Subtle Gothic arches along the schedule path */}
          <path d="M140 300 C170 270 230 270 260 300" strokeWidth="0.8" />
          <path d="M140 460 C170 430 230 430 260 460" strokeWidth="0.8" />
          <path d="M140 620 C170 590 230 590 260 620" strokeWidth="0.8" />
          {/* Olive Leaf branches along sides */}
          <path d="M60 200 C80 280 40 380 70 480 C50 580 80 680 60 760" strokeWidth="1" strokeDasharray="4,4" />
          <path d="M340 200 C320 280 360 380 330 480 C350 580 320 680 340 760" strokeWidth="1" strokeDasharray="4,4" />
        </svg>
      </div>

      <motion.div
        variants={slowContainerAnim}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        className="relative z-10 w-full max-w-lg px-4 flex flex-col items-center my-auto"
      >
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            textAlign: 'center',
            fontWeight: 700,
            marginBottom: '6px',
          }}
        >
          Solemn Order of Service
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
            textAlign: 'center',
            marginBottom: '6px',
          }}
        >
          Celebration Timeline
        </motion.h2>

        <motion.div variants={slowLineAnim} className="mb-8">
          <CovenantDiamondDivider color={COLORS.gold} width={160} />
        </motion.div>

        {/* Royal Heirloom Style S-Curve Central Line Itinerary */}
        <div className="relative w-full flex flex-col items-center">
          <div
            className="absolute top-2 bottom-6 w-[1.5px]"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              background: `linear-gradient(to bottom, transparent, ${COLORS.gold}, ${COLORS.gold}, transparent)`,
              opacity: 0.65,
            }}
          />

          {eventsList.map((evt, idx) => {
            const isLeft = idx % 2 === 0
            return (
              <motion.div
                key={idx}
                variants={slowLineAnim}
                className="relative w-full flex items-center my-4"
                style={{
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                }}
              >
                <div
                  className="absolute"
                  style={{
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.bgWhite,
                    border: `2px solid ${COLORS.gold}`,
                    boxShadow: '0 0 8px rgba(184, 142, 62, 0.4)',
                    zIndex: 2,
                  }}
                />

                <div
                  className="w-[44%] p-3"
                  style={{
                    textAlign: isLeft ? 'right' : 'left',
                  }}
                >
                  <p
                    style={{
                      fontFamily: FONTS.label,
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      color: COLORS.secondary,
                      fontWeight: 700,
                      marginBottom: '2px',
                    }}
                  >
                    {evt.time || evt.eventTime}
                  </p>
                  <h3
                    style={{
                      fontFamily: FONTS.heading,
                      fontSize: '15px',
                      color: COLORS.primary,
                      lineHeight: 1.25,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      marginBottom: '3px',
                    }}
                  >
                    {evt.title || evt.eventName}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '12.5px',
                      color: COLORS.mutedText,
                      lineHeight: 1.4,
                    }}
                  >
                    {evt.venue || evt.eventVenue || evt.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
