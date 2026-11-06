import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, ASSETS } from './theme'
import ScrollDownIndicator from './ScrollDownIndicator'

const sectionAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.35, delayChildren: 0.2 } }
}

const lineAnim = {
  hidden: { opacity: 0, y: 22 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } 
  }
}

const letterContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
}

const letterAnim = {
  hidden: { opacity: 0, y: 16, rotateX: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } 
  }
}

// Animated Script Name for Family Invitation
const AnimatedFamilyName = ({ name, style }) => {
  return (
    <motion.h2 
      variants={lineAnim}
      className="flex items-center justify-center overflow-visible text-center" 
      style={{ ...style, width: '100%', whiteSpace: 'nowrap' }}
    >
      {name}
    </motion.h2>
  )
}

export default function PinkBlossomFamilyInvitation({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet }) {
  const { cursive, serif, smallCaps } = fontStyles

  const family = data.familyInvitation || {}

  // Script name styling matching user reference image with improved contrast and visibility
  const scriptNameStyle = {
    fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
    color: '#B01050',
    fontSize: isDesktop ? '72px' : (isTablet ? '74px' : '58px'),
    fontWeight: 'normal',
    lineHeight: 1.15,
    margin: 0,
    textShadow: '0 1px 3px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.7)',
    filter: 'drop-shadow(0 1px 2px rgba(176,16,80,0.15))'
  }

  // Parent / line styling matching user reference image with high readability
  const parentDetailsStyle = {
    fontFamily: "'Cinzel', 'Playfair Display', serif",
    color: '#2B1A0E',
    fontSize: isDesktop ? '15px' : (isTablet ? '15px' : '13.5px'),
    fontWeight: 700,
    letterSpacing: '0.14em',
    lineHeight: 1.7,
    textTransform: 'uppercase',
    textWrap: 'balance',
    whiteSpace: 'pre-line',
    textShadow: '0 1px 2px rgba(255,255,255,0.85)'
  }

  return (
    <motion.section
      style={{
        ...sectionStyle,
        minHeight: '100svh',
        height: 'auto',
        paddingTop: '60px',
        paddingBottom: '60px',
        position: 'relative'
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      variants={sectionAnim}
    >
      {/* Background same as photo card section */}
      <img
        src={family.bgImage || ASSETS.storyBg}
        alt="Invitation Background"
        style={bgStyle}
      />

      {/* Decorative Outer Border Card or direct text */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '84%',
          maxWidth: '380px',
          margin: '0 auto',
          padding: family.noCard ? '16px 8px' : '32px 18px',
          backgroundColor: family.noCard ? 'transparent' : 'rgba(255, 255, 255, 0.72)',
          backdropFilter: family.noCard ? 'none' : 'blur(3px)',
          borderRadius: family.noCard ? '0px' : '16px',
          border: family.noCard ? 'none' : '1.5px solid rgba(200, 25, 94, 0.22)',
          boxShadow: family.noCard ? 'none' : '0 10px 30px rgba(184, 150, 62, 0.12), inset 0 0 0 1px rgba(255,255,255,0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Top Flourish / Header quote */}
        <motion.div variants={lineAnim} style={{ width: '92%', maxWidth: '340px', marginBottom: '22px' }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Spectral', serif",
              fontSize: isDesktop ? '18px' : '17px',
              color: '#2E4427',
              lineHeight: 1.75,
              fontWeight: 600,
              margin: 0,
              textWrap: 'balance',
              textShadow: '0 1px 2px rgba(255,255,255,0.7)'
            }}
          >
            {family.introQuote || "Two families, two hearts, one beautiful celebration of love. Join us as we begin our forever."}
          </p>
        </motion.div>

        {/* Delicate divider */}
        <motion.div variants={lineAnim} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', opacity: 0.85 }}>
          <span style={{ width: '40px', height: '1.5px', backgroundColor: '#B01050' }} />
          <span style={{ color: '#B01050', fontSize: '14px' }}>❧</span>
          <span style={{ width: '40px', height: '1.5px', backgroundColor: '#B01050' }} />
        </motion.div>

        {/* Bride Section */}
        <motion.div variants={lineAnim} style={{ width: '92%', marginBottom: '16px' }}>
          <AnimatedFamilyName name={family.brideName || 'Alina'} style={scriptNameStyle} />
          <p style={{ ...parentDetailsStyle, marginTop: '4px', marginBottom: 0 }}>
            {family.brideParents || 'D/O Mrs. Akhilesh Sharma & Mr. Salman Kausar'}
          </p>
        </motion.div>

        {/* WEDS connector */}
        <motion.div
          variants={lineAnim}
          style={{
            margin: '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '80%'
          }}
        >
          <div style={{ flex: 1, height: '1.5px', backgroundColor: 'rgba(184, 150, 62, 0.65)' }} />
          <span
            style={{
              fontFamily: "'Cinzel', 'Playfair Display', serif",
              fontSize: '12px',
              letterSpacing: '0.24em',
              fontWeight: 700,
              color: '#8A6715',
              textTransform: 'uppercase',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            {family.connector || 'WEDS'}
          </span>
          <div style={{ flex: 1, height: '1.5px', backgroundColor: 'rgba(184, 150, 62, 0.65)' }} />
        </motion.div>

        {/* Groom Section */}
        <motion.div variants={lineAnim} style={{ width: '92%', marginTop: '10px', marginBottom: '22px' }}>
          <AnimatedFamilyName name={family.groomName || 'Tanmay'} style={scriptNameStyle} />
          <p style={{ ...parentDetailsStyle, marginTop: '4px', marginBottom: 0 }}>
            {family.groomParents || 'S/O Mrs. Sheetal and Mr. Vikas Ramchandra Deshmukh'}
          </p>
        </motion.div>

        {/* on - Wedding date, time and venue */}
        <motion.div
          variants={lineAnim}
          style={{
            width: '94%',
            paddingTop: '16px',
            borderTop: '1.5px solid rgba(200, 25, 94, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span
            style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: '28px',
              fontWeight: 'normal',
              color: '#B01050',
              lineHeight: 1,
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            on
          </span>

          <p
            style={{
              fontFamily: "'Cinzel', 'Playfair Display', serif",
              fontSize: isDesktop ? '15px' : '13.5px',
              fontWeight: 700,
              color: '#C8195E',
              letterSpacing: '0.14em',
              margin: '2px 0 0 0',
              textWrap: 'balance',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            {family.weddingDateDetails || 'SUNDAY, 28TH FEBRUARY 2027'}
          </p>

          <p
            style={{
              fontFamily: "'Cinzel', 'Playfair Display', serif",
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#3B2210',
              margin: 0,
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            {family.weddingTimeDetails || 'AT 12:14 PM ONWARDS'}
          </p>

          <div style={{ marginTop: '6px' }}>
            <span
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', serif",
                fontSize: '14px',
                fontWeight: 700,
                color: '#C8195E',
                letterSpacing: '0.14em',
                display: 'block',
                textShadow: '0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              {family.venueName || 'THE BLUE ROOF CLUB'}
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', 'Spectral', serif",
                fontSize: isDesktop ? '17px' : '16px',
                fontWeight: 600,
                color: '#2E4427',
                lineHeight: 1.55,
                display: 'block',
                marginTop: '3px',
                textShadow: '0 1px 2px rgba(255,255,255,0.7)'
              }}
            >
              {family.venueLocation || 'Thane (West)'}
            </span>
          </div>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <ScrollDownIndicator />
    </motion.section>
  )
}
