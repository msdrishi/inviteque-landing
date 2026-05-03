import { motion } from 'framer-motion'

/* ── Animation helpers ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

/* ── Leaf SVG — bottom-left & right corner decoration ── */
function LeafSprig({ flip = false }) {
  return (
    <svg
      viewBox="0 0 90 50"
      width="78"
      height="44"
      fill="none"
      aria-hidden="true"
      style={{
        transform: flip ? 'scaleX(-1)' : undefined,
        opacity: 0.55,
      }}
    >
      {/* Main stem */}
      <path d="M10 42 Q35 28 80 10" stroke="#C4974A" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Leaves */}
      <path d="M22 36 Q18 22 32 20 Q28 34 22 36Z" fill="#C4974A" opacity="0.7"/>
      <path d="M38 28 Q36 14 50 13 Q46 27 38 28Z" fill="#C4974A" opacity="0.7"/>
      <path d="M54 20 Q54 6 68 6 Q63 19 54 20Z" fill="#C4974A" opacity="0.6"/>
      {/* Small berries */}
      <circle cx="18" cy="38" r="2.2" fill="#C4974A" opacity="0.5"/>
      <circle cx="70" cy="9"  r="2"   fill="#C4974A" opacity="0.45"/>
    </svg>
  )
}

/* ── Social icon circle ── */
function SocialIcon({ href = '#', label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1.5px solid rgba(255,246,240,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,246,240,0.85)',
        textDecoration: 'none',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,246,240,0.7)'
        e.currentTarget.style.background = 'rgba(255,246,240,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,246,240,0.35)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </a>
  )
}

/* ── SVG icons ── */
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.22-1.632A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.887 9.887 0 01-5.042-1.378l-.361-.214-3.742.981.999-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.53 6.53 2.106 12 2.106c5.471 0 9.894 4.424 9.894 9.894 0 5.471-4.423 9.894-9.894 9.894z"/>
  </svg>
)

/* ── Main Footer ── */
export default function Footer({ data }) {
  if (!data) return null

  return (
    <footer
      id={data.id}
      style={{
        background: 'linear-gradient(160deg, #5C0A14 0%, #7B0F1A 50%, #5C0A14 100%)',
        padding: '36px 24px 28px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Subtle radial glow in the centre */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(196,151,74,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 0,
        }}
      >

        {/* "Crafted with love by" */}
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(9px, 2.6vw, 11px)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,246,240,0.65)',
            marginBottom: 6,
          }}
        >
          Crafted with love by
        </motion.p>

        {/* Brand name — Parisienne script + heart swash */}
        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}
        >
          <span
            style={{
              fontFamily: "'Parisienne', cursive",
              fontSize: 'clamp(34px, 9vw, 50px)',
              fontWeight: 400,
              color: '#FFF6F0',
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}
          >
            Inviteque
          </span>
          {/* Heart swash */}
          <svg viewBox="0 0 28 26" width="22" height="20" fill="none" aria-hidden="true"
            style={{ marginTop: 4, flexShrink: 0 }}>
            <path
              d="M14 23S3 15.5 3 8.5A5.5 5.5 0 0114 5.8 5.5 5.5 0 0125 8.5C25 15.5 14 23 14 23z"
              stroke="#C4974A" strokeWidth="1.4" fill="rgba(196,151,74,0.18)"
            />
            {/* Small curl tail */}
            <path d="M22 20 Q28 22 26 26" stroke="#C4974A" strokeWidth="1.1"
              strokeLinecap="round" fill="none"/>
          </svg>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(9.5px, 2.8vw, 12px)',
            color: 'rgba(255,246,240,0.6)',
            lineHeight: 1.6,
            marginBottom: 18,
            maxWidth: 260,
          }}
        >
          Create Beautiful Digital Invitations.
          <br />
          Share Love. Share Moments.
        </motion.p>

        {/* Social icons */}
        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 16 }}
        >
          <SocialIcon href="https://inviteque.com" label="Website">
            <GlobeIcon />
          </SocialIcon>
          <SocialIcon href="https://instagram.com/inviteque" label="Instagram">
            <InstagramIcon />
          </SocialIcon>
          <SocialIcon href="https://facebook.com/inviteque" label="Facebook">
            <FacebookIcon />
          </SocialIcon>
          <SocialIcon href="https://wa.me/inviteque" label="WhatsApp">
            <WhatsAppIcon />
          </SocialIcon>
        </motion.div>

        {/* Website URL */}
        <motion.a
          variants={fadeUp}
          href="https://www.inviteque.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(9.5px, 2.8vw, 12px)',
            letterSpacing: '0.06em',
            color: 'rgba(255,246,240,0.6)',
            textDecoration: 'none',
            marginBottom: 20,
          }}
        >
          www.inviteque.com
        </motion.a>

        {/* Bottom divider heart */}
        <motion.div variants={fadeUp}>
          <svg viewBox="0 0 24 22" width="16" height="14" fill="none" aria-hidden="true">
            <path
              d="M12 20S2 13 2 7A5 5 0 0112 4.2 5 5 0 0122 7C22 13 12 20 12 20z"
              fill="#C4974A" opacity="0.5"
            />
          </svg>
        </motion.div>

      </motion.div>

      {/* Leaf sprigs — bottom corners */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 16,
          left: 12,
          pointerEvents: 'none',
        }}
      >
        <LeafSprig />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 16,
          right: 12,
          pointerEvents: 'none',
        }}
      >
        <LeafSprig flip />
      </div>
    </footer>
  )
}
