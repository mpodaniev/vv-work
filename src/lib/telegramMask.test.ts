import { describe, expect, it } from 'vitest'
import { formatTelegramInput, mapCursorPosition } from './telegramMask'

describe('formatTelegramInput', () => {
  it('prefixes a bare handle with @', () => {
    expect(formatTelegramInput('john')).toBe('@john')
  })

  it('does not duplicate a leading @ the user typed', () => {
    expect(formatTelegramInput('@john')).toBe('@john')
  })

  it('strips characters outside the allowed handle charset', () => {
    expect(formatTelegramInput('john doe!')).toBe('@johndoe')
  })

  it('caps the handle at 32 characters', () => {
    expect(formatTelegramInput('a'.repeat(40))).toBe(`@${'a'.repeat(32)}`)
  })

  it('returns an empty string for empty input rather than a bare @', () => {
    expect(formatTelegramInput('')).toBe('')
  })
})

describe('mapCursorPosition', () => {
  it('stays at 0 for an empty formatted value', () => {
    expect(mapCursorPosition('', '', 0)).toBe(0)
  })

  it('shifts the cursor right by one to skip the synthesized @', () => {
    expect(mapCursorPosition('john', '@john', 4)).toBe(5)
  })

  it('caps the cursor at the end of the formatted value', () => {
    expect(mapCursorPosition('john', '@john', 10)).toBe(5)
  })
})
