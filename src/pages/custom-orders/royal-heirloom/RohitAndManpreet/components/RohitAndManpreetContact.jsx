import { motion } from 'framer-motion'
import { SectionHeader } from '../../../../../templates/royal-heirloom/RoyalHeirloomShared.jsx'

const IndFlag = () => (
  <svg viewBox="0 0 512 512" className="w-[18px] h-[18px] sm:w-5 sm:h-5 rounded-full shadow-sm shrink-0">
    <rect width="512" height="170.6" fill="#f98000" />
    <rect y="170.6" width="512" height="170.6" fill="#ffffff" />
    <rect y="341.3" width="512" height="170.6" fill="#138808" />
    <circle cx="256" cy="256" r="60" fill="none" stroke="#000080" strokeWidth="8"/>
    <circle cx="256" cy="256" r="10" fill="#000080" />
  </svg>
)

const UaeFlag = () => (
  <svg viewBox="0 0 512 512" className="w-[18px] h-[18px] sm:w-5 sm:h-5 rounded-full shadow-sm shrink-0">
    <rect y="0" width="512" height="170.6" fill="#00732f" />
    <rect y="170.6" width="512" height="170.6" fill="#ffffff" />
    <rect y="341.3" width="512" height="170.6" fill="#000000" />
    <rect width="170.6" height="512" fill="#ff0000" />
  </svg>
)

const Divider = () => (
  <div className="flex items-center justify-center w-full my-6 opacity-80">
    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#CBB89D]" />
    <svg className="mx-3 w-2.5 h-2.5 text-[#CBB89D]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
    <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#CBB89D]" />
  </div>
)

export default function RohitAndManpreetContact() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center px-5 py-16 bg-[#F6EBD8] border-t border-[#E8D9C5] overflow-hidden">
      
      {/* Elegant Curvy Lines Texture */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 Q25 5, 50 20 T100 20' fill='none' stroke='%238C5329' stroke-width='1.5'/%3E%3Cpath d='M0 40 Q25 25, 50 40 T100 40' fill='none' stroke='%238C5329' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 40px'
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2 mb-8 max-w-[500px]">
        <SectionHeader 
          subtitle="LET'S CONNECT"
          title="CONTACT US"
          description={
            <>
              Questions, excitement, or just want to say hello? Our family would be delighted to hear from you! Let the celebrations begin!
              <span className="inline-block ml-1 opacity-85 saturate-[0.8] sepia-[0.3]">✨🥂</span>
            </>
          }
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[380px] bg-[#FAF5EB]/95 backdrop-blur-md border border-[#CBB89D] rounded-[22px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(90,50,20,0.12)] flex flex-col items-stretch my-auto"
      >
        {/* RAMESH METHWANI */}
        <div className="flex flex-col items-center text-center w-full">
          <h3 className="font-['Cinzel'] text-[14px] sm:text-[15px] font-bold tracking-[0.2em] uppercase text-[#6B401D] mb-4">
            Ramesh Methwani
          </h3>
          <div className="flex flex-col gap-3 font-['Cormorant_Garamond',serif] text-[16px] sm:text-[17px] text-[#4F301D] font-semibold tracking-wider w-full max-w-[220px]">
            <div className="flex items-center justify-center gap-4 w-full">
              <IndFlag />
              <span className="text-[#CBB89D] text-[14px] opacity-70 font-light">|</span>
              <a href="tel:+919119213232" className="opacity-90 hover:opacity-100 flex-1 text-left whitespace-nowrap">+91 91192 13232</a>
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
              <UaeFlag />
              <span className="text-[#CBB89D] text-[14px] opacity-70 font-light">|</span>
              <a href="tel:+971506549638" className="opacity-90 hover:opacity-100 flex-1 text-left whitespace-nowrap">+971 50 654 9638</a>
            </div>
          </div>
        </div>

        <Divider />

        {/* ROHIT METHWANI */}
        <div className="flex flex-col items-center text-center w-full">
          <h3 className="font-['Cinzel'] text-[14px] sm:text-[15px] font-bold tracking-[0.2em] uppercase text-[#6B401D] mb-4">
            Rohit Methwani
          </h3>
          <div className="flex flex-col gap-3 font-['Cormorant_Garamond',serif] text-[16px] sm:text-[17px] text-[#4F301D] font-semibold tracking-wider w-full max-w-[220px]">
            <div className="flex items-center justify-center gap-4 w-full">
              <IndFlag />
              <span className="text-[#CBB89D] text-[14px] opacity-70 font-light">|</span>
              <a href="tel:+916367339471" className="opacity-90 hover:opacity-100 flex-1 text-left whitespace-nowrap">+91 63673 39471</a>
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
              <UaeFlag />
              <span className="text-[#CBB89D] text-[14px] opacity-70 font-light">|</span>
              <a href="tel:+971562447791" className="opacity-90 hover:opacity-100 flex-1 text-left whitespace-nowrap">+971 56 244 7791</a>
            </div>
          </div>
        </div>

        <Divider />

        {/* KARAN METHWANI */}
        <div className="flex flex-col items-center text-center w-full">
          <h3 className="font-['Cinzel'] text-[14px] sm:text-[15px] font-bold tracking-[0.2em] uppercase text-[#6B401D] mb-4">
            Karan Methwani
          </h3>
          <div className="flex flex-col gap-3 font-['Cormorant_Garamond',serif] text-[16px] sm:text-[17px] text-[#4F301D] font-semibold tracking-wider w-full max-w-[220px]">
            <div className="flex items-center justify-center gap-4 w-full">
              <UaeFlag />
              <span className="text-[#CBB89D] text-[14px] opacity-70 font-light">|</span>
              <a href="tel:+971526531201" className="opacity-90 hover:opacity-100 flex-1 text-left whitespace-nowrap">+971 52 653 1201</a>
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  )
}
