import { useId, type Ref, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  ref?: Ref<HTMLTextAreaElement>
}

export default function Textarea({ label, error, hint, id, className = '', ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const errorId = `${textareaId}-error`
  const hintId = `${textareaId}-hint`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={textareaId} className="text-sm font-medium text-fg">
        {label}
      </label>
      <textarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`w-full rounded-md border bg-bg px-4 py-2 text-fg placeholder:text-muted focus-visible:outline-none ${
          error ? 'border-error' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
