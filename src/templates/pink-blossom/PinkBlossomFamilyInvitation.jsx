import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, ASSETS } from './theme'

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

// Animated Script Name with letter-by-letter reveal
const AnimatedFamilyName = ({ name, style }) => {
  const letters = Array.from(String(name || ''))
  return (
    <motion.h2 
      variants={letterContainer} 
      className="flex items-center justify-center overflow-visible flex-wrap text-center" 
      style={{ ...style, width: '100%' }}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          variants={letterAnim}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            overflow: 'visible'
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  )
}

export default function PinkBlossomFamilyInvitation({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet }) {
  const { cursive, serif, smallCaps } = fontStyles

  const family = data.familyInvitation || {}

  // Script name styling matching user reference image
  const scriptNameStyle = {
    fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
    color: '#C8195E',
    fontSize: isDesktop ? '58px' : (isTablet ? '64px' : '48px'),
    fontWeight: 'normal',
    lineHeight: 1.15,
    margin: 0,
    textShadow: '0 1px 2px rgba(255,255,255,0.6)'
  }

  // Parent / line styling matching user reference image
  const parentDetailsStyle = {
    fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
    color: '#5C381E',
    fontSize: isDesktop ? '13px' : (isTablet ? '13px' : '11.5px'),
    fontWeight: 600,
    letterSpacing: '0.12em',
    lineHeight: 1.6,
    textTransform: 'uppercase',
    textWrap: 'balance'
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
        <motion.div variants={lineAnim} style={{ width: '92%', marginBottom: '22px' }}>
          <p
            style={{
              ...serif,
              fontStyle: 'italic',
              fontSize: isDesktop ? '15.5px' : '14px',
              color: '#4A6741',
              lineHeight: 1.65,
              margin: 0,
              textWrap: 'balance'
            }}
          >
            {family.introQuote || "Two families, two hearts, one beautiful celebration of love. Join us as we begin our forever."}
          </p>
        </motion.div>

        {/* Delicate divider */}
        <motion.div variants={lineAnim} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', opacity: 0.6 }}>
          <span style={{ width: '30px', height: '1px', backgroundColor: '#C8195E' }} />
          <span style={{ color: '#C8195E', fontSize: '11px' }}>❧</span>
          <span style={{ width: '30px', height: '1px', backgroundColor: '#C8195E' }} />
        </motion.div>

        {/* Bride Section */}
        <motion.div variants={lineAnim} style={{ width: '92%', marginBottom: '14px' }}>
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
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(184, 150, 62, 0.35)' }} />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '11px',
              letterSpacing: '0.25em',
              fontWeight: 700,
              color: '#B8963E',
              textTransform: 'uppercase'
            }}
          >
            {family.connector || 'WEDS'}
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(184, 150, 62, 0.35)' }} />
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
            width: '92%',
            paddingTop: '16px',
            borderTop: '1px solid rgba(200, 25, 94, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span
            style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: '22px',
              color: '#C8195E',
              lineHeight: 1
            }}
          >
            on
          </span>

          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: isDesktop ? '13px' : '11.5px',
              fontWeight: 700,
              color: '#C8195E',
              letterSpacing: '0.15em',
              margin: '2px 0 0 0',
              textWrap: 'balance'
            }}
          >
            {family.weddingDateDetails || 'SUNDAY, 28TH FEBRUARY 2027'}
          </p>

          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: '#5C381E',
              margin: 0
            }}
          >
            {family.weddingTimeDetails || 'AT 12:14 PM ONWARDS'}
          </p>

          <div style={{ marginTop: '4px' }}>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '11px',
                fontWeight: 700,
                color: '#C8195E',
                letterSpacing: '0.12em',
                display: 'block'
              }}
            >
              {family.venueName || 'THE BLUE ROOF CLUB'}
            </span>
            <span
              style={{
                ...serif,
                fontSize: '12px',
                color: '#4A6741',
                lineHeight: 1.4,
                display: 'block',
                marginTop: '2px'
              }}
            >
              {family.venueLocation || 'Thane (West)'}
            </span>
          </div>
        </motion.div>

      </div>
    </motion.section>
  )
}
