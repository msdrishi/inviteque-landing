import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const desktopHeroBg      = "/assets/templates/rajestani-vows/hero-mobile.webp";
const smartphoneHeroBg   = "/assets/templates/rajestani-vows/hero-mobile.webp";



export default function RishikaHero({ data, isDesktop }) {
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  );

  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-4%']);
  const bgY  = useSpring(rawY, { stiffness: 55, damping: 18 });

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = !isDesktop && windowWidth >= 600 && windowWidth <= 1024;
  const bgSrc = isDesktop ? desktopHeroBg : smartphoneHeroBg;

  const C = {
    primary:   '#4A3E20',
    secondary: '#7A6840',
    gold:      '#B09060',
  };

  const lineAnim = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const groomName = data.groomName || 'Major Jaskaran';
  const brideName = data.brideName || 'Rishika';

  return (
    <section
      id="hero"
      aria-label="Wedding hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: isDesktop ? '100vh' : '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: isDesktop ? '55vh' : (isTablet ? '55svh' : '55svh'),
        paddingBottom: isDesktop ? '28px' : '20px',
        paddingLeft: isTablet ? 36 : 24,
        paddingRight: isTablet ? 36 : 24,
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          scale: isDesktop ? 1.20 : (isTablet ? 1.04 : 1.12),
          transformOrigin: 'center',
          y: bgY,
        }}
      >
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          loading="eager"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.1 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.35 } } }}
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: isDesktop ? 520 : (isTablet ? 640 : 360),
        }}
      >


        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(14px, 1.3vw, 18px)' : (isTablet ? 'clamp(26px, 3.0vw, 32px)' : 'clamp(15px, 2.2vw, 22px)'),
            color: C.primary,
            margin: `0 0 ${isDesktop ? '8px' : '5px'} 0`,
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          Save the Date
        </motion.p>

        <motion.div
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? `calc(clamp(2.5rem, 4.2vw, 3.6rem))` : `calc(clamp(2.2rem, 3.8vw, 3.2rem))`,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: C.primary,
            lineHeight: 1.0,
          }}
        >
          {brideName}
        </motion.div>

        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Modernline', sans-serif",
            fontSize: isDesktop ? 'clamp(1.4rem, 2.4vw, 2.0rem)' : 'clamp(1.3rem, 3.0vw, 2.2rem)',
            color: C.primary,
            margin: `-2px 0`,
            lineHeight: 1.0,
          }}
        >
          and
        </motion.p>

        <motion.div
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: isDesktop ? `calc(clamp(2.5rem, 4.2vw, 3.6rem))` : `calc(clamp(2.2rem, 3.8vw, 3.2rem))`,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: C.primary,
            lineHeight: 1.0,
            marginTop: '4px'
          }}
        >
          {groomName}
        </motion.div>

        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: isDesktop ? 'clamp(9px, 0.9vw, 11px)' : 'clamp(8px, 2.2svw, 10px)',
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: C.secondary,
            margin: `15px 0 6px 0`,
            opacity: 0.85,
          }}
        >
          Are Getting Married
        </motion.p>

        <motion.div variants={lineAnim} style={{ marginBottom: 6 }}>
          <div style={{ height: '1px', width: '80px', backgroundColor: C.secondary, opacity: 0.5 }}></div>
        </motion.div>

        <motion.div
          variants={lineAnim}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          <span style={{ fontFamily: "'Religath', serif", fontSize: '1.2rem', color: C.primary }}>DEC</span>
          <span style={{ color: C.secondary, fontSize: '1.1rem', opacity: 0.6 }}>|</span>
          <span style={{ fontFamily: "'Religath', serif", fontSize: '2.0rem', color: C.primary }}>6-7</span>
          <span style={{ color: C.secondary, fontSize: '1.1rem', opacity: 0.6 }}>|</span>
          <span style={{ fontFamily: "'Religath', serif", fontSize: '1.2rem', color: C.primary }}>2026</span>
        </motion.div>

        <motion.p
          variants={lineAnim}
          style={{
            fontFamily: "'Religath', serif",
            fontSize: '14px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.primary,
            margin: `3px 0 1px 0`,
          }}
        >
          {data.venueCity}
        </motion.p>
      </motion.div>
    </section>
  );
}
