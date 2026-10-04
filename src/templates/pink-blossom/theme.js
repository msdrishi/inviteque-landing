/**
 * Pink Blossom Template — Theme Configuration
 * 
 * Color palette extracted from the reference design:
 *   - Hot Pink (primary accent):  #C8195E  (lotus petals, couple names, headings)
 *   - Deep Magenta (dark accent): #8B1848  (gradients, buttons, deeper tones)
 *   - Ivory / Cream (base bg):    #FAF3E4  (warm ivory background)
 *   - Light Ivory (story/sched):  #FBF6ED  (lighter section backgrounds)
 *   - Gold (decorative):          #B8963E  (subtle accents, borders)
 *   - Dark Olive Green (text):    #4A6741  (body text, secondary info)
 *   - Leaf Green (SVG leaves):    #3D5A3A  (foliage accents)
 */

// ─── Palette ──────────────────────────────────────────────────
export const COLORS = {
  primary: '#C8195E',   // hot pink — headings, names, accents
  primaryDark: '#8B1848',   // deep magenta — gradients, buttons
  ivory: '#FAF3E4',   // warm ivory — main background
  ivoryLight: '#FBF6ED',   // lighter ivory — card backgrounds
  gold: '#B8963E',   // gold — decorative borders & icons
  textDark: '#4A6741',   // dark olive green — body text
  leafGreen: '#3D5A3A',   // deeper green — SVG leaf strokes
  white: '#FFFFFF',
  cardBg: '#FBF6ED',   // story card & calendar card bg
  sectionBg: '#FBF6ED',   // story / schedule solid bg
}

// ─── Asset Paths (public/assets/templates/pinkblossom) ─────────
export const ASSETS = {
  coverVideo: '/assets/templates/pinkblossom/PinkBlossom-envelope.mp4',
  coverPoster: '/assets/templates/pinkblossom/PinkBlossom-envelope-poster.webp',
  heroBg: '/assets/templates/pinkblossom/PinkBlossom-hero-mobile.webp',
  storyBg: '/assets/templates/pinkblossom/PinkBlossom-light-background.webp',
  welcomeBg: '/assets/templates/pinkblossom/PinkBlossom-background-mobile.webp',
  scheduleBg: '/assets/templates/pinkblossom/PinkBlossom-light-background.webp',
  venueBg: '/assets/templates/pinkblossom/PinkBlossom-venue-mobile.webp',
  calendarBg: '/assets/templates/pinkblossom/PinkBlossom-background-mobile.webp',
  countdownBg: '/assets/templates/pinkblossom/PinkBlossom-countdown-mobile.webp',
  thumbnail: '/assets/templates/pinkblossom/PinkBlossom-landing-thumbnail.webp',
  arrow: '/assets/templates/royal-heritage/arrow.png',  // reuse existing arrow asset
  ornament: '/assets/templates/pinkblossom/Ivory Floral Tassel Ornament.png',
}

// ─── Font Style Presets (responsive — call with isDesktop, isTablet) ───
export function getFontStyles(isDesktop, isTablet) {
  return {
    cursive: {
      fontFamily: "'Modernline', 'Allura', 'Alex Brush', cursive",
      color: COLORS.primary,
      fontWeight: 'normal',
      lineHeight: 1.15,
      textShadow: '0 1px 2px rgba(255,255,255,0.4)',
      fontSize: isDesktop ? '80px' : (isTablet ? '90px' : '65px'),
      margin: 0,
    },
    serif: {
      fontFamily: "'Cormorant Garamond', serif",
      color: COLORS.textDark,
      fontSize: isDesktop ? '18px' : '15px',
      lineHeight: 1.6,
      textShadow: '0 1px 2px rgba(255,255,255,0.4)',
    },
    smallCaps: {
      fontFamily: "'Cinzel', serif",
      color: COLORS.primary,
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      fontSize: isDesktop ? '14px' : (isTablet ? '16px' : '11px'),
      fontWeight: '600',
      textShadow: '0 1px 2px rgba(255,255,255,0.4)',
    },
  }
}

// ─── Shared layout helpers ──────────────────────────────────────
export const sectionStyle = {
  position: 'relative',
  width: '100%',
  minHeight: '100svh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflowX: 'hidden',
  backgroundColor: 'transparent',
}

export const bgStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
}

// SVG subtle texture pattern for story/schedule backgrounds
export const TEXTURE_SVG = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h18v2H22v18H20V20.5z' fill='%23C8195E' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
