import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'

// Lotus SVG ornament inside card footer
function LotusOrnament({ size = 14, color = '#B58A3C' }) {
  return (
    <svg viewBox="0 0 40 20" width={size * 2.2} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 18 C20 18 10 10 6 4 C10 6 15 8 20 8 C25 8 30 6 34 4 C30 10 20 18 20 18Z" fill={color} opacity="0.75" />
      <path d="M20 18 C20 18 14 12 12 7 C15 9 17.5 10 20 10 C22.5 10 25 9 28 7 C26 12 20 18 20 18Z" fill={color} opacity="0.55" />
      <circle cx="20" cy="7" r="2" fill={color} opacity="0.6" />
    </svg>
  )
}

function LotusDivider({ color = '#B09060' }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 4 }}>
      <div style={{ width: 26, height: 0.7, background: color, opacity: 0.55 }} />
      <svg viewBox="0 0 32 18" width={32} height={18} fill="none">
        <path d="M16 16C16 16 8 9 5 4C8 6 12 8 16 8C20 8 24 6 27 4C24 9 16 16 16 16Z" fill={color} opacity="0.65" />
        <path d="M16 16C16 16 11 10 10 6C12.5 8 14.5 9 16 9C17.5 9 19.5 8 22 6C21 10 16 16 16 16Z" fill={color} opacity="0.4" />
        <circle cx="16" cy="6" r="1.8" fill={color} opacity="0.55" />
      </svg>
      <div style={{ width: 26, height: 0.7, background: color, opacity: 0.55 }} />
    </div>
  )
}

export default function PhotoCardsMidnightWaltz({
  groomName,
  brideName,
  photos = [],
  bgImageDesktop,
  bgImageMobile,
  isDesktop,
}) {
  const containerRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  // Track scroll progress of the entire section when pinned
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Track scroll progress of the section entering the viewport (from bottom to top of screen)
  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  })

  // Apply a balanced, responsive spring configuration
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.25
  })

  const smoothEntryProgress = useSpring(entryProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.25
  })

  // Photo Cards stack setup
  const defaultImages = [
    "/assets/templates/midnight-waltz/sample-photo-1.webp",
    "/assets/templates/midnight-waltz/sample-photo-2.webp",
    "/assets/templates/midnight-waltz/sample-photo-3.webp"
  ]

  const defaultQuotes = [
    "In your arms, I have found my forever home.",
    "Every love story is beautiful, but ours is my favorite.",
    "Two hearts, one soul, a lifetime of beautiful moments."
  ]

  const items = [0, 1, 2].map(i => {
    const rawPhoto = photos && photos[i]
    const photoUrl = typeof rawPhoto === 'string' ? rawPhoto : (rawPhoto?.image || null)
    return {
      image: (photoUrl && photoUrl.trim() !== '') ? photoUrl : defaultImages[i],
      quote: defaultQuotes[i]
    }
  })

  // Card 0: Slides up as the section enters the viewport, and reaches 0vh when fully in view
  const card0Y = useTransform(smoothEntryProgress, [0.2, 1.0], ['60vh', '0vh'])
  const card0Op = useTransform(smoothEntryProgress, [0.2, 0.85], [0, 1])
  const card0Scale = useTransform(smoothProgress, [0.35, 0.65], [1, 0.93])

  // Card 1: Slides up as scroll begins (completing by 0.35)
  const card1Y = useTransform(smoothProgress, [0.05, 0.35], ['100vh', '0vh'])
  const card1Op = useTransform(smoothProgress, [0.05, 0.20], [0, 1])
  const card1Scale = useTransform(smoothProgress, [0.40, 0.70], [1, 0.95])

  // Card 2: Slides up soon after Card 1 completes (completing by 0.68)
  const card2Y = useTransform(smoothProgress, [0.38, 0.68], ['100vh', '0vh'])
  const card2Op = useTransform(smoothProgress, [0.38, 0.53], [0, 1])

  // Tilt/rotate angles for the zig-zag effect
  const cardRotations = [-5, 4, -3]

  const bgSrc = isDesktop ? bgImageDesktop : bgImageMobile

  // Standard lineAnim for headers to match hero section
  const lineAnim = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ height: '270vh' }}
    >
      {/* Sticky viewport container */}
      <div 
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center"
        style={{
          position: 'sticky',
        }}
      >
        {/* Background Image — fully visible, no color overlay */}
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Title & Header */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.35 } } }}
          className="absolute top-[8%] z-10 text-center px-6"
        >
          {/* Calligraphy Subtitle — Modernline */}
          <motion.p
            variants={lineAnim}
            style={{
              fontFamily: "'Modernline', sans-serif",
              fontSize: isDesktop ? 'clamp(18px, 1.8vw, 24px)' : 'clamp(20px, 4.2vw, 24px)',
              color: '#4A3E20',
              margin: '0 0 6px 0',
              lineHeight: 1,
              textTransform: 'none',
            }}
          >
            Celebrating the Moments
          </motion.p>

          <motion.div variants={lineAnim}>
            <LotusDivider />
          </motion.div>

          {/* Main Header — Religath */}
          <motion.h2 
            variants={lineAnim}
            style={{ 
              fontFamily: "'Religath', serif",
              color: '#7A6840',
              fontSize: 'clamp(22px, 5vw, 32px)',
              fontWeight: 'normal',
              letterSpacing: '0.08em',
              margin: '8px 0 0 0',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            Our Moments
          </motion.h2>
        </motion.div>

        {/* Parallax Photo Stack Container */}
        <div className="relative w-full max-w-[460px] h-[350px] flex items-center justify-center px-4 z-10">
          
          {/* Card 0 */}
          {items[0] && (
            <motion.div
              style={{
                y: prefersReducedMotion ? '0vh' : card0Y,
                opacity: prefersReducedMotion ? 1 : card0Op,
                scale: prefersReducedMotion ? 1 : card0Scale,
                rotate: cardRotations[0],
                zIndex: 1,
              }}
              className="absolute w-[80%] sm:w-full aspect-[4/3] bg-[#FDFBF7] p-3 pb-6 sm:p-4 sm:pb-8 rounded-md shadow-[0_12px_30px_rgba(70,50,25,0.12)] border border-[#B58A3C]/20 flex flex-col select-none pointer-events-none"
            >
              {/* Unique Inset Gold Border Frame */}
              <div className="absolute inset-2 border border-[#B58A3C]/45 pointer-events-none z-10" />
              
              <div className="w-full h-full bg-[#f8f8f8] overflow-hidden rounded-none border border-[#B58A3C]/10">
                <img 
                  src={items[0].image} 
                  alt="Our moment 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[10px] sm:text-xs text-[#3F4930] italic font-serif leading-relaxed z-20">
                "{items[0].quote}"
              </div>
            </motion.div>
          )}

          {/* Card 1 */}
          {items[1] && (
            <motion.div
              style={{
                y: prefersReducedMotion ? '0vh' : card1Y,
                scale: prefersReducedMotion ? 1 : card1Scale,
                opacity: prefersReducedMotion ? 1 : card1Op,
                rotate: cardRotations[1],
                zIndex: 2,
              }}
              className="absolute w-[80%] sm:w-full aspect-[4/3] bg-[#FDFBF7] p-3 pb-6 sm:p-4 sm:pb-8 rounded-md shadow-[0_16px_36px_rgba(70,50,25,0.15)] border border-[#B58A3C]/20 flex flex-col select-none pointer-events-none"
            >
              {/* Unique Inset Gold Border Frame */}
              <div className="absolute inset-2 border border-[#B58A3C]/45 pointer-events-none z-10" />
              
              <div className="w-full h-full bg-[#f8f8f8] overflow-hidden rounded-none border border-[#B58A3C]/10">
                <img 
                  src={items[1].image} 
                  alt="Our moment 2" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[10px] sm:text-xs text-[#3F4930] italic font-serif leading-relaxed z-20">
                "{items[1].quote}"
              </div>
            </motion.div>
          )}

          {/* Card 2 */}
          {items[2] && (
            <motion.div
              style={{
                y: prefersReducedMotion ? '0vh' : card2Y,
                opacity: prefersReducedMotion ? 1 : card2Op,
                rotate: cardRotations[2],
                zIndex: 3,
              }}
              className="absolute w-[80%] sm:w-full aspect-[4/3] bg-[#FDFBF7] p-3 pb-6 sm:p-4 sm:pb-8 rounded-md shadow-[0_20px_42px_rgba(70,50,25,0.18)] border border-[#B58A3C]/20 flex flex-col select-none pointer-events-none"
            >
              {/* Unique Inset Gold Border Frame */}
              <div className="absolute inset-2 border border-[#B58A3C]/45 pointer-events-none z-10" />
              
              <div className="w-full h-full bg-[#f8f8f8] overflow-hidden rounded-none border border-[#B58A3C]/10">
                <img 
                  src={items[2].image} 
                  alt="Our moment 3" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[10px] sm:text-xs text-[#3F4930] italic font-serif leading-relaxed z-20">
                "{items[2].quote}"
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
