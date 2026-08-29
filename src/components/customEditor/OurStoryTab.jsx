export default function OurStoryTab({ formData, handleFieldChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Our Story Section</h2>
        <p className="text-xs text-slate-400 font-medium">Romantic heading, paragraphs, and quote shown below the Hero section.</p>
      </div>

      <div className="space-y-4">
        {/* Section Label */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Section Label</label>
          <input
            type="text"
            value={formData.storySectionLabel ?? 'Our Story'}
            onChange={(e) => handleFieldChange('storySectionLabel', e.target.value)}
            placeholder="Our Story"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>

        {/* Story Heading */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Story Heading / Title</label>
          <input
            type="text"
            value={formData.storyHeading ?? 'From A Chance Encounter to Forever'}
            onChange={(e) => handleFieldChange('storyHeading', e.target.value)}
            placeholder="From A Chance Encounter to Forever"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>

        {/* Paragraph 1 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Story Paragraph 1</label>
          <textarea
            rows={4}
            value={formData.storyParagraph1 ?? ''}
            onChange={(e) => handleFieldChange('storyParagraph1', e.target.value)}
            placeholder="What began as a simple conversation blossomed into a connection that felt like coming home..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-slate-900 focus:bg-white transition resize-none leading-relaxed"
          />
        </div>

        {/* Paragraph 2 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Story Paragraph 2</label>
          <textarea
            rows={4}
            value={formData.storyParagraph2 ?? ''}
            onChange={(e) => handleFieldChange('storyParagraph2', e.target.value)}
            placeholder="With the blessings of our parents and surrounded by the love of family and friends..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-slate-900 focus:bg-white transition resize-none leading-relaxed"
          />
        </div>

        {/* Story Quote */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Romantic Closing Quote</label>
          <input
            type="text"
            value={formData.storyQuote ?? '“In your arms, I have found my forever home and love.”'}
            onChange={(e) => handleFieldChange('storyQuote', e.target.value)}
            placeholder="“In your arms, I have found my forever home and love.”"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>
      </div>
    </div>
  )
}

