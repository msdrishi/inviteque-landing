import React from 'react'
import { motion } from 'framer-motion'
import { COLORS } from './theme'

/**
 * Reusable ScrollDownIndicator for Pink Blossom sections.
 * Displays a floating, gently bouncing down-arrow at the bottom-center of the section.
 */
export default function ScrollDownIndicator({ 
  targetId, 
  onClick, 
  color = COLORS.primary,
  label = null,
  style = {} 
}) {
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) {
      onClick()
      return
    }
    if (targetId) {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    // Default: smooth scroll down by one viewport screen
    window.scrollBy({ top: window.innerHeight * 0.95, behavior: 'smooth' })
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Scroll down"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer pointer-events-auto select-none group"
      style={style}
    >
      {label && (
        <span 
          className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-semibold opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ fontFamily: "'Cinzel', serif", color }}
        >
          {label}
        </span>
      )}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all group-hover:scale-110 active:scale-95 shadow-[0_4px_14px_rgba(200,25,94,0.18)]"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.78)',
          border: `1.2px solid ${color}45`,
        }}
      >
        <svg viewBox="0 0 16 10" width="12" height="7" fill="none" aria-hidden="true">
          <path
            d="M1.5 1.5 L8 8 L14.5 1.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </motion.div>
    </motion.button>
  )
}
