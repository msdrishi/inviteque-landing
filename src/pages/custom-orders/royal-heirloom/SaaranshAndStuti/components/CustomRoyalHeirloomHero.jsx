import { motion } from 'framer-motion'

// ── Falling Leaves / Petals Component (Aura of Elegance Style) ──
const petalConfig = Array.from({ length: 16 }).map((_, i) => {
  const isLeft = i % 2 === 0
  const leftPos = isLeft ? Math.random() * 14 : 86 + Math.random() * 14
  const duration = 7 + Math.random() * 7
  const delay = Math.random() * 5
  const size = 10 + Math.random() * 8
  const xDrift = (isLeft ? 1 : -1) * (10 + Math.random() * 14)
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

export default function CustomRoyalHeirloomHero({
  heroBgMobile,
  hasTriggeredHeroBg,
  hasTriggeredHeroText,
  hasOpened,
  brideName = "Stuti",
  brideFamily = "Daughter of Mrs Meenakshi & Rajiv Puri",
  groomName = "Saaransh",
  groomFamily = "Son of Mrs Sapna & Nitin Chopra",
  weddingDate = "20",
  weddingMonth = "December",
  weddingYear = "2026",
}) {
  const isTriggered = hasTriggeredHeroText || hasOpened
  const formattedHeroDate = (() => {
    const d = parseInt(weddingDate, 10)
    let suffix = 'TH'
    if (d % 10 === 1 && d !== 11) suffix = 'ST'
    else if (d % 10 === 2 && d !== 12) suffix = 'ND'
    else if (d % 10 === 3 && d !== 13) suffix = 'RD'
    return `${d}${suffix} ${weddingMonth.toUpperCase()} ${weddingYear}`
  })()

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-between text-center overflow-hidden bg-[#ECE3D1] px-6">
      {/* Background Architectural/Floral Mural */}
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

      {/* Falling Royal Flower Petals */}
      {(hasTriggeredHeroBg || hasOpened) && <FallingRoyalFlowers />}

      {/* Top Spacer: Exactly sized to place content below the top arch scalloped curve */}
      <div className="h-[14svh] sm:h-[16svh] min-h-[85px] w-full pointer-events-none" />

      {/* Main Content Container: Perfectly centered within the inner clear arch area */}
      <div className="relative z-10 w-full flex flex-col justify-center items-center text-[#4A3223] my-auto max-w-[340px]">
        {/* Intro Tag */}
        <motion.div
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={isTriggered ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 12, filter: 'blur(4px)' }}
          transition={{ duration: 2.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-3 sm:mb-4"
        >
          <span className="font-['Cinzel'] text-[11px] sm:text-[12px] md:text-[13px] tracking-[0.24em] uppercase text-[#6B4330] font-semibold text-center leading-snug">
            Celebrating the coming<br />together of
          </span>
        </motion.div>

        {/* Couple Names & Family Details */}
        <div className="flex flex-col items-center justify-center w-full my-1 sm:my-2 overflow-visible">
          {/* Groom */}
          <motion.div 
            initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
            animate={isTriggered ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(5px)' }}
            transition={{ duration: 2.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1 
              className="font-['Modernline',_'Allura',_'Alex_Brush',_cursive] text-[44px] sm:text-[50px] md:text-[62px] leading-[1.1] text-[#4A2810] font-normal drop-shadow-sm select-none"
              style={{
                textShadow: '0 1px 2px rgba(255,255,255,0.6)',
                filter: 'drop-shadow(0px 1px 2px rgba(80, 40, 15, 0.25))',
              }}
            >
              {groomName}
            </h1>
            {groomFamily && (
              <p className="font-['Cinzel'] text-[9.5px] sm:text-[10.5px] md:text-[11.5px] tracking-[0.16em] uppercase text-[#6B4734] font-medium mt-2.5 sm:mt-3 text-center">
                {groomFamily.startsWith('(') ? groomFamily : `(${groomFamily})`}
              </p>
            )}
          </motion.div>

          {/* Connector & */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="my-1.5 sm:my-2.5 text-center"
          >
            <span
              className="font-['Modernline',_'Allura',_'Alex_Brush',_cursive] text-[26px] sm:text-[30px] md:text-[36px] leading-none inline-block select-none font-normal"
              style={{
                color: '#6B401D',
                filter: 'drop-shadow(0px 1px 2px rgba(90, 45, 15, 0.25))',
              }}
            >
              &amp;
            </span>
          </motion.div>

          {/* Bride */}
          <motion.div 
            initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
            animate={isTriggered ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(5px)' }}
            transition={{ duration: 2.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1 
              className="font-['Modernline',_'Allura',_'Alex_Brush',_cursive] text-[44px] sm:text-[50px] md:text-[62px] leading-[1.1] text-[#4A2810] font-normal drop-shadow-sm select-none"
              style={{
                textShadow: '0 1px 2px rgba(255,255,255,0.6)',
                filter: 'drop-shadow(0px 1px 2px rgba(80, 40, 15, 0.25))',
              }}
            >
              {brideName}
            </h1>
            {brideFamily && (
              <p className="font-['Cinzel'] text-[9.5px] sm:text-[10.5px] md:text-[11.5px] tracking-[0.16em] uppercase text-[#6B4734] font-medium mt-2.5 sm:mt-3 text-center">
                {brideFamily.startsWith('(') ? brideFamily : `(${brideFamily})`}
              </p>
            )}
          </motion.div>
        </div>

        {/* Wedding Date as requested: "keep the date as well" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 2.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-2.5 my-3 sm:my-3.5"
        >
          <div className="h-[0.8px] w-6 bg-[#8C5D38]/50" />
          <span className="font-['Cinzel'] text-[11px] sm:text-[12px] md:text-[13px] tracking-[0.22em] uppercase text-[#543625] font-bold">
            {formattedHeroDate}
          </span>
          <div className="h-[0.8px] w-6 bg-[#8C5D38]/50" />
        </motion.div>

        {/* Blessings Section with comfortable line spacing */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 2.2, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mt-2.5 text-center max-w-[340px]"
        >
          <span className="font-['Cinzel'] text-[10px] sm:text-[11px] md:text-[11.5px] tracking-[0.24em] uppercase text-[#8C5D38] font-bold mb-1.5">
            With blessings of -
          </span>
          <span className="font-['Cinzel'] text-[10px] sm:text-[11px] md:text-[11.5px] tracking-[0.14em] uppercase text-[#543625] font-semibold leading-[1.7]">
            Veena &amp; Late ND Chopra
          </span>
          <span className="font-['Cinzel'] text-[10px] sm:text-[11px] md:text-[11.5px] tracking-[0.14em] uppercase text-[#543625] font-semibold leading-[1.7] mt-0.5">
            Santosh &amp; Late Lalit Nanda
          </span>
        </motion.div>
      </div>

      {/* Bottom Scroll Down Arrow: Placed comfortably ABOVE the bottom corner floral bouquets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isTriggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="relative z-10 flex flex-col items-center justify-center gap-1 select-none pointer-events-none mt-2 pb-[8svh] sm:pb-[10svh]"
      >
        <span className="font-['Cinzel'] text-[8.5px] tracking-[0.3em] uppercase text-[#6B4330] font-bold opacity-80">
          Scroll Down
        </span>
        <motion.svg
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-3.5 h-3.5 text-[#6B4330]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </section>
  )
}
