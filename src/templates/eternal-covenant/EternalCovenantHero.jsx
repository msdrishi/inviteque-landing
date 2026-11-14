import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, FONTS, ASSETS, CovenantCrossDivider, slowLineAnim, slowContainerAnim } from './theme'
import FallingPetals from './FallingPetals'

export default function EternalCovenantCoverAndHero({
  data = {},
  isDesktop = false,
  isPreview = false,
  hasOpened = false,
  onOpen = () => {},
}) {
  const bride = data.brideName || 'SHREYA'
  const groom = data.groomName || 'SUMIT'

  const rawDate = data.weddingDate || '2026-11-27'
  let dayOfWeek = 'FRIDAY'
  let monthName = 'NOVEMBER'
  let dayNum = '27'
  let yearNum = '2026'

  try {
    const d = new Date(rawDate)
    if (!isNaN(d.getTime())) {
      dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
      monthName = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
      dayNum = String(d.getDate())
      yearNum = String(d.getFullYear())
    }
  } catch (e) {
    // fallback
  }

  // Clean wedding time (remove any accidental double 'onwards')
  const rawWeddingTime = data.weddingTime || '7:00 PM'
  const cleanWeddingTime = rawWeddingTime.replace(/onwards/gi, '').trim()

  const churchName = data.churchName || data.venueName || 'St. Mary’s Cathedral'
  const city = data.city || 'Bangalore, India'

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        minHeight: '100svh',
        backgroundColor: COLORS.bgWhite,
      }}
    >
      {/* ── 1. TAP TO OPEN / COVER SCREEN LAYER ───────────────────────── */}
      <AnimatePresence>
        {!hasOpened && (
          <motion.div
            key="cover-layer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={onOpen}
            className="absolute inset-0 z-30 flex flex-col items-center justify-between cursor-pointer px-4 pt-16 pb-6 overflow-hidden"
            style={{
              backgroundColor: '#1E4717',
            }}
          >
            {/* Clean Emerald Background with authentic minimal gold border and top crest */}
            <img
              src={ASSETS.plainBg}
              alt="Royal Emerald Wedding Stationery"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
              loading="eager"
            />

            {/* Subtle floating rose petals */}
            <FallingPetals count={8} height="100svh" />

            {/* Content Container (Perfect vertical balance) */}
            <div className="relative z-20 w-full max-w-[340px] flex flex-col items-center text-center mt-6">
              
              {/* ── TEXT SECTION 1: WEDDING INVITATION ── */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center"
              >
                <h1
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    color: '#F4ECD8', // Warm Soft Champagne Cream
                    textTransform: 'uppercase',
                    lineHeight: '1.25',
                  }}
                >
                  WEDDING INVITATION
                </h1>

                {/* Subtle refined gold divider line */}
                <div className="flex items-center justify-center gap-2 mt-4 mb-3 w-32">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
                  <span style={{ color: '#D4AF37', fontSize: '9px', lineHeight: 1 }}>◆</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
                </div>
              </motion.div>

              {/* ── TEXT SECTION 2: A CELEBRATION OF LOVE ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center mt-1"
              >
                <p
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.26em',
                    color: '#E8D5A7', // Light Antique Gold
                    textTransform: 'uppercase',
                  }}
                >
                  A CELEBRATION OF LOVE
                </p>
              </motion.div>

              {/* ── INTERACTIVE SECTION: ONE PROMINENT TAP TO OPEN BUTTON ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center mt-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.03, 1],
                    boxShadow: [
                      '0 4px 18px rgba(0, 0, 0, 0.32), 0 0 10px rgba(212, 175, 55, 0.35)',
                      '0 6px 26px rgba(0, 0, 0, 0.48), 0 0 22px rgba(212, 175, 55, 0.65)',
                      '0 4px 18px rgba(0, 0, 0, 0.32), 0 0 10px rgba(212, 175, 55, 0.35)',
                    ],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="pointer-events-auto flex items-center justify-center gap-2.5 rounded-full cursor-pointer px-8 py-3"
                  style={{
                    backgroundColor: '#FAF5EC',
                    border: '1.5px solid #C5A059',
                    boxShadow: '0 0 0 2.5px rgba(197, 160, 89, 0.35)',
                    color: '#1A4317',
                    fontFamily: FONTS.label,
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>TAP TO OPEN</span>
                  <span style={{ fontSize: '13px', marginLeft: '2px' }}>→</span>
                </motion.div>
              </motion.div>

            </div>

            {/* Bottom spacer reserving room for prominent bouquet */}
            <div className="h-44 sm:h-52 w-full pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. PERSISTENT TRAVELING BOUQUET (Transparent PNG/WebP) ──────── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none select-none"
        style={{
          position: 'absolute',
          left: '50%',
          zIndex: 35,
        }}
        initial={false}
        animate={
          hasOpened
            ? {
                top: isDesktop ? '31.5%' : '33.5%',
                x: '-50%',
                y: '-50%',
                width: isDesktop ? '140px' : '115px',
                opacity: 1,
              }
            : {
                top: '79%',
                x: '-50%',
                y: '-40%',
                width: isDesktop ? '330px' : '295px',
                opacity: 1,
              }
        }
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {!hasOpened && (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full"
            style={{
              transform: 'scale(0.85) translateY(14px)',
              background: 'radial-gradient(circle, rgba(10, 26, 8, 0.6) 0%, rgba(10, 26, 8, 0.28) 45%, transparent 70%)',
              filter: 'blur(16px)',
            }}
          />
        )}

        <img
          src={ASSETS.bouquet}
          alt="Wedding Bouquet"
          className="w-full h-auto object-contain"
          style={{
            filter: hasOpened
              ? 'drop-shadow(0px 6px 14px rgba(0,0,0,0.18))'
              : 'drop-shadow(0px 14px 28px rgba(0,0,0,0.45)) drop-shadow(0px 4px 10px rgba(0,0,0,0.25))',
          }}
          draggable={false}
        />
      </motion.div>

      {/* ── 3. HERO SECTION (Midnight Waltz Inspired Editorial Layout) ───── */}
      <section
        id="hero"
        className="w-full min-h-[100svh] flex flex-col items-center justify-between relative overflow-hidden"
        style={{
          backgroundColor: COLORS.bgWhite,
          color: COLORS.darkText,
        }}
      >
        {/* Full Hero Illustration Background (Church & Couple) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hasOpened ? 1 : 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 pointer-events-none select-none z-0"
        >
          <img
            src={ASSETS.heroBg}
            alt="Church & Couple Illustration"
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
        </motion.div>

        {/* Rose falling petals in Hero section */}
        {hasOpened && <FallingPetals count={16} height="100svh" />}

        {/* Top Spacer: Leaves ample clearance for church & couple illustration */}
        <div
          aria-hidden="true"
          className="w-full pointer-events-none"
          style={{ height: isDesktop ? '43svh' : '44.5svh' }}
        />

        {/* ── BOTTOM AREA HERO CONTENT (Midnight Waltz Style) ── */}
        <motion.div
          variants={slowContainerAnim}
          initial="hidden"
          animate={hasOpened ? 'show' : 'hidden'}
          className="w-full max-w-[340px] px-4 flex flex-col items-center text-center relative z-10 pb-4"
        >
          {/* 1. INVITATION LABEL */}
          <motion.p
            variants={slowLineAnim}
            style={{
              fontFamily: FONTS.label,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.24em',
              color: '#8C6D37',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            YOU ARE CORDIALLY INVITED TO THE WEDDING OF
          </motion.p>

          {/* 2. COUPLE NAMES */}
          <motion.div variants={slowLineAnim} className="flex flex-col items-center my-0.5">
            <h1
              style={{
                fontFamily: FONTS.heading,
                fontSize: '32px',
                fontWeight: 700,
                color: '#244B20',
                letterSpacing: '0.10em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
              }}
            >
              {bride}
            </h1>
            <span
              style={{
                fontFamily: FONTS.label,
                fontSize: '9.5px',
                color: '#8C6D37',
                letterSpacing: '0.3em',
                fontWeight: 600,
                margin: '2px 0',
              }}
            >
              AND
            </span>
            <h1
              style={{
                fontFamily: FONTS.heading,
                fontSize: '32px',
                fontWeight: 700,
                color: '#244B20',
                letterSpacing: '0.10em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
              }}
            >
              {groom}
            </h1>
          </motion.div>

          {/* 3. COVENANT CROSS DIVIDER */}
          <motion.div variants={slowLineAnim} className="my-2">
            <CovenantCrossDivider color="#8C6D37" width={140} />
          </motion.div>

          {/* 4. MIDNIGHT WALTZ STYLE DATE ROW: MONTH | DAY | YEAR */}
          <motion.div
            variants={slowLineAnim}
            className="flex items-center justify-center gap-3 mt-1 leading-none"
          >
            {/* Month */}
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: '15px',
                fontWeight: 700,
                color: '#244B20',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {monthName}
            </span>

            {/* Separator Pipe */}
            <span
              style={{
                color: '#8C6D37',
                fontSize: '18px',
                opacity: 0.65,
                fontFamily: 'serif',
                fontWeight: 300,
              }}
            >
              |
            </span>

            {/* Day Number (Prominent Feature) */}
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: '30px',
                fontWeight: 700,
                color: '#244B20',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              {dayNum}
            </span>

            {/* Separator Pipe */}
            <span
              style={{
                color: '#8C6D37',
                fontSize: '18px',
                opacity: 0.65,
                fontFamily: 'serif',
                fontWeight: 300,
              }}
            >
              |
            </span>

            {/* Year */}
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: '15px',
                fontWeight: 700,
                color: '#244B20',
                letterSpacing: '0.08em',
              }}
            >
              {yearNum}
            </span>
          </motion.div>

          {/* 5. DAY OF WEEK & TIME (Single clean line) */}
          <motion.p
            variants={slowLineAnim}
            style={{
              fontFamily: FONTS.label,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#8C6D37',
              marginTop: '5px',
              marginBottom: '6px',
            }}
          >
            {dayOfWeek} • {cleanWeddingTime} ONWARDS
          </motion.p>

          {/* 6. PIN LOCATION ICON */}
          <motion.div variants={slowLineAnim} className="mb-1">
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="#8C6D37"
              aria-hidden="true"
              style={{ opacity: 0.85 }}
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </motion.div>

          {/* 7. VENUE ADDRESS (Clean stacked layout) */}
          <motion.div
            variants={slowLineAnim}
            className="flex flex-col items-center text-center"
          >
            <p
              style={{
                fontFamily: FONTS.heading,
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#244B20',
                letterSpacing: '0.10em',
                lineHeight: 1.3,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {churchName}
            </p>
            <p
              style={{
                fontFamily: FONTS.body,
                fontSize: '11px',
                fontWeight: 500,
                color: '#6B7280',
                letterSpacing: '0.04em',
                lineHeight: 1.3,
                margin: '1px 0 0 0',
              }}
            >
              {city}
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 flex flex-col items-center pb-2 pointer-events-none"
        >
          <span
            style={{
              fontFamily: FONTS.label,
              fontSize: '8px',
              letterSpacing: '0.24em',
              color: '#8C6D37',
              textTransform: 'uppercase',
            }}
          >
            SCROLL TO EXPLORE
          </span>
          <svg
            className="w-3.5 h-3.5 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8C6D37"
            strokeWidth="1.6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>
    </div>
  )
}
