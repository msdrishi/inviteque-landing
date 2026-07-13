import { useEffect, useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import TemplateRoyalWedding from './TemplateRoyalWedding.jsx'
import TemplateAuraOfElegance from './TemplateAuraOfElegance.jsx'
import TemplateTwilightSerenade from './TemplateTwilightSerenade.jsx'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"
import { API_URL } from '../config'

const TEMPLATE_MAP = {
  'royal-wedding': TemplateRoyalWedding,
  'aura-of-elegance': TemplateAuraOfElegance,
  'template-2': TemplateTwilightSerenade,
  'twilight-serenade': TemplateTwilightSerenade,
  'template-1': TemplateRoyalWedding, // Fallback for old links
}

const ASSETS_TO_PRELOAD = [
  "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1780830584/bevo6p9kp87xs9glyczu.png",
  "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029563/kozuh0rafoxa9zwysfjq.png"
]

const preloadImages = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        img.onload = resolve
        img.onerror = resolve // Resolve anyway to avoid blocking the app on load failure
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
    // 1. Fetch data if code is present
    const dataPromise = code
      ? fetch(`${API_URL}/api/invites/${code}`)
          .then(res => {
            if (!res.ok) {
              navigate('/', { replace: true })
              return null
            }
            return res.json()
          })
          .then(data => {
            if (data) {
              setInviteData(data)
              return data
            }
            return null
          })
          .catch(err => {
            console.error("Failed to fetch invite:", err)
            navigate('/', { replace: true })
            return null
          })
      : Promise.resolve(null)

    // 2. Preload core template assets
    const assetsPromise = preloadImages(ASSETS_TO_PRELOAD)

    // 3. Minimum timeout to allow the splash to be readable and display logo
    const delayPromise = new Promise(resolve => setTimeout(resolve, 1500))

    // Wait for all to resolve
    Promise.all([dataPromise, assetsPromise, delayPromise]).then(() => {
      setLoading(false)
    })
  }, [code, navigate])

  // Completely unmount splash overlay 500ms after loading finishes (duration of fade out)
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

  return (
    <div className="relative w-full min-h-screen">
      {/* Template Component is only mounted when loading finishes, preserving animations */}
      {!loading && (
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
            <div className="mt-6 text-center">
              <h2 className="font-parisienne text-4xl font-normal text-iqText opacity-80">Inviteque</h2>
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
