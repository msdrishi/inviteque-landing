import { motion } from 'framer-motion'
import { fadeUp, staggerChildren, viewportOnce } from '../motionVariants.js'

function Wave({ className }) {
  return (
    <svg
      width="1200"
      height="120"
      viewBox="0 0 1200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="currentColor"
        d="M0 56C70 28 130 28 200 56C270 84 330 84 400 56C470 28 530 28 600 56C670 84 730 84 800 56C870 28 930 28 1000 56C1070 84 1130 84 1200 56V120H0V56Z"
      />
    </svg>
  )
}

function ActionButton({ href, label, icon, variant }) {
  const base =
    'inline-flex w-full items-center justify-center gap-3 rounded-full px-5 py-3 text-sm font-semibold'
  const primary = 'bg-gradient-to-r from-wineFrom to-wineTo text-background shadow-luxury'
  const secondary = 'border border-primary/25 bg-white/70 text-primary'

  return (
    <a
      href={href || '#'}
      className={`${base} ${variant === 'secondary' ? secondary : primary}`}
    >
      {label}
      {icon ? <span aria-hidden="true">{icon}</span> : null}
    </a>
  )
}

export default function RSVP({ data }) {
  if (!data) return null

  return (
    <section id={data.id} className="w-full px-6 py-16">
      <div className="relative">
        <Wave className="pointer-events-none absolute -top-7 left-0 z-0 w-full text-background" />
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative z-10 rounded-panel bg-background/95 p-6 text-center shadow-luxury backdrop-blur"
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-heading text-2xl font-semibold text-primary"
          >
            {data.title}
          </motion.h2>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="mx-auto mt-3 flex max-w-[18rem] items-center gap-3 text-gold/70"
          >
            <div className="h-px flex-1 bg-gold/30" />
            <div className="text-xs drop-shadow-gold animate-float-glow">♥</div>
            <div className="h-px flex-1 bg-gold/30" />
          </motion.div>

          {data.illustration ? (
            <motion.img
              variants={fadeUp}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
              src={data.illustration}
              alt=""
              className="mx-auto mt-5 h-16 w-auto opacity-75"
              loading="lazy"
            />
          ) : null}

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="mt-4 text-sm leading-relaxed text-primary/80"
          >
            {data.message}
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
            className="mx-auto mt-6 grid max-w-[18rem] gap-3"
          >
            <ActionButton
              href={data.primary?.href}
              label={data.primary?.label}
              icon={data.primary?.icon}
              variant="primary"
            />
            <ActionButton
              href={data.secondary?.href}
              label={data.secondary?.label}
              icon={data.secondary?.icon}
              variant="secondary"
            />
          </motion.div>
        </motion.div>
        <Wave className="pointer-events-none absolute -bottom-7 left-0 z-0 w-full rotate-180 text-background" />
      </div>
    </section>
  )
}
