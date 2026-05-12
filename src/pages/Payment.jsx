import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/logo/logo-inviteque.png'
import { fadeUp } from '../motionVariants'
import { templates } from '../templates/templates'
import themeImg from '../assets/backgrounds/theme-image.png'

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { draftData, templateId } = location.state || {}

  // Get template details
  const template = templates.find(t => t.id === templateId)

  const TEMPLATE_PRICE = 999 // Price in INR

  if (!draftData || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iqBg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-iqText">Invalid Payment Session</h1>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const handlePaymentClick = () => {
    // Generate dummy order for now
    const orderId = 'ORD-' + Date.now()
    const inviteUrl = `${window.location.origin}/invite/${orderId}`
    navigate('/payment-confirmation', { 
      state: { 
        orderId, 
        inviteUrl, 
        draftData, 
        template,
        amount: TEMPLATE_PRICE
      } 
    })
  }

  return (
    <div className="min-h-screen bg-iqBg font-saas text-iqText flex flex-col">
      {/* Header */}
      <header className="border-b border-iqBorder bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-6 w-auto" />
            <span className="text-sm md:text-lg font-bold">Payment</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-iqText/60 hover:text-iqText transition-colors"
          >
            ← Back
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
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Summary</h1>
              <p className="text-iqText/60">Review your invitation details and proceed to payment</p>
            </div>

            {/* Template Preview Card */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-iqBorder bg-white overflow-hidden shadow-luxury"
            >
              {/* Template Image */}
              <div className="h-48 md:h-64 overflow-hidden bg-gradient-to-br from-[#5C0A14] via-[#7B0F1A] to-[#5C0A14]">
                <img 
                  src={themeImg}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8 space-y-4">
                {/* Template Name and Couple Details */}
                <div className="space-y-2 pb-4 border-b border-iqBorder">
                  <p className="text-xs font-bold uppercase tracking-wider text-iqText/60">Template</p>
                  <h2 className="text-2xl font-bold text-iqText">{template.name}</h2>
                  <p className="text-sm text-iqText/70">Couple: {draftData.groomName} & {draftData.brideName}</p>
                </div>

                {/* Couple Details */}
                <div className="space-y-4 border-b border-iqBorder pb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-iqText/60">Groom</span>
                    <span className="font-semibold">{draftData.groomName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-iqText/60">Bride</span>
                    <span className="font-semibold">{draftData.brideName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-iqText/60">Wedding Date</span>
                    <span className="font-semibold">{draftData.weddingDate} {draftData.weddingMonth} {draftData.weddingYear}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-iqText/60">Venue</span>
                    <span className="font-semibold text-right line-clamp-2">{draftData.venueAddress}</span>
                  </div>
                </div>

                {/* Optional Features */}
                <div className="space-y-3 pb-6 border-b border-iqBorder">
                  <p className="text-sm font-bold text-iqText/60 uppercase tracking-wider">Included Features</p>
                  <div className="space-y-2">
                    {draftData.showGallery && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Photo Gallery</span>
                      </div>
                    )}
                    {draftData.showSchedule && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Wedding Schedule ({draftData.scheduleItems.length} events)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Premium Digital Invitation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Unique URL (Valid for 6 months)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Watermark-Free Preview</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end border-t border-iqBorder pt-3">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-2xl font-bold text-iqText">₹{TEMPLATE_PRICE}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-blue-200 bg-blue-50 p-4 md:p-6 space-y-3"
            >
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <span className="text-lg">ℹ️</span>
                What You'll Get After Payment
              </h3>
              <ul className="space-y-2 text-sm text-blue-900/80">
                <li className="flex gap-2">
                  <span className="text-lg leading-none">→</span>
                  <span><strong>Unique Digital Invitation URL</strong> - Share with guests via WhatsApp, Email, or Social Media</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-lg leading-none">→</span>
                  <span><strong>No Watermark Preview</strong> - Your complete invitation without "Preview" watermark</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-lg leading-none">→</span>
                  <span><strong>6 Month Validity</strong> - Guests can access the invitation for 6 months from purchase</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-lg leading-none">→</span>
                  <span><strong>Edit Anytime</strong> - Update guest details even after purchase</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Payment Actions */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-iqBorder"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex-1 rounded-full border border-iqBorder bg-white py-4 text-sm font-bold text-iqText transition hover:bg-iqText/5"
            >
              Continue Editing
            </button>
            <button
              onClick={handlePaymentClick}
              className="flex-1 rounded-full bg-black py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 flex items-center justify-center gap-2"
            >
              <span>💳</span>
              Pay ₹{TEMPLATE_PRICE + Math.round(TEMPLATE_PRICE * 0.18)}
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-iqBorder bg-white/80 backdrop-blur-md mt-auto">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-6 w-auto" loading="lazy" />
            <span className="text-sm font-bold text-iqText">Inviteque</span>
          </div>
          <span className="text-xs font-medium text-iqText/40">© {new Date().getFullYear()} Inviteque</span>
        </div>
      </footer>
    </div>
  )
}
