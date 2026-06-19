import { Link } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'

export default function OrderConfirmation() {
  const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 4) // 4 days from now

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-20">
      <div className="w-20 h-20 bg-jade/10 text-jade rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={40} />
      </div>
      
      <h1 className="text-3xl font-display font-bold mb-4">Order Confirmed!</h1>
      <p className="text-ink opacity-80 mb-8 max-w-md text-center">
        Thank you for your purchase. We've received your order and will begin processing it right away.
      </p>

      <div className="bg-surface border border-line rounded-md p-6 max-w-sm w-full mb-8">
        <div className="flex justify-between mb-4 pb-4 border-b border-line text-sm">
          <span className="opacity-70">Order Number</span>
          <span className="font-mono font-bold">{orderNumber}</span>
        </div>
        <div className="flex items-start gap-4">
          <Package className="text-jade flex-shrink-0" size={24} />
          <div>
            <div className="font-medium text-sm">Estimated Delivery</div>
            <div className="text-ink opacity-70 text-sm">{deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/order-history" className="px-6 py-2 border border-line rounded-md font-medium hover:bg-background transition-colors">
          View Orders
        </Link>
        <Link to="/" className="bg-jade text-surface px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
