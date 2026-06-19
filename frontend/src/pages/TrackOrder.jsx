import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Package, Truck, Compass, CheckCircle2, Search, ArrowRight, ShieldCheck, MapPin } from 'lucide-react'

// Simulated orders database
const MOCK_TRACKING_DB = {
  "ORD-1234": {
    orderId: "ORD-1234",
    status: 3, // Shipped
    carrier: "BlueDart Express",
    trackingNumber: "BD987654321IN",
    estDelivery: "June 21, 2026",
    currentLocation: "Sorting Facility, Mumbai",
    history: [
      { date: "June 16, 2026 - 14:30 PM", loc: "Sorting Facility, Mumbai", status: "Departed hub" },
      { date: "June 16, 2026 - 09:15 AM", loc: "Processing Center, Pune", status: "In transit" },
      { date: "June 15, 2026 - 17:45 PM", loc: "Pune Hub", status: "Shipped from origin" },
      { date: "June 15, 2026 - 10:00 AM", loc: "UrbanCart Seller Hub", status: "Order Processed" }
    ]
  },
  "ORD-9874": {
    orderId: "ORD-9874",
    status: 4, // Out for Delivery
    carrier: "DHL Express",
    trackingNumber: "DHL1122334455",
    estDelivery: "Today, June 17, 2026",
    currentLocation: "Local Delivery Hub, Delhi",
    history: [
      { date: "June 17, 2026 - 08:30 AM", loc: "Local Delivery Hub, Delhi", status: "Out for delivery with courier" },
      { date: "June 16, 2026 - 19:45 PM", loc: "Sorting Facility, Delhi NCR", status: "Arrived at local hub" },
      { date: "June 16, 2026 - 05:20 AM", loc: "Main Gateway, Mumbai", status: "In transit" },
      { date: "June 15, 2026 - 11:30 AM", loc: "Pune Hub", status: "Departed hub" },
      { date: "June 14, 2026 - 14:00 PM", loc: "UrbanCart Seller Hub", status: "Order Placed & Confirmed" }
    ]
  }
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams()
  const queryOrderId = searchParams.get('orderId')
  
  const [orderId, setOrderId] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (queryOrderId) {
      setOrderId(queryOrderId)
      const formattedId = queryOrderId.toUpperCase().trim()
      const match = MOCK_TRACKING_DB[formattedId]

      if (match) {
        setTrackingData(match)
      } else if (/^ORD-\d{4}$/i.test(formattedId) || formattedId.length > 3) {
        const deliveryDate = new Date()
        deliveryDate.setDate(deliveryDate.getDate() + 3)
        setTrackingData({
          orderId: formattedId,
          status: 2, // Processing
          carrier: "Standard Parcel Post",
          trackingNumber: `SP${Math.floor(100000000 + Math.random() * 900000000)}IN`,
          estDelivery: deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          currentLocation: "Origin Sorting Hub",
          history: [
            { date: "June 16, 2026 - 18:00 PM", loc: "Origin Sorting Hub", status: "Arrived at facility" },
            { date: "June 16, 2026 - 11:00 AM", loc: "Seller Dispatch Hub", status: "Order Picked up & processed" },
            { date: "June 15, 2026 - 22:30 PM", loc: "UrbanCart System", status: "Order Confirmed" }
          ]
        })
      } else {
        setError('Order ID not found.')
      }
    }
  }, [queryOrderId])

  const handleTrack = (e) => {
    e.preventDefault()
    setError('')
    setTrackingData(null)

    const formattedId = orderId.toUpperCase().trim()
    const match = MOCK_TRACKING_DB[formattedId]

    if (match) {
      setTrackingData(match)
    } else {
      // If it doesn't match, let's create a simulated standard layout so they can test any ID
      if (/^ORD-\d{4}$/i.test(formattedId) || formattedId.length > 3) {
        // Create random tracking data
        const deliveryDate = new Date()
        deliveryDate.setDate(deliveryDate.getDate() + 3)
        setTrackingData({
          orderId: formattedId,
          status: 2, // Processing
          carrier: "Standard Parcel Post",
          trackingNumber: `SP${Math.floor(100000000 + Math.random() * 900000000)}IN`,
          estDelivery: deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          currentLocation: "Origin Sorting Hub",
          history: [
            { date: "June 16, 2026 - 18:00 PM", loc: "Origin Sorting Hub", status: "Arrived at facility" },
            { date: "June 16, 2026 - 11:00 AM", loc: "Seller Dispatch Hub", status: "Order Picked up & processed" },
            { date: "June 15, 2026 - 22:30 PM", loc: "UrbanCart System", status: "Order Confirmed" }
          ]
        })
      } else {
        setError('Order ID not found. Try searching for "ORD-1234" or "ORD-9874"!')
      }
    }
  }

  const steps = [
    { label: 'Confirmed', icon: ShieldCheck },
    { label: 'Processing', icon: Package },
    { label: 'Shipped', icon: Truck },
    { label: 'Out for Delivery', icon: Compass },
    { label: 'Delivered', icon: CheckCircle2 }
  ]

  return (
    <div className="flex-1 bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-ink mb-4">Track Your Shipment</h1>
        <p className="text-ink opacity-70 max-w-md mx-auto mb-8 font-light">
          Enter your order tracking ID to get real-time delivery status updates.
        </p>

        {/* Search Input */}
        <form onSubmit={handleTrack} className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="e.g. ORD-1234 or ORD-9874"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-jade bg-surface shadow-sm font-mono text-sm"
            />
            <Search className="absolute left-4 top-3.5 text-ink opacity-40" size={20} />
          </div>
          <button
            type="submit"
            className="bg-jade text-surface px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-sm text-sm"
          >
            Track <ArrowRight size={16} />
          </button>
        </form>
        {error && <p className="text-amber text-sm mt-3 font-medium">{error}</p>}
      </div>

      {trackingData && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Tracking Summary */}
          <div className="bg-surface border border-line rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-line pb-6 mb-8 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink opacity-50">Tracking Order</span>
                <h2 className="text-xl font-mono font-bold text-ink">{trackingData.orderId}</h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink opacity-50 block">Estimated Delivery</span>
                <span className="font-semibold text-jade">{trackingData.estDelivery}</span>
              </div>
            </div>

            {/* Steps Progress Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative py-4">
              {/* Desktop Progress Line */}
              <div className="absolute left-4 right-4 top-[28px] h-[2px] bg-line -z-10 hidden md:block">
                <div 
                  className="bg-jade h-full transition-all duration-500" 
                  style={{ width: `${(trackingData.status - 1) * 25}%` }}
                />
              </div>
              
              {steps.map((step, idx) => {
                const stepNum = idx + 1
                const isCompleted = stepNum < trackingData.status
                const isActive = stepNum === trackingData.status
                const Icon = step.icon
                
                return (
                  <div key={step.label} className="flex md:flex-col items-center gap-4 md:gap-2 flex-grow md:text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted ? 'border-jade bg-jade text-surface' :
                      isActive ? 'border-jade bg-surface text-jade scale-110 shadow-md' :
                      'border-line bg-surface text-ink opacity-40'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-jade' : isCompleted ? 'text-ink' : 'opacity-40'}`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="text-[10px] text-jade font-medium animate-pulse md:block mt-0.5">
                          In Transit
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-surface border border-line rounded-lg p-6 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-lg text-ink">Courier Details</h3>
                <div className="text-sm space-y-3 opacity-80">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Carrier</span>
                    <span className="font-medium text-ink">{trackingData.carrier}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Tracking Number</span>
                    <span className="font-mono font-medium text-ink">{trackingData.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Last Location</span>
                    <span className="font-medium text-ink">{trackingData.currentLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="md:col-span-2 bg-surface border border-line rounded-lg p-6 sm:p-8 shadow-sm">
              <h3 className="font-display font-bold text-lg text-ink mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-jade" /> Shipment History
              </h3>
              
              <div className="relative pl-6 border-l border-line space-y-8 ml-2">
                {trackingData.history.map((log, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Bullet */}
                    <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 bg-surface ${idx === 0 ? 'border-jade bg-jade scale-110' : 'border-line'}`}></div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4">
                      <div>
                        <h4 className={`text-sm font-bold ${idx === 0 ? 'text-jade' : 'text-ink'}`}>{log.status}</h4>
                        <p className="text-xs text-ink opacity-60 mt-0.5">{log.loc}</p>
                      </div>
                      <span className="text-[10px] font-mono text-ink opacity-40">{log.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
