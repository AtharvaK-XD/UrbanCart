import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ShieldCheck, Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('BUYER') // 'BUYER' or 'SELLER'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  
  const login = useAuthStore(state => state.login)
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

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    setError('')
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Enforce Demo Role Separation
    if (email.trim() === 'buyer@urbancart.com' && role !== 'BUYER') {
      setError("This credentials set is registered as a BUYER. Please switch to 'I'm a Buyer' tab.")
      return
    }
    if (email.trim() === 'seller@urbancart.com' && role !== 'SELLER') {
      setError("This credentials set is registered as a SELLER. Please switch to 'I'm a Seller' tab.")
      return
    }

    // Mock successful login
    login(email, password, role)
    if (role === 'SELLER') {
      navigate('/seller')
    } else {
      navigate('/')
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
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="mt-2 text-xs font-medium text-ink/60">
            {isLogin ? "New to our curation? " : "Already registered? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }} 
              className="font-bold text-jade hover:underline transition-colors focus:outline-none"
            >
              {isLogin ? 'Sign up free' : 'Log in instead'}
            </button>
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

        {/* One-Click Quick Demo Accounts */}
        <div className="bg-background/80 border border-line/40 rounded-xl p-4 space-y-3 shadow-3xs">
          <span className="text-[9px] font-bold uppercase tracking-widest text-ink/40 block text-center">Quick Demo Accounts</span>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setEmail('buyer@urbancart.com')
                setPassword('buyer123')
                setRole('BUYER')
                login('buyer@urbancart.com', 'buyer123', 'BUYER')
                navigate('/')
              }}
              className="bg-surface hover:bg-background border border-line/50 rounded-lg p-3 text-left transition-all hover:border-jade/40 hover:-translate-y-0.5 shadow-3xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-ink/80 block">Buyer Portal</span>
                <span className="text-[8px] font-mono text-ink/40 block mt-0.5 truncate">buyer@urbancart.com</span>
              </div>
              <span className="text-[9px] font-bold text-jade mt-3 block flex items-center gap-1">
                Access <ArrowRight size={10} />
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('seller@urbancart.com')
                setPassword('seller123')
                setRole('SELLER')
                login('seller@urbancart.com', 'seller123', 'SELLER')
                navigate('/seller')
              }}
              className="bg-surface hover:bg-background border border-line/50 rounded-lg p-3 text-left transition-all hover:border-jade/40 hover:-translate-y-0.5 shadow-3xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-ink/80 block">Seller Dashboard</span>
                <span className="text-[8px] font-mono text-ink/40 block mt-0.5 truncate">seller@urbancart.com</span>
              </div>
              <span className="text-[9px] font-bold text-jade mt-3 block flex items-center gap-1">
                Access <ArrowRight size={10} />
              </span>
            </button>
          </div>
        </div>

        {/* Input Form Fields */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Full Name (Sign Up only) */}
            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink/50 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon size={14} className="absolute left-3.5 top-3 text-ink/35" />
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-line/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-jade text-xs bg-background/50 placeholder-ink/30"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink/50 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-3 text-ink/35" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-line/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-jade text-xs bg-background/50 placeholder-ink/30"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink/50 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-3 text-ink/35" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-line/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-jade text-xs bg-background/50 placeholder-ink/30"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Errors */}
          {error && (
            <div className="text-amber text-xs font-semibold bg-amber/10 p-3.5 rounded-xl border border-amber/20 flex gap-2 items-center">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold uppercase tracking-wider text-surface bg-ink hover:bg-jade transition-colors duration-300 focus:outline-none"
          >
            {isLogin ? 'Sign In Securely' : 'Activate Account'}
          </button>
        </form>

        {/* Separator */}
        <div>
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-line/45"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider text-ink/40">Or Connect</span>
            <div className="flex-grow border-t border-line/45"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex justify-center items-center gap-3.5 py-3 px-4 border border-line/65 rounded-xl shadow-xs text-xs font-bold uppercase tracking-wider text-ink bg-surface hover:bg-background transition-colors focus:outline-none"
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
