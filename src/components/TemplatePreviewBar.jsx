import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Universal preview action bar for wedding templates when in custom preview mode (isCustomPreview === true).
 * Renders both mobile bottom bar and desktop bottom-right floating pill.
 */
export default function TemplatePreviewBar({
  templateId,
  draftData,
  primaryColor = '#000000',
  textColor = '#FFFFFF',
}) {
  const navigate = useNavigate()
  const resolvedTemplateId = templateId || draftData?.templateId || 'twilight-serenade'

  const handleBackToEdit = () => {
    navigate(`/builder/${resolvedTemplateId}?step=4`, { state: { step: 4 } })
  }

  const handleProceedToPayment = () => {
    navigate(`/payment?templateId=${encodeURIComponent(resolvedTemplateId)}`, {
      state: {
        draftData: {
          ...draftData,
          templateId: resolvedTemplateId,
        },
        templateId: resolvedTemplateId,
      },
    })
  }

  return (
    <>
      {/* Mobile Floating Bottom Bar */}
      <div className="lg:hidden fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 px-6 w-full max-w-[400px]">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBackToEdit}
            className="flex-1 flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white/95 backdrop-blur-md py-3.5 text-sm font-bold text-neutral-800 shadow-xl hover:scale-105 active:scale-95 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleProceedToPayment}
            style={{ backgroundColor: primaryColor, color: textColor }}
            className="flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition"
          >
            Proceed
          </button>
        </div>
      </div>

      {/* Desktop Floating Bottom-Right Controls */}
      <div className="hidden lg:flex fixed bottom-8 right-8 z-[110] gap-4">
        <button
          type="button"
          onClick={handleBackToEdit}
          className="px-8 py-3.5 rounded-full border border-neutral-300 bg-white/95 backdrop-blur-md text-sm font-bold text-neutral-800 shadow-xl hover:scale-105 active:scale-95 transition"
        >
          ← Back to Edit
        </button>
        <button
          type="button"
          onClick={handleProceedToPayment}
          style={{ backgroundColor: primaryColor, color: textColor }}
          className="px-10 py-3.5 rounded-full text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition"
        >
          Proceed →
        </button>
      </div>
    </>
  )
}

