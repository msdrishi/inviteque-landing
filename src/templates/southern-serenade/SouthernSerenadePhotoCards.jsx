import React, { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import FallingPetals from './FallingPetals'
import { COLORS, FONTS, ASSETS, LotusDivider, slowLineAnim, slowContainerAnim } from './theme'

export default function SouthernSerenadePhotoCards({
  groomName = 'Abhishek',
  brideName = 'Anaya',
  photos = [],
  isDesktop = false,
}) {
  const containerRef = useRef(null)

  // Track scroll progress of the entire pinned height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Track entry progress from entering bottom of viewport to reaching top
  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.25,
  })

  const smoothEntryProgress = useSpring(entryProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.25,
  })

  // Default sample photos & traditional romantic quotes
  const defaultImages = [
    '/assets/templates/midnight-waltz/sample-photo-1.webp',
    '/assets/templates/midnight-waltz/sample-photo-2.webp',
    '/assets/templates/midnight-waltz/sample-photo-3.webp',
  ]

  const defaultQuotes = [
    'In your arms, I have found my sacred home.',
    'Two souls united by destiny and blessed by traditions.',
    'A timeless journey of love, laughter, and sacred vows.',
  ]

  const userPhotos = (photos || []).filter((p) => {
    const url = typeof p === 'string' ? p : p?.image
    return url && url.trim() !== ''
  })

  const cardList = [0, 1, 2].map((i) => {
    const userPhoto = userPhotos[i]
    const imgSrc = (typeof userPhoto === 'string' ? userPhoto : userPhoto?.image) || defaultImages[i]
    const quote = defaultQuotes[i]
    return { imgSrc, quote }
  })

  // Card 0: Slides up as the section enters the viewport, reaches 0vh when in view
  const card0Y = useTransform(smoothEntryProgress, [0.2, 1.0], ['60vh', '0vh'])
  const card0Op = useTransform(smoothEntryProgress, [0.2, 0.85], [0, 1])
  const card0Scale = useTransform(smoothProgress, [0.35, 0.65], [1, 0.93])

  // Card 1: Hidden at 100vh with opacity 0 until scroll starts
  const card1Y = useTransform(smoothProgress, [0.05, 0.35], ['100vh', '0vh'])
  const card1Op = useTransform(smoothProgress, [0.05, 0.20], [0, 1])
  const card1Scale = useTransform(smoothProgress, [0.40, 0.70], [1, 0.95])

  // Card 2: Hidden at 100vh with opacity 0 until Card 1 completes
  const card2Y = useTransform(smoothProgress, [0.38, 0.68], ['100vh', '0vh'])
  const card2Op = useTransform(smoothProgress, [0.38, 0.53], [0, 1])

  const cardRotations = [-3.5, 3, -1.8]

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '270vh',
        background: COLORS.bgIvory,
      }}
    >
      {/* Sticky viewport frame */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100svh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 16px',
          boxSizing: 'border-box',
        }}
      >
        {/* Background Texture */}
        <img
          src={ASSETS.plainBg}
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
            opacity: 0.95,
          }}
        />

        {/* Dynamic Sacred South Indian Lotus Mandala Background & Halo */}
        <SouthIndianMandalaBackground size={isDesktop ? 'clamp(440px, 48vw, 620px)' : 'clamp(340px, 94vw, 460px)'} />

        {/* Ambient Falling Flower Petals drifting gracefully in outer margins */}
        <FallingPetals count={16} />

        {/* Clean Header pinned to the TOP area */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          variants={slowContainerAnim}
          style={{
            position: 'absolute',
            top: isDesktop ? '7%' : '6%',
            left: 0,
            right: 0,
            zIndex: 10,
            textAlign: 'center',
            padding: '0 20px',
          }}
        >
          <motion.p
            variants={slowLineAnim}
            style={{
              fontFamily: FONTS.label,
              fontSize: '12px',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: COLORS.secondary,
              margin: '0 0 4px 0',
              fontWeight: 600,
            }}
          >
            OUR SACRED STORY
          </motion.p>
          <motion.h2
            variants={slowLineAnim}
            style={{
              fontFamily: FONTS.heading,
              fontSize: 'clamp(2.0rem, 5.2vw, 2.7rem)',
              color: COLORS.primary,
              margin: '0 0 6px 0',
              letterSpacing: '0.04em',
              fontWeight: 'normal',
              lineHeight: 1.15,
            }}
          >
            Moments in Time
          </motion.h2>
          <motion.div variants={slowLineAnim}>
            <LotusDivider color={COLORS.gold} width={135} />
          </motion.div>
        </motion.div>

        {/* Refined, more compact photo card stack placed comfortably below top title */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: isDesktop ? 340 : 275,
            height: isDesktop ? 410 : 340,
            marginTop: isDesktop ? '90px' : '75px',
          }}
        >
          {/* Card 0 */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              y: card0Y,
              opacity: card0Op,
              scale: card0Scale,
              rotate: cardRotations[0],
              transformOrigin: 'bottom center',
              zIndex: 1,
            }}
          >
            <PhotoCardItem card={cardList[0]} groomName={groomName} brideName={brideName} />
          </motion.div>

          {/* Card 1 */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              y: card1Y,
              opacity: card1Op,
              scale: card1Scale,
              rotate: cardRotations[1],
              transformOrigin: 'bottom center',
              zIndex: 2,
            }}
          >
            <PhotoCardItem card={cardList[1]} groomName={groomName} brideName={brideName} />
          </motion.div>

          {/* Card 2 */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              y: card2Y,
              opacity: card2Op,
              rotate: cardRotations[2],
              transformOrigin: 'bottom center',
              zIndex: 3,
            }}
          >
            <PhotoCardItem card={cardList[2]} groomName={groomName} brideName={brideName} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function PhotoCardItem({ card, groomName, brideName }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#FAF6EF',
        borderRadius: 18,
        padding: '10px 10px 14px 10px',
        boxSizing: 'border-box',
        border: `1.5px solid ${COLORS.borderGold}`,
        boxShadow: '0 10px 28px rgba(115, 25, 36, 0.12)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: '100%',
          flex: 1,
          borderRadius: 12,
          overflow: 'hidden',
          background: '#EDE4D4',
          position: 'relative',
        }}
      >
        <img
          src={card.imgSrc}
          alt={`${groomName} & ${brideName}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          loading="lazy"
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: '14.5px',
            fontStyle: 'italic',
            color: COLORS.darkText,
            margin: '0 0 3px 0',
            lineHeight: 1.3,
            fontWeight: 500,
          }}
        >
          "{card.quote}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 0.6, background: COLORS.gold, opacity: 0.5 }} />
          <span style={{ fontSize: 9, color: COLORS.primary }}>✦</span>
          <span style={{ width: 16, height: 0.6, background: COLORS.gold, opacity: 0.5 }} />
        </div>
      </div>
    </div>
  )
}

// ── Sacred South Indian Lotus Kolam / Mandala Animated SVG Background ─────
function SouthIndianMandalaBackground({ size = 'clamp(340px, 94vw, 460px)' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '56%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 1. Luminous Warm Golden Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: '85%',
          height: '85%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(197, 160, 89, 0.28) 0%, rgba(235, 220, 185, 0.14) 48%, rgba(248, 243, 234, 0) 74%)',
          filter: 'blur(24px)',
        }}
      />

      {/* 2. Outer Rotating Lotus & Kolam Layer (Clockwise 75s) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 75, ease: 'linear' }}
      >
        <svg
          viewBox="0 0 600 600"
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 2px 10px rgba(139, 104, 52, 0.16))',
          }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outermost dotted & dash auspicious rings */}
          <circle cx="300" cy="300" r="286" stroke="#8B6834" strokeWidth="1.8" strokeDasharray="3 8" strokeOpacity="0.5" />
          <circle cx="300" cy="300" r="274" stroke="#C5A059" strokeWidth="2.5" strokeDasharray="6 7" strokeOpacity="0.75" />
          <circle cx="300" cy="300" r="262" stroke="#8B6834" strokeWidth="1.2" strokeOpacity="0.55" />
          <circle cx="300" cy="300" r="252" stroke="#C5A059" strokeWidth="1.5" strokeDasharray="2 6" strokeOpacity="0.65" />

          {/* 16 Outer South Indian Temple Lotus Petals with Sacred Bindus */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16
            return (
              <g key={`outer-lotus-${i}`} transform={`rotate(${angle} 300 300)`}>
                <path
                  d="M 300 48 C 322 88, 338 120, 320 150 C 300 135, 300 135, 280 150 C 262 120, 278 88, 300 48 Z"
                  stroke="#8B6834"
                  strokeWidth="1.8"
                  fill="rgba(197, 160, 89, 0.06)"
                  strokeOpacity="0.75"
                />
                <circle cx="300" cy="72" r="3" fill="#C5A059" />
                <circle cx="300" cy="115" r="2.4" fill="#731924" fillOpacity="0.8" />
                <line x1="300" y1="78" x2="300" y2="128" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="2 3" strokeOpacity="0.55" />
              </g>
            )
          })}

          {/* Intermediate Decorative Ring */}
          <circle cx="300" cy="300" r="162" stroke="#8B6834" strokeWidth="1.8" strokeOpacity="0.6" />
          <circle cx="300" cy="300" r="154" stroke="#C5A059" strokeWidth="2.2" strokeDasharray="4 6" strokeOpacity="0.75" />
        </svg>
      </motion.div>

      {/* 3. Middle Counter-Rotating Temple Archways Layer (Counter-Clockwise 50s) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
      >
        <svg
          viewBox="0 0 600 600"
          style={{ width: '100%', height: '100%' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 12 Traditional South Indian Temple Archways */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12
            return (
              <g key={`mid-arch-${i}`} transform={`rotate(${angle} 300 300)`}>
                <path
                  d="M 265 154 C 278 118, 322 118, 335 154"
                  stroke="#C5A059"
                  strokeWidth="2.2"
                  strokeDasharray="3 4"
                  fill="none"
                  strokeOpacity="0.8"
                />
                <path
                  d="M 276 154 C 286 128, 314 128, 324 154"
                  stroke="#8B6834"
                  strokeWidth="1.6"
                  fill="rgba(197, 160, 89, 0.09)"
                  strokeOpacity="0.65"
                />
                <circle cx="300" cy="124" r="3.2" fill="#731924" fillOpacity="0.85" />
                <circle cx="288" cy="138" r="2.2" fill="#C5A059" />
                <circle cx="312" cy="138" r="2.2" fill="#C5A059" />
              </g>
            )
          })}

          {/* Inner Golden Ring */}
          <circle cx="300" cy="300" r="105" stroke="#8B6834" strokeWidth="2" strokeOpacity="0.75" />
          <circle cx="300" cy="300" r="97" stroke="#C5A059" strokeWidth="2.5" strokeDasharray="3 5" strokeOpacity="0.85" />
          <circle cx="300" cy="300" r="88" stroke="#8B6834" strokeWidth="1.5" strokeOpacity="0.65" />
        </svg>
      </motion.div>

      {/* 4. Center 8-Petal Sacred Lotus (Clockwise 35s with subtle breathing scale) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.03, 1],
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 35, ease: 'linear' },
          scale: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
        }}
      >
        <svg
          viewBox="0 0 600 600"
          style={{ width: '100%', height: '100%' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8
            return (
              <g key={`core-lotus-${i}`} transform={`rotate(${angle} 300 300)`}>
                <path
                  d="M 300 215 C 314 235, 320 255, 300 278 C 280 255, 286 235, 300 215 Z"
                  stroke="#731924"
                  strokeWidth="1.8"
                  fill="rgba(197, 160, 89, 0.18)"
                  strokeOpacity="0.85"
                />
                <circle cx="300" cy="235" r="2.2" fill="#C5A059" />
              </g>
            )
          })}
          {/* Central Sacred Bindu */}
          <circle cx="300" cy="300" r="14" fill="#731924" fillOpacity="0.8" stroke="#C5A059" strokeWidth="2" />
          <circle cx="300" cy="300" r="5" fill="#C5A059" />
        </svg>
      </motion.div>

      {/* 5. Ambient Golden Twinkling Stars */}
      <motion.span
        animate={{ opacity: [0.2, 0.85, 0.2], scale: [0.8, 1.25, 0.8] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '6%',
          right: '10%',
          color: '#C5A059',
          fontSize: '16px',
        }}
      >
        ✦
      </motion.span>
      <motion.span
        animate={{ opacity: [0.15, 0.75, 0.15], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 4.2, delay: 1.2, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '8%',
          color: '#C5A059',
          fontSize: '14px',
        }}
      >
        ✦
      </motion.span>
      <motion.span
        animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.75, 1.2, 0.75] }}
        transition={{ repeat: Infinity, duration: 3.8, delay: 2.1, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '6%',
          color: '#C5A059',
          fontSize: '12px',
        }}
      >
        ✦
      </motion.span>
      <motion.span
        animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 4.6, delay: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '16%',
          right: '6%',
          color: '#C5A059',
          fontSize: '13px',
        }}
      >
        ✦
      </motion.span>
    </div>
  )
}
