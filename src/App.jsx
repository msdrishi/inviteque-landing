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

export default function App() {
  return (
    <AuthProvider>
      <DraftProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/:code" element={<InviteDetails />} />
          <Route path="/builder/:templateId" element={<Builder />} />
          <Route path="/templates/:templateId" element={<TemplateRoute />} />
          <Route path="/templates/:templateId/:code" element={<TemplateRoute />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DraftProvider>
    </AuthProvider>
  )
}
