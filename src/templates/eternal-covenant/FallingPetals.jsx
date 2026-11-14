import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function FallingPetals({ count = 22, height = '100svh' }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const rand = (offset) => {
        const x = Math.sin(i * 9.301 + offset * 7.583) * 43758.5453
        return x - Math.floor(x)
      }

      const isLeft = i % 2 === 0
      const leftPos = isLeft ? rand(0) * 18 : 82 + rand(0) * 18
      const baseDrift = 10 + rand(4) * 40
      const driftDirection = isLeft ? -1 : 1

      return {
        left: `${leftPos}vw`,
        duration: 9 + rand(1) * 14,
        delay: rand(2) * 10,
        size: 11 + rand(3) * 13,
        x1: driftDirection * baseDrift,
        x2: driftDirection * (baseDrift * 0.7),
        x3: driftDirection * (baseDrift * 0.4),
        initRot: rand(7) * 360,
        rotAmount: (1.2 + rand(8)) * (rand(9) > 0.5 ? 360 : -360),
        opacity: 0.65 + rand(10) * 0.35,
        scale: 0.75 + rand(11) * 0.35,
      }
    })
  }, [count])

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      style={{ height, width: '100%' }}
    >
      {petals.map((p, i) => (
        <motion.img
          key={i}
          src="/assets/decorations/rose-petal.webp"
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: '-8%',
            left: p.left,
            width: p.size,
            height: 'auto',
            opacity: p.opacity,
            scale: p.scale,
            filter: 'drop-shadow(0px 2px 4px rgba(225, 112, 128, 0.35))',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          animate={{
            y: ['0vh', '115vh'],
            x: [0, p.x1, p.x2, p.x3],
            rotate: [p.initRot, p.initRot + p.rotAmount],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
