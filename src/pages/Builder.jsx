import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo/logo-inviteque.png'
import { useDraft } from '../context/DraftContext'
import { templates } from '../templates/templates'

export default function Builder() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const { draftData, updateDraft } = useDraft()
  const [step, setStep] = useState(1)
  const [showMapTooltip, setShowMapTooltip] = useState(false)

  // Get template details
  const template = templates.find(t => t.id === templateId)

  // Initialize with draft data
  const [formData, setFormData] = useState({
    ...draftData,
    groomName: draftData.groomName || '',
    brideName: draftData.brideName || '',
    weddingDate: draftData.weddingDate || '',
    weddingMonth: draftData.weddingMonth || '',
    weddingYear: draftData.weddingYear || '',
    mahalName: draftData.mahalName || '',
    venueAddress: draftData.venueAddress || '',
    venueCity: draftData.venueCity || '',
    state: draftData.state || '',
    mapLink: draftData.mapLink || '',
    showGallery: draftData.showGallery || false,
    showSchedule: draftData.showSchedule || false,
    photos: draftData.photos || [null, null, null],
    scheduleItems: draftData.scheduleItems || [
      { time: '11:00 AM', title: 'Haldi Ceremony' },
      { time: '04:00 PM', title: 'Wedding Vows' },
      { time: '07:00 PM', title: 'Grand Reception' }
    ]
  })
  const [errors, setErrors] = useState({})

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.groomName?.trim()) newErrors.groomName = 'Groom\'s name is required'
    if (!formData.brideName?.trim()) newErrors.brideName = 'Bride\'s name is required'
    if (!formData.weddingDate?.trim()) newErrors.weddingDate = 'Day is required'
    if (!formData.weddingMonth?.trim()) newErrors.weddingMonth = 'Month is required'
    if (!formData.weddingYear?.trim()) newErrors.weddingYear = 'Year is required'
    if (!formData.mahalName?.trim()) newErrors.mahalName = 'Mahal name is required'
    if (!formData.venueAddress?.trim()) newErrors.venueAddress = 'Venue address is required'
    if (!formData.state?.trim()) newErrors.state = 'State is required'
    if (!formData.mapLink?.trim()) newErrors.mapLink = 'Google Maps link is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      return
    }
    nextStep()
  }

  const handleFileChange = (index, e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newPhotos = [...(formData.photos || [null, null, null])]
        newPhotos[index] = event.target?.result
        setFormData(prev => ({ ...prev, photos: newPhotos }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleScheduleChange = (index, field, value) => {
    const newItems = [...formData.scheduleItems]
    newItems[index][field] = value
    setFormData({ ...formData, scheduleItems: newItems })
  }

  const handleAddScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      scheduleItems: [...prev.scheduleItems, { time: '', title: '' }]
    }))
  }

  const handleDeleteScheduleItem = (index) => {
    // Prevent deleting mandatory first three events
    if (index < 3) return
    setFormData(prev => ({
      ...prev,
      scheduleItems: prev.scheduleItems.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    updateDraft(formData)
    navigate(`/templates/${templateId}?preview=true`)
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-saas text-iqText flex flex-col">
      {/* Header */}
      <header className="border-b border-iqBorder bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 min-w-0">
            <img src={logo} alt="Inviteque" className="h-6 w-auto flex-shrink-0" />
            <span className="text-sm md:text-lg font-bold hidden sm:inline">Builder</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium overflow-x-auto">
            <span className={step >= 1 ? 'text-iqText' : 'text-iqText/30'}>Details</span>
            <div className="h-px w-2 md:w-4 bg-iqText/20 flex-shrink-0" />
            <span className={step >= 2 ? 'text-iqText' : 'text-iqText/30'}>Personalize</span>
            <div className="h-px w-2 md:w-4 bg-iqText/20 flex-shrink-0" />
            <span className={step >= 3 ? 'text-iqText' : 'text-iqText/30'}>Review</span>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-8 md:py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">Step 01</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Essential Details</h2>
                  <p className="text-sm md:text-base text-iqText/60">These details are mandatory for your {template?.name || 'invitation'}.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Groom's Name <span className="text-red-500">*</span></label>
                    <input
                      name="groomName"
                      value={formData.groomName}
                      onChange={handleChange}
                      placeholder="Enter groom's name"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.groomName
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.groomName && <p className="text-xs text-red-500">{errors.groomName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Bride's Name <span className="text-red-500">*</span></label>
                    <input
                      name="brideName"
                      value={formData.brideName}
                      onChange={handleChange}
                      placeholder="Enter bride's name"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.brideName
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.brideName && <p className="text-xs text-red-500">{errors.brideName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Day <span className="text-red-500">*</span></label>
                    <input
                      name="weddingDate"
                      value={formData.weddingDate}
                      onChange={handleChange}
                      placeholder="18"
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors ${errors.weddingDate
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.weddingDate && <p className="text-xs text-red-500">{errors.weddingDate}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Month <span className="text-red-500">*</span></label>
                    <input
                      name="weddingMonth"
                      value={formData.weddingMonth}
                      onChange={handleChange}
                      placeholder="August"
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors ${errors.weddingMonth
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.weddingMonth && <p className="text-xs text-red-500">{errors.weddingMonth}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Year <span className="text-red-500">*</span></label>
                    <input
                      name="weddingYear"
                      value={formData.weddingYear}
                      onChange={handleChange}
                      placeholder="2026"
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors ${errors.weddingYear
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.weddingYear && <p className="text-xs text-red-500">{errors.weddingYear}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Name of Mahal <span className="text-red-500">*</span></label>
                    <input
                      name="mahalName"
                      value={formData.mahalName}
                      onChange={handleChange}
                      placeholder="Enter the Mahal name"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.mahalName
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.mahalName && <p className="text-xs text-red-500">{errors.mahalName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Venue Address (Street / Area) <span className="text-red-500">*</span></label>
                    <input
                      name="venueAddress"
                      value={formData.venueAddress}
                      onChange={handleChange}
                      placeholder="Enter street or area..."
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.venueAddress
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.venueAddress && <p className="text-xs text-red-500">{errors.venueAddress}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">City</label>
                    <input
                      name="venueCity"
                      value={formData.venueCity}
                      onChange={handleChange}
                      placeholder="Enter city (e.g. Bangalore)"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.venueCity
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">State <span className="text-red-500">*</span></label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter the State"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.state
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-50">Google Map Link <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2">
                    <input
                      name="mapLink"
                      value={formData.mapLink}
                      onChange={handleChange}
                      placeholder="https://goo.gl/maps/..."
                      className={`flex-1 rounded-xl border px-4 py-3 outline-none transition-colors text-sm ${errors.mapLink
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowMapTooltip(true)}
                        onMouseLeave={() => setShowMapTooltip(false)}
                        className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-iqBg text-iqText/60 hover:bg-iqText/10 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                      </button>
                      {showMapTooltip && (
                        <div className="absolute top-12 right-0 bg-black text-white text-xs rounded-lg p-3 whitespace-normal z-50 w-56 space-y-2">
                          <p className="font-semibold">How to get the Google Maps link:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Open Google Maps</li>
                            <li>Search or navigate to your venue location</li>
                            <li>Right-click on the exact location pin</li>
                            <li>Click "What's here?"</li>
                            <li>Copy the link from the address bar</li>
                            <li>Paste it above</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.mapLink && <p className="text-xs text-red-500">{errors.mapLink}</p>}
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 rounded-full border border-iqBorder py-3 md:py-4 text-sm font-bold transition hover:bg-iqText/5"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-[2] rounded-full bg-black py-3 md:py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90"
                  >
                    Continue to Personalize
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">Step 02</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Add Magic</h2>
                  <p className="text-sm md:text-base text-iqText/60">Choose your optional sections and fill their details.</p>
                </div>

                <div className="space-y-6">
                  {/* Photo Gallery Option */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer rounded-2xl border border-iqBorder bg-white p-4 md:p-5 transition-all hover:shadow-md">
                      <input
                        type="checkbox"
                        name="showGallery"
                        checked={formData.showGallery}
                        onChange={handleChange}
                        className="h-5 w-5 rounded accent-black flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-base md:text-lg">Photo Gallery</p>
                        <p className="text-xs text-iqText/50">Showcase your pre-wedding shoot.</p>
                      </div>
                    </label>

                    {formData.showGallery && (
                      <div className="ml-0 md:ml-9 space-y-4 rounded-2xl border border-dashed border-iqBorder p-4 md:p-6 bg-iqBg/30">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-50">Upload 3 Photos (Mandatory)</p>
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                          {[0, 1, 2].map(i => (
                            <label key={i} className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-iqBorder bg-white transition-all hover:border-iqText">
                              {formData.photos?.[i] ? (
                                <img src={formData.photos[i]} alt={`photo-${i}`} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-iqText/20 transition-colors group-hover:text-iqText">
                                  <span className="text-2xl md:text-3xl">+</span>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(i, e)}
                              />
                            </label>
                          ))}
                        </div>
                        <p className="text-[10px] text-iqText/40 italic">* These photos will be displayed in a cinematic grid.</p>
                      </div>
                    )}
                  </div>

                  {/* Wedding Schedule Option */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer rounded-2xl border border-iqBorder bg-white p-4 md:p-5 transition-all hover:shadow-md">
                      <input
                        type="checkbox"
                        name="showSchedule"
                        checked={formData.showSchedule}
                        onChange={handleChange}
                        className="h-5 w-5 rounded accent-black flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-base md:text-lg">Wedding Schedule</p>
                        <p className="text-xs text-iqText/50">List your ceremony timelines.</p>
                      </div>
                    </label>

                    {formData.showSchedule && (
                      <div className="ml-0 md:ml-9 space-y-3 md:space-y-4">
                        {formData.scheduleItems.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-iqBorder bg-white p-3 md:p-4 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex-shrink-0 rounded-lg bg-iqBg p-2 text-[10px] font-bold uppercase tracking-tighter text-iqText/40 whitespace-nowrap">
                              Event {idx + 1}
                            </div>
                            <input
                              placeholder="Time (e.g. 11:00 AM)"
                              value={item.time}
                              onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                              className="w-full sm:w-32 rounded-lg border border-iqBorder bg-transparent px-2 py-2 text-sm font-semibold outline-none focus:ring-0 focus:border-iqText transition-colors"
                            />
                            <div className="hidden sm:block h-4 w-px bg-iqBorder" />
                            <input
                              placeholder="Event Name"
                              value={item.title}
                              onChange={(e) => handleScheduleChange(idx, 'title', e.target.value)}
                              className="flex-1 rounded-lg border border-iqBorder bg-transparent px-2 py-2 text-sm outline-none focus:ring-0 focus:border-iqText transition-colors"
                            />
                            {idx > 2 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteScheduleItem(idx)}
                                className="flex-shrink-0 text-iqText/50 hover:text-red-500 transition-colors text-sm font-semibold"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddScheduleItem}
                          className="w-full rounded-lg border-2 border-dashed border-iqBorder py-3 text-sm font-bold text-iqText/60 hover:text-iqText hover:border-iqText transition-colors"
                        >
                          + Add More Event
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 rounded-full border border-iqBorder py-3 md:py-4 text-sm font-bold transition hover:bg-iqText/5"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] rounded-full bg-black py-3 md:py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90"
                  >
                    Review My Invitation
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold">Ready for Preview?</h2>
                <p className="text-sm md:text-base text-iqText/60">You've successfully customized your {template?.name || 'invitation'}. Click below to see how it looks!</p>

                <div className="rounded-2xl border border-iqBorder bg-white p-4 md:p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-50">Template</span>
                    <span className="font-bold">{template?.name || templateId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-50">Couple</span>
                    <span className="font-bold">{formData.groomName} & {formData.brideName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-50">Date</span>
                    <span className="font-bold">{formData.weddingDate} {formData.weddingMonth} {formData.weddingYear}</span>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 rounded-full border border-iqBorder py-3 md:py-4 text-sm font-bold transition hover:bg-iqText/5"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] rounded-full bg-black py-3 md:py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90"
                  >
                    View Preview
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </main>

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
