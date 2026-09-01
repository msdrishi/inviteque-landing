export default function CoupleHeroTab({ formData, handleFieldChange }) {
  // Convert current weddingDate, weddingMonth, weddingYear to YYYY-MM-DD for datepicker
  const calendarValue = (() => {
    const raw = formData.countdownTargetDate
    if (raw && typeof raw === 'string' && raw.includes('-')) {
      const parts = raw.split('-')
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10)
        if (y >= 2000 && y <= 2100) {
          return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
        }
      }
    }
    const year = formData.weddingYear && !isNaN(parseInt(formData.weddingYear)) && parseInt(formData.weddingYear) >= 2000 && parseInt(formData.weddingYear) <= 2100 ? String(formData.weddingYear) : '2026'
    const day = String(formData.weddingDate || '15').padStart(2, '0')
    const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"]
    const mIdx = monthNames.findIndex(m => m.startsWith(String(formData.weddingMonth || 'november').toLowerCase().slice(0, 3)))
    const month = String(mIdx !== -1 ? mIdx + 1 : 11).padStart(2, '0')
    return `${year}-${month}-${day}`
  })()

  const handleCalendarChange = (e) => {
    const val = e.target.value // "YYYY-MM-DD"
    if (!val || !val.includes('-')) return

    const [y, m, d] = val.split('-').map(Number)
    if (y < 2000 || y > 2100 || isNaN(y) || isNaN(m) || isNaN(d)) return

    const selectedDate = new Date(y, m - 1, d)

    if (!isNaN(selectedDate.getTime())) {
      const dayNum = String(d)
      const monthName = selectedDate.toLocaleString('en-US', { month: 'long' })
      const yearNum = String(y)
      const weekday = selectedDate.toLocaleString('en-US', { weekday: 'long' })

      handleFieldChange('weddingDate', dayNum)
      handleFieldChange('weddingMonth', monthName)
      handleFieldChange('weddingYear', yearNum)
      handleFieldChange('dayOfWeek', weekday)
      handleFieldChange('countdownTargetDate', val)
    }
  }

  // Calculate formatted preview
  const formattedPreview = (() => {
    try {
      let year = formData.weddingYear
      let day = formData.weddingDate || '12'
      let month = formData.weddingMonth || 'November'

      const yNum = parseInt(year, 10)
      if (isNaN(yNum) || yNum < 2000 || yNum > 2100) {
        year = '2026'
      }

      const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"]
      const mIdx = monthNames.findIndex(m => m.startsWith(String(month || 'november').toLowerCase().slice(0, 3)))
      const dNum = parseInt(day, 10)

      const d = new Date(parseInt(year, 10), mIdx !== -1 ? mIdx : 10, !isNaN(dNum) ? dNum : 12)
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      }
    } catch {}
    return 'Thursday, 12 November 2026'
  })()

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

        {/* Dynamic Interactive Calendar Date Picker */}
        <div className="sm:col-span-2 space-y-2 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <span>📅</span> Select Wedding Date (Calendar Picker)
            </label>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              {formattedPreview}
            </span>
          </div>

          <input
            type="date"
            value={calendarValue}
            onChange={handleCalendarChange}
            className="w-full rounded-xl border border-amber-300/80 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
