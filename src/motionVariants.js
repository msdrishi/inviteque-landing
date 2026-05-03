export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export const staggerChildren = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

// Repeat animations when re-entering the viewport (enables scroll-in + scroll-out)
export const viewportOnce = { once: false, amount: 0.1 }
