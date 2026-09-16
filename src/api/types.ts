export interface Category {
  slug: string
  label: string
}

export interface Partner {
  id: string
  slug: string
  name: string
  logoUrl?: string
  location: string
  industry: string
  description: string
  vacancyCount?: number
}

export interface Vacancy {
  id: string
  partnerSlug: string
  title: string
  categorySlug: string
  location: string
  employmentType: string
  salary?: string
  postedAt: string
  description: string
}

export interface ApplicationPayload {
  name: string
  phone?: string
  telegram?: string
  message?: string
}

export interface ApiError {
  message: string
  status: number
}

export function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'message' in value && 'status' in value
}
