import React from 'react';
import { motion } from 'framer-motion';

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.2, 
      ease: [0.33, 1, 0.68, 1] 
    } 
  },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.2, 
      ease: [0.33, 1, 0.68, 1] 
    } 
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    }
  }
};

export const slowReveal = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { 
      duration: 1.5, 
      ease: 'easeOut'
    } 
  }
};

export const slideInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.0, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

// SVG divider for royal aesthetic
export const ThinDivider = ({ color = '#4A3E20', width = 110, className="" }) => (
  <div
    aria-hidden="true"
    className={`flex items-center gap-2 ${className}`}
    style={{ width }}
  >
    <div className="flex-1 h-[1px]" style={{ background: color, opacity: 0.6 }} />
    <div
      className="shrink-0 w-[5px] h-[5px] rounded-full"
      style={{ background: color, opacity: 0.75 }}
    />
    <div className="flex-1 h-[1px]" style={{ background: color, opacity: 0.6 }} />
  </div>
);

export const SectionLogo = ({ isHero = false }) => (
  <motion.div variants={fadeInUp} className="mb-4 flex justify-center w-full">
    <img 
      src="/assets/templates/kirti-and-sahil/kirti-sahil-logo.webp" 
      alt="Kirti & Sahil" 
      className={`${isHero ? 'h-8 md:h-12' : 'h-16 md:h-24'} w-auto object-contain opacity-85`}
    />
  </motion.div>
);

export const letterStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    }
  }
};

export const BlurText = ({ text, className, style, delay = 0 }) => {
  return (
    <motion.span
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: delay,
          }
        },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: delay,
          }
        }
      }}
      initial="hidden"
      whileInView="visible"
      animate="show" // In case it's used inside AnimatePresence or needs explicit animate
      viewport={{ once: false, amount: 0.2 }}
      className={`inline-flex flex-wrap justify-center ${className}`}
      style={style}
    >
      {text.split(' ').map((word, wordIndex, array) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={slowReveal}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex !== array.length - 1 && (
            <span className="inline-block w-[0.3em]">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.span>
  );
};

const petalImg = "/assets/decorations/rose-petal.png";
const petalConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20;
  const duration = 6 + Math.random() * 8;
  const delay = Math.random() * 5;
  const size = 15 + Math.random() * 20;
  return { left: leftPos, duration, delay, size };
});

export function FallingPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100svh' }}>
      {petalConfig.map((p, i) => (
        <motion.img
          key={i}
          src={petalImg}
          alt=""
          className="absolute top-[-10%]"
          style={{ left: `${p.left}%`, width: p.size, height: 'auto', opacity: 0.8 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  )
}

export const WatercolorSplash = ({ colors = ['#EAB308', '#FEF08A'] }) => (
  <motion.div 
    className="absolute inset-0 z-0 pointer-events-none opacity-80 overflow-hidden rounded-2xl"
  >
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: [1, 2, 2.5, 1], opacity: [0.8, 0.6, 0.2, 0.8] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[30px]"
      style={{ background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)` }}
    />
    {colors[1] && (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: [1, 2, 2.5, 1], opacity: [0.8, 0.6, 0.2, 0.8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-[40px]"
        style={{ background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)` }}
      />
    )}
  </motion.div>
);
