import vacanciesJson from '../data/vacancies.json'
import { mockFetch, type MockFetchOptions } from './client'
import type { Vacancy } from './types'

const vacancies = vacanciesJson as Vacancy[]

export function getVacancies(partnerSlug: string, opts?: MockFetchOptions): Promise<Vacancy[]> {
  return mockFetch(() => vacancies.filter((v) => v.partnerSlug === partnerSlug), opts)
}
