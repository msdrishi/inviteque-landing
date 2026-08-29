export default function WelcomeNoteTab({ formData, handleFieldChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Welcome &amp; Invitation Message</h2>
        <p className="text-xs text-slate-400 font-medium">Calligraphy greeting and warm message inviting your loved ones.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Top Script Tag</label>
            <input
              type="text"
              value={formData.welcomeLabel || ''}
              onChange={(e) => handleFieldChange('welcomeLabel', e.target.value)}
              placeholder="Welcome"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Heading Line 1</label>
            <input
              type="text"
              value={formData.welcomeHeading1 || ''}
              onChange={(e) => handleFieldChange('welcomeHeading1', e.target.value)}
              placeholder="Dear Friends"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Heading Line 2</label>
            <input
              type="text"
              value={formData.welcomeHeading2 || ''}
              onChange={(e) => handleFieldChange('welcomeHeading2', e.target.value)}
              placeholder="& Family,"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Invitation Body Text</label>
          <textarea
            rows={5}
            value={formData.welcomeMessage || ''}
            onChange={(e) => handleFieldChange('welcomeMessage', e.target.value)}
            placeholder="Write your heartfelt invitation message here..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-slate-900 focus:bg-white transition resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
