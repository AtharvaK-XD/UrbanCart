import { Link } from 'react-router-dom'
import { CreditCard, Wallet, Landmark } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-line mt-auto">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Newsletter */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-display font-bold text-2xl tracking-tighter mb-4 text-ink">UrbanCart</h2>
            <p className="text-ink opacity-80 mb-6 max-w-md">
              Your multi-vendor marketplace for premium, curated goods. Subscribe to our newsletter for exclusive deals.
            </p>
            <form className="flex gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 border border-line rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-jade bg-background"
              />
              <button className="bg-ink text-surface px-6 py-2 rounded-md font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink">
                Subscribe
              </button>
            </form>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-bold mb-4 text-ink">Shop</h3>
            <ul className="space-y-3 text-sm text-ink opacity-80">
              <li><Link to="/category" className="hover:text-jade hover:underline">All Categories</Link></li>
              <li><Link to="/category?filter=deals" className="hover:text-jade hover:underline">Today's Deals</Link></li>
              <li><Link to="/category?filter=new" className="hover:text-jade hover:underline">New Arrivals</Link></li>
              <li><Link to="/category?filter=bestsellers" className="hover:text-jade hover:underline">Bestsellers</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-bold mb-4 text-ink">Support</h3>
            <ul className="space-y-3 text-sm text-ink opacity-80">
              <li><Link to="/help" className="hover:text-jade hover:underline">Help Center</Link></li>
              <li><Link to="/track-order" className="hover:text-jade hover:underline">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-jade hover:underline">Returns</Link></li>
              <li><Link to="/become-seller" className="hover:text-jade hover:underline">Become a Seller</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-line flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink opacity-70">
            © {new Date().getFullYear()} UrbanCart. All rights reserved.
          </p>
          <div className="flex gap-4 opacity-70">
            <CreditCard size={24} />
            <Wallet size={24} />
            <Landmark size={24} />
          </div>
        </div>
      </div>
    </footer>
  )
}
