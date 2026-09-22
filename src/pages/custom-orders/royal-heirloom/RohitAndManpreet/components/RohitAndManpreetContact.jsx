import { motion } from 'framer-motion'
import { SectionHeader } from '../../../../../templates/royal-heirloom/RoyalHeirloomShared.jsx'

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

      <div className="relative z-10 w-full flex flex-col items-center text-center pt-2 mb-8">
        <SectionHeader 
          subtitle="GET IN TOUCH"
          title="CONTACT US"
          description="Feel free to reach out to our family members for any queries."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[360px] bg-[#FAF5EB]/95 backdrop-blur-md border border-[#CBB89D] rounded-[22px] p-6 shadow-[0_20px_50px_rgba(90,50,20,0.12)] flex flex-row items-stretch justify-center my-auto"
      >
        {/* India Contacts */}
        <div className="flex flex-col items-center flex-1 px-1 sm:px-2">
          <h3 className="font-['Cinzel'] text-[13px] sm:text-[15px] font-bold tracking-[0.2em] uppercase text-[#6B401D] mb-3">
            India
          </h3>
          <div className="flex flex-col gap-3 font-['Cormorant_Garamond',serif] text-[12px] sm:text-[14px] text-[#4F301D] font-semibold tracking-wide">
            <div className="flex flex-col">
              <span className="text-[#8C5329] font-['Cinzel'] text-[10px] tracking-widest mb-0.5">Ramesh Methwani</span>
              <a href="tel:+919119213232" className="opacity-90 hover:opacity-100">+91 91192 13232</a>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-[#8C5329] font-['Cinzel'] text-[10px] tracking-widest mb-0.5">Rohit Methwani</span>
              <a href="tel:+916367339471" className="opacity-90 hover:opacity-100">+91 63673 39471</a>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] bg-[#CBB89D] mx-2" />

        {/* UAE Contacts */}
        <div className="flex flex-col items-center flex-1 px-1 sm:px-2">
          <h3 className="font-['Cinzel'] text-[13px] sm:text-[15px] font-bold tracking-[0.2em] uppercase text-[#6B401D] mb-3">
            UAE
          </h3>
          <div className="flex flex-col gap-3 font-['Cormorant_Garamond',serif] text-[12px] sm:text-[14px] text-[#4F301D] font-semibold tracking-wide">
            <div className="flex flex-col">
              <span className="text-[#8C5329] font-['Cinzel'] text-[10px] tracking-widest mb-0.5">Ramesh Methwani</span>
              <a href="tel:+971506549638" className="opacity-90 hover:opacity-100">+971 50 654 9638</a>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-[#8C5329] font-['Cinzel'] text-[10px] tracking-widest mb-0.5">Rohit Methwani</span>
              <a href="tel:+971562447791" className="opacity-90 hover:opacity-100">+971 56 244 7791</a>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-[#8C5329] font-['Cinzel'] text-[10px] tracking-widest mb-0.5">Karan Methwani</span>
              <a href="tel:+971526531201" className="opacity-90 hover:opacity-100">+971 52 653 1201</a>
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  )
}
