import { useRef, useEffect, useCallback } from 'react'

/**
 * WaterRevealImage — scroll-triggered image reveal with organic watercolor spreading effect.
 * The image stays perfectly still; only an organic clip-path mask animates from center outward.
 *
 * @param {string}  src          – image source URL
 * @param {string}  alt          – alt text
 * @param {string}  className    – classes for the root container (set sizing here)
 * @param {number}  duration     – animation duration in seconds (default 2.0)
 * @param {boolean} triggerOnce  – if false, replays each time section enters viewport
 * @param {number}  threshold    – IntersectionObserver threshold 0–1 (default 0.25)
 */
export default function WaterRevealImage({
  src,
  alt = '',
  className = '',
  duration = 2.0,
  triggerOnce = true,
  threshold = 0.25,
}) {
  const containerRef = useRef(null)
  const clipRef = useRef(null)
  const outlineRef = useRef(null)
  const rafRef = useRef(null)

  /* ──── easing: ease-out-cubic for smooth natural deceleration ──── */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

  /* ──── organic clip-path generator ────
     Creates a polygon with 72 points arranged in a distorted circle.
     Multi-octave sine noise produces subtle watercolor-like edge irregularity.
     Noise attenuates as progress increases so the final shape covers the full container. */
  const buildPath = useCallback((progress, offset = 0, points = 72) => {
    if (progress <= 0.005) return 'polygon(50% 50%, 50% 50%, 50% 50%)'

    const R = 90 // max radius (% from center) — large enough to cover all corners
    const atten = 1 - progress * 0.4 // noise fades as reveal grows (organic → smooth)

    const pts = []
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2

      // Multi-octave edge noise (watercolor irregularity)
      const noise = (
        0.08  * Math.sin(a * 2  + 1.2) +
        0.06  * Math.sin(a * 3  + 0.8) +
        0.04  * Math.sin(a * 5  + 2.1) +
        0.03  * Math.sin(a * 7  + 0.5) +
        0.02  * Math.sin(a * 11 + 1.7) +
        0.012 * Math.sin(a * 13 + 3.2)
      ) * atten

      // Directional expansion variation — some parts spread slightly faster
      const bias = (
        0.08 * Math.sin(a * 2   + 0.3) +
        0.05 * Math.sin(a * 3.5 + 1.9)
      ) * atten

      const p = Math.min(1, progress + progress * bias)
      const r = R * p * (1 + noise) + offset

      pts.push(
        `${(50 + Math.cos(a) * r).toFixed(2)}% ${(50 + Math.sin(a) * r).toFixed(2)}%`
      )
    }
    return `polygon(${pts.join(',')})`
  }, [])

  /* ──── prefers-reduced-motion: skip animation entirely ──── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches && clipRef.current) {
      clipRef.current.style.clipPath = 'none'
      clipRef.current.style.webkitClipPath = 'none'
    }
  }, [])

  /* ──── IntersectionObserver + requestAnimationFrame animation ──── */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const setClip = (ref, cp) => {
      if (!ref.current) return
      ref.current.style.clipPath = cp
      ref.current.style.webkitClipPath = cp
    }

    /* Reset to hidden state */
    const hide = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setClip(clipRef, buildPath(0))
      if (outlineRef.current) outlineRef.current.style.opacity = '0'
    }

    /* Run the water-spreading reveal */
    const reveal = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      const ms = duration * 1000
      const t0 = performance.now()

      const step = (now) => {
        const raw = Math.min(1, (now - t0) / ms)
        const p = easeOutCubic(raw)

        // Image reveal mask
        setClip(clipRef, p >= 0.995 ? 'none' : buildPath(p))

        // Organic outline ring — visible during mid-expansion, fades at end
        if (outlineRef.current) {
          if (p > 0.06 && p < 0.96) {
            const fadeIn  = Math.min(1, (p - 0.06) / 0.20)
            const fadeOut = p > 0.78 ? Math.max(0, 1 - (p - 0.78) / 0.18) : 1
            outlineRef.current.style.opacity = String((fadeIn * fadeOut * 0.50).toFixed(3))
            setClip(outlineRef, buildPath(p, 3.0))
          } else {
            outlineRef.current.style.opacity = '0'
          }
        }

        if (raw < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          // Fully revealed — clean up
          setClip(clipRef, 'none')
          if (outlineRef.current) outlineRef.current.style.opacity = '0'
        }
      }

      hide()
      rafRef.current = requestAnimationFrame(step)
    }

    /* Intersection Observer — triggers animation on scroll */
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          if (triggerOnce) obs.disconnect()
        } else if (!triggerOnce) {
          hide()
        }
      },
      { threshold }
    )

    hide()
    obs.observe(el)

    return () => {
      obs.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [duration, triggerOnce, threshold, buildPath])

  /* ──── render ──── */
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Watercolor-edge outline ring (visible during expansion, fades before settling) */}
      <div
        ref={outlineRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          opacity: 0,
          background:
            'linear-gradient(135deg, rgba(183,122,22,0.35), rgba(107,53,29,0.28))',
          willChange: 'clip-path, opacity',
        }}
      />

      {/* Image container — only the clip-path mask moves; image stays perfectly still */}
      <div
        ref={clipRef}
        className="w-full h-full relative z-[2]"
        style={{ willChange: 'clip-path' }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ transform: 'none' }}
          draggable={false}
        />
      </div>
    </div>
  )
}
