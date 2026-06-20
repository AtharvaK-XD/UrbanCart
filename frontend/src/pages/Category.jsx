import { useState, useEffect } from 'react'
import { Filter, SlidersHorizontal, Smartphone, Tv, Shirt, Sparkles, Home as HomeIcon, Heart, Dumbbell, Baby, Car, BookOpen, ChevronDown, Shuffle } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProducts } from '../lib/db'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import Breadcrumbs from '../components/Breadcrumbs'

const CAT_ICONS = {
  'All': Sparkles,
  'Mobiles, Computers': Smartphone,
  'TV, Appliances, Electronics': Tv,
  "Men's Fashion": Shirt,
  "Women's Fashion": Sparkles,
  'Home, Kitchen, Pets': HomeIcon,
  'Beauty, Health, Grocery': Heart,
  'Sports, Fitness, Bags, Luggage': Dumbbell,
  "Toys, Baby Products, Kids' Fashion": Baby,
  'Car, Motorbike, Industrial': Car,
  'Books': BookOpen
}

const shuffleArray = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr
}

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'

  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({ category: initialCategory, subCategory: 'All', brand: 'All' })
  const [sort, setSort] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    const cat = searchParams.get('category') || 'All'
    setFilters({ category: cat, subCategory: 'All', brand: 'All' })
  }, [searchParams])

  const handleCategoryChange = (newCat) => {
    if (newCat === 'All') {
      setSearchParams({})
      getProducts().then(data => setProducts(shuffleArray(data)))
    } else {
      setSearchParams({ category: newCat })
    }
  }

  useEffect(() => {
    getProducts().then(data => {
      const shuffled = shuffleArray(data)
      setProducts(shuffled)
      setFiltered(shuffled)
    })
  }, [])

  useEffect(() => {
    let result = [...products]
    
    const type = searchParams.get('filter') || 'All'
    if (type === 'deals') {
      result = result.filter(p => p.originalPrice > p.price || p.tags?.includes('BESTSELLER'))
    } else if (type === 'new') {
      result = result.slice(0, 24)
    } else if (type === 'bestsellers') {
      result = result.filter(p => p.tags?.includes('BESTSELLER'))
    }

    const query = searchParams.get('search') || ''
    if (query.trim()) {
      const cleanQuery = query.toLowerCase().trim()
      result = result.filter(p => 
        p.title?.toLowerCase().includes(cleanQuery) || 
        p.description?.toLowerCase().includes(cleanQuery) || 
        p.brand?.toLowerCase().includes(cleanQuery)
      )
    }

    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category)
    }
    if (filters.subCategory && filters.subCategory !== 'All') {
      result = result.filter(p => p.subCategory === filters.subCategory)
    }
    if (filters.brand && filters.brand !== 'All') {
      result = result.filter(p => p.brand === filters.brand)
    }
    
    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    }
    if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }

    setFiltered(result)
    setCurrentPage(1)
  }, [filters, sort, products, searchParams])

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const getPageTitle = () => {
    const query = searchParams.get('search')
    if (query) return `Search Results for "${query}"`

    const type = searchParams.get('filter') || 'All'
    if (type === 'deals') return "Today's Deals"
    if (type === 'new') return "New Arrivals"
    if (type === 'bestsellers') return "Bestselling Products"
    if (filters.category !== 'All') return filters.category
    return "All Products"
  }

  const getPaginationRange = () => {
    const total = totalPages
    const current = currentPage
    
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    const showLeftDots = current > 4
    const showRightDots = current < total - 3

    if (!showLeftDots && showRightDots) {
      return [1, 2, 3, 4, 5, '...', total]
    }

    if (showLeftDots && !showRightDots) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    }

    return [1, '...', current - 1, current, current + 1, '...', total]
  }

  return (
    <div className="flex-1 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8 w-full bg-background/30">
      <Breadcrumbs items={[{ label: getPageTitle() }]} />
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-line/40">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-semibold text-ink">{getPageTitle()}</h1>
            <button
              onClick={() => setProducts(shuffleArray(products))}
              className="p-1.5 rounded-lg border border-line/60 bg-surface hover:border-jade hover:text-jade transition-all duration-300 flex items-center justify-center text-ink/65 hover:scale-110 active:scale-90 shadow-3xs"
              title="Shuffle Current Products"
            >
              <Shuffle size={14} />
            </button>
          </div>
          <p className="text-xs text-ink/50 mt-1">{filtered.length} products available</p>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <select 
            value={sort} 
            onChange={e => setSort(e.target.value)}
            className="border border-line bg-surface rounded-lg px-4 py-2.5 text-xs font-semibold text-ink/80 focus:outline-none focus:ring-1 focus:ring-jade shadow-2xs"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          
          <button 
            className="md:hidden p-2.5 border border-line rounded-lg bg-surface text-ink hover:bg-background flex items-center justify-center"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        
        {/* Sidebar Filter Menu */}
        <aside className={`
          md:w-72 flex-shrink-0 sticky top-24 z-30
          ${isMobileFiltersOpen ? 'fixed inset-x-0 bottom-0 top-auto z-50 bg-surface p-6 shadow-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto' : 'hidden md:block'}
        `}>
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="font-display font-bold text-lg flex items-center gap-2 text-ink">
              <Filter size={18} className="text-jade" /> Filters
            </h2>
            <button onClick={() => setIsMobileFiltersOpen(false)} className="text-xs font-bold uppercase tracking-wider text-jade border border-jade/20 px-3 py-1 rounded bg-jade/5">
              Apply
            </button>
          </div>

          <div className="space-y-8 glass-card p-6 rounded-2xl">
            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-ink/40 mb-4">Categories</h3>
              <ul className="space-y-1.5">
                {Object.keys(CAT_ICONS).map(cat => {
                  const Icon = CAT_ICONS[cat]
                  const isSelected = filters.category === cat
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategoryChange(cat)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all text-left ${
                          isSelected 
                            ? 'bg-jade text-surface font-semibold shadow-xs' 
                            : 'text-ink/80 hover:bg-background/80 hover:text-ink'
                        }`}
                      >
                        <Icon size={14} className={isSelected ? 'text-surface' : 'text-ink/40'} />
                        <span className="truncate">{cat}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Brand Filter */}
            {filters.category !== 'All' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-line/40"
              >
                <h3 className="font-bold text-xs uppercase tracking-widest text-ink/40 mb-4">Brand</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', ...Array.from(new Set(products.filter(p => p.category === filters.category).map(p => p.brand).filter(Boolean)))].map(brand => {
                    const isSelected = filters.brand === brand
                    return (
                      <button
                        key={brand}
                        onClick={() => setFilters({ ...filters, brand })}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected 
                            ? 'border-jade bg-jade/5 text-jade font-semibold' 
                            : 'border-line/75 text-ink/70 hover:border-ink hover:text-ink bg-transparent'
                        }`}
                      >
                        {brand}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Sub-Category Filter */}
            {filters.category !== 'All' && Array.from(new Set(products.filter(p => p.category === filters.category && p.subCategory).map(p => p.subCategory))).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-line/40"
              >
                <h3 className="font-bold text-xs uppercase tracking-widest text-ink/40 mb-4">Product Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', ...Array.from(new Set(products.filter(p => p.category === filters.category && p.subCategory).map(p => p.subCategory)))].map(type => {
                    const isSelected = filters.subCategory === type
                    return (
                      <button
                        key={type}
                        onClick={() => setFilters({ ...filters, subCategory: type })}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected 
                            ? 'border-jade bg-jade/5 text-jade font-semibold' 
                            : 'border-line/75 text-ink/70 hover:border-ink hover:text-ink bg-transparent'
                        }`}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </aside>

        {/* Mobile Filter Backdrop */}
        {isMobileFiltersOpen && (
          <div 
            className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
        )}

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0 w-full">
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-10">
              
              {/* Product Grid with layout animations */}
              <motion.div 
                layout 
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {currentItems.map(product => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-8 border-t border-line/30">
                  <button 
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-line rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-background transition-colors text-ink/80"
                  >
                    Prev
                  </button>
                  
                  <div className="flex items-center gap-1.5 mx-2">
                    {getPaginationRange().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span 
                            key={`dots-${index}`} 
                            className="w-9 h-9 flex items-center justify-center text-xs font-bold text-ink opacity-40 select-none font-mono"
                          >
                            ...
                          </span>
                        )
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all text-xs font-bold font-mono border ${
                            currentPage === page 
                              ? 'bg-jade border-jade text-surface shadow-sm' 
                              : 'border-line text-ink/75 hover:bg-background'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button 
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-line rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-background transition-colors text-ink/80"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState 
              icon={Filter}
              title="No products match your criteria"
              message="Adjust filters or clear them completely to view our full collection."
              action={
                <button 
                  onClick={() => setFilters({ category: 'All', subCategory: 'All', brand: 'All' })}
                  className="bg-jade text-surface px-6 py-2.5 rounded-lg font-bold text-xs hover:bg-opacity-95 shadow-lg"
                >
                  Reset Active Filters
                </button>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
