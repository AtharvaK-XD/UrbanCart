import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import StampBadge from './StampBadge'
import PriceTag from './PriceTag'
import RatingStars from './RatingStars'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem)
  const openCart = useCartStore(state => state.openCart)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const navigate = useNavigate()
  const tag = product.tags?.[0]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group flex flex-col bg-surface border border-line/35 rounded-xl overflow-hidden hover:shadow-xl hover:border-jade/30 transition-all duration-350 relative h-full bg-grid"
    >
      {/* Dynamic Badge */}
      {tag && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-ink text-surface text-[9px] font-bold px-2 py-1 uppercase tracking-widest rounded-md shadow-sm">
            {tag}
          </span>
        </div>
      )}
      
      {/* Product Image Wrapper */}
      <Link 
        to={`/product/${product.id}`} 
        className="block relative aspect-square bg-background/30 overflow-hidden p-4 flex items-center justify-center border-b border-line/30"
      >
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-4/5 h-4/5 object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-surface/75 flex items-center justify-center backdrop-blur-xs">
            <span className="font-bold text-ink tracking-widest uppercase text-xs border border-ink/40 px-3 py-1 bg-surface/80 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Info Content */}
      <div className="p-5 flex flex-col flex-grow bg-surface">
        <span className="text-[9px] uppercase tracking-widest text-jade font-bold mb-1.5 block">
          {product.category}
        </span>
        
        <Link 
          to={`/product/${product.id}`} 
          className="font-medium text-sm text-ink hover:text-jade transition-colors line-clamp-2 mb-3 leading-snug"
        >
          {product.title}
        </Link>
        
        {/* Rating and count */}
        <div className="flex items-center gap-1.5 mb-4">
          <RatingStars rating={product.rating} count={product.reviewsCount} />
        </div>
        
        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between gap-4 pt-3 border-t border-line/30">
          <PriceTag price={product.price} originalPrice={product.originalPrice} />
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              if (!isAuthenticated) {
                navigate('/auth');
              } else {
                addItem(product);
                openCart(); // Trigger the premium Slide-Over drawer!
              }
            }}
            disabled={!product.inStock}
            className="flex items-center justify-center gap-1 bg-ink text-surface hover:bg-jade hover:text-surface px-3 py-2 rounded-lg font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
