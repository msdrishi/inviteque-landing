export default function CoupleHeroTab({ formData, handleFieldChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Couple &amp; Hero Entrance Section</h2>
        <p className="text-xs text-slate-400 font-medium">Names, ceremony date, and timings displayed on the cinematic title reveal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Groom's Name</label>
          <input
            type="text"
            value={formData.groomName || ''}
            onChange={(e) => handleFieldChange('groomName', e.target.value)}
            placeholder="Sri"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Bride's Name</label>
          <input
            type="text"
            value={formData.brideName || ''}
            onChange={(e) => handleFieldChange('brideName', e.target.value)}
            placeholder="Pavitra"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Ceremony Subtitle</label>
          <input
            type="text"
            value={formData.heroSubtitle || ''}
            onChange={(e) => handleFieldChange('heroSubtitle', e.target.value)}
            placeholder="Are Getting Married"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Marriage Timing Range</label>
          <input
            type="text"
            value={formData.weddingTime || ''}
            onChange={(e) => handleFieldChange('weddingTime', e.target.value)}
            placeholder="09:00 AM - 10:30 AM"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Wedding Date (Day, Month, Year)</label>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={formData.weddingDate || ''}
              onChange={(e) => handleFieldChange('weddingDate', e.target.value)}
              placeholder="15"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-center outline-none focus:border-slate-900 focus:bg-white"
            />
            <input
              type="text"
              value={formData.weddingMonth || ''}
              onChange={(e) => handleFieldChange('weddingMonth', e.target.value)}
              placeholder="July"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-center outline-none focus:border-slate-900 focus:bg-white"
            />
            <input
              type="text"
              value={formData.weddingYear || ''}
              onChange={(e) => handleFieldChange('weddingYear', e.target.value)}
              placeholder="2026"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-center outline-none focus:border-slate-900 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
