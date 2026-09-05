import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
const logo = "/assets/logo/inviteq-watermark.png"
import { fadeUp } from '../motionVariants'
import royalPalaceMapping from '../royalPalaceCloudinaryMapping.json'
import everlastingVowsMapping from '../everlastingVowsCloudinaryMapping.json'
const themeImg = "/assets/brand/theme-preview.webp"
import { API_URL } from '../config'

export default function InviteDetails() {
  const { code } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [invite, setInvite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchInvite = async () => {
      try {
        const response = await fetch(`${API_URL}/api/invites/${code}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
        if (response.status === 401) {
          logout()
          navigate('/login')
          return
        }
        if (response.ok) {
          const data = await response.json()
          setInvite(data)
        } else {
          navigate('/account')
        }
      } catch (error) {
        console.error('Error fetching invite details:', error)
        navigate('/account')
      } finally {
        setLoading(false)
      }
    }

    fetchInvite()
  }, [code, user, navigate])

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/templates/${invite.templateId}/${invite.code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const url = `${window.location.origin}/templates/${invite.templateId}/${invite.code}`
    
    const groom = invite.groomName || invite.coupleData?.groomName || ''
    const bride = invite.brideName || invite.coupleData?.brideName || ''
    const isModernHearth = invite?.templateId === 'template-modernhearth' || invite?.templateId === 'modernhearth' || invite?.templateId === 'modern-hearth'
    
    let date = isModernHearth ? 'our celebration day' : 'our wedding day'
    if (invite.weddingDate) {
      const d = invite.weddingDate.day || ''
      const m = invite.weddingDate.month || ''
      const y = invite.weddingDate.year || ''
      if (d && m) date = `${d} ${m} ${y}`.trim()
    } else if (invite.heroData?.weddingDate && invite.heroData?.weddingMonth) {
      date = `${invite.heroData.weddingDate} ${invite.heroData.weddingMonth} ${invite.heroData.weddingYear || ''}`.trim()
    }
    
    const time = (invite.weddingTime || invite.heroData?.weddingTime || '').trim()
    const timeStr = time ? `at ${time}` : ''
    
    const venue = (invite.mahalName || invite.venueName || invite.venueData?.mahalName || invite.venueData?.venueAddress || 'our venue').trim()
    const city = (invite.venueCity || invite.venueData?.venueCity || '').trim()
    const cityStr = city ? `, ${city}` : ''

    let text = ''
    if (isModernHearth) {
      const host = (groom && bride) ? `${groom} & ${bride}` : (groom || 'The Family')
      text = `✨ *𝐻𝑜𝓊𝓈𝑒𝓌𝒶𝓇𝓂𝒾𝓃𝑔 𝐼𝓃𝓋𝒾𝓉𝒶𝓉𝒾𝑜𝓃* ✨\n\n` +
             `Dear Loved Ones,\n\n` +
             `We are delighted to invite you to join us in celebrating the housewarming ceremony of our new home:\n` +
             `🏡 *${host}* 🏡\n\n` +
             (date ? `📅 Date: *${date.trim()}*\n` : '') +
             (timeStr ? `⏰ Time: *${timeStr}*\n` : '') +
             `📍 Venue: *${(venue + cityStr).trim()}*\n\n` +
             `Please join us to share our joy and bless our new hearth! ❤️\n\n` +
             `Please find the details via our digital invitation link here:\n` +
             `👉 ${url}`
    } else {
      const gName = groom || 'Groom'
      const bName = bride || 'Bride'
      text = `✨ *𝒲𝑒𝒹𝒹𝒾𝓃𝑔 𝐼𝓃𝓋𝒾𝓉𝒶𝓉𝒾𝑜𝓃* ✨\n\n` +
             `Dear Loved Ones,\n\n` +
             `We are joyful to invite you to celebrate the wedding ceremony of\n` +
             `💍 *${gName} & ${bName}* 💍\n\n` +
             (date ? `📅 Date: *${date.trim()}*\n` : '') +
             (timeStr ? `⏰ Time: *${timeStr}*\n` : '') +
             `📍 Venue: *${(venue + cityStr).trim()}*\n\n` +
             `We look forward to your presence and blessings on our special day! ❤️\n\n` +
             `Please find the wedding details via our digital invitation link here:\n` +
             `👉 ${url}`
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iqBg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-iqText border-t-transparent" />
      </div>
    )
  }

  if (!invite) return null

  const inviteUrl = `${window.location.origin}/templates/${invite.templateId}/${invite.code}`

  const isSunflower = invite?.templateId === 'sunflower-fields'
  const isTwilight = invite?.templateId === 'template-2' || invite?.templateId === 'twilight-serenade'
  const isEverlasting = invite?.templateId === 'template-4' || invite?.templateId === 'everlasting-vows' || invite?.templateId === 'everlastingvows'
  const isRoyalPalace = invite?.templateId === 'template-3' || invite?.templateId === 'royal-palace'
  const isModernHearth = invite?.templateId === 'template-modernhearth' || invite?.templateId === 'modernhearth' || invite?.templateId === 'modern-hearth'
  const isMidnightWaltz = invite?.templateId === 'midnight-waltz'
  const isRoyalHeirloom = invite?.templateId === 'royal-heirloom'
  const coverImage = isSunflower
    ? (royalPalaceMapping['hero-first-frame-desktop.jpg'] || "/backgrounds/Sunflower-template/frames/desktop/desktop-view.webp")
    : isTwilight 
      ? "/assets/templates/twilight-serenade/hero-desktop.webp" 
      : isEverlasting
        ? (everlastingVowsMapping['hero_desktop.png'] || "/assets/templates/everlasting-vows/hero-desktop.webp")
        : isRoyalPalace
          ? (royalPalaceMapping['hero-first-frame-desktop.jpg'] || "/assets/templates/sunflower-fields/hero-first-frame-desktop.webp")
          : isModernHearth
            ? "/assets/templates/modern-hearth/hero-desktop.webp"
            : isMidnightWaltz
              ? "/assets/templates/midnight-waltz/hero-desktop.webp"
              : isRoyalHeirloom
                ? "/assets/templates/royal-heirloom/hero-bg-mobile.webp"
                : themeImg
  const headerGradient = isTwilight
    ? "from-[#2d3a28] via-[#3D5236] to-[#2d3a28]"
    : isEverlasting
      ? "from-[#705915] via-[#8A6E1E] to-[#705915]"
      : isRoyalPalace
        ? "from-[#5C0A14] via-[#8A6E1E] to-[#5C0A14]"
        : isModernHearth
          ? "from-[#456B2B] via-[#6B351D] to-[#456B2B]"
          : "from-[#5C0A14] via-[#7B0F1A] to-[#5C0A14]"

  return (
    <div className="min-h-screen flex flex-col bg-iqBg font-saas">
      {/* Header */}
      <header className="border-b border-iqBorder bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" />
            <span className="text-sm font-bold text-black">Invitation Details</span>
          </div>
          <button
            onClick={() => navigate('/account')}
            className="text-sm font-semibold text-black/60 hover:text-black transition-colors"
          >
            ← Back to Account
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Summary Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black">
              {invite.coupleData?.groomName} & {invite.coupleData?.brideName}
            </h1>
            <p className="text-black/60 font-medium">
              Created on {new Date(invite.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Main Card (Styled like Payment Confirmation) */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2.5rem] border border-iqBorder bg-white overflow-hidden shadow-luxury"
          >
            {/* Visual Header */}
            <div className={`h-48 md:h-64 overflow-hidden bg-gradient-to-br ${headerGradient} relative`}>
              <img 
                src={coverImage}
                alt={invite.templateId}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">Template</span>
                  <h2 className="text-2xl font-serif italic mt-1 capitalize">{invite.templateId.replace(/-/g, ' ')}</h2>
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <span className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/30`}>
                  {invite.status}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-8">
              {/* Live Link Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block">Live Invitation Link</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 p-2 sm:p-1.5 rounded-3xl border border-iqBorder bg-iqBg/30">
                  <input
                    readOnly
                    value={inviteUrl}
                    className="flex-1 bg-transparent px-4 py-3 sm:py-2 text-[11px] sm:text-sm font-mono text-black outline-none truncate"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className={`rounded-2xl sm:rounded-xl px-5 py-3 sm:py-2.5 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                      copied ? 'bg-green-500 text-white' : 'bg-black text-white'
                    }`}
                  >
                    {copied ? '✓ Copied URL' : 'Copy Invitation Link'}
                  </button>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 py-8 border-y border-iqBorder text-black">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Date</span>
                  <p className="font-bold">{invite.heroData?.weddingDate} {invite.heroData?.weddingMonth} {invite.heroData?.weddingYear}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Time</span>
                  <p className="font-bold">{invite.heroData?.weddingTime || '09:00 AM - 10:30 AM'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Venue</span>
                  <p className="font-bold truncate">{invite.venueData?.mahalName || invite.venueData?.venueCity || 'Venue'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Gallery</span>
                  <p className="font-bold">{Boolean(invite.invitationData?.showGallery !== undefined ? invite.invitationData.showGallery : (invite.scheduleData?.showGallery ?? true)) ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Schedule</span>
                  <p className="font-bold">{Boolean(invite.invitationData?.showSchedule !== undefined ? invite.invitationData.showSchedule : (invite.scheduleData?.showSchedule ?? true)) ? `${invite.scheduleData?.items?.length || 0} Events` : 'Disabled'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">RSVP</span>
                  <p className="font-bold">{Boolean(invite.hasRsvp || invite.rsvpData?.enabled || invite.invitationData?.hasRsvp) ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>

              {/* Action Area */}
              <div className="space-y-4 pt-2">
                {/* Secondary Action Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/builder/${invite.templateId}?code=${invite.code}`)}
                    className="w-full rounded-full border border-neutral-200 bg-white py-3 px-4 text-xs font-bold uppercase tracking-wider text-neutral-800 transition hover:bg-neutral-50 hover:border-neutral-300 shadow-sm flex items-center justify-center gap-2"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full rounded-full bg-black py-3 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:opacity-90 flex items-center justify-center gap-2 active:scale-98"
                  >
                    Share on WhatsApp
                  </button>
                </div>

                {/* RSVP Dashboard Button - Only shown if user enabled RSVP during purchase */}
                {Boolean(invite.rsvpData?.enabled || invite.hasRsvp) && (
                  <div className="flex justify-center pt-1">
                    <button
                      onClick={() => navigate(`/templates/${invite.templateId}/${invite.code}/RSVP`)}
                      className="rounded-full border border-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-6 py-2 text-xs font-bold uppercase tracking-wider text-neutral-800 transition shadow-sm"
                    >
                      RSVP Dashboard
                    </button>
                  </div>
                )}
              </div>

              {/* View Live Invitation Link */}
              <div className="flex justify-center pt-2">
                <Link 
                  to={`/templates/${invite.templateId}/${invite.code}`}
                  target="_blank"
                  className="text-xs font-bold text-neutral-500 hover:text-black hover:underline transition-all"
                >
                  View Live Invitation
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
