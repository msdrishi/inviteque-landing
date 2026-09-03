import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'

export default function RoyalHeirloomStory({
  ourPhotoBgMobile,
  storyPhotos,
  defaultPhoto1,
  defaultPhoto2,
  defaultPhoto3,
  brideName,
  groomName,
  weddingDate,
  weddingMonth,
  weddingYear,
}) {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-between px-4 py-8 bg-[#D4BAAC] border-t border-[#C3A697] overflow-hidden">
      {/* Background illustration without any overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${ourPhotoBgMobile})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <SectionHeader 
          subtitle="CHAPTERS OF LOVE"
          title="OUR STORY"
          description="Cherished moments from our pre-wedding journey."
          light={false}
        />
      </div>

      {/* 3 Cascading Polaroid Cards Overlapping & Filling the Section Naturally */}
      <div className="relative z-10 w-full max-w-[430px] my-auto py-2 px-3">
        
        {/* Ambient Romantic Handwritten Lettering & Stamp Backdrop */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex flex-col justify-between py-2 px-1">
          <div className="font-['Parisienne',_'Allura',_cursive] text-[24px] sm:text-[27px] text-[#5A321E]/18 leading-[1.35] tracking-wide -rotate-6 pl-2">
            i love you • i love you • i love you • i love you • i love you • i love you • i love you
          </div>
          <div className="font-['Parisienne',_'Allura',_cursive] text-[24px] sm:text-[27px] text-[#5A321E]/14 leading-[1.35] tracking-wide rotate-3 pr-2 text-right">
            forever &amp; always • my whole heart • eternal devotion • soulmates
          </div>
          <div className="font-['Parisienne',_'Allura',_cursive] text-[22px] sm:text-[25px] text-[#5A321E]/18 leading-[1.35] tracking-wide -rotate-3 pl-4">
            i love you • i love you • i love you • i love you • i love you
          </div>
        </div>

        {/* Vertical Cascading Container with exact overlap arrangement */}
        <div className="relative w-full flex flex-col items-center gap-0">
          
          {/* ── CARD 1: TOP (Shifted Left, Slanted Left -5deg) ── */}
          <div className="w-full flex justify-start pl-1 sm:pl-4 z-10">
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: -10, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, rotate: -5, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
              className="w-[195px] sm:w-[215px] bg-[#FAF6EE] p-2.5 pb-4 rounded-[4px] shadow-[0_14px_34px_rgba(0,0,0,0.22)] border border-[#E2D5C3] cursor-pointer select-none transition-shadow relative"
            >
              {/* Top Washi tape */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FAF1DF]/90 border-l border-r border-[#D9C4A8]/60 shadow-[0_1px_3px_rgba(0,0,0,0.1)] -rotate-3 pointer-events-none z-20"
                style={{ backdropFilter: 'blur(2px)' }}
              />

              <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px] bg-[#E8DDD0]">
                <img
                  src={storyPhotos[0] || defaultPhoto1}
                  alt="Pre-wedding Moment 1"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              <div className="mt-2 text-center">
                <span className="font-['Cormorant_Garamond'] italic text-[14px] text-[#5A321E] font-semibold leading-none block">
                  Where It Began
                </span>
                <span className="font-['Cinzel'] text-[8px] tracking-widest text-[#8C6044] block mt-0.5">
                  MOMENT 01
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── CARD 2: CENTER (Below & Overlapping Card 1, Shifted Right, Slanted Right +6deg) ── */}
          <div className="w-full flex justify-end pr-1 sm:pr-4 -mt-10 sm:-mt-12 z-20">
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 12, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, rotate: 6, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
              className="w-[200px] sm:w-[220px] bg-[#FAF6EE] p-2.5 pb-4 rounded-[4px] shadow-[0_18px_40px_rgba(0,0,0,0.24)] border border-[#E2D5C3] cursor-pointer select-none transition-shadow relative"
            >
              {/* Top Washi tape */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FAF1DF]/90 border-l border-r border-[#D9C4A8]/60 shadow-[0_1px_3px_rgba(0,0,0,0.1)] rotate-4 pointer-events-none z-20"
                style={{ backdropFilter: 'blur(2px)' }}
              />

              <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px] bg-[#E8DDD0]">
                <img
                  src={storyPhotos[1] || defaultPhoto2}
                  alt="Pre-wedding Moment 2"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              <div className="mt-2 text-center">
                <span className="font-['Cormorant_Garamond'] italic text-[14px] text-[#5A321E] font-semibold leading-none block">
                  A Timeless Promise
                </span>
                <span className="font-['Cinzel'] text-[8px] tracking-widest text-[#8C6044] block mt-0.5">
                  MOMENT 02
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── CARD 3: BOTTOM (Below & Overlapping Card 2, Shifted Left, Slanted Left -4deg) ── */}
          <div className="w-full flex justify-start pl-3 sm:pl-7 -mt-10 sm:-mt-12 z-30">
            <motion.div
              initial={{ opacity: 0, y: 35, rotate: -10, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, rotate: -4, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
              className="w-[195px] sm:w-[215px] bg-[#FAF6EE] p-2.5 pb-4 rounded-[4px] shadow-[0_16px_38px_rgba(0,0,0,0.22)] border border-[#E2D5C3] cursor-pointer select-none transition-shadow relative"
            >
              {/* Top Washi tape */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FAF1DF]/90 border-l border-r border-[#D9C4A8]/60 shadow-[0_1px_3px_rgba(0,0,0,0.1)] -rotate-4 pointer-events-none z-20"
                style={{ backdropFilter: 'blur(2px)' }}
              />

              <div className="w-full aspect-[4/4.3] overflow-hidden rounded-[2px] bg-[#E8DDD0]">
                <img
                  src={storyPhotos[2] || defaultPhoto3}
                  alt="Pre-wedding Moment 3"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              <div className="mt-2 text-center">
                <span className="font-['Cormorant_Garamond'] italic text-[14px] text-[#5A321E] font-semibold leading-none block">
                  Forever &amp; Always
                </span>
                <span className="font-['Cinzel'] text-[8px] tracking-widest text-[#8C6044] block mt-0.5">
                  MOMENT 03
                </span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom Accent Signature */}
        <div className="w-full flex items-center justify-between mt-3 px-2 text-[#5A321E] select-none">
          <span className="font-['Parisienne',_'Allura',_cursive] text-[20px]">
            Forever in Love
          </span>
          <span className="font-['Cinzel'] text-[9px] tracking-[0.24em] uppercase font-bold text-[#8C5D38]">
            {weddingDate}.{weddingMonth.slice(0, 3)}.{weddingYear}
          </span>
        </div>

      </div>

      <div className="h-2" />
    </section>
  )
}
