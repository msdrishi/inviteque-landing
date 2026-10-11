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
        paddingTop: isDesktop ? '3.5svh' : '2.5svh',
        paddingBottom: '24px',
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
        viewport={{ once: false, amount: 0.25 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
        }}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          width: isDesktop ? '68%' : '78%',
          maxWidth: isDesktop ? '420px' : '360px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Line 1: Shree Ganeshay Namah — Dark dignified color, camel case */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '15.5px',
            letterSpacing: '0.06em',
            color: '#54121B',
            fontWeight: 600,
            marginBottom: '4px',
            textTransform: 'none',
          }}
        >
          {data?.line1 || "Shree Ganeshay Namah"}
        </motion.p>

        {/* Small ruby diamond ornament divider */}
        <motion.div variants={lineAnim} className="flex items-center gap-1.5 mb-2 opacity-60">
          <div className="w-7 h-[0.8px] bg-[#7A1228]" />
          <span className="text-[6.5px] text-[#7A1228]">✦</span>
          <div className="w-7 h-[0.8px] bg-[#7A1228]" />
        </motion.div>

        {/* Line 2: Smt Swadesh Sharma (same font size as cordially, NO BOLD, camel case) */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '14px',
            letterSpacing: '0.03em',
            color: '#7A1228',
            fontWeight: 500,
            marginBottom: '1px',
            textTransform: 'none',
          }}
        >
          {data?.line2 || "Smt Swadesh Sharma"}
        </motion.p>

        {/* Line 3: (W/O Sh. Upender Prakash Kashyap) — Dark color, camel case */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '12px',
            letterSpacing: '0.02em',
            color: '#54121B',
            fontWeight: 400,
            marginBottom: '5px',
            textTransform: 'none',
          }}
        >
          {data?.line3 || "(W/O Sh. Upender Prakash Kashyap)"}
        </motion.p>

        {/* Line 4: cordially invite you to the Wedding of their beloved grandaughter — Dark color, camel case */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '14px',
            letterSpacing: '0.02em',
            color: '#7A1228',
            fontWeight: 500,
            lineHeight: 1.35,
            marginBottom: '5px',
            maxWidth: '320px',
            textTransform: 'none',
          }}
        >
          {data?.line4 || "cordially invite you to the Wedding of their beloved grandaughter"}
        </motion.p>

        {/* Small ruby diamond divider */}
        <motion.div variants={lineAnim} className="flex items-center gap-1.5 mb-2 opacity-60">
          <div className="w-7 h-[0.8px] bg-[#7A1228]" />
          <span className="text-[6.5px] text-[#7A1228]">✦</span>
          <div className="w-7 h-[0.8px] bg-[#7A1228]" />
        </motion.div>

        {/* Line 5: Rishika (BOLD ONLY, dark royal crimson, camel case) */}
        <motion.span
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '25px',
            letterSpacing: '0.04em',
            color: '#7A1228',
            fontWeight: 700,
            lineHeight: 1.15,
            display: 'block',
            textTransform: 'none',
          }}
        >
          {data?.bride || "Rishika"}
        </motion.span>

        {/* Line 6: (D/o Bindu and Ashutosh Kashyap) — Dark, prominent, crisp, camel case */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '13px',
            letterSpacing: '0.02em',
            color: '#54121B',
            fontWeight: 600,
            marginTop: '2px',
            marginBottom: '4px',
            maxWidth: '340px',
            textTransform: 'none',
          }}
        >
          {data?.brideParent || "(D/o Bindu and Ashutosh Kashyap)"}
        </motion.p>

        {/* Line 7: With — Dark color, italic, camel case */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '14px',
            fontStyle: 'italic',
            letterSpacing: '0.04em',
            color: '#7A1228',
            fontWeight: 500,
            margin: '3px 0',
            textTransform: 'none',
          }}
        >
          {data?.conjunction || "With"}
        </motion.p>

        {/* Line 8: Major Jaskaran (BOLD ONLY, dark royal crimson, camel case) */}
        <motion.span
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '25px',
            letterSpacing: '0.04em',
            color: '#7A1228',
            fontWeight: 700,
            lineHeight: 1.15,
            display: 'block',
            marginTop: '2px',
            textTransform: 'none',
          }}
        >
          {data?.groom || "Major Jaskaran"}
        </motion.span>

        {/* Line 9: (S/o Sukhwinder Kaur and Hon. Capt Rajinder Pal Singh (Retd) ) — Dark, prominent, crisp, camel case */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '12.5px',
            letterSpacing: '0.02em',
            color: '#54121B',
            fontWeight: 600,
            marginTop: '2px',
            maxWidth: '340px',
            lineHeight: 1.35,
            textTransform: 'none',
          }}
        >
          {data?.groomParent || "(S/o Sukhwinder Kaur and Hon. Capt Rajinder Pal Singh (Retd) )"}
        </motion.p>
      </motion.div>
    </section>
  )
}
