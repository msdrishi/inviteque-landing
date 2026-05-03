import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const C = {
  primary: '#b95462', // Pinkish red from reference
  text:    '#4a3a3a',
  tape:    'rgba(235, 226, 212, 0.95)',
}

// Reusable Tape Component
function Tape({ top, bottom, left, right, rotate, width = 70, height = 26 }) {
  return (
    <div style={{
      position: 'absolute',
      top, bottom, left, right,
      width, height,
      background: C.tape,
      transform: `rotate(${rotate}deg)`,
      boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
      zIndex: 10,
    }} />
  )
}

/* ─── Main Gallery Section ──────────────── */
export default function Story({ data }) {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "center center"]
  })

  // Add spring for smoothness and delay
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 15,
    mass: 1.5
  })

  // Create staggered transformations tied to the smoothed scroll position
  const p1X = useTransform(smoothProgress, [0, 0.6], [-300, 0])
  const p1Op = useTransform(smoothProgress, [0, 0.4], [0, 1])

  const p2X = useTransform(smoothProgress, [0.2, 0.8], [300, 0])
  const p2Op = useTransform(smoothProgress, [0.2, 0.6], [0, 1])

  const p3X = useTransform(smoothProgress, [0.4, 1.0], [-300, 0])
  const p3Op = useTransform(smoothProgress, [0.4, 0.8], [0, 1])

  if (!data || !Array.isArray(data.items)) return null
  const items = data.items.slice(0, 3)

  const slowTextTransition = (delay = 0) => ({
    duration: 1.5,
    delay,
    ease: [0.22, 1, 0.36, 1], // Smooth ease out
  })

  return (
    <section
      id={data.id}
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '24px',
        paddingBottom: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header Text */}
      <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: '50px', zIndex: 2 }}>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={slowTextTransition(0)}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(16px, 4vw, 20px)',
            color: C.text,
            margin: 0,
          }}
        >
          Our
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={slowTextTransition(0.2)}
          style={{
            fontFamily: "'Parisienne', cursive",
            fontSize: 'clamp(56px, 16vw, 86px)',
            color: C.primary,
            margin: '-10px 0 10px 0',
            fontWeight: 400,
          }}
        >
          Moments
        </motion.h2>
        
        {/* Heart Divider */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={slowTextTransition(0.4)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}
        >
          <svg viewBox="0 0 100 20" width="50" height="10" fill="none">
            <path d="M10 10 Q30 0 50 10 Q70 20 90 10" stroke={C.primary} strokeWidth="1" opacity="0.4"/>
          </svg>
          <svg viewBox="0 0 24 24" width="14" height="14" fill={C.primary}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg viewBox="0 0 100 20" width="50" height="10" fill="none">
            <path d="M10 10 Q30 0 50 10 Q70 20 90 10" stroke={C.primary} strokeWidth="1" opacity="0.4"/>
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={slowTextTransition(0.6)}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(12px, 3.5vw, 15px)',
            color: C.text,
            lineHeight: 1.6,
            maxWidth: '320px',
            margin: '0 auto',
            opacity: 0.85,
          }}
        >
          A few clicks that hold<br/>a lifetime of love and memories.
        </motion.p>
        
        {/* Tiny heart below text */}
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: false, amount: 0.1 }}
           transition={slowTextTransition(0.8)}
           style={{ marginTop: 14 }}
        >
           <svg viewBox="0 0 24 24" width="10" height="10" fill={C.primary} opacity="0.8">
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
           </svg>
        </motion.div>
      </div>

      {/* Cascading Photos */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2,
      }}>
        
        {/* Photo 1 (Top Left) */}
        {items[0] && (
          <motion.div
            style={{
              opacity: p1Op,
              x: p1X,
              rotate: -4,
              position: 'relative',
              background: '#fff',
              padding: '10px 10px 30px 10px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
              width: '75%',
              marginRight: '20%',
              zIndex: 1,
            }}
          >
            <Tape top={-12} left={30} rotate={-6} />
            <Tape bottom={-12} right={40} rotate={-3} width={85} />
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f4f4f4', overflow: 'hidden' }}>
              <img src={items[0].image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Memory 1" />
            </div>
          </motion.div>
        )}

        {/* Photo 2 (Middle Right) */}
        {items[1] && (
          <motion.div
            style={{
              opacity: p2Op,
              x: p2X,
              rotate: 5,
              position: 'relative',
              background: '#fff',
              padding: '10px 10px 30px 10px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.18)',
              width: '80%',
              marginLeft: '20%',
              marginTop: '-25%', // Overlap over Photo 1
              zIndex: 2,
            }}
          >
            {/* Red Heart Badge */}
            <div style={{ 
              position: 'absolute', 
              top: '25%', 
              right: -24, 
              width: 48, 
              height: 48, 
              background: '#d45b68', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 6px 15px rgba(212, 91, 104, 0.4)', 
              zIndex: 10 
            }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f4f4f4', overflow: 'hidden' }}>
              <img src={items[1].image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Memory 2" />
            </div>
          </motion.div>
        )}

        {/* Photo 3 (Bottom Left) */}
        {items[2] && (
          <motion.div
            style={{
              opacity: p3Op,
              x: p3X,
              rotate: -3,
              position: 'relative',
              background: '#fff',
              padding: '10px 10px 30px 10px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
              width: '78%',
              marginRight: '22%',
              marginTop: '-25%', // Overlap over Photo 2
              zIndex: 3,
            }}
          >
            <Tape bottom={-12} left={40} rotate={4} width={75} />
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f4f4f4', overflow: 'hidden' }}>
              <img src={items[2].image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Memory 3" />
            </div>
          </motion.div>
        )}

      </div>

      {/* Footer Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        style={{
          marginTop: '70px',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <p style={{
          fontFamily: "'Parisienne', cursive",
          fontSize: 'clamp(22px, 6vw, 28px)',
          color: C.primary,
          margin: 0,
        }}>
          Our story, our journey,
        </p>
        <p style={{
          fontFamily: "'Parisienne', cursive",
          fontSize: 'clamp(38px, 10vw, 48px)',
          color: C.primary,
          margin: '-5px 0 0 0',
        }}>
          ours forever
        </p>
        
        {/* Decorative squiggle underneath */}
        <svg viewBox="0 0 50 20" width="40" height="16" fill="none" style={{ marginTop: '8px' }}>
          <path d="M5 10 Q20 0 35 10 Q45 18 40 20 Q35 22 30 15" stroke={C.primary} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8"/>
        </svg>
      </motion.div>

    </section>
  )
}
