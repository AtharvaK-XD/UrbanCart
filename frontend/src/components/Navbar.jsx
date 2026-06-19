import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, ChevronDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const cartCount = useCartStore((state) => state.getCartCount())
  const openCart = useCartStore((state) => state.openCart)
  const { user, logout, role } = useAuthStore()

  const [searchCategory, setSearchCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileQuery, setMobileQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (searchCategory !== 'All') {
      params.set('category', searchCategory)
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }
    navigate(`/category?${params.toString()}`)
  }

  const handleMobileSearch = (e) => {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (mobileQuery.trim()) {
      params.set('search', mobileQuery.trim())
    }
    navigate(`/category?${params.toString()}`)
  }

  const CATEGORY_LIST = [
    'All',
    'Mobiles, Computers',
    'TV, Appliances, Electronics',
    "Men's Fashion",
    "Women's Fashion",
    'Home, Kitchen, Pets',
    'Beauty, Health, Grocery',
    'Sports, Fitness, Bags, Luggage',
    "Toys, Baby Products, Kids' Fashion",
    'Car, Motorbike, Industrial',
    'Books'
  ]

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Store', path: '/category' },
    { label: 'Help Desk', path: '/help' }
  ]

  return (
    <nav className="sticky top-0 z-40 glass-header border-b border-line/40 shadow-xs transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
        <div className="flex justify-between h-16 items-center gap-4">
          
          {/* Logo & Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 xl:hidden text-ink hover:bg-background rounded-md transition"
              >
                <Menu size={20} />
              </button>
              <Link to="/" className="font-display font-bold text-2xl tracking-tighter text-ink flex items-center gap-1">
                <Sparkles size={20} className="text-jade animate-pulse" />
                <span>UrbanCart</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative py-1 text-xs font-semibold uppercase tracking-wider text-ink/70 hover:text-jade transition-colors duration-300"
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-[21px] left-0 right-0 h-[3px] bg-jade rounded-t-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Search bar - Desktop */}
          <form 
            onSubmit={handleSearch} 
            className={`hidden md:flex items-center bg-background border rounded-lg transition-all duration-500 overflow-hidden ${
              isFocused ? 'border-jade glow-jade max-w-xl flex-1' : 'border-line/65 max-w-md flex-1'
            }`}
          >
            <div className="relative flex items-center w-full">
              <div className="relative flex items-center px-3 border-r border-line/40 text-xs font-medium text-ink/60 hover:text-ink cursor-pointer bg-background/50 h-10">
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                >
                  {CATEGORY_LIST.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="max-w-[100px] truncate pr-4">{searchCategory}</span>
                <ChevronDown size={12} className="absolute right-2.5 opacity-60" />
              </div>
              
              <input 
                type="text" 
                placeholder="Search premium products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent text-sm pl-4 pr-10 py-2 focus:outline-none placeholder-ink/40 text-ink"
              />
              <button 
                type="submit" 
                className="absolute right-1 p-2 text-ink/60 hover:text-jade hover:scale-105 transition-all"
              >
                <Search size={18} strokeWidth={2.2} />
              </button>
            </div>
          </form>

          {/* Icons / Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* User Access Profile */}
            {user ? (
              <div className="hidden lg:flex items-center gap-4 sm:gap-5">
                <span className="hidden xl:inline text-xs font-semibold tracking-wide text-ink/70">
                  Hi, <span className="text-jade font-bold">{user.name || 'User'}</span>
                </span>
                
                {role === 'SELLER' ? (
                  <Link
                    to="/seller"
                    className="text-xs font-bold uppercase tracking-wider text-jade border border-jade/30 bg-jade/5 hover:bg-jade hover:text-surface px-3 py-1.5 rounded-full transition-all duration-300"
                  >
                    Seller Portal
                  </Link>
                ) : (
                  <Link
                    to="/become-seller"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 border border-slate-350 bg-background hover:border-jade hover:text-jade px-3 py-1.5 rounded-full transition-all duration-300"
                  >
                    Become Seller
                  </Link>
                )}
                
                <button
                  onClick={() => logout()}
                  className="text-xs font-bold uppercase tracking-wider text-ink/60 hover:text-amber transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="hidden lg:flex text-ink/80 hover:text-jade hover:scale-105 active:scale-95 transition-all duration-200 items-center gap-1.5"
              >
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-line/45">
                  <User size={16} />
                </div>
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Sign In</span>
              </Link>
            )}
            
            {/* Cart Button Drawer trigger */}
            <button 
              onClick={(e) => {
                e.preventDefault()
                openCart()
              }}
              className="relative text-ink/80 hover:text-jade hover:scale-110 active:scale-95 transition-all duration-200 p-2 rounded-full bg-background border border-line/45 flex items-center justify-center"
              aria-label="Open Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber text-ink text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-surface shadow-xs animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <form onSubmit={handleMobileSearch} className="md:hidden pb-4">
          <div className="relative w-full flex border border-line rounded-lg overflow-hidden bg-background">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              className="w-full bg-transparent text-sm px-4 py-2.5 focus:outline-none placeholder-ink/40"
            />
            <button type="submit" className="bg-jade text-surface px-4 py-2.5 flex items-center justify-center">
              <Search size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-16 bg-ink z-30 xl:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-16 bottom-0 left-0 w-64 bg-surface z-40 xl:hidden shadow-xl border-r border-line/40 flex flex-col p-6 space-y-6"
            >
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-ink/40">Navigation</h3>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-semibold text-ink hover:text-jade transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-line/40 pt-6 flex flex-col gap-4">
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-ink/40">Account</h3>
                {user ? (
                  <>
                    <span className="text-sm font-semibold text-ink">
                      Hi, <span className="text-jade">{user.name || 'User'}</span>
                    </span>
                    {role === 'SELLER' ? (
                      <Link
                        to="/seller"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-semibold text-jade"
                      >
                        Seller Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/become-seller"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-semibold text-ink hover:text-jade transition-colors"
                      >
                        Become a Seller
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                      className="text-sm font-semibold text-left text-amber hover:text-opacity-80"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-semibold text-ink hover:text-jade transition-colors"
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
