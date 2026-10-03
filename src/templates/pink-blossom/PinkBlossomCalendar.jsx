import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { COLORS, ASSETS } from './theme'

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
}

export default function PinkBlossomCalendar({ calendarData, fontStyles, sectionStyle, bgStyle, isDesktop }) {
  const { cursive, serif, smallCaps } = fontStyles || {
    cursive: { fontFamily: "'Parisienne', cursive", color: COLORS.primary },
    serif: { fontFamily: "'Cormorant Garamond', serif", color: COLORS.textDark },
    smallCaps: { fontFamily: "'Cinzel', serif", color: COLORS.primary, textTransform: 'uppercase' }
  }
  
  const sectionRef = useRef(null)
  const buttonRef = useRef(null)
  const targetDateRef = useRef(null)
  
  const [revealed, setRevealed] = useState(false)
  const [animState, setAnimState] = useState('idle')
  const [pathData, setPathData] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const calculatePath = () => {
    if (!targetDateRef.current || !sectionRef.current) return
    const targetRect = targetDateRef.current.getBoundingClientRect()
    const sectionRect = sectionRef.current.getBoundingClientRect()

    const startX = sectionRect.width * 0.2
    const startY = sectionRect.height + 50
    const endX = targetRect.left + targetRect.width / 2 - sectionRect.left
    const endY = targetRect.top + targetRect.height / 2 - sectionRect.top

    const cp1x = startX - 50
    const cp1y = sectionRect.height * 0.3
    const cp2x = sectionRect.width * 0.9
    const cp2y = sectionRect.height * 0.05
    const midX = sectionRect.width * 0.6
    const midY = sectionRect.height * 0.2
    const cp3x = sectionRect.width * 0.2
    const cp3y = sectionRect.height * 0.3
    const cp4x = endX
    const cp4y = endY - 60

    const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} ${midY} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${endX} ${endY - 5}`
    setPathData(path)
  }

  useEffect(() => {
    calculatePath()
    const handleResize = () => calculatePath()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calendarData])

  const isInView = useInView(sectionRef, { once: false, amount: 0.4 })

  useEffect(() => {
    if (isInView && !revealed) {
      handleReveal()
    } else if (!isInView && revealed) {
      setRevealed(false)
      setAnimState('idle')
      setShowConfetti(false)
    }
  }, [isInView, revealed])

  const handleReveal = () => {
    if (revealed) return
    setRevealed(true)
    setAnimState('traveling')
    
    setTimeout(() => { calculatePath() }, 50)

    setTimeout(() => {
      setAnimState('drawingHeart')
      setShowConfetti(true)
      setTimeout(() => { setAnimState('completed') }, 700)
      setTimeout(() => { setShowConfetti(false) }, 4000)
    }, 2500)
  }

  const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"

  return (
    <section 
      ref={sectionRef}
      style={{...sectionStyle, minHeight: '100vh', position: 'relative', overflow: 'hidden'}}
      className="flex flex-col items-center justify-center px-5 py-12"
    >
      <img 
        src={ASSETS.calendarBg} 
        alt="Calendar Background" 
        style={{ ...bgStyle, objectPosition: 'center top' }} 
      />

      {showConfetti && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none' }}>
          <Confetti 
            width={windowSize.width} 
            height={windowSize.height} 
            recycle={false} 
            numberOfPieces={600} 
            gravity={0.4}
            initialVelocityY={25}
            tweenDuration={4000}
            colors={[COLORS.primary, COLORS.gold, COLORS.textDark, '#FFFFFF', '#FFD700', '#FF6B8A']}
          />
        </div>
      )}

      {/* SVG Overlay container */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 30 }}>
        {/* Arrow path hidden per design — only arrowhead travels */}
      </svg>
      
      {/* Travelling Arrowhead */}
      {revealed && animState !== 'idle' && pathData && (
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '60px', height: '60px', zIndex: 35, pointerEvents: 'none',
            offsetPath: `path("${pathData}")`,
            offsetAnchor: '100% 0%',
            offsetRotate: 'auto 45deg',
          }}
          initial={{ offsetDistance: '0%', opacity: 1, scale: 1, rotate: 0 }}
          animate={
            animState === 'traveling'
              ? { offsetDistance: '100%', opacity: 1, scale: 1, rotate: 0 }
              : { offsetDistance: '100%', opacity: 0, scale: [1, 1.4, 0.8, 0], rotate: [0, -10, 10, 0] }
          }
          transition={{
            offsetDistance: { duration: 2.5, ease: "easeInOut" },
            opacity: { duration: animState === 'traveling' ? 0 : 0.6, delay: animState === 'traveling' ? 0 : 0.1, ease: "easeOut" },
            scale: { duration: animState === 'traveling' ? 0 : 0.4 },
            rotate: { duration: animState === 'traveling' ? 0 : 0.4 }
          }}
        >
          <img src={ASSETS.arrow} alt="Cupid Arrow" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </motion.div>
      )}

      {/* Vertical Banner Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', width: '100%', maxWidth: '360px', zIndex: 10, marginTop: '20px' }}>
        <div style={{
          backgroundColor: 'rgba(251, 246, 237, 0.93)',
          backdropFilter: 'blur(8px)',
          borderRadius: '24px',
          border: `2px solid ${COLORS.primary}`,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          padding: '40px 20px',
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Title Content */}
          <div className="flex flex-col items-center text-center mb-6">
            <motion.p initial="hidden" whileInView="visible" variants={fadeAnim} viewport={{ once: true, amount: 0.3 }} style={{ ...smallCaps, marginBottom: '4px', fontSize: '11px', letterSpacing: '0.25em', color: COLORS.textDark }}>
              MARK YOUR CALENDAR
            </motion.p>
            <motion.h2 initial="hidden" whileInView="visible" variants={fadeAnim} viewport={{ once: true, amount: 0.3 }} style={{ ...smallCaps, fontSize: '22px', margin: 0, color: COLORS.primary }}>
              THE DATE
            </motion.h2>
          </div>

          {/* Monthly Calendar Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[280px] rounded-[16px] p-2 flex flex-col items-center text-center"
            style={{ backgroundColor: 'transparent' }}
          >
            <span style={{ ...smallCaps, fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.primary }}>
          {calendarData.monthName} {calendarData.year}
        </span>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 w-full gap-1 mb-2 text-center">
          {calendarData.weekDays.map((wd, idx) => (
            <span key={idx} style={{ ...smallCaps, fontSize: '10px', fontWeight: 'bold', color: COLORS.textDark }}>{wd}</span>
          ))}
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 w-full gap-1 text-center relative">
          {calendarData.calendarDays.map((item, idx) => (
            <div key={idx} className="relative flex items-center justify-center py-1 h-8" ref={item.isTarget ? targetDateRef : null}>
              {item.isTarget ? (
                <motion.div 
                  animate={animState === 'drawingHeart' || animState === 'completed' ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex items-center justify-center w-6 h-6"
                >
                  {(animState === 'drawingHeart' || animState === 'completed') && (
                    <motion.svg viewBox="0 0 24 24" style={{ position: 'absolute', width: '36px', height: '36px', zIndex: 0 }}>
                      <motion.path
                        d={heartPath}
                        stroke={COLORS.primary}
                        strokeWidth="1.2"
                        fill={animState === 'completed' ? `rgba(200,25,94,0.15)` : 'transparent'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    </motion.svg>
                  )}
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 'bold', zIndex: 10, color: COLORS.primary }}>
                    {item.day}
                  </span>
                </motion.div>
              ) : (
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '12px', color: item.isCurrent ? COLORS.textDark : 'transparent', fontWeight: item.isCurrent ? 'bold' : 'normal' }}>
                  {item.day}
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
        </div>
      </div>
    </section>
  )
}
