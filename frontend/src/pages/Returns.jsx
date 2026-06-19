import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, RefreshCw, ClipboardList, CheckCircle2, Download, Printer, ArrowLeft } from 'lucide-react'
import Toast from '../components/Toast'

export default function Returns() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('defective')
  const [comments, setComments] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  
  // RMA Code generated on submit
  const [rmaCode, setRmaCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Generate a random RMA code
    const randomRma = `RMA-${Math.floor(100000 + Math.random() * 900000)}`
    setRmaCode(randomRma)
    setIsSubmitted(true)
  }

  const handleDownload = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="flex-1 bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {showToast && <Toast message="Prepaid shipping label downloaded successfully!" onClose={() => setShowToast(false)} />}

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="return-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-display font-bold text-ink mb-4">Returns & Refunds Portal</h1>
              <p className="text-ink opacity-70 max-w-md mx-auto font-light">
                Submit a return request and print a prepaid shipping label in minutes.
              </p>
            </div>

            {/* Policy Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "30-Day Window", desc: "Returns must be initiated within 30 days of shipment receipt.", icon: ShieldAlert },
                { title: "Complimentary Label", desc: "Pre-paid return labels are generated at zero charge to you.", icon: RefreshCw },
                { title: "Speedy Refunds", desc: "Refunds are processed within 5-7 business days of delivery.", icon: ClipboardList }
              ].map(policy => {
                const Icon = policy.icon
                return (
                  <div key={policy.title} className="bg-surface border border-line rounded-lg p-5 flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-jade/10 text-jade rounded-md flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-ink mb-1">{policy.title}</h3>
                      <p className="text-xs text-ink opacity-70 leading-relaxed font-light">{policy.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Return Request Form */}
            <div className="bg-surface border border-line rounded-lg p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-ink mb-6">Initiate Your Return</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Order ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ORD-1234"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Reason for Return</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm"
                  >
                    <option value="defective">Defective / Damaged product</option>
                    <option value="wrong_item">Received wrong item</option>
                    <option value="size_fit">Size or fit issues</option>
                    <option value="not_matching">Item does not match description</option>
                    <option value="buyer_remorse">No longer needed / Changed my mind</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Additional details (Optional)</label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide details about the item's condition or issue..."
                    className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-ink text-surface py-3 rounded-md font-semibold hover:bg-opacity-90 transition-all text-sm shadow-md"
                >
                  Generate Shipping Label
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="return-success"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-8 max-w-2xl mx-auto"
          >
            {/* Return Success Header */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-jade/10 text-jade rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-3xl font-display font-bold text-ink">Return Label Generated</h1>
              <p className="text-ink opacity-70 text-sm max-w-md mx-auto">
                Your request has been approved. Print the pre-paid shipping label below, pack your items, and drop the package at any authorized shipping hub.
              </p>
            </div>

            {/* Printable Shipping Label Card */}
            <div className="bg-surface border-4 border-dashed border-ink p-8 rounded-lg shadow-sm space-y-8 font-mono text-ink">
              <div className="flex justify-between items-start border-b-2 border-ink pb-4">
                <div>
                  <span className="text-[10px] font-bold block">CARRIER:</span>
                  <span className="font-bold text-sm">BLUEDART LOGISTICS</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold block">AUTHORIZATION CODE:</span>
                  <span className="font-bold text-sm">{rmaCode}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-xs">
                <div>
                  <span className="text-[10px] font-bold block opacity-60">FROM:</span>
                  <span className="font-bold">Customer Returns Hub</span><br/>
                  <span>Pune, Maharashtra - 411001</span><br/>
                  <span>Email: {email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold block opacity-60">SHIP TO:</span>
                  <span className="font-bold">UrbanCart Fulfillment Center</span><br/>
                  <span>Returns Logistics Hub, Block B-4</span><br/>
                  <span>Mumbai, Maharashtra - 400072</span>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="flex flex-col items-center justify-center py-6 border-y-2 border-ink gap-2 bg-background/25">
                <div className="flex h-16 w-64 items-center justify-center select-none gap-[2px]">
                  {Array.from({ length: 48 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className="h-full bg-ink" 
                      style={{ width: randomWidth(idx) }}
                    />
                  ))}
                </div>
                <span className="text-xs tracking-[0.4em] font-semibold">{rmaCode}-{orderId.toUpperCase().replace('-', '')}</span>
              </div>

              <div className="text-[10px] opacity-75 leading-relaxed space-y-1">
                <h4 className="font-bold text-ink mb-1 uppercase">Drop-Off Instructions:</h4>
                <p>1. Place your items securely inside a shipping box or bag.</p>
                <p>2. Print this shipping label and tape it flat onto the outside of the package.</p>
                <p>3. Take the package to any authorized BlueDart location or request a local pickup.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setIsSubmitted(false)}
                className="flex items-center gap-2 px-6 py-2.5 border border-line rounded-md font-medium hover:bg-background transition-colors text-sm"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-jade text-surface px-6 py-2.5 rounded-md font-semibold hover:bg-opacity-90 transition-all text-sm shadow-sm"
              >
                <Download size={16} /> Download PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-ink text-surface px-6 py-2.5 rounded-md font-semibold hover:bg-opacity-90 transition-all text-sm shadow-sm"
              >
                <Printer size={16} /> Print Label
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper function to simulate a random barcode width sequence
function randomWidth(index) {
  const widths = ['1px', '2px', '3px', '4px']
  // Seed-like behavior using index
  return widths[(index * 7 + 3) % widths.length]
}
