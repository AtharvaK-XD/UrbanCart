import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, Sparkles, HelpCircle, ArrowRight, ShoppingCart } from 'lucide-react'
import productsData from '../data/products.json'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your UrbanCart shopping assistant. How can I help you find what you are looking for today?',
      quickReplies: [
        { label: '⚡ Bestsellers', query: 'bestseller' },
        { label: '👕 Men\'s Fashion', query: 'mens clothing' },
        { label: '👗 Women\'s Fashion', query: 'womens fashion' },
        { label: '📦 Track Order', query: 'track order' }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Hide chatbot on the login/auth page
  const isAuthPage = location.pathname === '/auth'

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      // Add a tiny delay to allow framer-motion to mount the DOM elements first
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }, [messages, isTyping, isOpen])

  // Return null AFTER all hooks have been called
  if (isAuthPage) return null

  const searchProducts = (query) => {
    if (!query || query.trim() === '') return { terms: [], products: [] }
    const cleanQuery = query.toLowerCase()
    
    // Stop words to filter out noise
    const STOP_WORDS = new Set([
      'show', 'me', 'where', 'are', 'is', 'a', 'the', 'an', 'for', 'to', 'in', 
      'on', 'at', 'of', 'and', 'or', 'with', 'from', 'by', 'about', 'what', 
      'how', 'can', 'you', 'i', 'please', 'find', 'search', 'buy', 'get', 
      'look', 'looking', 'some', 'any', 'that', 'this', 'these', 'those',
      'need', 'want', 'wanna', 'like', 'would', 'could', 'should', 'here',
      'there', 'product', 'products', 'item', 'items', 'store', 'shop'
    ])

    // Extract terms and filter out stop words
    const terms = cleanQuery
      .split(/[^a-zA-Z0-9]+/)
      .filter(t => t.length > 0 && !STOP_WORDS.has(t))

    if (terms.length === 0) return { terms: [], products: [] }

    const products = productsData.map(product => {
      const title = (product.title || '').toLowerCase()
      const description = (product.description || '').toLowerCase()
      const category = (product.category || '').toLowerCase()
      const subCategory = (product.subCategory || '').toLowerCase()
      const brand = (product.brand || '').toLowerCase()
      const tags = (product.tags || []).map(t => t.toLowerCase())
      const material = (product.specifications?.Material || '').toLowerCase()
      const origin = (product.specifications?.Origin || '').toLowerCase()

      let score = 0
      
      const getMatchScore = (text, term, weight) => {
        if (!text) return 0
        if (text === term) return weight * 3
        
        // Exact word boundary check
        const regexExact = new RegExp('\\b' + term + '\\b', 'i')
        if (regexExact.test(text)) return weight * 2
        
        // Prefix word boundary check
        const regexPrefix = new RegExp('\\b' + term, 'i')
        if (regexPrefix.test(text)) return weight * 1.5

        // Plural / singular variants
        let variations = []
        if (term.endsWith('s') && term.length > 3) {
          variations.push(term.slice(0, -1))
        } else if (term.length > 3) {
          variations.push(term + 's')
        }

        for (const variant of variations) {
          if (new RegExp('\\b' + variant + '\\b', 'i').test(text)) return weight * 1.8
          if (new RegExp('\\b' + variant, 'i').test(text)) return weight * 1.3
        }

        // Substring check only for longer keywords to avoid matching short parts of words
        if (term.length > 3 && text.includes(term)) {
          return weight * 0.5
        }
        
        return 0
      }

      terms.forEach(term => {
        score += getMatchScore(title, term, 10)
        tags.forEach(tag => {
          score += getMatchScore(tag, term, 8)
        })
        score += getMatchScore(brand, term, 6)
        score += getMatchScore(subCategory, term, 5)
        score += getMatchScore(category, term, 4)
        score += getMatchScore(description, term, 2)
        score += getMatchScore(material, term, 2)
        score += getMatchScore(origin, term, 1)
      })

      return { ...product, _matchScore: score }
    })
    .filter(product => product._matchScore > 0)
    .sort((a, b) => b._matchScore - a._matchScore)
    .slice(0, 3)

    return { terms, products }
  }

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue
    if (!text.trim()) return

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    // Simulate response delay
    setTimeout(() => {
      setIsTyping(false)
      const cleanText = text.toLowerCase()
      let replyText = ''
      let matchedProducts = []
      let quickReplies = []

      // Help guides
      if (cleanText.includes('track') || cleanText.includes('status') || cleanText.includes('where is my order')) {
        replyText = 'You can easily track your active shipments using our Order Tracking portal! Click here to go to the page.'
        quickReplies = [{ label: '📦 Open Tracker', path: '/track-order' }]
      } else if (cleanText.includes('return') || cleanText.includes('refund') || cleanText.includes('exchange')) {
        replyText = 'UrbanCart offers a complimentary 30-day exchange and return policy. You can register returns online.'
        quickReplies = [{ label: '🛡️ Initiate Return', path: '/returns' }]
      } else if (cleanText.includes('seller') || cleanText.includes('become a seller') || cleanText.includes('merchant')) {
        replyText = 'Interested in listing your own products and reaching millions? Apply now in our onboarding center!'
        quickReplies = [{ label: '🏪 Become a Seller', path: '/become-seller' }]
      } else if (cleanText.includes('help') || cleanText.includes('support') || cleanText.includes('contact') || cleanText.includes('customer care')) {
        replyText = 'Need help? You can explore our interactive FAQs at the Help Center, or contact our support team directly.'
        quickReplies = [{ label: '❓ Help Center', path: '/help' }]
      } else if (cleanText.includes('cart') || cleanText.includes('checkout') || cleanText.includes('buy')) {
        replyText = 'Ready to place your order? View your items in the Cart drawer or head straight to Checkout.'
        quickReplies = [
          { label: '🛒 View Cart', path: '/cart' },
          { label: '💳 Checkout Now', path: '/checkout' }
        ]
      } else {
        // Search in products JSON
        const searchResult = searchProducts(text)
        matchedProducts = searchResult.products
        const searchTerms = searchResult.terms

        // Category mapping
        const categoryMap = {
          'men': "Men's Fashion",
          'shirt': "Men's Fashion",
          'clothing': "Men's Fashion",
          'women': "Women's Fashion",
          'dress': "Women's Fashion",
          'mobile': "Mobiles, Computers",
          'computer': "Mobiles, Computers",
          'laptop': "Mobiles, Computers",
          'phone': "Mobiles, Computers",
          'tv': "TV, Appliances, Electronics",
          'appliance': "TV, Appliances, Electronics",
          'electronics': "TV, Appliances, Electronics",
          'headphone': "TV, Appliances, Electronics",
          'earbud': "TV, Appliances, Electronics",
          'audio': "TV, Appliances, Electronics",
          'home': "Home, Kitchen, Pets",
          'kitchen': "Home, Kitchen, Pets",
          'pet': "Home, Kitchen, Pets",
          'beauty': "Beauty, Health, Grocery",
          'health': "Beauty, Health, Grocery",
          'grocery': "Beauty, Health, Grocery",
          'sport': "Sports, Fitness, Bags, Luggage",
          'fitness': "Sports, Fitness, Bags, Luggage",
          'bag': "Sports, Fitness, Bags, Luggage",
          'luggage': "Sports, Fitness, Bags, Luggage",
          'toy': "Toys, Baby Products, Kids' Fashion",
          'baby': "Toys, Baby Products, Kids' Fashion",
          'kid': "Toys, Baby Products, Kids' Fashion",
          'car': "Car, Motorbike, Industrial",
          'motorbike': "Car, Motorbike, Industrial",
          'industrial': "Car, Motorbike, Industrial",
          'book': "Books"
        }

        const matchedCategories = []
        Object.keys(categoryMap).forEach(key => {
          if (cleanText.includes(key)) {
            const catName = categoryMap[key]
            if (!matchedCategories.includes(catName)) {
              matchedCategories.push(catName)
            }
          }
        })

        if (matchedProducts.length > 0) {
          const matchedTermsString = searchTerms.join(' ')
          replyText = `I found some premium products matching "${matchedTermsString}" that you might love! Feel free to click on them to view detail pages:`
          
          // Add Category shortcut if matched
          matchedCategories.forEach(catName => {
            quickReplies.push({ label: `🛍️ Browse ${catName}`, path: `/category?category=${encodeURIComponent(catName)}` })
          })
          
          // Add standard "Search in Store" link
          quickReplies.push({ label: `🔍 View all results in store`, path: `/category?search=${encodeURIComponent(matchedTermsString)}` })
        } else {
          replyText = `I couldn't find any items directly matching your search. Would you like to check out some of our main categories instead?`
          
          matchedCategories.forEach(catName => {
            quickReplies.push({ label: `🛍️ Browse ${catName}`, path: `/category?category=${encodeURIComponent(catName)}` })
          })
          
          quickReplies.push(
            { label: '⚡ Shop Bestsellers', query: 'bestseller' },
            { label: '👕 Men\'s Fashion', query: 'clothing' },
            { label: '🏠 Home Essentials', query: 'home' }
          )
        }
      }

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        products: matchedProducts,
        quickReplies: quickReplies
      }])
    }, 1200)
  }

  const handleQuickReply = (reply) => {
    if (reply.path) {
      navigate(reply.path)
      setIsOpen(false)
    } else if (reply.query) {
      handleSend(reply.query)
    }
  }

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(5, 150, 105, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-surface shadow-2xl relative transition-colors duration-300 ${
            isOpen ? 'bg-ink' : 'bg-jade'
          }`}
          aria-label="Toggle Shopping Assistant"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <>
              <MessageSquare size={24} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber rounded-full border-2 border-surface flex items-center justify-center animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Assistant Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[550px] max-h-[calc(100vh-120px)] flex flex-col bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden glass-header"
          >
            {/* Header Block */}
            <div className="bg-ink text-surface p-4 flex items-center justify-between border-b border-line">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-jade/20 border border-jade/30 flex items-center justify-center text-jade">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide">UrbanCart Assistant</h3>
                  <span className="text-[10px] text-jade font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={8} className="animate-spin" />
                    Online Shop Companion
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-surface/10 rounded transition text-surface/75 hover:text-surface"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] space-y-2">
                    {/* Message Text Balloon */}
                    <div 
                      className={`p-3 rounded-2xl text-sm leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-jade text-surface rounded-tr-xs'
                          : 'bg-surface border border-line text-ink rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Matched Products Render Panel */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {msg.products.map((prod) => (
                          <Link
                            key={prod.id}
                            to={`/product/${prod.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-2 bg-surface hover:bg-jade/5 border border-line hover:border-jade/30 rounded-xl transition duration-200 group text-left"
                          >
                            <div className="w-12 h-12 bg-background border border-line rounded-lg overflow-hidden flex-shrink-0">
                              <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <span className="text-xs font-semibold text-ink truncate block group-hover:text-jade transition-colors">
                                {prod.title}
                              </span>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-ink/65 font-bold truncate block">{prod.brand}</span>
                                <span className="text-xs font-bold text-jade font-mono">₹{prod.price.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="text-jade p-1 bg-jade/10 rounded-full group-hover:bg-jade group-hover:text-surface transition">
                              <ArrowRight size={12} />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply Badges */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs font-medium px-3 py-1.5 bg-surface hover:bg-jade hover:text-surface border border-line hover:border-jade rounded-full transition duration-150 shadow-xs"
                          >
                            {reply.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Animated Pulse Bubble */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface border border-line text-ink p-3 rounded-2xl rounded-tl-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-ink/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-ink/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-ink/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Block */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-3 border-t border-line bg-surface flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about products, brands, or help..."
                className="flex-grow text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-jade bg-background"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 bg-jade text-surface rounded-lg hover:bg-opacity-90 transition disabled:opacity-40 disabled:hover:bg-opacity-100"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
