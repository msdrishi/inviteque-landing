import React from 'react'

export const COLORS = {
  primary: '#2D5A27',      // Forest / Foliage Green (matching leaf borders & groom tie)
  secondary: '#8C6D37',    // Antique Gold / Warm Ochre
  gold: '#B88E3E',         // Rich Honey Gold
  goldLight: '#EBDCB9',    // Soft Pale Gold
  goldMuted: 'rgba(184, 142, 62, 0.45)',
  bgWhite: '#FFFFFF',      // Pure White Clean Canvas
  bgIvory: '#FBF9F5',      // Warm Alabaster base
  bgCard: 'rgba(255, 255, 255, 0.95)',
  borderGold: 'rgba(184, 142, 62, 0.4)',
  darkText: '#1E2D1A',     // Deep grounding forest slate
  mutedText: '#556B52',    // Olive-tinted refined secondary text
  whiteText: '#FFFFFF',    // Crisp white for colored backgrounds
  accentBrown: '#5C3826',  // Warm church wood / walnut accent
}

export const FONTS = {
  heading: "'Cinzel', 'Made Mirage', serif",
  label: "'Cinzel', serif",
  subheading: "'Cinzel', serif",
  body: "'Cormorant Garamond', 'Made Mirage', serif",
}

export const ASSETS = {
  heroBg: '/assets/templates/eternal-covenant/hero-mobile.webp',
  plainBg: '/assets/templates/eternal-covenant/plain-bg.webp',
  bouquet: '/assets/templates/eternal-covenant/bouquet.webp',
  venueBg: '/assets/templates/eternal-covenant/venue-mobile.webp',
  thumbnail: '/assets/templates/eternal-covenant/thumbnail.webp',
}

// ── Shared Slow Line Animation (Duration: 2.2s per skill guide) ────
export const slowLineAnim = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slowContainerAnim = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.28 },
  },
}

// ── Latin Cross Divider Motif ─────────────────────────
export function CovenantCrossDivider({ color = COLORS.gold, width = 160 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width,
        margin: '8px auto',
      }}
    >
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.55 }} />
      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={color} strokeWidth="1.4">
        <path d="M12 2v20M7 8h10" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1.5" fill={color} />
      </svg>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.55 }} />
    </div>
  )
}

// ── Diamond Rule Divider (———————— ✦ ————————) ──────────
export function CovenantDiamondDivider({ color = COLORS.gold, width = 200 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width,
        margin: '6px auto',
      }}
    >
      <div style={{ flex: 1, height: 0.8, background: color, opacity: 0.55 }} />
      <span style={{ color, fontSize: 10, lineHeight: 1, opacity: 0.9 }}>✦</span>
      <div style={{ flex: 1, height: 0.8, background: color, opacity: 0.55 }} />
    </div>
  )
}
