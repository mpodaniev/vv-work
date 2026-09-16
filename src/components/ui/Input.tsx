import { useId, type InputHTMLAttributes, type Ref } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  /** Decorative fixed addon rendered inside the field (e.g. "+" for a phone
   * number) — not part of the input's value, so it never hides the placeholder. */
  prefix?: string
  ref?: Ref<HTMLInputElement>
}

export default function Input({ label, error, hint, prefix, id, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-fg">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-fg">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full rounded-md border bg-bg py-2 text-fg placeholder:text-muted focus-visible:outline-none ${
            prefix ? 'pl-7 pr-4' : 'px-4'
          } ${error ? 'border-error' : 'border-border'} ${className}`}
          {...props}
        />
      </div>
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
