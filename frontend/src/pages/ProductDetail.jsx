import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, ShieldCheck, Truck, ChevronDown, Star, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import productsData from '../data/products.json'
import reviewsData from '../data/reviews.json'
import { useCartStore } from '../store/useCartStore'
import Breadcrumbs from '../components/Breadcrumbs'
import RatingStars from '../components/RatingStars'
import PriceTag from '../components/PriceTag'
import QuantitySelector from '../components/QuantitySelector'
import Toast from '../components/Toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [openSections, setOpenSections] = useState({ description: true, specifications: false, reviews: false })
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  
  // Interactive Magnifier State
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' })
  const imageContainerRef = useRef(null)

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const addItem = useCartStore(state => state.addItem)
  const openCart = useCartStore(state => state.openCart)

  useEffect(() => {
    const p = productsData.find(x => x.id === id) || productsData[0]
    setProduct(p)
    setReviews(reviewsData.filter(r => r.productId === p.id))
    setActiveImageIdx(0)
  }, [id])

  if (!product) return <div className="p-12 text-center text-ink opacity-70">Loading detailed page...</div>

  const isFashion = product.category === "Men's Fashion" || product.category === "Women's Fashion"

  const handleAddToCart = () => {
    addItem(product, quantity, isFashion ? selectedSize : null)
    openCart() // Automatically open the premium Slide-Over Cart Drawer!
  }

  // Simulated alternate views (uses different scales/rotations to act as product angles)
  const productGallery = [
    { label: 'Front View', style: 'scale-90', isMain: true },
    { label: 'Side Profile', style: 'scale-75 rotate-12', isMain: false },
    { label: 'Macro Texture', style: 'scale-125 translate-x-4', isMain: false }
  ]

  // Mouse Magnifier tracker
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    // Support mouse coordinate calculate
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${product.image})`,
      backgroundSize: '240%'
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' })
  }

  return (
    <div className="flex-1 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8 w-full bg-background/20">
      <Breadcrumbs items={[{ label: product.category, href: `/category?category=${encodeURIComponent(product.category)}` }, { label: product.title }]} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 pt-4">
        
        {/* Interactive Gallery */}
        <div className="space-y-4">
          <div 
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-line/35 shadow-xs bg-grid p-6 flex items-center justify-center cursor-zoom-in"
          >
            <motion.img 
              key={activeImageIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={product.image} 
              alt={product.title} 
              className={`w-4/5 h-4/5 object-contain mix-blend-multiply transition-transform duration-300 ${productGallery[activeImageIdx].style}`} 
            />

            {/* Magnifier Lens Overlay */}
            <div 
              style={zoomStyle}
              className="absolute inset-0 bg-no-repeat pointer-events-none rounded-2xl border-2 border-jade/10 shadow-2xl bg-surface"
            />
            
            <div className="absolute bottom-4 right-4 bg-ink/75 backdrop-blur-xs text-surface p-1.5 rounded-full pointer-events-none">
              <ZoomIn size={14} />
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-surface/75 flex items-center justify-center backdrop-blur-xs">
                <span className="font-bold text-ink tracking-widest uppercase text-sm border border-ink/40 px-4 py-1.5 bg-surface/80 rounded-md">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Alternate Angle Thumbnails */}
          <div className="flex gap-4">
            {productGallery.map((img, index) => (
              <button
                key={img.label}
                onClick={() => setActiveImageIdx(index)}
                className={`w-20 h-20 rounded-xl bg-surface border overflow-hidden p-2 flex items-center justify-center transition-all ${
                  activeImageIdx === index
                    ? 'border-jade bg-jade/5 shadow-md scale-105'
                    : 'border-line/45 hover:border-jade/60 hover:bg-background/40'
                }`}
                title={img.label}
              >
                <img 
                  src={product.image} 
                  alt={img.label} 
                  className={`w-full h-full object-contain mix-blend-multiply ${img.style}`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col">
          <div className="mb-6 pb-6 border-b border-line/35">
            <span className="text-jade font-bold text-xs uppercase tracking-widest block mb-2">{product.category}</span>
            <h1 className="text-3xl font-display font-medium text-ink leading-tight mb-3">{product.title}</h1>
            <div className="flex items-center gap-4 text-xs font-semibold mb-4">
              <RatingStars rating={product.rating} count={product.reviewsCount} />
              <span className="text-line">|</span>
              <span className="text-ink opacity-60">Merchant: <span className="font-bold text-jade">{product.seller || 'UrbanCart Direct'}</span></span>
            </div>
            <PriceTag price={product.price} originalPrice={product.originalPrice} className="text-2xl" />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-jade animate-pulse' : 'bg-amber'}`} />
              <span className="font-bold text-xs uppercase tracking-wider text-ink/75">{product.inStock ? 'In Stock & Ready' : 'Sold Out'}</span>
            </div>
            <p className="text-sm text-ink/70 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          <div className="space-y-6 mb-8 border-y border-line/35 py-6">
            {/* Size Selector for Clothing */}
            {isFashion && (
              <div className="flex flex-col gap-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-ink/50">Choose Size</span>
                <div className="flex gap-2.5">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 border rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        selectedSize === size
                          ? 'border-jade bg-jade text-surface shadow-xs scale-105'
                          : 'border-line text-ink/70 hover:border-jade hover:text-jade bg-surface'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="font-bold text-xs uppercase tracking-wider text-ink/50">Quantity</span>
              <QuantitySelector quantity={quantity} onChange={setQuantity} max={10} />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-surface border-2 border-jade text-jade px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-jade hover:text-surface disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex justify-center items-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { 
                  if (product.inStock) { 
                    addItem(product, quantity, isFashion ? selectedSize : null)
                    navigate('/checkout')
                  } 
                }}
                disabled={!product.inStock}
                className={`flex-1 px-6 py-3.5 rounded-xl font-bold text-sm text-center flex justify-center items-center transition-all duration-300 ${
                  product.inStock 
                    ? 'bg-ink text-surface hover:bg-jade shadow-md' 
                    : 'bg-line text-ink opacity-40 cursor-not-allowed'
                }`}
              >
                Purchase Instantly
              </motion.button>
            </div>
          </div>

          {/* Secure Trust Badges */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-ink/60 border-b border-line/35 pb-6 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-background border border-line/30 rounded-lg">
                <Truck size={15} className="text-jade" />
              </div>
              <span>Free Courier Express<br/><span className="text-[9px] opacity-60 font-medium">Auto-applied today</span></span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-background border border-line/30 rounded-lg">
                <ShieldCheck size={15} className="text-jade" />
              </div>
              <span>UrbanCart Secure Protection<br/><span className="text-[9px] opacity-60 font-medium">100% verified checkouts</span></span>
            </div>
          </div>

          {/* Product Information Accordions */}
          <div className="space-y-3">
            
            {/* Description Tab */}
            <div className="border border-line/45 rounded-xl overflow-hidden bg-surface shadow-2xs">
              <button 
                onClick={() => toggleSection('description')}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-ink/80 hover:bg-background/30 transition-all"
              >
                <span>Product Details</span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${openSections.description ? 'rotate-180 text-jade' : 'opacity-50'}`} 
                />
              </button>
              <AnimatePresence initial={false}>
                {openSections.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-4 pt-0 border-t border-line/30 text-xs opacity-75 leading-relaxed text-ink space-y-2">
                      <p>{product.description}</p>
                      <p>
                        Every element is verified for materials and performance grade. Sourced from certified merchants to maintain strict authenticity standards.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Specifications Tab */}
            <div className="border border-line/45 rounded-xl overflow-hidden bg-surface shadow-2xs">
              <button 
                onClick={() => toggleSection('specifications')}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-ink/80 hover:bg-background/30 transition-all"
              >
                <span>Technical Specifications</span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${openSections.specifications ? 'rotate-180 text-jade' : 'opacity-50'}`} 
                />
              </button>
              <AnimatePresence initial={false}>
                {openSections.specifications && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-4 pt-0 border-t border-line/30">
                      <table className="w-full text-xs text-left border-collapse">
                        <tbody>
                          {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                            <tr key={key} className="border-b border-line/30 last:border-0">
                              <td className="py-2.5 font-bold text-ink/50 w-2/5 capitalize">{key}</td>
                              <td className="py-2.5 font-medium text-ink">{value}</td>
                            </tr>
                          )) : (
                            <>
                              <tr className="border-b border-line/30"><td className="py-2.5 font-bold text-ink/50 w-2/5">Package Weight</td><td className="py-2.5 font-medium text-ink">1.2 lbs</td></tr>
                              <tr className="border-b border-line/30"><td className="py-2.5 font-bold text-ink/50">Model Dimensions</td><td className="py-2.5 font-medium text-ink">8 x 8 x 12 inches</td></tr>
                              <tr className="border-b border-line/30 last:border-0"><td className="py-2.5 font-bold text-ink/50">Primary Material</td><td className="py-2.5 font-medium text-ink">Premium Engineered Blend</td></tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Customer Reviews Tab */}
            <div className="border border-line/45 rounded-xl overflow-hidden bg-surface shadow-2xs">
              <button 
                onClick={() => toggleSection('reviews')}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-ink/80 hover:bg-background/30 transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>Customer Reviews</span>
                  <span className="bg-jade/10 text-jade px-2 py-0.5 rounded-full text-[9px] font-bold">
                    {reviews.length}
                  </span>
                </span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${openSections.reviews ? 'rotate-180 text-jade' : 'opacity-50'}`} 
                />
              </button>
              <AnimatePresence initial={false}>
                {openSections.reviews && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-4 pt-0 border-t border-line/30 text-xs">
                      {reviews.length > 0 ? (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                          {reviews.map(review => (
                            <div key={review.id} className="border-b border-line/20 last:border-0 pb-3 last:pb-0 pt-3 first:pt-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-xs text-ink/80">{review.user}</span>
                                <span className="text-[9px] text-ink/40 font-mono">{review.date}</span>
                              </div>
                              <div className="flex items-center gap-0.5 mb-1.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={9} 
                                    className={i < review.rating ? 'fill-amber text-amber' : 'text-line'} 
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-ink/70 leading-relaxed font-light">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="opacity-50 text-xs py-2">No reviews have been written for this product yet.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
