import { cn } from '../utils'

export default function StampBadge({ text, className }) {
  if (!text) return null;
  
  return (
    <div 
      className={cn(
        "absolute top-3 left-3 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
        "bg-surface text-ink border border-line shadow-sm",
        "transform -rotate-2 origin-top-left",
        // Torn notch simulation with clip-path or border styling.
        // We'll use a subtle clip-path for the torn look.
        "[clip-path:polygon(0%_0%,_100%_0%,_100%_100%,_85%_90%,_70%_100%,_55%_90%,_40%_100%,_25%_90%,_10%_100%,_0%_90%)]",
        className
      )}
    >
      {text}
    </div>
  )
}
