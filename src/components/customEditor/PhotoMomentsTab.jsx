export default function PhotoMomentsTab({ formData, handlePhotoUpload }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Postage Stamp Photo Moments</h2>
        <p className="text-xs text-slate-400 font-medium">Upload up to 3 portrait photos to display inside the vintage postage stamp deckle frames.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Photo Stamp #{idx + 1}
            </span>

            <div className="relative w-full aspect-[3/4] max-w-[200px] mx-auto rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shadow-sm flex items-center justify-center">
              {formData.photos?.[idx] ? (
                <img
                  src={formData.photos[idx]}
                  alt={`Moment ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400 font-medium">No Image</span>
              )}
            </div>

            <div>
              <label className="inline-block rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 cursor-pointer transition shadow-sm">
                Replace Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(idx, e)}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
