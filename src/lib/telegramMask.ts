import { mapCursorPosition as mapCursorPositionGeneric } from './inputMask'

const MAX_HANDLE_LENGTH = 32

// Strips any "@" the user typed (it's synthesized below) and anything outside
// Telegram's allowed handle charset, capped at Telegram's own 32-char limit.
function cleanHandleChars(value: string): string {
  return value
    .replace(/^@+/, '')
    .replace(/[^A-Za-z0-9_]/g, '')
    .slice(0, MAX_HANDLE_LENGTH)
}

/**
 * Formats raw input into a "@handle" display, e.g. "@john_doe" -> "@john_doe",
 * "john" -> "@john". Empty input stays empty rather than showing a bare "@".
 */
export function formatTelegramInput(value: string): string {
  const cleaned = cleanHandleChars(value)
  return cleaned ? `@${cleaned}` : ''
}

/**
 * Maps a cursor position in the pre-format input to the equivalent position in the
 * formatted "@handle" output. Unlike the phone mask, the "@" here is always
 * synthesized (never a real character the user placed), so it simply shifts
 * everything one position to the right once any handle character exists.
 */
export function mapCursorPosition(previousValue: string, formatted: string, previousCursor: number): number {
  return mapCursorPositionGeneric(previousValue, formatted, previousCursor, cleanHandleChars, (char) => char === '@')
}
