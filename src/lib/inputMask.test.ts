import { describe, expect, it } from 'vitest'
import { mapCursorPosition } from './inputMask'

describe('mapCursorPosition', () => {
  it('keeps the cursor at the start when nothing relevant precedes it', () => {
    expect(mapCursorPosition('abc', 'abc', 0, (v) => v, () => false)).toBe(0)
  })

  it('walks every character when the formatting predicate never matches', () => {
    // With no formatting chars at all, "seen" advances one-for-one with the
    // formatted string, so the cursor should land right after the 2nd real char.
    expect(mapCursorPosition('ab', 'ab', 2, (v) => v, () => false)).toBe(2)
  })

  it('skips formatting characters while counting toward the cursor target', () => {
    expect(mapCursorPosition('1234', '12 34', 3, (v) => v.replace(/\D/g, ''), (char) => char === ' ')).toBe(4)
  })

  it('falls back to the end of the formatted string when the target is never reached', () => {
    // clean() reports more "real" characters than actually exist in `formatted`,
    // e.g. because clean-fn returned something longer than the formatted string.
    expect(mapCursorPosition('123456', 'ab', 6, () => '123456', () => false)).toBe(2)
  })

  it('lands right after the last real character once the target count is reached', () => {
    expect(mapCursorPosition('12 34', '12 345', 5, (v) => v.replace(/\D/g, ''), (char) => char === ' ')).toBe(5)
  })
})
