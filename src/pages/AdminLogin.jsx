import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'

const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginWithData } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Invalid credentials')
      }

      const data = await response.json()

      // Check if user has ADMIN role
      const roles = data.roles || []
      if (!roles.includes('ADMIN')) {
        throw new Error('Access denied: Unauthorized login attempt.')
      }

      loginWithData(data)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-iqBg font-saas selection:bg-black selection:text-white">
      <header className="border-b border-iqBorder bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" />
            <span className="font-parisienne text-2xl font-normal text-iqText leading-none select-none relative -top-[2px]">Inviteque</span>
          </Link>
          <span className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-iqText/60">
            Staff Portal
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md space-y-8 rounded-[2rem] border border-iqBorder bg-white p-10 shadow-luxury"
        >
          <div className="text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl text-white">
              🔒
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-iqText">Admin Console</h2>
            <p className="mt-2 text-sm text-iqText/50">Authorize to access site analytics</p>
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600"
            >
              {error}
            </motion.div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
                  placeholder="admin@inviteque.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Secure Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-full bg-black px-4 py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <footer className="border-t border-iqBorder bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            <img src={logo} alt="Inviteque" className="h-6 w-auto align-baseline" />
            <span className="font-parisienne text-xl font-normal text-iqText leading-none select-none">Inviteque</span>
          </div>
          <span className="text-xs font-medium text-iqText/40">© {new Date().getFullYear()} Inviteque Admin Panel</span>
        </div>
      </footer>
    </div>
  )
}
