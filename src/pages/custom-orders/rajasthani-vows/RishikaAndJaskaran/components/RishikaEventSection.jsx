import React from 'react'
import { motion } from 'framer-motion'

// Helper function to render superscript for dates like 6th, 7th, 1st, 2nd, 3rd
export function renderDateWithSuperscript(dateStr) {
  if (!dateStr) return null
  const regex = /(\d+)(st|nd|rd|th)(.*)/i
  const match = dateStr.match(regex)
  if (match) {
    return (
      <span>
        {match[1]}
        <sup
          style={{
            fontSize: '0.62em',
            top: '-0.55em',
            position: 'relative',
            fontWeight: 700,
            marginLeft: '1px',
            marginRight: '2px',
          }}
        >
          {match[2]}
        </sup>
        {match[3]}
      </span>
    )
  }
  return dateStr
}

export default function RishikaEventSection({
  title,
  titleLine1,
  connectorText,
  titleLine2,
  date,
  time,
  location,
  bgImage,
  mapLink,
  position = 'middle',
  isDesktop = false,
}) {
  const isTop = position === 'top'
  const lineAnim = {
    hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      aria-label={titleLine1 || title || "Event Details"}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: isTop ? 'flex-start' : 'center',
        justifyContent: 'center',
        paddingTop: isTop ? (isDesktop ? '9.5svh' : '10svh') : '24px',
        paddingBottom: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Background illustration */}
      <img
        src={bgImage}
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

      {/* ── Content Container: Fully interactive cascading line animation ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
        }}
        className="relative z-10 mx-auto text-center flex flex-col items-center py-4 px-2"
        style={{
          width: '74%',
          maxWidth: isDesktop ? '440px' : '360px',
          marginTop: !isTop ? (isDesktop ? '-8vh' : '-6svh') : 0,
        }}
      >
        {/* Title — Line by line animation */}
        {titleLine1 ? (
          <motion.div variants={lineAnim} className="mb-1.5 flex flex-col items-center">
            {/* Line 1: Sundowner Pheras — Compact elegant Font */}
            <h2 className="font-['Cinzel'] text-[#7A1228] text-[20px] sm:text-[23px] md:text-[26px] font-bold uppercase tracking-[0.08em] leading-tight drop-shadow-[0_1px_2px_rgba(122,18,40,0.15)]">
              {titleLine1}
            </h2>
            {/* Line 2: followed by text above wedding reception */}
            {connectorText && (
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  color: '#8A1D33',
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'lowercase',
                  margin: '2px 0',
                  display: 'block',
                  opacity: 0.95,
                }}
              >
                {connectorText}
              </span>
            )}
            {/* Line 3: Wedding Reception */}
            {titleLine2 && (
              <span className="font-['Cinzel'] text-[#54121B] text-[14px] sm:text-[15.5px] md:text-[17px] font-bold uppercase tracking-[0.12em] block">
                {titleLine2}
              </span>
            )}
          </motion.div>
        ) : (
          title && (
            <motion.h2
              variants={lineAnim}
              className="font-['Cinzel'] text-[#7A1228] text-[19px] sm:text-[22px] md:text-[24px] font-bold uppercase tracking-[0.08em] leading-snug mb-1.5 drop-shadow-[0_1px_2px_rgba(122,18,40,0.15)]"
            >
              {title}
            </motion.h2>
          )
        )}

        {/* Date — With superscript "th", line animation */}
        {date && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#7A1228] text-[12.5px] sm:text-[13.5px] md:text-[15px] font-bold uppercase tracking-[0.12em] mb-1"
          >
            {renderDateWithSuperscript(date)}
          </motion.p>
        )}

        {/* Time — Line animation */}
        {time && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#54121B] text-[11.5px] sm:text-[12.5px] md:text-[13.5px] font-semibold uppercase tracking-[0.1em] mb-2"
          >
            {time}
          </motion.p>
        )}

        {/* Ornamental divider in subtle dark ruby */}
        <motion.div variants={lineAnim} className="flex items-center gap-1.5 mb-2 opacity-60">
          <div className="w-8 h-[0.8px] bg-[#7A1228]" />
          <span className="text-[7px] text-[#7A1228]">✦</span>
          <div className="w-8 h-[0.8px] bg-[#7A1228]" />
        </motion.div>

        {/* Location — Line animation */}
        {location && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#7A1228] text-[11px] sm:text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.06em] leading-relaxed mb-3 max-w-[330px]"
          >
            {location}
          </motion.p>
        )}

        {/* View Location Button — Line animation */}
        {mapLink && (
          <motion.a
            variants={lineAnim}
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#7A1228]/50 text-[#7A1228] text-[11px] sm:text-[12px] font-['Cinzel'] uppercase font-bold tracking-[0.12em] shadow-[0_4px_12px_rgba(122,18,40,0.10)] hover:bg-[#FAF5EB] transition-colors"
          >
            <span className="text-[9px] text-[#7A1228]">✦</span>
            View Location
            <span className="text-[9px] text-[#7A1228]">✦</span>
          </motion.a>
        )}
      </motion.div>
    </section>
  )
}
