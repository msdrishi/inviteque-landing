import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"
import { fadeUp } from '../motionVariants'

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1) // 1: Enter Phone, 2: Enter OTP
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, sendOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    
    // Quick validation
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '')
    if (cleanPhone.length < 10) {
      setError('Please enter a valid mobile number.')
      setLoading(false)
      return
    }

    const result = await sendOtp(cleanPhone)
    setLoading(false)
    if (result.success) {
      setStep(2)
    } else {
      setError(result.message || 'Failed to send OTP. Please check the number and try again.')
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (code.length !== 6) {
      setError('Please enter a 6-digit verification code.')
      setLoading(false)
      return
    }

    const result = await verifyOtp(phoneNumber, code)
    setLoading(false)
    if (result.success) {
      window.location.replace('/')
    } else {
      setError(result.message || 'Invalid or expired OTP. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-iqBg font-saas">
      <header className="border-b border-iqBorder bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-4">
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" loading="lazy" />
            <span className="font-parisienne text-2xl font-normal text-iqText leading-none select-none relative -top-[2px]">Inviteque</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeUp}
          className="w-full max-w-md space-y-8 rounded-[2rem] border border-iqBorder bg-white p-10 shadow-luxury"
        >
          <div className="text-center">
            <Link to="/">
              <img src={logo} alt="Inviteque" className="mx-auto h-8 w-auto" />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-iqText">Welcome</h2>
            <p className="mt-2 text-sm text-iqText/50">
              {step === 1 ? 'Enter your mobile number to log in' : 'Enter the verification code sent to WhatsApp'}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6" 
                onSubmit={handleSendOtp}
              >
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
                    placeholder="e.g. +91 98765 43210"
                    disabled={loading}
                  />
                  <p className="mt-2 text-[11px] text-iqText/40">We will send a 6-digit OTP code to this number via WhatsApp.</p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-full bg-black px-4 py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP via WhatsApp'}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6" 
                onSubmit={handleVerifyOtp}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Verification Code</label>
                    <button 
                      type="button" 
                      onClick={() => { setStep(1); setError(''); }}
                      className="text-xs font-bold text-iqText/60 hover:text-iqText hover:underline"
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="mt-1 block w-full text-center tracking-[0.5em] font-mono text-lg rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 outline-none focus:border-iqText transition-colors"
                    placeholder="000000"
                    disabled={loading}
                  />
                  <p className="mt-2 text-[11px] text-center text-iqText/40">
                    OTP sent to <span className="font-semibold text-iqText/70">{phoneNumber}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-full bg-black px-4 py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Log In'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="flex w-full justify-center text-xs font-bold text-iqText/50 hover:text-iqText py-2"
                  >
                    Resend OTP Code
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <footer className="border-t border-iqBorder bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            <img src={logo} alt="Inviteque" className="h-6 w-auto align-baseline" loading="lazy" />
            <span className="font-parisienne text-xl font-normal text-iqText leading-none select-none">Inviteque</span>
          </div>
          <span className="text-xs font-medium text-iqText/40">© {new Date().getFullYear()} Inviteque</span>
        </div>
      </footer>
    </div>
  )
}
