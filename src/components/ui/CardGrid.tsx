import { Fragment, type ReactNode } from 'react'
import EmptyState from './EmptyState'
import Skeleton from './Skeleton'

export const CARD_GRID_CLASSNAME = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

interface CardGridProps<T> {
  items: T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T) => ReactNode
  emptyTitle: string
  emptyDescription?: string
  className?: string
}

export default function CardGrid<T>({
  items,
  keyExtractor,
  renderItem,
  emptyTitle,
  emptyDescription,
  className = CARD_GRID_CLASSNAME,
}: CardGridProps<T>) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={className}>
      {items.map((item) => (
        <Fragment key={keyExtractor(item)}>{renderItem(item)}</Fragment>
      ))}
    </div>
  )
}

interface CardGridSkeletonProps {
  count: number
  itemClassName?: string
  className?: string
}

export function CardGridSkeleton({
  count,
  itemClassName = 'h-32 w-full',
  className = CARD_GRID_CLASSNAME,
}: CardGridSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={itemClassName} />
      ))}
    </div>
  )
}
