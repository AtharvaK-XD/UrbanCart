import { cn } from '../utils'

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-line/50", className)}
      {...props}
    />
  )
}
