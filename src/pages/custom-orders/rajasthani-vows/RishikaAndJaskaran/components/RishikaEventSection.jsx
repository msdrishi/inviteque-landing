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
        paddingTop: isTop ? (isDesktop ? '14svh' : '16svh') : '32px',
        paddingBottom: '24px',
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
        viewport={{ once: false, amount: 0.3 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
        }}
        className="relative z-10 mx-auto text-center flex flex-col items-center py-6 px-2"
        style={{
          width: '68%',
          maxWidth: isDesktop ? '480px' : '380px',
          marginTop: !isTop ? (isDesktop ? '-8vh' : '-6svh') : 0,
        }}
      >
        {/* Title — Line by line animation */}
        {titleLine1 ? (
          <motion.div variants={lineAnim} className="mb-2 flex flex-col items-center">
            {/* Line 1: Sundowner Pheras — Big Font */}
            <h2 className="font-['Cinzel'] text-[#7A1228] text-[24px] sm:text-[28px] md:text-[32px] font-bold uppercase tracking-[0.08em] leading-tight drop-shadow-[0_1px_2px_rgba(122,18,40,0.15)]">
              {titleLine1}
            </h2>
            {/* Line 2: followed by text above wedding reception */}
            {connectorText && (
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  color: '#8A1D33',
                  fontSize: '14.5px',
                  letterSpacing: '0.14em',
                  textTransform: 'lowercase',
                  margin: '4px 0',
                  display: 'block',
                  opacity: 0.95,
                }}
              >
                {connectorText}
              </span>
            )}
            {/* Line 3: Wedding Reception */}
            {titleLine2 && (
              <span className="font-['Cinzel'] text-[#54121B] text-[16px] sm:text-[18px] md:text-[20px] font-bold uppercase tracking-[0.14em] block">
                {titleLine2}
              </span>
            )}
          </motion.div>
        ) : (
          title && (
            <motion.h2
              variants={lineAnim}
              className="font-['Cinzel'] text-[#7A1228] text-[22px] sm:text-[26px] md:text-[28px] font-bold uppercase tracking-[0.08em] leading-snug mb-2 drop-shadow-[0_1px_2px_rgba(122,18,40,0.15)]"
            >
              {title}
            </motion.h2>
          )
        )}

        {/* Date — With superscript "th", line animation */}
        {date && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#7A1228] text-[14px] sm:text-[15.5px] md:text-[17px] font-bold uppercase tracking-[0.14em] mb-1.5"
          >
            {renderDateWithSuperscript(date)}
          </motion.p>
        )}

        {/* Time — Line animation */}
        {time && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#54121B] text-[13px] sm:text-[14px] md:text-[15px] font-semibold uppercase tracking-[0.12em] mb-2.5"
          >
            {time}
          </motion.p>
        )}

        {/* Ornamental divider in subtle dark ruby */}
        <motion.div variants={lineAnim} className="flex items-center gap-2 mb-3 opacity-60">
          <div className="w-10 h-[0.8px] bg-[#7A1228]" />
          <span className="text-[8px] text-[#7A1228]">✦</span>
          <div className="w-10 h-[0.8px] bg-[#7A1228]" />
        </motion.div>

        {/* Location — Line animation */}
        {location && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#7A1228] text-[12.5px] sm:text-[14px] md:text-[15px] font-semibold uppercase tracking-[0.08em] leading-relaxed mb-4 max-w-[360px]"
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#7A1228]/50 text-[#7A1228] text-[12px] sm:text-[13px] font-['Cinzel'] uppercase font-bold tracking-[0.14em] shadow-[0_4px_12px_rgba(122,18,40,0.10)] hover:bg-[#FAF5EB] transition-colors"
          >
            <span className="text-[10px] text-[#7A1228]">✦</span>
            View Location
            <span className="text-[10px] text-[#7A1228]">✦</span>
          </motion.a>
        )}
      </motion.div>
    </section>
  )
}
