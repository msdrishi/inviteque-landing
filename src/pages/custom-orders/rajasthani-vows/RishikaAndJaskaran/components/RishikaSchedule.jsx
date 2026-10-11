import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '../../../../../templates/rajasthani-vows/RajasthaniVowsShared.jsx'
import { renderDateWithSuperscript } from './RishikaEventSection.jsx'

export default function RishikaSchedule({
  scheduleItems = [],
  isDesktop = false,
}) {
  const bgImage = "/assets/templates/rajestani-vows/background-general.webp"

  // Only the 2 requested events: 4:30 PM Sundowner Pheras & 7:00 PM Wedding Reception
  const events = useMemo(() => {
    if (Array.isArray(scheduleItems) && scheduleItems.length > 0) {
      return scheduleItems.slice(0, 2)
    }
    return [
      {
        time: "4:30 PM",
        title: "Sundowner Pheras",
        date: "7th December 2026",
        iconSrc: "/assets/templates/royal-heirloom/icons/engagement.webp",
      },
      {
        time: "7:00 PM",
        title: "Wedding Reception",
        date: "7th December 2026",
        iconSrc: "/assets/templates/royal-heirloom/icons/drinks.webp",
      },
    ]
  }, [scheduleItems])

  const svgHeight = 360

  const { pathD, dotPoints } = useMemo(() => {
    const dots = [
      { x: 200, y: 70 },
      { x: 200, y: 250 },
    ]
    const d = `M 200 70 C 245 130, 155 190, 200 250`
    return { pathD: d, dotPoints: dots }
  }, [])

  return (
    <section
      id="schedule"
      aria-label="Wedding Schedule"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-4 py-12 bg-[#FAF6EE] overflow-hidden"
    >
      {/* Background illustration */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-40"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2">
        <SectionHeader
          subtitle="TIMELINE OF EVENTS"
          title="WEDDING SCHEDULE"
          description="Follow the rhythm of our sacred moments and festivities."
        />
      </div>

      {/* 2-Event S-Curve Timeline Container */}
      <div
        className="relative z-10 w-full max-w-[420px] my-auto py-4"
        style={{ minHeight: `${svgHeight}px` }}
      >
        {/* S-Curve SVG */}
        <svg
          viewBox={`0 0 400 ${svgHeight}`}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="rishikaRegalCurve" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7A1228" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#7A1228" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7A1228" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Curve line in rich ruby */}
          <path
            d={pathD}
            stroke="url(#rishikaRegalCurve)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="4 6"
            className="drop-shadow-[0_0_6px_rgba(122,18,40,0.25)]"
          />

          {/* Nodes */}
          {dotPoints.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="7"
                fill="#FAF6EE"
                stroke="#7A1228"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              <circle cx={pt.x} cy={pt.y} r="3" fill="#7A1228" />
            </g>
          ))}
        </svg>

        {/* Timeline Event Cards — Triggers only once user reaches section fully */}
        <div className="relative z-10 flex flex-col justify-around w-full h-full" style={{ minHeight: `${svgHeight}px` }}>
          {events.map((ev, idx) => {
            const isEven = idx % 2 === 0
            return (
              <div
                key={idx}
                className="w-full flex items-center py-2"
                style={{
                  justifyContent: isEven ? 'flex-start' : 'flex-end',
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: isEven ? -25 : 25, filter: 'blur(5px)' },
                    show: {
                      opacity: 1,
                      x: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 1.2, staggerChildren: 0.16, delayChildren: 0.2, ease: [0.22, 1, 0.36, 1] }
                    },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.25 }}
                  className="flex flex-col items-center text-center cursor-pointer select-none group"
                >
                  {/* Event Icon */}
                  {ev.iconSrc && (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        show: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
                      }}
                      className="w-12 h-12 mb-2 flex items-center justify-center p-2 rounded-full bg-[#FAF5EB] border-2 border-[#7A1228]/50 shadow-[0_4px_14px_rgba(122,18,40,0.14)] group-hover:scale-105 transition-transform"
                    >
                      <img
                        src={ev.iconSrc}
                        alt=""
                        className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(122,18,40,0.2)]"
                      />
                    </motion.div>
                  )}

                  {/* Banner */}
                  <div className="w-[164px] sm:w-[178px] px-3.5 py-2.5 rounded-xl bg-[#FAF5EB]/95 border border-[#7A1228]/40 shadow-[0_8px_20px_rgba(122,18,40,0.09)] backdrop-blur-sm flex flex-col items-center text-center group-hover:shadow-[0_10px_26px_rgba(122,18,40,0.14)] transition-shadow">
                    {/* Time — Dark color */}
                    {ev.time && (
                      <motion.span
                        variants={{
                          hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
                          show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8 } }
                        }}
                        className="font-['Cinzel'] text-[11px] font-bold tracking-[0.16em] uppercase text-[#7A1228] block mb-0.5"
                      >
                        {ev.time}
                      </motion.span>
                    )}

                    {/* Title — Dark color */}
                    {ev.title && (
                      <motion.span
                        variants={{
                          hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
                          show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8 } }
                        }}
                        className="font-['Cinzel'] text-[12.5px] sm:text-[13.5px] font-bold tracking-[0.06em] uppercase text-[#54121B] block leading-tight"
                      >
                        {ev.title}
                      </motion.span>
                    )}

                    {/* Date with superscript — Dark color, NOT yellow! */}
                    {ev.date && (
                      <motion.span
                        variants={{
                          hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
                          show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8 } }
                        }}
                        className="font-['Cinzel'] text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#7A1228] block mt-1"
                      >
                        {renderDateWithSuperscript(ev.date)}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-2" />
    </section>
  )
}
