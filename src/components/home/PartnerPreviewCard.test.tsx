import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Partner } from '../../api/types'
import PartnerPreviewCard from './PartnerPreviewCard'

const partner: Partner = {
  id: 'p1',
  slug: 'northline-logistics',
  name: 'Northline Logistics',
  location: 'Rotterdam, Netherlands',
  industry: 'Logistics & Freight',
  description: 'Cross-border freight and warehousing operations.',
  vacancyCount: 7,
}

describe('PartnerPreviewCard', () => {
  it('renders partner name, location, industry, and description', () => {
    render(
      <MemoryRouter>
        <PartnerPreviewCard partner={partner} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Northline Logistics')).toBeInTheDocument()
    expect(screen.getByText('Rotterdam, Netherlands · Logistics & Freight')).toBeInTheDocument()
    expect(screen.getByText('Cross-border freight and warehousing operations.')).toBeInTheDocument()
  })

  it('renders the vacancy count badge when vacancyCount is defined', () => {
    render(
      <MemoryRouter>
        <PartnerPreviewCard partner={partner} />
      </MemoryRouter>,
    )

    expect(screen.getByText('7 jobs')).toBeInTheDocument()
  })

  it('omits the vacancy count badge when vacancyCount is undefined', () => {
    render(
      <MemoryRouter>
        <PartnerPreviewCard partner={{ ...partner, vacancyCount: undefined }} />
      </MemoryRouter>,
    )

    expect(screen.queryByText(/^\d+ jobs$/)).not.toBeInTheDocument()
  })

  it('links to the partner page', () => {
    render(
      <MemoryRouter>
        <PartnerPreviewCard partner={partner} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'View jobs' })).toHaveAttribute(
      'href',
      '/partners/northline-logistics',
    )
  })
})