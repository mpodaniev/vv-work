import Button from './Button'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
  className?: string
}

export default function ErrorState({ message = 'Something went wrong.', onRetry, className = '' }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-3 rounded-md border border-error bg-error-bg p-6 text-center ${className}`}
    >
      <p className="text-fg">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
