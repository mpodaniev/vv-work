import { describe, expect, it } from 'vitest'
import {
  validateApplicationForm,
  validateMessage,
  validateName,
  validatePhone,
  validateTelegram,
} from './validation'

describe('validateName', () => {
  it('rejects a name shorter than 2 characters', () => {
    expect(validateName('a')).toEqual({ valid: false, message: 'Name must be at least 2 characters.' })
  })

  it('rejects a name that is only whitespace', () => {
    expect(validateName('  a  ')).toEqual({ valid: false, message: 'Name must be at least 2 characters.' })
  })

  it('accepts a name at the 2-character boundary', () => {
    expect(validateName('Jo')).toEqual({ valid: true })
  })
})

describe('validatePhone', () => {
  it('accepts a plain digit string', () => {
    expect(validatePhone('380671234567')).toEqual({ valid: true })
  })

  it('accepts the masked grouped format with a leading +', () => {
    expect(validatePhone('+380 67 123 4567')).toEqual({ valid: true })
  })

  it('rejects a string shorter than 7 characters', () => {
    expect(validatePhone('12345').valid).toBe(false)
  })

  it('rejects a string containing letters', () => {
    expect(validatePhone('380abc1234').valid).toBe(false)
  })
})

describe('validateTelegram', () => {
  it('accepts a handle at the 5-character lower boundary', () => {
    expect(validateTelegram('@abcde')).toEqual({ valid: true })
  })

  it('rejects a handle without the leading @', () => {
    expect(validateTelegram('abcde').valid).toBe(false)
  })

  it('rejects a handle shorter than 5 characters', () => {
    expect(validateTelegram('@abcd').valid).toBe(false)
  })

  it('rejects a handle longer than 32 characters', () => {
    expect(validateTelegram(`@${'a'.repeat(33)}`).valid).toBe(false)
  })
})

describe('validateMessage', () => {
  it('accepts an empty message', () => {
    expect(validateMessage('')).toEqual({ valid: true })
  })

  it('accepts a message at exactly 500 characters', () => {
    expect(validateMessage('a'.repeat(500))).toEqual({ valid: true })
  })

  it('rejects a message over 500 characters', () => {
    expect(validateMessage('a'.repeat(501)).valid).toBe(false)
  })
})

describe('validateApplicationForm', () => {
  const base = { name: 'John Doe', phone: '', telegram: '', message: '' }

  it('requires at least one contact channel when both phone and telegram are empty', () => {
    const errors = validateApplicationForm(base)
    expect(errors.phone).toBe('Enter a phone number or a Telegram handle.')
    expect(errors.telegram).toBe('Enter a phone number or a Telegram handle.')
  })

  it('passes with only a valid phone filled in', () => {
    const errors = validateApplicationForm({ ...base, phone: '380671234567' })
    expect(errors.phone).toBeUndefined()
    expect(errors.telegram).toBeUndefined()
  })

  it('passes with only a valid telegram handle filled in', () => {
    const errors = validateApplicationForm({ ...base, telegram: '@john_doe' })
    expect(errors.phone).toBeUndefined()
    expect(errors.telegram).toBeUndefined()
  })

  it('flags an invalid phone even when telegram is also empty', () => {
    const errors = validateApplicationForm({ ...base, phone: '123' })
    expect(errors.phone).toBe('Enter a valid phone number.')
  })

  it('flags an invalid telegram handle while a valid phone is present', () => {
    const errors = validateApplicationForm({ ...base, phone: '380671234567', telegram: '@bad' })
    expect(errors.telegram).toBe('Enter a valid Telegram handle (5-32 characters).')
    expect(errors.phone).toBeUndefined()
  })

  it('flags a name below 2 characters alongside contact errors', () => {
    const errors = validateApplicationForm({ ...base, name: 'A' })
    expect(errors.name).toBe('Name must be at least 2 characters.')
  })

  it('flags a message over 500 characters', () => {
    const errors = validateApplicationForm({ ...base, phone: '380671234567', message: 'a'.repeat(501) })
    expect(errors.message).toBe('Message must be 500 characters or fewer.')
  })

  it('returns no errors for a fully valid submission', () => {
    const errors = validateApplicationForm({
      name: 'John Doe',
      phone: '380671234567',
      telegram: '',
      message: 'Hello there',
    })
    expect(errors).toEqual({})
  })
})
