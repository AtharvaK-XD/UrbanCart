import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mail, Phone, Clock, MessageSquare, ChevronDown, HelpCircle, Shield, Truck, CreditCard, User } from 'lucide-react'
import Toast from '../components/Toast'

const FAQ_DATA = [
  {
    id: 'faq1',
    category: 'shipping',
    icon: Truck,
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days. Express delivery options (1-2 business days) are available during checkout for an additional charge. Sourcing from regional merchant hubs can sometimes affect delivery schedules.'
  },
  {
    id: 'faq2',
    category: 'returns',
    icon: Shield,
    question: 'What is your return policy?',
    answer: 'We offer a 30-day free return policy on most products. Items must be in their original packaging, unused, and in resellable condition. You can request a return and print a pre-paid shipping label directly from our Returns portal.'
  },
  {
    id: 'faq3',
    category: 'payments',
    icon: CreditCard,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, UPI, net banking, and popular mobile wallets. All transactions are securely processed via industry-standard payment gateways.'
  },
  {
    id: 'faq4',
    category: 'account',
    icon: User,
    question: 'How do I change my account details?',
    answer: 'To update your name, email, or other personal profile information, click the Account link at the top right of the navbar. There, you can edit your profile settings or modify saved addresses.'
  },
  {
    id: 'faq5',
    category: 'shipping',
    icon: Truck,
    question: 'Can I change my shipping address after placing an order?',
    answer: 'We process orders quickly, but if you contact us within 1 hour of placing the order, we can update the shipping address. Once the status shows "Shipped" in our Track Order page, no further changes can be made.'
  },
  {
    id: 'faq6',
    category: 'returns',
    icon: Shield,
    question: 'When will I receive my refund?',
    answer: 'Once our merchant partners receive and inspect your returned package, your refund is processed within 5-7 business days. The funds will be returned to the original payment method used during checkout.'
  }
]

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedFaqId, setExpandedFaqId] = useState(null)
  
  // Support Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  
  const handleContactSubmit = (e) => {
    e.preventDefault()
    setShowToast(true)
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
    setTimeout(() => setShowToast(false), 4000)
  }

  // Filter FAQs
  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex-1 bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {showToast && <Toast message="Support ticket sent successfully! We will email you within 24 hours." onClose={() => setShowToast(false)} />}

      {/* Header Banner */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-ink mb-4">How can we help you?</h1>
        <p className="text-ink opacity-70 max-w-xl mx-auto mb-8 font-light">
          Find answers to frequently asked questions about orders, payments, accounts, shipping, and returns.
        </p>
        
        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search help articles, FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-jade bg-surface shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 text-ink opacity-40" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Categories */}
        <div className="space-y-6">
          <div className="bg-surface border border-line rounded-lg p-6 shadow-sm">
            <h2 className="font-display font-bold text-lg mb-4 text-ink">Browse Topics</h2>
            <div className="flex flex-col gap-2">
              {[
                { id: 'all', label: 'All FAQs', icon: HelpCircle },
                { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
                { id: 'returns', label: 'Returns & Refunds', icon: Shield },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'account', label: 'Account Settings', icon: User }
              ].map(cat => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id)
                      setExpandedFaqId(null)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-jade text-surface font-semibold shadow-sm'
                        : 'text-ink opacity-75 hover:bg-line/20 hover:opacity-100'
                    }`}
                  >
                    <Icon size={18} />
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Customer Support Info Card */}
          <div className="bg-surface border border-line rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-lg text-ink">Need Direct Support?</h2>
            <div className="space-y-3 text-sm text-ink opacity-80">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-jade" />
                <span>support@urbancart.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-jade" />
                <span>1-800-123-4567</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Clock size={16} className="text-jade" />
                <span>Mon-Sat, 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: FAQ Accordion and Ticket Form */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-surface border border-line rounded-lg p-6 sm:p-8 shadow-sm">
            <h2 className="font-display font-bold text-2xl text-ink mb-6">Frequently Asked Questions</h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="divide-y divide-line">
                {filteredFaqs.map(faq => {
                  const expanded = expandedFaqId === faq.id
                  return (
                    <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                      <button
                        onClick={() => setExpandedFaqId(expanded ? null : faq.id)}
                        className="w-full flex justify-between items-center text-left py-2 font-medium text-ink hover:text-jade transition-colors"
                      >
                        <span className="pr-4">{faq.question}</span>
                        <ChevronDown 
                          size={18} 
                          className={`text-ink opacity-60 transition-transform duration-300 ${expanded ? 'rotate-180 text-jade opacity-100' : ''}`} 
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm text-ink opacity-70 leading-relaxed pt-2 pb-4">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm opacity-60 text-center py-8">No matching help articles found.</p>
            )}
          </div>

          {/* Ticket Form */}
          <div className="bg-surface border border-line rounded-lg p-6 sm:p-8 shadow-sm">
            <h2 className="font-display font-bold text-2xl text-ink mb-2 flex items-center gap-2">
              <MessageSquare size={24} className="text-jade" /> Create Support Ticket
            </h2>
            <p className="text-sm text-ink opacity-70 mb-6 font-light">
              Can't find what you need? Fill in the form below and we will review your request.
            </p>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink opacity-60 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-jade bg-background text-sm resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-ink text-surface py-2.5 rounded-md font-semibold hover:bg-opacity-90 transition-all text-sm shadow-sm"
              >
                Send Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
