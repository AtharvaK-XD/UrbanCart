import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Landmark, ArrowRight, CheckCircle2, TrendingUp, Users, ShieldAlert, Award } from 'lucide-react'
import { account } from '../lib/appwrite'
import { useAuthStore } from '../store/useAuthStore'
import Toast from '../components/Toast'

export default function BecomeSeller() {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const setRole = useAuthStore(state => state.setRole)

  // Form State
  const [shopName, setShopName] = useState('')
  const [taxId, setTaxId] = useState('')
  const [category, setCategory] = useState('Home Decor')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Basic Indian GSTIN verification (15-characters) or fallback
    if (taxId.length < 8) {
      setError('Please enter a valid Tax ID / GSTIN (minimum 8 characters)')
      setSubmitting(false)
      return
    }

    try {
      // 1. Update preferences in Appwrite so it persists across sessions
      try {
        await account.updatePrefs({ role: 'SELLER' })
      } catch (appwriteErr) {
        console.warn('Appwrite update preferences error:', appwriteErr.message)
        // Fallback for mock environments / missing project configurations
      }

      // 2. Update Zustand store role state
      setRole('SELLER')
      
      // 3. Show success and navigate
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        navigate('/seller')
      }, 2000)

    } catch (err) {
      setError('An error occurred while activating your seller account. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex-1 bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {showToast && <Toast message="Congratulations! Your seller account is active. Redirecting to Dashboard..." onClose={() => setShowToast(false)} />}

      {/* Hero Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-display font-bold text-ink mb-4">Sell on UrbanCart</h1>
        <p className="text-ink opacity-70 max-w-xl mx-auto font-light text-lg">
          Reach millions of customers, list your inventory with zero hassle, and take your business to the next level.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Benefits pitch */}
        <div className="space-y-8">
          <h2 className="text-2xl font-display font-bold text-ink">Why choose UrbanCart?</h2>
          
          <div className="space-y-6">
            {[
              { 
                title: "Low Commission Structure", 
                desc: "Keep more of what you earn. We charge a flat fee of only 2.5% per sale, with no listing fees or hidden charges.", 
                icon: TrendingUp 
              },
              { 
                title: "Millions of Active Buyers", 
                desc: "Gain instant visibility. Your products will be showcased directly to active shoppers browsing our categories daily.", 
                icon: Users 
              },
              { 
                title: "Prompt Weekly Settlements", 
                desc: "Never worry about cashflow. Payments are settled automatically into your bank account every Wednesday like clockwork.", 
                icon: Landmark 
              },
              { 
                title: "Robust Merchant Tools", 
                desc: "Manage your storefront easily. Get access to sales reports, simple listings manager, and order tracking portals.", 
                icon: Award 
              }
            ].map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <motion.div 
                  key={benefit.title}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="flex gap-4"
                >
                  <div className="p-3 bg-jade/10 text-jade rounded-md h-fit flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink mb-1">{benefit.title}</h3>
                    <p className="text-xs text-ink opacity-75 leading-relaxed font-light">{benefit.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Register Onboarding Form */}
        <div className="bg-surface border border-line rounded-lg p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-display font-bold text-ink mb-2">Merchant Registration</h2>
          <p className="text-sm text-ink opacity-70 mb-6 font-light">
            You are currently logged in as <span className="font-semibold">{user?.email}</span>. Fill out the shop details below to activate your vendor dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Shop Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Cozy Corner Decor"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Business Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm"
                >
                  <option value="Home Decor">Home Decor</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Tax ID / GSTIN</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Shop Description</label>
              <textarea
                required
                rows={4}
                placeholder="Briefly describe what your shop sells, shipping estimates, or origin..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm resize-none"
              />
            </div>

            {error && (
              <div className="text-amber text-xs font-medium bg-amber/10 p-3 rounded-md border border-amber/20 flex gap-2 items-center">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-jade text-surface py-3 rounded-md font-semibold hover:bg-opacity-90 disabled:opacity-50 transition-all text-sm flex justify-center items-center gap-2 shadow-md"
            >
              {submitting ? 'Registering...' : (
                <>Activate Vendor Storefront <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
