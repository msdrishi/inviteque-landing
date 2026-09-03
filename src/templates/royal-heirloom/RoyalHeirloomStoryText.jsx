import { motion } from 'framer-motion'
import { SectionHeader } from './RoyalHeirloomShared.jsx'
import { useMemo } from 'react'

export default function RoyalHeirloomStoryText({ brideName, groomName }) {
  // Generate random hearts for background texture
  const randomHearts = useMemo(() => {
    const hearts = [];
    let id = 0;
    // Create a 4x4 grid to ensure minimal but perfectly even spread across the entire background
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        hearts.push({
          id: id++,
          size: 14 + Math.random() * 20,
          top: (row * 25) + (Math.random() * 15),
          left: (col * 25) + (Math.random() * 15),
          rotate: Math.random() * 360,
          opacity: 0.08 + Math.random() * 0.05
        });
      }
    }
    return hearts;
  }, [])

  // Generate perfect zigzag points for the receipt tear edge
  const zigzagPoints = useMemo(() => {
    let pts = "0,0 100,0 "
    for (let i = 100; i >= 0; i -= 2) {
      pts += `${i},${i % 4 === 0 ? 0 : 5} `
    }
    return pts
  }, [])

  return (
    <section 
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-start px-6 py-12 bg-[#F6EBD8] border-t border-[#E6D6C0] overflow-hidden"
      style={{ backgroundColor: '#F6EBD8' }}
    >
      {/* Background Hearts Texture */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {randomHearts.map((h) => (
          <svg key={h.id} viewBox="0 0 24 24" fill="currentColor" 
               className="absolute text-[#4A2810]"
               style={{
                 width: `${h.size}px`,
                 height: `${h.size}px`,
                 top: `${h.top}%`,
                 left: `${h.left}%`,
                 transform: `rotate(${h.rotate}deg)`,
                 opacity: h.opacity
               }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2 mb-2">
        <SectionHeader 
          subtitle="HOW IT ALL BEGAN"
          title="OUR STORY"
          description="Two souls, one destiny, and a journey written in the stars."
          light={false}
        />
      </div>

      {/* Billing Machine / Receipt Printer Animation */}
      <div className="relative z-10 w-full flex flex-col items-center mt-3 flex-1 mb-8">
        
        {/* The Printer Machine Body (Matches reference image style: outer frame + inner deep hole) */}
        <div className="relative z-10 w-full max-w-[350px] bg-gradient-to-b from-[#8C5D38] to-[#6B401D] pt-3 pb-2 px-3 rounded-md shadow-[0_6px_12px_rgba(40,20,10,0.2)] border-t border-[#A87442]">
          {/* Inner dark hole where paper comes out */}
          <div className="relative w-full h-[14px] bg-[#150A03] rounded-sm shadow-[inset_0_5px_8px_rgba(0,0,0,0.95)]" />
          
          {/* Subtle embossed text on the machine lip */}
          <div className="absolute top-[3px] left-0 right-0 text-center pointer-events-none">
            <span className="font-['Cinzel'] text-[6.5px] tracking-[0.4em] uppercase text-[#3A1D0C] font-bold opacity-60 mix-blend-multiply">
              EST. 2026
            </span>
          </div>
        </div>

        {/* Stationary Cast Shadow (Simulates the shadow cast by the top lip of the hole onto the paper) */}
        <div className="absolute top-[12px] w-full max-w-[310px] h-[12px] bg-gradient-to-b from-[#0a0502]/90 to-transparent z-30 pointer-events-none" />

        {/* The Output Area */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          // Paper wrapper is narrower (310px) than the frame (350px).
          // Tucked precisely to align with the top edge of the hole: pb-2 (8px) + hole (14px) = 22px
          className="relative z-20 w-full max-w-[310px] -mt-[22px]"
          // clipPath cuts off exactly at the top edge, masking the paper "inside" the machine,
          // while allowing the drop shadow to spill out on the sides and bottom.
          style={{ minHeight: '400px', clipPath: 'polygon(-30% 0%, 130% 0%, 130% 150%, -30% 150%)' }}
        >
          <div className="w-full relative h-full">
          
            {/* The Paper Receipt Animation */}
            <motion.div
              variants={{
                hidden: { y: '-100%' },
                visible: {
                  y: ['-100%', '-83%', '-83%', '-66%', '-66%', '-49%', '-49%', '-32%', '-32%', '-15%', '-15%', '0%'],
                  transition: {
                    duration: 3.8, 
                    ease: "linear",
                    // Staccato stops simulating a dot-matrix receipt printer
                    times: [0, 0.08, 0.18, 0.26, 0.36, 0.44, 0.54, 0.62, 0.72, 0.8, 0.9, 1]
                  }
                }
              }}
              className="w-full flex flex-col drop-shadow-[0_12px_20px_rgba(40,20,10,0.22)]"
            >
            {/* Paper Body */}
            <div className="w-full bg-[#FAF5EB] border-x border-[#D8C7B0] flex flex-col items-center text-center px-6 pt-10 pb-4 relative">
              


              {/* Subtle receipt watermark / logo */}
              <div className="absolute top-6 opacity-5 flex items-center justify-center pointer-events-none">
                <span className="font-['Cinzel'] text-[60px] font-bold">❦</span>
              </div>

              {/* Receipt Header Text */}
              <h3 className="font-['Courier_Prime',_'Courier_New',_monospace] text-[15px] sm:text-[16px] font-bold tracking-[0.1em] uppercase text-[#4A2810] mb-5 border-b-2 border-dotted border-[#C2B29D] pb-3 w-full">
                ** THE BEGINNING **
              </h3>

              <p className="font-['Cormorant_Garamond'] text-[18px] sm:text-[20px] text-[#5A3825] leading-[1.6] italic mb-6 font-normal">
                “What started as an ordinary afternoon turned into a timeless bond. Through quiet shared laughter, heartfelt conversations over endless cups of chai, and unspoken understanding, we realized that home was never a place — it was each other.”
              </p>

              <div className="w-full border-t-2 border-dotted border-[#C2B29D] my-3" />

              {/* Receipt Footer / Data */}
              <p className="font-['Courier_Prime',_'Courier_New',_monospace] text-[12px] sm:text-[13px] tracking-[0.1em] uppercase text-[#7A5034] font-bold leading-loose mt-2 w-full text-left px-1">
                ITEM: FOREVER <span className="float-right">100%</span><br/>
                STATUS: SOULMATES <span className="float-right">CONFIRMED</span>
              </p>

              {/* Signature calligraphic accent */}
              <div className="mt-8 mb-2 text-[#8C5D38] font-['Modernline',_'Allura',_'Alex_Brush',_cursive] text-[30px] sm:text-[34px] leading-none text-right w-full pr-1">
                {groomName || "Rohan"} &amp; {brideName || "Ananya"}
              </div>
            </div>

            {/* Jagged Bottom Edge */}
            <svg className="w-full h-3 text-[#FAF5EB]" viewBox="0 0 100 5" preserveAspectRatio="none">
              <polygon fill="currentColor" points={zigzagPoints} />
            </svg>

          </motion.div>
          </div>
        </motion.div>

      </div>

    </section>
  )
}
