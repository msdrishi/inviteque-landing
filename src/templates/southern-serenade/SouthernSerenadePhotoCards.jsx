import React, { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import FallingPetals from './FallingPetals'
import { COLORS, FONTS, ASSETS, LotusDivider, slowLineAnim, slowContainerAnim } from './theme'

// Reusable South Indian Temple Zari Washi Tape Component
function WashiTape({ top, bottom, left, right, rotate = 0, width = 74, height = 24 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        bottom,
        left,
        right,
        width,
        height,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.95) 0%, rgba(197, 160, 89, 0.88) 50%, rgba(225, 195, 125, 0.95) 100%)',
        border: '1px dashed rgba(115, 25, 36, 0.25)',
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        zIndex: 10,
        pointerEvents: 'none',
        borderRadius: 2,
      }}
    />
  )
}

// Sacred Temple Lotus Medallion Wax Seal
function LotusMedallionSeal() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '20%',
        right: -22,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, #8A2230 0%, ${COLORS.primary} 70%, #501018 100%)`,
        border: `2px solid ${COLORS.gold}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(115, 25, 36, 0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
        zIndex: 12,
      }}
    >
      {/* Intricate Sacred Lotus Blossom SVG */}
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 C13.5 6.5, 16 9, 12 14 C8 9, 10.5 6.5, 12 3 Z" fill="rgba(197, 160, 89, 0.25)" />
        <path d="M12 14 C15 11, 19 12, 21 16 C17 17.5, 14 16, 12 14 Z" fill="rgba(197, 160, 89, 0.2)" />
        <path d="M12 14 C9 11, 5 12, 3 16 C7 17.5, 10 16, 12 14 Z" fill="rgba(197, 160, 89, 0.2)" />
        <circle cx="12" cy="14" r="1.5" fill={COLORS.gold} />
      </svg>
    </div>
  )
}

export default function SouthernSerenadePhotoCards({
  groomName = 'Abhishek',
  brideName = 'Anaya',
  photos = [],
  isDesktop = false,
}) {
  const containerRef = useRef(null)

  // Track scroll position for smooth cascading motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'center center'],
  })

  // Spring physics for buttery smooth cascading motion like Aura of Elegance
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 42,
    damping: 16,
    mass: 1.2,
  })

  // Staggered slide and fade animations tied to smoothed scroll
  const p1X = useTransform(smoothProgress, [0, 0.6], [-280, 0])
  const p1Op = useTransform(smoothProgress, [0, 0.45], [0, 1])

  const p2X = useTransform(smoothProgress, [0.18, 0.78], [280, 0])
  const p2Op = useTransform(smoothProgress, [0.18, 0.6], [0, 1])

  const p3X = useTransform(smoothProgress, [0.36, 0.96], [-280, 0])
  const p3Op = useTransform(smoothProgress, [0.36, 0.75], [0, 1])

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

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        background: COLORS.bgIvory,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: isDesktop ? '90px' : '75px',
        paddingBottom: isDesktop ? '110px' : '90px',
        boxSizing: 'border-box',
      }}
    >
      {/* Background Texture Overlay */}
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
          pointerEvents: 'none',
        }}
      />

      {/* Gentle ambient floating flower petals drifting in margins */}
      <FallingPetals count={14} />

      {/* Header Section */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        variants={slowContainerAnim}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 20px',
          marginBottom: isDesktop ? '50px' : '36px',
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
            margin: '0 0 6px 0',
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
            margin: '0 0 10px 0',
            letterSpacing: '0.04em',
            fontWeight: 'normal',
            lineHeight: 1.15,
          }}
        >
          Moments in Time
        </motion.h2>
        <motion.div variants={slowLineAnim} style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <LotusDivider color={COLORS.gold} width={135} />
        </motion.div>
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.body,
            fontSize: 'clamp(14px, 3.5vw, 17px)',
            fontStyle: 'italic',
            color: COLORS.darkText,
            maxWidth: '380px',
            margin: '0 auto',
            opacity: 0.82,
            lineHeight: 1.5,
          }}
        >
          A few cherished moments holding a lifetime of sacred devotion and joy.
        </motion.p>
      </motion.div>

      {/* Cascading Polaroid Scrapbook Photos Container (Aura of Elegance Style) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isDesktop ? '1060px' : '440px',
          padding: '0 20px',
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          justifyContent: isDesktop ? 'space-around' : 'center',
          alignItems: 'center',
          gap: isDesktop ? '32px' : '0px',
          zIndex: 2,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Photo 1 (Tilted Left with Top-Left & Bottom-Right Washi Tape) */}
        {cardList[0] && (
          <motion.div
            style={{
              opacity: p1Op,
              x: isDesktop ? 0 : p1X,
              rotate: -4,
              willChange: 'transform, opacity',
              position: 'relative',
              background: '#FAF6EF',
              padding: '10px 10px 16px 10px',
              border: `1.5px solid ${COLORS.borderGold}`,
              boxShadow: '0 24px 60px rgba(115, 25, 36, 0.12), 0 12px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
              width: isDesktop ? '30%' : '82%',
              maxWidth: 320,
              borderRadius: 18,
              marginRight: isDesktop ? '0px' : '16%',
              zIndex: 1,
            }}
          >
            <WashiTape top={-12} left={28} rotate={-6} />
            <WashiTape bottom={-12} right={32} rotate={-3} width={80} />
            
            <PhotoFrame imgSrc={cardList[0].imgSrc} groomName={groomName} brideName={brideName} />
            <PhotoCaption quote={cardList[0].quote} />
          </motion.div>
        )}

        {/* Photo 2 (Tilted Right, Overlapping Photo 1, with Sacred Lotus Medallion Seal) */}
        {cardList[1] && (
          <motion.div
            style={{
              opacity: p2Op,
              x: isDesktop ? 0 : p2X,
              rotate: 5,
              willChange: 'transform, opacity',
              position: 'relative',
              background: '#FAF6EF',
              padding: '10px 10px 16px 10px',
              border: `1.5px solid ${COLORS.borderGold}`,
              boxShadow: '0 32px 75px rgba(115, 25, 36, 0.16), 0 16px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.7)',
              width: isDesktop ? '32%' : '86%',
              maxWidth: 335,
              borderRadius: 18,
              marginLeft: isDesktop ? '0px' : '16%',
              marginTop: isDesktop ? '0px' : '-20%',
              zIndex: 2,
            }}
          >
            <LotusMedallionSeal />
            
            <PhotoFrame imgSrc={cardList[1].imgSrc} groomName={groomName} brideName={brideName} />
            <PhotoCaption quote={cardList[1].quote} />
          </motion.div>
        )}

        {/* Photo 3 (Tilted Left, Overlapping Photo 2, with Bottom-Left Washi Tape) */}
        {cardList[2] && (
          <motion.div
            style={{
              opacity: p3Op,
              x: isDesktop ? 0 : p3X,
              rotate: -3.5,
              willChange: 'transform, opacity',
              position: 'relative',
              background: '#FAF6EF',
              padding: '10px 10px 16px 10px',
              border: `1.5px solid ${COLORS.borderGold}`,
              boxShadow: '0 24px 55px rgba(115, 25, 36, 0.12), 0 12px 22px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
              width: isDesktop ? '30%' : '84%',
              maxWidth: 320,
              borderRadius: 18,
              marginRight: isDesktop ? '0px' : '18%',
              marginTop: isDesktop ? '0px' : '-20%',
              zIndex: 3,
            }}
          >
            <WashiTape bottom={-12} left={36} rotate={4} width={76} />
            
            <PhotoFrame imgSrc={cardList[2].imgSrc} groomName={groomName} brideName={brideName} />
            <PhotoCaption quote={cardList[2].quote} />
          </motion.div>
        )}
      </div>
    </section>
  )
}

function PhotoFrame({ imgSrc, groomName, brideName }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '1/1',
        background: '#EDE4D4',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 12,
        boxShadow: 'inset 0 0 12px rgba(0,0,0,0.06)',
      }}
    >
      <img
        src={imgSrc}
        alt={`${groomName} & ${brideName}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        loading="lazy"
      />
      {/* Subtle South Indian Golden Amber Glow Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(197, 160, 89, 0.12)',
          mixBlendMode: 'multiply',
          borderRadius: 12,
          pointerEvents: 'none',
        }}
      />
      {/* Film Matte Texture Grain */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='1' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08' /%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          mixBlendMode: 'overlay',
          borderRadius: 12,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function PhotoCaption({ quote }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 10, padding: '0 4px' }}>
      <p
        style={{
          fontFamily: FONTS.body,
          fontSize: '15px',
          fontStyle: 'italic',
          color: COLORS.darkText,
          margin: '0 0 4px 0',
          lineHeight: 1.35,
          fontWeight: 500,
        }}
      >
        "{quote}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
        <span style={{ width: 18, height: 0.8, background: COLORS.gold, opacity: 0.6 }} />
        <span style={{ fontSize: 9, color: COLORS.primary }}>✦</span>
        <span style={{ width: 18, height: 0.8, background: COLORS.gold, opacity: 0.6 }} />
      </div>
    </div>
  )
}
