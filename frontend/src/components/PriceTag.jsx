import { cn } from '../utils'

export default function PriceTag({ price, originalPrice, className }) {
  return (
    <div className={cn("font-mono flex items-center gap-2", className)}>
      <span className="text-ink font-semibold">
        ₹{Number(price).toFixed(2)}
      </span>
      {originalPrice && (
        <span className="text-sm text-ink opacity-40 line-through">
          ₹{Number(originalPrice).toFixed(2)}
        </span>
      )}
    </div>
  )
}
