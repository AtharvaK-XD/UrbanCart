import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Category from './pages/Category'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderHistory from './pages/OrderHistory'
import Auth from './pages/Auth'
import SellerDashboard from './pages/SellerDashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/useAuthStore'
import PageTransition from './components/PageTransition'
import HelpCenter from './pages/HelpCenter'
import TrackOrder from './pages/TrackOrder'
import Returns from './pages/Returns'
import BecomeSeller from './pages/BecomeSeller'
import CartDrawer from './components/CartDrawer'
import Chatbot from './components/Chatbot'

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProtectedRoute allowedRole="BUYER"><PageTransition><Home /></PageTransition></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><PageTransition><Category /></PageTransition></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><PageTransition><ProductDetail /></PageTransition></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute allowedRole="BUYER"><PageTransition><Cart /></PageTransition></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute allowedRole="BUYER"><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />
        <Route path="/order-confirmation" element={<ProtectedRoute allowedRole="BUYER"><PageTransition><OrderConfirmation /></PageTransition></ProtectedRoute>} />
        <Route path="/order-history" element={<ProtectedRoute allowedRole="BUYER"><PageTransition><OrderHistory /></PageTransition></ProtectedRoute>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/seller" element={<ProtectedRoute allowedRole="SELLER"><PageTransition><SellerDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><PageTransition><HelpCenter /></PageTransition></ProtectedRoute>} />
        <Route path="/track-order" element={<ProtectedRoute allowedRole="BUYER"><PageTransition><TrackOrder /></PageTransition></ProtectedRoute>} />
        <Route path="/returns" element={<ProtectedRoute allowedRole="BUYER"><PageTransition><Returns /></PageTransition></ProtectedRoute>} />
        <Route path="/become-seller" element={<ProtectedRoute allowedRole="BUYER"><PageTransition><BecomeSeller /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const checkSession = useAuthStore(state => state.checkSession)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background font-body text-ink overflow-x-hidden">
        <Navbar />
        <CartDrawer />
        <Chatbot />
        <main className="flex-grow flex flex-col">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
