import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { motion } from 'framer-motion'
import { Sparkles, AlertCircle } from 'lucide-react'

export default function Auth() {
  const [role, setRole] = useState('BUYER') // 'BUYER' or 'SELLER'
  const [error, setError] = useState('')
  
  const loginWithGoogle = useAuthStore(state => state.loginWithGoogle)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLoading = useAuthStore(state => state.isLoading)
  
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, location])

  const handleGoogleLogin = async () => {
    try {
      setError('')
      await loginWithGoogle(role)
    } catch (err) {
      setError('Failed to initiate Google sign-in. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jade"></div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">Verifying security token...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      
      {/* Floating Ambient Mesh Blobs */}
      <div className="absolute top-12 left-12 w-80 h-80 bg-jade/10 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-96 h-96 bg-amber/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full space-y-8 glass-card p-8 sm:p-10 rounded-2xl shadow-xl relative z-10"
      >
        {/* Title */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-jade/10 text-jade flex items-center justify-center mx-auto mb-4 animate-float-slow border border-jade/20 shadow-xs">
            <Sparkles size={20} />
          </div>
          <h2 className="text-3xl font-display font-semibold text-ink tracking-tight">
            Welcome to UrbanCart
          </h2>
          <p className="mt-2 text-xs font-medium text-ink/60">
            Sign in or create an account to continue
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex p-1 bg-background border border-line/45 rounded-xl">
          <button
            type="button"
            className={`flex-grow py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              role === 'BUYER' 
                ? 'bg-surface text-ink shadow-xs' 
                : 'text-ink/65 hover:text-ink'
            }`}
            onClick={() => {
              setRole('BUYER')
              setError('')
            }}
          >
            I'm a Buyer
          </button>
          <button
            type="button"
            className={`flex-grow py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              role === 'SELLER' 
                ? 'bg-surface text-ink shadow-xs' 
                : 'text-ink/65 hover:text-ink'
            }`}
            onClick={() => {
              setRole('SELLER')
              setError('')
            }}
          >
            I'm a Seller
          </button>
        </div>

        {/* Errors */}
        {error && (
          <div className="text-amber text-xs font-semibold bg-amber/10 p-3.5 rounded-xl border border-amber/20 flex gap-2 items-center">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-3.5 py-4 px-4 border border-line/65 rounded-xl shadow-xs text-xs font-bold uppercase tracking-wider text-ink bg-surface hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-jade"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  )
}

