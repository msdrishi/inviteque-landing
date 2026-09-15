import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ThinDivider, SectionLogo, FallingPetals, BlurText } from './Animations';

export default function Hero({ data, heroBg, hasOpened }) {
  const lineAnim = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const C = {
    primary: '#4A3E20',
    secondary: '#7A6840',
    gold: '#B09060',
  };

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-10%']);
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 });

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetDateISO = useMemo(() => {
    try {
      const monthMap = { 'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5, 'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11 };
      const m = monthMap[data.heroDateParts.month.toUpperCase()] || 10;
      const y = parseInt(data.heroDateParts.year, 10);
      const d = parseInt(data.heroDateParts.day, 10);
      return new Date(y, m, d, 12, 0, 0).getTime();
    } catch {
      return new Date("2026-11-26T12:00:00").getTime();
    }
  }, [data]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDateISO - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDateISO]);

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start overflow-hidden">
      {/* Fade-in Parallax Background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={hasOpened ? { opacity: 1, scale: 1.15 } : { opacity: 0, scale: 1.05 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, transformOrigin: 'center' }}
      >
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
      </motion.div>

      {hasOpened && <FallingPetals />}

      {/* Hero Text Content (Staggered after bg fades in) */}
      {hasOpened && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.8 } } }}
          className="relative z-10 flex flex-col items-center text-center w-full max-w-sm px-4 pt-[1vh] pb-[45vh]"
        >

          <SectionLogo isHero={true} />

          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[10px] md:text-[12px] uppercase tracking-[0.22em] mb-1 px-2 leading-relaxed whitespace-pre-line mt-4 font-bold"
            style={{ color: C.secondary }}
          >
            <BlurText text={data.heroSubtitle} delay={1.6} />
          </motion.p>

          <motion.div variants={lineAnim} className="mb-1">
            <ThinDivider color={C.secondary} width={80} />
          </motion.div>

          <motion.div variants={lineAnim} className="flex flex-col items-center mb-2 mt-4 overflow-visible">
            <h1 className="font-['Shalyne',_cursive] text-[70px] leading-none select-none font-normal drop-shadow-sm" style={{ color: C.primary }}>
              <BlurText text={data.groomName} delay={0.8} />
            </h1>
            <p className="font-['Shalyne',_cursive] text-4xl -my-2 z-10" style={{ color: C.gold }}>
              &
            </p>
            <h1 className="font-['Shalyne',_cursive] text-[70px] leading-none select-none font-normal drop-shadow-sm" style={{ color: C.primary }}>
              <BlurText text={data.brideName} delay={1.2} />
            </h1>
          </motion.div>

          <motion.p
            variants={lineAnim}
            className="font-['Cinzel'] text-[10px] uppercase tracking-[0.2em] mb-4 whitespace-pre-line leading-relaxed font-bold opacity-90"
            style={{ color: C.secondary }}
          >
            <BlurText text={data.familyDetails} delay={1.8} />
          </motion.p>

          <motion.div variants={lineAnim} className="flex items-center gap-4 mb-2 mt-2">
            <span className="font-['Cinzel'] text-sm uppercase tracking-[0.3em] font-bold" style={{ color: C.primary }}>{data.heroDateParts.month}</span>
            <span className="font-['Bodoni_Moda',_'Cinzel',_serif] text-5xl font-bold tracking-tight" style={{ color: C.primary }}>{data.heroDateParts.day}</span>
            <span className="font-['Cinzel'] text-sm uppercase tracking-[0.3em] font-bold" style={{ color: C.primary }}>{data.heroDateParts.year}</span>
          </motion.div>



          <motion.div variants={lineAnim} className="flex items-center justify-center gap-4 px-6 py-2 rounded-2xl bg-white/25 backdrop-blur-md border border-white/40 shadow-sm mt-1">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hrs', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div key={idx} className="flex flex-col items-center w-12">
                <span className="font-['Cinzel'] text-xl md:text-2xl font-bold tabular-nums tracking-wider" style={{ color: C.primary }}>
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="font-['Cormorant_Garamond'] text-[10px] uppercase tracking-widest font-bold mt-1" style={{ color: C.secondary }}>
                  {unit.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
