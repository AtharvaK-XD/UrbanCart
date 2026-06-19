import { Link } from 'react-router-dom'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import EmptyState from '../components/EmptyState'
import QuantitySelector from '../components/QuantitySelector'

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore()
  const total = useCartStore(state => state.getCartTotal())
  
  const shipping = 0
  const finalTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="flex-1 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-16 w-full">
        <EmptyState 
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet."
          action={
            <Link to="/category" className="bg-jade text-surface px-6 py-2 rounded-md font-medium hover:bg-opacity-90 inline-block">
              Start Shopping
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8 w-full">
      <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map(({ product, quantity, size }) => (
            <div key={`${product.id}-${size}`} className="flex gap-4 p-4 bg-surface border border-line rounded-md relative">
              <div className="w-24 h-24 flex-shrink-0 bg-background rounded-sm overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${product.id}`} className="font-medium text-ink hover:text-jade line-clamp-1">
                      {product.title}
                    </Link>
                    <div className="text-xs text-ink opacity-60 mb-2 flex items-center gap-2 flex-wrap">
                      <span>{product.category}</span>
                      {size && (
                        <span className="px-1.5 py-0.5 bg-line rounded text-[10px] font-bold text-ink font-mono uppercase tracking-wider">
                          Size: {size}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-right ml-4">
                    ₹{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
                
                <div className="mt-auto flex items-center justify-between">
                  <QuantitySelector 
                    quantity={quantity} 
                    onChange={(q) => updateQuantity(product.id, q, size)} 
                    max={10} 
                  />
                  <button 
                    onClick={() => removeItem(product.id, size)}
                    className="text-amber hover:text-opacity-80 p-2"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 flex-shrink-0 bg-surface border border-line rounded-md p-6 sticky top-24">
          <h2 className="font-display font-bold text-xl mb-6">Order Summary</h2>
          
          <div className="space-y-4 text-sm mb-6 border-b border-line pb-6">
            <div className="flex justify-between">
              <span className="opacity-70">Subtotal</span>
              <span className="font-mono">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Shipping</span>
              <span className="font-mono">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold">Total</span>
            <span className="font-mono font-bold text-xl">₹{finalTotal.toFixed(2)}</span>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Promo Code</label>
            <div className="flex">
              <input type="text" className="w-full border border-line rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-jade" placeholder="Enter code" />
              <button className="bg-background border border-line border-l-0 px-4 rounded-r-md text-sm font-medium hover:bg-line/50 transition-colors">Apply</button>
            </div>
          </div>

          <Link 
            to="/checkout"
            className="w-full block text-center bg-jade text-surface px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-jade focus:ring-offset-2 focus:ring-offset-surface"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
