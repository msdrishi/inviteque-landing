import { useLazyLoad } from '../hooks/useLazyLoad'

/**
 * Lazy Loading Image Component
 * Automatically loads images only when they're visible
 * Usage: <LazyImage src={imageSrc} alt="description" className="w-full" />
 */
export function LazyImage({ src, alt, className = '', ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  )
}
