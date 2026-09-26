import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Confetti from 'react-confetti'

const calenderBg = "/assets/templates/royal-heritage/calender-mobile.webp"

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
}

export default function TemplateRoyalHeritageCalendar({ calendarData, fontStyles, sectionStyle, bgStyle, isDesktop }) {
  const { cursive, serif, smallCaps } = fontStyles || {
    cursive: { fontFamily: "'Parisienne', cursive", color: '#8A202A' },
    serif: { fontFamily: "'Cormorant Garamond', serif", color: '#4A3E20' },
    smallCaps: { fontFamily: "'Cinzel', serif", color: '#8A202A', textTransform: 'uppercase' }
  };
  
  const sectionRef = useRef(null)
  const buttonRef = useRef(null)
  const targetDateRef = useRef(null)
  
  const [revealed, setRevealed] = useState(false)
  const [animState, setAnimState] = useState('idle') // idle, traveling, drawingHeart, completed
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
    if (!targetDateRef.current || !sectionRef.current) return;
    const targetRect = targetDateRef.current.getBoundingClientRect();
    const sectionRect = sectionRef.current.getBoundingClientRect();

    // Start from the bottom center of the section (the screen)
    const startX = sectionRect.width / 2;
    const startY = sectionRect.height + 50; 
    
    // Target is the center of the date cell
    const endX = targetRect.left + targetRect.width / 2 - sectionRect.left;
    const endY = targetRect.top + targetRect.height / 2 - sectionRect.top;

    // Control points for a swooping, hand-drawn-like curve with a loop from the bottom
    const cp1x = startX - 150;
    const cp1y = startY - (startY - endY) * 0.3;
    const cp2x = endX + 150;
    const cp2y = startY - (startY - endY) * 0.7;

    const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY - 5}`;
    setPathData(path);
  }

  useEffect(() => {
    calculatePath();
    const handleResize = () => calculatePath();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calendarData]);

  const isInView = useInView(sectionRef, { once: false, amount: 0.4 });

  useEffect(() => {
    if (isInView && !revealed) {
      handleReveal();
    } else if (!isInView && revealed) {
      // Reset animation when user scrolls away
      setRevealed(false);
      setAnimState('idle');
      setShowConfetti(false);
    }
  }, [isInView, revealed]);

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    setAnimState('traveling');
    
    // Wait for DOM to render then calculate
    setTimeout(() => {
      calculatePath();
    }, 50);

    setTimeout(() => {
      setAnimState('drawingHeart');
      setShowConfetti(true);
      setTimeout(() => {
        setAnimState('completed');
      }, 700);
      setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
    }, 1500); // Wait for arrow animation to finish
  }

  // A beautiful hand-drawn looking heart path
  const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  return (
    <section 
      ref={sectionRef}
      style={{...sectionStyle, minHeight: '100vh', position: 'relative', overflow: 'hidden'}}
      className="flex flex-col items-center justify-center px-5 py-12"
    >
      <img 
        src={calenderBg} 
        alt="Calendar Background" 
        style={{
          ...bgStyle,
          objectPosition: 'center top'
        }} 
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
            colors={['#8A202A', '#D4AF37', '#4A3E20', '#FFFFFF', '#FFD700', '#FF6B6B']}
          />
        </div>
      )}

      {/* SVG Overlay for drawing arrow (Line is hidden, only keeping container for logic if needed) */}
      <svg 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 30 }}
      >
        {/* The line itself has been removed per user request, only the arrowhead travels */}
      </svg>
      
      {/* Travelling Arrowhead using offset-path */}
      {revealed && animState !== 'idle' && pathData && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '60px',
            height: '60px',
            zIndex: 35,
            pointerEvents: 'none',
            offsetPath: `path("${pathData}")`,
            offsetAnchor: '100% 0%', // Align the top-right tip of the arrow exactly to the path
            offsetRotate: 'auto 45deg', // The arrow image naturally points at 45 degrees up-right
          }}
          initial={{ offsetDistance: '0%', opacity: 1, y: 0, rotate: 0 }}
          animate={
            animState === 'traveling'
              ? { offsetDistance: '100%', opacity: 1, y: 0, rotate: 0 }
              : { offsetDistance: '100%', opacity: 0, y: 150, rotate: 90 } // Break down and fall
          }
          transition={{
            offsetDistance: { duration: 1.5, ease: "easeInOut" },
            opacity: { duration: animState === 'traveling' ? 0 : 0.8, ease: "easeIn" },
            y: { duration: animState === 'traveling' ? 0 : 0.8, ease: "easeIn" },
            rotate: { duration: animState === 'traveling' ? 0 : 0.8, ease: "easeIn" }
          }}
        >
          <img src="/assets/templates/royal-heritage/arrow.png" alt="Cupid Arrow" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </motion.div>
      )}

      {/* Title Content - Positioned Absolutely inside the red box */}
      <div className="absolute top-[18%] z-10 w-full flex flex-col items-center text-center">
        <motion.p initial="hidden" whileInView="visible" variants={fadeAnim} viewport={{ once: true, amount: 0.3 }} style={{ ...smallCaps, marginBottom: '4px', fontSize: '11px', letterSpacing: '0.25em', color: '#F9F5EC' }}>
          MARK YOUR CALENDAR
        </motion.p>
        <motion.h2 initial="hidden" whileInView="visible" variants={fadeAnim} viewport={{ once: true, amount: 0.3 }} style={{ ...smallCaps, fontSize: '22px', marginBottom: '15px', color: '#F9F5EC' }}>
          THE DATE
        </motion.h2>
      </div>

      {/* Monthly Calendar Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[280px] bg-[#F9F5EC] border border-[rgba(138,32,42,0.15)] rounded-[16px] p-4 shadow-2xl flex flex-col items-center text-center mt-[10vh]"
      >
        <span style={{ ...smallCaps, fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', color: '#8A202A' }}>
          {calendarData.monthName} {calendarData.year}
        </span>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 w-full gap-1 mb-2 text-center">
          {calendarData.weekDays.map((wd, idx) => (
            <span key={idx} style={{ ...smallCaps, fontSize: '10px', fontWeight: 'bold', color: '#4A3E20' }}>{wd}</span>
          ))}
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 w-full gap-1 text-center relative">
          
          {calendarData.calendarDays.map((item, idx) => {
            return (
              <div key={idx} className="relative flex items-center justify-center py-1 h-8" ref={item.isTarget ? targetDateRef : null}>
                {item.isTarget ? (
                  <motion.div 
                    animate={animState === 'drawingHeart' || animState === 'completed' ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative flex items-center justify-center w-6 h-6"
                  >
                    {/* Hand-drawn heart outline */}
                    {(animState === 'drawingHeart' || animState === 'completed') && (
                      <motion.svg 
                        viewBox="0 0 24 24"
                        style={{ position: 'absolute', width: '36px', height: '36px', zIndex: 0 }}
                      >
                        <motion.path
                          d={heartPath}
                          stroke="#8A202A"
                          strokeWidth="1.2"
                          fill={animState === 'completed' ? 'rgba(138,32,42,0.15)' : 'transparent'}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </motion.svg>
                    )}

                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 'bold', zIndex: 10, color: '#8A202A' }}>
                      {item.day}
                    </span>
                  </motion.div>
                ) : (
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: '12px', color: item.isCurrent ? '#4A3E20' : 'transparent', fontWeight: item.isCurrent ? 'bold' : 'normal' }}>
                    {item.day}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
