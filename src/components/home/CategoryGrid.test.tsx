import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Partner } from '../../api/types'
import CategoryGrid, { CategoryGridSkeleton } from './CategoryGrid'

const northlineLogistics: Partner = {
  id: 'p1',
  slug: 'northline-logistics',
  name: 'Northline Logistics',
  location: 'Rotterdam, Netherlands',
  industry: 'Logistics & Freight',
  description: 'Cross-border freight and warehousing operations.',
}

const brightBuild: Partner = {
  id: 'p2',
  slug: 'bright-build',
  name: 'Bright Build',
  location: 'Warsaw, Poland',
  industry: 'Construction',
  description: 'Residential and commercial construction.',
}

const roadRunners: Partner = {
  id: 'p6',
  slug: 'road-runners',
  name: 'Road Runners',
  location: 'Berlin, Germany',
  industry: 'Transportation',
  description: 'Long-haul and last-mile delivery services.',
}

describe('CategoryGrid', () => {
  it('links a category with a matching partner to that partner filtered by category', () => {
    const partnersByCategory = new Map([
      ['logistics', [northlineLogistics]],
      ['construction', [brightBuild]],
    ])

    render(
      <MemoryRouter>
        <CategoryGrid partnersByCategory={partnersByCategory} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Northline Logistics' })).toHaveAttribute(
      'href',
      '/partners/northline-logistics?category=logistics',
    )
    expect(screen.getByRole('link', { name: 'Bright Build' })).toHaveAttribute(
      'href',
      '/partners/bright-build?category=construction',
    )
  })

  it('renders a category with no matching partner as non-clickable', () => {
    const partnersByCategory = new Map([['logistics', [northlineLogistics]]])

    render(
      <MemoryRouter>
        <CategoryGrid partnersByCategory={partnersByCategory} />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: 'Other' })).not.toBeInTheDocument()
    expect(screen.getByText('Other')).toHaveAttribute('aria-disabled', 'true')
  })

  it('renders all seven category labels', () => {
    const partnersByCategory = new Map([['logistics', [northlineLogistics]]])

    render(
      <MemoryRouter>
        <CategoryGrid partnersByCategory={partnersByCategory} />
      </MemoryRouter>,
    )

    for (const label of ['Construction', 'Manufacturing', 'Logistics', 'Hospitality', 'IT', 'Drivers', 'Other']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('lists every partner that has a vacancy in a shared category', () => {
    const partnersByCategory = new Map([['logistics', [northlineLogistics, roadRunners]]])

    render(
      <MemoryRouter>
        <CategoryGrid partnersByCategory={partnersByCategory} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Northline Logistics' })).toHaveAttribute(
      'href',
      '/partners/northline-logistics?category=logistics',
    )
    expect(screen.getByRole('link', { name: 'Road Runners' })).toHaveAttribute(
      'href',
      '/partners/road-runners?category=logistics',
    )
  })

  it('lists a partner under every category it has a vacancy in', () => {
    const partnersByCategory = new Map([
      ['logistics', [roadRunners]],
      ['drivers', [roadRunners]],
    ])

    render(
      <MemoryRouter>
        <CategoryGrid partnersByCategory={partnersByCategory} />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('link', { name: 'Road Runners' })).toHaveLength(2)
  })
})

describe('CategoryGridSkeleton', () => {
  it('renders one skeleton placeholder per category', () => {
    render(<CategoryGridSkeleton />)

    expect(screen.getAllByRole('status')).toHaveLength(7)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
