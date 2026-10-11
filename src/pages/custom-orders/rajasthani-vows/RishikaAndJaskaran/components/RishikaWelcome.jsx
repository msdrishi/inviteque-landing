import React from 'react'
import { motion } from 'framer-motion'

export default function RishikaWelcome({ data, bgImageDesktop, bgImageMobile, isDesktop = false }) {
  const lineAnim = {
    hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const bgSrc = isDesktop
    ? (bgImageDesktop || "/assets/templates/rajestani-vows/welcome-mobile.webp")
    : (bgImageMobile || "/assets/templates/rajestani-vows/welcome-mobile.webp")

  return (
    <section
      id="welcome"
      aria-label="Wedding Invitation"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: isDesktop ? '4svh' : '5svh',
        paddingBottom: '36px',
        userSelect: 'none',
        backgroundColor: '#FAF6EE',
      }}
    >
      {/* Background illustration */}
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

      {/* ── Content Container: Fully interactive line animation triggering smoothly upon reaching section ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
        }}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          width: '68%',
          maxWidth: isDesktop ? '440px' : '380px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Line 1: Shree Ganeshay Namah — Dark bold/dignified color, NOT yellow */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] text-[13.5px] sm:text-[15.5px] tracking-[0.24em] uppercase text-[#54121B] font-semibold mb-1.5"
        >
          {data?.line1 || "Shree Ganeshay Namah"}
        </motion.p>

        {/* Small ruby diamond ornament divider */}
        <motion.div variants={lineAnim} className="flex items-center gap-2 mb-3 opacity-60">
          <div className="w-8 h-[0.8px] bg-[#7A1228]" />
          <span className="text-[7px] text-[#7A1228]">✦</span>
          <div className="w-8 h-[0.8px] bg-[#7A1228]" />
        </motion.div>

        {/* Line 2: Smt Swadesh Sharma (NO BOLD as requested, dark color) */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] text-[15px] sm:text-[17px] tracking-[0.14em] uppercase text-[#7A1228] font-normal mb-0.5"
        >
          {data?.line2 || "Smt Swadesh Sharma"}
        </motion.p>

        {/* Line 3: (W/O Sh. Upender Prakash Kashyap) — Dark color */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] text-[11.5px] sm:text-[13px] tracking-[0.08em] uppercase text-[#54121B] font-normal mb-3"
        >
          {data?.line3 || "(W/O Sh. Upender Prakash Kashyap)"}
        </motion.p>

        {/* Line 4: cordially invite you to the Wedding of their beloved grandaughter — Dark color */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] text-[12px] sm:text-[13.5px] tracking-[0.07em] uppercase text-[#7A1228] font-normal leading-relaxed mb-3 max-w-[340px]"
        >
          {data?.line4 || "cordially invite you to the Wedding of their beloved grandaughter"}
        </motion.p>

        {/* Small ruby diamond divider */}
        <motion.div variants={lineAnim} className="flex items-center gap-2 mb-3 opacity-60">
          <div className="w-8 h-[0.8px] bg-[#7A1228]" />
          <span className="text-[7px] text-[#7A1228]">✦</span>
          <div className="w-8 h-[0.8px] bg-[#7A1228]" />
        </motion.div>

        {/* Line 5: Rishika (BOLD ONLY, dark royal crimson) */}
        <motion.span
          variants={lineAnim}
          className="font-['Cinzel'] font-bold text-[25px] sm:text-[29px] tracking-[0.14em] uppercase text-[#7A1228] leading-tight block"
        >
          {data?.bride || "Rishika"}
        </motion.span>

        {/* Line 6: (D/o Bindu and Ashutosh Kashyap) — Dark, prominent, crisp, NOT yellow! */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] font-semibold text-[13px] sm:text-[14.5px] text-[#54121B] tracking-[0.08em] uppercase mt-1 mb-2.5 max-w-[340px]"
        >
          {data?.brideParent || "(D/o Bindu and Ashutosh Kashyap)"}
        </motion.p>

        {/* Line 7: With — Dark color, NOT yellow! */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] italic text-[13.5px] sm:text-[15.5px] text-[#7A1228] font-medium tracking-[0.12em] my-1 uppercase"
        >
          {data?.conjunction || "With"}
        </motion.p>

        {/* Line 8: Major Jaskaran (BOLD ONLY, dark royal crimson) */}
        <motion.span
          variants={lineAnim}
          className="font-['Cinzel'] font-bold text-[25px] sm:text-[29px] tracking-[0.14em] uppercase text-[#7A1228] leading-tight block mt-1"
        >
          {data?.groom || "Major Jaskaran"}
        </motion.span>

        {/* Line 9: (S/o Sukhwinder Kaur and Hon. Capt Rajinder Pal Singh (Retd) ) — Dark, prominent, crisp, NOT yellow! */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] font-semibold text-[13px] sm:text-[14.5px] text-[#54121B] tracking-[0.08em] uppercase mt-1 max-w-[340px] leading-snug"
        >
          {data?.groomParent || "(S/o Sukhwinder Kaur and Hon. Capt Rajinder Pal Singh (Retd) )"}
        </motion.p>
      </motion.div>
    </section>
  )
}
