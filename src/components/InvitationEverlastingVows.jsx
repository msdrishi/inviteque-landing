import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

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

const petalConfig = Array.from({ length: 12 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20;
  const duration = 7 + Math.random() * 7;
  const delay = Math.random() * 4;
  const size = 6 + Math.random() * 8;
  const x1 = Math.random() * 50 - 25;
  const x2 = Math.random() * 50 - 25;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

function FallingPetals() {
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
          <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 0 C 35 10, 35 30, 20 40 C 5 30, 5 10, 20 0 Z" fill="rgba(212,175,55,0.8)" />
            <circle cx="20" cy="20" r="2.5" fill="#FFFDF2" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

export default function InvitationEverlastingVows({ data, isDesktop }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  // Track scroll progress of this container section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Smooth scroll progress for fluidity
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Map scroll progress to video time
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()

    const handleLoadedMetadata = () => {
      video.pause()
    }
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    const unsubscribe = smoothProgress.on('change', (progress) => {
      if (video.duration && !isNaN(video.duration)) {
        const targetTime = progress * video.duration
        if (Math.abs(video.currentTime - targetTime) > 0.03) {
          video.currentTime = targetTime
        }
      }
    })

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      unsubscribe()
    }
  }, [smoothProgress])

  // Video path
  const videoSrc = isDesktop
    ? "/backgrounds/Everlasting Vows/wedding-message/welcome_desktop.mp4"
    : "/backgrounds/Everlasting Vows/wedding-message/welcome_mobile.mp4"

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ height: '250vh' }}
    >
      {/* Sticky Fullscreen Visual Viewport */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden flex flex-col items-center justify-center">
        {/* Background Scroll Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          muted
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Falling Golden Petals */}
        <FallingPetals />
      </div>
    </div>
  )
}
