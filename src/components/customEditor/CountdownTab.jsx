export default function CountdownTab({ formData, handleFieldChange }) {
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

  const handleDateChange = (e) => {
    const val = e.target.value // Format: YYYY-MM-DD
    if (!val || !val.includes('-')) return
    const [y, m, d] = val.split('-').map(Number)
    if (y < 2000 || y > 2100 || isNaN(y) || isNaN(m) || isNaN(d)) return

    const selectedDate = new Date(y, m - 1, d)
    if (!isNaN(selectedDate.getTime())) {
      handleFieldChange('countdownTargetDate', val)
      handleFieldChange('weddingDate', String(d))
      handleFieldChange('weddingMonth', selectedDate.toLocaleString('en-US', { month: 'long' }))
      handleFieldChange('weddingYear', String(y))
      handleFieldChange('dayOfWeek', selectedDate.toLocaleString('en-US', { weekday: 'long' }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Live Countdown Timer</h2>
        <p className="text-xs text-slate-400 font-medium">Set the target date for the live countdown clock.</p>
      </div>

      <div className="space-y-4 max-w-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Target Wedding Date (Calendar Picker)</label>
          <input
            type="date"
            value={calendarValue}
            onChange={handleDateChange}
            className="w-full rounded-xl border border-amber-300/80 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
