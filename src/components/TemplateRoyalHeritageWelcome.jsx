import React from 'react'
import { motion } from 'framer-motion'

const welcomeBg = "/assets/templates/royal-heritage/welcome-section-mobile.webp"

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

export default function TemplateRoyalHeritageWelcome({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet }) {
  const { cursive, serif, smallCaps } = fontStyles;

  return (
    <motion.section 
      style={sectionStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={sectionAnim}
    >
      <img src={welcomeBg} alt="Welcome Background" style={bgStyle} />
      <motion.div variants={fadeAnim} style={{ padding: '0 30px', maxWidth: '600px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h2 style={{ ...cursive, marginBottom: '15px', whiteSpace: 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          Welcome <span style={{fontSize: '0.4em', color: '#8A202A'}}>♡</span>
        </h2>
        <p style={{ ...serif, whiteSpace: 'normal' }}>
          Your presence adds warmth and joy to our special day. We are truly delighted to have you with us as we begin this beautiful new chapter together.
        </p>
      </motion.div>
    </motion.section>
  )
}
