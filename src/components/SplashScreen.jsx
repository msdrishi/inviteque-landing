const logo = "/assets/logo/inviteq-logo.png"

export default function SplashScreen({ loading = true }) {
  if (!loading) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FDFCFB] transition-opacity duration-500 ease-in-out"
      style={{ 
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? 'all' : 'none'
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Circular Loading Halo around Logo */}
        <div className="relative h-15 w-15 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[5px] border-[#D4AF37]/10"></div>
          <div className="absolute inset-0 rounded-full border-t-[5px] border-[#D4AF37] animate-spin"></div>

          <img
            src={logo}
            alt="Inviteque"
            className="h-14 w-14 object-contain rounded-full relative z-10"
          />
        </div>

        {/* Premium Text under Logo */}
        <div className="mt-2 text-center">
          <h2 className="font-parisienne text-2xl font-normal text-iqText opacity-80">Inviteque</h2>
        </div>
      </div>

      {/* Decorative corner accents */}
      <div className="fixed top-10 left-10 h-16 w-16 border-t border-l border-[#D4AF37]/10 rounded-tl-2xl"></div>
      <div className="fixed bottom-10 right-10 h-16 w-16 border-b border-r border-[#D4AF37]/10 rounded-br-2xl"></div>
    </div>
  )
}
