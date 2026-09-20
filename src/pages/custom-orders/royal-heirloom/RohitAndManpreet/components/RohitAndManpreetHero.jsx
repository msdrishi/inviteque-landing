import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ganeshaLogo from '../../../../../templates/royal-heirloom/ganesha-logo.png'

// ── Falling Leaves / Petals Component (Aura of Elegance Style — delicate, smaller, pinkish blush matching bg) ──
const petalConfig = Array.from({ length: 16 }).map((_, i) => {
  const isLeft = i % 2 === 0
  const leftPos = isLeft ? Math.random() * 14 : 86 + Math.random() * 14 // strictly outer edges (0-14% or 86-100%)
  const duration = 7 + Math.random() * 7 // slow realistic floating
  const delay = Math.random() * 5
  const size = 10 + Math.random() * 8 // smaller delicate leaf size (10px to 18px)
  const xDrift = (isLeft ? 1 : -1) * (10 + Math.random() * 14) // contained drift so it never reaches center
  return { left: leftPos, duration, delay, size, xDrift }
})

export const FallingRoyalFlowers = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden w-full h-full">
      {petalConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute -top-8"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size * 1.35,
            opacity: 0.85,
          }}
          initial={{ y: '-10vh', opacity: 0 }}
          animate={{
            y: ['0vh', '112vh'],
            x: [0, p.xDrift, p.xDrift * 0.3, p.xDrift * 0.9],
            rotate: [0, 360],
            opacity: [0, 0.88, 0.88, 0.45, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Realistic delicate leaf matching background floral illustration in vintage dusty rose / blush */}
          <svg viewBox="0 0 24 32" width="100%" height="100%" fill="none" className="drop-shadow-[0_1px_3px_rgba(120,60,50,0.2)]">
            <path
              d="M12 2 C6 7, 3 17, 12 30 C21 17, 18 7, 12 2 Z"
              fill="#C49388"
              fillOpacity="0.75"
              stroke="#7E473D"
              strokeWidth="0.7"
            />
            <path
              d="M12 4 C11 11, 10 19, 12 28"
              stroke="#6B382F"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path d="M12 11 Q8 14 6 17" stroke="#6B382F" strokeWidth="0.45" strokeLinecap="round" opacity="0.6" />
            <path d="M12 16 Q16 19 18 22" stroke="#6B382F" strokeWidth="0.45" strokeLinecap="round" opacity="0.6" />
            <path
              d="M12 6 C10 10, 8 16, 12 24"
              stroke="#E8C5BE"
              strokeWidth="0.4"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// Letter-by-Letter Couple Name with 3-4s slow fade-in letter animation (Hero ONLY)
export const AnimatedCoupleName = ({ name, isTriggered, delay = 0.2, fontSizeClass = "text-[50px] sm:text-[58px]" }) => {
  const letters = useMemo(() => Array.from(String(name || '')), [name])
  const [showGlare, setShowGlare] = useState(false)

  useEffect(() => {
    if (isTriggered) {
      // Reveal the shiny glare sweep only after letters finish fading in
      const timer = setTimeout(() => {
        setShowGlare(true)
      }, (delay + letters.length * 0.14 + 3.0) * 1000)
      return () => clearTimeout(timer)
    } else {
      setShowGlare(false)
    }
  }, [isTriggered, delay, letters.length])

  return (
    <div className="relative inline-flex items-center justify-center select-none overflow-visible px-2 py-6 -my-6">
      <span className="relative z-10 flex items-center justify-center overflow-visible">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 22, scale: 0.82, filter: 'blur(8px)' }}
            animate={isTriggered ? { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              filter: 'blur(0px)' 
            } : { 
              opacity: 0, 
              y: 22, 
              scale: 0.82, 
              filter: 'blur(8px)' 
            }}
            transition={{
              duration: 3.5,
              delay: delay + i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`font-['Modernline',_'Allura',_'Alex_Brush',_cursive] ${fontSizeClass} leading-[1.35] pb-3 inline-block font-normal overflow-visible`}
            style={{
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              color: '#4A2810',
              textShadow: '0 1px 1px rgba(255,255,255,0.6)',
              filter: 'drop-shadow(0px 1px 2px rgba(80, 40, 15, 0.25))',
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>

      {showGlare && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            backgroundPosition: ['200% center', '-200% center'] 
          }}
          transition={{ 
            opacity: { duration: 1.0 },
            backgroundPosition: {
              repeat: Infinity, 
              duration: 7.5, 
              ease: 'easeInOut', 
              repeatDelay: 3.0 
            }
          }}
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center font-['Modernline',_'Allura',_'Alex_Brush',_cursive] ${fontSizeClass} leading-[1.35] pb-3 overflow-visible select-none`}
          style={{
            background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.9) 47%, rgba(255,230,150,0.98) 50%, rgba(255,255,255,0.9) 53%, transparent 75%)',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {name}
        </motion.span>
      )}
    </div>
  )
}

export default function RohitAndManpreetHero({
  heroBgMobile,
  hasTriggeredHeroBg,
  hasTriggeredHeroText,
  hasOpened,
  brideName,
  brideFamily,
  groomName,
  groomFamily,
  weddingMonth,
  dayOfWeek,
  weddingDate,
  formattedTime,
  weddingYear,
  fullAddress,
}) {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden bg-[#ECE3D1]">
      <motion.div
        initial={{ scale: 1.14, opacity: 0 }}
        animate={hasTriggeredHeroBg || hasOpened ? { scale: 1.0, opacity: 1 } : { scale: 1.14, opacity: 0 }}
        transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${heroBgMobile})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Falling Royal Flower Petals from top */}
      {(hasTriggeredHeroBg || hasOpened) && <FallingRoyalFlowers />}

      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center pt-2 pb-16 md:pb-20 px-6 text-[#4A3223]">
        {/* Header: Ganesha & WEDDING INVITATION */}
        <motion.div 
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(6px)' }}
          transition={{ duration: 3.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-1.5 mb-2 md:mb-4"
        >
          {/* Ganesha Logo Placeholder */}
          <img src={ganeshaLogo} alt="Om Ganesha" className="w-12 h-12 md:w-16 md:h-16 object-contain mb-1 opacity-90 drop-shadow-md" />
          
          <span className="font-['Cinzel'] text-[12px] sm:text-[14px] md:text-[18px] tracking-[0.36em] uppercase text-[#6B4330] font-semibold leading-tight">
            WEDDING
          </span>
          <span className="font-['Cinzel'] text-[12px] sm:text-[14px] md:text-[18px] tracking-[0.36em] uppercase text-[#6B4330] font-semibold leading-tight">
            INVITATION
          </span>
        </motion.div>

        {/* Couple Names in signature calligraphy with super slow majestic reveal */}
        <div className="flex flex-col items-center justify-center w-full my-2 md:my-4 overflow-visible">
          <div className="flex flex-col items-center">
            <AnimatedCoupleName 
              name={groomName} 
              isTriggered={hasTriggeredHeroText || hasOpened}
              delay={0.3} 
              fontSizeClass="text-[46px] sm:text-[54px] md:text-[76px]" 
            />
            {groomFamily && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                transition={{ duration: 2.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-['Cinzel'] text-[10px] sm:text-[12px] md:text-[14px] tracking-[0.15em] uppercase text-[#6B4734] font-medium mt-1 text-center"
              >
                {groomFamily}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 3.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="my-0.5 md:my-1 text-center"
          >
            <span 
              className="font-['Modernline',_'Allura',_'Alex_Brush',_cursive] text-[28px] sm:text-[34px] md:text-[50px] leading-none inline-block select-none font-normal"
              style={{
                color: '#6B401D',
                filter: 'drop-shadow(0px 1px 2px rgba(90, 45, 15, 0.25))',
              }}
            >
              &amp;
            </span>
          </motion.div>

          <div className="flex flex-col items-center">
            <AnimatedCoupleName 
              name={brideName} 
              isTriggered={hasTriggeredHeroText || hasOpened}
              delay={1.2} 
              fontSizeClass="text-[46px] sm:text-[54px] md:text-[76px]" 
            />
            {brideFamily && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                transition={{ duration: 2.5, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-['Cinzel'] text-[10px] sm:text-[12px] md:text-[14px] tracking-[0.15em] uppercase text-[#6B4734] font-medium mt-1 text-center"
              >
                {brideFamily}
              </motion.p>
            )}
          </div>
        </div>

        {/* Subtext, Date Module & Mumbai Address */}
        <div className="flex flex-col items-center w-full max-w-[340px] md:max-w-[500px] px-2 gap-1.5 md:gap-3 mt-1.5 md:mt-4">
          <motion.p 
            initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
            animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(5px)' }}
            transition={{ duration: 3.6, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Cinzel'] text-[9.5px] sm:text-[10px] md:text-[14px] tracking-[0.22em] uppercase text-[#6B4734] font-medium leading-[1.55] max-w-[280px] md:max-w-[400px]"
          >
            Invite you to their wedding celebration
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 3.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-1.5 md:gap-2 mb-3 md:mb-5"
          >
            <div className="flex items-center justify-center w-full max-w-[280px] md:max-w-[420px]">
              <div className="flex-1 flex flex-col justify-center">
                <div className="h-[0.8px] md:h-[1.5px] w-full bg-[#8C6044]/70 mb-1 md:mb-2" />
                <span className="font-['Cinzel'] text-[9px] sm:text-[10px] md:text-[13px] tracking-[0.28em] uppercase text-[#6B4330] font-semibold text-center whitespace-nowrap">
                  {weddingMonth}
                </span>
                <div className="h-[0.8px] md:h-[1.5px] w-full bg-[#8C6044]/70 mt-1 md:mt-2" />
              </div>

              <div className="px-2 md:px-4">
                <span className="font-['Bodoni_Moda',_'Cinzel',_serif] text-[24px] sm:text-[28px] md:text-[42px] leading-none font-bold text-[#4F301D] tracking-tight whitespace-nowrap">
                  {weddingDate}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="h-[0.8px] md:h-[1.5px] w-full bg-[#8C6044]/70 mb-1 md:mb-2" />
                <span className="font-['Cinzel'] text-[9px] sm:text-[10px] md:text-[13px] tracking-[0.28em] uppercase text-[#6B4330] font-semibold text-center whitespace-nowrap">
                  {weddingYear}
                </span>
                <div className="h-[0.8px] md:h-[1.5px] w-full bg-[#8C6044]/70 mt-1 md:mt-2" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={hasTriggeredHeroText || hasOpened ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(4px)' }}
            transition={{ duration: 3.6, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-0 md:mt-2"
          >
            <span 
              className="font-['Modernline',_'Allura',_'Alex_Brush',_cursive] text-[16px] sm:text-[18px] md:text-[22px] leading-none select-none"
              style={{
                color: '#6E4424',
                filter: 'drop-shadow(0px 1px 1px rgba(90, 45, 15, 0.2))'
              }}
            >
              #LettheRoMancebegin
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
