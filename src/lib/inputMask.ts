/**
 * Generic caret-mapping algorithm shared by input masks: count "real" characters
 * before the previous cursor position in the raw input (via `clean`), then walk the
 * formatted output skipping synthesized/formatting characters until that many real
 * characters have been seen.
 */
export function mapCursorPosition(
  previousValue: string,
  formatted: string,
  previousCursor: number,
  clean: (value: string) => string,
  isFormattingChar: (char: string) => boolean,
): number {
  const relevantBeforeCursor = clean(previousValue.slice(0, previousCursor)).length
  if (relevantBeforeCursor === 0) return 0

  let seen = 0
  for (let i = 0; i < formatted.length; i++) {
    if (!isFormattingChar(formatted.charAt(i))) seen++
    if (seen >= relevantBeforeCursor) return i + 1
  }
  return formatted.length
}
