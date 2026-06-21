import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  ChevronRight, 
  Printer, 
  MessageSquare, 
  X,
  Sparkles,
  Settings,
  Bell,
  Grid,
  List,
  ChevronDown,
  Send,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  FileText,
  Check,
  User,
  Shield,
  HelpCircle,
  TrendingDown,
  Sun,
  Moon,
  Upload
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { supabase, isSupabaseLinked, getOrders, requestPayout } from '../lib/db'

// Initial mock datasets (persisted in localStorage)
const DEFAULT_PRODUCTS = [
  {
    id: "PROD-101",
    sku: "UC-CER-V15",
    title: "Minimalist Ceramic Vases",
    price: 45.00,
    category: "Home, Kitchen, Pets",
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    sales: 124,
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=300&auto=format&fit=crop",
    brand: "Artisan Co.",
    description: "A beautiful hand-thrown ceramic vase with a matte glaze finish, perfect for modern floral arrangements."
  },
  {
    id: "PROD-102",
    sku: "UC-LIN-T03",
    title: "Linen Throw Blanket",
    price: 89.99,
    category: "Home, Kitchen, Pets",
    inStock: true,
    stockCount: 3,
    rating: 4.6,
    sales: 89,
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=300&auto=format&fit=crop",
    brand: "Loom & Flax",
    description: "Breathable and soft natural flax linen throw blanket, pre-washed for extra texture and comfort."
  },
  {
    id: "PROD-103",
    sku: "UC-BRE-K88",
    title: "Matte Black Pour-Over Kettle",
    price: 35.50,
    category: "Home, Kitchen, Pets",
    inStock: false,
    stockCount: 0,
    rating: 4.9,
    sales: 231,
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=300&auto=format&fit=crop",
    brand: "BrewMaster",
    description: "Gooseneck stainless steel kettle in a sleek matte black finish, offering precise flow control for pour-over coffee."
  },
  {
    id: "PROD-104",
    sku: "UC-TSH-M12",
    title: "Organic Cotton Tee",
    price: 24.99,
    category: "Fashion",
    inStock: true,
    stockCount: 45,
    rating: 4.5,
    sales: 312,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300&auto=format&fit=crop",
    brand: "UrbanWear",
    description: "Premium heavy-weight organic cotton tee. Garment dyed for a broken-in texture and vintage color."
  },
  {
    id: "PROD-105",
    sku: "UC-GLS-T04",
    title: "Ribbed Glass Tumblers (Set of 4)",
    price: 28.00,
    category: "Home, Kitchen, Pets",
    inStock: true,
    stockCount: 22,
    rating: 4.7,
    sales: 154,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=300&auto=format&fit=crop",
    brand: "Artisan Co.",
    description: "Set of four mouth-blown borosilicate ribbed tumblers, heat-resistant and dishwasher safe."
  },
  {
    id: "PROD-106",
    sku: "UC-LTS-D09",
    title: "Leather Desk Mat",
    price: 59.99,
    category: "Books & Stationeries",
    inStock: true,
    stockCount: 8,
    rating: 4.4,
    sales: 62,
    image: "https://images.unsplash.com/photo-1629131726692-1accd0c53db0?q=80&w=300&auto=format&fit=crop",
    brand: "CraftShed",
    description: "Full-grain vegetable tanned leather writing mat, burnished edges with non-slip suede backing."
  }
]

const DEFAULT_ORDERS = [
  {
    id: "ORD-8472",
    date: "2026-06-16T10:30:00Z",
    customer: "Michael Scott",
    email: "michael.scott@dundermifflin.com",
    address: "1725 Slough Avenue, Scranton, PA 18505",
    total: 45.00,
    status: "Processing",
    trackingNumber: "",
    notes: "Please pack with extra bubble wrap. Needs to be presented as a Dundee reward.",
    items: [{ title: "Minimalist Ceramic Vases", quantity: 1, price: 45.00 }]
  },
  {
    id: "ORD-8473",
    date: "2026-06-15T14:20:00Z",
    customer: "Jim Halpert",
    email: "jim.halpert@dundermifflin.com",
    address: "834 Maple Street, Scranton, PA 18503",
    total: 125.49,
    status: "Shipped",
    trackingNumber: "IN-90812-TRK",
    notes: "Standard delivery requested. Left note: Leave at back porch.",
    items: [
      { title: "Linen Throw Blanket", quantity: 1, price: 89.99 },
      { title: "Matte Black Pour-Over Kettle", quantity: 1, price: 35.50 }
    ]
  },
  {
    id: "ORD-8470",
    date: "2026-06-10T09:15:00Z",
    customer: "Pam Beesly",
    email: "pam.beesly@dundermifflin.com",
    address: "1725 Slough Avenue, Scranton, PA 18505",
    total: 28.00,
    status: "Delivered",
    trackingNumber: "IN-87163-TRK",
    notes: "Ordered rib glasses. Super excited!",
    items: [{ title: "Ribbed Glass Tumblers (Set of 4)", quantity: 1, price: 28.00 }]
  },
  {
    id: "ORD-8469",
    date: "2026-06-08T16:40:00Z",
    customer: "Dwight Schrute",
    email: "dwight.schrute@schrutebeetfarms.com",
    address: "Route 6, Beet Farm Road, Scranton, PA 18512",
    total: 119.98,
    status: "Delivered",
    trackingNumber: "IN-86921-TRK",
    notes: "Leave with the farm hands if I am not in the beet field.",
    items: [{ title: "Leather Desk Mat", quantity: 2, price: 59.99 }]
  }
]

const DEFAULT_PAYOUTS = [
  { id: "PAY-19283", date: "2026-06-01", amount: 1540.20, method: "Bank Transfer", account: "HDFC Bank - *8723", status: "Completed" },
  { id: "PAY-19254", date: "2026-05-15", amount: 3200.50, method: "Bank Transfer", account: "HDFC Bank - *8723", status: "Completed" },
  { id: "PAY-19112", date: "2026-05-01", amount: 940.00, method: "UPI Payout", account: "9662743525@ptaxis", status: "Completed" }
]

const DEFAULT_NOTIFICATIONS = [
  { id: "notif-1", title: "New Order Received", message: "Michael Scott placed order ORD-8472", type: "order", date: "2026-06-16T10:32:00Z", read: false },
  { id: "notif-2", title: "Low Stock Alert", message: "Linen Throw Blanket stock is down to 3 units", type: "stock", date: "2026-06-15T18:12:00Z", read: false },
  { id: "notif-3", title: "Payout Disbursed", message: "Payout PAY-19283 of ₹1,540.20 completed successfully", type: "payout", date: "2026-06-01T08:00:00Z", read: true }
]

const CUSTOMER_DIRECTORY = [
  { id: "cust-1", name: "Michael Scott", email: "michael.scott@dundermifflin.com", orders: 1, spent: 45.00, rating: 4.8, status: "Active", tier: "VIP", initials: "MS" },
  { id: "cust-2", name: "Jim Halpert", email: "jim.halpert@dundermifflin.com", orders: 2, spent: 125.49, rating: 5.0, status: "Active", tier: "VIP", initials: "JH" },
  { id: "cust-3", name: "Pam Beesly", email: "pam.beesly@dundermifflin.com", orders: 1, spent: 28.00, rating: 4.9, status: "Active", tier: "Repeat", initials: "PB" },
  { id: "cust-4", name: "Dwight Schrute", email: "dwight.schrute@schrutebeetfarms.com", orders: 1, spent: 119.98, rating: 4.2, status: "Idle", tier: "Repeat", initials: "DS" }
]

const CHAT_CHARACTER_RESPONSES = {
  "Michael Scott": [
    "Should we order some custom mugs? I need them for the Dundies. Also, do you accept corporate credit cards from Dunder Mifflin?",
    "That's what she said! Haha, sorry, couldn't help it. Anyway, love the products. Excellent quality, maybe you can sponsor our office newsletter.",
    "I am not superstitious, but I am a little stitious. I want to buy 10 more vases for my office. Let me know if we can do a bulk deal.",
    "Hey! If you ship this quickly, I will make you the Assistant regional merchant of the year. It's a big honor, trust me."
  ],
  "Jim Halpert": [
    "Hey! The packaging was great. Dwight tried to inspect it for 'contraband', but I got it first. Will order again.",
    "Do you sell any staplers? I need to put one in yellow jello. Long story. It's for a coworker prank.",
    "Pam loves the vases! Thanks for the quick shipping. Appreciate it. It looks perfect in her art studio.",
    "Oh, hey. Just checking on my order. Dwight is getting nervous that it's a threat to national security. Let me know!"
  ],
  "Pam Beesly": [
    "The ceramic vase has a really nice texture. I'm planning to use it in my watercolor still-life class! Do you have others with matte finishes?",
    "Quick question, do you offer customized gift wrapping? I'm sending a throw blanket to my mom for her birthday.",
    "Thanks for the swift delivery. Everything was beautiful, and the customer service was lovely.",
    "Hi there! The glass tumblers are gorgeous. They make our kitchen look so much better. Thanks again!"
  ],
  "Dwight Schrute": [
    "Vases are inefficient containers. A glass jar is superior. However, the quality is acceptable. 4 out of 5 beets.",
    "Warning: If this package is damaged during shipping, I will initiate a formal grievance protocol. Fortunately, it arrived intact. Good job.",
    "Do you sell pitchforks or fertilizer? No? Inefficient store design. But the black kettle is decent for brewing beet tea.",
    "I am Dwight Schrute, Assistant to the Regional Manager. I demand to know if your leather mats are from genuine North American cattle."
  ]
}

// Cubic Bezier interpolation helper for curved SVG line graphs
const getBezierCurvePath = (points) => {
  if (points.length === 0) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const cpX1 = p0.x + (p1.x - p0.x) / 2
    const cpY1 = p0.y
    const cpX2 = p0.x + (p1.x - p0.x) / 2
    const cpY2 = p1.y
    d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`
  }
  return d
}

// Rolling Counter for numbers
function AnimatedNumber({ value, isCurrency = false }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = displayValue
    const end = parseFloat(value)
    if (start === end) return

    const duration = 750 // ms
    const startTime = performance.now()

    const updateValue = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = progress * (2 - progress) // Ease out quad
      const current = start + (end - start) * easeProgress
      
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      } else {
        setDisplayValue(end)
      }
    }

    requestAnimationFrame(updateValue)
  }, [value])

  if (isCurrency) {
    return (
      <span>
        ₹{displayValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    )
  }
  return <span>{Math.round(displayValue).toLocaleString()}</span>
}

export default function SellerDashboard() {
  const { user, role } = useAuthStore()
  
  // Dashboard configuration tabs: dashboard, inventory, orders, payments, customers, settings
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Dark mode has been disabled per user request
  const darkMode = false;

  // Always Load Demo Data
  const [products, setProducts] = useState(DEFAULT_PRODUCTS)
  
  const [orders, setOrders] = useState(DEFAULT_ORDERS)

  const [payouts, setPayouts] = useState(DEFAULT_PAYOUTS)

  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS)

  const [walletBalance, setWalletBalance] = useState(4850.50)

  useEffect(() => {
    async function fetchDatabaseData() {
      if (isSupabaseLinked && user) {
        try {
          // Check profile role to see if it's out-of-sync
          const { data: dbProfile, error: profileErr } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          // Show detailed debug information about the session roles
          showFeedback(`Debug Info: UID=${user.id.substring(0,8)} Zustand=${role} DB=${dbProfile?.role} Err=${profileErr?.message || 'none'}`)

          if (profileErr) {
            console.error('Error fetching database profile:', profileErr)
            if (profileErr.code === 'PGRST116' || profileErr.message?.includes('single JSON object') || profileErr.message?.includes('coerced')) {
              // Profile doesn't exist, create it!
              console.log('Profile row missing. Auto-creating profile...')
              const { error: insertErr } = await supabase
                .from('profiles')
                .upsert({
                  id: user.id,
                  email: user.email,
                  full_name: user.name || user.email.split('@')[0],
                  role: 'SELLER'
                })
              if (!insertErr) {
                showFeedback('Seller profile registered in database successfully!')
              } else {
                console.error('Failed to create profile row:', insertErr.message)
                showFeedback(`Profile Create Failed: ${insertErr.message}`, 'error')
              }
            } else {
              showFeedback(`Profile Fetch Error: ${profileErr.message}`, 'error')
            }
          } else if (dbProfile && dbProfile.role !== 'SELLER') {
            console.log('Detecting out-of-sync profile role. Attempting auto-sync...')
            const { error: syncErr } = await supabase
              .from('profiles')
              .update({ role: 'SELLER' })
              .eq('id', user.id)

            const { error: authSyncErr } = await supabase.auth.updateUser({
              data: { role: 'SELLER' }
            })

            if (!syncErr && !authSyncErr) {
              showFeedback('Seller status successfully synced with database!')
            } else {
              const errMsg = (syncErr?.message || '') + ' ' + (authSyncErr?.message || '')
              console.error('Failed to auto-sync seller role:', syncErr, authSyncErr)
              showFeedback(`Auto-Sync Failed: ${errMsg}`, 'error')
            }
          }

          // Fetch products
          const { data: dbProducts, error: prodErr } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', user.id)
            
          if (!prodErr && dbProducts) {
            setProducts(dbProducts.map(p => ({
              id: p.id,
              sku: p.sku || `UC-${p.category.slice(0,3).toUpperCase()}-${p.id.slice(0,4).toUpperCase()}`,
              title: p.title,
              price: Number(p.price),
              category: p.category,
              inStock: p.stock_count > 0,
              stockCount: p.stock_count,
              rating: Number(p.rating),
              sales: p.sales || 0,
              image: p.image,
              brand: p.brand,
              description: p.description
            })))
          }

          // Fetch orders
          const liveOrders = await getOrders(user.id, true)
          if (liveOrders) {
            setOrders(liveOrders)
          }
        } catch (e) {
          console.error("Dashboard DB fetch error:", e)
        }
      }
    }
    fetchDatabaseData()
  }, [user])

  const [bankDetails, setBankDetails] = useState({
    payoutMethod: 'bank', // bank or upi
    bankName: 'HDFC Bank',
    accountName: user ? user.name : 'Store Merchant',
    accountNumber: '•••• •••• •••• 8723',
    ifscCode: 'HDFC0000241',
    upiId: '9662743525@ptaxis'
  })

  const [shopSettings, setShopSettings] = useState({
    storeName: "UrbanCart Showcase",
    description: "Fine curated goods for the modern home, featuring hand-thrown ceramics, premium linens, and artisan desk accessories.",
    bannerColor: 'jade', // jade, amber, ink, purple, rose
    supportEmail: "atharkul.merchant@urbancart.co",
    shippingDays: "3-5 Business Days"
  })

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('seller_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('seller_orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('seller_payouts', JSON.stringify(payouts))
  }, [payouts])

  useEffect(() => {
    localStorage.setItem('seller_notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem('seller_wallet_balance', walletBalance.toString())
  }, [walletBalance])

  useEffect(() => {
    localStorage.setItem('seller_bank_details', JSON.stringify(bankDetails))
  }, [bankDetails])

  useEffect(() => {
    localStorage.setItem('seller_shop_settings', JSON.stringify(shopSettings))
  }, [shopSettings])

  // UI state variables
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const showFeedback = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000)
  }

  // Live Timer Clock
  const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Header Dropdowns
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [merchantStatus, setMerchantStatus] = useState('Online')

  // Analytics tab filters
  const [timeRange, setTimeRange] = useState('30D')
  const [hoveredSalesPoint, setHoveredSalesPoint] = useState(null)
  
  // Inventory tab states
  const [viewMode, setViewMode] = useState('table')
  const [invSearch, setInvSearch] = useState('')
  const [invCategory, setInvCategory] = useState('All')
  const [invStockFilter, setInvStockFilter] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    stockCount: '',
    category: 'Home, Kitchen, Pets',
    brand: '',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200&auto=format&fit=crop',
    description: '',
    sku: ''
  })

  // Orders Tab states
  const [orderView, setOrderView] = useState('kanban')
  const [orderSearch, setOrderSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [trackingInput, setTrackingInput] = useState('')
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [internalNote, setInternalNote] = useState('')

  // Payout tab states
  const [payoutStep, setPayoutStep] = useState('idle')
  const [payoutProgress, setPayoutProgress] = useState(0)

  // CRM Chat states
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMER_DIRECTORY[0])
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('seller_chat_history')
    return saved ? JSON.parse(saved) : {
      "Michael Scott": [
        { sender: 'customer', text: 'Hey there! I ordered the Ceramic Vase yesterday. Let me know when you ship it!', time: 'Yesterday' }
      ],
      "Jim Halpert": [
        { sender: 'customer', text: 'Hi, the blanket arrived and it is incredibly soft. Pam loves it!', time: '2 days ago' },
        { sender: 'merchant', text: 'Awesome! So glad to hear that, Jim. Let us know if you need anything else.', time: '2 days ago' }
      ],
      "Pam Beesly": [
        { sender: 'customer', text: 'Hi! Can you do a watercolor texture match? Or is the white vase purely matte?', time: '3 days ago' }
      ],
      "Dwight Schrute": [
        { sender: 'customer', text: 'I require full tracking documentation sent to Schrute Farms office.', time: '4 days ago' }
      ]
    }
  })
  const [messageText, setMessageText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('seller_chat_history', JSON.stringify(chatMessages))
  }, [chatMessages])

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [chatMessages, selectedCustomer, isTyping])

  // Spotlight mouse tracker on cards
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  // Calculate stats based on filters
  const revenue = orders.reduce((sum, o) => sum + o.total, 0)
  
  // Date Range Stats Multipliers (to simulate date selector updates)
  const statsMultipliers = {
    'Today': { rev: 0.12, ord: 0.15, vis: 0.08, conv: 1.05 },
    '7D': { rev: 0.35, ord: 0.40, vis: 0.32, conv: 0.98 },
    '30D': { rev: 1.0, ord: 1.0, vis: 1.0, conv: 1.0 },
    'YTD': { rev: 4.8, ord: 5.2, vis: 4.5, conv: 1.12 }
  }
  
  const activeMultiplier = statsMultipliers[timeRange] || statsMultipliers['30D']
  const displayRevenue = revenue * activeMultiplier.rev
  const displayOrders = Math.round(orders.length * activeMultiplier.ord)
  const displayVisitors = Math.round(1840 * activeMultiplier.vis)
  const displayConv = 3.24 * activeMultiplier.conv
  const displayAvgOrder = displayOrders > 0 ? displayRevenue / displayOrders : 0

  // Chart data sets based on range
  const salesTrends = {
    'Today': [
      { label: '09:00', sales: 120, visitors: 45 },
      { label: '11:00', sales: 420, visitors: 110 },
      { label: '13:00', sales: 250, visitors: 95 },
      { label: '15:00', sales: 890, visitors: 220 },
      { label: '17:00', sales: 600, visitors: 180 },
      { label: '19:00', sales: 1200, visitors: 310 }
    ],
    '7D': [
      { label: 'Mon', sales: 1200, visitors: 450 },
      { label: 'Tue', sales: 890, visitors: 390 },
      { label: 'Wed', sales: 2300, visitors: 780 },
      { label: 'Thu', sales: 1540, visitors: 610 },
      { label: 'Fri', sales: 3100, visitors: 980 },
      { label: 'Sat', sales: 2800, visitors: 920 },
      { label: 'Sun', sales: 3400, visitors: 1100 }
    ],
    '30D': [
      { label: 'Week 1', sales: 8400, visitors: 3100 },
      { label: 'Week 2', sales: 11200, visitors: 4300 },
      { label: 'Week 3', sales: 9800, visitors: 3900 },
      { label: 'Week 4', sales: 14600, visitors: 5800 }
    ],
    'YTD': [
      { label: 'Jan', sales: 34000, visitors: 11200 },
      { label: 'Feb', sales: 28000, visitors: 9800 },
      { label: 'Mar', sales: 42000, visitors: 14500 },
      { label: 'Apr', sales: 51000, visitors: 18900 },
      { label: 'May', sales: 63000, visitors: 22400 },
      { label: 'Jun', sales: 74000, visitors: 26100 }
    ]
  }

  const activeTrend = salesTrends[timeRange] || salesTrends['30D']

  // Category distributions
  const categorySplit = products.reduce((acc, p) => {
    const cat = p.category.includes('Fashion') ? 'Fashion' : 
                p.category.includes('Books') ? 'Books & Stationary' : 'Home & Kitchen';
    acc[cat] = (acc[cat] || 0) + (p.sales || 10);
    return acc;
  }, {})

  const categoryColors = {
    'Home & Kitchen': '#1B7A5E',
    'Fashion': '#E8A33D',
    'Books & Stationary': '#6366F1'
  }

  const totalSalesUnits = Object.values(categorySplit).reduce((a, b) => a + b, 0)

  // Notification utilities
  const unreadNotifCount = notifications.filter(n => !n.read).length
  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    showFeedback('All notifications marked as read.')
  }

  // Inventory actions
  const handleIncrementStock = async (id) => {
    const matched = products.find(p => p.id === id)
    if (!matched) return
    const newCount = matched.stockCount + 1

    if (isSupabaseLinked) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ stock_count: newCount })
          .eq('id', id)
        if (error) throw error
      } catch (err) {
        console.error("DB increment stock error:", err.message)
        return
      }
    }
    setProducts(products.map(p => p.id === id ? { ...p, stockCount: newCount, inStock: true } : p))
  }

  const handleDecrementStock = async (id) => {
    const matched = products.find(p => p.id === id)
    if (!matched) return
    const newCount = Math.max(0, matched.stockCount - 1)

    if (isSupabaseLinked) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ stock_count: newCount })
          .eq('id', id)
        if (error) throw error
      } catch (err) {
        console.error("DB decrement stock error:", err.message)
        return
      }
    }
    setProducts(products.map(p => p.id === id ? { ...p, stockCount: newCount, inStock: newCount > 0 } : p))
  }

  const handleInlinePriceChange = async (id, value) => {
    const parsed = parseFloat(value)
    if (isNaN(parsed) || parsed <= 0) {
      showFeedback('Please enter a valid price.', 'error')
      return
    }

    if (isSupabaseLinked) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ price: parsed })
          .eq('id', id)
        if (error) throw error
      } catch (err) {
        console.error("DB price change error:", err.message)
        showFeedback('Failed to update price in database.', 'error')
        return
      }
    }
    setProducts(products.map(p => p.id === id ? { ...p, price: parsed } : p))
    showFeedback('Price updated successfully!')
  }

  const handleImageUpload = (e, mode) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showFeedback('Image file is too large. Max limit is 5MB.', 'error')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 600
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
        
        if (mode === 'add') {
          setNewProduct(prev => ({ ...prev, image: compressedBase64 }))
        } else if (mode === 'edit') {
          setEditingProduct(prev => ({ ...prev, image: compressedBase64 }))
        }
        showFeedback('Photo uploaded and optimized successfully!')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!newProduct.title || !newProduct.price) {
      showFeedback('Title and price are required.', 'error')
      return
    }

    const skuCode = newProduct.sku || `UC-${newProduct.category.slice(0,3).toUpperCase()}-${Math.floor(100+Math.random()*900)}`
    
    let generatedId = `PROD-${Math.floor(107 + Math.random() * 900)}`

    if (isSupabaseLinked && user) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([
            {
              seller_id: user.id,
              title: newProduct.title,
              brand: newProduct.brand || 'Generic',
              price: parseFloat(newProduct.price),
              category: newProduct.category,
              stock_count: parseInt(newProduct.stockCount) || 0,
              image: newProduct.image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200&auto=format&fit=crop',
              description: newProduct.description || 'No description supplied.',
              tags: []
            }
          ])
          .select()
          .single();
        if (error) throw error;
        generatedId = data.id;
      } catch (err) {
        console.error("DB add product error:", err)
        showFeedback(`Failed to add product (ID: ${user?.id}, Email: ${user?.email}): ${err.message}`, 'error')
        return
      }
    }

    const entry = {
      id: generatedId,
      sku: skuCode,
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      inStock: parseInt(newProduct.stockCount) > 0,
      stockCount: parseInt(newProduct.stockCount) || 0,
      rating: 5.0,
      sales: 0,
      image: newProduct.image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200&auto=format&fit=crop',
      brand: newProduct.brand || 'Generic',
      description: newProduct.description || 'No description supplied.'
    }

    setProducts([entry, ...products])
    setIsAddModalOpen(false)
    setNewProduct({
      title: '',
      price: '',
      stockCount: '',
      category: 'Home, Kitchen, Pets',
      brand: '',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200&auto=format&fit=crop',
      description: '',
      sku: ''
    })

    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: "Product Created",
        message: `${entry.title} added with SKU ${entry.sku}`,
        type: "stock",
        date: new Date().toISOString(),
        read: false
      },
      ...notifications
    ])

    showFeedback('Product successfully added to inventory!')
  }

  const handleEditProductSubmit = async (e) => {
    e.preventDefault()
    if (!editingProduct.title || !editingProduct.price) {
      showFeedback('Title and price are required.', 'error')
      return
    }

    if (isSupabaseLinked) {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            title: editingProduct.title,
            price: parseFloat(editingProduct.price),
            category: editingProduct.category,
            stock_count: parseInt(editingProduct.stockCount) || 0,
            brand: editingProduct.brand,
            description: editingProduct.description,
            image: editingProduct.image
          })
          .eq('id', editingProduct.id)
        if (error) throw error
      } catch (err) {
        console.error("DB update product error:", err.message)
        showFeedback('Failed to update product in database.', 'error')
        return
      }
    }

    setProducts(products.map(p => p.id === editingProduct.id ? {
      ...editingProduct,
      price: parseFloat(editingProduct.price),
      stockCount: parseInt(editingProduct.stockCount) || 0,
      inStock: parseInt(editingProduct.stockCount) > 0
    } : p))
    setIsEditModalOpen(false)
    setEditingProduct(null)
    showFeedback('Product details saved successfully.')
  }

  const handleDeleteProduct = async (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      if (isSupabaseLinked) {
        try {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
          if (error) throw error
        } catch (err) {
          console.error("DB delete product error:", err.message)
          showFeedback('Failed to delete product from database.', 'error')
          return
        }
      }
      setProducts(products.filter(p => p.id !== id))
      showFeedback('Product listing removed.')
    }
  }

  // Order processing actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    if (isSupabaseLinked) {
      try {
        let updatePayload = { status: newStatus }
        const matched = orders.find(o => o.id === orderId)
        if (newStatus === 'Shipped' && matched && !matched.trackingNumber) {
          updatePayload.tracking_number = `IN-${Math.floor(10000+Math.random()*90000)}-TRK`
        }
        
        const { error } = await supabase
          .from('orders')
          .update(updatePayload)
          .eq('id', orderId)
        if (error) throw error
      } catch (err) {
        console.error("DB order status update error:", err.message)
        showFeedback('Failed to update order status in database.', 'error')
        return
      }
    }

    setOrders(orders.map(o => {
      if (o.id === orderId) {
        let update = { status: newStatus }
        if (newStatus === 'Shipped' && !o.trackingNumber) {
          update.trackingNumber = `IN-${Math.floor(10000+Math.random()*90000)}-TRK`
        }
        return { ...o, ...update }
      }
      return o
    }))
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ 
        ...prev, 
        status: newStatus,
        trackingNumber: newStatus === 'Shipped' && !prev.trackingNumber ? `IN-${Math.floor(10000+Math.random()*90000)}-TRK` : prev.trackingNumber
      }))
    }

    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: "Order Fulfilled",
        message: `Order ${orderId} updated to ${newStatus}`,
        type: "order",
        date: new Date().toISOString(),
        read: false
      },
      ...notifications
    ])

    showFeedback(`Order ${orderId} marked as ${newStatus}.`)
  }

  const handleSaveTrackingNumber = (e) => {
    e.preventDefault()
    if (!trackingInput.trim()) return
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, trackingNumber: trackingInput, status: 'Shipped' } : o))
    setSelectedOrder(prev => ({ ...prev, trackingNumber: trackingInput, status: 'Shipped' }))
    setTrackingInput('')
    showFeedback('Tracking details registered successfully.')
  }

  const handleAddOrderComment = (e) => {
    e.preventDefault()
    if (!internalNote.trim()) return
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, notes: internalNote } : o))
    setSelectedOrder(prev => ({ ...prev, notes: internalNote }))
    setInternalNote('')
    showFeedback('Internal comments updated.')
  }

  // Payout processing
  const handleRequestPayout = () => {
    if (walletBalance <= 0) {
      showFeedback('No pending balance available for settlement.', 'error')
      return
    }

    setPayoutStep('step1')
    setPayoutProgress(15)

    setTimeout(() => {
      setPayoutStep('step2')
      setPayoutProgress(55)
    }, 1200)

    setTimeout(() => {
      setPayoutStep('step3')
      setPayoutProgress(85)
    }, 2400)

    setTimeout(async () => {
      const payoutAmount = walletBalance
      const payoutAccount = bankDetails.payoutMethod === 'bank' 
        ? `${bankDetails.bankName} - *${bankDetails.accountNumber.slice(-4)}`
        : bankDetails.upiId

      let payoutId = `PAY-${Math.floor(10000 + Math.random() * 90000)}`

      if (isSupabaseLinked) {
        try {
          const res = await requestPayout(payoutAmount, bankDetails.payoutMethod === 'bank' ? 'Bank Transfer' : 'UPI Payout', payoutAccount)
          payoutId = res.payoutId
        } catch (err) {
          console.error("DB request payout error:", err.message)
          showFeedback('Failed to settle payout via API. Simulating locally instead.', 'warning')
        }
      }

      const newPayout = {
        id: payoutId,
        date: new Date().toISOString().split('T')[0],
        amount: payoutAmount,
        method: bankDetails.payoutMethod === 'bank' ? 'Bank Transfer' : 'UPI Payout',
        account: payoutAccount,
        status: 'Completed'
      }

      setPayouts([newPayout, ...payouts])
      setWalletBalance(0)
      setPayoutStep('done')
      setPayoutProgress(100)

      setNotifications([
        {
          id: `notif-${Date.now()}`,
          title: "Settlement Disbursed",
          message: `Payout of ₹${payoutAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} completed`,
          type: "payout",
          date: new Date().toISOString(),
          read: false
        },
        ...notifications
      ])

      showFeedback('Payout settled to your account!')
    }, 3800)
  }

  // CRM Chat actions
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageText.trim()) return

    const buyerName = selectedCustomer.name
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg = { sender: 'merchant', text: messageText, time: timeString }
    setChatMessages(prev => ({
      ...prev,
      [buyerName]: [...(prev[buyerName] || []), userMsg]
    }))
    setMessageText('')
    
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      const responses = CHAT_CHARACTER_RESPONSES[buyerName] || [
        "Thanks for the message! Let me review this and get back to you soon.",
        "Got it! Let me know if there's anything else.",
        "Perfect. Will look out for updates!"
      ]
      const replyText = responses[Math.floor(Math.random() * responses.length)]
      const replyMsg = { sender: 'customer', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      
      setChatMessages(prev => ({
        ...prev,
        [buyerName]: [...(prev[buyerName] || []), replyMsg]
      }))
    }, 1800)
  }

  // Theme accent definitions
  const themeColors = {
    jade: { text: 'text-jade', bg: 'bg-jade', border: 'border-jade', hover: 'hover:bg-jade/10', ring: 'focus:ring-jade', gradient: 'from-jade/20 to-transparent' },
    amber: { text: 'text-amber', bg: 'bg-amber', border: 'border-amber', hover: 'hover:bg-amber/10', ring: 'focus:ring-amber', gradient: 'from-amber/20 to-transparent' },
    ink: { text: 'text-ink', bg: 'bg-ink', border: 'border-ink', hover: 'hover:bg-ink/10', ring: 'focus:ring-ink', gradient: 'from-ink/10 to-transparent' },
    purple: { text: 'text-indigo-600', bg: 'bg-indigo-600', border: 'border-indigo-600', hover: 'hover:bg-indigo-600/10', ring: 'focus:ring-indigo-600', gradient: 'from-indigo-600/20 to-transparent' },
    rose: { text: 'text-rose-600', bg: 'bg-rose-600', border: 'border-rose-600', hover: 'hover:bg-rose-600/10', ring: 'focus:ring-rose-600', gradient: 'from-rose-600/20 to-transparent' }
  }

  const activeTheme = themeColors[shopSettings.bannerColor] || themeColors.jade

  // Quick list
  const menuItems = [
    { id: 'dashboard', label: 'Analytics Hub', icon: LayoutDashboard },
    { id: 'inventory', label: 'Catalog & Inventory', icon: Package },
    { id: 'orders', label: 'Incoming Orders', icon: ShoppingCart, badge: orders.filter(o => o.status === 'Processing').length },
    { id: 'payments', label: 'Payouts & Ledger', icon: CreditCard },
    { id: 'customers', label: 'Customer CRM', icon: Users },
    { id: 'settings', label: 'Branding Settings', icon: Settings }
  ]

  // Framer Motion staggered grid load parameters
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 320, damping: 25 } 
    }
  }

  return (
    <div className={`flex-1 flex flex-col md:flex-row min-h-screen w-full relative transition-colors duration-500 overflow-hidden ${
      darkMode ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFA] text-ink'
    }`}>
      
      {/* Dynamic Background Floating Ambient Lights Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 80, -60, 0], 
            y: [0, -100, 60, 0],
            scale: [1, 1.15, 0.9, 1] 
          }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-35 transition-colors duration-500 ${
            darkMode ? 'bg-indigo-950/40' : 'bg-emerald-500/10'
          }`}
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 50, 0], 
            y: [0, 60, -80, 0],
            scale: [1, 0.9, 1.1, 1] 
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-35 transition-colors duration-500 ${
            darkMode ? 'bg-emerald-950/40' : 'bg-indigo-500/10'
          }`}
        />
      </div>

      {/* Toast Notification alert */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-50 px-6 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 border font-semibold text-sm transition-colors duration-300 ${
              toast.type === 'error' 
                ? 'bg-rose-50 border-rose-200 text-rose-800' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION (Desktop: fixed width; Mobile: sticky horizontal slider) */}
      <aside className={`w-full md:w-72 border-b md:border-b-0 md:border-r flex flex-col shrink-0 z-20 transition-colors duration-500 ${
        darkMode ? 'bg-[#101622] border-slate-800' : 'bg-white border-line'
      }`}>
        
        {/* Merchant Branding Section */}
        <div className="p-6 border-b border-line flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50/10 to-transparent rounded-full -mr-8 -mt-8 opacity-60"></div>
          
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.05 }}
              className={`w-10 h-10 rounded-lg ${activeTheme.bg} flex items-center justify-center text-white shadow-sm transition-colors duration-300`}
            >
              <span className="font-display font-black text-base tracking-tighter">UC</span>
            </motion.div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight truncate max-w-[170px]">
                {shopSettings.storeName}
              </h2>
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block mt-0.5">
                Verified Seller
              </span>
            </div>
          </div>
          <p className={`text-xs line-clamp-2 mt-1 leading-normal ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {shopSettings.description}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex flex-col gap-1.5 p-4 flex-grow overflow-y-auto relative">
          {menuItems.map(item => {
            const Icon = item.icon
            const isSelected = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all group relative overflow-hidden ${
                  isSelected 
                    ? 'text-white' 
                    : darkMode 
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30' 
                      : 'text-slate-600 hover:text-ink hover:bg-slate-50'
                }`}
              >
                {/* Sliding background indicator pill */}
                {isSelected && (
                  <motion.div 
                    layoutId="activeTabPill"
                    className={`absolute inset-0 ${activeTheme.bg} rounded-lg -z-10`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3 z-10">
                  <Icon size={18} className={isSelected ? 'text-white' : 'text-slate-400 group-hover:text-ink'} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${isSelected ? 'bg-white text-emerald-900' : 'bg-rose-100 text-rose-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Mobile Horizontal Menu bar */}
        <div className={`md:hidden flex overflow-x-auto border-b scrollbar-none scroll-smooth sticky top-16 z-30 shadow-sm transition-colors duration-500 ${
          darkMode ? 'bg-[#101622] border-slate-800' : 'bg-white border-line'
        }`}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isSelected = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-5 py-4 border-b-2 font-semibold text-xs tracking-wider whitespace-nowrap transition-all relative ${
                  isSelected 
                    ? `${activeTheme.text} bg-slate-50/10` 
                    : 'border-transparent text-slate-500 opacity-80'
                }`}
              >
                {isSelected && (
                  <motion.div 
                    layoutId="activeTabPillMobile"
                    className={`absolute bottom-0 inset-x-0 h-0.5 ${activeTheme.bg}`}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <Icon size={15} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Bottom Merchant Identity Profile */}
        <div className={`hidden md:flex items-center justify-between p-4 border-t transition-colors duration-500 ${
          darkMode ? 'bg-[#0E131E] border-slate-800' : 'bg-slate-50/50 border-line'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-colors ${
              darkMode ? 'bg-slate-800 text-slate-350 border-slate-700' : 'bg-slate-200 text-slate-700 border-slate-300'
            }`}>
              {user ? user.name.slice(0, 2).toUpperCase() : 'MC'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">{user ? user.name : 'Store Merchant'}</span>
              <span className="text-[10px] text-slate-400 font-medium block truncate">{user ? user.email : 'merchant@urbancart.com'}</span>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-1.5 hover:bg-slate-50/10 rounded-md text-slate-500 transition"
              title="Merchant Status"
            >
              <div className={`w-3.5 h-3.5 rounded-full border-2 ${
                darkMode ? 'border-[#0E131E]' : 'border-white'
              } ${
                merchantStatus === 'Online' ? 'bg-emerald-500' :
                merchantStatus === 'Away' ? 'bg-amber-400' : 'bg-rose-500'
              }`}></div>
            </button>
            
            {showProfileMenu && (
              <div className={`absolute bottom-10 right-0 w-36 border rounded-lg shadow-lg py-1.5 z-30 text-xs font-medium transition-colors ${
                darkMode ? 'bg-[#151D2A] border-slate-700 text-slate-200' : 'bg-white border-line text-slate-700'
              }`}>
                {['Online', 'Away', 'DND'].map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      setMerchantStatus(status)
                      setShowProfileMenu(false)
                      showFeedback(`Status updated to ${status}`)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50/10 flex items-center gap-2"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      status === 'Online' ? 'bg-emerald-500' :
                      status === 'Away' ? 'bg-amber-400' : 'bg-rose-500'
                    }`}></span>
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-grow flex flex-col w-full min-w-0 z-10 relative">
        
        {/* TOP SYSTEM HEADER */}
        <header className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between z-10 shadow-sm transition-colors duration-500 ${
          darkMode ? 'bg-[#101622] border-slate-800' : 'bg-white border-line'
        }`}>
          
          {/* Section Breadcrumbs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Merchant Control</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sm font-bold uppercase tracking-wider capitalize">
              {menuItems.find(item => item.id === activeTab)?.label}
            </span>
          </div>

          {/* Utility tools: Dark Mode toggle, Timer Clock, Notifications center */}
          <div className="flex items-center gap-4">
            
            {/* Real-time Clock */}
            <div className={`hidden lg:flex items-center gap-2 font-mono text-xs font-semibold border px-3.5 py-1.5 rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-colors duration-500 ${
              darkMode ? 'bg-slate-800/40 border-slate-700 text-slate-350' : 'bg-slate-50 border-line text-slate-400'
            }`}>
              <Clock size={13} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>



            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 border rounded-lg transition relative shadow-sm ${
                  darkMode ? 'bg-slate-850 border-slate-750 text-slate-200' : 'bg-white border-line text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Bell size={16} />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-2.5 w-80 border rounded-lg shadow-xl z-30 overflow-hidden text-xs transition-colors duration-500 ${
                      darkMode ? 'bg-[#151D2A] border-slate-700 text-slate-200' : 'bg-white border-line text-slate-700'
                    }`}
                  >
                    <div className={`p-3 border-b flex justify-between items-center font-bold ${
                      darkMode ? 'border-slate-800 bg-[#0E131E] text-slate-350' : 'border-line bg-slate-50 text-slate-700'
                    }`}>
                      <span>Recent Activities</span>
                      {unreadNotifCount > 0 && (
                        <button 
                          onClick={handleMarkAllNotificationsRead}
                          className={`text-[10px] ${activeTheme.text} hover:underline`}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-3 transition-colors ${
                            notif.read ? 'bg-transparent' : darkMode ? 'bg-emerald-500/5' : 'bg-emerald-50/20'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="font-bold">{notif.title}</span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {new Date(notif.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{notif.message}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="p-6 text-center text-slate-400 font-medium">No alerts available</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </header>

        {/* INNER WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="min-h-full"
            >

              {/* TAB 1: ANALYTICS HUB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  
                  {/* Filter and Overview block */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-display font-bold leading-tight">
                        Store Performance
                      </h1>
                      <p className="text-xs lg:text-sm text-slate-400 mt-1">
                        Real-time transactional insights, sales breakdowns, and customer conversions.
                      </p>
                    </div>
                    
                    {/* Time range controller */}
                    <div className={`flex items-center border p-1 rounded-lg shadow-sm transition-colors ${
                      darkMode ? 'bg-[#101622] border-slate-800' : 'bg-white border-line'
                    }`}>
                      {['Today', '7D', '30D', 'YTD'].map(range => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${
                            timeRange === range 
                              ? `${activeTheme.bg} text-white` 
                              : 'text-slate-500 hover:text-ink hover:bg-slate-50/10'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* KPI metrics cards grid (Hover spotlight custom css) */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    
                    {/* Card 1: Revenue */}
                    <motion.div 
                      variants={cardVariants}
                      onMouseMove={handleMouseMove}
                      whileHover={{ y: -5, scale: 1.02, borderColor: "#1B7A5E" }}
                      className={`border rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden group spotlight-card ${
                        darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                      }`}
                      style={{
                        '--mouse-x': '0px',
                        '--mouse-y': '0px'
                      }}
                    >
                      {/* Spotlight hover effect background overlay */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(27,122,94,0.06),transparent_60%)]" />
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Net Revenue</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <ArrowUpRight size={10} /> +12.4%
                        </span>
                      </div>
                      <h3 className="text-2xl font-mono font-bold">
                        <AnimatedNumber value={displayRevenue} isCurrency={true} />
                      </h3>
                      
                      {/* Sparkline SVG */}
                      <div className="h-10 mt-4 w-full">
                        <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="sparkline-rev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1B7A5E" stopOpacity="0.25"/>
                              <stop offset="100%" stopColor="#1B7A5E" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <motion.path 
                            d="M0 35 C 20 20, 40 38, 60 22 C 80 20, 100 5, 120 5 L 120 40 L 0 40 Z" 
                            fill="url(#sparkline-rev)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          />
                          <motion.path 
                            d="M0 35 C 20 20, 40 38, 60 22 C 80 20, 100 5, 120 5" 
                            fill="none" 
                            stroke="#1B7A5E" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                      </div>
                    </motion.div>

                    {/* Card 2: Orders */}
                    <motion.div 
                      variants={cardVariants}
                      onMouseMove={handleMouseMove}
                      whileHover={{ y: -5, scale: 1.02, borderColor: "#E8A33D" }}
                      className={`border rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden group spotlight-card ${
                        darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                      }`}
                    >
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(232,163,61,0.06),transparent_60%)]" />
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Orders Fulfilled</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <ArrowUpRight size={10} /> +8.1%
                        </span>
                      </div>
                      <h3 className="text-2xl font-mono font-bold">
                        <AnimatedNumber value={displayOrders} />
                      </h3>
                      
                      {/* Sparkline SVG */}
                      <div className="h-10 mt-4 w-full">
                        <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="sparkline-ord" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.25"/>
                              <stop offset="100%" stopColor="#E8A33D" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <motion.path 
                            d="M0 25 C 20 30, 40 18, 60 24 C 80 28, 100 10, 120 10 L 120 40 L 0 40 Z" 
                            fill="url(#sparkline-ord)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          />
                          <motion.path 
                            d="M0 25 C 20 30, 40 18, 60 24 C 80 28, 100 10, 120 10" 
                            fill="none" 
                            stroke="#E8A33D" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                      </div>
                    </motion.div>

                    {/* Card 3: Avg Order Value */}
                    <motion.div 
                      variants={cardVariants}
                      onMouseMove={handleMouseMove}
                      whileHover={{ y: -5, scale: 1.02, borderColor: "#6366F1" }}
                      className={`border rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden group spotlight-card ${
                        darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                      }`}
                    >
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(99,102,241,0.06),transparent_60%)]" />
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Avg. Order Value</span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <ArrowDownRight size={10} /> -1.2%
                        </span>
                      </div>
                      <h3 className="text-2xl font-mono font-bold">
                        <AnimatedNumber value={displayAvgOrder} isCurrency={true} />
                      </h3>
                      
                      {/* Sparkline SVG */}
                      <div className="h-10 mt-4 w-full">
                        <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="sparkline-aov" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25"/>
                              <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <motion.path 
                            d="M0 15 C 20 20, 40 12, 60 18 C 80 22, 100 18, 120 18 L 120 40 L 0 40 Z" 
                            fill="url(#sparkline-aov)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          />
                          <motion.path 
                            d="M0 15 C 20 20, 40 12, 60 18 C 80 22, 100 18, 120 18" 
                            fill="none" 
                            stroke="#6366F1" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                      </div>
                    </motion.div>

                    {/* Card 4: Conversion Rate */}
                    <motion.div 
                      variants={cardVariants}
                      onMouseMove={handleMouseMove}
                      whileHover={{ y: -5, scale: 1.02, borderColor: "#3B82F6" }}
                      className={`border rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden group spotlight-card ${
                        darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                      }`}
                    >
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.06),transparent_60%)]" />
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Conversion Rate</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <ArrowUpRight size={10} /> +3.4%
                        </span>
                      </div>
                      <h3 className="text-2xl font-mono font-bold">
                        <AnimatedNumber value={displayConv} />%
                      </h3>
                      
                      {/* Sparkline SVG */}
                      <div className="h-10 mt-4 w-full">
                        <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="sparkline-conv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25"/>
                              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <motion.path 
                            d="M0 30 C 20 28, 40 24, 60 20 C 80 18, 100 8, 120 8 L 120 40 L 0 40 Z" 
                            fill="url(#sparkline-conv)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          />
                          <motion.path 
                            d="M0 30 C 20 28, 40 24, 60 20 C 80 18, 100 8, 120 8" 
                            fill="none" 
                            stroke="#3B82F6" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                      </div>
                    </motion.div>

                  </motion.div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Visual Area Chart (Neon glowing jade curve line) */}
                    <div className={`lg:col-span-2 border rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition-colors ${
                      darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                    }`}>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="font-display font-bold text-lg">Revenue & Traffic Streams</h3>
                          <p className="text-[11px] text-slate-400 font-medium font-semibold">Hover nodes to inspect coordinates.</p>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span> Sales</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-350 rounded-full"></span> Visitors</span>
                        </div>
                      </div>

                      {/* SVG Line Graph */}
                      <div className="h-64 w-full relative">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 220" key={timeRange}>
                          {/* Glow filter definition */}
                          <defs>
                            <linearGradient id="chart-rev-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1B7A5E" stopOpacity="0.22"/>
                              <stop offset="100%" stopColor="#1B7A5E" stopOpacity="0"/>
                            </linearGradient>
                            <filter id="neon-glow-jade" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="5" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Grid background lines */}
                          {[0, 50, 100, 150, 200].map((y, idx) => (
                            <line 
                              key={idx} 
                              x1="0" 
                              y1={y} 
                              x2="600" 
                              y2={y} 
                              stroke={darkMode ? '#1E293B' : '#E2E8F0'} 
                              strokeWidth="1" 
                              strokeDasharray="4 4" 
                            />
                          ))}

                          {/* Coordinates calculations */}
                          {(() => {
                            const pointsCount = activeTrend.length
                            const xStep = 600 / (pointsCount - 1)
                            const maxSales = Math.max(...activeTrend.map(d => d.sales))
                            
                            const coordinates = activeTrend.map((d, idx) => {
                              const x = idx * xStep
                              const y = 200 - ((d.sales / maxSales) * 160)
                              return { x, y, data: d }
                            })

                            const pathD = getBezierCurvePath(coordinates)
                            const areaD = `${pathD} L ${coordinates[coordinates.length-1].x} 200 L 0 200 Z`

                            return (
                              <>
                                {/* Area fill gradient with delay */}
                                <motion.path 
                                  d={areaD} 
                                  fill="url(#chart-rev-grad)" 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.8, delay: 0.4 }}
                                />
                                
                                {/* Glowing Neon Jade outline drawn dynamically */}
                                <motion.path 
                                  d={pathD} 
                                  fill="none" 
                                  stroke="#1B7A5E" 
                                  strokeWidth="3.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                  filter="url(#neon-glow-jade)"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1.4, ease: "easeInOut" }}
                                />
                                
                                {/* Dots with pop in */}
                                {coordinates.map((pt, idx) => (
                                  <g 
                                    key={idx} 
                                    className="cursor-pointer" 
                                    onMouseEnter={() => setHoveredSalesPoint({ pt, idx })} 
                                    onMouseLeave={() => setHoveredSalesPoint(null)}
                                  >
                                    <motion.circle 
                                      cx={pt.x} 
                                      cy={pt.y} 
                                      r="5" 
                                      fill={darkMode ? '#131A26' : '#FFFFFF'} 
                                      stroke="#1B7A5E" 
                                      strokeWidth="3.5"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 300, delay: idx * 0.08 }}
                                      whileHover={{ scale: 1.5, strokeWidth: 4 }}
                                    />
                                    <text 
                                      x={pt.x} 
                                      y="218" 
                                      textAnchor="middle" 
                                      className="text-[10px] fill-slate-450 font-bold font-mono"
                                    >
                                      {pt.data.label}
                                    </text>
                                  </g>
                                ))}
                              </>
                            )
                          })()}
                        </svg>

                        {/* Tooltip */}
                        <AnimatePresence>
                          {hoveredSalesPoint && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute bg-slate-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-2xl border border-slate-750 text-left pointer-events-none z-10 flex flex-col gap-0.5 text-[10px] font-bold font-mono"
                              style={{ 
                                left: `${(hoveredSalesPoint.pt.x / 600) * 100}%`, 
                                top: `${(hoveredSalesPoint.pt.y / 220) * 100 - 35}%`,
                                transform: 'translateX(-50%)'
                              }}
                            >
                              <span className="text-slate-400 uppercase tracking-widest">{hoveredSalesPoint.pt.data.label}</span>
                              <span className="text-emerald-400 text-sm mt-0.5">Sales: ₹{hoveredSalesPoint.pt.data.sales.toLocaleString('en-IN')}</span>
                              <span className="text-indigo-300">Visitors: {hoveredSalesPoint.pt.data.visitors}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Donut Chart (Spin segments) */}
                    <div className={`border rounded-xl p-6 shadow-sm flex flex-col justify-between transition-colors ${
                      darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                    }`}>
                      <div>
                        <h3 className="font-display font-bold text-lg">Volume by Department</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Share percentage of department orders.</p>
                      </div>

                      <div className="h-44 flex items-center justify-center relative my-4">
                        <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90" key={timeRange}>
                          {(() => {
                            let accumulatedOffset = 0
                            const radius = 50
                            const circumference = 2 * Math.PI * radius

                            return Object.entries(categorySplit).map(([cat, val], idx) => {
                              const percentage = val / totalSalesUnits
                              const strokeLength = circumference * percentage
                              const strokeOffset = circumference - accumulatedOffset
                              accumulatedOffset += strokeLength
                              const color = categoryColors[cat] || '#CBD5E1'

                              return (
                                <motion.circle
                                  key={idx}
                                  cx="80"
                                  cy="80"
                                  r={radius}
                                  fill="transparent"
                                  stroke={color}
                                  strokeWidth="14"
                                  strokeDasharray={`${strokeLength} ${circumference}`}
                                  initial={{ strokeDashoffset: circumference }}
                                  animate={{ strokeDashoffset: strokeOffset }}
                                  transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                                  className="transition-all duration-300 hover:stroke-[16] cursor-pointer"
                                />
                              )
                            })
                          })()}
                        </svg>
                        
                        <div className="absolute text-center flex flex-col">
                          <span className="text-2xl font-display font-bold leading-none">{totalSalesUnits}</span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1">Total Sales</span>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="space-y-1.5 text-xs font-semibold">
                        {Object.entries(categorySplit).map(([cat, val], idx) => {
                          const share = Math.round((val / totalSalesUnits) * 100)
                          const color = categoryColors[cat] || '#CBD5E1'
                          return (
                            <div key={idx} className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                                <span className="text-slate-400 font-medium truncate max-w-[130px]">{cat}</span>
                              </div>
                              <span className="font-mono text-slate-400 font-bold">{share}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Bottom row alerts and shortcuts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Alerts list */}
                    <div className={`border rounded-xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between transition-colors ${
                      darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                    }`}>
                      <div>
                        <h3 className="font-display font-bold text-lg flex items-center gap-2">
                          <AlertCircle size={18} className="text-rose-500 animate-pulse" /> Critical Inventory Alerts
                        </h3>
                        <p className="text-xs text-slate-450 mt-1">Listings requiring replenishment or stock toggling.</p>
                      </div>
                      
                      <div className="my-4 divide-y divide-slate-800 max-h-56 overflow-y-auto">
                        {products.filter(p => p.stockCount <= 5).map(p => (
                          <div key={p.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-line shrink-0" />
                              <div>
                                <span className="font-bold text-sm block max-w-[180px] sm:max-w-xs truncate">{p.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">SKU: {p.sku}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-xs font-bold font-mono block">{p.stockCount} left</span>
                                <span className="text-[9px] uppercase tracking-wider font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                                  {p.stockCount === 0 ? 'Out of Stock' : 'Critical Low'}
                                </span>
                              </div>
                              <button 
                                onClick={() => {
                                  setEditingProduct(p)
                                  setIsEditModalOpen(true)
                                }}
                                className={`p-1.5 border rounded-md transition ${
                                  darkMode ? 'hover:bg-slate-800/40 border-slate-700 text-slate-200' : 'hover:bg-slate-100 border-line text-slate-650'
                                }`}
                                title="Restock"
                              >
                                <RefreshCw size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {products.filter(p => p.stockCount <= 5).length === 0 && (
                          <div className="py-8 text-center text-slate-400 font-medium">All item listings have sufficient stock margins.</div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => setActiveTab('inventory')}
                        className={`text-xs font-bold ${activeTheme.text} hover:underline block text-right pt-2 border-t border-slate-800`}
                      >
                        Manage listings catalog &rarr;
                      </button>
                    </div>

                    {/* Shortcuts */}
                    <div className={`border rounded-xl p-6 shadow-sm flex flex-col justify-between transition-colors ${
                      darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                    }`}>
                      <div>
                        <h3 className="font-display font-bold text-lg">Action Shortcuts</h3>
                        <p className="text-xs text-slate-450 mt-1">Common administrative tasks.</p>
                      </div>
                      
                      <div className="space-y-3 my-5 text-xs">
                        <button 
                          onClick={() => setIsAddModalOpen(true)}
                          className={`w-full flex items-center justify-between p-3.5 border rounded-lg hover:border-slate-450 transition text-left font-bold ${
                            darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-200 hover:bg-slate-800/50' : 'bg-slate-50 border-line text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Plus size={16} className={activeTheme.text} />
                            <span>Add New Listing</span>
                          </div>
                          <ChevronRight size={14} className="text-slate-400" />
                        </button>
                        <button 
                          onClick={() => setActiveTab('payments')}
                          className={`w-full flex items-center justify-between p-3.5 border rounded-lg hover:border-slate-450 transition text-left font-bold ${
                            darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-200 hover:bg-slate-800/50' : 'bg-slate-50 border-line text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard size={16} className={activeTheme.text} />
                            <span>Request Payout Settlement</span>
                          </div>
                          <ChevronRight size={14} className="text-slate-400" />
                        </button>
                        <button 
                          onClick={() => setActiveTab('customers')}
                          className={`w-full flex items-center justify-between p-3.5 border rounded-lg hover:border-slate-450 transition text-left font-bold ${
                            darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-200 hover:bg-slate-800/50' : 'bg-slate-50 border-line text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <MessageSquare size={16} className={activeTheme.text} />
                            <span>Message Buyer Base</span>
                          </div>
                          <ChevronRight size={14} className="text-slate-400" />
                        </button>
                      </div>

                      <div className={`border rounded-lg p-3 text-[10px] font-semibold flex items-center gap-2.5 ${
                        darkMode ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-455' : 'bg-emerald-50/20 border-emerald-100 text-slate-500'
                      }`}>
                        <Shield size={14} className="text-emerald-700 shrink-0" />
                        <span>UrbanCart Secure Vault protects your merchant identity.</span>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: CATALOG & INVENTORY */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  
                  {/* Header and Add button */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-display font-bold leading-tight">Catalog & Listings</h1>
                      <p className="text-xs lg:text-sm text-slate-400 mt-1">Catalog management, stock level modification, and quick inline pricing overrides.</p>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className={`${activeTheme.bg} text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 flex items-center gap-2 shadow-sm text-xs transition active:scale-95`}
                    >
                      <Plus size={16} /> New Product Listing
                    </button>
                  </div>

                  {/* Filter controls row */}
                  <div className={`border rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
                    darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                  }`}>
                    
                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-xs shrink-0">
                      <input 
                        type="text" 
                        placeholder="Search by title, SKU, ID..." 
                        value={invSearch}
                        onChange={e => setInvSearch(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:border-transparent text-xs font-semibold focus:bg-transparent transition ${
                          darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50/50 border-line text-ink focus:bg-white'
                        }`}
                      />
                      <Search className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
                    </div>

                    {/* Filters group */}
                    <div className="flex flex-wrap items-center gap-3 w-full justify-start md:justify-end">
                      
                      <select 
                        value={invCategory}
                        onChange={e => setInvCategory(e.target.value)}
                        className={`border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 ${
                          darkMode ? 'bg-slate-800 border-slate-750 text-slate-300 focus:ring-slate-700' : 'bg-white border-line text-slate-600 focus:ring-emerald-700'
                        }`}
                      >
                        <option value="All">All Departments</option>
                        <option value="Home, Kitchen, Pets">Home & Kitchen</option>
                        <option value="Fashion">Fashion Dept</option>
                        <option value="Books">Books & Media</option>
                      </select>

                      <select 
                        value={invStockFilter}
                        onChange={e => setInvStockFilter(e.target.value)}
                        className={`border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 ${
                          darkMode ? 'bg-slate-800 border-slate-750 text-slate-300 focus:ring-slate-700' : 'bg-white border-line text-slate-600 focus:ring-emerald-700'
                        }`}
                      >
                        <option value="All">All Stock Levels</option>
                        <option value="Low">Low Margin (&le; 5)</option>
                        <option value="Out">Out of Stock (0)</option>
                        <option value="Normal">In Stock (Normal)</option>
                      </select>

                      <div className={`flex items-center border rounded-lg p-0.5 shrink-0 ${
                        darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-line'
                      }`}>
                        <button
                          onClick={() => setViewMode('table')}
                          className={`p-1.5 rounded-md transition ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-750'}`}
                          title="List View"
                        >
                          <List size={14} />
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-750'}`}
                          title="Grid View"
                        >
                          <Grid size={14} />
                        </button>
                      </div>

                    </div>

                  </div>

                  {/* Product catalog output */}
                  {(() => {
                    const filtered = products
                      .filter(p => p.title.toLowerCase().includes(invSearch.toLowerCase()) || 
                                   p.sku.toLowerCase().includes(invSearch.toLowerCase()) || 
                                   p.id.toLowerCase().includes(invSearch.toLowerCase()))
                      .filter(p => invCategory === 'All' || p.category.includes(invCategory) || (invCategory === 'Books' && p.category.includes('Books')))
                      .filter(p => {
                        if (invStockFilter === 'All') return true
                        if (invStockFilter === 'Low') return p.stockCount <= 5 && p.stockCount > 0
                        if (invStockFilter === 'Out') return p.stockCount === 0
                        return p.stockCount > 5
                      })

                    if (filtered.length === 0) {
                      return (
                        <div className={`border rounded-xl p-12 text-center shadow-sm ${
                          darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                        }`}>
                          <div className="w-16 h-16 bg-slate-500/10 text-slate-405 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/20">
                            <Package size={24} />
                          </div>
                          <h4 className="font-display font-bold text-lg">No catalog matches</h4>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-normal">
                            No product items matched your active search query or filter department selections. Adjust keywords or filters.
                          </p>
                          <button 
                            onClick={() => {
                              setInvSearch('')
                              setInvCategory('All')
                              setInvStockFilter('All')
                            }}
                            className={`text-xs font-bold ${activeTheme.text} mt-4 hover:underline`}
                          >
                            Reset catalog views
                          </button>
                        </div>
                      )
                    }

                    return viewMode === 'table' ? (
                      /* LIST VIEW OF TABLE */
                      <div className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${
                        darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                      }`}>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                            <thead className={`border-b font-bold uppercase tracking-wider text-[10px] ${
                              darkMode ? 'bg-[#0E131E] border-slate-800 text-slate-400' : 'bg-slate-50 border-line text-slate-400'
                            }`}>
                              <tr>
                                <th className="p-4 font-bold">Product Title & SKU</th>
                                <th className="p-4 font-bold text-center">Department</th>
                                <th className="p-4 font-bold text-center">Unit Price (₹)</th>
                                <th className="p-4 font-bold text-center">Sales Units</th>
                                <th className="p-4 font-bold text-center">Stock Level</th>
                                <th className="p-4 font-bold text-center">Department Status</th>
                                <th className="p-4 font-bold text-right">Row Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 font-medium">
                              {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/5/20 transition-colors">
                                  <td className="p-4 flex items-center gap-3">
                                    <img src={p.image} alt={p.title} className="w-11 h-11 rounded-lg object-cover border border-line shrink-0" />
                                    <div className="max-w-xs truncate">
                                      <span className="font-bold block truncate text-sm">{p.title}</span>
                                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">ID: {p.id} • SKU: {p.sku}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-center font-semibold text-slate-400">{p.category}</td>
                                  <td className="p-4 text-center">
                                    <div className="inline-flex items-center gap-1.5 justify-center">
                                      <span className="text-slate-400 font-bold font-mono">₹</span>
                                      <input 
                                        type="number" 
                                        step="0.01"
                                        defaultValue={p.price}
                                        onBlur={e => handleInlinePriceChange(p.id, e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleInlinePriceChange(p.id, e.target.value) }}
                                        className={`w-16 border rounded px-2 py-1 text-center font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700 ${
                                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-line text-slate-800 focus:bg-white'
                                        }`}
                                      />
                                    </div>
                                  </td>
                                  <td className="p-4 text-center font-bold font-mono">{p.sales || 10}</td>
                                  <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button 
                                        onClick={() => handleDecrementStock(p.id)}
                                        className={`w-6 h-6 border rounded flex items-center justify-center font-bold hover:bg-slate-100/10 transition active:scale-90 ${
                                          darkMode ? 'border-slate-700 text-slate-200' : 'border-line text-slate-800'
                                        }`}
                                      >
                                        -
                                      </button>
                                      <span className={`w-10 font-bold font-mono text-center text-[13px] ${
                                        p.stockCount === 0 ? 'text-rose-600 font-black' :
                                        p.stockCount <= 5 ? 'text-amber-600' : 'text-slate-355'
                                      }`}>
                                        {p.stockCount}
                                      </span>
                                      <button 
                                        onClick={() => handleIncrementStock(p.id)}
                                        className={`w-6 h-6 border rounded flex items-center justify-center font-bold hover:bg-slate-100/10 transition active:scale-90 ${
                                          darkMode ? 'border-slate-700 text-slate-200' : 'border-line text-slate-800'
                                        }`}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                      p.stockCount === 0 
                                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                                        : p.stockCount <= 5 
                                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                    }`}>
                                      {p.stockCount === 0 ? 'Out of Stock' : p.stockCount <= 5 ? 'Low Stock' : 'Active'}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right font-semibold">
                                    <div className="flex items-center justify-end gap-1">
                                      <button 
                                        onClick={() => {
                                          setEditingProduct(p)
                                          setIsEditModalOpen(true)
                                        }}
                                        className="p-1.5 hover:bg-slate-100/10 border border-transparent rounded text-slate-400 hover:text-slate-200 transition"
                                        title="Edit details"
                                      >
                                        <Edit2 size={13} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteProduct(p.id, p.title)}
                                        className="p-1.5 hover:bg-rose-500/10 border border-transparent rounded text-slate-400 hover:text-rose-550 transition"
                                        title="Delete product"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* GRID VIEW OF CATALOG (Hover spotlight and scaling) */
                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                        {filtered.map(p => (
                          <motion.div 
                            key={p.id} 
                            variants={cardVariants}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-350 relative flex flex-col justify-between group ${
                              darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                            }`}
                          >
                            <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-800 text-[9px] font-bold font-mono text-slate-350 z-10">
                              &#9733; {p.rating.toFixed(1)}
                            </div>

                            <div className="h-44 w-full bg-slate-800 overflow-hidden relative border-b border-slate-800">
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              {p.stockCount <= 5 && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between items-center text-white">
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-rose-300">Restock Warning</span>
                                  <span className="text-xs font-mono font-bold">{p.stockCount} Left</span>
                                </div>
                              )}
                            </div>

                            <div className="p-4 flex-grow flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.category}</span>
                                <h4 className="font-bold text-sm truncate mt-0.5 leading-normal">{p.title}</h4>
                                <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{p.id} • SKU {p.sku}</span>
                              </div>

                              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
                                <span className="text-base font-mono font-bold">₹{p.price.toFixed(2)}</span>
                                <div className="flex items-center gap-1.5">
                                  <button 
                                    onClick={() => {
                                      setEditingProduct(p)
                                      setIsEditModalOpen(true)
                                    }}
                                    className="p-1.5 hover:bg-slate-100/10 border border-line rounded text-slate-500 hover:text-slate-300 transition"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(p.id, p.title)}
                                    className="p-1.5 hover:bg-rose-500/10 border border-transparent rounded text-slate-400 hover:text-rose-550 transition"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>

                          </motion.div>
                        ))}
                      </motion.div>
                    )
                  })()}

                </div>
              )}

              {/* TAB 3: INCOMING ORDERS HUB */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-display font-bold leading-tight">Order Fulfillment</h1>
                      <p className="text-xs lg:text-sm text-slate-400 mt-1">
                        Manage incoming shipments, update delivery states via Kanban grids, and issue print statements.
                      </p>
                    </div>

                    <div className={`flex items-center border p-1 rounded-lg shadow-sm font-semibold text-xs transition-colors ${
                      darkMode ? 'bg-[#101622] border-slate-800' : 'bg-white border-line'
                    }`}>
                      <button
                        onClick={() => setOrderView('kanban')}
                        className={`px-3.5 py-1.5 rounded-md transition ${orderView === 'kanban' ? `${activeTheme.bg} text-white` : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Kanban Board
                      </button>
                      <button
                        onClick={() => setOrderView('list')}
                        className={`px-3.5 py-1.5 rounded-md transition ${orderView === 'list' ? `${activeTheme.bg} text-white` : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Details Directory
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-sm">
                    <input 
                      type="text" 
                      placeholder="Search orders by customer or ID..." 
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:border-transparent text-xs font-semibold focus:bg-transparent transition ${
                        darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-line text-ink focus:bg-white'
                      }`}
                    />
                    <Search className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
                  </div>

                  {(() => {
                    const filtered = orders.filter(o => 
                      o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                      o.customer.toLowerCase().includes(orderSearch.toLowerCase())
                    )

                    if (orderView === 'kanban') {
                      const lanes = {
                        'Processing': filtered.filter(o => o.status === 'Processing'),
                        'Shipped': filtered.filter(o => o.status === 'Shipped'),
                        'Delivered': filtered.filter(o => o.status === 'Delivered')
                      }

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-slate-700">
                          {Object.entries(lanes).map(([laneTitle, laneOrders]) => (
                            <div key={laneTitle} className={`border rounded-xl p-4 flex flex-col gap-4 transition-colors ${
                              darkMode ? 'bg-[#101622] border-slate-800' : 'bg-slate-100/70 border-slate-200/60'
                            }`}>
                              
                              <div className={`flex justify-between items-center border-b pb-3 font-bold ${
                                darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
                              }`}>
                                <span className="text-xs font-bold uppercase tracking-wider">{laneTitle} Pipeline</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                                  laneTitle === 'Processing' ? 'bg-amber-500/10 text-amber-500' :
                                  laneTitle === 'Shipped' ? 'bg-indigo-500/10 text-indigo-500' :
                                  'bg-emerald-500/10 text-emerald-500'
                                }`}>
                                  {laneOrders.length}
                                </span>
                              </div>

                              <motion.div 
                                layout
                                className="flex flex-col gap-3 min-h-[300px] max-h-[500px] overflow-y-auto pr-1"
                              >
                                <AnimatePresence mode="popLayout">
                                  {laneOrders.map(o => (
                                    <motion.div 
                                      key={o.id}
                                      layoutId={`order-card-${o.id}`}
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                      whileHover={{ scale: 1.025, y: -2 }}
                                      className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer ${
                                        darkMode ? 'bg-[#151D2A] border-slate-750 text-slate-200 hover:border-slate-700' : 'bg-white border-line text-slate-700 hover:border-slate-300'
                                      }`}
                                      onClick={() => setSelectedOrder(o)}
                                    >
                                      <div className="flex justify-between items-center mb-2 font-bold font-mono text-[11px]">
                                        <span className={darkMode ? 'text-slate-300' : 'text-slate-900'}>{o.id}</span>
                                        <span className="text-slate-400">{new Date(o.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                      </div>
                                      <h4 className="text-xs font-bold mb-1">{o.customer}</h4>
                                      <div className="text-[10px] text-slate-405 font-semibold truncate mb-3">
                                        {o.items.map(item => `${item.quantity}x ${item.title}`).join(', ')}
                                      </div>

                                      <div className="flex justify-between items-center pt-3 border-t border-slate-100/10 text-xs">
                                        <span className="font-mono font-bold text-emerald-500">₹{o.total.toFixed(2)}</span>
                                        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                                          {o.status === 'Processing' && (
                                            <button 
                                              onClick={() => handleOrderStatusChange(o.id, 'Shipped')}
                                              className="text-[9px] font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 px-2 py-1 rounded border border-slate-800"
                                            >
                                              Ship
                                            </button>
                                          )}
                                          {o.status === 'Shipped' && (
                                            <button 
                                              onClick={() => handleOrderStatusChange(o.id, 'Delivered')}
                                              className="text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 px-2 py-1 rounded"
                                            >
                                              Deliver
                                            </button>
                                          )}
                                          {o.status === 'Delivered' && (
                                            <span className="text-emerald-600 flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-widest"><Check size={10} /> Done</span>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                                {laneOrders.length === 0 && (
                                  <div className={`py-12 border-2 border-dashed rounded-lg text-center text-slate-400 text-xs font-medium ${
                                    darkMode ? 'border-slate-800' : 'border-slate-200'
                                  }`}>
                                    Pipeline column empty
                                  </div>
                                )}
                              </motion.div>

                            </div>
                          ))}
                        </div>
                      )
                    }

                    return (
                      <div className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${
                        darkMode ? 'bg-[#131A26] border-slate-800 text-slate-300' : 'bg-white border-line text-slate-700'
                      }`}>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                            <thead className={`border-b font-bold uppercase tracking-wider text-[10px] ${
                              darkMode ? 'bg-[#0E131E] border-slate-800 text-slate-400' : 'bg-slate-50 border-line text-slate-400'
                            }`}>
                              <tr>
                                <th className="p-4 font-bold">Order ID</th>
                                <th className="p-4 font-bold">Purchase Date</th>
                                <th className="p-4 font-bold">Customer Name</th>
                                <th className="p-4 font-bold text-center">Items Purchased</th>
                                <th className="p-4 font-bold text-center">Grand Price</th>
                                <th className="p-4 font-bold text-center">Tracking Number</th>
                                <th className="p-4 font-bold">Pipeline Status</th>
                                <th className="p-4 font-bold text-right">Inspection</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 font-medium">
                              {filtered.map(o => (
                                <tr key={o.id} className="hover:bg-slate-50/5/20 transition-colors">
                                  <td className="p-4 font-bold font-mono text-slate-200">{o.id}</td>
                                  <td className="p-4 text-slate-400 font-mono">
                                    {new Date(o.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </td>
                                  <td className="p-4 font-bold">{o.customer}</td>
                                  <td className="p-4 text-center font-bold font-mono">{o.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                                  <td className="p-4 text-center font-mono font-bold text-emerald-500">₹{o.total.toFixed(2)}</td>
                                  <td className="p-4 text-center font-mono text-slate-450 font-bold">{o.trackingNumber || 'Pending Ship'}</td>
                                  <td className="p-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                      o.status === 'Processing' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                      o.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-500' :
                                      'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                      {o.status}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <button 
                                      onClick={() => setSelectedOrder(o)}
                                      className={`text-xs font-bold border px-3 py-1.5 rounded transition ${
                                        darkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-line hover:bg-slate-50 text-slate-800'
                                      }`}
                                    >
                                      Inspect Manifest
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  })()}

                </div>
              )}

              {/* TAB 4: PAYOUTS & WALLET GATEWAY */}
              {activeTab === 'payments' && (
                <div className="space-y-8">
                  
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold leading-tight">Settlement Gateways</h1>
                    <p className="text-xs lg:text-sm text-slate-400 mt-1">Simulate withdrawals to verification banks, configure IFSC channels, and inspect ledger histories.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Balance ledger card */}
                      <div className={`border rounded-xl p-6 shadow-lg relative overflow-hidden flex flex-col sm:flex-row justify-between gap-6 transition-colors ${
                        darkMode ? 'bg-[#101622] border-slate-800' : 'bg-slate-900 border-slate-800 text-white'
                      }`}>
                        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        <div className="absolute left-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                        
                        <div className="space-y-3 z-10">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Withdrawable Net Balance</span>
                          <h2 className="text-3xl lg:text-4xl font-mono font-bold text-emerald-450">
                            <AnimatedNumber value={walletBalance} isCurrency={true} />
                          </h2>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold pt-1">
                            <CheckCircle2 size={13} className="text-emerald-500" />
                            <span>All verification metrics satisfied. Ready for payout.</span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-start sm:items-end shrink-0 z-10 text-xs">
                          <div className="text-left sm:text-right font-medium text-slate-300">
                            <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">Dest. Method</span>
                            <span>{bankDetails.payoutMethod === 'bank' ? `${bankDetails.bankName} Account` : 'UPI Address'}</span>
                          </div>

                          {payoutStep === 'idle' ? (
                            <button 
                              onClick={handleRequestPayout}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition active:scale-95 shadow-md mt-4 sm:mt-0 uppercase tracking-wider"
                            >
                              Withdraw Wallet Funds
                            </button>
                          ) : (
                            <div className="w-full sm:w-44 space-y-2 mt-4 sm:mt-0">
                              <div className="flex justify-between text-[10px] font-bold uppercase">
                                <span className="text-emerald-400 animate-pulse">
                                  {payoutStep === 'step1' && 'Initializing...'}
                                  {payoutStep === 'step2' && 'Securing Bank API...'}
                                  {payoutStep === 'step3' && 'Settling Funds...'}
                                  {payoutStep === 'done' && 'Completed'}
                                </span>
                                <span className="font-mono text-slate-350">{payoutProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-emerald-500 h-1.5 transition-all duration-550" style={{ width: `${payoutProgress}%` }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* VISA/UPI 3D Flip Card & Config */}
                      <div className={`border rounded-xl p-6 shadow-sm space-y-6 transition-colors ${
                        darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                      }`}>
                        <h3 className="font-display font-bold text-lg">Account Configuration</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          
                          {/* 3D Flidable payment Card mockup */}
                          <div className="w-full max-w-[320px] mx-auto h-[195px] relative [perspective:1000px] select-none">
                            <motion.div 
                              animate={{ rotateY: bankDetails.payoutMethod === 'upi' ? 180 : 0 }}
                              transition={{ duration: 0.75, ease: "easeInOut" }}
                              className="w-full h-full relative [transform-style:preserve-3d]"
                            >
                              {/* Front card side: Bank Card info */}
                              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-tr from-slate-800 to-slate-950 border border-slate-700/60 p-5 rounded-2xl flex flex-col justify-between text-white shadow-md">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Settlement Destination</span>
                                    <span className="text-xs font-bold mt-1 block font-display">UrbanCart Merchant Portal</span>
                                  </div>
                                  <span className="text-xs font-mono font-black italic tracking-widest text-slate-400">VISA</span>
                                </div>
                                <div className="w-9 h-7 bg-amber-400/80 rounded-md border border-amber-300 my-1 relative overflow-hidden shrink-0"></div>
                                <div className="space-y-1.5">
                                  <span className="text-sm tracking-widest font-mono block">
                                    {bankDetails.accountNumber}
                                  </span>
                                  <div className="flex justify-between text-[8px] uppercase font-mono text-slate-400">
                                    <div>
                                      <span className="block text-[6px] font-bold">Holder</span>
                                      <span className="text-white font-bold">{bankDetails.accountName}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[6px] font-bold">IFSC Code</span>
                                      <span className="text-white font-bold">{bankDetails.ifscCode}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Reverse card side: UPI QR card information */}
                              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-850 p-5 rounded-2xl flex flex-col justify-between text-white shadow-md">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-[8px] uppercase tracking-wider text-indigo-300 font-bold block">UPI VPA Merchant Receiver</span>
                                    <span className="text-xs font-bold block font-mono mt-0.5 text-indigo-200 truncate max-w-[170px]">{bankDetails.upiId}</span>
                                  </div>
                                  <span className="text-[9px] font-bold text-indigo-400 bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">BHIM UPI</span>
                                </div>
                                
                                <div className="flex gap-4 items-center mt-2">
                                  {/* Visual mock QR canvas representation */}
                                  <div className="w-20 h-20 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center border border-indigo-300">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                      <rect width="100" height="100" fill="white" />
                                      {/* Outer rings */}
                                      <rect x="5" y="5" width="30" height="30" fill="black" />
                                      <rect x="10" y="10" width="20" height="20" fill="white" />
                                      <rect x="15" y="15" width="10" height="10" fill="black" />
                                      
                                      <rect x="65" y="5" width="30" height="30" fill="black" />
                                      <rect x="70" y="10" width="20" height="20" fill="white" />
                                      <rect x="75" y="15" width="10" height="10" fill="black" />

                                      <rect x="5" y="65" width="30" height="30" fill="black" />
                                      <rect x="10" y="70" width="20" height="20" fill="white" />
                                      <rect x="15" y="75" width="10" height="10" fill="black" />
                                      
                                      {/* Nested scatter blocks */}
                                      <rect x="45" y="15" width="10" height="15" fill="black" />
                                      <rect x="55" y="35" width="15" height="10" fill="black" />
                                      <rect x="40" y="50" width="10" height="25" fill="black" />
                                      <rect x="75" y="55" width="15" height="15" fill="black" />
                                      <rect x="80" y="75" width="10" height="10" fill="black" />
                                    </svg>
                                  </div>
                                  <div className="text-[9px] text-indigo-300 leading-normal font-semibold">
                                    <p className="font-bold text-white mb-0.5">Scan to Pay VPA</p>
                                    <p>Points directly to settled receiver coordinates.</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>

                          {/* Bank configuration form input fields */}
                          <div className="space-y-4">
                            <div className={`flex gap-2 p-1 border rounded-lg text-xs font-bold font-semibold shrink-0 transition-colors ${
                              darkMode ? 'bg-slate-800 border-slate-750' : 'bg-slate-50 border-line'
                            }`}>
                              <button
                                type="button"
                                onClick={() => setBankDetails({ ...bankDetails, payoutMethod: 'bank' })}
                                className={`flex-1 py-1.5 rounded-md transition ${bankDetails.payoutMethod === 'bank' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                              >
                                Bank Transfer
                              </button>
                              <button
                                type="button"
                                onClick={() => setBankDetails({ ...bankDetails, payoutMethod: 'upi' })}
                                className={`flex-1 py-1.5 rounded-md transition ${bankDetails.payoutMethod === 'upi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                              >
                                UPI VPA Card
                              </button>
                            </div>

                            {bankDetails.payoutMethod === 'bank' ? (
                              <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-1">Bank Name</label>
                                    <input 
                                      type="text"
                                      value={bankDetails.bankName}
                                      onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 ${
                                        darkMode ? 'bg-slate-800 border-slate-750 text-white' : 'bg-slate-50/50 border-line text-slate-800 focus:bg-white'
                                      }`}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-1">Holder Name</label>
                                    <input 
                                      type="text"
                                      value={bankDetails.accountName}
                                      onChange={e => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 ${
                                        darkMode ? 'bg-slate-800 border-slate-750 text-white' : 'bg-slate-50/50 border-line text-slate-800 focus:bg-white'
                                      }`}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1">Account Number</label>
                                  <input 
                                    type="text"
                                    value={bankDetails.accountNumber}
                                    onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono ${
                                      darkMode ? 'bg-slate-800 border-slate-750 text-white' : 'bg-slate-50/50 border-line text-slate-800 focus:bg-white'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1">IFSC Branch Code</label>
                                  <input 
                                    type="text"
                                    maxLength={11}
                                    value={bankDetails.ifscCode}
                                    onChange={e => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono ${
                                      darkMode ? 'bg-slate-800 border-slate-750 text-white' : 'bg-slate-50/50 border-line text-slate-800 focus:bg-white'
                                    }`}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3 text-xs">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-1">UPI Address (VPA)</label>
                                  <input 
                                    type="text"
                                    value={bankDetails.upiId}
                                    onChange={e => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono ${
                                      darkMode ? 'bg-slate-800 border-slate-750 text-white' : 'bg-slate-50/50 border-line text-slate-800 focus:bg-white'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-1">Holder Verification</label>
                                  <input 
                                    type="text"
                                    value={bankDetails.accountName}
                                    onChange={e => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 ${
                                      darkMode ? 'bg-slate-800 border-slate-750 text-white' : 'bg-slate-50/50 border-line text-slate-800 focus:bg-white'
                                    }`}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <button 
                              onClick={() => showFeedback('Payout parameters synchronized successfully.')}
                              className={`w-full ${activeTheme.bg} text-white font-bold text-xs py-2.5 rounded-lg transition active:scale-95`}
                            >
                              Update Accounts Parameters
                            </button>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* Ledger History List */}
                    <div className={`border rounded-xl p-6 shadow-sm space-y-6 transition-colors ${
                      darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                    }`}>
                      <h3 className="font-display font-bold text-lg">Disbursement Ledger</h3>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                        {payouts.map(pay => (
                          <div key={pay.id} className={`flex justify-between items-center p-3.5 border rounded-lg text-xs transition-colors ${
                            darkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-line'
                          }`}>
                            <div className="space-y-1">
                              <span className="font-mono font-bold block">{pay.id}</span>
                              <span className="text-[10px] text-slate-400 font-semibold block">{pay.date} • {pay.method}</span>
                              <span className="text-[9px] text-slate-400 block font-mono">{pay.account}</span>
                            </div>
                            <div className="text-right space-y-1">
                              <span className="font-mono font-bold text-emerald-500 block">₹{pay.amount.toFixed(2)}</span>
                              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                                {pay.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 5: CUSTOMER CRM PANEL */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold leading-tight">Customer CRM Hub</h1>
                    <p className="text-xs lg:text-sm text-slate-400 mt-1">
                      Interact dynamically with buyers, examine lifetime values, and chat with office character clients.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    <div className={`border rounded-xl p-5 shadow-sm space-y-4 transition-colors ${
                      darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                    }`}>
                      <h3 className="font-display font-bold text-base mb-1">Directory</h3>
                      
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                        {CUSTOMER_DIRECTORY.map(cust => {
                          const isSelected = selectedCustomer.id === cust.id
                          return (
                            <div
                              key={cust.id}
                              onClick={() => setSelectedCustomer(cust)}
                              className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                                isSelected 
                                  ? `${activeTheme.border} ${activeTheme.hover} ${darkMode ? 'bg-slate-800/30' : 'bg-slate-50'}` 
                                  : darkMode 
                                    ? 'border-slate-800 hover:border-slate-700 bg-transparent' 
                                    : 'border-line hover:border-slate-350 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${isSelected ? activeTheme.bg + ' text-white' : 'bg-slate-550/10 text-slate-400'} flex items-center justify-center font-bold text-xs shrink-0`}>
                                  {cust.initials}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-xs block truncate">{cust.name}</span>
                                  <span className="text-[10px] text-slate-400 block truncate font-mono">{cust.email}</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100/10 text-[10px] font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">{cust.tier} User</span>
                                <span className="text-emerald-500 font-mono">₹{cust.spent.toFixed(2)} spent</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Chat console (obsidian theme styles) */}
                    <div className={`lg:col-span-2 border rounded-xl shadow-sm flex flex-col justify-between h-[580px] overflow-hidden transition-colors ${
                      darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                    }`}>
                      
                      <div className={`p-4 border-b flex justify-between items-center ${
                        darkMode ? 'bg-[#101622] border-slate-800' : 'bg-slate-50 border-line'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${activeTheme.bg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                            {selectedCustomer.initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">{selectedCustomer.name}</h4>
                            <span className="text-[10px] text-slate-405 block mt-0.5">Custom character agent • Online & Ready</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                            Score: {selectedCustomer.rating.toFixed(1)}/5
                          </span>
                        </div>
                      </div>

                      {/* Messages scroll panel */}
                      <div className={`flex-1 p-5 overflow-y-auto space-y-4 ${
                        darkMode ? 'bg-[#0E131E]/60' : 'bg-slate-50/50'
                      }`}>
                        {(() => {
                          const list = chatMessages[selectedCustomer.name] || []
                          return (
                            <>
                              <div className="text-center">
                                <span className={`text-[9px] font-bold uppercase tracking-widest border px-2.5 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                                  darkMode ? 'bg-[#151D2A] border-slate-800 text-slate-400' : 'bg-white border-line text-slate-400'
                                }`}>
                                  Secure encrypted link with buyer
                                </span>
                              </div>

                              <AnimatePresence>
                                {list.map((msg, idx) => {
                                  const isMe = msg.sender === 'merchant'
                                  return (
                                    <motion.div 
                                      key={idx} 
                                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                      <div className={`max-w-[75%] p-3.5 rounded-xl text-xs leading-relaxed shadow-sm flex flex-col gap-1.5 ${
                                        isMe 
                                          ? `${activeTheme.bg} text-white rounded-tr-none` 
                                          : darkMode 
                                            ? 'bg-slate-800/80 border border-slate-750 text-slate-200 rounded-tl-none' 
                                            : 'bg-white border border-line text-slate-800 rounded-tl-none'
                                      }`}>
                                        <p>{msg.text}</p>
                                        <span className={`text-[8px] font-bold font-mono self-end ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                                          {msg.time}
                                        </span>
                                      </div>
                                    </motion.div>
                                  )
                                })}
                              </AnimatePresence>
                              
                              {isTyping && (
                                <div className="flex justify-start">
                                  <div className={`p-3 rounded-xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-sm text-slate-405 font-medium border ${
                                    darkMode ? 'bg-slate-800 border-slate-750' : 'bg-white border-line'
                                  }`}>
                                    <span className="animate-pulse">Typing</span>
                                    <span className="flex gap-0.5">
                                      <motion.span 
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                        className="w-1.5 h-1.5 bg-slate-450 rounded-full"
                                      />
                                      <motion.span 
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                                        className="w-1.5 h-1.5 bg-slate-450 rounded-full"
                                      />
                                      <motion.span 
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                                        className="w-1.5 h-1.5 bg-slate-450 rounded-full"
                                      />
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              <div ref={chatBottomRef} />
                            </>
                          )
                        })()}
                      </div>

                      {/* Message submit */}
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-line bg-white flex gap-3 items-center">
                        <input 
                          type="text"
                          placeholder={`Message ${selectedCustomer.name.split(' ')[0]}...`}
                          value={messageText}
                          onChange={e => setMessageText(e.target.value)}
                          className="flex-grow border border-line rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 font-semibold"
                        />
                        <button 
                          type="submit"
                          className={`p-2.5 ${activeTheme.bg} hover:bg-opacity-90 text-white rounded-lg transition active:scale-95 shrink-0 shadow-sm`}
                          title="Send message"
                        >
                          <Send size={15} />
                        </button>
                      </form>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 6: SETTINGS & SHOP BRANDING */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold leading-tight">Branding & Store Profile</h1>
                    <p className="text-xs lg:text-sm text-slate-400 mt-1">
                      Adjust visual layout settings, set banner colors, and customize metadata labels printed on client invoices.
                    </p>
                  </div>

                  <div className={`border rounded-xl p-6 shadow-sm max-w-2xl transition-colors ${
                    darkMode ? 'bg-[#131A26] border-slate-800' : 'bg-white border-line'
                  }`}>
                    <h3 className="font-display font-bold text-lg mb-4">Merchant Settings Form</h3>
                    
                    <form onSubmit={e => {
                      e.preventDefault()
                      showFeedback('Store branding profile saved successfully.')
                    }} className="space-y-6 text-xs">
                      
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-1">Store Outlet Name</label>
                        <input 
                          type="text" 
                          required
                          value={shopSettings.storeName}
                          onChange={e => setShopSettings({ ...shopSettings, storeName: e.target.value })}
                          className={`w-full border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-750 focus:bg-white ${
                            darkMode ? 'bg-slate-800 border-slate-750 text-white focus:bg-slate-850' : 'bg-slate-50/50 border-line text-ink'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-1">Store Slogan / Summary</label>
                        <textarea 
                          value={shopSettings.description}
                          onChange={e => setShopSettings({ ...shopSettings, description: e.target.value })}
                          className={`w-full border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-750 focus:bg-white min-h-[80px] ${
                            darkMode ? 'bg-slate-800 border-slate-750 text-white focus:bg-slate-850' : 'bg-slate-50/50 border-line text-ink'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-1">Merchant Email</label>
                          <input 
                            type="email" 
                            required
                            value={shopSettings.supportEmail}
                            onChange={e => setShopSettings({ ...shopSettings, supportEmail: e.target.value })}
                            className={`w-full border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-750 focus:bg-white font-mono ${
                              darkMode ? 'bg-slate-800 border-slate-750 text-white focus:bg-slate-850' : 'bg-slate-50/50 border-line text-ink'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-1">Standard Handling Period</label>
                          <input 
                            type="text" 
                            required
                            value={shopSettings.shippingDays}
                            onChange={e => setShopSettings({ ...shopSettings, shippingDays: e.target.value })}
                            className={`w-full border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-750 focus:bg-white ${
                              darkMode ? 'bg-slate-800 border-slate-750 text-white focus:bg-slate-850' : 'bg-slate-50/50 border-line text-ink'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-405 mb-2">Workspace Theme & Accent Color</label>
                        <div className="flex gap-3">
                          {Object.keys(themeColors).map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setShopSettings({ ...shopSettings, bannerColor: color })}
                              className={`w-8 h-8 rounded-full border-2 transition transform hover:scale-110 active:scale-95 ${
                                shopSettings.bannerColor === color ? 'border-slate-850 scale-105 shadow-sm' : 'border-transparent'
                              }`}
                              style={{
                                backgroundColor: 
                                  color === 'jade' ? '#1B7A5E' :
                                  color === 'amber' ? '#E8A33D' :
                                  color === 'ink' ? '#15171C' :
                                  color === 'purple' ? '#6366F1' : '#F43F5E'
                              }}
                              title={`Select ${color}`}
                            ></button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button 
                          type="submit"
                          className={`px-6 py-2.5 ${activeTheme.bg} text-white font-bold rounded-lg transition active:scale-95 shadow-sm`}
                        >
                          Save Shop Settings
                        </button>
                      </div>

                    </form>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

      </main>

      {/* DETAIL DRAWER / OVERLAY: INSPECT ORDER MANIFEST */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in duration-300">
          <div 
            className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-line bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Fulfillment Docket</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-sm font-bold font-mono text-slate-900">{selectedOrder.id}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              <div className="bg-slate-50 border border-line rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Shipment Pipeline Stage</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                    selectedOrder.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                    selectedOrder.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="flex items-center justify-between relative py-2">
                  <div className="absolute inset-x-2.5 top-[19px] h-0.5 bg-slate-200 -z-0"></div>
                  
                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]"><Check size={12} /></div>
                    <span className="text-[9px] font-bold text-slate-700">Ordered</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      selectedOrder.status !== 'Ordered' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {selectedOrder.status !== 'Processing' ? <Check size={12} /> : '2'}
                    </div>
                    <span className="text-[9px] font-bold text-slate-700">Processing</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {selectedOrder.status === 'Delivered' ? <Check size={12} /> : '3'}
                    </div>
                    <span className="text-[9px] font-bold text-slate-700">Shipped</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      selectedOrder.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {selectedOrder.status === 'Delivered' ? <Check size={12} /> : '4'}
                    </div>
                    <span className="text-[9px] font-bold text-slate-700">Delivered</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-line rounded-lg p-3">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Customer info</span>
                  <span className="font-bold text-slate-800 block text-sm">{selectedOrder.customer}</span>
                  <span className="text-slate-400 block mt-0.5 font-mono">{selectedOrder.email}</span>
                </div>
                <div className="bg-slate-50 border border-line rounded-lg p-3">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Fulfillment Details</span>
                  <span className="font-bold text-slate-800 block">Est. Delivery</span>
                  <span className="text-slate-400 block mt-0.5">{shopSettings.shippingDays}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-line rounded-lg p-3">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Shipping destination</span>
                <span className="font-bold text-slate-700 leading-normal block">{selectedOrder.address}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Purchased Products</span>
                <div className="border border-line rounded-lg overflow-x-auto">
                  <table className="w-full text-left font-medium border-collapse">
                    <thead className="bg-slate-50 border-b border-line text-[9px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line text-slate-700">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="p-3 font-semibold text-slate-900">{item.title}</td>
                          <td className="p-3 text-center font-mono">{item.quantity}</td>
                          <td className="p-3 text-right font-mono">₹{item.price.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end p-2 text-right">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-slate-400 font-bold tracking-widest block">Total Settled</span>
                    <span className="text-lg font-mono font-bold text-emerald-800 block">₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-line rounded-lg p-4 space-y-3">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Tracking Details</span>
                {selectedOrder.trackingNumber ? (
                  <div className="flex justify-between items-center font-mono font-bold">
                    <span className="text-slate-700">Carrier ID:</span>
                    <span className="text-slate-900 border-b border-dashed border-slate-400">{selectedOrder.trackingNumber}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSaveTrackingNumber} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. IN-92812-TRK"
                      value={trackingInput}
                      onChange={e => setTrackingInput(e.target.value)}
                      className="flex-grow border border-line rounded px-3 py-1.5 focus:outline-none"
                    />
                    <button type="submit" className="bg-slate-900 text-white px-3 rounded hover:bg-slate-800 transition font-bold">Register ID</button>
                  </form>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Merchant Docket Comments</span>
                <form onSubmit={handleAddOrderComment} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={selectedOrder.notes || "Write internal notes..."}
                    value={internalNote}
                    onChange={e => setInternalNote(e.target.value)}
                    className="flex-grow border border-line rounded px-3 py-1.5 focus:outline-none"
                  />
                  <button type="submit" className="bg-slate-200 text-slate-800 px-3 rounded hover:bg-slate-300 transition font-bold">Update Docket</button>
                </form>
              </div>

            </div>

            <div className="p-4 border-t border-line bg-slate-50 flex gap-3">
              <button 
                onClick={() => setIsInvoiceOpen(true)}
                className="flex-1 bg-white border border-line hover:bg-slate-50 text-slate-800 font-bold py-2.5 rounded-lg transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Printer size={14} /> Tax Invoice
              </button>
              {selectedOrder.status !== 'Delivered' ? (
                <button 
                  onClick={() => {
                    const nextStage = selectedOrder.status === 'Processing' ? 'Shipped' : 'Delivered'
                    handleOrderStatusChange(selectedOrder.id, nextStage)
                  }}
                  className={`flex-1 ${activeTheme.bg} text-white font-bold py-2.5 rounded-lg transition active:scale-95 uppercase tracking-wider text-[10px]`}
                >
                  Advance Pipeline to {selectedOrder.status === 'Processing' ? 'Shipped' : 'Delivered'}
                </button>
              ) : (
                <div className="flex-grow bg-emerald-50 border border-emerald-100 rounded-lg py-2 text-center text-emerald-800 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={15} /> Order Fully Fulfilled
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* PRINT-READY TAX INVOICE */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white max-w-2xl w-full p-8 rounded-xl shadow-2xl relative animate-in zoom-in-95 flex flex-col justify-between my-8 max-h-[90vh]">
            <div className="absolute top-4 right-4 flex gap-2 no-print">
              <button 
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
              >
                <Printer size={13} /> Print Invoice
              </button>
              <button 
                onClick={() => setIsInvoiceOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded p-1.5"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-1 mt-4 text-ink">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                <div className="space-y-1">
                  <h2 className="font-display font-black text-2xl">{shopSettings.storeName}</h2>
                  <p className="text-[10px] text-slate-550 font-medium max-w-xs">{shopSettings.description}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-display font-bold text-xl uppercase tracking-wider block">Tax Invoice</span>
                  <span className="text-[10px] text-slate-400 font-mono block">Doc ID: {selectedOrder.id}-INV</span>
                  <span className="text-[10px] text-slate-400 font-mono block">Date: {new Date(selectedOrder.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 py-6 text-[10px]">
                <div className="space-y-1">
                  <span className="uppercase font-bold tracking-widest text-slate-400 block">Vendor Address</span>
                  <span className="font-bold block">UrbanCart Marketplace Ltd.</span>
                  <span className="text-slate-650 block">IFSC Registered Shop Branch</span>
                  <span className="text-slate-500 block">Support: {shopSettings.supportEmail}</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="uppercase font-bold tracking-widest text-slate-400 block">Buyer Address</span>
                  <span className="font-bold block">{selectedOrder.customer}</span>
                  <span className="text-slate-650 block leading-normal">{selectedOrder.address}</span>
                  <span className="text-slate-500 block font-mono">{selectedOrder.email}</span>
                </div>
              </div>
              <div className="border border-line rounded-lg overflow-x-auto my-4 text-[10px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-line text-slate-450 font-bold uppercase">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-center">Quantity</th>
                      <th className="p-3 text-right">Rate</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-slate-705">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="bg-white font-medium">
                        <td className="p-3 font-semibold">{item.title}</td>
                        <td className="p-3 text-center font-mono">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">₹{item.price.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono font-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end text-[10px] text-right font-medium py-4">
                <div className="w-56 space-y-2">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-mono">₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Integrated GST (0%)</span>
                    <span className="font-mono">₹0.00</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Platform Shipping Fee</span>
                    <span className="font-mono">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-1">
                    <span>Total Price</span>
                    <span className="font-mono text-emerald-800">₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-line text-[9px] text-slate-400 text-center leading-normal">
                This is a computer-generated tax invoice issued under the authority of UrbanCart. GST registration details not required for micro-merchant sales.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-line bg-slate-50 text-ink">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Plus size={18} className={activeTheme.text} />
                Create Catalog Listing
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-405 hover:text-slate-605 rounded p-1 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="flex-grow overflow-y-auto p-6 space-y-4 text-xs text-ink">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Minimalist Ceramic Cup"
                  value={newProduct.title}
                  onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unit Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    placeholder="e.g. 29.99"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Stock Count</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 10"
                    value={newProduct.stockCount}
                    onChange={e => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Department Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 text-xs font-semibold"
                  >
                    <option value="Home, Kitchen, Pets">Home & Kitchen</option>
                    <option value="Fashion">Fashion Dept</option>
                    <option value="Books">Books & Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">SKU code (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. UC-CER-192"
                    value={newProduct.sku}
                    onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Image</label>
                  <span className="text-[9px] text-slate-400">(URL or Upload)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Paste image URL..."
                    value={newProduct.image}
                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono text-xs"
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'add')}
                      className="hidden"
                      id="add-image-upload"
                    />
                    <label 
                      htmlFor="add-image-upload"
                      className="w-full border border-dashed border-line hover:border-emerald-700 hover:bg-slate-50/50 transition-colors rounded-lg px-3 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600"
                    >
                      <Upload size={14} className="text-emerald-700" />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                </div>
                <div className="h-24 border border-line bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center relative">
                  {newProduct.image ? (
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" onError={e => {
                      e.target.style.display = 'none'
                    }} />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold">Image preview appears here</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Brand Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Artisan Goods"
                  value={newProduct.brand}
                  onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                  className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product Description</label>
                <textarea 
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Provide details..."
                  className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 min-h-[60px]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-line">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-bold hover:bg-slate-50 rounded-lg border border-line"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`px-5 py-2 ${activeTheme.bg} text-white font-bold rounded-lg hover:bg-opacity-95 shadow-sm transition active:scale-95`}
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT DETAILS */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-line bg-slate-50 text-ink">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Edit2 size={16} className={activeTheme.text} />
                Modify Catalog Details ({editingProduct.id})
              </h2>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingProduct(null)
                }} 
                className="text-slate-405 hover:text-slate-605 rounded p-1 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditProductSubmit} className="flex-grow overflow-y-auto p-6 space-y-4 text-xs text-ink">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product Title</label>
                <input 
                  type="text" 
                  required
                  value={editingProduct.title}
                  onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unit Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Stock Count</label>
                  <input 
                    type="number" 
                    required
                    value={editingProduct.stockCount}
                    onChange={e => setEditingProduct({ ...editingProduct, stockCount: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Department Category</label>
                  <select 
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 text-xs font-semibold"
                  >
                    <option value="Home, Kitchen, Pets">Home & Kitchen</option>
                    <option value="Fashion">Fashion Dept</option>
                    <option value="Books">Books & Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">SKU code</label>
                  <input 
                    type="text" 
                    value={editingProduct.sku}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Image</label>
                  <span className="text-[9px] text-slate-400">(URL or Upload)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Paste image URL..."
                    value={editingProduct.image}
                    onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono text-xs"
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'edit')}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label 
                      htmlFor="edit-image-upload"
                      className="w-full border border-dashed border-line hover:border-emerald-700 hover:bg-slate-50/50 transition-colors rounded-lg px-3 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600"
                    >
                      <Upload size={14} className="text-emerald-700" />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                </div>
                <div className="h-24 border border-line bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center relative">
                  {editingProduct.image ? (
                    <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" onError={e => {
                      e.target.style.display = 'none'
                    }} />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold">Image preview appears here</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Brand Name</label>
                <input 
                  type="text" 
                  value={editingProduct.brand}
                  onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product Description</label>
                <textarea 
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full border border-line bg-slate-50/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 min-h-[60px]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-line">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingProduct(null)
                  }}
                  className="px-4 py-2 font-bold hover:bg-slate-50 rounded-lg border border-line"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`px-5 py-2 ${activeTheme.bg} text-white font-bold rounded-lg hover:bg-opacity-95 shadow-sm transition active:scale-95`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
