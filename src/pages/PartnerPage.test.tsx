import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Partner, Vacancy } from '../api/types'
import PartnerPage from './PartnerPage'

const partner: Partner = {
  id: 'p1',
  slug: 'northline-logistics',
  name: 'Northline Logistics',
  location: 'Rotterdam, Netherlands',
  industry: 'Logistics & Freight',
  description: 'Cross-border freight and warehousing operations.',
}

const vacancies: Vacancy[] = [
  {
    id: 'v1',
    partnerSlug: 'northline-logistics',
    title: 'Warehouse Operative',
    categorySlug: 'logistics',
    location: 'Rotterdam, Netherlands',
    employmentType: 'Full-time',
    postedAt: '2026-08-20',
    description: 'Pick and pack.',
  },
  {
    id: 'v2',
    partnerSlug: 'northline-logistics',
    title: 'Forklift Operator',
    categorySlug: 'logistics',
    location: 'Rotterdam, Netherlands',
    employmentType: 'Full-time',
    postedAt: '2026-08-21',
    description: 'Operate forklifts.',
  },
  {
    id: 'v3',
    partnerSlug: 'northline-logistics',
    title: 'HGV Driver',
    categorySlug: 'drivers',
    location: 'Rotterdam, Netherlands',
    employmentType: 'Full-time',
    postedAt: '2026-08-22',
    description: 'Long-haul driving.',
  },
]

vi.mock('../api/partners', () => ({
  getPartnerBySlug: vi.fn(() => Promise.resolve(partner)),
}))

vi.mock('../api/vacancies', () => ({
  getVacancies: vi.fn(() => Promise.resolve(vacancies)),
}))

function renderPage(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/partners/:slug" element={<PartnerPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PartnerPage', () => {
  it('applies the category filter from the URL on initial load', async () => {
    renderPage('/partners/northline-logistics?category=logistics')

    expect(await screen.findByText('Warehouse Operative')).toBeInTheDocument()
    expect(screen.getByText('Forklift Operator')).toBeInTheDocument()
    expect(screen.queryByText('HGV Driver')).not.toBeInTheDocument()
  })

  it('narrows the list further after typing a debounced search term, and restores on clear', async () => {
    const user = userEvent.setup()
    renderPage('/partners/northline-logistics?category=logistics')

    await screen.findByText('Warehouse Operative')

    const input = screen.getByRole('searchbox')
    await user.type(input, 'fork')

    await waitFor(() => expect(screen.queryByText('Warehouse Operative')).not.toBeInTheDocument(), {
      timeout: 1000,
    })
    expect(screen.getByText('Forklift Operator')).toBeInTheDocument()

    await user.clear(input)

    await waitFor(() => expect(screen.getByText('Warehouse Operative')).toBeInTheDocument(), { timeout: 1000 })
    expect(screen.getByText('Forklift Operator')).toBeInTheDocument()
    expect(screen.queryByText('HGV Driver')).not.toBeInTheDocument()
  })
})
