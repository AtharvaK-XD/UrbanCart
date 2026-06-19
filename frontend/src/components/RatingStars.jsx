import { Star, StarHalf } from 'lucide-react'
import { cn } from '../utils'

export default function RatingStars({ rating, count, className }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex text-amber">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} size={16} fill="currentColor" stroke="currentColor" />
          }
          if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} size={16} fill="currentColor" stroke="currentColor" />
          }
          return <Star key={i} size={16} stroke="currentColor" className="opacity-30" />
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-ink opacity-60 ml-1">({count})</span>
      )}
    </div>
  )
}
