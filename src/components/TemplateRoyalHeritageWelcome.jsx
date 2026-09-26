import React from 'react'
import { motion } from 'framer-motion'

const welcomeBg = "/assets/templates/royal-heritage/welcome-section-mobile.webp"

const sectionAnim = {
  hidden: { },
  visible: { 
    transition: { staggerChildren: 0.1 } 
  }
}

// Letter animation coming from random directions
const letterContainer = {
  hidden: { },
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.5 } }
}

const randomLetterAnim = {
  hidden: () => ({
    opacity: 0,
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 100,
    scale: 0.5,
    rotate: (Math.random() - 0.5) * 90
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
}

const AnimatedText = ({ text, style }) => (
  <motion.div variants={letterContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }} style={{ display: 'inline-block' }}>
    {text.split(' ').map((word, i) => (
      <span key={i} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '6px' }}>
        {word.split('').map((char, j) => (
          <motion.span custom={j} variants={randomLetterAnim} key={j} style={{ ...style, display: 'inline-block' }}>
            {char}
          </motion.span>
        ))}
      </span>
    ))}
  </motion.div>
)

export default function TemplateRoyalHeritageWelcome({ data, fontStyles, sectionStyle, bgStyle, isDesktop, isTablet }) {
  const { cursive, serif, smallCaps } = fontStyles;

  return (
    <section style={{ ...sectionStyle, justifyContent: 'center' }}>
      <img src={welcomeBg} alt="Welcome Background" style={bgStyle} />
      
      <motion.div 
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, height: '100%' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        variants={sectionAnim}
      >
        {/* Welcome Title */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2 } } }} style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ ...cursive, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: isDesktop ? '60px' : '45px', color: '#8A202A' }}>
            Welcome <span style={{fontSize: '0.5em', color: '#8A202A', marginTop: '10px'}}>♡</span>
          </h2>
        </motion.div>

        {/* Welcome Message with Random Letter Animation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', maxWidth: '300px', textAlign: 'center', marginTop: '10px' }}>
          <AnimatedText 
            text="Your presence adds warmth and joy to our special day. We are truly delighted to have you with us as we begin this beautiful new chapter together." 
            style={{ ...serif, fontSize: '13px', lineHeight: 1.8, color: '#4A3E20' }} 
          />
        </div>

      </motion.div>
    </section>
  )
}
