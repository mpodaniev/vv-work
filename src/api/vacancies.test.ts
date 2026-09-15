import { describe, expect, it } from 'vitest'
import { getVacancies } from './vacancies'

const opts = { minDelayMs: 0, maxDelayMs: 0, errorRate: 0 }

describe('getVacancies', () => {
  it('resolves with only the vacancies for the given partner', async () => {
    const vacancies = await getVacancies('northline-logistics', opts)
    expect(vacancies.length).toBeGreaterThan(0)
    expect(vacancies.every((v) => v.partnerSlug === 'northline-logistics')).toBe(true)
  })

  it('resolves with an empty array for a partner with no vacancies', async () => {
    const vacancies = await getVacancies('unknown-partner', opts)
    expect(vacancies).toEqual([])
  })
})
