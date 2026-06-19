import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-ink opacity-70 mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <Link to="/" className="hover:text-jade transition-colors">Home</Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={14} className="opacity-50" />
          {item.href ? (
            <Link to={item.href} className="hover:text-jade transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink opacity-100">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
