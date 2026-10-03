import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ParchmentReveal({ children }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start unrolling as soon as the top of the section appears at the bottom of the viewport
    // Finish unrolling exactly when the top of the section reaches the top of the viewport
    offset: ["start end", "start start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  // Reaches full height exactly as you arrive at the section
  const heightStr = useTransform(smoothProgress, [0.1, 0.9], ["5vh", "75vh"]);
  
  // Roller rotations
  const bgPosYTop = useTransform(smoothProgress, [0.1, 0.9], ["0%", "-120%"]);
  const bgPosYBottom = useTransform(smoothProgress, [0.1, 0.9], ["0%", "120%"]);

  return (
    <div ref={containerRef} className="relative w-full h-[105vh] z-20">
      <div className="sticky top-0 left-0 w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        
        <div className="relative w-[90%] max-w-[440px] flex flex-col items-center justify-center pointer-events-auto">
          
          {/* Top Roller */}
          <motion.div 
            className="relative w-[106%] h-[28px] shrink-0 z-30 shadow-[0_15px_25px_rgba(74,40,16,0.4)] rounded-full"
            style={{ 
              background: 'linear-gradient(to bottom, #724e1d 0%, #d4b581 20%, #f5e7d3 50%, #b6985a 80%, #573a14 100%)',
              backgroundSize: '100% 200%',
              backgroundPositionY: bgPosYTop,
            }}
          >
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-[36px] rounded-l-md shadow-md" style={{ background: 'linear-gradient(to bottom, #724e1d, #d4af37, #573a14)' }} />
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-[20px] rounded-l-full shadow-md" style={{ background: 'linear-gradient(to bottom, #573a14, #d4af37, #3d280d)' }} />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-[36px] rounded-r-md shadow-md" style={{ background: 'linear-gradient(to bottom, #724e1d, #d4af37, #573a14)' }} />
            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-3 h-[20px] rounded-r-full shadow-md" style={{ background: 'linear-gradient(to bottom, #573a14, #d4af37, #3d280d)' }} />
          </motion.div>

          {/* Parchment Sheet */}
          <motion.div 
            className="relative w-full flex flex-col items-center overflow-hidden"
            style={{ 
              height: heightStr,
              background: '#FDF8EF', // Brighter Warm Ivory
              boxShadow: 'inset 0 0 40px rgba(138,100,39,0.15), 0 20px 40px rgba(0,0,0,0.15)',
              borderLeft: '1px solid rgba(181, 138, 69, 0.3)',
              borderRight: '1px solid rgba(181, 138, 69, 0.3)',
              transformOrigin: 'top center',
            }}
          >
            {/* Texture */}
            <div 
              className="absolute inset-0 opacity-[0.12] mix-blend-multiply pointer-events-none" 
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              }}
            />
            {/* Shading Details */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(138,100,39,0.15) 0%, transparent 6%, transparent 94%, rgba(138,100,39,0.15) 100%)' }} />
            <div className="absolute top-0 left-0 w-full h-8 opacity-60 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 w-full h-8 opacity-60 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.1) 0%, transparent 100%)' }} />

            {/* Inner Content Area - No opacity fade, content is revealed physically by the paper unrolling */}
            <div className="absolute top-0 left-0 w-full h-[75vh] p-5 sm:p-8 pointer-events-auto flex flex-col items-center justify-center">
              {/* Elegant Inner Border */}
              <div className="w-full h-full relative border-[1px] border-[#B58A45]/40 p-4 flex flex-col items-center justify-center text-center">
                {/* Outer faint border */}
                <div className="absolute -inset-[4px] border-[1px] border-[#B58A45]/20 pointer-events-none" />
                
                {/* Corner Flourishes */}
                <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#B58A45]/70 pointer-events-none" />
                <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#B58A45]/70 pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#B58A45]/70 pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#B58A45]/70 pointer-events-none" />
                
                {/* Content */}
                <div className="relative z-10 w-full">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Roller */}
          <motion.div 
            className="relative w-[106%] h-[28px] shrink-0 z-30 shadow-[0_15px_30px_rgba(74,40,16,0.4)] rounded-full -mt-[1px]"
            style={{ 
              background: 'linear-gradient(to top, #724e1d 0%, #d4b581 20%, #f5e7d3 50%, #b6985a 80%, #573a14 100%)',
              backgroundSize: '100% 200%',
              backgroundPositionY: bgPosYBottom,
            }}
          >
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-[36px] rounded-l-md shadow-md" style={{ background: 'linear-gradient(to bottom, #724e1d, #d4af37, #573a14)' }} />
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-[20px] rounded-l-full shadow-md" style={{ background: 'linear-gradient(to bottom, #573a14, #d4af37, #3d280d)' }} />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-[36px] rounded-r-md shadow-md" style={{ background: 'linear-gradient(to bottom, #724e1d, #d4af37, #573a14)' }} />
            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-3 h-[20px] rounded-r-full shadow-md" style={{ background: 'linear-gradient(to bottom, #573a14, #d4af37, #3d280d)' }} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
