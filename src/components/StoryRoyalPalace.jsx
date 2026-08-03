import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function StoryRoyalPalace({ data, isDesktop, bgImage }) {
  const containerRef = useRef(null)

  // Track scroll progress of the entire section when pinned
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Track scroll progress of the section entering the viewport
  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  })

  // Apply springs
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.25
  })

  const smoothEntryProgress = useSpring(entryProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.25
  })

  if (!data || !Array.isArray(data.items)) return null
  const items = data.items.slice(0, 3)

  // Card 0: Slides up as the section enters the viewport
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
  const cardRotations = [-4, 3, -2]

  // Traditional Gold Corner Ornaments SVG
  const CornerMandala = ({ top, left, right, bottom, rotate = 0, opacity = 0.35 }) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      width="120"
      height="120"
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
      {/* Corner Bracket */}
      <path d="M5 95 L5 5 L95 5" stroke="#E3C57C" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 88 L12 12 L88 12" stroke="#E3C57C" strokeWidth="1" opacity="0.6" />
      
      {/* Intricate Mandala Corner Details */}
      <path d="M12 12 Q25 25 35 12 Q45 25 55 12" stroke="#E3C57C" strokeWidth="1.2" />
      <path d="M12 12 Q25 25 12 35 Q25 45 12 55" stroke="#E3C57C" strokeWidth="1.2" />
      
      <circle cx="12" cy="12" r="4" fill="#FFFDF2" />
      <circle cx="30" cy="30" r="2.5" fill="#E3C57C" />
      <circle cx="45" cy="45" r="2" fill="#E3C57C" />
    </svg>
  )

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ height: '270vh' }}
    >
      {/* Sticky Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#5C0A14]">
        {/* Background image container via <img> to prevent unquoted spaces issue */}
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover z-0"
          />
        )}

        {/* Ornamental corner brackets */}
        <CornerMandala top={12} left={12} rotate={0} />
        <CornerMandala top={12} right={12} rotate={90} />
        <CornerMandala bottom={12} left={12} rotate={-90} />
        <CornerMandala bottom={12} right={12} rotate={180} />

        {/* Title */}
        <div className="absolute top-[8%] z-10 text-center px-6">
          <h2 
            className="text-[#E3C57C] mb-1.5 uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 600, letterSpacing: '2px' }}
          >
            Our Cherished Moments
          </h2>
          <div className="flex items-center justify-center gap-3 opacity-60 mb-2">
            <div className="h-[0.9px] bg-[#E3C57C] w-12" />
            <span className="text-[#E3C57C] text-xs">✦</span>
            <div className="h-[0.9px] bg-[#E3C57C] w-12" />
          </div>
          <p 
            className="text-xs uppercase text-[#E3C57C] max-w-[280px] mx-auto font-medium"
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '2.5px' }}
          >
            A royal journey of love, friendship and vows
          </p>
        </div>

        {/* Card Stack Container */}
        <div className="relative w-full max-w-[480px] h-[360px] flex items-center justify-center px-4 z-10">
          
          {/* Card 0 */}
          {items[0] && (
            <motion.div
              style={{
                y: card0Y,
                opacity: card0Op,
                scale: card0Scale,
                rotate: cardRotations[0],
                zIndex: 1,
                borderRadius: '120px 120px 0 0',
              }}
              className="absolute w-[76%] sm:w-full aspect-[4/3] bg-white p-3 pb-7 sm:p-4 sm:pb-9 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#D4AF37]/35 flex flex-col select-none pointer-events-none"
            >
              {/* Outer gold border frame, inner maroon frame */}
              <div className="absolute inset-1.5 border border-[#D4AF37]/50 pointer-events-none z-10" style={{ borderRadius: '110px 110px 0 0' }} />
              <div className="absolute inset-2.5 border border-[#7B0F1A]/20 pointer-events-none z-10" style={{ borderRadius: '100px 100px 0 0' }} />
              
              <div className="w-full h-full bg-[#FAF9F5] overflow-hidden border border-[#D4AF37]/20" style={{ borderRadius: '95px 95px 0 0' }}>
                <img 
                  src={items[0].image} 
                  alt="Our moment 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[#7B0F1A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '15px', fontWeight: 500 }}>
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
                borderRadius: '120px 120px 0 0',
              }}
              className="absolute w-[76%] sm:w-full aspect-[4/3] bg-white p-3 pb-7 sm:p-4 sm:pb-9 shadow-[0_24px_55px_rgba(0,0,0,0.28)] border border-[#D4AF37]/35 flex flex-col select-none pointer-events-none"
            >
              {/* Outer gold border frame, inner maroon frame */}
              <div className="absolute inset-1.5 border border-[#D4AF37]/50 pointer-events-none z-10" style={{ borderRadius: '110px 110px 0 0' }} />
              <div className="absolute inset-2.5 border border-[#7B0F1A]/20 pointer-events-none z-10" style={{ borderRadius: '100px 100px 0 0' }} />
              
              <div className="w-full h-full bg-[#FAF9F5] overflow-hidden border border-[#D4AF37]/20" style={{ borderRadius: '95px 95px 0 0' }}>
                <img 
                  src={items[1].image} 
                  alt="Our moment 2" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[#7B0F1A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '15px', fontWeight: 500 }}>
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
                borderRadius: '120px 120px 0 0',
              }}
              className="absolute w-[76%] sm:w-full aspect-[4/3] bg-white p-3 pb-7 sm:p-4 sm:pb-9 shadow-[0_28px_60px_rgba(0,0,0,0.3)] border border-[#D4AF37]/35 flex flex-col select-none pointer-events-none"
            >
              {/* Outer gold border frame, inner maroon frame */}
              <div className="absolute inset-1.5 border border-[#D4AF37]/50 pointer-events-none z-10" style={{ borderRadius: '110px 110px 0 0' }} />
              <div className="absolute inset-2.5 border border-[#7B0F1A]/20 pointer-events-none z-10" style={{ borderRadius: '100px 100px 0 0' }} />
              
              <div className="w-full h-full bg-[#FAF9F5] overflow-hidden border border-[#D4AF37]/20" style={{ borderRadius: '95px 95px 0 0' }}>
                <img 
                  src={items[2].image} 
                  alt="Our moment 3" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3.5 px-2 text-[#7B0F1A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '15px', fontWeight: 500 }}>
                "Two hearts, one soul, a lifetime of beautiful moments."
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
