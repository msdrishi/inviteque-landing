import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoverScreen({ 
  hasOpened, 
  isPlaying, 
  handleOpenCover, 
  handleTimeUpdate, 
  handleVideoEnded, 
  coverVideoSrc 
}) {
  const videoRef = useRef(null);

  // Expose the video element to the parent logic via ref if needed,
  // or we just handle it directly here, but since the parent 
  // orchestrates the music, we just pass the events.

  const handleVideoEnd = () => {
    window.scrollTo(0, 0);
    handleVideoEnded();
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(e => {
        console.warn("Video play interrupted:", e);
        // Fallback if video fails to play
        handleVideoEnd();
      });
    }
  }, [isPlaying]);

  return (
    <AnimatePresence>
      {!hasOpened && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] bg-black flex flex-col justify-center items-center overflow-hidden cursor-pointer"
          onClick={handleOpenCover}
        >
          {/* Main video element with #t=0.001 trick to show first frame on mobile */}
          <video
            ref={videoRef}
            src={`${coverVideoSrc}#t=0.001`}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover"
          />


        </motion.div>
      )}
    </AnimatePresence>
  );
}
