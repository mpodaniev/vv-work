import { describe, expect, it } from 'vitest'
import { formatPhoneInput, isPhoneEmpty, mapCursorPosition } from './phoneMask'

describe('isPhoneEmpty', () => {
  it('is true for an empty string', () => {
    expect(isPhoneEmpty('')).toBe(true)
  })

  it('is true when the value has no digits', () => {
    expect(isPhoneEmpty('+ ( ) -')).toBe(true)
  })

  it('is false once at least one digit is present', () => {
    expect(isPhoneEmpty('3')).toBe(false)
  })
})

describe('formatPhoneInput', () => {
  it('groups digits in chunks of 3', () => {
    expect(formatPhoneInput('3806712345')).toBe('380 671 234 5')
  })

  it('strips non-digit characters before grouping', () => {
    expect(formatPhoneInput('+380 (67) 123-45')).toBe('380 671 234 5')
  })

  it('caps the result at 15 digits', () => {
    expect(formatPhoneInput('1'.repeat(20))).toBe('111 111 111 111 111')
  })

  it('returns an empty string for empty input', () => {
    expect(formatPhoneInput('')).toBe('')
  })
})

describe('mapCursorPosition', () => {
  it('keeps the cursor at the start when nothing precedes it', () => {
    expect(mapCursorPosition('3806712345', '380 671 234 5', 0)).toBe(0)
  })

  it('shifts the cursor forward to account for an inserted grouping space', () => {
    // Typing a 4th digit right after "380" -> caret sits right after that digit
    // in "380 6", i.e. index 5.
    expect(mapCursorPosition('3806', '380 6', 4)).toBe(5)
  })

  it('places the cursor at the end when it was at the end of the source value', () => {
    expect(mapCursorPosition('3806712345', '380 671 234 5', 10)).toBe(13)
  })
})
