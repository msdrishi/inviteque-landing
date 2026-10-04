import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, ASSETS } from './theme'
import ParchmentRevealWithThread from '../../components/ParchmentRevealWithThread'

const sectionAnim = {
  hidden: { },
  visible: { transition: { staggerChildren: 0.2 } }
}

const wordContainer = {
  hidden: { },
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
}

const wordAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
}

const AnimatedWordText = ({ text, style }) => (
  <motion.div variants={wordContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} style={style}>
    {text.split(' ').map((word, i) => (
      <motion.span variants={wordAnim} key={i} style={{ display: 'inline-block', marginRight: '6px' }}>
        {word}
      </motion.span>
    ))}
  </motion.div>
)

const lineContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.4, delayChildren: 0.6 } }
}

const lineAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } }
}

export default function PinkBlossomWelcome({ data, fontStyles, isDesktop, isTablet }) {
  const { cursive, serif } = fontStyles

  return (
    <section style={{ position: 'relative', width: '100%', backgroundColor: 'transparent' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
          <img src={ASSETS.welcomeBg} alt="Welcome Background" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(4px) brightness(0.95)' }} />
        </div>
      </div>
      
      <ParchmentRevealWithThread>
        <motion.div 
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          variants={sectionAnim}
        >
          {/* Welcome Title */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2 } } }} style={{ marginBottom: '24px' }}>
            <h2 style={{ ...cursive, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: isDesktop ? '60px' : '45px', color: COLORS.primaryDark, mixBlendMode: 'multiply' }}>
              Welcome <span style={{fontSize: '0.4em', color: COLORS.primaryDark, marginTop: '10px', mixBlendMode: 'multiply'}}>♡</span>
            </h2>
          </motion.div>

          <AnimatedWordText 
            text={data.welcomeMessage || "Your presence adds warmth and joy to our special day. We are truly delighted to have you with us as we begin this beautiful new chapter together."}
            style={{ ...serif, fontSize: '15px', lineHeight: 1.8, color: COLORS.textDark, mixBlendMode: 'multiply', fontWeight: 500 }} 
          />
          
          {data.welcomeSignoff && (
            <motion.div variants={lineContainer} initial="hidden" whileInView="visible" viewport={{ once: false }} style={{ marginTop: '24px' }}>
              {data.welcomeSignoff.split('\n').map((line, idx, arr) => (
                <motion.span variants={lineAnim} key={idx} style={{ 
                  ...(idx === 0 ? cursive : serif),
                  fontSize: idx === 0 ? '36px' : '16px', 
                  color: (idx > 0 && data.welcomeSignoffNamesColor) ? data.welcomeSignoffNamesColor : COLORS.primaryDark, 
                  fontWeight: idx > 0 ? 600 : 'normal',
                  marginTop: idx > 0 ? '4px' : '0',
                  whiteSpace: 'pre-wrap', 
                  display: 'block', 
                  lineHeight: 1.4,
                  mixBlendMode: 'multiply'
                }}>
                  {line}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </ParchmentRevealWithThread>
    </section>
  )
}
