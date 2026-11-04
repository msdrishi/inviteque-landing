import React from 'react'

export const COLORS = {
  primary: '#731924',      // Royal South Indian Temple Maroon
  secondary: '#8B6834',    // Antique Gold / Bronze
  gold: '#C5A059',         // Warm Muted Gold
  goldLight: '#EBDCB9',    // Soft Pale Gold
  bgIvory: '#F8F3EA',      // Warm Cream / Ivory textured base
  borderGold: 'rgba(197, 160, 89, 0.45)',
  darkText: '#352520',     // Deep grounding text
}

export const FONTS = {
  heading: "'Religath', serif",
  label: "'Cinzel', serif",
  script: "'Modernline', cursive",
  body: "'Cormorant Garamond', serif",
}

export const ASSETS = {
  heroBg: '/assets/templates/southern-serenade/hero-mobile.webp',
  welcomeBg: '/assets/templates/southern-serenade/welcome-tray.webp',
  plainBg: '/assets/templates/southern-serenade/plain-bg.webp',
  venueBg: '/assets/templates/southern-serenade/venue-mobile.webp',
  countdownBg: '/assets/templates/southern-serenade/countdown-mobile.webp',
  thumbnail: '/assets/templates/southern-serenade/thumbnail.webp',
  rosePetal: '/assets/decorations/midnight-waltz-rosePetal.webp',
  welcomeTray: '/assets/templates/southern-serenade/welcome-tray.webp',
}

// ── Shared Slow Line Animation (Duration: 2.2s) ─────────────────
export const slowLineAnim = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slowContainerAnim = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.35 },
  },
}

// ── Winged Lotus Divider from Thumbnail ─────────────────────────
export function LotusDivider({ color = COLORS.gold, width = 140 }) {
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
      <div style={{ flex: 1, height: 0.8, background: color, opacity: 0.65 }} />
      <svg viewBox="0 0 32 16" width={26} height={13} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 15 C16 15 9 8 7 3 C10 5 13 6 16 6 C19 6 22 5 25 3 C23 8 16 15 16 15Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M16 15 C16 15 12 10 11 5 C13 7 15 8 16 8 C17 8 19 7 21 5 C20 10 16 15 16 15Z"
          fill={color}
          opacity="0.65"
        />
        <circle cx="16" cy="4.5" r="1.3" fill={color} />
      </svg>
      <div style={{ flex: 1, height: 0.8, background: color, opacity: 0.65 }} />
    </div>
  )
}

// ── Diamond Rule Divider (———————— ◆ ————————) ─────────────────
export function DiamondDivider({ color = COLORS.gold, width = 220 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width,
        margin: '6px auto',
      }}
    >
      <div style={{ flex: 1, height: 0.75, background: color, opacity: 0.55 }} />
      <span style={{ color, fontSize: 8, lineHeight: 1, opacity: 0.85 }}>◆</span>
      <div style={{ flex: 1, height: 0.75, background: color, opacity: 0.55 }} />
    </div>
  )
}

// ── Icons from Thumbnail ─────────────────────────────────────────
export function CalendarIcon({ size = 18, color = COLORS.secondary }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function ClockIcon({ size = 18, color = COLORS.secondary }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function PinIcon({ size = 18, color = COLORS.secondary }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  )
}
