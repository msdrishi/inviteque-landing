import { motion } from 'framer-motion'
import letterImg from '../assets/invitation/letter_png.png'

export default function Invitation({ data }) {
  if (!data) return null

  // Fallback text if data.message is empty
  const defaultMessage = "We are excited to invite you to celebrate our wedding with us. This special day would not be complete without your presence."

  const paragraphs = String(data.message || defaultMessage)
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section
      id={data.id}
      className="relative w-full overflow-hidden pt-0 pb-1 flex justify-center items-center"
      style={{ background: 'transparent' }}
    >

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[90%] max-w-[450px]"
      >
        {/* The 3D Letter Image */}
        <img
          src={letterImg}
          alt="Invitation Letter"
          className="w-full block h-auto -mt-10"
          style={{
            filter: 'drop-shadow(0px 25px 35px rgba(139, 30, 45, 0.2))'
          }}
        />

        {/* Text Overlay - Positioned perfectly within the card's visual bounds */}
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            top: '35%',       // Safely below the top floral decoration
            left: '22%',
            right: '22%',
            bottom: '60%',    // Safely above the wax seal
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.0, delay: 0.4 }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#8B1E2D',
                fontSize: 'clamp(10px, 3.2vw, 16px)',
                fontWeight: 600,
                letterSpacing: '0.12em',
                lineHeight: 1.15,
              }}
            >
              DEAR<br />FAMILY &amp; FRIENDS
            </h2>

            {/* Divider Heart */}
            <div className="flex items-center justify-center gap-2 my-[6px] mx-auto w-full max-w-[100px]">
              <div className="h-[1px] flex-1" style={{ background: 'rgba(139, 30, 45, 0.25)' }} />
              <span style={{ color: '#8B1E2D', fontSize: '8px', opacity: 0.9 }}>♥</span>
              <div className="h-[1px] flex-1" style={{ background: 'rgba(139, 30, 45, 0.25)' }} />
            </div>

            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: '#5C0A14',
                fontSize: 'clamp(8px, 2vw, 11px)',
                lineHeight: 1.5,
                marginTop: '0px',
                fontWeight: 500,
                opacity: 0.85
              }}
            >
              {paragraphs.map((p, idx) => (
                <p key={idx} style={{ marginBottom: idx === paragraphs.length - 1 ? 0 : '6px' }}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  )
}
