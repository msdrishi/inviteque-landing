import React from 'react'
import { motion } from 'framer-motion'

const heroBg = "/assets/templates/royal-heritage/hero-mobile.webp"

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: "easeOut" } 
  },
}

const sectionAnim = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 1.5, staggerChildren: 0.3 } 
  }
}

export default function TemplateRoyalHeritageHero({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet }) {
  const { cursive, serif, smallCaps } = fontStyles;

  return (
    <motion.section 
      style={sectionStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={sectionAnim}
    >
      <img src={heroBg} alt="Hero Background" style={bgStyle} />
      
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 20px' }}>
        
        {/* Intro text */}
        <motion.p variants={fadeAnim} style={{ ...smallCaps, marginBottom: '4px' }}>
          TOGETHER
        </motion.p>
        <motion.p variants={fadeAnim} style={{ ...smallCaps, marginBottom: '15px' }}>
          WITH OUR FAMILIES
        </motion.p>

        <motion.p variants={fadeAnim} style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontStyle: 'italic', 
          color: '#4A3E20',
          fontSize: isDesktop ? '18px' : '15px',
          marginBottom: '20px'
        }}>
          We warmly invite you to<br/>celebrate the wedding of
        </motion.p>

        {/* Names */}
        <motion.h1 variants={fadeAnim} style={{ ...cursive, fontSize: isDesktop ? '80px' : (isTablet ? '90px' : '65px'), margin: '0' }}>
          {data.hero.brideName}
        </motion.h1>
        
        <motion.p variants={fadeAnim} style={{ ...smallCaps, margin: '10px 0' }}>
          AND
        </motion.p>
        
        <motion.h1 variants={fadeAnim} style={{ ...cursive, fontSize: isDesktop ? '80px' : (isTablet ? '90px' : '65px'), margin: '0 0 25px 0' }}>
          {data.hero.groomName}
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={fadeAnim} style={{ ...smallCaps, letterSpacing: '0.15em', marginBottom: '4px' }}>
          TWO HEARTS &bull; ONE JOURNEY
        </motion.p>
        <motion.p variants={fadeAnim} style={{ ...smallCaps, letterSpacing: '0.15em', marginBottom: '30px' }}>
          A LIFETIME TOGETHER
        </motion.p>

        {/* Date Row */}
        <motion.div variants={fadeAnim} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          borderTop: '1px solid #8A202A',
          borderBottom: '1px solid #8A202A',
          padding: '15px 0',
          marginBottom: '40px',
          width: '80%',
          maxWidth: '400px'
        }}>
          <div style={{ flex: 1, textAlign: 'center', ...smallCaps, color: '#8A202A' }}>
            {data.hero.dayOfWeek || 'SUNDAY'}
          </div>
          <div style={{ padding: '0 20px', borderLeft: '1px solid #8A202A', borderRight: '1px solid #8A202A', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 'bold', color: '#8A202A', lineHeight: 1 }}>
              {data.hero.weddingDate || '14'}
            </div>
            <div style={{ ...smallCaps, color: '#8A202A', fontSize: '14px', marginTop: '6px', fontWeight: 'bold' }}>
              {(data.hero.weddingMonth || 'JANUARY').substring(0,3)} {data.hero.weddingYear || '2024'}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', ...smallCaps, color: '#8A202A' }}>
            AT {data.hero.weddingTime || '1:00 PM'}
          </div>
        </motion.div>

        {/* Venue */}
        <motion.div variants={fadeAnim} style={{ paddingBottom: '30px' }}>
          <p style={{ ...smallCaps, fontWeight: 'bold', color: '#8A202A', marginBottom: '8px', fontSize: '14px' }}>
            {data.hero.mahalName}
          </p>
          <p style={{ ...smallCaps, fontSize: '12px', color: '#4A3E20', letterSpacing: '0.1em' }}>
            {data.venue?.venueAddress}<br/>{data.venue?.venueCity}, {data.venue?.state}
          </p>
        </motion.div>

      </div>
    </motion.section>
  )
}
