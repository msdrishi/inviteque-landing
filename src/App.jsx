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
        
        // Parse /templates/:templateId or /templates/:templateId/:code
        const pathParts = location.pathname.split('/')
        if (pathParts[1] === 'templates' && pathParts[2]) {
          templateId = pathParts[2]
          if (pathParts[3]) {
            inviteCode = pathParts[3]
          }
        }
        // Parse /builder/:templateId
        if (pathParts[1] === 'builder' && pathParts[2]) {
          templateId = pathParts[2]
        }
        
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
          <Route path="/signup" element={<Navigate to="/login" replace />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/:code" element={<InviteDetails />} />
          <Route path="/builder/:templateId" element={<Builder />} />
          <Route path="/templates/:templateId" element={<TemplateRoute />} />
          <Route path="/templates/:templateId/:code" element={<TemplateRoute />} />
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

