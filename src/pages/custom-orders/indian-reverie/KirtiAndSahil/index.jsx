import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { customData as data } from './data';
import CoverScreen from './components/CoverScreen';
import Hero from './components/Hero';
import FathersMessage from './components/FathersMessage';
import EventScene from './components/EventScene';
import TravelGuide from './components/TravelGuide';
import Playlist from './components/Playlist';
import InviteQRSVP from '../../../../components/InviteQRSVP';
import Footer from '../../../../components/Footer';
import Closing from './components/Closing';

// Assets
const ASSETS = {
  coverVideo: '/assets/templates/kirti-and-sahil/cover-opening.MP4',
  heroBg: '/assets/templates/kirti-and-sahil/hero.webp',
  plainBg1: '/assets/templates/kirti-and-sahil/plain-bg-1.webp',
  plainBg2: '/assets/templates/kirti-and-sahil/plain-bg-2.webp',
  plainBg3: '/assets/templates/kirti-and-sahil/plain-bg-3.webp',
  haldi: '/assets/templates/kirti-and-sahil/haldi.webp',
  engagement: '/assets/templates/kirti-and-sahil/engagement.webp',
  fatherMsgBg: '/assets/templates/kirti-and-sahil/father-msg-bg.webp',
  weddingBg: '/assets/templates/kirti-and-sahil/wedding-bg.webp',
  weddingBgCopy: '/assets/templates/kirti-and-sahil/wedding-bg copy.webp',
  resortGuide: '/assets/templates/kirti-and-sahil/Resort-guide.webp',
  plainBg4: '/assets/templates/kirti-and-sahil/plain-bg-4.webp',
  thankyouBorder: '/assets/templates/kirti-and-sahil/thankyou-border.webp',
  musicBg: '/assets/templates/kirti-and-sahil/music-bg.webp',
  engagementSangeet: '/assets/templates/kirti-and-sahil/engagement-sangeet.webp',
};

// Import music locally
import bgMusicSrc from '../../../../assets/audio/bg-music-a-thousand-years.mp3';

// Simple SVG icon for Music On
const MusicOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
  </svg>
);

// Simple SVG icon for Music Off
const MusicOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
  </svg>
);

export default function CustomIndianReverieKirtiAndSahil() {
  const [showSplash, setShowSplash] = useState(true);

  // Cover opening & video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  // Music state
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // 1.2 second fake loading delay to show Inviteque splash
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenCover = () => {
    if (hasOpened || isPlaying) return;
    setIsPlaying(true);

    // Play audio immediately with volume on tap gesture
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 1;
      audioRef.current.play().catch(() => { });
    }
  };

  const handleVideoEnded = () => {
    setHasOpened(true);
  };

  const handleTimeUpdate = (e) => {
    const vid = e.target;
    if (vid.duration && vid.currentTime > 0.5 && vid.currentTime >= vid.duration - 0.25) {
      if (!hasOpened) {
        setHasOpened(true);
      }
    }
  };

  const toggleMusic = () => {
    setIsMusicMuted(!isMusicMuted);
    if (audioRef.current) {
      if (isMusicMuted) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => { });
      } else {
        audioRef.current.pause();
      }
    }
  };

  // Prevent scroll while cover is visible
  useEffect(() => {
    if (!hasOpened) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasOpened]);

  return (
    <div className="relative min-h-screen bg-[#181311] text-[#4A3E20] flex justify-center">
      {/* Container forcing mobile portrait dimension */}
      <main className="relative w-full max-w-[480px] bg-[#ECE3D1] shadow-2xl overflow-clip flex flex-col font-sans">

        {/* Splash Screen */}
        <AnimatePresence>
          {showSplash && (
            <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#FDFCFB]">
              <div className="relative flex flex-col items-center">
                <div className="relative h-15 w-15 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[5px] border-[#D4AF37]/10"></div>
                  <div className="absolute inset-0 rounded-full border-t-[5px] border-[#D4AF37] animate-spin"></div>
                  <img src="/assets/logo/inviteq-logo.png" alt="Inviteque" className="h-14 w-14 object-contain rounded-full relative z-10" />
                </div>
                <div className="mt-2 text-center">
                  <h2 className="font-parisienne text-2xl font-normal opacity-80">Inviteque</h2>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Cover Screen */}
        {!showSplash && (
          <CoverScreen
            hasOpened={hasOpened}
            isPlaying={isPlaying}
            handleOpenCover={handleOpenCover}
            handleVideoEnded={handleVideoEnded}
            handleTimeUpdate={handleTimeUpdate}
            coverVideoSrc={ASSETS.coverVideo}
          />
        )}

        {/* Main Sections */}
        <div className={!hasOpened ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
          <Hero
            data={data}
            heroBg={ASSETS.heroBg}
            hasOpened={hasOpened}
          />
          {/* Sticky Scroll Group */}
          <div className="relative z-10 w-full">
            <FathersMessage
              message={data.fathersMessage}
              bgImage={ASSETS.plainBg3}
              isSticky={true}
              zIndex={5}
            />

            <EventScene
              dayData={data.haldi}
              bgImage={ASSETS.haldi}
              isSticky={true}
              zIndex={10}
              topRounded={true}
            />
            <EventScene
              dayData={data.engagement}
              bgImage={ASSETS.engagementSangeet}
              isSticky={true}
              zIndex={20}
              topRounded={true}
            />
            <EventScene
              dayData={data.day2}
              bgImage={ASSETS.weddingBgCopy}
              isSticky={true}
              zIndex={30}
              topRounded={true}
            />
          </div>

          <TravelGuide
            data={data.travelGuide}
            bgImage={ASSETS.resortGuide}
          />

          <Playlist
            data={data.playlist}
            bgImage={ASSETS.musicBg}
          />

          {/* Render the standard InviteQ RSVP component styled for the Indian Reverie theme */}
          <div className="relative min-h-[100dvh] w-full flex flex-col justify-center py-12">
            {/* We keep the same plain background for RSVP */}
            <div className="absolute inset-0 z-0">
              <img
                src={ASSETS.plainBg2}
                alt=""
                className="w-full h-full object-cover object-bottom"
                draggable={false}
              />
            </div>
            <div className="relative z-10 w-full px-4">
              <InviteQRSVP
                theme="traditional"
                events={[]}
                isPreview={true}
                config={{
                  enabled: true,
                  collectHeadcount: true,
                  collectEvents: false,
                  collectMessage: true,
                }}
              />
            </div>
          </div>

          <Closing
            data={data.closing}
            bgImage={ASSETS.plainBg2}
            borderImage={ASSETS.thankyouBorder}
          />

          {/* Inviteque standard Footer */}
          <div className="relative z-50">
            <Footer data={{}} />
          </div>
        </div>

        {/* Background Audio Player */}
        <audio ref={audioRef} src={bgMusicSrc} loop />

        {/* Music Toggle Button - Visible only after opening */}
        {hasOpened && (
          <button
            onClick={toggleMusic}
            className="fixed bottom-6 right-4 z-50 p-3 rounded-full bg-[#3A1F10]/80 backdrop-blur-sm text-[#F5D78E] border border-[#F5D78E]/30 shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all hover:scale-105 hover:bg-[#3A1F10]"
            aria-label={isMusicMuted ? "Play Music" : "Mute Music"}
          >
            {isMusicMuted ? <MusicOffIcon /> : <MusicOnIcon />}
          </button>
        )}

      </main>
    </div>
  );
}
