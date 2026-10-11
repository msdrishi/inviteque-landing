import { motion } from 'framer-motion'
export default function RajasthaniVowsEvents({ data, isDesktop, bgImageDesktop, bgImageMobile }) {
  const items = Array.isArray(data) ? data : (data?.items || []);
  if (!items || items.length === 0) return null;
  return (
    <section className="relative w-full py-20 bg-transparent text-center px-6">
      <img
        src={isDesktop ? bgImageDesktop : bgImageMobile}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
      <h2 className="font-['Religath'] text-[#FFF2D8] text-4xl uppercase tracking-widest mb-12 drop-shadow-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Wedding Schedule</h2>
      <div className="max-w-3xl mx-auto flex flex-col gap-8 w-full">
        {items.map((evt, i) => (
          <motion.div 
            key={i} 
            className="p-6 bg-[#2A0800]/80 backdrop-blur-sm border border-[#E5B869]/30 rounded-lg shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-['Religath'] text-[#FFF2D8] text-2xl uppercase drop-shadow-md">{evt.title || evt.name}</h3>
            <p className="font-['Cormorant_Garamond'] text-[#E5B869] text-xl mt-2 drop-shadow-md">{evt.time}</p>
            {evt.description && <p className="font-['Cormorant_Garamond'] text-[#E8D5B5] mt-2 drop-shadow-md">{evt.description}</p>}
          </motion.div>
        ))}
      </div>
          </div>
    </section>
  )
}