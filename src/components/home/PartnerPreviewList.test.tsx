import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Partner } from '../../api/types'
import PartnerPreviewList, { PartnerPreviewListSkeleton } from './PartnerPreviewList'

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
]

describe('PartnerPreviewList', () => {
  it('renders a card per partner', () => {
    render(
      <MemoryRouter>
        <PartnerPreviewList partners={partners} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Northline Logistics')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View jobs' })).toHaveAttribute('href', '/partners/northline-logistics')
  })

  it('renders an empty state when there are no partners', () => {
    render(
      <MemoryRouter>
        <PartnerPreviewList partners={[]} />
      </MemoryRouter>,
    )

    expect(screen.getByText('No partners available')).toBeInTheDocument()
  })
})

describe('PartnerPreviewListSkeleton', () => {
  it('renders six skeleton placeholders and no partner content', () => {
    render(
      <MemoryRouter>
        <PartnerPreviewListSkeleton />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('status')).toHaveLength(6)
    expect(screen.queryByText('No partners available')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
