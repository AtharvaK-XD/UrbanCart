import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CreditCard, Copy, Loader2, AlertCircle, ShieldCheck, Smartphone, QrCode } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/useCartStore'

export default function Checkout() {
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Review
  const navigate = useNavigate()
  const { items, getCartTotal, clearCart } = useCartStore()
  
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', zip: '' })
  const [errors, setErrors] = useState({})

  // UPI Payment Integration States
  const [timeLeft, setTimeLeft] = useState(300)
  const [copied, setCopied] = useState(false)
  const [utr, setUtr] = useState('')
  const [utrError, setUtrError] = useState('')
  const [payeeVpa, setPayeeVpa] = useState(() => {
    try {
      const saved = localStorage.getItem('seller_bank_details')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.upiId) return parsed.upiId
      }
    } catch (e) {
      console.error(e)
    }
    return '9662743525@ptaxis'
  })

  const [payeeName, setPayeeName] = useState(() => {
    try {
      const saved = localStorage.getItem('seller_bank_details')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.accountName) return parsed.accountName
      }
    } catch (e) {
      console.error(e)
    }
    return 'Store Merchant'
  })

  const [isVerifying, setIsVerifying] = useState(false)
  const [txnRef, setTxnRef] = useState('')

  useEffect(() => {
    if (step === 2) {
      setTimeLeft(300)
      setTxnRef(`UC${Math.floor(1000000000 + Math.random() * 9000000000)}`)
    }
  }, [step])

  useEffect(() => {
    if (step !== 2) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [step])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(payeeVpa)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerifyPayment = () => {
    if (!/^\d{12}$/.test(utr)) {
      setUtrError('Please enter a valid 12-digit numeric UPI Ref / UTR number')
      return
    }
    setUtrError('')
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setStep(3)
    }, 2500)
  }

  const validateAddress = () => {
    const newErrors = {}
    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!address.street.trim()) newErrors.street = 'Street address is required'
    if (!address.city.trim()) newErrors.city = 'City is required'
    if (!address.zip.trim() || !/^\d{5,6}(-\d{4})?$/.test(address.zip)) newErrors.zip = 'Valid ZIP code is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1 && validateAddress()) setStep(2)
    else if (step === 2) setStep(3)
  }

  const handlePlaceOrder = () => {
    clearCart()
    navigate('/order-confirmation')
  }

  if (items.length === 0 && step === 1) {
    navigate('/cart')
    return null
  }

  const total = getCartTotal()
  const shipping = 0
  const finalTotal = total

  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-display font-bold mb-8 text-center">Checkout</h1>

      {/* Premium Step Indicator */}
      <div className="max-w-xl mx-auto mb-12 relative px-4">
        {/* Background Track Line */}
        <div className="absolute left-6 right-6 top-5 h-[3px] bg-line -translate-y-1/2 rounded-full overflow-hidden">
          {/* Animated Progress Line */}
          <motion.div 
            className="h-full bg-jade"
            initial={{ width: "0%" }}
            animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>

        {/* Step Nodes */}
        <div className="flex items-center justify-between relative z-10">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' }
          ].map((s) => {
            const isActive = step >= s.num
            const isCompleted = step > s.num
            
            return (
              <div key={s.num} className="flex flex-col items-center gap-3">
                {/* Node Circle */}
                <motion.div 
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? "var(--color-jade, #059669)" : "var(--color-surface, #ffffff)",
                    borderColor: isCompleted || isActive ? "var(--color-jade, #059669)" : "var(--color-line, #e2e8f0)",
                    scale: step === s.num ? 1.15 : 1.0,
                    boxShadow: step === s.num ? "0 0 15px rgba(5, 150, 105, 0.3)" : "none"
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    isActive ? 'text-surface' : 'text-ink opacity-50 bg-surface'
                  } relative`}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check size={18} strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <span>{s.num}</span>
                  )}

                  {/* Active pulsing ring */}
                  {step === s.num && (
                    <span className="absolute -inset-1.5 rounded-full border border-jade opacity-40 animate-ping"></span>
                  )}
                </motion.div>

                {/* Node Label */}
                <motion.span 
                  animate={{
                    color: isActive ? "var(--color-ink, #0f172a)" : "var(--color-ink-light, #64748b)",
                    fontWeight: isActive ? 600 : 400,
                    opacity: isActive ? 1 : 0.5
                  }}
                  className="text-xs uppercase tracking-wider font-semibold"
                >
                  {s.label}
                </motion.span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-surface border border-line rounded-md p-6 sm:p-8">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-display font-bold mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={address.fullName}
                  onChange={e => { setAddress({...address, fullName: e.target.value}); if(errors.fullName) setErrors({...errors, fullName: ''}) }}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${errors.fullName ? 'border-amber focus:ring-amber' : 'border-line focus:ring-jade'}`}
                />
                {errors.fullName && <p className="text-amber text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input 
                  type="text" 
                  value={address.street}
                  onChange={e => { setAddress({...address, street: e.target.value}); if(errors.street) setErrors({...errors, street: ''}) }}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${errors.street ? 'border-amber focus:ring-amber' : 'border-line focus:ring-jade'}`}
                />
                {errors.street && <p className="text-amber text-xs mt-1">{errors.street}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input 
                    type="text" 
                    value={address.city}
                    onChange={e => { setAddress({...address, city: e.target.value}); if(errors.city) setErrors({...errors, city: ''}) }}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${errors.city ? 'border-amber focus:ring-amber' : 'border-line focus:ring-jade'}`}
                  />
                  {errors.city && <p className="text-amber text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input 
                    type="text" 
                    value={address.zip}
                    onChange={e => { setAddress({...address, zip: e.target.value}); if(errors.zip) setErrors({...errors, zip: ''}) }}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${errors.zip ? 'border-amber focus:ring-amber' : 'border-line focus:ring-jade'}`}
                  />
                  {errors.zip && <p className="text-amber text-xs mt-1">{errors.zip}</p>}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={handleNextStep} className="bg-ink text-surface px-6 py-2 rounded-md font-medium hover:bg-opacity-90">
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="relative">
            {/* Loading/Verification overlay */}
            {isVerifying && (
              <div className="absolute inset-0 bg-surface bg-opacity-95 flex flex-col items-center justify-center z-50 rounded-md">
                <Loader2 className="animate-spin text-jade mb-4" size={48} />
                <h3 className="font-display font-bold text-lg mb-2">Verifying Payment Status</h3>
                <p className="text-sm opacity-70 max-w-xs text-center">
                  Querying the UPI gateway networks to confirm deposit. Please do not close this window.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-6">
              {/* Header block */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-line pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-jade bg-opacity-10 text-jade rounded-full">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold leading-tight">Secure UPI Gateway</h2>
                    <p className="text-xs opacity-60 font-medium">Verified Direct Bank Settlement</p>
                  </div>
                </div>
                {timeLeft > 0 ? (
                  <div className="flex items-center gap-2 bg-amber bg-opacity-10 text-amber border border-amber border-opacity-20 px-3 py-1.5 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber animate-pulse"></span>
                    <span>Session Expires: <span className="font-mono font-bold">{formatTime(timeLeft)}</span></span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red bg-opacity-10 text-red border border-red border-opacity-20 px-3 py-1.5 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-red"></span>
                    <span>Session Expired!</span>
                  </div>
                )}
              </div>

              {timeLeft <= 0 ? (
                <div className="p-8 border border-line rounded-md bg-background flex flex-col items-center justify-center text-center">
                  <AlertCircle size={48} className="text-amber mb-4" />
                  <h3 className="font-display font-bold text-lg mb-2">Payment Window Timed Out</h3>
                  <p className="text-sm opacity-70 max-w-sm mb-6">
                    For security, your transaction session has expired. Please restart the checkout process.
                  </p>
                  <button 
                    onClick={() => { setStep(1); setTimeLeft(300); }} 
                    className="bg-ink text-surface px-6 py-2.5 rounded-md font-medium hover:bg-opacity-90"
                  >
                    Restart Checkout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Instructions and copying VPA */}
                  <div className="md:col-span-7 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-ink opacity-60">Payment Details</h3>
                      
                      {/* Merchant/Payee Card */}
                      <div className="p-4 border border-line rounded-md bg-background space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="opacity-70">Merchant/Payee:</span>
                          <span className="font-bold">{payeeName}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="opacity-70">Amount Payable:</span>
                          <span className="font-bold text-lg text-jade font-mono">₹{finalTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="opacity-70">Transaction Ref:</span>
                          <span className="font-mono text-xs font-bold">{txnRef}</span>
                        </div>
                        <div className="border-t border-line pt-3 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold opacity-60">UPI ID / VPA</span>
                            <span className="text-sm font-mono font-bold">{payeeVpa}</span>
                          </div>
                          <button 
                            onClick={handleCopyVpa}
                            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 border border-line rounded bg-surface hover:bg-background transition"
                          >
                            {copied ? (
                              <>
                                <Check size={14} className="text-jade" />
                                <span className="text-jade font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copy ID</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-ink opacity-60 font-display">How to pay</h3>
                      <ol className="text-sm space-y-2 list-decimal list-inside opacity-80 leading-relaxed">
                        <li>Open your preferred UPI mobile app (Google Pay, PhonePe, Paytm, BHIM, etc.).</li>
                        <li>Scan the QR code displayed on screen or copy the UPI ID and pay.</li>
                        <li>Verify that the Payee is <strong>{payeeName.toUpperCase()}</strong> and the amount is exactly <strong>₹{finalTotal.toFixed(2)}</strong>.</li>
                        <li>After paying, copy the 12-digit transaction ID / UTR / UPI Ref No. from your bank confirmation screen and paste it below.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Right Column: QR Code & Logos */}
                  <div className="md:col-span-5 flex flex-col items-center p-6 border border-line rounded-md bg-background text-center relative overflow-hidden">
                    {/* Subtle scanning laser line effect */}
                    <div className="absolute left-0 right-0 top-0 h-[2px] bg-jade bg-opacity-50 animate-[bounce_3s_infinite] pointer-events-none"></div>

                    {/* QR Desktop Frame */}
                    <div className="hidden md:flex flex-col items-center w-full">
                      <div className="p-3 bg-white rounded-md border border-line shadow-sm mb-4">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                            `upi://pay?pa=${payeeVpa}&pn=${encodeURIComponent(payeeName)}&tr=${txnRef}&am=${finalTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Order " + txnRef)}`
                          )}`}
                          alt="Payment QR Code"
                          width={180}
                          height={180}
                          className="block"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-jade font-bold mb-4">
                        <QrCode size={14} />
                        <span>Scan QR Code to Pay</span>
                      </div>
                    </div>

                    {/* Mobile Direct Pay Button */}
                    <div className="md:hidden w-full mb-6">
                      <a 
                        href={`upi://pay?pa=${payeeVpa}&pn=${encodeURIComponent(payeeName)}&tr=${txnRef}&am=${finalTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Order " + txnRef)}`}
                        className="w-full bg-jade text-surface px-5 py-3 rounded-md font-bold text-center hover:bg-opacity-95 flex items-center justify-center gap-2 shadow-sm transition"
                      >
                        <Smartphone size={18} />
                        <span>Pay with UPI App</span>
                      </a>
                      <p className="text-[11px] opacity-65 mt-2">
                        Launches Google Pay, PhonePe, Paytm, or BHIM automatically.
                      </p>
                    </div>

                    {/* Branding Strip */}
                    <div className="w-full border-t border-line pt-4 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Supported Apps</span>
                      <div className="flex flex-wrap justify-center items-center gap-3 opacity-60 font-medium tracking-tight">
                        <span className="text-xs">GPay</span>
                        <span className="text-xs opacity-30">•</span>
                        <span className="text-xs">PhonePe</span>
                        <span className="text-xs opacity-30">•</span>
                        <span className="text-xs">Paytm</span>
                        <span className="text-xs opacity-30">•</span>
                        <span className="text-xs">BHIM UPI</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {timeLeft > 0 && (
                <div className="border-t border-line pt-6 mt-4 space-y-4">
                  {/* UTR Verification Input */}
                  <div className="bg-surface p-4 border border-line rounded-md max-w-md mx-auto">
                    <label className="block text-sm font-bold mb-1.5">Enter 12-Digit UPI Ref / UTR No.</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        maxLength={12}
                        value={utr}
                        onChange={e => {
                          setUtr(e.target.value.replace(/\D/g, ''));
                          if(utrError) setUtrError('');
                        }}
                        placeholder="e.g. 629854129841"
                        className={`font-mono text-sm w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${utrError ? 'border-amber focus:ring-amber' : 'border-line focus:ring-jade'}`}
                      />
                      <button 
                        onClick={handleVerifyPayment} 
                        disabled={isVerifying}
                        className="bg-jade text-surface px-4 py-2 rounded-md text-sm font-bold hover:bg-opacity-90 transition shrink-0 flex items-center justify-center"
                      >
                        Verify & Pay
                      </button>
                    </div>
                    {utrError && <p className="text-amber text-xs mt-1.5 flex items-center gap-1 font-medium"><AlertCircle size={12} /> {utrError}</p>}
                  </div>

                  {/* Back button */}
                  <div className="flex justify-start">
                    <button 
                      onClick={() => setStep(1)} 
                      className="px-6 py-2 rounded-md font-medium text-ink opacity-70 hover:opacity-100"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-display font-bold mb-6">Review Order</h2>
            <div className="space-y-6">
              <div className="border border-line rounded-md overflow-hidden">
                <div className="bg-background px-4 py-3 border-b border-line font-medium text-sm">Order Items</div>
                <div className="p-4 space-y-4">
                  {items.map(({ product, quantity, size }) => (
                    <div key={`${product.id}-${size}`} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <span className="opacity-60">{quantity}x</span>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.title}</span>
                          {size && (
                            <span className="text-[10px] text-ink opacity-60 font-bold uppercase tracking-wider">
                              Size: {size}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono">₹{(product.price * quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-line rounded-md overflow-hidden">
                <div className="bg-background px-4 py-3 border-b border-line font-medium text-sm">Shipping To</div>
                <div className="p-4 text-sm opacity-80">
                  {address.fullName}<br/>
                  {address.street}<br/>
                  {address.city}, {address.zip}
                </div>
              </div>

              <div className="border-t border-line pt-4 space-y-2 text-sm">
                <div className="flex justify-between opacity-80">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>Shipping</span>
                  <span className="font-mono">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="font-mono">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-2 rounded-md font-medium text-ink opacity-70 hover:opacity-100">
                Back
              </button>
              <button onClick={handlePlaceOrder} className="bg-jade text-surface px-8 py-3 rounded-md font-bold hover:bg-opacity-90 shadow-md">
                Confirm & Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
