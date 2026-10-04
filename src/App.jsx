import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { DraftProvider } from './context/DraftContext.jsx'
import Landing from './pages/Landing.jsx'
import { API_URL } from './config'

// Lazy load major pages
const TemplateRoute = lazy(() => import('./pages/TemplateRoute.jsx'))
const Builder = lazy(() => import('./pages/Builder.jsx'))
const Payment = lazy(() => import('./pages/Payment.jsx'))
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Signup = lazy(() => import('./pages/Signup.jsx'))
const LoginSuccess = lazy(() => import('./pages/LoginSuccess.jsx'))
const Account = lazy(() => import('./pages/Account.jsx'))
const InviteDetails = lazy(() => import('./pages/InviteDetails.jsx'))
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))
const CustomerRsvpDashboard = lazy(() => import('./pages/CustomerRsvpDashboard.jsx'))
const CustomRsvpDashboard = lazy(() => import('./pages/CustomRsvpDashboard.jsx'))

// Custom client templates (Lazy loaded)
const CustomMidnightWaltzPavitraSri = lazy(() => import('./pages/custom/CustomMidnightWaltzPavitraSri.jsx'))
const CustomEverlastingVowsShradha = lazy(() => import('./pages/custom/CustomEverlastingVowsShradha.jsx'))
const CustomMidnightWaltzSharanRajAndShanteriyga = lazy(() => import('./pages/custom-orders/midnight-waltz/SharanRajAndShanteriyga/index.jsx'))
const CustomMidnightWaltzRanjithAndMylisha = lazy(() => import('./pages/custom-orders/midnight-waltz/RanjithAndMylisha/index.jsx'))
const CustomIndianReverieKirtiAndSahil = lazy(() => import('./pages/custom-orders/indian-reverie/KirtiAndSahil/index.jsx'))
const CustomRoyalHeirloomHemangAndJasmine = lazy(() => import('./pages/custom-orders/royal-heirloom/HemangAndJasmine/index.jsx'))
const CustomRoyalHeirloomRohitAndManpreet = lazy(() => import('./pages/custom-orders/royal-heirloom/RohitAndManpreet/index.jsx'))
const CustomRoyalHeirloomSaaranshAndStuti = lazy(() => import('./pages/custom-orders/royal-heirloom/SaaranshAndStuti/index.jsx'))
const CustomRoyalHeritageNaveenAndPreena = lazy(() => import('./pages/custom-orders/royal-heritage/NaveenAndPreena/index.jsx'))
const CustomPinkBlossomAlinaAndTanmay = lazy(() => import('./pages/custom-orders/pink-blossom/AlinaAndTanmay/index.jsx'))

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFCFB]">
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 rounded-full border-[3px] border-[#D4AF37]/20"></div>
      <div className="absolute inset-0 rounded-full border-t-[3px] border-[#D4AF37] animate-spin"></div>
    </div>
  </div>
)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
  }, [pathname])
  return null
}

function AnalyticsTracker() {
  const location = useLocation()
  useEffect(() => {
    const trackVisit = async () => {
      try {
        let templateId = null
        let inviteCode = null

        // Parse /template/:templateId or /templates/:templateId or custom routes
        const pathParts = location.pathname.split('/').filter(Boolean)
        if (pathParts[0] === 'templates' || pathParts[0] === 'template') {
          if (pathParts[1]) {
            templateId = pathParts[1]
          }
          if (pathParts[2]) {
            // Slug or code (e.g. 'Pavitra-Sri', 'Shradha', 'DEMO123')
            inviteCode = pathParts[2].toUpperCase()
            if (pathParts[3] && !['edit', 'rsvp', 'RSVP'].includes(pathParts[3])) {
              // Variant attached e.g. 'Pavitra-Sri-1'
              inviteCode = `${pathParts[2]}-${pathParts[3]}`.toUpperCase()
            }
          }
        } else if (pathParts[0] === 'builder' && pathParts[1]) {
          templateId = pathParts[1]
        }

        // Increment persistent local counter for invite views by code and pathname
        if (inviteCode) {
          try {
            const currentViews = parseInt(localStorage.getItem(`iq_views_${inviteCode}`) || '0', 10)
            localStorage.setItem(`iq_views_${inviteCode}`, String(currentViews + 1))
          } catch (e) {
            // Ignore localStorage errors
          }
        }
        try {
          const currentPathViews = parseInt(localStorage.getItem(`iq_views_path_${location.pathname}`) || '0', 10)
          localStorage.setItem(`iq_views_path_${location.pathname}`, String(currentPathViews + 1))
        } catch (e) { }

        await fetch(`${API_URL}/api/public/analytics/visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: location.pathname,
            templateId,
            inviteCode
          })
        })
      } catch (err) {
        console.error('Analytics tracking failed:', err)
      }
    }
    trackVisit()
  }, [location])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <DraftProvider>
        <ScrollToTop />
        <AnalyticsTracker />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/:code" element={<InviteDetails />} />
          <Route path="/account/:code/rsvp" element={<CustomerRsvpDashboard />} />
          <Route path="/builder/:templateId" element={<Builder />} />

          {/* Custom Client Template Routes (Pavitra & Sri) */}
          <Route path="/template/midnight-waltz/Pavitra-Sri" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/template/midnight-waltz/Pavitra-Sri/:variant" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/templates/midnight-waltz/Pavitra-Sri" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/templates/midnight-waltz/Pavitra-Sri/:variant" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/template/midnight-waltz/pavitra-sri" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/template/midnight-waltz/pavitra-sri/:variant" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/templates/midnight-waltz/pavitra-sri" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/templates/midnight-waltz/pavitra-sri/:variant" element={<CustomMidnightWaltzPavitraSri />} />

          {/* Custom Client Template Routes (Sharan Raj & Shanteriyga) */}
          <Route path="/template/midnight-waltz/SharanRajAndShanteriyga" element={<CustomMidnightWaltzSharanRajAndShanteriyga />} />
          <Route path="/templates/midnight-waltz/SharanRajAndShanteriyga" element={<CustomMidnightWaltzSharanRajAndShanteriyga />} />
          <Route path="/template/midnight-waltz/sharanrajandshanteriyga" element={<CustomMidnightWaltzSharanRajAndShanteriyga />} />
          <Route path="/templates/midnight-waltz/sharanrajandshanteriyga" element={<CustomMidnightWaltzSharanRajAndShanteriyga />} />

          {/* Custom Client Template Routes (Ranjith & Mylisha - Midnight Waltz) */}
          <Route path="/template/midnight-waltz/RanjithAndMylisha" element={<CustomMidnightWaltzRanjithAndMylisha />} />
          <Route path="/templates/midnight-waltz/RanjithAndMylisha" element={<CustomMidnightWaltzRanjithAndMylisha />} />
          <Route path="/template/midnight-waltz/ranjithandmylisha" element={<CustomMidnightWaltzRanjithAndMylisha />} />
          <Route path="/templates/midnight-waltz/ranjithandmylisha" element={<CustomMidnightWaltzRanjithAndMylisha />} />

          {/* Custom Client Template Routes (Shradha - Everlasting Vows Roka & Engagement) */}
          <Route path="/template/everlastingvows/Shradha" element={<CustomEverlastingVowsShradha />} />
          <Route path="/template/everlastingvows/Shradha/:variant" element={<CustomEverlastingVowsShradha />} />
          <Route path="/templates/everlastingvows/Shradha" element={<CustomEverlastingVowsShradha />} />
          <Route path="/templates/everlastingvows/Shradha/:variant" element={<CustomEverlastingVowsShradha />} />
          <Route path="/template/everlastingvows/shradha" element={<CustomEverlastingVowsShradha />} />
          <Route path="/template/everlastingvows/shradha/:variant" element={<CustomEverlastingVowsShradha />} />
          <Route path="/templates/everlastingvows/shradha" element={<CustomEverlastingVowsShradha />} />
          <Route path="/templates/everlastingvows/shradha/:variant" element={<CustomEverlastingVowsShradha />} />

          {/* Customer RSVP Dashboard Routes (Uppercase & Lowercase) */}
          <Route path="/templates/:templateId/:code/RSVP" element={<CustomerRsvpDashboard />} />
          <Route path="/templates/:templateId/:code/rsvp" element={<CustomerRsvpDashboard />} />
          <Route path="/template/:templateId/:code/RSVP" element={<CustomerRsvpDashboard />} />
          <Route path="/template/:templateId/:code/rsvp" element={<CustomerRsvpDashboard />} />

          {/* Custom Client Template Routes (Kirti & Sahil - Indian Reverie) */}
          <Route path="/template/indian-reverie/kirti-and-sahil" element={<CustomIndianReverieKirtiAndSahil />} />
          <Route path="/templates/indian-reverie/kirti-and-sahil" element={<CustomIndianReverieKirtiAndSahil />} />
          <Route path="/template/indian-reverie/H325KM" element={<CustomIndianReverieKirtiAndSahil />} />

          {/* Custom Client Template Routes (Rohit & Manpreet - Royal Heirloom) */}
          <Route path="/template/royal-heirloom/rohit-and-manpreet" element={<CustomRoyalHeirloomRohitAndManpreet />} />
          <Route path="/template/royal-heirloom/RohitAndManpreet" element={<CustomRoyalHeirloomRohitAndManpreet />} />
          <Route path="/template/royal-heirloom/rohit-and-manpreet/RSVP" element={<CustomRsvpDashboard weddingCode="ROHITMAN" coupleName="Rohit & Manpreet" />} />

          {/* Custom Client Template Routes (Hemang & Jasmine - Royal Heirloom) */}
          <Route path="/template/royal-heirloom/hemang-and-jasmine" element={<CustomRoyalHeirloomHemangAndJasmine />} />
          <Route path="/template/royal-heirloom/hemang-and-jasmine/:variant" element={<CustomRoyalHeirloomHemangAndJasmine />} />
          <Route path="/templates/royal-heirloom/hemang-and-jasmine" element={<CustomRoyalHeirloomHemangAndJasmine />} />
          <Route path="/templates/royal-heirloom/hemang-and-jasmine/:variant" element={<CustomRoyalHeirloomHemangAndJasmine />} />
          
          {/* Custom Client Template Routes (Saaransh & Stuti - Royal Heirloom) */}
          <Route path="/template/royal-heirloom/saaransh-and-stuti" element={<CustomRoyalHeirloomSaaranshAndStuti />} />
          <Route path="/template/royal-heirloom/saaransh-and-stuti/:variant" element={<CustomRoyalHeirloomSaaranshAndStuti />} />
          <Route path="/templates/royal-heirloom/saaransh-and-stuti" element={<CustomRoyalHeirloomSaaranshAndStuti />} />
          <Route path="/templates/royal-heirloom/saaransh-and-stuti/:variant" element={<CustomRoyalHeirloomSaaranshAndStuti />} />
          
          {/* Custom Client Template Routes (Naveen & Preena - Royal Heritage) */}
          <Route path="/template/royal-heritage/naveen-and-preena" element={<CustomRoyalHeritageNaveenAndPreena />} />
          <Route path="/templates/royal-heritage/naveen-and-preena" element={<CustomRoyalHeritageNaveenAndPreena />} />

          {/* Custom Client Template Routes (Alina & Tanmay - Pink Blossom) */}
          <Route path="/template/pink-blossom/alina-and-tanmay" element={<CustomPinkBlossomAlinaAndTanmay />} />
          <Route path="/templates/pink-blossom/alina-and-tanmay" element={<CustomPinkBlossomAlinaAndTanmay />} />
          
          {/* Standard & Multi-Link Templates */}
          <Route path="/templates/:templateId" element={<TemplateRoute />} />
          <Route path="/templates/:templateId/:code" element={<TemplateRoute />} />
          <Route path="/templates/:templateId/:code/:groupSlug" element={<TemplateRoute />} />
          <Route path="/template/:templateId" element={<TemplateRoute />} />
          <Route path="/template/:templateId/:code" element={<TemplateRoute />} />
          <Route path="/template/:templateId/:code/:groupSlug" element={<TemplateRoute />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />

          {/* Admin console routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </DraftProvider>
    </AuthProvider>
  )
}

