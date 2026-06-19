import { Link } from 'react-router-dom'
import { MapPinOff } from 'lucide-react'
import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <EmptyState 
        icon={MapPinOff}
        title="Page Not Found"
        message="The page you are looking for doesn't exist or has been moved."
        action={
          <Link to="/" className="bg-jade text-surface px-6 py-3 rounded-md font-bold hover:bg-opacity-90 inline-block">
            Return to Homepage
          </Link>
        }
      />
    </div>
  )
}
