import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Partner } from '../api/types'
import { getPartners } from '../api/partners'
import HomePage from './HomePage'

const partners: Partner[] = [
  {
    id: 'p1',
    slug: 'northline-logistics',
    name: 'Northline Logistics',
    location: 'Rotterdam, Netherlands',
    industry: 'Logistics & Freight',
    primaryCategorySlug: 'logistics',
    description: 'Cross-border freight and warehousing operations.',
    vacancyCount: 7,
  },
  {
    id: 'p2',
    slug: 'bright-build',
    name: 'Bright Build',
    location: 'Warsaw, Poland',
    industry: 'Construction',
    primaryCategorySlug: 'construction',
    description: 'Residential and commercial construction.',
    vacancyCount: 6,
  },
]

vi.mock('../api/partners', () => ({
  getPartners: vi.fn(),
}))

const mockedGetPartners = vi.mocked(getPartners)

function renderPage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  it('renders skeleton placeholders while partners are loading', () => {
    mockedGetPartners.mockReturnValueOnce(new Promise(() => {}))
    renderPage()

    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
    expect(screen.queryByRole('link', { name: 'Logistics' })).not.toBeInTheDocument()
    expect(screen.queryByText('Northline Logistics')).not.toBeInTheDocument()
  })

  it('renders category links and partner cards once loaded', async () => {
    mockedGetPartners.mockResolvedValueOnce(partners)
    renderPage()

    expect(await screen.findByRole('link', { name: 'Logistics' })).toHaveAttribute(
      'href',
      '/partners/northline-logistics?category=logistics',
    )
    expect(screen.getByRole('link', { name: 'Construction' })).toHaveAttribute(
      'href',
      '/partners/bright-build?category=construction',
    )
    expect(screen.getByText('Northline Logistics')).toBeInTheDocument()
    expect(screen.getByText('Bright Build')).toBeInTheDocument()
  })

  it('renders the "other" category as non-clickable', async () => {
    mockedGetPartners.mockResolvedValueOnce(partners)
    renderPage()

    await screen.findByRole('link', { name: 'Logistics' })

    expect(screen.queryByRole('link', { name: 'Other' })).not.toBeInTheDocument()
    expect(screen.getByText('Other')).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows an error state with a retry that recovers both sections', async () => {
    mockedGetPartners.mockRejectedValueOnce({ message: 'Network error', status: 500 })
    mockedGetPartners.mockResolvedValueOnce(partners)
    const user = userEvent.setup()
    renderPage()

    const alerts = await screen.findAllByRole('alert')
    expect(alerts).toHaveLength(2)

    const [retryButton] = screen.getAllByRole('button', { name: 'Try again' })
    if (!retryButton) throw new Error('expected a "Try again" button')
    await user.click(retryButton)

    await waitFor(() => expect(screen.getByRole('link', { name: 'Logistics' })).toBeInTheDocument())
    expect(screen.getByText('Northline Logistics')).toBeInTheDocument()
  })
})
