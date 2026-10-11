import React from 'react'
import { motion } from 'framer-motion'

export default function RishikaEventSection({
  title,
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
    hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      aria-label={title || "Event Details"}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: isTop ? 'flex-start' : 'center',
        justifyContent: 'center',
        paddingTop: isTop ? (isDesktop ? '13svh' : '15svh') : '32px',
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

      {/* Content Container */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.16 } },
        }}
        className="relative z-10 w-[82%] sm:w-[72%] max-w-[460px] md:max-w-[520px] mx-auto text-center flex flex-col items-center py-6 px-3"
        style={{
          marginTop: !isTop ? (isDesktop ? '-10vh' : '-8svh') : 0,
        }}
      >
        {/* Title — Cinzel Bold */}
        <motion.h2
          variants={lineAnim}
          className="font-['Cinzel'] text-[#7A1228] text-[22px] sm:text-[25px] md:text-[28px] font-bold uppercase tracking-[0.08em] leading-snug mb-2 drop-shadow-[0_1px_2px_rgba(122,18,40,0.15)]"
        >
          {title}
        </motion.h2>

        {/* Date — Cinzel Semibold */}
        {date && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#8A1D33] text-[13.5px] sm:text-[15.5px] md:text-[17px] font-semibold uppercase tracking-[0.16em] mb-1.5"
          >
            {date}
          </motion.p>
        )}

        {/* Time — Cinzel Medium */}
        {time && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#C59A4E] text-[13px] sm:text-[14.5px] md:text-[16px] font-medium uppercase tracking-[0.12em] mb-2.5"
          >
            {time}
          </motion.p>
        )}

        {/* Ornamental divider */}
        <motion.div variants={lineAnim} className="flex items-center gap-2 mb-3 opacity-75">
          <div className="w-10 h-[0.8px] bg-[#C59A4E]" />
          <span className="text-[8px] text-[#C59A4E]">✦</span>
          <div className="w-10 h-[0.8px] bg-[#C59A4E]" />
        </motion.div>

        {/* Location — Cinzel Semibold */}
        {location && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[#7A1228] text-[13px] sm:text-[14.5px] md:text-[15.5px] font-semibold uppercase tracking-[0.08em] leading-relaxed mb-4 max-w-[380px]"
          >
            {location}
          </motion.p>
        )}

        {/* Map Link Button if provided */}
        {mapLink && (
          <motion.a
            variants={lineAnim}
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#C59A4E]/60 text-[#7A1228] text-[12px] sm:text-[13px] font-['Cinzel'] uppercase font-bold tracking-[0.14em] shadow-[0_4px_12px_rgba(122,18,40,0.08)] hover:bg-[#FAF5EB] transition-colors"
          >
            <span className="text-[10px] text-[#C59A4E]">✦</span>
            View Location
            <span className="text-[10px] text-[#C59A4E]">✦</span>
          </motion.a>
        )}
      </motion.div>
    </section>
  )
}
