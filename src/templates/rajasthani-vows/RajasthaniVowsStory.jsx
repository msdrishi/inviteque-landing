import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from './RajasthaniVowsShared.jsx'

// ── Hanging Bulb with Socket & Sequential Marriage Chaser Animation ──
function HangingChaserBulb({ x, y, wireY, index }) {
  return (
    <g className="select-none pointer-events-none">
      {/* Vertical dropper wire connecting the curvy main wire to the bulb socket */}
      <line
        x1={x}
        y1={wireY}
        x2={x}
        y2={y}
        stroke="#3E301F"
        strokeWidth="1.2"
        opacity="0.85"
      />

      {/* ForeignObject container for CSS-animated glowing bulb */}
      <foreignObject
        x={x - 22}
        y={y}
        width={44}
        height={54}
        className="overflow-visible pointer-events-none"
      >
        <div
          className="w-full h-full flex flex-col items-center justify-start pointer-events-none"
          style={{
            animation: `weddingChaser 1.4s infinite ease-out`,
            animationDelay: `${index * 0.12}s`,
          }}
        >
          {/* Dark bronze socket */}
          <div
            style={{
              width: 7,
              height: 7,
              background: 'linear-gradient(180deg, #3E301F, #1F170E)',
              borderRadius: '2px 2px 1px 1px',
              border: '0.6px solid #5A4730',
              boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}
          />

          {/* Tear-drop golden glass bulb */}
          <div
            style={{
              width: 15,
              height: 20,
              marginTop: -1,
              borderRadius: '6px 6px 8px 8px',
              background: 'radial-gradient(circle at 50% 38%, #FFFDE7 20%, #FFE082 55%, #FFB300 95%)',
              border: '0.6px solid rgba(255, 236, 179, 0.85)',
              position: 'relative',
              boxShadow: '0 0 10px 4px rgba(255, 215, 60, 0.8), 0 0 20px 8px rgba(255, 170, 0, 0.4)',
            }}
          >
            {/* Glowing inner filament */}
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 1.5,
                height: 7,
                background: '#FFF9C4',
                boxShadow: '0 0 3px #FFF',
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      </foreignObject>
    </g>
  )
}

// ── Single Diagonal Curve Festoon Fairy Lights in Top Area & Bottom Area ──
function CurvyFestoonFairyLights() {
  // Bulbs along Top Single Diagonal Wire (IDs 0-4) & Bottom Single Diagonal Wire (IDs 5-9)
  const bulbs = [
    // Top Area: single diagonal curve from upper-left sloping down towards right (y ≈ 25 to 115)
    { id: 0, x: 40, wireY: 46, y: 62 },
    { id: 1, x: 115, wireY: 66, y: 82 },
    { id: 2, x: 190, wireY: 84, y: 100 },
    { id: 3, x: 265, wireY: 98, y: 114 },
    { id: 4, x: 345, wireY: 110, y: 126 },

    // Bottom Area: single diagonal curve from mid-left sloping down towards bottom-right (y ≈ 780 to 885)
    { id: 5, x: 40, wireY: 801, y: 817 },
    { id: 6, x: 115, wireY: 822, y: 838 },
    { id: 7, x: 190, wireY: 843, y: 859 },
    { id: 8, x: 265, wireY: 860, y: 876 },
    { id: 9, x: 345, wireY: 876, y: 892 },
  ]

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[2] overflow-hidden">
      {/* CSS Keyframe for the authentic Indian Wedding fast running chaser lights */}
      <style>{`
        @keyframes weddingChaser {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.92);
            filter: drop-shadow(0 0 3px rgba(255, 190, 60, 0.4));
          }
          18% {
            opacity: 1;
            transform: scale(1.18);
            filter: drop-shadow(0 0 14px rgba(255, 220, 80, 1)) drop-shadow(0 0 26px rgba(255, 160, 20, 0.75));
          }
          38% {
            opacity: 0.42;
            transform: scale(0.95);
            filter: drop-shadow(0 0 5px rgba(255, 190, 60, 0.45));
          }
        }
      `}</style>

      <svg
        viewBox="0 0 400 960"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Top Area: Single Diagonal Curve Wire ── */}
        <path
          d="M -20 25 Q 180 95, 420 120"
          stroke="#3E301F"
          strokeWidth="1.3"
          fill="none"
          opacity="0.8"
        />
        {/* Top Gold tracer hairline */}
        <path
          d="M -20 28 Q 180 98, 420 123"
          stroke="#C59A4E"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          fill="none"
          opacity="0.4"
        />

        {/* ── Bottom Area: Single Diagonal Curve Wire ── */}
        <path
          d="M -20 780 Q 180 850, 420 890"
          stroke="#3E301F"
          strokeWidth="1.3"
          fill="none"
          opacity="0.8"
        />
        {/* Bottom Gold tracer hairline */}
        <path
          d="M -20 783 Q 180 853, 420 893"
          stroke="#C59A4E"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          fill="none"
          opacity="0.4"
        />

        {/* Bulbs hanging directly from the single diagonal curve wires */}
        {bulbs.map((b) => (
          <HangingChaserBulb
            key={b.id}
            x={b.x}
            y={b.y}
            wireY={b.wireY}
            index={b.id}
          />
        ))}
      </svg>
    </div>
  )
}

// ── Clean & Simple Luxury Photo Card (Photo Clearly Visible) ──
function CleanPhotoCard({ photo, rotation = 0, delay = 0.1, className = '' }) {
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: rotation * 1.2, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
      className={`w-[215px] sm:w-[235px] bg-[#FFFDFA] p-2.5 pb-3 rounded-2xl shadow-[0_16px_36px_rgba(122,18,40,0.13),0_3px_12px_rgba(0,0,0,0.06)] border border-[#C59A4E]/60 ring-1 ring-[#C59A4E]/25 cursor-pointer select-none relative transition-shadow ${className}`}
    >
      {/* Clearly visible portrait image container with generous aspect ratio */}
      <div className="w-full aspect-[4/4.9] overflow-hidden rounded-xl bg-[#EAE0D2] shadow-sm relative">
        <img
          src={photo.image}
          alt={photo.title || 'Wedding Moment'}
          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        {/* Hairline inner gold highlight */}
        <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/10" />
      </div>

      {/* Clean & Legible Caption Plaque — Cinzel font only */}
      <div className="mt-2 text-center px-1">
        {photo.momentTag && (
          <span className="font-['Cinzel'] text-[9.5px] tracking-[0.24em] uppercase font-bold text-[#8A1D33] block mb-0.5">
            {photo.momentTag}
          </span>
        )}
        {photo.title && (
          <span className="font-['Cinzel'] text-[13px] sm:text-[14px] tracking-[0.09em] uppercase font-bold text-[#7A1228] block leading-tight">
            {photo.title}
          </span>
        )}
      </div>
    </motion.div>
  )
}

const defaultRajasthaniPhotos = [
  {
    image: "/assets/templates/rajestani-vows/photo-1.webp",
    title: "Where It Began",
    momentTag: "MOMENT 01",
  },
  {
    image: "/assets/templates/rajestani-vows/photo-2.webp",
    title: "A Timeless Promise",
    momentTag: "MOMENT 02",
  },
  {
    image: "/assets/templates/rajestani-vows/photo-3.webp",
    title: "Forever & Always",
    momentTag: "MOMENT 03",
  },
]

export default function RajasthaniVowsStory({
  data = {},
  userPhotos = [],
  dateStr = '',
  isDesktop = false,
}) {
  const bgImage = isDesktop
    ? (data.bgImageDesktop || "/assets/templates/rajestani-vows/background-general.webp")
    : (data.bgImageMobile || "/assets/templates/rajestani-vows/background-general.webp")

  // Compile photo items with reliable default fallbacks
  const photosList = useMemo(() => {
    const rawPhotos = (Array.isArray(userPhotos) ? userPhotos : []).filter(Boolean)
    if (rawPhotos.length > 0) {
      return rawPhotos.slice(0, 3).map((p, idx) => ({
        image: typeof p === 'string' ? p : (p?.image || ''),
        title: (data.photos?.[idx]?.title) || defaultRajasthaniPhotos[idx]?.title || `Moment 0${idx + 1}`,
        momentTag: (data.photos?.[idx]?.momentTag) || defaultRajasthaniPhotos[idx]?.momentTag || `MOMENT 0${idx + 1}`,
      }))
    }
    if (Array.isArray(data.photos) && data.photos.length > 0) {
      return data.photos
    }
    return defaultRajasthaniPhotos
  }, [userPhotos, data.photos])

  const card1 = photosList[0] || null
  const card2 = photosList[1] || null
  const card3 = photosList[2] || null

  return (
    <section
      id="story"
      aria-label="Photo Cards"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-4 py-12 bg-[#FAF6EE] overflow-hidden"
    >
      {/* Background illustration */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-40"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Subtle royal damask watermark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(#C59A4E 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Section Header (Consistent across all sections) */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <SectionHeader
          subtitle={data.subtitle || "CHAPTERS OF LOVE"}
          title={data.title || "OUR MOMENTS"}
          description={data.description || "Cherished moments from our pre-wedding journey."}
        />
      </div>

      {/* ── PHOTO CARDS AREA WITH CURVY FESTOON LIGHTS IN TOP & BOTTOM AREAS ── */}
      <div className="relative w-full max-w-[440px] min-h-[620px] my-auto pt-4 pb-6 px-2 flex flex-col justify-center">
        {/* 1. Curvy Festoon Lights — Top area and Bottom area behind cards (z-[2]) */}
        <CurvyFestoonFairyLights />

        {/* 2. Cascading Clean Photo Cards — (z-10, z-20 in front of bulbs) */}
        <div className="relative w-full flex flex-col items-center gap-0 mt-8 mb-8 z-10">
          
          {/* Card 1: Top-Left Card */}
          {card1 && (
            <div className="w-full flex justify-start pl-2 sm:pl-4 z-10">
              <CleanPhotoCard photo={card1} rotation={-2} delay={0.1} />
            </div>
          )}

          {/* Card 2: Center-Right Card (Overlapping Card 1) */}
          {card2 && (
            <div className="w-full flex justify-end pr-2 sm:pr-4 -mt-10 sm:-mt-12 z-20">
              <CleanPhotoCard photo={card2} rotation={2} delay={0.25} />
            </div>
          )}

          {/* Card 3: Bottom-Left Card (Overlapping Card 2) */}
          {card3 && (
            <div className="w-full flex justify-start pl-3 sm:pl-6 -mt-10 sm:-mt-12 z-30">
              <CleanPhotoCard photo={card3} rotation={-1} delay={0.4} />
            </div>
          )}

        </div>

        {/* Bottom Accent Signature — Cinzel Only */}
        {(data.footerSignature || dateStr) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="w-full flex items-center justify-between mt-6 px-3 select-none relative z-10"
          >
            {data.footerSignature && (
              <span className="font-['Cinzel'] text-[11px] sm:text-[12px] font-bold tracking-[0.22em] uppercase text-[#7A1228]">
                {data.footerSignature}
              </span>
            )}
            {dateStr && (
              <span className="font-['Cinzel'] text-[10px] sm:text-[11px] font-semibold tracking-[0.26em] uppercase text-[#8A1D33]">
                {dateStr}
              </span>
            )}
          </motion.div>
        )}
      </div>

      <div className="h-4" />
    </section>
  )
}
