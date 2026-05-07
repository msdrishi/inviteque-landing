import { motion } from 'framer-motion'
import { fadeUp, staggerChildren, viewportOnce } from '../motionVariants.js'

const titleLetters = {
  hidden: { opacity: 1, y: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.035, delayChildren: 0.06 },
  },
}

const titleLetter = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

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

export default function Events({ data }) {
  if (!data) return null

  const title = String(data.title || '').trim() || 'Wedding Schedule'

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
            variants={titleLetters}
            className="text-center font-heading text-2xl font-semibold text-primary"
          >
            {title
              .split('')
              .map((ch, idx) => (
                <motion.span
                  key={`${ch}-${idx}`}
                  variants={titleLetter}
                  style={{ display: 'inline-block' }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
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
            className="relative mt-8"
          >
            <div className="absolute left-6 top-2 bottom-2 w-px bg-primary/15" />

            <div className="space-y-6">
              {Array.isArray(data.items)
                ? data.items.map((item) => (
                    <div
                      key={`${item.time}-${item.name}`}
                      className="relative flex items-start gap-4"
                    >
                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/70 shadow-luxury">
                        <span className="text-sm font-semibold text-primary/70">
                          {item.icon ? item.icon : ''}
                        </span>
                      </div>
                      <div className="pt-1">
                        <div className="text-xs uppercase tracking-widest text-primary/60">
                          {item.time}
                        </div>
                        <div className="mt-1 font-heading text-lg font-semibold text-primary">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </motion.div>
        </motion.div>
        <Wave className="pointer-events-none absolute -bottom-7 left-0 z-0 w-full rotate-180 text-background" />
      </div>
    </section>
  )
}
