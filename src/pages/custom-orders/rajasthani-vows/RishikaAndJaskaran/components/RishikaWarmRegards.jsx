import React from 'react'
import { motion } from 'framer-motion'

export default function RishikaWarmRegards({ data, isDesktop = false }) {
  const lineAnim = {
    hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const bgSrc = "/assets/templates/rajestani-vows/venue-mobile.webp"

  return (
    <section
      id="warm-regards"
      aria-label="Warm Regards"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Strictly in the TOP area as requested
        paddingTop: isDesktop ? '13svh' : '14svh',
        paddingBottom: '36px',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxSizing: 'border-box',
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
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* ── Content Container: In the TOP area, fully interactive line animation ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
        }}
        className="relative z-10 mx-auto text-center flex flex-col items-center py-4 px-2"
        style={{
          width: '68%',
          maxWidth: isDesktop ? '440px' : '380px',
        }}
      >
        {/* Subtle decorative ruby diamond icon */}
        <motion.div variants={lineAnim} className="flex items-center gap-2 mb-4 opacity-70">
          <div className="w-10 h-[0.8px] bg-[#7A1228]" />
          <span className="text-[9px] text-[#7A1228]">✦</span>
          <div className="w-10 h-[0.8px] bg-[#7A1228]" />
        </motion.div>

        {/* Closing Message — Line animation */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] text-[13.5px] sm:text-[15.5px] tracking-[0.06em] uppercase text-[#7A1228] font-medium leading-relaxed text-center mb-4 max-w-[360px]"
        >
          {data?.message || "As we celebrate the new beginnings, your presence and blessings will make this day unforgettable and truly special"}
        </motion.p>

        {/* Small ruby diamond divider */}
        <motion.div variants={lineAnim} className="flex items-center gap-2 my-2 opacity-65">
          <div className="w-8 h-[0.8px] bg-[#7A1228]" />
          <span className="text-[7px] text-[#7A1228]">✦</span>
          <div className="w-8 h-[0.8px] bg-[#7A1228]" />
        </motion.div>

        {/* With warm regards, — Line animation */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] italic text-[13.5px] sm:text-[15px] text-[#54121B] font-medium tracking-[0.08em] text-center mt-2"
        >
          {data?.regards || "With warm regards,"}
        </motion.p>

        {/* Kashyap’s — Line animation */}
        <motion.p
          variants={lineAnim}
          className="font-['Cinzel'] font-bold text-[19px] sm:text-[23px] tracking-[0.16em] uppercase text-[#7A1228] text-center mt-1"
        >
          {data?.signoff || "Kashyap’s"}
        </motion.p>
      </motion.div>
    </section>
  )
}
