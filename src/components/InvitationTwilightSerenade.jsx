import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
const dividerFlowersMobile = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964586/divider-flowers-mobile.png"

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function AnimatedTitle({ text, className, style }) {
  return (
    <motion.p 
      variants={letterContainer} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: false, amount: 0.1 }} 
      className={className} 
      style={style}
    >
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterAnim} style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.p>
  )
}

const leafConfig = Array.from({ length: 12 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20;
  const duration = 7 + Math.random() * 7;
  const delay = Math.random() * 4;
  const size = 6 + Math.random() * 8;
  const x1 = Math.random() * 50 - 25;
  const x2 = Math.random() * 50 - 25;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

function FallingLeaves() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100%' }}>
      {leafConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size * 1.5, 
            opacity: 0.75,
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.12))'
          }}
          animate={{
            y: ['0%', '110%'],
            x: [0, p.x1, p.x2],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <svg viewBox="0 0 40 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 5 C 40 20, 35 45, 20 55 C 5 45, 0 20, 20 5 Z" fill="#404D29" />
            <path d="M 20 5 Q 16 30, 20 55" stroke="#2B351B" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 18 20 L 10 15" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 21 25 L 30 20" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 19 35 L 12 32" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 21 40 L 28 38" stroke="#2B351B" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M 20 55 L 20 59" stroke="#2B351B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

export default function InvitationTwilightSerenade({ data, bgImage }) {
  const containerRef = useRef(null)

  // Track scroll progress using standard section entry/exit
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Smooth springs for background parallax, and banner parallax
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-6%']), { stiffness: 45, damping: 15 })
  
  // Blur triggers only when the section covers the viewport and the banner settles in the middle (0.30 to 0.50)
  const bgBlur = useTransform(scrollYProgress, [0.30, 0.50, 1.0], ['blur(0px)', 'blur(2.5px)', 'blur(2.5px)'])
  
  // 3D pop-out scroll transformations - banner rises from the bottom and remains cropped at the bottom
  const rawBannerY = useTransform(scrollYProgress, [0.15, 0.50], ['50%', '15%'])
  const bannerY = useSpring(rawBannerY, { stiffness: 35, damping: 15 })
  const bannerScale = useTransform(scrollYProgress, [0.15, 0.50], [0.9, 1.15])
  const bannerRotateX = useTransform(scrollYProgress, [0.15, 0.50], [12, 0])

  if (!data) return null

  return (
    <section
      ref={containerRef}
      id={data.id}
      className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-between items-center py-16 px-6"
      style={{ perspective: 1000 }} // Enable 3D rendering context
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.06, filter: bgBlur, transformOrigin: 'center' }}
      >
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Falling Leaves Effect */}
      <FallingLeaves />

      {/* Main Content Area - Aligned to Top */}
      <div className="relative z-10 w-full max-w-[600px] flex flex-col items-center text-center mt-6">
        {/* Title at the Top */}
        <div className="mb-4">
          <AnimatedTitle 
            text="Our story, our journey,"
            style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px, 4.5vw, 24px)', color: '#3D5236', fontWeight: 'bold', margin: 0, letterSpacing: '0.12em' }}
          />
          <AnimatedTitle 
            text="ours forever"
            style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(26px, 7vw, 36px)', color: '#3D5236', fontWeight: 'bold', margin: 0, letterSpacing: '0.12em' }}
          />
        </div>
      </div>

      {/* Parallax Bottom Banner Image - Anchored to the bottom boundary to crop the stand/legs */}
      <motion.div
        className="absolute bottom-0 inset-x-0 w-full z-20 will-change-transform pointer-events-none origin-bottom flex justify-center"
        style={{ 
          y: bannerY,
          scale: bannerScale,
          rotateX: bannerRotateX,
        }}
      >
        <img
          src={dividerFlowersMobile}
          alt=""
          aria-hidden="true"
          className="w-[130%] sm:w-[120%] lg:w-[110%] h-auto object-contain object-bottom min-h-[350px] md:min-h-[420px] max-h-[680px]"
        />
      </motion.div>
    </section>
  )
}
