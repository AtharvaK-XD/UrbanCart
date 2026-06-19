import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function ProtectedRoute({ children, allowedRole }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLoading = useAuthStore(state => state.isLoading)
  const role = useAuthStore(state => state.role)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jade"></div>
          <p className="text-sm font-medium text-ink opacity-70">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Prevent cross-access: Sellers cannot access Buyer-only routes, Buyers cannot access Seller-only routes
  if (allowedRole && role !== allowedRole) {
    if (role === 'SELLER') {
      return <Navigate to="/seller" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  // Redirect logged-in sellers to their portal if they hit the general homepage
  if (role === 'SELLER' && location.pathname === '/') {
    return <Navigate to="/seller" replace />
  }

  return children
}
