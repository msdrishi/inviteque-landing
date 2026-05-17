import { useEffect, useRef, useState } from 'react'

/**
 * Hook for lazy loading images using Intersection Observer
 * Usage: const { ref, isVisible } = useLazyLoad()
 * Then use: <img ref={ref} loading="lazy" src={isVisible ? imageSrc : 'placeholder'} />
 */
export function useLazyLoad(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, {
      rootMargin: '50px',
      ...options,
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options])

  return { ref, isVisible }
}
