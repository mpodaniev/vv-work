import partnersJson from '../data/partners.json'
import { mockFetch, type MockFetchOptions } from './client'
import type { ApiError, Partner } from './types'

const partners = partnersJson as Partner[]

export function getPartners(opts?: MockFetchOptions): Promise<Partner[]> {
  return mockFetch(() => partners, opts)
}

export function getPartnerBySlug(slug: string, opts?: MockFetchOptions): Promise<Partner> {
  return mockFetch(() => {
    const partner = partners.find((p) => p.slug === slug)
    if (!partner) {
      throw { message: `Partner "${slug}" was not found.`, status: 404 } satisfies ApiError
    }
    return partner
  }, opts)
}
