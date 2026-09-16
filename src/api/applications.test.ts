import { describe, expect, it } from 'vitest'
import { submitApplication } from './applications'

describe('submitApplication', () => {
  it('resolves once the mock delay elapses, regardless of the payload', async () => {
    await expect(
      submitApplication(
        { name: 'John Doe', phone: '380671234567', telegram: '', message: '' },
        { random: () => 0.9 },
      ),
    ).resolves.toBeUndefined()
  })

  it('rejects with an ApiError when the error roll fails', async () => {
    await expect(
      submitApplication({ name: 'John Doe', phone: '', telegram: '@john', message: '' }, { random: () => 0 }),
    ).rejects.toMatchObject({ status: 500 })
  })
})
