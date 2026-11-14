import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, FONTS, ASSETS, slowLineAnim, slowContainerAnim, CovenantCrossDivider } from './theme'

export default function EternalCovenantVenue({ data }) {
  const churchName = data?.churchName || data?.venueName || 'St. Mary’s Cathedral'
  const addressLine1 = data?.addressLine1 || '80 Residency Road'
  const addressLine2 = data?.addressLine2 || 'Richmond Town, Bengaluru'
  const pincode = data?.pincode || 'Karnataka 560025'
  const googleMapsUrl = data?.googleMapsUrl || 'https://maps.google.com'

  return (
    <section
      className="w-full min-h-[100svh] flex flex-col items-center justify-between relative overflow-hidden"
      style={{
        backgroundColor: COLORS.bgWhite,
        color: COLORS.darkText,
      }}
    >
      {/* Full Venue Background Illustration without fade out */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={ASSETS.venueBg}
          alt=""
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* TOP AREA TEXT CONTENT (Text content in top area, crystal clear with drop-shadow) */}
      <motion.div
        variants={slowContainerAnim}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        className="relative z-10 w-full max-w-sm px-6 text-center flex flex-col items-center pt-16 pb-8 mx-auto"
      >
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            fontWeight: 700,
            textShadow: '0 1px 4px rgba(255,255,255,0.9)',
            marginBottom: '6px',
          }}
        >
          Ceremony Location
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
            textShadow: '0 2px 8px rgba(255,255,255,0.95)',
            marginBottom: '6px',
          }}
        >
          {churchName}
        </motion.h2>

        <motion.div variants={slowLineAnim} className="my-1">
          <CovenantCrossDivider color={COLORS.gold} width={130} />
        </motion.div>

        <motion.div variants={slowLineAnim} className="my-2">
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: '16px',
              color: COLORS.darkText,
              fontWeight: 500,
              lineHeight: 1.6,
              textShadow: '0 1px 6px rgba(255,255,255,0.9)',
            }}
          >
            {addressLine1}<br />
            {addressLine2}<br />
            {pincode}
          </p>
        </motion.div>

        <motion.div variants={slowLineAnim} className="mt-4">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              fontFamily: FONTS.label,
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              backgroundColor: COLORS.primary,
              borderRadius: '2px',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(45,90,39,0.35)',
              fontWeight: 600,
            }}
          >
            <span>Get Directions</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </motion.div>

      {/* Spacer reserving the bottom space for the cathedral artwork */}
      <div className="w-full h-64 pointer-events-none" />
    </section>
  )
}
