import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore()
  const total = useCartStore(state => state.getCartTotal())
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const navigate = useNavigate()

  const freeShippingThreshold = 200
  const isFreeShipping = total >= freeShippingThreshold
  const amountNeeded = freeShippingThreshold - total
  const progressPercent = Math.min((total / freeShippingThreshold) * 100, 100)

  const handleCheckoutClick = () => {
    closeCart()
    if (!isAuthenticated) {
      navigate('/auth')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-line shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="text-jade" size={22} />
                <h2 className="font-display font-bold text-xl text-ink">Your Cart</h2>
                <span className="bg-jade/10 text-jade text-xs font-bold px-2 py-0.5 rounded-full font-mono">
                  {items.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 rounded-full hover:bg-background text-ink opacity-70 hover:opacity-100 transition-all hover:rotate-90 duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Tracker */}
            {items.length > 0 && (
              <div className="px-6 py-4 bg-background/50 border-b border-line flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-ink">
                  <Truck size={16} className="text-jade animate-pulse" />
                  {isFreeShipping ? (
                    <span className="font-bold text-jade">Congratulations! You get free delivery!</span>
                  ) : (
                    <span>Add <span className="font-bold font-mono">₹{amountNeeded.toFixed(2)}</span> more to qualify for <span className="font-bold text-jade">Free Shipping</span></span>
                  )}
                </div>
                <div className="w-full bg-line h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-jade h-full rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 text-ink opacity-40">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-ink mb-1">Your cart is empty</h3>
                    <p className="text-xs text-ink opacity-60 max-w-xs mx-auto mb-6">
                      Looks like you haven't discovered anything yet. Browse our signature collections to find inspiration.
                    </p>
                    <button
                      onClick={() => {
                        closeCart()
                        navigate('/category')
                      }}
                      className="bg-jade text-surface px-6 py-2.5 rounded-md font-bold text-xs hover:bg-opacity-95 transition-all glow-jade hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Start Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map(({ product, quantity, size }) => (
                    <motion.div
                      key={`${product.id}-${size}`}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                      className="flex gap-4 p-4 bg-surface border border-line rounded-lg hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                      <div className="w-20 h-20 bg-background rounded overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                        <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                      </div>

                      <div className="flex flex-col flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            onClick={closeCart}
                            className="font-medium text-sm text-ink hover:text-jade transition-colors truncate block"
                          >
                            {product.title}
                          </Link>
                          <button
                            onClick={() => removeItem(product.id, size)}
                            className="text-amber hover:text-opacity-80 p-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        
                        <div className="text-[10px] text-ink opacity-50 font-medium capitalize mt-0.5 flex items-center gap-2">
                          <span>{product.category}</span>
                          {size && (
                            <span className="bg-line px-1 rounded font-bold uppercase text-[9px]">{size}</span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-auto pt-2">
                          {/* Quantity selectors */}
                          <div className="flex items-center border border-line rounded bg-background">
                            <button
                              disabled={quantity <= 1}
                              onClick={() => updateQuantity(product.id, quantity - 1, size)}
                              className="p-1 text-ink opacity-60 hover:opacity-100 disabled:opacity-30 transition-all"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 font-mono text-xs font-bold">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1, size)}
                              className="p-1 text-ink opacity-60 hover:opacity-100 transition-all"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="font-mono font-bold text-sm text-ink">
                            ₹{(product.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-line bg-background/30 flex flex-col gap-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink opacity-70">Subtotal</span>
                    <span className="font-mono font-medium">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink opacity-70">Shipping</span>
                    <span className="font-mono font-medium text-jade">
                      {isFreeShipping ? 'Complimentary' : 'Calculated next'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-line/60 pt-3">
                    <span className="font-bold text-ink text-base">Estimated Total</span>
                    <span className="font-mono font-bold text-lg text-ink">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={() => {
                      closeCart()
                      navigate('/cart')
                    }}
                    className="border border-line hover:border-ink text-ink font-bold text-xs py-3 rounded-md hover:bg-background transition-colors text-center"
                  >
                    View Shopping Bag
                  </button>
                  <button
                    onClick={handleCheckoutClick}
                    className="bg-jade text-surface font-bold text-xs py-3 rounded-md hover:bg-opacity-95 transition-all text-center flex items-center justify-center gap-1.5 glow-jade hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Checkout Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
