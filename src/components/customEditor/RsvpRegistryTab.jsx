export default function RsvpRegistryTab({ formData, handleFieldChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">RSVP &amp; Registry Suite</h2>
        <p className="text-xs text-slate-400 font-medium">Guest attendance confirmation card &amp; gift registry options.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* RSVP Card */}
        <div className="rounded-2xl border border-slate-200 p-5 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">RSVP Section</h3>
            <input
              type="checkbox"
              checked={Boolean(formData.hasRsvp !== false)}
              onChange={(e) => handleFieldChange('hasRsvp', e.target.checked)}
              className="h-4 w-4 rounded accent-black cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={formData.rsvpTitle || ''}
              onChange={(e) => handleFieldChange('rsvpTitle', e.target.value)}
              placeholder="RSVP"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
            />
            <textarea
              rows={2}
              value={formData.rsvpDescription || ''}
              onChange={(e) => handleFieldChange('rsvpDescription', e.target.value)}
              placeholder="Please let us know if you will be joining us by October 25, 2026."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-slate-900 resize-none"
            />
            <input
              type="text"
              value={formData.rsvpUrl || ''}
              onChange={(e) => handleFieldChange('rsvpUrl', e.target.value)}
              placeholder="https://forms.google.com or /templates/midnight-waltz/PAVITRASRI/RSVP"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
            />
          </div>
        </div>

        {/* Registry Card */}
        <div className="rounded-2xl border border-slate-200 p-5 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Registry Card</h3>
            <input
              type="checkbox"
              checked={Boolean(formData.hasRegistry)}
              onChange={(e) => handleFieldChange('hasRegistry', e.target.checked)}
              className="h-4 w-4 rounded accent-black cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={formData.registryTitle || ''}
              onChange={(e) => handleFieldChange('registryTitle', e.target.value)}
              placeholder="Gift Registry"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
            />
            <textarea
              rows={2}
              value={formData.registryDescription || ''}
              onChange={(e) => handleFieldChange('registryDescription', e.target.value)}
              placeholder="For loved ones who have asked, view our curated wedding wishlist."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-slate-900 resize-none"
            />
            <input
              type="text"
              value={formData.registryUrl || ''}
              onChange={(e) => handleFieldChange('registryUrl', e.target.value)}
              placeholder="https://www.amazon.com/wedding"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
