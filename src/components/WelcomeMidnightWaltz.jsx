import { motion } from 'framer-motion'

/* ──────────────────────────────────────────────────────────────
   WelcomeMidnightWaltz.jsx
   Welcome / Invitation section — typography-only layer over
   the existing watercolor background image (temple on right).
   Text is placed in the empty LEFT-MIDDLE area of the bg.
   ────────────────────────────────────────────────────────────── */

// Small lotus divider ornament
function LotusDivider() {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}
    >
      <div style={{ width: 30, height: 0.75, background: '#B58A3C', opacity: 0.55 }} />
      <svg viewBox="0 0 40 22" width={40} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20 C20 20 9 11 5 4 C9 7 14 9 20 9 C26 9 31 7 35 4 C31 11 20 20 20 20Z" fill="#B58A3C" opacity="0.65" />
        <path d="M20 20 C20 20 13 13 11 7 C14 9.5 17 11 20 11 C23 11 26 9.5 29 7 C27 13 20 20 20 20Z" fill="#B58A3C" opacity="0.4" />
        <circle cx="20" cy="7" r="2.2" fill="#B58A3C" opacity="0.55" />
      </svg>
      <div style={{ width: 30, height: 0.75, background: '#B58A3C', opacity: 0.55 }} />
    </div>
  )
}

const lineAnim = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function WelcomeMidnightWaltz({
  data,
  bgImageDesktop,
  bgImageMobile,
  isDesktop,
}) {
  if (!data) return null

  // Check if device is a tablet
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024

  return (
    <section
      id="welcome"
      aria-label="Welcome"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background image — do not modify */}
      <img
        src={isDesktop ? bgImageDesktop : bgImageMobile}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Typography layer — left-middle of the parchment area */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.35 } } }}
        style={{
          position: 'relative',
          zIndex: 2,
          // Left-middle positioning: stays in the empty parchment area
          marginLeft: isDesktop ? 'clamp(40px, 8%, 120px)' : (isTablet ? '8%' : '6%'),
          width: isDesktop ? 'clamp(280px, 42%, 560px)' : (isTablet ? '50%' : '72%'),
          maxWidth: isDesktop ? 520 : (isTablet ? 450 : 320),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          paddingTop: isDesktop ? '0' : '15svh',
          paddingBottom: isDesktop ? '0' : '10svh',
        }}
      >
        {/* WELCOME label — Modernline calligraphy */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(18px, 1.8vw, 24px)' : (isTablet ? 'clamp(32px, 4vw, 38px)' : 'clamp(20px, 4.2vw, 24px)'),
            color: '#4A3E20',
            margin: '0 0 6px 0',
            lineHeight: 1,
            textTransform: 'none',
          }}
        >
          Welcome
        </motion.p>

        {/* Dear Friends — Religath serif */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(28px, 3.2vw, 38px)' : (isTablet ? 'clamp(36px, 5vw, 44px)' : 'clamp(20px, 5vw, 24px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '0 0 2px 0',
            lineHeight: 1.1,
            letterSpacing: '0.04em',
          }}
        >
          Dear Friends
        </motion.p>

        {/* & Family — Religath serif */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? 'clamp(28px, 3.2vw, 38px)' : (isTablet ? 'clamp(36px, 5vw, 44px)' : 'clamp(20px, 5vw, 24px)'),
            textTransform: 'uppercase',
            color: '#7A6840',
            margin: '0 0 10px 0',
            lineHeight: 1.1,
            letterSpacing: '0.04em',
          }}
        >
          &amp; Family,
        </motion.p>

        {/* Thin gold rule */}
        <motion.div
          variants={lineAnim}
          style={{ width: 44, height: 0.75, background: '#B09060', opacity: 0.55, marginBottom: 12 }}
        />

        {/* Body paragraph — Cormorant Garamond with reduced line height spacing */}
        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: isDesktop ? 'clamp(16px, 1.5vw, 20px)' : (isTablet ? 'clamp(20px, 2.8vw, 24px)' : 'clamp(13px, 3.8vw, 15px)'),
            color: '#4A3E20',
            lineHeight: 1.45,
            margin: 0,
            opacity: 0.9,
            maxWidth: '100%',
          }}
        >
          Your presence is a cherished part of our celebration. Join us as we gather with love, laughter, and blessings to celebrate the beginning of our beautiful journey together.
        </motion.p>

        {/* Lotus divider */}
        <motion.div variants={lineAnim} style={{ alignSelf: 'flex-start' }}>
          <LotusDivider />
        </motion.div>
      </motion.div>
    </section>
  )
}
