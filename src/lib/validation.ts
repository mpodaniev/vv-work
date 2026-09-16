import { isPhoneEmpty } from './phoneMask'

export interface FieldValidation {
  valid: boolean
  message?: string
}

// Permissive on purpose: this is a mock form, not a billing system, so we accept
// loosely-formatted phone numbers (incl. the mask's grouping spaces) rather than
// enforcing strict E.164.
const PHONE_PATTERN = /^\+?[0-9()\s-]{7,25}$/
const TELEGRAM_HANDLE_PATTERN = /^@[A-Za-z0-9_]{5,32}$/

export function validateName(value: string): FieldValidation {
  const trimmed = value.trim()
  if (trimmed.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters.' }
  }
  return { valid: true }
}

export function validatePhone(value: string): FieldValidation {
  const trimmed = value.trim()
  if (!PHONE_PATTERN.test(trimmed)) {
    return { valid: false, message: 'Enter a valid phone number.' }
  }
  return { valid: true }
}

export function validateTelegram(value: string): FieldValidation {
  const trimmed = value.trim()
  if (!TELEGRAM_HANDLE_PATTERN.test(trimmed)) {
    return { valid: false, message: 'Enter a valid Telegram handle (5-32 characters).' }
  }
  return { valid: true }
}

export function validateMessage(value: string): FieldValidation {
  if (value.length > 500) {
    return { valid: false, message: 'Message must be 500 characters or fewer.' }
  }
  return { valid: true }
}

export interface ApplicationFormValues {
  name: string
  phone: string
  telegram: string
  message: string
}

export type ApplicationFormErrors = Partial<Record<keyof ApplicationFormValues, string>>

const NO_CONTACT_MESSAGE = 'Enter a phone number or a Telegram handle.'

// Phone and Telegram are each individually optional, but at least one must be
// present and valid — the brief asks for "phone/telegram", read as either channel
// being an acceptable way to reach the candidate, not both mandatory.
export function validateApplicationForm(values: ApplicationFormValues): ApplicationFormErrors {
  const errors: ApplicationFormErrors = {}

  const nameResult = validateName(values.name)
  if (!nameResult.valid) errors.name = nameResult.message

  // The phone field always displays a pinned "+", so "empty" means no digits
  // were typed — an untouched field must not look "filled" just because of the prefix.
  const phoneFilled = !isPhoneEmpty(values.phone)
  const telegram = values.telegram.trim()

  if (!phoneFilled && !telegram) {
    errors.phone = NO_CONTACT_MESSAGE
    errors.telegram = NO_CONTACT_MESSAGE
  } else {
    if (phoneFilled) {
      const phoneResult = validatePhone(values.phone)
      if (!phoneResult.valid) errors.phone = phoneResult.message
    }
    if (telegram) {
      const telegramResult = validateTelegram(values.telegram)
      if (!telegramResult.valid) errors.telegram = telegramResult.message
    }
  }

  const messageResult = validateMessage(values.message)
  if (!messageResult.valid) errors.message = messageResult.message

  return errors
}
