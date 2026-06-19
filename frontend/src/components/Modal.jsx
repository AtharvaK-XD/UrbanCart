import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-surface rounded-md shadow-lg w-full max-w-md flex flex-col max-h-[90vh] animate-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-line">
          <h2 className="font-display font-bold text-xl">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-background rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
