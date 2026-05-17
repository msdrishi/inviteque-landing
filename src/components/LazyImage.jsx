import { useLazyLoad } from '../hooks/useLazyLoad'

/**
 * Lazy Loading Image Component
 * Automatically loads images only when they're visible
 * Usage: <LazyImage src={imageSrc} alt="description" className="w-full" />
 */
export function LazyImage({ src, alt, className = '', ...props }) {
  const { ref, isVisible } = useLazyLoad()

  return (
    <img
      ref={ref}
      src={isVisible ? src : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E'}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  )
}
