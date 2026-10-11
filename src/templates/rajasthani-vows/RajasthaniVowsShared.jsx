import { motion } from 'framer-motion'

export function LotusDivider({ color = '#C59A4E' }) {
  return (
    <div className="flex items-center justify-center gap-2 select-none w-full max-w-[220px] mx-auto my-1.5">
      <div className="flex-1 flex items-center justify-end">
        <div className="h-[0.8px] w-full bg-gradient-to-r from-transparent to-[#C59A4E]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C59A4E] mx-1" />
      </div>
      <svg viewBox="0 0 54 36" className="w-7 h-5 fill-none flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M27 31 C18 29 9 22 7 13 C13 15 20 21 27 31 Z" fill="#F0E2D0" fillOpacity="0.5" stroke="#C59A4E" strokeWidth="0.9" />
        <path d="M27 31 C36 29 45 22 47 13 C41 15 34 21 27 31 Z" fill="#F0E2D0" fillOpacity="0.5" stroke="#C59A4E" strokeWidth="0.9" />
        <path d="M27 30 C20 24 13 15 14 6 C20 10 25 20 27 30 Z" fill="#FAF0E4" fillOpacity="0.65" stroke="#A87B32" strokeWidth="1" />
        <path d="M27 30 C34 24 41 15 40 6 C34 10 29 20 27 30 Z" fill="#FAF0E4" fillOpacity="0.65" stroke="#A87B32" strokeWidth="1" />
        <path d="M27 29 C23 20 22 10 27 3 C32 10 31 20 27 29 Z" fill="#C59A4E" fillOpacity="0.85" stroke="#8A1230" strokeWidth="1.1" />
        <path d="M21 31 Q27 34 33 31" stroke="#8A1230" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <div className="flex-1 flex items-center justify-start">
        <div className="w-1.5 h-1.5 rounded-full bg-[#C59A4E] mx-1" />
        <div className="h-[0.8px] w-full bg-gradient-to-l from-transparent to-[#C59A4E]" />
      </div>
    </div>
  )
}

const headerContainerAnim = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.05,
    },
  },
}

const headerLineAnim = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
}

export function SectionHeader({ subtitle, title, description }) {
  return (
    <motion.div
      variants={headerContainerAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      className="flex flex-col items-center text-center px-4 mb-3"
    >
      {subtitle && (
        <motion.span
          variants={headerLineAnim}
          className="font-['Cinzel'] text-[11.5px] sm:text-[12.5px] tracking-[0.32em] uppercase font-semibold text-[#8A1D33] mb-1 block"
        >
          {subtitle}
        </motion.span>
      )}
      {title && (
        <motion.h2
          variants={headerLineAnim}
          className="font-['Cinzel'] text-[24px] sm:text-[28px] font-bold tracking-[0.16em] uppercase text-[#7A1228] mb-1.5 leading-tight block"
        >
          {title}
        </motion.h2>
      )}
      <motion.div variants={headerLineAnim} className="w-full">
        <LotusDivider />
      </motion.div>
      {description && (
        <motion.p
          variants={headerLineAnim}
          className="font-['Cinzel'] text-[13px] sm:text-[14px] tracking-[0.06em] text-[#8A1D33]/90 max-w-[340px] leading-relaxed mt-1 block"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}

