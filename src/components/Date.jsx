import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../motionVariants.js'

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

export default function DateSection({ data }) {
  if (!data) return null

  return (
    <section id={data.id} className="w-full px-6 py-16">
      <div className="relative">
        <Wave className="pointer-events-none absolute -top-7 left-0 z-0 w-full text-background" />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative z-10 rounded-panel bg-background/95 p-6 text-center shadow-luxury backdrop-blur"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-xs font-semibold tracking-[0.35em] text-primary/70"
          >
            {data.title}
          </motion.p>

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
            className="mt-6"
          >
            <div className="font-heading text-6xl font-semibold leading-none text-primary">
              {data.day}
            </div>
            <div className="mt-2 font-heading text-2xl font-semibold text-primary">
              {data.month}
            </div>
            <div className="mt-1 text-sm tracking-widest text-primary/70">
              {data.year}
            </div>
          </motion.div>

          {data.fullDate ? (
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
              className="mt-6 text-sm text-primary/80"
            >
              {data.fullDate}
            </motion.p>
          ) : null}
        </motion.div>
        <Wave className="pointer-events-none absolute -bottom-7 left-0 z-0 w-full rotate-180 text-background" />
      </div>
    </section>
  )
}
