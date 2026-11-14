import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, FONTS, slowLineAnim, slowContainerAnim, CovenantCrossDivider } from './theme'

export default function EternalCovenantPhotoCards({ data, photos: customPhotos }) {
  const bride = data?.brideName || 'SHREYA'
  const groom = data?.groomName || 'SUMIT'

  const defaultCards = [
    {
      role: 'K',
      title: 'THE GROOM',
      name: groom,
      subtitle: 'King of Hearts',
      suit: '♥',
      url: '/assets/sample-couple.jpg',
      corner: 'K',
      diag: 'tl-br', // Top-Left to Bottom-Right diagonal indices
    },
    {
      role: 'Q',
      title: 'THE BRIDE',
      name: bride,
      subtitle: 'Queen of Hearts',
      suit: '♥',
      url: '/assets/sample-couple-2.jpg',
      corner: 'Q',
      diag: 'tr-bl', // Top-Right to Bottom-Left diagonal indices
    },
  ]

  return (
    <section
      className="w-full min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden py-16 px-4"
      style={{
        backgroundColor: COLORS.bgWhite,
        color: COLORS.darkText,
      }}
    >
      {/* Background Architectural & Foliage Scribble Sketch Art in Theme Green (#2D5A27) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <svg
          viewBox="0 0 400 700"
          className="w-full h-full object-cover"
          fill="none"
          stroke="#2D5A27"
          strokeWidth="1.2"
        >
          <path d="M200 40 C140 100 80 180 80 320 L80 650 M200 40 C260 100 320 180 320 320 L320 650" strokeDasharray="6,4" />
          <path d="M200 80 C160 130 110 200 110 320 L110 650 M200 80 C240 130 290 200 290 320 L290 650" strokeWidth="0.8" />
          <path d="M200 20 L200 650" strokeDasharray="3,6" opacity="0.6" />
          <circle cx="200" cy="220" r="55" strokeWidth="1.5" />
          <circle cx="200" cy="220" r="35" strokeDasharray="4,3" />
          <circle cx="200" cy="220" r="18" />
          <path d="M40 160 C80 140 70 240 30 280 C60 300 40 380 20 420" strokeLinecap="round" strokeDasharray="5,4" />
          <path d="M360 160 C320 140 330 240 370 280 C340 300 360 380 380 420" strokeLinecap="round" strokeDasharray="5,4" />
          <path d="M200 10 L200 35 M190 20 L210 20" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <motion.div
        variants={slowContainerAnim}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        className="relative z-10 w-full max-w-sm px-4 text-center flex flex-col items-center"
      >
        <motion.p
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.label,
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.secondary,
            fontWeight: 700,
            marginBottom: '6px',
          }}
        >
          Destined By Grace
        </motion.p>

        <motion.h2
          variants={slowLineAnim}
          style={{
            fontFamily: FONTS.heading,
            fontSize: '26px',
            color: COLORS.primary,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          King &amp; Queen Of Hearts
        </motion.h2>

        <motion.div variants={slowLineAnim} className="mb-6">
          <CovenantCrossDivider color={COLORS.gold} width={120} />
        </motion.div>

        {/* 
          VERTICAL PLAYING CARDS ARRANGEMENT:
          Cards stacked vertically with realistic casino-grade playing card details and diagonal corner indices
        */}
        <div className="w-full flex flex-col items-center gap-6 my-2">
          {defaultCards.map((card, idx) => {
            const isKing = card.role === 'K'
            return (
              <motion.div
                key={idx}
                variants={slowLineAnim}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-[280px] relative p-3 rounded-xl flex flex-col justify-between overflow-hidden"
                style={{
                  aspectRatio: '2.5 / 3.4',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #B88E3E',
                  boxShadow: '0 14px 35px rgba(45, 90, 39, 0.14), 0 3px 12px rgba(184, 142, 62, 0.25)',
                  transform: isKing ? 'rotate(-1.2deg)' : 'rotate(1.2deg)',
                }}
              >
                {/* DIAGONAL TOP-LEFT CORNER (K or Q) */}
                <div className="absolute top-2.5 left-3 flex flex-col items-center leading-none select-none z-10">
                  <span
                    style={{
                      fontFamily: FONTS.heading,
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#B88E3E',
                      lineHeight: 1,
                    }}
                  >
                    {card.corner}
                  </span>
                  <span style={{ fontSize: '14px', color: '#B88E3E', marginTop: '1px' }}>
                    {card.suit}
                  </span>
                </div>

                {/* DIAGONAL BOTTOM-RIGHT CORNER (Rotated 180°) */}
                <div className="absolute bottom-2.5 right-3 flex flex-col items-center leading-none select-none rotate-180 z-10">
                  <span
                    style={{
                      fontFamily: FONTS.heading,
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#B88E3E',
                      lineHeight: 1,
                    }}
                  >
                    {card.corner}
                  </span>
                  <span style={{ fontSize: '14px', color: '#B88E3E', marginTop: '1px' }}>
                    {card.suit}
                  </span>
                </div>

                {/* Inner Fine Gold Double Border */}
                <div
                  className="w-full h-full rounded-lg p-2.5 flex flex-col items-center justify-between"
                  style={{
                    border: '1px dashed rgba(184, 142, 62, 0.45)',
                  }}
                >
                  <div className="h-5" /> {/* Corner clearance spacer */}

                  {/* Card Center Portrait */}
                  <div className="w-[84%] aspect-[4/4.5] rounded-md overflow-hidden relative shadow-inner my-auto border border-[#B88E3E]/40 bg-[#FBF9F5]">
                    <img
                      src={card.url}
                      alt={card.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Name & Title */}
                  <div className="text-center my-1">
                    <p
                      style={{
                        fontFamily: FONTS.heading,
                        fontSize: '15px',
                        fontWeight: 700,
                        color: COLORS.primary,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        lineHeight: 1.2,
                      }}
                    >
                      {card.name}
                    </p>
                    <p
                      style={{
                        fontFamily: FONTS.label,
                        fontSize: '9.5px',
                        color: COLORS.secondary,
                        letterSpacing: '0.14em',
                        fontWeight: 600,
                        marginTop: '2px',
                      }}
                    >
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="h-5" /> {/* Bottom corner clearance spacer */}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
