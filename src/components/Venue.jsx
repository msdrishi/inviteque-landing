import { motion } from 'framer-motion'
import { fadeUp } from '../motionVariants.js'

const PinIconSolid = ({ size = 20, color = "#8B1E2D" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

export default function Venue({ data }) {
  if (!data) return null

  const addressTextRaw = String(data.address || data.location || 'MG Road, Bangalore, Karnataka 560001')
  const addressTextPretty = addressTextRaw

  const viewport = { once: false, amount: 0.15 }

  return (
    <section 
      id={data.id} 
      className="relative w-full overflow-hidden px-4 py-6 flex flex-col items-center text-center"
      style={{
        minHeight: '100svh',
        backgroundColor: '#FFF0EC',
        backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Extra room so content doesn't sit in the clipped curve
        paddingTop: 'clamp(24px, 5svh, 44px)',
        paddingBottom: 'clamp(14px, 4.5svh, 44px)',
        clipPath: 'url(#venueTopCurveClip)',
      }}
    >
      <svg aria-hidden="true" width="0" height="0" focusable="false">
        <defs>
          {/* Curvy top edge for the whole section (including background image). */}
          <clipPath id="venueTopCurveClip" clipPathUnits="objectBoundingBox">
            {/* Inverted curve: corners dip down, centre stays higher. */}
            <path d="M0 0.045 C 0.25 0 0.75 0 1 0.045 L1 1 L0 1 Z" />
          </clipPath>
        </defs>
      </svg>

      <motion.h2 
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-semibold"
        style={{
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          fontSize: '22px',
          letterSpacing: '2px',
          color: '#7B0F1A',
          marginBottom: '10px',
          textShadow: '0 10px 22px rgba(123, 15, 26, 0.18)',
        }}
      >
        OUR VENUE
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        transition={{ duration: 0.65, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center gap-3"
        style={{ marginBottom: '16px' }}
      >
        <span style={{ width: '40px', height: '1px', backgroundColor: 'rgba(123,15,26,0.35)' }} />
        <PinIconSolid size={14} color="#7B0F1A" />
        <span style={{ width: '40px', height: '1px', backgroundColor: 'rgba(123,15,26,0.35)' }} />
      </motion.p>

      <motion.h3 
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="font-semibold"
        style={{
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          fontSize: '17px',
          color: '#7B0F1A',
          margin: '8px 0',
          letterSpacing: '0.22em',
          textShadow: '0 10px 22px rgba(123, 15, 26, 0.14)',
        }}
      >
        {data.venueName?.toUpperCase() || 'ROYAL PALACE HALL'}
      </motion.h3>

      <motion.address
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: 0,
          marginTop: '10px',
          color: '#5C0A14',
          fontStyle: 'normal',
          textAlign: 'center',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 46, height: 1, background: 'rgba(196,151,74,0.55)' }} />
          <PinIconSolid size={16} color="#7B0F1A" />
          <span style={{ width: 46, height: 1, background: 'rgba(196,151,74,0.55)' }} />
        </span>

        <span
          style={{
            marginTop: 8,
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            fontSize: '10px',
            letterSpacing: '0.34em',
            color: 'rgba(123,15,26,0.78)',
            textTransform: 'uppercase',
            textShadow: '0 10px 18px rgba(123, 15, 26, 0.12)',
          }}
        >
          Address
        </span>

        <span
          style={{
            marginTop: 6,
            fontFamily: "'Montserrat', 'Manrope', sans-serif",
            fontSize: '13px',
            lineHeight: 1.45,
            color: 'rgba(92,10,20,0.92)',
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
            textShadow: '0 12px 26px rgba(255, 240, 236, 0.6)',
          }}
        >
          {addressTextPretty}
        </span>
      </motion.address>

      <span aria-hidden="true" style={{ flex: 1 }} />

      {data.mapUrl && (
        <motion.img
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(String(data.mapUrl))}&color=5C0A14&bgcolor=FFFFFF`}
          alt="QR Code for Location"
          width={120}
          height={120}
          style={{
            marginTop: '16px',
            backgroundColor: 'rgba(255,255,255,0.96)',
            padding: '12px',
            borderRadius: '16px',
            border: '1px solid rgba(123,15,26,0.10)',
            boxShadow: '0 14px 30px rgba(123, 15, 26, 0.14)',
            display: 'block',
          }}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      )}
    </section>
  )
}
