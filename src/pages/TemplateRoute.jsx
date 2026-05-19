import { useEffect, useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import TemplateRoyalWedding from './TemplateRoyalWedding.jsx'
import logo from '../assets/logo/logo-inviteque.png'
import { API_URL } from '../config'

const TEMPLATE_MAP = {
  'royal-wedding': TemplateRoyalWedding,
  'aura-of-elegance': TemplateRoyalWedding,
  'template-1': TemplateRoyalWedding, // Fallback for old links
}

export default function TemplateRoute() {
  const { templateId, code } = useParams()
  const navigate = useNavigate()
  const [inviteData, setInviteData] = useState(null)
  const [loading, setLoading] = useState(!!code)

  useEffect(() => {
    if (code) {
      fetch(`${API_URL}/api/invites/${code}`)
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
            setLoading(false)
          }
        })
        .catch(err => {
          console.error("Failed to fetch invite:", err)
          navigate('/', { replace: true })
        })
    }
  }, [code, navigate])

  const TemplateComponent = TEMPLATE_MAP[templateId]

  if (!TemplateComponent) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
        <div className="relative flex flex-col items-center">
          {/* Circular Loading Halo around Logo */}
          <div className="relative h-15 w-15 flex items-center justify-center">
            {/* The Rotating Halo */}
            <div className="absolute inset-0 rounded-full border-[5px] border-[#D4AF37]/10"></div>
            <div className="absolute inset-0 rounded-full border-t-[5px] border-[#D4AF37] animate-spin"></div>

            {/* The Logo */}
            <img
              src={logo}
              alt="Inviteque"
              className="h-14 w-14 object-contain rounded-full relative z-10"
            />
          </div>

          {/* Premium Text under Logo */}
          <div className="mt-6 text-center">
            <h2 className="text-xl font-serif italic text-iqText tracking-widest opacity-80">Invitique</h2>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="fixed top-10 left-10 h-16 w-16 border-t border-l border-[#D4AF37]/10 rounded-tl-2xl"></div>
        <div className="fixed bottom-10 right-10 h-16 w-16 border-b border-r border-[#D4AF37]/10 rounded-br-2xl"></div>
      </div>
    )
  }

  return <TemplateComponent savedData={inviteData} />
}
