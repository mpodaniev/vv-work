import { mapCursorPosition as mapCursorPositionGeneric } from './inputMask'

// E.164 caps a phone number at 15 digits; used as a sane typing limit for the mask.
const MAX_DIGITS = 15

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '').slice(0, MAX_DIGITS)
}

export function isPhoneEmpty(value: string): boolean {
  return digitsOnly(value).length === 0
}

/**
 * Formats raw input into a grouped phone display, e.g. "3806712345" -> "380 671 2345".
 * The "+" itself is NOT part of this value — it's rendered as a fixed decorative
 * prefix by the <Input prefix="+"> addon, so the field's placeholder can still show
 * (a non-empty value hides the native placeholder). Country-agnostic: groups digits
 * in chunks of 3 rather than parsing a real country code, since this is a display
 * mask for a mock form, not a phone-number library.
 */
export function formatPhoneInput(value: string): string {
  const digits = digitsOnly(value)
  const groups = digits.match(/.{1,3}/g) ?? []
  return groups.join(' ')
}

/**
 * Maps a cursor position in the pre-format input to the equivalent position in the
 * formatted output, so retyping in the middle of a number doesn't bounce the caret
 * to the start or end.
 */
export function mapCursorPosition(previousValue: string, formatted: string, previousCursor: number): number {
  return mapCursorPositionGeneric(previousValue, formatted, previousCursor, digitsOnly, (char) => char === ' ')
}
