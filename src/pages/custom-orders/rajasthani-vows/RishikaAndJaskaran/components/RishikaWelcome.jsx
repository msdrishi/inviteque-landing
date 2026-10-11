import React from 'react'
import { motion } from 'framer-motion'

export default function RishikaWelcome({ data, bgImageDesktop, bgImageMobile, isDesktop }) {
  if (!data) return null

  const lineAnim = {
    hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const bgSrc = isDesktop
    ? (bgImageDesktop || "/assets/templates/rajestani-vows/welcome-mobile.webp")
    : (bgImageMobile || "/assets/templates/rajestani-vows/welcome-mobile.webp")

  return (
    <section
      id="welcome"
      aria-label="Welcome Invitation"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: isDesktop ? '2.5svh' : '3.5svh',
        paddingBottom: '32px',
        userSelect: 'none',
      }}
    >
      <img
        src={bgSrc}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          zIndex: 0,
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.18 } },
        }}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          width: '75%',
          maxWidth: isDesktop ? '340px' : '285px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Subtle Welcome Header */}
        <motion.span
          variants={lineAnim}
          className="font-['Cinzel'] text-[11px] sm:text-[12px] tracking-[0.32em] uppercase text-[#C59A4E] font-bold block mb-2"
        >
          WELCOME
        </motion.span>

        {/* Small gold diamond divider */}
        <motion.div variants={lineAnim} className="flex items-center gap-2 mb-2.5 opacity-75">
          <div className="w-7 h-[0.7px] bg-[#C59A4E]" />
          <span className="text-[6px] text-[#C59A4E]">✦</span>
          <div className="w-7 h-[0.7px] bg-[#C59A4E]" />
        </motion.div>

        {/* Cordial Invitation Intro — beloved granddaughter content */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#8A1D33]/90 leading-relaxed mb-2.5 max-w-[265px]"
        >
          {data.introText || "cordially invite you to the Wedding of the beloved granddaughter of"}
        </motion.p>

        {/* Smt Swadesh Sharma — below the beloved granddaughter content */}
        {data.headingLine1 && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[12px] sm:text-[13px] tracking-[0.14em] uppercase text-[#7A1228] font-semibold mb-0.5"
          >
            {data.headingLine1}
          </motion.p>
        )}

        {data.headingLine2 && (
          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[9px] sm:text-[9.5px] tracking-[0.10em] uppercase text-[#8A1D33]/80 mb-2.5 max-w-[265px]"
          >
            {data.headingLine2}
          </motion.p>
        )}

        {/* Small gold diamond divider */}
        <motion.div variants={lineAnim} className="flex items-center gap-2 mb-2.5 opacity-75">
          <div className="w-7 h-[0.7px] bg-[#C59A4E]" />
          <span className="text-[6px] text-[#C59A4E]">✦</span>
          <div className="w-7 h-[0.7px] bg-[#C59A4E]" />
        </motion.div>

        {/* COUPLE TEXT: Normal Font Style (Cinzel) */}
        <motion.div
          variants={lineAnim}
          className="w-full my-2 flex flex-col items-center"
        >
          {/* Bride Name — Cinzel Bold Normal Font Style */}
          <span
            className="font-['Cinzel'] font-bold text-[18px] sm:text-[21px] tracking-[0.14em] uppercase text-[#7A1228] leading-tight block"
          >
            Rishika
          </span>
          <span className="font-['Cinzel'] italic text-[9.5px] sm:text-[10.5px] text-[#C59A4E] tracking-[0.10em] mt-0.5 mb-1.5 block max-w-[265px]">
            (D/o Bindu and Ashutosh Kashyap)
          </span>

          {/* with */}
          <span className="font-['Cinzel'] italic text-[11px] sm:text-[12px] text-[#A87B32] my-0.5 block">
            with
          </span>

          {/* Groom Name — Cinzel Bold Normal Font Style */}
          <span
            className="font-['Cinzel'] font-bold text-[18px] sm:text-[21px] tracking-[0.14em] uppercase text-[#7A1228] leading-tight block mt-1"
          >
            Major Jaskaran
          </span>
          <span className="font-['Cinzel'] italic text-[9.5px] sm:text-[10.5px] text-[#C59A4E] tracking-[0.08em] mt-0.5 block max-w-[265px] leading-tight">
            (S/o Sukhwinder Kaur and Hon. Capt Rajinder Pal Singh (Retd))
          </span>
        </motion.div>

        {/* Warm Blessings & Regard Message */}
        <motion.div variants={lineAnim} className="mt-3 flex flex-col items-center max-w-[265px]">
          {/* Small gold diamond divider */}
          <div className="flex items-center gap-2 mb-2 opacity-70">
            <div className="w-6 h-[0.6px] bg-[#C59A4E]" />
            <span className="text-[6px] text-[#C59A4E]">✦</span>
            <div className="w-6 h-[0.6px] bg-[#C59A4E]" />
          </div>

          <p className="font-['Cinzel'] text-[9.5px] sm:text-[10.5px] tracking-[0.05em] uppercase text-[#8A1D33]/90 leading-relaxed text-center mb-2">
            {data.closingMessage || "As we celebrate the new beginnings, your presence and blessings will make this day unforgettable and truly special"}
          </p>

          <p className="font-['Cinzel'] italic text-[10px] sm:text-[10.5px] text-[#C59A4E] tracking-[0.08em] text-center">
            {data.warmRegards || "With warm regards,"}
          </p>
          <p className="font-['Cinzel'] font-bold text-[11px] sm:text-[12px] tracking-[0.14em] uppercase text-[#7A1228] text-center mt-0.5">
            {data.familySignoff || "Kashyap’s family"}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
