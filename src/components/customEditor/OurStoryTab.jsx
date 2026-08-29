export default function OurStoryTab({ formData, handleFieldChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Our Story Section</h2>
        <p className="text-xs text-slate-400 font-medium">Romantic quote and story paragraph shown below the Hero section.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Story Quote</label>
          <input
            type="text"
            value={formData.storyQuote || ''}
            onChange={(e) => handleFieldChange('storyQuote', e.target.value)}
            placeholder='"Two lives, one shared dream..."'
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Story Message Paragraph</label>
          <textarea
            rows={5}
            value={formData.storyMessage || ''}
            onChange={(e) => handleFieldChange('storyMessage', e.target.value)}
            placeholder="Tell your guests how your love story began..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-slate-900 focus:bg-white transition resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
