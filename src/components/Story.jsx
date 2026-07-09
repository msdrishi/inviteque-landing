import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
const texturePink = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029548/d0kadhlyhbkrywpc4qeb.png"

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } }
}

function AnimatedTitle({ text, className, style }) {
  return (
    <motion.h2 variants={letterContainer} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className={className} style={style}>
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterAnim} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
      ))}
    </motion.h2>
  )
}

const C = {
  primary: '#b95462', // Pinkish red from reference
  text:    '#4a3a3a',
  tape:    'rgba(235, 226, 212, 0.95)',
  imageOverlay: 'rgba(255, 182, 193, 0.45)'
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
export default function Story({ data, isDesktop }) {
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
    duration: 2.2,
    delay,
    ease: [0.22, 1, 0.36, 1], // Smooth ease out
  })

  return (
    <section
      id={data.id}
      ref={containerRef}
      className="moments-section"
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '0px',
        paddingBottom: '0px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage: `url(${texturePink})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'scroll',
      }}
    >
      {/* Moments Section with Texture Background */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '60px',
        paddingBottom: '80px',
      }}>
      {/* Header Text */}
      <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: '50px', zIndex: 2 }}>
        <AnimatedTitle 
          text="OUR MOMENTS"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(24px, 5.2vw, 34px)',
            letterSpacing: '0.14em',
            fontWeight: 600,
            color: '#7B1E2B',
            margin: '0 0 12px 0',
            textShadow: '0 14px 28px rgba(123, 30, 43, 0.16)',
            textTransform: 'uppercase'
          }}
        />
        
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
      <div className="moments-photos-container" style={{
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '1000px' : '460px',
        padding: '0 20px',
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        justifyContent: isDesktop ? 'space-around' : 'center',
        alignItems: 'center',
        gap: isDesktop ? '30px' : '0px',
        zIndex: 2,
        marginBottom: '20px',
        margin: '0 auto',
      }}>
        
        {/* Photo 1 (Top Left) */}
        {items[0] && (
          <motion.div
            className="moments-photo-1"
            initial={isDesktop ? undefined : { opacity: 0, x: -60 }}
            whileInView={isDesktop ? undefined : { opacity: 1, x: 0 }}
            viewport={isDesktop ? undefined : { once: false, amount: 0.15 }}
            transition={isDesktop ? undefined : { duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              opacity: isDesktop ? p1Op : undefined,
              x: isDesktop ? p1X : undefined,
              rotate: -4,
              position: 'relative',
              background: 'rgba(255,255,255,0.9)',
              padding: '8px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.18), 0 12px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
              width: isDesktop ? '28%' : '75%',
              borderRadius: 16,
              marginRight: isDesktop ? '0px' : '18%',
              marginTop: isDesktop ? '0px' : undefined,
              zIndex: 1,
            }}
          >
            <Tape top={-12} left={30} rotate={-6} />
            <Tape bottom={-12} right={40} rotate={-3} width={85} />
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f4f4f4', overflow: 'hidden', position: 'relative', borderRadius: 12 }}>
              <img src={items[0].image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="Memory 1" />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: C.imageOverlay, mixBlendMode: 'multiply', borderRadius: 12 }} />
              {/* Mat Finish Texture */}
              <div aria-hidden style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='1' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08' /%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
                mixBlendMode: 'overlay',
                borderRadius: 12,
                pointerEvents: 'none'
              }} />
            </div>
          </motion.div>
        )}

        {/* Photo 2 (Middle Right) */}
        {items[1] && (
          <motion.div
            className="moments-photo-2"
            initial={isDesktop ? undefined : { opacity: 0, x: 60 }}
            whileInView={isDesktop ? undefined : { opacity: 1, x: 0 }}
            viewport={isDesktop ? undefined : { once: false, amount: 0.15 }}
            transition={isDesktop ? undefined : { duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              opacity: isDesktop ? p2Op : undefined,
              x: isDesktop ? p2X : undefined,
              rotate: 5,
              position: 'relative',
              background: 'rgba(255,255,255,0.9)',
              padding: '8px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 16px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
              width: isDesktop ? '30%' : '80%',
              borderRadius: 16,
              marginLeft: isDesktop ? '0px' : '18%',
              marginTop: isDesktop ? '0px' : '-22%', // Overlap over Photo 1
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
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f4f4f4', overflow: 'hidden', position: 'relative', borderRadius: 12 }}>
              <img src={items[1].image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="Memory 2" />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: C.imageOverlay, mixBlendMode: 'multiply', borderRadius: 12 }} />
              {/* Mat Finish Texture */}
              <div aria-hidden style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='1' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08' /%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
                mixBlendMode: 'overlay',
                borderRadius: 12,
                pointerEvents: 'none'
              }} />
            </div>
          </motion.div>
        )}

        {/* Photo 3 (Bottom Left) */}
        {items[2] && (
          <motion.div
            className="moments-photo-3"
            initial={isDesktop ? undefined : { opacity: 0, x: -60 }}
            whileInView={isDesktop ? undefined : { opacity: 1, x: 0 }}
            viewport={isDesktop ? undefined : { once: false, amount: 0.15 }}
            transition={isDesktop ? undefined : { duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              opacity: isDesktop ? p3Op : undefined,
              x: isDesktop ? p3X : undefined,
              rotate: -3,
              position: 'relative',
              background: 'rgba(255,255,255,0.9)',
              padding: '8px',
              boxShadow: '0 24px 55px rgba(0,0,0,0.18), 0 12px 22px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
              width: isDesktop ? '29%' : '78%',
              borderRadius: 16,
              marginRight: isDesktop ? '0px' : '20%',
              marginTop: isDesktop ? '0px' : '-22%', // Overlap over Photo 2
              zIndex: 3,
            }}
          >
            <Tape bottom={-12} left={40} rotate={4} width={75} />
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f4f4f4', overflow: 'hidden', position: 'relative', borderRadius: 12 }}>
              <img src={items[2].image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="Memory 3" />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: C.imageOverlay, mixBlendMode: 'multiply', borderRadius: 12 }} />
              {/* Mat Finish Texture */}
              <div aria-hidden style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='1' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08' /%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
                mixBlendMode: 'overlay',
                borderRadius: 12,
                pointerEvents: 'none'
              }} />
            </div>
          </motion.div>
        )}

      </div>
      </div>

    </section>
  )
}
