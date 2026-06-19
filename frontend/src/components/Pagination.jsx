import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 font-mono mt-8">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-background disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-background disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
