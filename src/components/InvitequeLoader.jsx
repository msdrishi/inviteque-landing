import React from 'react'

const tightLogo = '/assets/logo/inviteq-logo-tight.webp'
const fallbackLogo = '/assets/logo/inviteq-logo.webp'

/**
 * Standard Inviteque Loading Component
 * Features a refined circular Inviteque logo with a golden rotating ring hugging directly on its perimeter with NO gap.
 * 
 * @param {boolean} fullScreen - Whether to render as fixed full-screen overlay (default true)
 * @param {string} text - Optional label below logo (e.g. "Loading...", or null for brand only)
 * @param {string} bg - Background color (default '#FDFCFB')
 * @param {string} size - Size: 'sm' (compact), 'md' (standard refined), 'lg' (medium)
 */
export default function InvitequeLoader({
  fullScreen = true,
  text = null,
  bg = '#FDFCFB',
  size = 'md',
  className = '',
}) {
  const sizeMap = {
    sm: { 
      dimension: 'w-10 h-10', 
      border: 'border-[2px]', 
      font: 'text-base',
    },
    md: { 
      dimension: 'w-12 h-12', 
      border: 'border-[2.5px]', 
      font: 'text-lg',
    },
    lg: { 
      dimension: 'w-16 h-16', 
      border: 'border-[3px]', 
      font: 'text-xl',
    },
  }

  const s = sizeMap[size] || sizeMap.md

  const content = (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Container: exact same dimension as logo so ring hugs the logo perimeter without any gap or space */}
      <div className={`relative ${s.dimension} rounded-full flex items-center justify-center overflow-visible`}>
        {/* Crisp circular Inviteque Logo fitting 100% edge-to-edge */}
        <img
          src={tightLogo}
          onError={(e) => { e.currentTarget.src = fallbackLogo }}
          alt="Inviteque"
          className="w-full h-full object-cover rounded-full select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(212,175,55,0.18)]"
          loading="eager"
        />

        {/* Static subtle gold ring right on the logo edge */}
        <div className={`absolute inset-0 rounded-full ${s.border} border-[#D4AF37]/25 pointer-events-none`} />

        {/* Golden animated spinning arc directly hugging the logo edge with NO gap or space */}
        <div 
          className={`absolute inset-0 rounded-full ${s.border} border-t-[#D4AF37] border-r-[#F6E29F] border-b-transparent border-l-transparent animate-spin pointer-events-none`}
          style={{
            animationDuration: '1.0s',
            filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))',
          }}
        />
      </div>

      {/* Brand Text under Logo */}
      <div className="mt-2 text-center">
        <h2 className={`font-parisienne ${s.font} font-normal text-[#2C241E] opacity-95 leading-none tracking-wide`}>
          Inviteque
        </h2>
        {text && (
          <p className="mt-1 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
            {text}
          </p>
        )}
      </div>
    </div>
  )

  if (!fullScreen) return content

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out"
      style={{ backgroundColor: bg }}
    >
      {content}

      {/* Subtle traditional corner accents */}
      <div className="fixed top-8 left-8 h-10 w-10 border-t border-l border-[#D4AF37]/25 rounded-tl-2xl pointer-events-none" />
      <div className="fixed bottom-8 right-8 h-10 w-10 border-b border-r border-[#D4AF37]/25 rounded-br-2xl pointer-events-none" />
    </div>
  )
}
