import { describe, expect, it } from 'vitest'
import { getPartnerBySlug, getPartners } from './partners'

const opts = { minDelayMs: 0, maxDelayMs: 0, errorRate: 0 }

describe('getPartners', () => {
  it('resolves with all partners', async () => {
    const partners = await getPartners(opts)
    expect(partners.length).toBeGreaterThan(0)
    expect(partners.some((p) => p.slug === 'northline-logistics')).toBe(true)
  })
})

describe('getPartnerBySlug', () => {
  it('resolves with the matching partner', async () => {
    const partner = await getPartnerBySlug('northline-logistics', opts)
    expect(partner.name).toBe('Northline Logistics')
  })

  it('rejects with a 404 ApiError when no partner matches', async () => {
    await expect(getPartnerBySlug('does-not-exist', opts)).rejects.toMatchObject({ status: 404 })
  })
})
