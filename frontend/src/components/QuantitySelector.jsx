import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ quantity, onChange, min = 1, max = 99 }) {
  const handleDecrement = () => {
    if (quantity > min) onChange(quantity - 1)
  }

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1)
  }

  return (
    <div className="flex items-center border border-line rounded-md bg-surface w-fit">
      <button 
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="p-2 text-ink opacity-70 hover:opacity-100 disabled:opacity-30 hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-jade"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="w-10 text-center font-mono text-sm">{quantity}</span>
      <button 
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="p-2 text-ink opacity-70 hover:opacity-100 disabled:opacity-30 hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-jade"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
