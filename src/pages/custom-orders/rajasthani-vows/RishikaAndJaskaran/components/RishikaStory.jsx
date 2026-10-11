import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '../../../../../templates/rajasthani-vows/RajasthaniVowsShared.jsx'

// ── Hanging Bulb with Socket & Sequential Marriage Chaser Animation ──
function HangingChaserBulb({ x, y, wireY, index }) {
  return (
    <g className="select-none pointer-events-none">
      <line
        x1={x}
        y1={wireY}
        x2={x}
        y2={y}
        stroke="#3E301F"
        strokeWidth="1.2"
        opacity="0.85"
      />
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

function CurvyFestoonFairyLights() {
  const bulbs = [
    { id: 0, x: 40, wireY: 46, y: 62 },
    { id: 1, x: 115, wireY: 66, y: 82 },
    { id: 2, x: 190, wireY: 84, y: 100 },
    { id: 3, x: 265, wireY: 98, y: 114 },
    { id: 4, x: 345, wireY: 110, y: 126 },
    { id: 5, x: 40, wireY: 801, y: 817 },
    { id: 6, x: 115, wireY: 822, y: 838 },
    { id: 7, x: 190, wireY: 843, y: 859 },
    { id: 8, x: 265, wireY: 860, y: 876 },
    { id: 9, x: 345, wireY: 876, y: 892 },
  ]

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[2] overflow-hidden">
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
        <path
          d="M -20 25 Q 180 95, 420 120"
          stroke="#3E301F"
          strokeWidth="1.3"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M -20 28 Q 180 98, 420 123"
          stroke="#C59A4E"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M -20 780 Q 180 850, 420 890"
          stroke="#3E301F"
          strokeWidth="1.3"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M -20 783 Q 180 853, 420 893"
          stroke="#C59A4E"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          fill="none"
          opacity="0.4"
        />
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

// ── Clean Luxury Photo Card (No Moment 1, 2, 3 text) ──
function CleanPhotoCard({ photo, rotation = 0, delay = 0.1, className = '' }) {
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: rotation * 1.2, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
      className={`w-[215px] sm:w-[235px] bg-[#FFFDFA] p-2.5 pb-3 rounded-2xl shadow-[0_16px_36px_rgba(122,18,40,0.13),0_3px_12px_rgba(0,0,0,0.06)] border border-[#7A1228]/40 ring-1 ring-[#7A1228]/15 cursor-pointer select-none relative transition-shadow ${className}`}
    >
      <div className="w-full aspect-[4/4.9] overflow-hidden rounded-xl bg-[#EAE0D2] shadow-sm relative">
        <img
          src={photo.image}
          alt={photo.title || 'Wedding Photo'}
          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/10" />
      </div>

      {photo.title && (
        <div className="mt-2.5 text-center px-1">
          <span className="font-['Cinzel'] text-[13px] sm:text-[14px] tracking-[0.09em] uppercase font-bold text-[#7A1228] block leading-tight">
            {photo.title}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default function RishikaStory({ data = {}, isDesktop = false }) {
  const bgImage = "/assets/templates/rajestani-vows/background-general.webp"

  const photosList = useMemo(() => {
    return Array.isArray(data.photos) ? data.photos : []
  }, [data.photos])

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

      {/* Radial gold watermark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(#C59A4E 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Section Header */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <SectionHeader
          subtitle={data.subtitle || "CHAPTERS OF LOVE"}
          title={data.title || "OUR MOMENTS"}
          description={data.description || "Cherished moments from our pre-wedding journey."}
        />
      </div>

      {/* ── PHOTO CARDS AREA WITH CURVY FESTOON LIGHTS ── */}
      <div className="relative w-full max-w-[440px] min-h-[620px] my-auto pt-4 pb-6 px-2 flex flex-col justify-center">
        {/* Curvy Festoon Lights */}
        <CurvyFestoonFairyLights />

        {/* Cascading Clean Photo Cards in 1, 2, 3 sequence */}
        <div className="relative w-full flex flex-col items-center gap-0 mt-8 mb-8 z-10">
          {/* Card 1: Top-Left Card */}
          {card1 && (
            <div className="w-full flex justify-start pl-2 sm:pl-4 z-10">
              <CleanPhotoCard photo={card1} rotation={-2} delay={0.1} />
            </div>
          )}

          {/* Card 2: Center-Right Card */}
          {card2 && (
            <div className="w-full flex justify-end pr-2 sm:pr-4 -mt-10 sm:-mt-12 z-20">
              <CleanPhotoCard photo={card2} rotation={2} delay={0.25} />
            </div>
          )}

          {/* Card 3: Bottom-Left Card */}
          {card3 && (
            <div className="w-full flex justify-start pl-3 sm:pl-6 -mt-10 sm:-mt-12 z-30">
              <CleanPhotoCard photo={card3} rotation={-1} delay={0.4} />
            </div>
          )}
        </div>

        {/* Bottom Accent Signature */}
        {data.footerSignature && (
          <motion.div
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex items-center justify-center mt-6 px-3 select-none relative z-10"
          >
            <span className="font-['Cinzel'] text-[11px] sm:text-[12px] font-bold tracking-[0.22em] uppercase text-[#7A1228]">
              {data.footerSignature}
            </span>
          </motion.div>
        )}
      </div>

      <div className="h-4" />
    </section>
  )
}
