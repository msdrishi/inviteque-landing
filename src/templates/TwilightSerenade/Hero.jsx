import { useState, useEffect, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const desktopBg = "/assets/templates/twilight-serenade/hero-desktop.webp"
const smartphoneBg = "/assets/templates/twilight-serenade/hero-mobile.webp"

const leafConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20;
  const duration = 6 + Math.random() * 8;
  const delay = Math.random() * 5;
  const size = 5 + Math.random() * 10;
  const x1 = Math.random() * 60 - 30;
  const x2 = Math.random() * 60 - 30;
  return { left: leftPos, duration, delay, size, x1, x2 };
});

function FallingLeaves() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100svh' }}>
      {leafConfig.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%]"
          style={{ 
            left: `${p.left}%`, 
            width: p.size, 
            height: p.size * 1.5, 
            opacity: 0.80,
            filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.15))'
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

export default function TwilightSerenadeHero({ data, isDesktop }) {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)

  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%'])
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fadeInSlow = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 2.2, ease: "easeOut" } }
  }

  const nameContainerVariant = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.14,
      }
    }
  }

  const letterAnimVariant = {
    hidden: { opacity: 0, y: 15, filter: 'blur(2px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 1.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  }

  const dateParts = useMemo(() => {
    const parts = String(data.dateLine || '').trim().split(/\s+/)
    if (parts.length >= 3) {
      return {
        day: parts[0],
        month: parts[1],
        year: parts[2]
      }
    }
    return { day: '18', month: '12', year: '2026' }
  }, [data.dateLine])

  return (
    <section 
      className={`relative overflow-hidden flex flex-col items-center text-center select-none ${
        isDesktop 
          ? 'h-screen w-full justify-center py-20 px-8' 
          : 'h-[100svh] w-full justify-start pt-[11svh] pb-8 px-6'
      }`}
    >
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.05, transformOrigin: 'center' }}
      >
        <img
          src={isLandscape ? smartphoneBg : desktopBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center top' }}
          loading="eager"
        />
      </motion.div>

      <FallingLeaves />

      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.35 } }
        }}
        className="relative z-20 flex flex-col items-center max-w-xl translate-x-[1.7%] md:-translate-y-[25%] md:translate-x-[1.5%] lg:-translate-x-[1.7%]"
      >
        <motion.div variants={fadeInSlow} className="mb-2">
          <svg viewBox="0 0 40 24" width="32" height="20" fill="none" className="stroke-[#3D5236] opacity-90">
            <path d="M20 2 L20 18" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 10 Q20 4 28 10" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M14 14 Q20 10 26 14" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="1.8" fill="#3D5236" />
          </svg>
        </motion.div>

        <motion.p 
          variants={fadeInSlow} 
          className="text-[9px] sm:text-xs tracking-[0.3em] uppercase text-[#3D5236] font-bold mb-2 sm:mb-2.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Save the Date
        </motion.p>

        <motion.h1 
          variants={nameContainerVariant}
          className={`text-[#3D5236] uppercase tracking-[0.06em] select-none font-bold ${
            isDesktop ? 'text-4xl md:text-5xl mb-2' : 'text-2xl sm:text-3xl mb-1.5'
          }`}
          style={{ fontFamily: "'Cinzel', serif", lineHeight: '1.2' }}
        >
          <span className="block mb-0.5 sm:mb-1 relative" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.groomName || '').split('').map((char, index) => (
                <motion.span 
                  key={`groom-${index}`} 
                  variants={letterAnimVariant} 
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.48) 50%, transparent 60%)',
                backgroundSize: '200% 250%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                zIndex: 2,
                display: 'block',
              }}
              aria-hidden="true"
            >
              {(data.groomName || '').split('').map((char, index) => (
                <span key={`groom-glare-${index}`} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </motion.span>
          </span>
          <motion.span 
            variants={fadeInSlow}
            className="block my-0.5 text-2xl sm:text-3xl font-medium lowercase italic font-serif text-[#3D5236]/90"
          >
            &amp;
          </motion.span>
          <span className="block mt-0.5 sm:mt-1 relative" style={{ display: 'block', position: 'relative' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {(data.brideName || '').split('').map((char, index) => (
                <motion.span 
                  key={`bride-${index}`} 
                  variants={letterAnimVariant} 
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <motion.span
              animate={{ backgroundPosition: ['100% center', '-200% center'] }}
              transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.48) 50%, transparent 60%)',
                backgroundSize: '200% 250%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                zIndex: 2,
                display: 'block',
              }}
              aria-hidden="true"
            >
              {(data.brideName || '').split('').map((char, index) => (
                <span key={`bride-glare-${index}`} style={{ display: 'inline-block' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </motion.span>
          </span>
        </motion.h1>

        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] tracking-[0.25em] uppercase text-[#3D5236] font-bold mb-1.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Are Getting Married
        </motion.p>

        <motion.div 
          variants={fadeInSlow} 
          className="flex items-center gap-3 w-32 my-1 opacity-50"
        >
          <div className="h-[0.9px] bg-[#3D5236] flex-1" />
          <span className="text-[#3D5236] text-[8px]">♥</span>
          <div className="h-[0.9px] bg-[#3D5236] flex-1" />
        </motion.div>

        <motion.div 
          variants={fadeInSlow} 
          className={`text-[#3D5236] tracking-[0.12em] flex items-center justify-center my-1 font-bold ${
            isDesktop ? 'text-2xl md:text-3xl gap-3' : 'text-base sm:text-lg gap-1.5'
          }`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span>{dateParts.day}</span>
          <span className="text-[#3D5236]/40 font-bold text-lg sm:text-xl">|</span>
          <span>{dateParts.month}</span>
          <span className="text-[#3D5236]/40 font-bold text-lg sm:text-xl">|</span>
          <span>{dateParts.year}</span>
        </motion.div>

        <motion.p 
          variants={fadeInSlow} 
          className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#3D5236] font-bold mb-1.5"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.dayOfWeek || 'Friday'}
        </motion.p>

        <motion.p 
          variants={fadeInSlow} 
          className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#3D5236]/90 font-bold mb-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {data.weddingTime}
        </motion.p>
        <motion.div variants={fadeInSlow} className="flex flex-col items-center">
          <div className="mb-1.5">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3D5236" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3.2" />
            </svg>
          </div>
          {data.addressParts && data.addressParts.length > 0 ? (
            <div className="flex flex-col items-center gap-0.5">
              {data.addressParts.map((part, index) => (
                <p 
                  key={index}
                  className="text-[#3D5236] tracking-[0.18em] uppercase font-bold text-center leading-relaxed"
                  style={{ 
                    fontFamily: "'Cinzel', serif",
                    fontSize: isDesktop 
                      ? (index === 0 ? 'clamp(14px, 1.4vw, 17px)' : 'clamp(11px, 1.0vw, 13px)') 
                      : (index === 0 ? 'clamp(11px, 1.5svh, 13px)' : 'clamp(9px, 1.2svh, 10.5px)'),
                    opacity: index === 0 ? 1 : 0.95
                  }}
                >
                  {part}
                </p>
              ))}
            </div>
          ) : (
            <p 
              className="text-[#3D5236] tracking-[0.18em] uppercase font-bold text-center leading-relaxed"
              style={{ 
                fontFamily: "'Cinzel', serif",
                fontSize: isDesktop ? 'clamp(14px, 1.4vw, 17px)' : 'clamp(11px, 1.5svh, 13px)'
              }}
            >
              {data.venueName}
              <span className="block mt-0.5 text-[#3D5236]/90 font-semibold tracking-[0.15em]" style={{ fontSize: isDesktop ? 'clamp(11px, 1.0vw, 13px)' : 'clamp(9px, 1.2svh, 10.5px)' }}>{data.venueCity}</span>
            </p>
          )}
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
        }}
        aria-label="Scroll down"
        className="absolute z-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ bottom: 'clamp(20px, 4vh, 40px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '1.5px solid rgba(61,82,54,0.3)',
            background: 'rgba(255,255,255,0.58)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 18 11" width="13" height="8" fill="none" aria-hidden="true">
            <path d="M1 1.5 L9 9.5 L17 1.5"
              stroke="#3D5236" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.8"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  )
}
