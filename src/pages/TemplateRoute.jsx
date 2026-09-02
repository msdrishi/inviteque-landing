import { useEffect, useState } from 'react'
import { Navigate, useParams, useNavigate, useLocation } from 'react-router-dom'
import TemplateRoyalWedding from './TemplateRoyalWedding.jsx'
import TemplateAuraOfElegance from './TemplateAuraOfElegance.jsx'
import TemplateTwilightSerenade from './TemplateTwilightSerenade.jsx'
import TemplateBlossomWhisper from './TemplateBlossomWhisper.jsx'
import TemplateEverlastingVows from './TemplateEverlastingVows.jsx'
import TemplateSunflowersFields from './TemplateSunflowersFields.jsx'
import TemplateModernHearth from './TemplateModernHearth.jsx'
import TemplateMidnightWaltz from './TemplateMidnightWaltz.jsx'
import TemplateRoyalHeirloom from './TemplateRoyalHeirloom.jsx'
import royalPalaceMapping from '../royalPalaceCloudinaryMapping.json'
import everlastingVowsMapping from '../everlastingVowsCloudinaryMapping.json'

// Import Template 3 Assets for Preloading
import template3HeroBg from '../assets/themes/template3/hero_bg.png'
import template3MessageBg from '../assets/themes/template3/message_bg.png'
import template3VenueBg from '../assets/themes/template3/venue_bg.png'
import template3DesktopBg from '../assets/themes/template3/desktop_bg.png'

const logo = "/assets/logo/inviteq-logo.png"
import { API_URL } from '../config'

const TEMPLATE_MAP = {
  'royal-wedding': TemplateRoyalWedding,
  'aura-of-elegance': TemplateAuraOfElegance,
  'template-2': TemplateTwilightSerenade,
  'twilight-serenade': TemplateTwilightSerenade,
  'template-1': TemplateRoyalWedding, // Fallback for old links
  'template-3': TemplateSunflowersFields,
  'royal-palace': TemplateSunflowersFields,
  'sunflower-fields': TemplateSunflowersFields,
  'blossom-whisper': TemplateBlossomWhisper,
  'template-4': TemplateEverlastingVows,
  'everlasting-vows': TemplateEverlastingVows,
  'everlastingvows': TemplateEverlastingVows,
  'modernhearth': TemplateModernHearth,
  'house-warming-1': TemplateModernHearth,
  'modern-hearth': TemplateModernHearth,
  'midnight-waltz': TemplateMidnightWaltz,
  'royal-heirloom': TemplateRoyalHeirloom,
  'royal-heritage': TemplateRoyalHeirloom,
}

const TEMPLATE_ASSETS = {
  'royal-heirloom': [
    "/assets/templates/royal-heirloom/cover-first-frame.webp",
    "/assets/templates/royal-heirloom/hero-bg-mobile.webp",
  ],
  'royal-heritage': [
    "/assets/templates/royal-heirloom/cover-first-frame.webp",
    "/assets/templates/royal-heirloom/hero-bg-mobile.webp",
  ],
  'midnight-waltz': [
    "/assets/templates/midnight-waltz/hero-desktop.webp",
    "/assets/templates/midnight-waltz/hero-mobile.webp",
    "/assets/templates/midnight-waltz/photo-bg-desktop.webp",
    "/assets/templates/midnight-waltz/photo-bg-mobile.webp",
    "/assets/templates/midnight-waltz/welcome-desktop.webp",
    "/assets/templates/midnight-waltz/welcome-mobile.webp",
    "/assets/templates/midnight-waltz/venue-desktop.webp",
    "/assets/templates/midnight-waltz/venue-mobile.webp",
    "/assets/templates/midnight-waltz/countdown-desktop.webp",
    "/assets/templates/midnight-waltz/countdown-mobile.webp"
  ],
  'modernhearth': [
    "/assets/templates/modern-hearth/hero-desktop.webp",
    "/assets/templates/modern-hearth/hero-mobile.webp",
    "/assets/templates/modern-hearth/welcome-desktop.webp",
    "/assets/templates/modern-hearth/welcome-house-warming.webp",
    "/assets/templates/modern-hearth/location-desktop.webp",
    "/assets/templates/modern-hearth/location-mobile.webp",
    "/assets/templates/modern-hearth/schedule-desktop.webp",
    "/assets/templates/modern-hearth/schedule-mobile.webp",
    "/assets/templates/modern-hearth/countdown-desktop.webp",
    "/assets/templates/modern-hearth/countdown-mobile.webp"
  ],
  'modern-hearth': [],
  'house-warming-1': [],
  'twilight-serenade': [
    "/assets/templates/twilight-serenade/hero-desktop.webp",
    "/assets/templates/twilight-serenade/hero-mobile.webp",
    "/assets/templates/twilight-serenade/photo-section-desktop.webp",
    "/assets/templates/twilight-serenade/photo-section-mobile.webp",
    "/assets/templates/twilight-serenade/message-section-desktop.webp",
    "/assets/templates/twilight-serenade/message-section-mobile.webp",
    "/assets/templates/twilight-serenade/location-section-desktop.webp",
    "/assets/templates/twilight-serenade/location-section-mobile.webp",
    "/assets/templates/twilight-serenade/countdown-section-desktop.webp",
    "/assets/templates/twilight-serenade/countdown-section-mobile.webp",
    "/assets/templates/twilight-serenade/twilight-photo-1.webp",
    "/assets/templates/twilight-serenade/twilight-photo-2.webp",
    "/assets/templates/twilight-serenade/twilight-photo-3.webp"
  ],
  'aura-of-elegance': [
    "/assets/templates/aura-of-elegance/hero-bg.webp",
    "/assets/templates/aura-of-elegance/hero-arch.webp",
    "/assets/templates/aura-of-elegance/texture-pink.webp",
    "/assets/templates/aura-of-elegance/location-bg.webp",
    "/assets/templates/aura-of-elegance/venue-bg.webp"
  ],
  'template-3': Object.values(royalPalaceMapping),
  'royal-palace': Object.values(royalPalaceMapping),
  'sunflower-fields': Object.values(royalPalaceMapping),
  'blossom-whisper': [
    template3HeroBg,
    template3MessageBg,
    template3VenueBg,
    template3DesktopBg
  ],
  // Curated list of actually-used assets (excludes 229 unused animation frames from the mapping)
  'template-4': [
    everlastingVowsMapping['hero_desktop.png'],
    everlastingVowsMapping['hero_mobile.png'],
    everlastingVowsMapping['photo_desktop.png'],
    everlastingVowsMapping['photo_mobile.png'],
    everlastingVowsMapping['venue_desktop.png'],
    everlastingVowsMapping['venue_mobile.png'],
    everlastingVowsMapping['countdown_desktop.png'],
    everlastingVowsMapping['countdown_mobile.png'],
    everlastingVowsMapping['photocards/template-4-1.png'],
    everlastingVowsMapping['photocards/template-4-2.png'],
    everlastingVowsMapping['photocards/template-4-3.png'],
    everlastingVowsMapping['wedding-message/desktop.png'],
    everlastingVowsMapping['wedding-message/mobile.png'],
    everlastingVowsMapping['wedding-message/welcome_desktop.mp4'],
  ].filter(Boolean),
  'everlasting-vows': [
    everlastingVowsMapping['hero_desktop.png'],
    everlastingVowsMapping['hero_mobile.png'],
    everlastingVowsMapping['photo_desktop.png'],
    everlastingVowsMapping['photo_mobile.png'],
    everlastingVowsMapping['venue_desktop.png'],
    everlastingVowsMapping['venue_mobile.png'],
    everlastingVowsMapping['countdown_desktop.png'],
    everlastingVowsMapping['countdown_mobile.png'],
    everlastingVowsMapping['photocards/template-4-1.png'],
    everlastingVowsMapping['photocards/template-4-2.png'],
    everlastingVowsMapping['photocards/template-4-3.png'],
    everlastingVowsMapping['wedding-message/desktop.png'],
    everlastingVowsMapping['wedding-message/mobile.png'],
    everlastingVowsMapping['wedding-message/welcome_desktop.mp4'],
  ].filter(Boolean),
  'everlastingvows': [
    everlastingVowsMapping['hero_desktop.png'],
    everlastingVowsMapping['hero_mobile.png'],
    everlastingVowsMapping['photo_desktop.png'],
    everlastingVowsMapping['photo_mobile.png'],
    everlastingVowsMapping['venue_desktop.png'],
    everlastingVowsMapping['venue_mobile.png'],
    everlastingVowsMapping['countdown_desktop.png'],
    everlastingVowsMapping['countdown_mobile.png'],
    everlastingVowsMapping['photocards/template-4-1.png'],
    everlastingVowsMapping['photocards/template-4-2.png'],
    everlastingVowsMapping['photocards/template-4-3.png'],
    everlastingVowsMapping['wedding-message/desktop.png'],
    everlastingVowsMapping['wedding-message/mobile.png'],
    everlastingVowsMapping['wedding-message/welcome_desktop.mp4'],
  ].filter(Boolean)
}

const extractImageUrls = (data) => {
  const urls = [];
  if (!data) return urls;

  if (data.coupleData?.groomPhoto) urls.push(data.coupleData.groomPhoto);
  if (data.coupleData?.bridePhoto) urls.push(data.coupleData.bridePhoto);
  if (data.coupleData?.couplePhoto) urls.push(data.coupleData.couplePhoto);

  if (data.storyData?.photos && Array.isArray(data.storyData.photos)) {
    data.storyData.photos.forEach(p => { if (p) urls.push(p); });
  }

  if (data.galleryData?.photos && Array.isArray(data.galleryData.photos)) {
    data.galleryData.photos.forEach(p => { if (p) urls.push(p); });
  }

  if (data.photos && Array.isArray(data.photos)) {
    data.photos.forEach(p => { if (p) urls.push(p); });
  }

  return urls.filter(Boolean);
};

const preloadAssets = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve) => {
        if (typeof url !== 'string') return resolve();
        if (url.endsWith('.mp4')) {
          const video = document.createElement('video');
          video.src = url;
          video.preload = 'auto';
          video.onloadeddata = resolve;
          video.onerror = resolve;
        } else {
          const img = new Image()
          img.src = url
          img.onload = resolve
          img.onerror = resolve
        }
      })
    })
  )
}

export default function TemplateRoute() {
  const { templateId, code, groupSlug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true'
  const [inviteData, setInviteData] = useState(null)
  const [loading, setLoading] = useState(!isPreview)
  const [showSplash, setShowSplash] = useState(!isPreview)

  useEffect(() => {
    let active = true;

    async function loadAll() {
      if (isPreview) {
        if (active) {
          setLoading(false);
          setShowSplash(false);
        }
        return;
      }

      try {
        let fetchedData = null;
        if (code) {
          const res = await fetch(`${API_URL}/api/invites/${code}`);
          if (res.ok) {
            fetchedData = await res.json();
            if (active) setInviteData(fetchedData);
          } else {
            if (active) navigate('/', { replace: true });
            return;
          }
        }

        const isDesktop = window.innerWidth >= 768;
        const staticAssets = TEMPLATE_ASSETS[templateId] || [];
        const dynamicAssets = extractImageUrls(fetchedData);
        let allAssets = [...staticAssets, ...dynamicAssets];

        // Preload only the first frame and video matching the active device width to save bandwidth
        if (templateId === 'sunflower-fields' || templateId === 'royal-palace' || templateId === 'template-3') {
          if (isDesktop) {
            allAssets = allAssets.filter(url => typeof url === 'string' && !url.includes('mobile') && !url.includes('swaying'));
          } else {
            allAssets = allAssets.filter(url => typeof url === 'string' && !url.includes('desktop') && !url.includes('wind') && !url.includes('moving'));
          }
        }

        const assetsPromise = preloadAssets(allAssets);
        const fontsPromise = document.fonts.ready;
        const delayPromise = new Promise(resolve => setTimeout(resolve, 1000));
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 4000)); // 4 seconds max wait

        await Promise.race([
          Promise.all([assetsPromise, fontsPromise, delayPromise]),
          timeoutPromise
        ]);
        
        if (active) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load template assets:", err);
        if (active) {
          setLoading(false);
          setShowSplash(false);
        }
      }
    }

    loadAll();

    return () => {
      active = false;
    };
  }, [code, templateId, isPreview, navigate])

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [loading])

  const normalizedId = (templateId || '').toLowerCase().trim()
  const TemplateComponent = TEMPLATE_MAP[normalizedId] || TEMPLATE_MAP['twilight-serenade'] || TemplateTwilightSerenade

  return (
    <div className="relative w-full min-h-screen">
      {/* Template Component is mounted when loading finishes or immediately in preview */}
      {(!loading || isPreview) && (
        <TemplateComponent savedData={inviteData} groupSlug={groupSlug} />
      )}

      {/* Splash Screen overlay (fixed on top, fades out when loading finishes) */}
      {showSplash && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FDFCFB] transition-opacity duration-500 ease-in-out"
          style={{ 
            opacity: loading ? 1 : 0,
            pointerEvents: loading ? 'all' : 'none'
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Circular Loading Halo around Logo */}
            <div className="relative h-15 w-15 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[5px] border-[#D4AF37]/10"></div>
              <div className="absolute inset-0 rounded-full border-t-[5px] border-[#D4AF37] animate-spin"></div>

              <img
                src={logo}
                alt="Inviteque"
                className="h-14 w-14 object-contain rounded-full relative z-10"
              />
            </div>

            {/* Premium Text under Logo */}
            <div className="mt-2 text-center">
              <h2 className="font-parisienne text-2xl font-normal text-iqText opacity-80">Inviteque</h2>
            </div>
          </div>

          {/* Decorative corner accents */}
          <div className="fixed top-10 left-10 h-16 w-16 border-t border-l border-[#D4AF37]/10 rounded-tl-2xl"></div>
          <div className="fixed bottom-10 right-10 h-16 w-16 border-b border-r border-[#D4AF37]/10 rounded-br-2xl"></div>
        </div>
      )}
    </div>
  )
}
