import React from 'react'
import { motion } from 'framer-motion'

const venueBg = "/assets/templates/royal-heritage/venue-mobile.webp"

const fadeAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: "easeOut" } 
  },
}

const sectionAnim = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 1.5, staggerChildren: 0.3 } 
  }
}

export default function TemplateRoyalHeritageVenue({ data, fontStyles, sectionStyle, bgStyle }) {
  const { cursive, serif, smallCaps } = fontStyles;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(data.venue.mapUrl || '')}&color=8A202A&bgcolor=F9F5EC`;

  return (
    <motion.section 
      style={sectionStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={sectionAnim}
    >
      <img src={venueBg} alt="Venue Background" style={bgStyle} />
      
      <div className="relative z-10 w-full flex flex-col items-center text-center pt-10">
        <motion.p variants={fadeAnim} style={{ ...smallCaps, marginBottom: '4px' }}>
          WHERE WE UNITE
        </motion.p>
        <motion.h2 variants={fadeAnim} style={{ ...smallCaps, fontSize: '24px', marginBottom: '8px' }}>
          OUR VENUE
        </motion.h2>
        <motion.p variants={fadeAnim} style={{ ...serif, fontSize: '16px', maxWidth: '300px', margin: '0 auto 20px' }}>
          A royal architectural heritage where our vows will be celebrated.
        </motion.p>
      </div>

      <motion.div variants={fadeAnim} style={{
        textAlign: 'center',
        maxWidth: '340px',
        width: '90%',
        marginTop: '20px'
      }}>
        <p style={{ ...smallCaps, fontSize: '13px', color: '#8A202A', fontWeight: 'bold' }}>
          CELEBRATION VENUE
        </p>
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '26px', color: '#4A3E20', margin: '4px 0 12px', fontWeight: 'bold' }}>
          {data.venue.mahalName}
        </h3>
        
        <div style={{ height: '1px', width: '80px', backgroundColor: '#8A202A', margin: '0 auto 12px', opacity: 0.5 }} />

        <p style={{ ...smallCaps, fontSize: '13px', color: '#4A3E20', marginBottom: '20px', lineHeight: 1.6 }}>
          {data.venue.venueAddress}, {data.venue.venueCity}, {data.venue.state}
        </p>

        {data.venue.mapUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ padding: '6px', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px', border: '1px solid rgba(138,32,42,0.3)', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
              <img src={qrCodeUrl} alt="Scan for Directions" style={{ width: '70px', height: '70px', opacity: 0.9 }} />
            </div>
            <span style={{ ...smallCaps, fontSize: '10px', marginTop: '10px', fontWeight: 'bold' }}>
              Scan to Navigate
            </span>
            <a href={data.venue.mapUrl} target="_blank" rel="noreferrer" style={{
              ...smallCaps,
              fontSize: '12px',
              marginTop: '16px',
              display: 'inline-block',
              padding: '10px 32px',
              background: 'linear-gradient(to right, #8A202A, #6b1821)',
              color: '#F9F5EC',
              borderRadius: '99px',
              textDecoration: 'none',
              fontWeight: 'bold',
              boxShadow: '0 8px 15px rgba(138,32,42,0.2)'
            }}>
              GET DIRECTIONS
            </a>
          </div>
        )}
      </motion.div>
      <div style={{ flex: 1, minHeight: '140px' }} />
    </motion.section>
  )
}
