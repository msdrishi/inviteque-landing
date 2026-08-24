import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const petalColors = ["rgba(212,175,55,0.85)", "rgba(197,160,89,0.8)", "rgba(224,192,106,0.75)", "rgba(138,110,30,0.85)"]

const petalConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 25 : 75 + Math.random() * 25;
  const duration = 6 + Math.random() * 7;
  const delay = Math.random() * 4;
  const size = 6 + Math.random() * 8;
  const x1 = Math.random() * 50 - 25;
  const x2 = Math.random() * 50 - 25;
  const color = petalColors[i % petalColors.length];
  return { left: leftPos, duration, delay, size, x1, x2, color };
});

function FallingGoldenPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100%' }}>
      {petalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            opacity: 0.85,
            filter: 'drop-shadow(0px 2px 4px rgba(138,110,30,0.18))'
          }}
          animate={{
            y: ['0vh', '110vh'],
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
          <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 0 C 35 10, 35 30, 20 40 C 5 30, 5 10, 20 0 Z" fill={p.color} />
            <circle cx="20" cy="20" r="2.5" fill="#FFFDF2" opacity="0.9" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function InvitationTitle({ text, className, style }) {
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

export default function InvitationEverlastingVows({ data, isDesktop }) {
  const containerRef = useRef(null)

  // Track scroll progress for 3D parallax board animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Gentle background parallax
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-6%']), { stiffness: 45, damping: 15 })

  // Balanced 3D upward glide and scale
  const rawBannerY = useTransform(scrollYProgress, [0.15, 0.50], ['40%', '0%'])
  const bannerY = useSpring(rawBannerY, { stiffness: 35, damping: 15 })
  const bannerScale = useTransform(scrollYProgress, [0.15, 0.50], [0.88, 1.05])
  const bannerRotateX = useTransform(scrollYProgress, [0.15, 0.50], [10, 0])

  // Enhanced progressive background blur
  const rawBlurOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1])
  const blurOpacity = useSpring(rawBlurOpacity, { stiffness: 35, damping: 15 })

  const bgImage = isDesktop
    ? "/backgrounds/everlasting/welcome-desktop-everlasting.png"
    : "/backgrounds/everlasting/welcome-mobile-everlasting.png"

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100svh] h-[100svh] overflow-hidden flex flex-col justify-between items-center pt-6 sm:pt-8 pb-1 sm:pb-2 px-4 select-none"
      style={{ perspective: 1000 }}
    >
      {/* Fullscreen background image with gentle parallax */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.15, transformOrigin: 'center' }}
      >
        <img
          src={bgImage}
          alt="Everlasting Vows Welcome Background"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />

        {/* Enhanced progressive background blur overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 backdrop-blur-[3.5px]"
          style={{
            opacity: blurOpacity,
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)'
          }}
        />
      </motion.div>

      {/* Falling Golden Petals */}
      <FallingGoldenPetals />

      {/* Top Header Content inside Rounded-Corner Card */}
      <div className="relative z-20 w-full max-w-[540px] flex flex-col items-center text-center mt-2 sm:mt-4">
        <div className="bg-white/45 backdrop-blur-md px-6 sm:px-10 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl border border-white/65 shadow-[0_8px_30px_rgba(60,35,10,0.08)] flex flex-col items-center">
          {/* Top Micro Ornament */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-2 mb-1 opacity-90"
          >
            <div className="h-[1px] bg-[#8A6E1E] w-5 sm:w-8" />
            <span className="text-[#8A6E1E] text-[9px]">✦</span>
            <div className="h-[1px] bg-[#8A6E1E] w-5 sm:w-8" />
          </motion.div>

          <InvitationTitle
            text="Our story, our journey,"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(14px, 3.5vw, 19px)',
              color: '#5A2C16',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          />
          <InvitationTitle
            text="ours forever"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(20px, 5vw, 28px)',
              color: '#8A6E1E',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          />
        </div>
      </div>

      {/* Balanced Prominent Full Welcome Board with 3D Pop-Up Motion */}
      <motion.div
        className="absolute bottom-1 sm:bottom-0 inset-x-0 w-full z-20 will-change-transform pointer-events-none origin-bottom flex justify-center"
        style={{
          y: bannerY,
          scale: bannerScale,
          rotateX: bannerRotateX,
        }}
      >
        <img
          src="/backgrounds/everlasting/welcome-board-everlasting.png"
          alt="Everlasting Vows Welcome Board"
          aria-hidden="true"
          className="w-auto h-auto max-h-[62svh] sm:max-h-[66svh] md:max-h-[70svh] max-w-[90vw] sm:max-w-[500px] md:max-w-[440px] object-contain object-bottom drop-shadow-[0_22px_48px_rgba(40,25,10,0.28)]"
        />
      </motion.div>
    </section>
  )
}
