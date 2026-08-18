import { motion } from 'framer-motion'

/**
 * CustomSection Component
 * A full-screen dynamic section rendered immediately below the Hero section across templates.
 * Uses the exact same background images (desktop & mobile) as the template's Photo Cards section.
 *
 * @param {Object} props
 * @param {string} props.photoBgDesktop - Background image URL for desktop view
 * @param {string} props.photoBgMobile - Background image URL for mobile view
 * @param {Object} props.data - Saved invite draft data or custom section configuration
 * @param {string} [props.titleFontClass] - Optional font class for headers matching template theme
 * @param {string} [props.bodyFontClass] - Optional font class for body matching template theme
 * @param {string} [props.accentColorClass] - Optional text accent color class (defaults to gold/theme accent)
 */
export default function CustomSection({
  photoBgDesktop,
  photoBgMobile,
  data = {},
  titleFontClass = '',
  bodyFontClass = '',
  accentColorClass = 'text-[#D4AF37]',
  bgStyle = null,
  titleStyle = null,
  subtitleStyle = null,
  bodyStyle = null,
  dividerColor = '#D4AF37',
  children = null
}) {
  const showSection = data.showCustomSection !== undefined
    ? Boolean(data.showCustomSection)
    : !!(data.customSectionTitle || data.customSectionContent || data.customSectionSubtitle || data.customSectionLocation)

  if (!showSection) return null

  const title = data.customSectionTitle || ''
  const subtitle = data.customSectionSubtitle || ''
  const dateTag = data.customSectionDate || ''
  const locationTag = data.customSectionLocation || ''
  const content = data.customSectionContent || ''
  const position = data.customSectionPosition || 'top-center'

  // Staggered slow and smooth animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35, // Slow, elegant line-by-line staggering
        delayChildren: 0.2
      }
    }
  }

  const lineVariants = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } // Smooth cubic-bezier curve
    }
  }

  // Map position preset to flex layout alignment classes
  const getPositionClasses = (pos) => {
    switch (pos) {
      case 'top-left':
        return {
          container: 'items-start justify-start text-left pt-20 md:pt-28 pl-6 md:pl-20 pr-6',
          align: 'items-start text-left'
        }
      case 'top-center':
        return {
          container: 'items-start justify-center text-center pt-20 md:pt-28 px-6',
          align: 'items-center text-center'
        }
      case 'top-right':
        return {
          container: 'items-start justify-end text-right pt-20 md:pt-28 pr-6 md:pr-20 pl-6',
          align: 'items-end text-right'
        }
      case 'center-left':
        return {
          container: 'items-center justify-start text-left pl-6 md:pl-20 pr-6 py-12',
          align: 'items-start text-left'
        }
      case 'center-right':
        return {
          container: 'items-center justify-end text-right pr-6 md:pr-20 pl-6 py-12',
          align: 'items-end text-right'
        }
      case 'bottom-left':
        return {
          container: 'items-end justify-start text-left pb-20 md:pb-28 pl-6 md:pl-20 pr-6',
          align: 'items-start text-left'
        }
      case 'bottom-center':
        return {
          container: 'items-end justify-center text-center pb-20 md:pb-28 px-6',
          align: 'items-center text-center'
        }
      case 'bottom-right':
        return {
          container: 'items-end justify-end text-right pb-20 md:pb-28 pr-6 md:pr-20 pl-6',
          align: 'items-end text-right'
        }
      case 'center':
      default:
        return {
          container: 'items-center justify-center text-center px-6 py-12',
          align: 'items-center text-center'
        }
    }
  }

  const { container, align } = getPositionClasses(position)

  // Split multi-line content into paragraph lines for individual smooth entrance
  const contentLines = content ? content.split('\n').filter(line => line.trim() !== '') : []

  return (
    <section className="relative w-full min-h-screen min-h-[100svh] flex overflow-hidden z-20" style={bgStyle || {}}>
      {/* Pure Background Image / Style without any solid overlay */}
      <div className="absolute inset-0 z-0 bg-transparent">
        {photoBgMobile && (
          <img
            src={photoBgMobile}
            alt="Custom Section Background Mobile"
            className="h-full w-full object-cover md:hidden"
            loading="lazy"
          />
        )}
        {photoBgDesktop && (
          <img
            src={photoBgDesktop}
            alt="Custom Section Background Desktop"
            className="hidden h-full w-full object-cover md:block"
            loading="lazy"
          />
        )}
        {children}
      </div>

      {/* Dynamic Content Container */}
      <div className={`relative z-10 w-full min-h-screen min-h-[100svh] flex ${container}`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className={`flex flex-col ${align} max-w-3xl w-full p-4 sm:p-6 md:p-8 transition-all`}
        >
          {/* Optional Date / Badge Header */}
          {dateTag && (
            <motion.div variants={lineVariants} className="mb-4">
              <span
                className="inline-block rounded-full bg-black/75 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-sm"
              >
                {dateTag}
              </span>
            </motion.div>
          )}

          {/* Title */}
          {title && (
            <motion.h2
              variants={lineVariants}
              className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-2 ${titleFontClass}`}
              style={titleStyle || {}}
            >
              {title}
            </motion.h2>
          )}

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              variants={lineVariants}
              className={`text-sm sm:text-base md:text-lg font-bold tracking-wider ${accentColorClass} mb-4 uppercase`}
              style={subtitleStyle || {}}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Location Tag */}
          {locationTag && (
            <motion.div
              variants={lineVariants}
              className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-semibold tracking-wider text-gray-900 mb-4 uppercase"
              style={subtitleStyle || {}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#D4AF37] flex-shrink-0" style={{ color: dividerColor }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{locationTag}</span>
            </motion.div>
          )}

          {/* Decorative Divider */}
          {(title || subtitle) && content && (
            <motion.div
              variants={lineVariants}
              className="w-20 h-0.5 my-4 opacity-90 shadow-sm"
              style={{ background: `linear-gradient(to right, transparent, ${dividerColor}, transparent)` }}
            />
          )}

          {/* Main Custom Body Content (Animated Line-by-Line) */}
          {contentLines.length > 0 && (
            <div className={`space-y-3 w-full font-normal ${bodyFontClass}`}>
              {contentLines.map((line, idx) => (
                <motion.p
                  key={idx}
                  variants={lineVariants}
                  className="text-base sm:text-lg md:text-xl text-gray-900 leading-relaxed font-medium"
                  style={bodyStyle || {}}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
