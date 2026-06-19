export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-surface border border-line rounded-md">
      {Icon && (
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-ink opacity-50 mb-4">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-xl font-display font-bold text-ink mb-2">{title}</h3>
      <p className="text-ink opacity-70 max-w-sm mb-6">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}
