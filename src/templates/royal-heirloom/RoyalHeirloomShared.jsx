import { useMemo } from 'react'
import { motion } from 'framer-motion'

export const LotusDivider = ({ className = "" }) => (
  <div className={`flex items-center justify-center gap-2 select-none w-full max-w-[240px] mx-auto my-2 ${className}`}>
    <div className="flex-1 flex items-center justify-end">
      <div className="h-[0.8px] w-full bg-gradient-to-r from-transparent via-[#8C5D38]/50 to-[#6B401D]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#6B401D] mx-1" />
      <span className="text-[7px] text-[#6B401D] opacity-90 inline-block">✦</span>
    </div>

    <svg viewBox="0 0 54 36" className="w-8 h-5.5 fill-none flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M27 31 C18 29 9 22 7 13 C13 15 20 21 27 31 Z" fill="#D9C2A7" fillOpacity="0.45" stroke="#7A4B24" strokeWidth="0.9" />
      <path d="M27 31 C36 29 45 22 47 13 C41 15 34 21 27 31 Z" fill="#D9C2A7" fillOpacity="0.45" stroke="#7A4B24" strokeWidth="0.9" />
      <path d="M27 30 C20 24 13 15 14 6 C20 10 25 20 27 30 Z" fill="#E8D5C0" fillOpacity="0.6" stroke="#683C1A" strokeWidth="1" />
      <path d="M27 30 C34 24 41 15 40 6 C34 10 29 20 27 30 Z" fill="#E8D5C0" fillOpacity="0.6" stroke="#683C1A" strokeWidth="1" />
      <path d="M27 29 C23 20 22 10 27 3 C32 10 31 20 27 29 Z" fill="#C99863" fillOpacity="0.85" stroke="#522C10" strokeWidth="1.1" />
      <path d="M21 31 Q27 34 33 31" stroke="#522C10" strokeWidth="1.3" strokeLinecap="round" />
    </svg>

    <div className="flex-1 flex items-center justify-start">
      <span className="text-[7px] text-[#6B401D] opacity-90 inline-block">✦</span>
      <div className="w-1.5 h-1.5 rounded-full bg-[#6B401D] mx-1" />
      <div className="h-[0.8px] w-full bg-gradient-to-l from-transparent via-[#8C5D38]/50 to-[#6B401D]" />
    </div>
  </div>
)

export const SectionHeader = ({ subtitle, title, description, light = false }) => {
  const titleLetters = useMemo(() => Array.from(String(title || '')), [title])

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center px-4 mb-3"
    >
      {subtitle && (
        <span className={`font-['Cinzel'] text-[12.5px] sm:text-[13.5px] tracking-[0.34em] uppercase font-bold mb-0.5 ${light ? 'text-[#D4AF37]' : 'text-[#8C5D38]'}`}>
          {subtitle}
        </span>
      )}

      {/* Letter-by-letter animation for every section title */}
      <h2 className={`font-['Cinzel_Decorative',_'Cinzel',_serif] text-[22px] min-[380px]:text-[25px] sm:text-[30px] font-bold tracking-wider leading-tight mb-1 select-none flex items-center justify-center flex-wrap ${light ? 'text-[#FAF5EB]' : 'text-[#4A2810]'}`}>
        {titleLetters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: 0.08 + i * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}
          >
            {char}
          </motion.span>
        ))}
      </h2>

      <LotusDivider />
      {description && (
        <p className={`font-['Cormorant_Garamond'] italic text-[17px] sm:text-[18px] max-w-[320px] leading-snug mt-0.5 ${light ? 'text-[#E0D1BA]' : 'text-[#6B4734]'}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
