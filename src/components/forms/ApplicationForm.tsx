import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { submitApplication } from '../../api/applications'
import { isApiError, type ApiError } from '../../api/types'
import { formatPhoneInput, isPhoneEmpty, mapCursorPosition as mapPhoneCursorPosition } from '../../lib/phoneMask'
import { formatTelegramInput, mapCursorPosition as mapTelegramCursorPosition } from '../../lib/telegramMask'
import { validateApplicationForm, type ApplicationFormErrors, type ApplicationFormValues } from '../../lib/validation'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'

type SubmitStatus = 'idle' | 'success' | 'error'

const FIELD_ORDER: (keyof ApplicationFormValues)[] = ['name', 'phone', 'telegram', 'message']
const MASKED_FIELDS = ['phone', 'telegram'] as const satisfies readonly (typeof FIELD_ORDER)[number][]
type MaskedField = (typeof MASKED_FIELDS)[number]

const MASK_CONFIG: Record<
  MaskedField,
  { format: (value: string) => string; mapCursor: (previousValue: string, formatted: string, previousCursor: number) => number }
> = {
  phone: { format: formatPhoneInput, mapCursor: mapPhoneCursorPosition },
  telegram: { format: formatTelegramInput, mapCursor: mapTelegramCursorPosition },
}

export default function ApplicationForm() {
  const [values, setValues] = useState<ApplicationFormValues>({ name: '', phone: '', telegram: '', message: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof ApplicationFormValues, boolean>>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<ApiError | null>(null)
  const isMountedRef = useRef(true)
  const fieldRefs = useRef<Partial<Record<keyof ApplicationFormValues, HTMLInputElement | HTMLTextAreaElement>>>({})
  const fieldRefSetters = useRef<Partial<Record<keyof ApplicationFormValues, (el: HTMLInputElement | HTMLTextAreaElement | null) => void>>>({})
  const pendingCursorRef = useRef<Partial<Record<MaskedField, number>>>({})

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const errors: ApplicationFormErrors = useMemo(() => validateApplicationForm(values), [values])

  function handleChange(field: keyof ApplicationFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  // A stable ref-callback per field, so React doesn't tear down and reattach the
  // ref on every re-render (which an inline `ref={(el) => ...}` would trigger).
  function getFieldRefSetter(field: keyof ApplicationFormValues) {
    return (fieldRefSetters.current[field] ??= (el) => {
      fieldRefs.current[field] = el ?? undefined
    })
  }

  // Reformats a masked field (phone/telegram) as the user types and stashes where
  // the caret should end up, since reflowing the whole string would otherwise
  // bounce the cursor to the end (or worse, the start) on every keystroke.
  const handleMaskedChange = useCallback((field: MaskedField, event: ChangeEvent<HTMLInputElement>) => {
    const { format, mapCursor } = MASK_CONFIG[field]
    const input = event.target
    const previousValue = input.value
    const previousCursor = input.selectionStart ?? previousValue.length
    const formatted = format(previousValue)

    pendingCursorRef.current[field] = mapCursor(previousValue, formatted, previousCursor)
    handleChange(field, formatted)
  }, [])

  // Restoring the caret must happen synchronously after the DOM commit (not via
  // requestAnimationFrame): fast/automated typing dispatches the next keystroke
  // before a frame fires, so an rAF-deferred fix loses the race and the browser
  // inserts the next character at the stale (pre-restore) cursor position.
  useLayoutEffect(() => {
    for (const field of MASKED_FIELDS) {
      const cursor = pendingCursorRef.current[field]
      if (cursor === undefined) continue
      pendingCursorRef.current[field] = undefined
      fieldRefs.current[field]?.setSelectionRange(cursor, cursor)
    }
  }, [values.phone, values.telegram])

  function handleBlur(field: keyof ApplicationFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  async function submit() {
    setSubmitError(null)
    // True optimistic UI: assume success the moment client-side validation
    // passes, then roll back to the form (with data intact) if the mock API
    // actually rejects the request.
    setStatus('success')
    try {
      await submitApplication({
        name: values.name,
        phone: isPhoneEmpty(values.phone) ? undefined : `+${values.phone.trim()}`,
        telegram: values.telegram.trim() || undefined,
        message: values.message || undefined,
      })
    } catch (err) {
      if (!isMountedRef.current) return
      setSubmitError(isApiError(err) ? err : { message: 'Something went wrong. Please try again.', status: 500 })
      setStatus('error')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (Object.keys(errors).length > 0) {
      setTouched({ name: true, phone: true, telegram: true, message: true })
      const firstInvalidField = FIELD_ORDER.find((field) => errors[field])
      if (firstInvalidField) fieldRefs.current[firstInvalidField]?.focus()
      return
    }

    void submit()
  }

  if (status === 'success') {
    return (
      <EmptyState title="Thanks — we'll be in touch." description="We received your application and will reach out shortly." />
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : undefined}
        ref={getFieldRefSetter('name')}
      />
      <Input
        label="Phone number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        prefix="+"
        placeholder="380 67 123 4567"
        hint="Enter a phone number or a Telegram handle below."
        value={values.phone}
        onChange={(e) => handleMaskedChange('phone', e)}
        onBlur={() => handleBlur('phone')}
        error={touched.phone ? errors.phone : undefined}
        ref={getFieldRefSetter('phone')}
      />
      <Input
        label="Telegram handle"
        type="text"
        inputMode="text"
        autoComplete="off"
        placeholder="@username"
        value={values.telegram}
        onChange={(e) => handleMaskedChange('telegram', e)}
        onBlur={() => handleBlur('telegram')}
        error={touched.telegram ? errors.telegram : undefined}
        ref={getFieldRefSetter('telegram')}
      />
      <Textarea
        label="Message (optional)"
        rows={4}
        value={values.message}
        onChange={(e) => handleChange('message', e.target.value)}
        onBlur={() => handleBlur('message')}
        error={touched.message ? errors.message : undefined}
        ref={getFieldRefSetter('message')}
      />

      {status === 'error' && submitError && <ErrorState message={submitError.message} onRetry={() => void submit()} />}

      <Button type="submit" className="w-full sm:w-auto">
        Send application
      </Button>
    </form>
  )
}
