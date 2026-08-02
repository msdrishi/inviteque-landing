import { useRef } from 'react'
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
  const size = 8 + Math.random() * 10;
  const x1 = Math.random() * 50 - 25;
  const x2 = Math.random() * 50 - 25;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

function FallingGoldPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100%' }}>
      {petalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size, 
            opacity: 0.8,
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))'
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
          {/* A traditional gold-colored floral petal/mandala shape */}
          <svg viewBox="0 0 40 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 0 C 32 10, 32 30, 20 40 C 8 30, 8 10, 20 0 Z" fill="#D4AF37" />
            <circle cx="20" cy="20" r="3" fill="#FFF3CD" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

const RoyalMandalaDivider = () => (
  <div className="flex flex-col items-center gap-1 my-6 opacity-80">
    <svg viewBox="0 0 100 30" width="120" height="36" className="fill-[#E3C57C]">
      {/* Decorative Traditional Arch/Mandala Centerpiece */}
      <path d="M 50,0 Q 55,10 65,10 Q 75,10 80,0 C 75,15 55,25 50,30 C 45,25 25,15 20,0 Q 25,10 35,10 Q 45,10 50,0 Z" fill="#E3C57C" />
      <circle cx="50" cy="12" r="3.5" fill="#FFFDF2" stroke="none" />
      {/* Side wings */}
      <path d="M 20,5 Q 10,12 0,5 Q 10,18 20,12" fill="#E3C57C" />
      <path d="M 80,5 Q 90,12 100,5 Q 90,18 80,12" fill="#E3C57C" />
    </svg>
  </div>
)

export default function InvitationRoyalPalace({ data, bgImage }) {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Smooth springs for background parallax
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-6%']), { stiffness: 45, damping: 15 })

  if (!data) return null

  return (
    <section
      ref={containerRef}
      id={data.id || "invitation"}
      className="relative w-full min-h-[100svh] overflow-hidden flex flex-col justify-center items-center py-16 px-6 bg-[#FFFDF2]"
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.05, transformOrigin: 'center' }}
      >
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Falling Gold Petals Effect */}
      <FallingGoldPetals />

      {/* Main Content Area - Aligned perfectly */}
      <div className="relative z-10 w-full max-w-[500px] p-8 sm:p-10 flex flex-col items-center text-center">
        {/* Traditional Mandala Design */}
        <RoyalMandalaDivider />

        {/* Title */}
        <div className="mb-6">
          <AnimatedTitle 
            text="The honor of your presence"
            style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(10px, 2.5vw, 12px)', color: '#E3C57C', fontWeight: 500, margin: 0, letterSpacing: '3px', textTransform: 'uppercase' }}
          />
          <AnimatedTitle 
            text="is requested"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(32px, 8vw, 42px)', color: '#E3C57C', fontWeight: 'normal', margin: '4px 0 0 0' }}
          />
        </div>

        {/* Custom Message Body */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#E3C57C] max-w-[340px] mb-6"
          style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '18px', 
            lineHeight: '1.7', 
            fontWeight: 400 
          }}
        >
          {data.message || "With hearts full of love and joy, we invite our dear friends and family to join us in celebrating this special chapter of our lives as we begin our beautiful journey together."}
        </motion.p>

        {/* Couple Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="my-2 text-center"
        >
          <h3 
            className="uppercase text-[#E3C57C]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(28px, 6vw, 36px)', letterSpacing: '2px' }}
          >
            {data.groomName || "Groom"}
          </h3>
          <span 
            className="block my-1 text-[#E3C57C]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '28px' }}
          >
            &amp;
          </span>
          <h3 
            className="uppercase text-[#E3C57C]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(28px, 6vw, 36px)', letterSpacing: '2px' }}
          >
            {data.brideName || "Bride"}
          </h3>
        </motion.div>

        {/* Sub Monogram */}
        <div className="mt-6 flex items-center justify-center gap-2 opacity-50">
          <div className="h-[0.5px] bg-[#E3C57C] w-8" />
          <span className="text-[#E3C57C] text-[10px]" style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '3px' }}>ROYAL UNION</span>
          <div className="h-[0.5px] bg-[#E3C57C] w-8" />
        </div>
      </div>
    </section>
  )
}
