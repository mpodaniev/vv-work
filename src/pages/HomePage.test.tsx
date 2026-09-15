import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Partner, Vacancy } from '../api/types'
import { getPartners } from '../api/partners'
import { getVacancies } from '../api/vacancies'
import HomePage from './HomePage'

const partners: Partner[] = [
  {
    id: 'p1',
    slug: 'northline-logistics',
    name: 'Northline Logistics',
    location: 'Rotterdam, Netherlands',
    industry: 'Logistics & Freight',
    description: 'Cross-border freight and warehousing operations.',
    vacancyCount: 7,
  },
  {
    id: 'p2',
    slug: 'bright-build',
    name: 'Bright Build',
    location: 'Warsaw, Poland',
    industry: 'Construction',
    description: 'Residential and commercial construction.',
    vacancyCount: 6,
  },
]

const vacanciesByPartnerSlug: Record<string, Vacancy[]> = {
  'northline-logistics': [
    {
      id: 'v1',
      partnerSlug: 'northline-logistics',
      title: 'Warehouse Operative',
      categorySlug: 'logistics',
      location: 'Rotterdam, Netherlands',
      employmentType: 'Full-time',
      postedAt: '2026-08-20',
      description: 'Pick, pack, and load pallets.',
    },
  ],
  'bright-build': [
    {
      id: 'v8',
      partnerSlug: 'bright-build',
      title: 'Bricklayer',
      categorySlug: 'construction',
      location: 'Warsaw, Poland',
      employmentType: 'Full-time',
      postedAt: '2026-08-18',
      description: 'Lay brick and block walls to plan.',
    },
  ],
}

vi.mock('../api/partners', () => ({
  getPartners: vi.fn(),
}))

vi.mock('../api/vacancies', () => ({
  getVacancies: vi.fn(),
}))

const mockedGetPartners = vi.mocked(getPartners)
const mockedGetVacancies = vi.mocked(getVacancies)

function mockLoadedHome() {
  mockedGetPartners.mockResolvedValue(partners)
  mockedGetVacancies.mockImplementation((partnerSlug) =>
    Promise.resolve(vacanciesByPartnerSlug[partnerSlug] ?? []),
  )
}

function renderPage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  it('renders skeleton placeholders while partners are loading', () => {
    mockedGetPartners.mockReturnValue(new Promise(() => {}))
    mockedGetVacancies.mockReturnValue(new Promise(() => {}))
    renderPage()

    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
    expect(screen.queryByRole('link', { name: 'Northline Logistics' })).not.toBeInTheDocument()
    expect(screen.queryByText('Northline Logistics')).not.toBeInTheDocument()
  })

  it('renders category links and partner cards once loaded', async () => {
    mockLoadedHome()
    renderPage()

    expect(await screen.findByRole('link', { name: 'Northline Logistics' })).toHaveAttribute(
      'href',
      '/partners/northline-logistics?category=logistics',
    )
    expect(screen.getByRole('link', { name: 'Bright Build' })).toHaveAttribute(
      'href',
      '/partners/bright-build?category=construction',
    )
    expect(screen.getAllByText('Northline Logistics').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Bright Build').length).toBeGreaterThan(0)
  })

  it('renders the "other" category as non-clickable', async () => {
    mockLoadedHome()
    renderPage()

    await screen.findByRole('link', { name: 'Northline Logistics' })

    expect(screen.queryByRole('link', { name: 'Other' })).not.toBeInTheDocument()
    expect(screen.getByText('Other')).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows an error state per section with an independent retry', async () => {
    // Both the category section and the partner-list section call getPartners on mount, so
    // the first two calls are the ones to fail before a retry recovers each independently.
    let callCount = 0
    mockedGetPartners.mockImplementation(() => {
      callCount += 1
      if (callCount <= 2) return Promise.reject({ message: 'Network error', status: 500 })
      return Promise.resolve(partners)
    })
    mockedGetVacancies.mockImplementation((partnerSlug) =>
      Promise.resolve(vacanciesByPartnerSlug[partnerSlug] ?? []),
    )
    const user = userEvent.setup()
    renderPage()

    const alerts = await screen.findAllByRole('alert')
    expect(alerts).toHaveLength(2)

    for (const retryButton of screen.getAllByRole('button', { name: 'Try again' })) {
      await user.click(retryButton)
    }

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Northline Logistics' })).toBeInTheDocument(),
    )
    expect(screen.getAllByText('Northline Logistics').length).toBeGreaterThan(0)
  })
})
