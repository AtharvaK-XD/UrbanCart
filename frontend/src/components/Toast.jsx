import { X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null

  const bgClasses = {
    success: 'bg-jade',
    error: 'bg-amber',
    info: 'bg-ink'
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-md text-surface shadow-md animate-in slide-in-from-bottom-5 ${bgClasses[type]}`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="hover:opacity-75 focus:outline-none">
        <X size={16} />
      </button>
    </div>
  )
}
