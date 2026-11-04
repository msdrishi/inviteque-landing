import React from 'react'
import { motion } from 'framer-motion'
import {
  COLORS,
  FONTS,
  ASSETS,
  LotusDivider,
  DiamondDivider,
  slowLineAnim,
  slowContainerAnim,
} from './theme'

export default function SouthernSerenadeWelcome({ data = {}, isDesktop = false }) {
  const welcomeMessage =
    data.message ||
    'With the divine blessings of the Almighty and our elders, we cordially invite you and your family to celebrate the sacred union of our children. Your presence, love, and prayers will make this joyous occasion truly unforgettable.'

  return (
    <section
      id="welcome"
      aria-label="Welcome and Invitation"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        // Text is placed in the clear upper-middle negative space above the kalash tray
        paddingTop: isDesktop ? '14svh' : '11svh',
        paddingBottom: isDesktop ? '38svh' : '36svh',
        paddingLeft: 22,
        paddingRight: 22,
        boxSizing: 'border-box',
      }}
    >
      {/* Background Artwork: South Indian Welcome Tray with Kalash */}
      <img
        src={ASSETS.welcomeTray}
        alt="South Indian Welcome Tray with Kalash"
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

      {/* ── Content Container: NO div banner! Clean typography directly on background ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={slowContainerAnim}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: isDesktop ? 620 : 380,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Top Label */}
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: isDesktop ? '12px' : '11.5px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            margin: '0 0 6px 0',
            fontWeight: 700,
          }}
        >
          AUSPICIOUS INVITATION
        </motion.p>

        {/* Heading */}
        <motion.h2
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.heading,
            fontSize: isDesktop ? '2.5rem' : '2.05rem',
            color: COLORS.primary,
            margin: '0 0 6px 0',
            lineHeight: 1.15,
            letterSpacing: '0.04em',
            fontWeight: 'normal',
          }}
        >
          Dear Friends & Family
        </motion.h2>

        <motion.div variants={slowLineAnim}>
          <LotusDivider color={COLORS.gold} width={140} />
        </motion.div>

        {/* Body Message */}
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.body,
            fontSize: isDesktop ? '19.5px' : '17px',
            lineHeight: 1.65,
            color: COLORS.darkText,
            margin: '18px auto',
            maxWidth: '96%',
            fontWeight: 500,
          }}
        >
          {welcomeMessage}
        </motion.p>

        <motion.div variants={slowLineAnim}>
          <DiamondDivider color={COLORS.gold} width={180} />
        </motion.div>

        {/* Warm closing tagline */}
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: isDesktop ? '11.5px' : '11px',
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            margin: '12px 0 0 0',
            fontWeight: 700,
          }}
        >
          JOIN US IN CELEBRATION & BLESSINGS
        </motion.p>
      </motion.div>
    </section>
  )
}
