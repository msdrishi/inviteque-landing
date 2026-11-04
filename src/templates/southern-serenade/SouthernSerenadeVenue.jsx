import React from 'react'
import { motion } from 'framer-motion'
import {
  COLORS,
  FONTS,
  ASSETS,
  LotusDivider,
  PinIcon,
  slowLineAnim,
  slowContainerAnim,
} from './theme'

export default function SouthernSerenadeVenue({ data = {}, isDesktop = false }) {
  const venueName = data.venueName || 'SRI NARAYANA VANAM'
  const mapUrl = data.mapUrl || 'https://maps.google.com'

  const line1 = data.venueLine1 || 'Sri Narayana Vanam Mahal, Financial District'
  const line2 = data.venueLine2 || 'Gachibowli, Hyderabad, Telangana'

  // QR Code URL via public QR API
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    mapUrl
  )}&size=220x220&color=731924&bgcolor=FAF6EF&qzone=2&format=png`

  return (
    <section
      id="venue"
      aria-label="Wedding Venue - Southern Serenade"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        paddingTop: isDesktop ? '12svh' : '10svh',
        paddingBottom: isDesktop ? '38svh' : '36svh', // Space for the bottom mandap house
        paddingLeft: 20,
        paddingRight: 20,
        boxSizing: 'border-box',
      }}
    >
      {/* Background artwork */}
      <img
        src={ASSETS.venueBg}
        alt="Venue Mandapam Illustration"
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
          maxWidth: isDesktop ? 520 : 370,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: isDesktop ? '12px' : '11.5px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            margin: '0 0 5px 0',
            fontWeight: 700,
          }}
        >
          CELEBRATION VENUE
        </motion.p>

        <motion.h2
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.heading,
            fontSize: isDesktop ? '2.2rem' : '1.85rem',
            color: COLORS.primary,
            margin: '0 0 6px 0',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            fontWeight: 'normal',
          }}
        >
          {venueName}
        </motion.h2>

        <motion.div variants={slowLineAnim} style={{ marginBottom: 12 }}>
          <LotusDivider color={COLORS.gold} width={135} />
        </motion.div>

        {/* Address Lines */}
        <motion.div variants={slowLineAnim} style={{ marginBottom: 16 }}>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: isDesktop ? '17.5px' : '16px',
              color: COLORS.darkText,
              margin: '0 0 4px 0',
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {line1}
          </p>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: isDesktop ? '16px' : '15px',
              color: COLORS.secondary,
              margin: 0,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {line2}
          </p>
        </motion.div>

        {/* QR Code */}
        {mapUrl && (
          <motion.div
            variants={slowLineAnim}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '10px 0 16px 0',
            }}
          >
            <div
              style={{
                padding: 7,
                background: '#FAF6EF',
                border: `1.2px solid ${COLORS.borderGold}`,
                borderRadius: 14,
                boxShadow: '0 4px 14px rgba(115, 25, 36, 0.08)',
              }}
            >
              <img
                src={qrSrc}
                alt="Scan for Directions"
                width={105}
                height={105}
                style={{ display: 'block', borderRadius: 8 }}
                loading="lazy"
              />
            </div>
            <span
              style={{
                fontFamily: FONTS.label,
                fontSize: '10.5px',
                letterSpacing: '0.18em',
                color: COLORS.secondary,
                marginTop: 6,
                fontWeight: 700,
              }}
            >
              SCAN FOR LOCATION
            </span>
          </motion.div>
        )}

        {/* Action Button: Get Directions */}
        {mapUrl && (
          <motion.a
            variants={slowLineAnim}
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 28px',
              borderRadius: 30,
              background: COLORS.primary,
              color: '#FDFBF7',
              fontFamily: FONTS.label,
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 700,
              boxShadow: '0 6px 18px rgba(115, 25, 36, 0.28)',
              transition: 'transform 0.2s',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <PinIcon size={15} color="#FDFBF7" />
            GET DIRECTIONS
          </motion.a>
        )}
      </motion.div>
    </section>
  )
}
