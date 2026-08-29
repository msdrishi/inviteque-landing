export default function SectionTogglesTab({ formData, handleSectionToggle }) {
  const sectionsList = [
    { key: 'showHero', label: '1. Hero Entrance Section' },
    { key: 'showStory', label: '2. Our Story Section' },
    { key: 'showGallery', label: '3. Postage Stamp Photo Gallery' },
    { key: 'showWelcome', label: '4. Welcome Invitation Note' },
    { key: 'showVenue', label: '5. Multi-Event Venues & Map' },
    { key: 'showCountdown', label: '6. Live Countdown Clock' },
    { key: 'hasRsvp', label: '7. RSVP & Registry Block' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Modular Section Visibility</h2>
        <p className="text-xs text-slate-400 font-medium">Turn specific sections on or off to match your preference.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sectionsList.map(sec => (
          <label
            key={sec.key}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition"
          >
            <span className="text-xs font-bold text-slate-800">{sec.label}</span>
            <input
              type="checkbox"
              checked={formData.sections?.[sec.key] !== false}
              onChange={() => handleSectionToggle(sec.key)}
              className="h-5 w-5 rounded accent-emerald-600 cursor-pointer"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
