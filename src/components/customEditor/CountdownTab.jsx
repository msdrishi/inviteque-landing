export default function CountdownTab({ formData, handleFieldChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Live Countdown Timer</h2>
        <p className="text-xs text-slate-400 font-medium">Set the target date for the live countdown clock.</p>
      </div>

      <div className="space-y-4 max-w-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Target Wedding Date (YYYY-MM-DD)</label>
          <input
            type="date"
            value={formData.countdownTargetDate || ''}
            onChange={(e) => handleFieldChange('countdownTargetDate', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>
      </div>
    </div>
  )
}
