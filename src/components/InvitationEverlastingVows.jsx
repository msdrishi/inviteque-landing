import { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import cMapping from '../everlastingVowsCloudinaryMapping.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const MOBILE_TOTAL_FRAMES = 108
const DESKTOP_TOTAL_FRAMES = 121

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
  const stickyRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const currentFrameRef = useRef(0)
  const lastDrawnImgRef = useRef(null)

  // Track active mode and screen width: Mobile & Tablet (< 1024px) use mobile frames, Desktop (>= 1024px) uses desktop frames
  const [isDesktopMode, setIsDesktopMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const isDesktopScreen = window.innerWidth >= 1024
      return isDesktopScreen
    }
    return false
  })

  useEffect(() => {
    const checkMode = () => {
      if (typeof window !== 'undefined') {
        const isDesktopScreen = window.innerWidth >= 1024
        setIsDesktopMode(isDesktopScreen)
      }
    }
    checkMode()
    window.addEventListener('resize', checkMode)
    return () => window.removeEventListener('resize', checkMode)
  }, [])

  const totalFrames = isDesktopMode ? DESKTOP_TOTAL_FRAMES : MOBILE_TOTAL_FRAMES
  const folderName = isDesktopMode ? 'welcome_desktop_frames' : 'welcome_mobile_frames'

  // Render a specific frame on Canvas with object-fit: cover logic
  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const clampedIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex))
    currentFrameRef.current = clampedIndex

    let img = imagesRef.current[clampedIndex]
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = lastDrawnImgRef.current
    }
    if (!img || !img.complete || img.naturalWidth === 0) return

    lastDrawnImgRef.current = img

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = width / height

    let drawW, drawH, drawX, drawY

    if (canvasRatio > imgRatio) {
      drawW = width
      drawH = width / imgRatio
      drawX = 0
      drawY = (height - drawH) / 2
    } else {
      drawH = height
      drawW = height * imgRatio
      drawX = (width - drawW) / 2
      drawY = 0
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH)
  }, [totalFrames])

  // Canvas size update for crisp high-DPI displays
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    renderFrame(currentFrameRef.current)
  }, [renderFrame])

  // Preload frame sequence progressively
  useEffect(() => {
    const images = new Array(totalFrames)

    const getFrameUrl = (index) => {
      const frameNum = String(index + 1).padStart(4, '0')
      const relKey = `wedding-message/${folderName}/frame_${frameNum}.webp`
      return cMapping[relKey] || `/backgrounds/Everlasting Vows/wedding-message/${folderName}/frame_${frameNum}.webp`
    }

    // Immediate load for Frame 1
    const firstImg = new Image()
    firstImg.src = getFrameUrl(0)
    firstImg.onload = () => {
      images[0] = firstImg
      imagesRef.current = images
      updateCanvasDimensions()
      renderFrame(0)
    }

    // Progressive background load for remaining WebP frames
    for (let i = 1; i < totalFrames; i++) {
      const img = new Image()
      img.src = getFrameUrl(i)
      img.onload = () => {
        images[i] = img
        if (currentFrameRef.current === i) {
          renderFrame(i)
        }
      }
      images[i] = img
    }

    imagesRef.current = images
  }, [folderName, totalFrames, renderFrame, updateCanvasDimensions])

  // GSAP ScrollTrigger setup
  useEffect(() => {
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReducedMotion) {
      renderFrame(0)
      return
    }

    updateCanvasDimensions()
    window.addEventListener('resize', updateCanvasDimensions)

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      ease: 'none',
      onUpdate: (self) => {
        const frameIndex = Math.floor(self.progress * (totalFrames - 1))
        if (frameIndex !== currentFrameRef.current) {
          requestAnimationFrame(() => renderFrame(frameIndex))
        }
      }
    })

    return () => {
      window.removeEventListener('resize', updateCanvasDimensions)
      trigger.kill()
    }
  }, [totalFrames, renderFrame, updateCanvasDimensions])

  const rawTitle = data?.title || data?.cardTitle
  const headingTitle = (!rawTitle || String(rawTitle).toLowerCase().includes('welcome message'))
    ? "Welcome to Our Story"
    : rawTitle

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-[#FFFDF2]"
      style={{ height: '260vh' }}
    >
      {/* Sticky Fullscreen Visual Viewport */}
      <div 
        ref={stickyRef}
        className="sticky top-0 w-full h-[100svh] overflow-hidden flex flex-col items-center justify-center bg-[#FFFDF2]"
      >
        {/* APPLE-STYLE SCROLL CANVAS */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Falling Golden Petals */}
        <FallingPetals />

        {/* ROYAL CALLIGRAPHIC TOP HEADING OVERLAY */}
        <div className="absolute top-[3.5vh] sm:top-[5vh] z-20 flex flex-col items-center text-center px-4 w-full max-w-xl select-none pointer-events-none">
          <div className="bg-[#FFFDF7]/92 backdrop-blur-lg px-8 py-3.5 sm:px-12 sm:py-4 rounded-full border-2 border-[#C5A059]/60 ring-1 ring-[#8A6E1E]/30 shadow-[0_12px_36px_rgba(60,35,10,0.18)] flex flex-col items-center">
            {/* Top Micro Crest */}
            <div className="mb-0.5 flex items-center justify-center gap-2 opacity-90">
              <div className="h-[1px] bg-[#8A6E1E] w-6 sm:w-10" />
              <span className="text-[#8A6E1E] text-[10px]">✦</span>
              <div className="h-[1px] bg-[#8A6E1E] w-6 sm:w-10" />
            </div>

            {/* Small Header Tag */}
            <p 
              className="text-[9px] sm:text-[11px] tracking-[0.28em] uppercase text-[#7A5B18] font-bold mb-0.5"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Our Eternal Journey
            </p>

            {/* Cursive Calligraphy Title */}
            <h2 
              className="text-2xl sm:text-4xl text-[#3D1E08] font-normal leading-tight mb-0.5"
              style={{ 
                fontFamily: "'Pinyon Script', 'Alex Brush', 'Great Vibes', cursive",
                textShadow: '0px 1px 2px rgba(197, 160, 89, 0.25)'
              }}
            >
              {headingTitle}
            </h2>

            {/* Subtitle Tagline */}
            <p 
              className="text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-[#6B4710] font-semibold opacity-90"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              A Celebration of Love & Destiny
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
