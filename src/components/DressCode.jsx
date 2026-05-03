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

function DressCard({ item }) {
  return (
    <div className="rounded-card bg-white/70 p-4 shadow-luxury">
      {item?.image ? (
        <img
          src={item.image}
          alt=""
          className="h-24 w-auto opacity-80"
          loading="lazy"
        />
      ) : null}
      <div className="mt-3 font-heading text-lg font-semibold text-primary">
        {item?.label}
      </div>
      <div className="mt-1 text-sm text-primary/70">{item?.styleLabel}</div>
    </div>
  )
}

export default function DressCode({ data }) {
  if (!data) return null

  const paletteItems = Array.isArray(data.palette)
    ? data.palette
        .map((c) => {
          if (typeof c === 'string') return { name: c, hex: null }
          if (c && typeof c === 'object') return { name: c.name, hex: c.hex }
          return null
        })
        .filter(Boolean)
    : []

  return (
    <section id={data.id} className="w-full px-6 py-16">
      <div className="relative">
        <Wave className="pointer-events-none absolute -top-7 left-0 z-0 w-full text-background" />
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative z-10 rounded-panel bg-background/95 p-6 shadow-luxury backdrop-blur"
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center font-heading text-2xl font-semibold text-primary"
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

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
            className="mt-8 grid grid-cols-2 gap-4"
          >
            <DressCard item={data.men} />
            <DressCard item={data.women} />
          </motion.div>

          {paletteItems.length > 0 ? (
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
              className="mt-8 rounded-card bg-white/70 p-5 shadow-luxury"
            >
              <div className="text-center text-xs uppercase tracking-[0.35em] text-primary/60">
                {data.paletteTitle}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {paletteItems.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full border border-primary/10 shadow-sm"
                      style={{ backgroundColor: c.hex || 'transparent' }}
                      aria-label={c.name}
                      title={c.name}
                    />
                    <div className="text-sm font-semibold text-primary/75">
                      {c.name}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </motion.div>
        <Wave className="pointer-events-none absolute -bottom-7 left-0 z-0 w-full rotate-180 text-background" />
      </div>
    </section>
  )
}
