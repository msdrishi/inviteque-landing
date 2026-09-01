import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { DraftProvider } from './context/DraftContext.jsx'
import Landing from './pages/Landing.jsx'
import TemplateRoute from './pages/TemplateRoute.jsx'
import Builder from './pages/Builder.jsx'
import Payment from './pages/Payment.jsx'
import PaymentConfirmation from './pages/PaymentConfirmation.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import LoginSuccess from './pages/LoginSuccess.jsx'
import Account from './pages/Account.jsx'
import InviteDetails from './pages/InviteDetails.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CustomerRsvpDashboard from './pages/CustomerRsvpDashboard.jsx'
import CustomMidnightWaltzPavitraSri from './pages/custom/CustomMidnightWaltzPavitraSri.jsx'
import CustomEverlastingVowsShradha from './pages/custom/CustomEverlastingVowsShradha.jsx'
import CustomTemplateEditor from './pages/custom/CustomTemplateEditor.jsx'
import { API_URL } from './config'

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
        } catch (e) {}
        
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
          <Route path="/template/midnight-waltz/Pavitra-Sri/:variant/edit" element={<CustomTemplateEditor />} />
          <Route path="/template/midnight-waltz/Pavitra-Sri/edit" element={<CustomTemplateEditor />} />
          <Route path="/templates/midnight-waltz/Pavitra-Sri/:variant/edit" element={<CustomTemplateEditor />} />
          <Route path="/templates/midnight-waltz/Pavitra-Sri/edit" element={<CustomTemplateEditor />} />
          <Route path="/template/midnight-waltz/pavitra-sri/:variant/edit" element={<CustomTemplateEditor />} />
          <Route path="/template/midnight-waltz/pavitra-sri/edit" element={<CustomTemplateEditor />} />
          <Route path="/templates/midnight-waltz/pavitra-sri/:variant/edit" element={<CustomTemplateEditor />} />
          <Route path="/templates/midnight-waltz/pavitra-sri/edit" element={<CustomTemplateEditor />} />
          <Route path="/template/:templateId/:customSlug/:variant/edit" element={<CustomTemplateEditor />} />
          <Route path="/template/:templateId/:customSlug/edit" element={<CustomTemplateEditor />} />
          <Route path="/templates/:templateId/:customSlug/:variant/edit" element={<CustomTemplateEditor />} />
          <Route path="/templates/:templateId/:customSlug/edit" element={<CustomTemplateEditor />} />
          <Route path="/template/midnight-waltz/Pavitra-Sri" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/template/midnight-waltz/Pavitra-Sri/:variant" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/templates/midnight-waltz/Pavitra-Sri" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/templates/midnight-waltz/Pavitra-Sri/:variant" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/template/midnight-waltz/pavitra-sri" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/template/midnight-waltz/pavitra-sri/:variant" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/templates/midnight-waltz/pavitra-sri" element={<CustomMidnightWaltzPavitraSri />} />
          <Route path="/templates/midnight-waltz/pavitra-sri/:variant" element={<CustomMidnightWaltzPavitraSri />} />

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
      </DraftProvider>
    </AuthProvider>
  )
}

