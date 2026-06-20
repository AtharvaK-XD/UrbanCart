import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Smartphone, Tv, Shirt, Sparkles, Home as HomeIcon, Heart, Dumbbell, Baby, Car, BookOpen, Truck, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getProducts } from '../lib/db'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { name: 'Mobiles, Computers', icon: Smartphone, bg: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop' },
  { name: 'TV, Appliances, Electronics', icon: Tv, bg: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=400&auto=format&fit=crop' },
  { name: "Men's Fashion", icon: Shirt, bg: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400&auto=format&fit=crop' },
  { name: "Women's Fashion", icon: Sparkles, bg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop' },
  { name: 'Home, Kitchen, Pets', icon: HomeIcon, bg: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400&auto=format&fit=crop' },
  { name: 'Beauty, Health, Grocery', icon: Heart, bg: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop' },
  { name: 'Sports, Fitness, Bags, Luggage', icon: Dumbbell, bg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop' },
  { name: "Toys, Baby Products, Kids' Fashion", icon: Baby, bg: '/toys_category.png' },
  { name: 'Car, Motorbike, Industrial', icon: Car, bg: '/car_category.png' },
  { name: 'Books', icon: BookOpen, bg: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop' }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
}

export default function Home() {
  const [products, setProducts] = useState([])
  const carouselRef = useRef(null)

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  const deals = products.filter(p => p.tags?.includes('-25%') || p.tags?.includes('BESTSELLER'))
  const featured = products.slice(0, 10)

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex-1 bg-background overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-64px)] min-h-[650px] flex items-center px-6 sm:px-12 lg:px-20 overflow-hidden bg-ink">
        
        {/* Animated Background Gradients / Circles */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-jade/10 blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-amber/5 blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

        {/* Hero image - Left to Right Split with responsive masks */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop")',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>

        {/* Hero Copywriting */}
        <div className="relative z-10 max-w-[1800px] mx-auto w-full px-4 flex flex-col items-start text-left">
          <div className="max-w-3xl">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 border border-jade/30 bg-jade/10 text-jade rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} className="animate-spin" />
                <span>Premium Curation Only</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium text-surface leading-[1.15] tracking-tight">
                Curated elegance<br/>
                for the <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-jade to-amber text-glow">modern home.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-surface/75 font-light leading-relaxed max-w-xl">
                Elevate your daily living. Discover an elegant choice of curated fashion, cutting-edge technology, and interior essentials chosen with care.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to="/category" 
                  className="group flex items-center gap-2 bg-jade text-surface px-8 py-3.5 rounded-lg font-bold text-sm tracking-wide hover:bg-opacity-95 transition-all shadow-lg hover:shadow-jade/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Browse Collection 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/category?filter=deals" 
                  className="group flex items-center gap-2 border border-surface/20 bg-surface/5 hover:bg-surface/10 text-surface px-8 py-3.5 rounded-lg font-bold text-sm tracking-wide transition-all"
                >
                  Explore Deals
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* Value Proposition Strip */}
      <section className="bg-surface py-12 border-b border-line/40 relative z-20">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-line/40">
            <div className="flex flex-col items-center gap-2 px-4 pt-4 md:pt-0 group cursor-default">
              <div className="p-3 bg-background group-hover:bg-jade/5 rounded-full text-jade transition-colors duration-300">
                <Truck size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-base font-semibold text-ink">Complimentary Delivery</h3>
              <p className="text-xs text-ink/60 font-light">On all orders exceeding ₹200</p>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 pt-8 md:pt-0 group cursor-default">
              <div className="p-3 bg-background group-hover:bg-jade/5 rounded-full text-jade transition-colors duration-300">
                <ShieldCheck size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-base font-semibold text-ink">Authenticity Guaranteed</h3>
              <p className="text-xs text-ink/60 font-light">Sourced directly from verified brands</p>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 pt-8 md:pt-0 group cursor-default">
              <div className="p-3 bg-background group-hover:bg-jade/5 rounded-full text-jade transition-colors duration-300">
                <RefreshCw size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-base font-semibold text-ink">Seamless Returns</h3>
              <p className="text-xs text-ink/60 font-light">30-day complimentary exchange policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Categories Grid */}
      <section className="py-12 md:py-24 bg-background/50 relative">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="text-center mb-16">
            <span className="text-jade uppercase tracking-[0.2em] text-[10px] font-bold block mb-2">Explore Departments</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-ink">Shop by Category</h2>
            <div className="h-[2px] w-12 bg-jade mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon
              return (
                <motion.div 
                  key={cat.name} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                >
                  <Link 
                    to={`/category?category=${encodeURIComponent(cat.name)}`}
                    className="group relative flex flex-col h-60 rounded-xl overflow-hidden border border-line/40 shadow-xs hover:shadow-xl hover:border-jade/30 transition-all duration-500"
                  >
                    {/* Background Category Image */}
                    <div className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${cat.bg})` }} />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />
                    
                    {/* Floating Info */}
                    <div className="relative z-10 mt-auto p-5 flex flex-col gap-2">
                      <div className="w-10 h-10 rounded-lg bg-surface/10 backdrop-blur-xs flex items-center justify-center text-surface group-hover:bg-jade group-hover:text-surface transition-all duration-500">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <span className="font-display font-medium text-sm text-surface tracking-wide group-hover:text-jade transition-colors duration-300">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Signature Collections Swipe List */}
      <section className="py-12 md:py-24 bg-surface border-y border-line/45 relative">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
          
          <div className="flex items-end justify-between mb-12 pb-6 border-b border-line/35">
            <div>
              <span className="text-jade uppercase tracking-widest text-[10px] font-bold mb-2 block">Curated Deals</span>
              <h2 className="text-3xl font-display font-medium text-ink">The Signature Collection</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 border border-line hover:border-ink rounded-full flex items-center justify-center text-ink hover:bg-background transition"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 border border-line hover:border-ink rounded-full flex items-center justify-center text-ink hover:bg-background transition"
                aria-label="Scroll Right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div 
            ref={carouselRef}
            className="flex overflow-x-auto gap-6 pb-6 snap-x scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {deals.map(product => (
              <div key={product.id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Grid Section */}
      <section className="py-12 md:py-24 bg-background/30">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="text-center mb-16">
            <span className="text-jade uppercase tracking-[0.2em] text-[10px] font-bold block mb-2">Just Landed</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-ink">New Arrivals</h2>
            <div className="h-[2px] w-12 bg-jade mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-8">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/category" 
              className="inline-flex items-center gap-2 border border-ink text-ink px-10 py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-ink hover:text-surface transition-all duration-500 hover:shadow-xl"
            >
              Discover More Products
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
