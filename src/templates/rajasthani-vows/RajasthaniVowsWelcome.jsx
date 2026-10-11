import { motion } from 'framer-motion'
import { SectionHeader, LotusDivider } from './RajasthaniVowsShared.jsx'

export default function RajasthaniVowsWelcome({
  data = {},
  bgImageDesktop,
  bgImageMobile,
  isDesktop = false,
}) {
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 600 && window.innerWidth <= 1024

  const bgSrc = isDesktop
    ? (data.bgImageDesktop || bgImageDesktop || "/assets/templates/rajestani-vows/welcome-mobile.webp")
    : (data.bgImageMobile || bgImageMobile || "/assets/templates/rajestani-vows/welcome-mobile.webp")

  const titleText = data.headingLine1 && data.headingLine2
    ? `${data.headingLine1} ${data.headingLine2}`
    : (data.headingLine1 || data.headingLine2 || data.title || "DEAR FRIENDS & FAMILY")

  return (
    <section
      id="welcome"
      aria-label="Welcome"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: isDesktop ? '4vh' : (isTablet ? '4.5svh' : '4svh'),
        paddingBottom: '32px',
        paddingLeft: isDesktop ? '32px' : '24px',
        paddingRight: isDesktop ? '32px' : '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Background image */}
      <img
        src={bgSrc}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Typography layer — centered in the middle of the section */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          marginInline: 'auto',
          width: '100%',
          maxWidth: isDesktop ? 620 : (isTablet ? 520 : 380),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Consistent Section Header */}
        <SectionHeader
          subtitle={data.badge || "INVITATION"}
          title={titleText}
        />

        {/* Animated Welcome Message Body — Slow and smooth fade-in */}
        {data.message && (
          <motion.div
            initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 px-2"
          >
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 500,
                fontSize: isDesktop ? '15px' : (isTablet ? '16px' : '13.5px'),
                color: '#7A1228',
                lineHeight: 1.85,
                letterSpacing: '0.06em',
                margin: 0,
                opacity: 0.92,
              }}
            >
              {data.message}
            </p>
          </motion.div>
        )}

        {/* Bottom decorative flourish */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 1.3, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4"
        >
          <LotusDivider color="#C59A4E" />
        </motion.div>
      </div>
    </section>
  )
}
