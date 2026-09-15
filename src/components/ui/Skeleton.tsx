interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div role="status" aria-live="polite" className={`animate-pulse rounded-md bg-skeleton ${className}`} />
}
