export default function MultiEventsTab({
  formData,
  handleAddEvent,
  handleDuplicateEvent,
  handleDeleteEvent,
  handleEventChange
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Multi-Event Ceremonies Manager</h2>
          <p className="text-xs text-slate-400 font-medium">Add, edit, duplicate, or reorder ceremonies (Haldi, Mehendi, Wedding, Reception).</p>
        </div>
        <button
          type="button"
          onClick={handleAddEvent}
          className="rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-3.5 py-2 shadow-sm transition"
        >
          + Add Ceremony
        </button>
      </div>

      <div className="space-y-5">
        {formData.events?.map((event, idx) => (
          <div key={event.id || idx} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                Ceremony #{idx + 1}: {event.eventName || event.label}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDuplicateEvent(idx)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  Duplicate
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(idx)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Ceremony Title</label>
                <input
                  type="text"
                  value={event.eventName || ''}
                  onChange={(e) => handleEventChange(idx, 'eventName', e.target.value)}
                  placeholder="e.g. Haldi Ceremony"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Time Range</label>
                <input
                  type="text"
                  value={event.time || ''}
                  onChange={(e) => handleEventChange(idx, 'time', e.target.value)}
                  placeholder="10:00 AM - 01:00 PM"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Date String</label>
                <input
                  type="text"
                  value={event.date || ''}
                  onChange={(e) => handleEventChange(idx, 'date', e.target.value)}
                  placeholder="15 July 2026"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Venue / Hall Name</label>
                <input
                  type="text"
                  value={event.venueName || ''}
                  onChange={(e) => handleEventChange(idx, 'venueName', e.target.value)}
                  placeholder="The Leela Palace"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Street Address</label>
                <input
                  type="text"
                  value={event.venueLine1 || ''}
                  onChange={(e) => handleEventChange(idx, 'venueLine1', e.target.value)}
                  placeholder="23 Old Airport Road"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">City &amp; State</label>
                <input
                  type="text"
                  value={event.venueLine2 || ''}
                  onChange={(e) => handleEventChange(idx, 'venueLine2', e.target.value)}
                  placeholder="Bangalore, Karnataka"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Google Maps URL</label>
                <input
                  type="text"
                  value={event.mapUrl || ''}
                  onChange={(e) => handleEventChange(idx, 'mapUrl', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
