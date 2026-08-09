import { useEffect, useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import TemplateRoyalWedding from './TemplateRoyalWedding.jsx'
import TemplateAuraOfElegance from './TemplateAuraOfElegance.jsx'
import TemplateTwilightSerenade from './TemplateTwilightSerenade.jsx'
import TemplateBlossomWhisper from './TemplateBlossomWhisper.jsx'
import TemplateEverlastingVows from './TemplateEverlastingVows.jsx'
import TemplateSunflowersFields from './TemplateSunflowersFields.jsx'
import royalPalaceMapping from '../royalPalaceCloudinaryMapping.json'
import everlastingVowsMapping from '../everlastingVowsCloudinaryMapping.json'

// Import Template 3 Assets for Preloading
import template3HeroBg from '../assets/themes/template3/hero_bg.png'
import template3MessageBg from '../assets/themes/template3/message_bg.png'
import template3VenueBg from '../assets/themes/template3/venue_bg.png'
import template3DesktopBg from '../assets/themes/template3/desktop_bg.png'

const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"
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
}

const TEMPLATE_ASSETS = {
  'twilight-serenade': [
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964581/desktop.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964627/smartphone.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964624/photo-section-desktop.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964626/photo-section-mobile.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964619/message-section-desktop.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964623/message-section-mobile.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964612/location-section-desktop.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964614/location-section-mobile.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964566/countdown-section-desktop.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964573/countdown-section-mobile.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964628/twilight-photo-1.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964629/twilight-photo-2.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964631/twilight-photo-3.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1783964586/divider-flowers-mobile.png"
  ],
  'aura-of-elegance': [
    "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1780830584/bevo6p9kp87xs9glyczu.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782033902/nelfh17u4fep6v8ksoei.webp",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029563/kozuh0rafoxa9zwysfjq.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029548/d0kadhlyhbkrywpc4qeb.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029562/ucwqwm3grlx07v8iijxc.png",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1786194482/sbwivzirylzohych9vju.png"
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
  'template-4': Object.values(everlastingVowsMapping),
  'everlasting-vows': Object.values(everlastingVowsMapping),
  'everlastingvows': Object.values(everlastingVowsMapping)
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

  return urls.filter(Boolean);
};

const preloadAssets = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve) => {
        if (url.endsWith('.mp4')) {
          const video = document.createElement('video');
          video.src = url;
          video.preload = 'auto';
          video.onloadedmetadata = resolve;
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
  const { templateId, code } = useParams()
  const navigate = useNavigate()
  const [inviteData, setInviteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    let active = true;

    async function loadAll() {
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

        const staticAssets = TEMPLATE_ASSETS[templateId] || [];
        const dynamicAssets = extractImageUrls(fetchedData);
        const allAssets = [...staticAssets, ...dynamicAssets];

        const assetsPromise = preloadAssets(allAssets);
        const fontsPromise = document.fonts.ready;
        const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

        await Promise.all([assetsPromise, fontsPromise, delayPromise]);
        
        if (active) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load template assets:", err);
        if (active) {
          navigate('/', { replace: true });
        }
      }
    }

    loadAll();

    return () => {
      active = false;
    };
  }, [code, templateId, navigate])

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [loading])

  const TemplateComponent = TEMPLATE_MAP[templateId]

  if (!TemplateComponent) {
    return <Navigate to="/" replace />
  }

  const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true'

  return (
    <div className="relative w-full min-h-screen">
      {/* Template Component is mounted only when loading finishes */}
      {!loading && (!code || inviteData || isPreview) && (
        <TemplateComponent savedData={inviteData} />
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
