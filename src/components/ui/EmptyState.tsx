interface EmptyStateProps {
  title: string
  description?: string
  className?: string
}

export default function EmptyState({ title, description, className = '' }: EmptyStateProps) {
  return (
    <div className={`rounded-md border border-dashed border-border p-8 text-center text-muted ${className}`}>
      <p className="text-lg font-medium text-fg">{title}</p>
      {description && <p className="mt-1 text-sm">{description}</p>}
    </div>
  )
}
