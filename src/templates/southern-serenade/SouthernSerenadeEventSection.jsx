import React from 'react'
import { motion } from 'framer-motion'
import {
  COLORS,
  FONTS,
  LotusDivider,
  PinIcon,
  slowLineAnim,
  slowContainerAnim,
} from './theme.jsx'

export default function SouthernSerenadeEventSection({ event, isDesktop = false }) {
  if (!event) return null

  return (
    <section
      id={event.id}
      aria-label={event.title}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        // Text kept strictly in the top-to-middle area, leaving bottom artwork completely clear
        paddingTop: isDesktop ? '11svh' : '9.5svh',
        paddingBottom: isDesktop ? '38svh' : '36svh',
        paddingLeft: 20,
        paddingRight: 20,
        boxSizing: 'border-box',
      }}
    >
      {/* Background Illustration */}
      <img
        src={event.bgImage}
        alt={event.title}
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
        loading="lazy"
      />

      {/* ── Content Container: Clean typography directly on artwork (No div banners) ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={slowContainerAnim}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: isDesktop ? 540 : 380,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* 1. Event Title */}
        <motion.h2
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.heading,
            fontSize: isDesktop ? '2.3rem' : '1.85rem',
            color: COLORS.primary,
            margin: '0 0 6px 0',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            fontWeight: 'normal',
          }}
        >
          {event.title}
        </motion.h2>

        {/* 2. Winged Lotus Divider */}
        <motion.div variants={slowLineAnim} style={{ marginBottom: 10 }}>
          <LotusDivider color={COLORS.gold} width={130} />
        </motion.div>

        {/* 3. Date (and Time only if present in data) */}
        <motion.div
          variants={slowLineAnim}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            margin: '2px 0 8px 0',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.label,
              fontSize: isDesktop ? '13px' : '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: COLORS.primary,
              fontWeight: 700,
            }}
          >
            {event.date}
          </span>
          {event.time && (
            <>
              <span style={{ color: COLORS.gold, opacity: 0.6 }}>|</span>
              <span
                style={{
                  fontFamily: FONTS.label,
                  fontSize: isDesktop ? '12px' : '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: COLORS.secondary,
                  fontWeight: 600,
                }}
              >
                {event.time}
              </span>
            </>
          )}
        </motion.div>

        {/* 4. Venue Details */}
        <motion.div variants={slowLineAnim} style={{ margin: '2px 0 10px 0' }}>
          <p
            style={{
              fontFamily: FONTS.heading,
              fontSize: isDesktop ? '1.25rem' : '1.15rem',
              color: COLORS.primary,
              margin: '0 0 2px 0',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {event.venue}
          </p>
        </motion.div>

        {/* 5. Description (only if present in data) */}
        {event.description && (
          <motion.p
            variants={slowLineAnim}
            style={{
              fontFamily: FONTS.body,
              fontSize: isDesktop ? '17px' : '15.5px',
              lineHeight: 1.55,
              color: COLORS.darkText,
              margin: '4px auto 14px auto',
              maxWidth: '94%',
              fontWeight: 500,
              fontStyle: 'italic',
            }}
          >
            "{event.description}"
          </motion.p>
        )}

        {/* 6. Action Buttons: Directions & Optional Live Stream */}
        <motion.div
          variants={slowLineAnim}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 4,
          }}
        >
          {event.mapUrl && (
            <motion.a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px 24px',
                borderRadius: 30,
                background: COLORS.primary,
                color: '#FDFBF7',
                fontFamily: FONTS.label,
                fontSize: '11.5px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: 700,
                boxShadow: '0 6px 18px rgba(115, 25, 36, 0.25)',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <PinIcon size={14} color="#FDFBF7" />
              GET DIRECTIONS
            </motion.a>
          )}

          {event.hasLiveLink && (
            <motion.a
              href={event.liveUrl || '#'}
              target={event.liveUrl ? '_blank' : undefined}
              rel={event.liveUrl ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (!event.liveUrl) {
                  e.preventDefault()
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px 22px',
                borderRadius: 30,
                background: 'rgba(253, 251, 247, 0.95)',
                color: COLORS.primary,
                border: `1.5px solid ${COLORS.primary}`,
                fontFamily: FONTS.label,
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(115, 25, 36, 0.15)',
                cursor: event.liveUrl ? 'pointer' : 'default',
              }}
              whileHover={event.liveUrl ? { scale: 1.04 } : undefined}
              whileTap={event.liveUrl ? { scale: 0.96 } : undefined}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              LIVE LINK
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

