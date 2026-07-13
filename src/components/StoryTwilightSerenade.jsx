import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function StoryTwilightSerenade({ data, isDesktop, bgImage }) {
  const containerRef = useRef(null)

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

  // Apply spring for super smooth, slower transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 28,
    damping: 22,
    mass: 1.0
  })

  const smoothEntryProgress = useSpring(entryProgress, {
    stiffness: 28,
    damping: 22,
    mass: 1.0
  })

  if (!data || !Array.isArray(data.items)) return null
  const items = data.items.slice(0, 3)

  // Card 0: Slides up as the section enters the viewport, and reaches 0vh when fully in view
  const card0Y = useTransform(smoothEntryProgress, [0.2, 1.0], ['60vh', '0vh'])
  const card0Op = useTransform(smoothEntryProgress, [0.2, 0.85], [0, 1])
  const card0Scale = useTransform(smoothProgress, [0.35, 0.65], [1, 0.93])

  // Card 1: Slides up as scroll begins (completing by 0.38)
  const card1Y = useTransform(smoothProgress, [0.08, 0.38], ['100vh', '0vh'])
  const card1Op = useTransform(smoothProgress, [0.08, 0.23], [0, 1])
  const card1Scale = useTransform(smoothProgress, [0.48, 0.78], [1, 0.95])

  // Card 2: Slides up soon after Card 1 completes (completing by 0.75)
  const card2Y = useTransform(smoothProgress, [0.45, 0.75], ['100vh', '0vh'])
  const card2Op = useTransform(smoothProgress, [0.45, 0.60], [0, 1])

  // Tilt/rotate angles for the zig-zag effect
  const cardRotations = [-5, 4, -3]

  // Beautiful corner leaf decoration SVG component
  const CornerLeaves = ({ top, left, right, bottom, rotate = 0, opacity = 0.25 }) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      width="130"
      height="130"
      style={{
        position: 'absolute',
        top, left, right, bottom,
        transform: `rotate(${rotate}deg)`,
        opacity,
        pointerEvents: 'none',
        zIndex: 5,
      }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 10 Q60 20 90 90" stroke="#3D5236" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M25 20 Q12 35 25 45 Q38 30 25 20Z" fill="#3D5236" />
      <path d="M42 32 Q35 52 50 58 Q60 38 42 32Z" fill="#3D5236" />
      <path d="M60 48 Q55 72 72 75 Q80 52 60 48Z" fill="#3D5236" />
      <path d="M78 68 Q75 92 90 90 Q92 70 78 68Z" fill="#3D5236" />
      <circle cx="35" cy="18" r="3" fill="#D4AF37" />
      <circle cx="53" cy="30" r="2.5" fill="#D4AF37" />
      <circle cx="70" cy="48" r="2" fill="#D4AF37" />
    </svg>
  )

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ height: '360vh' }} // Slowed scroll locked scrollbar spacing to 360vh
    >
      {/* Sticky viewport container */}
      <div 
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: bgImage ? `linear-gradient(rgba(251, 247, 240, 0.82), rgba(251, 247, 240, 0.82)), url(${bgImage})` : 'none',
          backgroundColor: '#FBF7F0', // Fallback sage green background
        }}
      >
        {/* Decorative corner accents for a garden vibe */}
        <CornerLeaves top={12} left={12} rotate={0} />
        <CornerLeaves top={12} right={12} rotate={90} />
        <CornerLeaves bottom={12} left={12} rotate={-90} />
        <CornerLeaves bottom={12} right={12} rotate={180} />

        {/* Title & Header */}
        <div className="absolute top-[8%] z-10 text-center px-6">
          <h2 
            className="text-[#3D5236] text-xl sm:text-2xl tracking-[0.18em] uppercase font-bold mb-1.5"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Our Moments
          </h2>
          <div className="flex items-center justify-center gap-3 opacity-60 mb-2">
            <div className="h-[0.9px] bg-[#3D5236] w-12" />
            <span className="text-[#3D5236] text-[8px]">♥</span>
            <div className="h-[0.9px] bg-[#3D5236] w-12" />
          </div>
          <p 
            className="text-xs sm:text-sm text-[#3D5236]/90 max-w-[280px] mx-auto italic"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            A lifetime of love and beautiful memories
          </p>
        </div>

        {/* Parallax Photo Stack Container */}
        <div className="relative w-full max-w-[480px] h-[360px] flex items-center justify-center px-4">
          
          {/* Card 0 */}
          {items[0] && (
            <motion.div
              style={{
                y: card0Y,
                opacity: card0Op,
                scale: card0Scale,
                rotate: cardRotations[0],
                zIndex: 1,
              }}
              className="absolute w-[76%] sm:w-full aspect-[4/3] bg-white p-3 pb-6 sm:p-4 sm:pb-8 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-[#3D5236]/10 flex flex-col select-none pointer-events-none"
            >
              {/* Unique Inset Green Border Frame */}
              <div className="absolute inset-1.5 border border-[#3D5236]/45 pointer-events-none z-10" />
              
              <div className="w-full h-full bg-[#f8f8f8] overflow-hidden rounded-none border border-[#3D5236]/10">
                <img 
                  src={items[0].image} 
                  alt="Our moment quote 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[10px] sm:text-xs text-[#3D5236] italic font-serif leading-relaxed z-20">
                "In your arms, I have found my forever home."
              </div>
            </motion.div>
          )}

          {/* Card 1 */}
          {items[1] && (
            <motion.div
              style={{
                y: card1Y,
                scale: card1Scale,
                opacity: card1Op,
                rotate: cardRotations[1],
                zIndex: 2,
              }}
              className="absolute w-[76%] sm:w-full aspect-[4/3] bg-white p-3 pb-6 sm:p-4 sm:pb-8 rounded-none shadow-[0_24px_55px_rgba(0,0,0,0.22)] border border-[#3D5236]/10 flex flex-col select-none pointer-events-none"
            >
              {/* Unique Inset Green Border Frame */}
              <div className="absolute inset-1.5 border border-[#3D5236]/45 pointer-events-none z-10" />
              
              <div className="w-full h-full bg-[#f8f8f8] overflow-hidden rounded-none border border-[#3D5236]/10">
                <img 
                  src={items[1].image} 
                  alt="Our moment quote 2" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[10px] sm:text-xs text-[#3D5236] italic font-serif leading-relaxed z-20">
                "Every love story is beautiful, but ours is my favorite."
              </div>
            </motion.div>
          )}

          {/* Card 2 */}
          {items[2] && (
            <motion.div
              style={{
                y: card2Y,
                opacity: card2Op,
                rotate: cardRotations[2],
                zIndex: 3,
              }}
              className="absolute w-[76%] sm:w-full aspect-[4/3] bg-white p-3 pb-6 sm:p-4 sm:pb-8 rounded-none shadow-[0_28px_60px_rgba(0,0,0,0.25)] border border-[#3D5236]/10 flex flex-col select-none pointer-events-none"
            >
              {/* Unique Inset Green Border Frame */}
              <div className="absolute inset-1.5 border border-[#3D5236]/45 pointer-events-none z-10" />
              
              <div className="w-full h-full bg-[#f8f8f8] overflow-hidden rounded-none border border-[#3D5236]/10">
                <img 
                  src={items[2].image} 
                  alt="Our moment quote 3" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[10px] sm:text-xs text-[#3D5236] italic font-serif leading-relaxed z-20">
                "Two hearts, one soul, a lifetime of beautiful moments."
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
