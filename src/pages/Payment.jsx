import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useDraft } from '../context/DraftContext'
import { API_URL } from '../config'
import { uploadToCloudinary } from '../utils/cloudinary'
const logo = "/assets/logo/inviteq-watermark.png"
import { fadeUp } from '../motionVariants'
import { templates, houseWarmingTemplates } from '../templates/templates'
import royalPalaceMapping from '../royalPalaceCloudinaryMapping.json'
import everlastingVowsMapping from '../everlastingVowsCloudinaryMapping.json'
const themeImg = "/assets/brand/theme-preview.webp"

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { saveInvitation, user, loading: authLoading } = useAuth()
  const { draftData: contextDraft, updateDraft } = useDraft()

  // State hooks MUST be declared unconditionally at the very top of the component
  const [isProcessing, setIsProcessing] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  // Resolve draftData and templateId safely from location.state OR DraftContext
  // React Router location.state serialization drops File objects, so we merge them back from contextDraft
  const draftData = { 
    ...(location.state?.draftData || contextDraft || {}),
    _pendingPhotoFiles: contextDraft?._pendingPhotoFiles || location.state?.draftData?._pendingPhotoFiles || {},
    _pendingFamilyPhotoFile: contextDraft?._pendingFamilyPhotoFile || location.state?.draftData?._pendingFamilyPhotoFile || null
  }
  const templateId = location.state?.templateId || draftData?.templateId || new URLSearchParams(location.search).get('templateId') || 'twilight-serenade'

  // Get template details — search both wedding and house warming with safe fallback
  const template = templates.find(t => t.id === templateId) || 
                   houseWarmingTemplates.find(t => t.id === templateId) || 
                   templates.find(t => t.id === 'twilight-serenade') || 
                   templates[0]

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  const isSunflower = templateId === 'sunflower-fields'
  const isTwilight = templateId === 'template-2' || templateId === 'twilight-serenade'
  const isEverlasting = templateId === 'template-4' || templateId === 'everlasting-vows' || templateId === 'everlastingvows'
  const isRoyalPalace = templateId === 'template-3' || templateId === 'royal-palace'
  const isModernHearth = templateId === 'modernhearth' || templateId === 'modern-hearth' || templateId === 'house-warming-1'
  const isMidnightWaltz = templateId === 'midnight-waltz'
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
              : themeImg
  const headerGradient = isTwilight
    ? "from-[#2d3a28] via-[#3D5236] to-[#2d3a28]"
    : isEverlasting
      ? "from-[#705915] via-[#8A6E1E] to-[#705915]"
      : isRoyalPalace
        ? "from-[#5C0A14] via-[#8A6E1E] to-[#5C0A14]"
        : isModernHearth
          ? "from-[#4A2A0E] via-[#6B351D] to-[#4A2A0E]"
          : "from-[#5C0A14] via-[#7B0F1A] to-[#5C0A14]"

  const TEMPLATE_PRICE = 999 // Price in INR

  const isTemplatePaid = Boolean(
    String(draftData.status).toUpperCase() === 'PAID' || 
    draftData.isPaid === true ||
    (draftData.coupleData && draftData.coupleData.isPaid === true) ||
    Number(draftData.amountPaid) > 0
  )
  const wasRsvpPaid = Boolean(isTemplatePaid && (draftData.wasRsvpPaid || draftData.rsvpData?.enabled || draftData.invitationData?.hasRsvp))
  const wantsRsvp = Boolean(draftData.hasRsvp)

  // Is this an RSVP add-on upgrade for an invitation that was already paid?
  const isRsvpUpgrade = isTemplatePaid && wantsRsvp && !wasRsvpPaid
  const isAlreadyFullyPaid = isTemplatePaid && (!wantsRsvp || wasRsvpPaid)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iqBg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) return null

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      setCouponSuccess('')
      return
    }

    setIsValidatingCoupon(true)
    setCouponError('')
    setCouponSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ code: couponCode.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to validate coupon')
      }

      const data = await response.json()
      if (data.isValid || data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountPercentage: data.discountPercentage
        })
        setCouponSuccess(data.message || 'Coupon applied successfully!')
        setCouponError('')
      } else {
        setAppliedCoupon(null)
        setCouponError(data.message || 'Invalid coupon code.')
        setCouponSuccess('')
      }
    } catch (error) {
      console.error('Coupon validation error:', error)
      setCouponError('Error validating coupon. Please try again.')
      setCouponSuccess('')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponSuccess('')
    setCouponError('')
  }

  const templatePriceToCharge = isTemplatePaid ? 0 : TEMPLATE_PRICE
  const rsvpPriceToCharge = isTemplatePaid ? (isRsvpUpgrade ? 500 : 0) : (wantsRsvp ? 500 : 0)
  const BASE_TOTAL_PRICE = templatePriceToCharge + rsvpPriceToCharge
  const discount = appliedCoupon ? Number(((BASE_TOTAL_PRICE * appliedCoupon.discountPercentage) / 100).toFixed(2)) : 0
  const finalPrice = Number((BASE_TOTAL_PRICE - discount).toFixed(2))

  const handlePaymentClick = async () => {
    setIsProcessing(true)
    try {
      // Upload any pending local photos to Cloudinary before saving
      const resolvedPhotos = [...(draftData.photos || [null, null, null])]
      const pendingFiles = draftData._pendingPhotoFiles || {}

      const photoUploadPromises = Object.entries(pendingFiles).map(async ([index, file]) => {
        if (file && (file instanceof Blob || file instanceof File)) {
          const result = await uploadToCloudinary(file)
          if (result && result.url) {
            resolvedPhotos[Number(index)] = result.url
          }
        }
      })

      let resolvedFamilyPhoto = draftData.familyPhoto || null
      if (draftData._pendingFamilyPhotoFile && (draftData._pendingFamilyPhotoFile instanceof Blob || draftData._pendingFamilyPhotoFile instanceof File)) {
        const familyResult = await uploadToCloudinary(draftData._pendingFamilyPhotoFile)
        if (familyResult && familyResult.url) {
          resolvedFamilyPhoto = familyResult.url
        }
      }

      await Promise.all(photoUploadPromises)

      // Ensure any remaining local blob: URLs are cleared if not uploaded
      const finalPhotos = resolvedPhotos.map(p => (p && typeof p === 'string' && p.startsWith('blob:') ? null : p))
      const finalFamilyPhoto = resolvedFamilyPhoto && typeof resolvedFamilyPhoto === 'string' && resolvedFamilyPhoto.startsWith('blob:')
        ? null
        : resolvedFamilyPhoto

      // Use the resolved (uploaded) URLs for the rest of the flow
      const resolvedDraft = {
        ...draftData,
        photos: finalPhotos,
        familyPhoto: finalFamilyPhoto
      }
      delete resolvedDraft._pendingPhotoFiles
      delete resolvedDraft._pendingFamilyPhotoFile

      // Update draft context so state is synchronized with Cloudinary URLs
      updateDraft(resolvedDraft)

      // 1. Prepare backend request matching our JSONB columns
      const inviteRequest = {
        code: resolvedDraft.code, // VERY IMPORTANT: Pass code to update instead of creating new
        templateId,
        coupleData: {
          groomName: resolvedDraft.groomName,
          brideName: resolvedDraft.brideName,
          groomPhoto: resolvedDraft.groomPhoto,
          bridePhoto: resolvedDraft.bridePhoto
        },
        heroData: {
          groomName: resolvedDraft.groomName,
          brideName: resolvedDraft.brideName,
          weddingDate: resolvedDraft.weddingDate,
          weddingMonth: resolvedDraft.weddingMonth,
          weddingYear: resolvedDraft.weddingYear,
          weddingTime: resolvedDraft.weddingTime
        },
        venueData: {
          mahalName: resolvedDraft.mahalName,
          venueAddress: resolvedDraft.venueAddress,
          venueCity: resolvedDraft.venueCity,
          state: resolvedDraft.state,
          mapLink: resolvedDraft.mapLink
        },
        // Flat fields
        groomName: resolvedDraft.groomName,
        brideName: resolvedDraft.brideName,
        weddingDate: {
          day: resolvedDraft.weddingDate,
          month: resolvedDraft.weddingMonth,
          year: resolvedDraft.weddingYear
        },
        weddingTime: resolvedDraft.weddingTime,
        mahalName: resolvedDraft.mahalName,
        venueCity: resolvedDraft.venueCity,
        venueName: resolvedDraft.venueAddress,
        state: resolvedDraft.state,
        mapLink: resolvedDraft.mapLink,
        photos: resolvedDraft.photos,
        eventSchedule: resolvedDraft.scheduleItems,
        scheduleData: {
          showSchedule: resolvedDraft.showSchedule,
          showGallery: resolvedDraft.showGallery,
          items: resolvedDraft.scheduleItems
        },
        storyData: {
          photos: resolvedDraft.photos
        },
        invitationData: {
          showGallery: resolvedDraft.showGallery,
          showSchedule: resolvedDraft.showSchedule,
          hasRsvp: Boolean(resolvedDraft.hasRsvp),
          showFamilySection: resolvedDraft.showFamilySection,
          familyMessage: resolvedDraft.familyMessage,
          familyPhoto: resolvedDraft.familyPhoto,
          showCustomSection: resolvedDraft.showCustomSection,
          customSectionTitle: resolvedDraft.customSectionTitle,
          customSectionSubtitle: resolvedDraft.customSectionSubtitle,
          customSectionDate: resolvedDraft.customSectionDate,
          customSectionLocation: resolvedDraft.customSectionLocation,
          customSectionContent: resolvedDraft.customSectionContent,
          customSectionPosition: resolvedDraft.customSectionPosition
        },
        rsvpData: {
          enabled: Boolean(resolvedDraft.hasRsvp),
          allowGuestCount: true,
          allowEventSelection: true,
          allowMessage: true,
          allowMaybe: false,
        },
        status: isTemplatePaid ? 'PAID' : 'DRAFT', // Leave as draft until payment succeeds
        couponCode: appliedCoupon ? appliedCoupon.code : null
      }

      // Save invitation as draft first so backend has the row ready
      const savedInvite = await saveInvitation(inviteRequest)
      const inviteUrl = `${window.location.origin}/templates/${templateId}/${savedInvite.code}`

      // Update the inviteRequest with the newly saved ID and code to prevent duplicate creation on verification
      inviteRequest.id = savedInvite.id
      inviteRequest.code = savedInvite.code

      // If already fully paid and no RSVP upgrade is needed, bypass payment entirely
      if (isAlreadyFullyPaid) {
        navigate('/payment-confirmation', {
          state: {
            orderId: savedInvite.id,
            inviteUrl,
            draftData: resolvedDraft,
            template,
            amount: resolvedDraft.amountPaid || 0,
            code: savedInvite.code,
            isUpdate: true
          }
        })
        return
      }

      // If final price is 0 (e.g. 100% discount coupon applied), bypass Razorpay flow
      if (finalPrice <= 0) {
        const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            inviteCode: savedInvite.code,
            amountPaid: 0,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            inviteRequest: { ...inviteRequest, status: 'PAID', couponCode: appliedCoupon ? appliedCoupon.code : null }
          })
        })

        if (!verifyRes.ok) {
          const errData = await verifyRes.json().catch(() => ({}))
          throw new Error(errData.message || 'Failed to mark purchase as successful.')
        }

        navigate('/payment-confirmation', {
          state: {
            orderId: savedInvite.id,
            inviteUrl,
            draftData: resolvedDraft,
            template,
            amount: 0,
            code: savedInvite.code,
            isUpdate: isTemplatePaid
          }
        })
        return
      }

      // 2. Call backend to create Razorpay Order
      const orderRes = await fetch(`${API_URL}/api/payments/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          code: savedInvite.code,
          discountPercentage: appliedCoupon ? appliedCoupon.discountPercentage : null,
          amount: finalPrice
        })
      })

      if (!orderRes.ok) {
        throw new Error('Failed to create payment order.')
      }

      const orderData = await orderRes.json()

      // 3. Check if payments are enabled or bypassed
      if (!orderData.enabled) {
        // Payment is disabled/turned off -> Mark purchase as successful immediately
        const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            inviteCode: savedInvite.code,
            amountPaid: (draftData.amountPaid || 0) + finalPrice,
            inviteRequest: { ...inviteRequest, status: 'PAID' }
          })
        })

        if (!verifyRes.ok) {
          const errData = await verifyRes.json().catch(() => ({}))
          throw new Error(errData.message || 'Failed to mark purchase as successful.')
        }

        navigate('/payment-confirmation', {
          state: {
            orderId: savedInvite.id,
            inviteUrl,
            draftData: resolvedDraft,
            template,
            amount: finalPrice,
            code: savedInvite.code,
            isUpdate: isTemplatePaid
          }
        })
        return
      }

      // 4. Payments are enabled -> Load Razorpay SDK and open modal
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true)
            return
          }
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
      }

      const isLoaded = await loadRazorpay()
      if (!isLoaded) {
        alert('Failed to load payment gateway SDK. Please try again.')
        return
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'InviteQue',
        description: 'Wedding Invitation Purchase',
        image: logo,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setIsProcessing(true)
            const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
              },
              body: JSON.stringify({
                inviteCode: savedInvite.code,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amountPaid: finalPrice,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                inviteRequest: { ...inviteRequest, status: 'PAID', couponCode: appliedCoupon ? appliedCoupon.code : null }
              })
            })

            if (!verifyRes.ok) {
              const errData = await verifyRes.json().catch(() => ({}))
              throw new Error(errData.message || 'Payment verification failed.')
            }

            navigate('/payment-confirmation', {
              state: {
                orderId: savedInvite.id,
                inviteUrl,
                draftData: resolvedDraft,
                template,
                amount: finalPrice,
                code: savedInvite.code,
                isUpdate: isTemplatePaid
              }
            })
          } catch (err) {
            console.error('Verification error:', err)
            alert('Payment verification failed. Please try again or contact support.')
          } finally {
            setIsProcessing(false)
          }
        },
        prefill: {
          contact: user?.phoneNumber || '',
          email: user?.email || ''
        },
        theme: {
          color: '#0f172a'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error('Save error:', error)
      alert(error.message || 'Error saving invitation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-iqBg font-saas text-iqText flex flex-col">
      {/* Header */}
      <header className="border-b border-iqBorder bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" />
            <span className="text-sm md:text-lg font-bold">{isTemplatePaid ? 'Update' : 'Payment'}</span>
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
          {/* Summary Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {isAlreadyFullyPaid
                  ? 'Review Your Updates'
                  : isRsvpUpgrade
                    ? 'Upgrade with RSVP Add-on'
                    : 'Order Summary'}
              </h1>
              <p className="text-iqText/60">
                {isAlreadyFullyPaid
                  ? 'Confirm your updated wedding details before they go live'
                  : isRsvpUpgrade
                    ? 'Activate interactive RSVP tracking and guest management for your invitation'
                    : 'Review your invitation details and proceed to activate'}
              </p>
            </div>

            {/* Main Info Card */}
            <motion.div
              variants={fadeUp}
              className="rounded-[2.5rem] border border-iqBorder bg-white overflow-hidden shadow-luxury"
            >
              {/* Template Image / Header */}
              <div className={`h-40 md:h-52 overflow-hidden bg-gradient-to-br ${headerGradient} relative`}>
                <img
                  src={coverImage}
                  alt={template.name}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Template</span>
                    <h2 className="text-2xl font-serif italic mt-1">{template.name}</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-10 space-y-6">
                {/* Couple Summary */}
                <div className="space-y-4 pb-6 border-b border-iqBorder">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Couple</span>
                    <span className="font-bold text-lg">{draftData.groomName} & {draftData.brideName}</span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                    <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Date</span>
                    <span className="font-bold">{draftData.weddingDate} {draftData.weddingMonth} {draftData.weddingYear}</span>
                  </div>
                  {draftData.weddingTime && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Time</span>
                      <span className="font-bold">{draftData.weddingTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Venue</span>
                    <span className="font-bold text-right max-w-[200px]">{draftData.mahalName}</span>
                  </div>
                </div>

                {/* Feature Status */}
                <div className="grid grid-cols-3 gap-3 pb-6">
                  <div className="rounded-2xl bg-iqBg/50 p-3.5 border border-iqBorder text-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-iqText/40 block mb-1">Gallery</span>
                    <span className="text-xs font-bold">{draftData.showGallery ? '✅ Enabled' : '❌ Disabled'}</span>
                  </div>
                  <div className="rounded-2xl bg-iqBg/50 p-3.5 border border-iqBorder text-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-iqText/40 block mb-1">Schedule</span>
                    <span className="text-xs font-bold">{draftData.showSchedule ? '✅ Enabled' : '❌ Disabled'}</span>
                  </div>
                  <div className="rounded-2xl bg-iqBg/50 p-3.5 border border-iqBorder text-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-iqText/40 block mb-1">RSVP Subsystem</span>
                    <span className="text-xs font-bold">{draftData.hasRsvp ? '✅ Enabled' : '❌ Disabled'}</span>
                  </div>
                </div>

                {/* Coupon Code Input (if payment is due) */}
                {!isAlreadyFullyPaid && (
                  <div className="space-y-3 pt-4 border-t border-iqBorder">
                    <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Have a Coupon?</span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={appliedCoupon !== null || isValidatingCoupon}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold border border-iqBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-black disabled:bg-iqBg/50 w-full"
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="w-full sm:w-auto px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200 text-center"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isValidatingCoupon || !couponCode.trim()}
                          className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-black hover:opacity-90 rounded-xl transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                        >
                          {isValidatingCoupon ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            'Apply'
                          )}
                        </button>
                      )}
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 font-semibold animate-pulse">❌ {couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-xs text-green-600 font-semibold">🎉 {couponSuccess}</p>
                    )}
                  </div>
                )}

                {/* Price Breakdown */}
                {!isAlreadyFullyPaid ? (
                  <div className="space-y-3 pt-4 border-t border-iqBorder">
                    <div className="space-y-2 w-full text-sm text-iqText/70">
                      <div className="flex justify-between items-center">
                        <span>Template Design</span>
                        <span className="font-semibold text-iqText">
                          {isTemplatePaid ? (
                            <span className="text-emerald-700 font-bold">₹999 (Already Paid ✓)</span>
                          ) : (
                            `₹${TEMPLATE_PRICE}`
                          )}
                        </span>
                      </div>
                      {Boolean(draftData.hasRsvp) && (
                        <div className="flex justify-between items-center text-emerald-700 font-medium">
                          <span>RSVP &amp; Guest Management {isRsvpUpgrade ? 'Upgrade' : 'Add-on'}</span>
                          <span className="font-bold">+₹500</span>
                        </div>
                      )}
                      {appliedCoupon && (
                        <div className="flex justify-between items-center text-green-600 font-medium">
                          <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-end pt-3 border-t border-dashed border-iqBorder">
                      <span className="font-bold">{isRsvpUpgrade ? 'Total Due to Upgrade' : 'Total Amount'}</span>
                      <span className="text-3xl font-bold text-iqText">₹{finalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-iqText/40 text-center uppercase tracking-widest font-bold">Inclusive of all taxes</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-green-50 p-5 border border-green-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest block">Premium Status</span>
                      <span className="text-sm font-bold text-green-700">All features unlocked • Free unlimited edits</span>
                    </div>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">PAID</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              variants={fadeUp}
              className={`rounded-2xl p-6 space-y-3 ${isAlreadyFullyPaid ? 'bg-blue-50 border border-blue-100' : isRsvpUpgrade ? 'bg-amber-50 border border-amber-100' : 'bg-iqBg/50 border border-iqBorder'}`}
            >
              <h3 className={`font-bold text-sm ${isAlreadyFullyPaid ? 'text-blue-900' : isRsvpUpgrade ? 'text-amber-950' : 'text-iqText'}`}>
                {isAlreadyFullyPaid
                  ? '✨ Free Updates Enabled'
                  : isRsvpUpgrade
                    ? '🎉 RSVP Subsystem Activation'
                    : '🎁 What happens next?'}
              </h3>
              <p className={`text-xs leading-relaxed ${isAlreadyFullyPaid ? 'text-blue-800/70' : isRsvpUpgrade ? 'text-amber-900/80' : 'text-iqText/60'}`}>
                {isAlreadyFullyPaid
                  ? 'As a premium user, you can update your wedding details as many times as you like. Your live link will be refreshed instantly once you click update.'
                  : isRsvpUpgrade
                    ? 'By completing this ₹500 RSVP upgrade, the interactive RSVP section and your private RSVP dashboard will be enabled on your live wedding invitation!'
                    : 'After a successful payment, you will receive your unique digital invitation link. You can share this link with your guests instantly via WhatsApp or Email.'}
              </p>
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
              disabled={isProcessing}
              className={`flex-1 rounded-full bg-black py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  {isAlreadyFullyPaid ? (
                    <>
                      <span>💾</span>
                      Update Invitation
                    </>
                  ) : isRsvpUpgrade ? (
                    <>
                      <span>💳</span>
                      Pay ₹{finalPrice.toFixed(2)} &amp; Enable RSVP
                    </>
                  ) : (
                    <>
                      <span>💳</span>
                      Pay ₹{finalPrice.toFixed(2)}
                    </>
                  )}
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-iqBorder bg-white/80 backdrop-blur-md mt-auto">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-6 w-auto" loading="lazy" />
            <span className="font-parisienne text-xl font-normal text-iqText leading-none">Inviteque</span>
          </div>
          <span className="text-xs font-medium text-iqText/40">© {new Date().getFullYear()} Inviteque</span>
        </div>
      </footer>
    </div>
  )
}
