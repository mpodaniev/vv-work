import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Partner } from '../../api/types'
import CategoryGrid, { CategoryGridSkeleton } from './CategoryGrid'

const partners: Partner[] = [
  {
    id: 'p1',
    slug: 'northline-logistics',
    name: 'Northline Logistics',
    location: 'Rotterdam, Netherlands',
    industry: 'Logistics & Freight',
    primaryCategorySlug: 'logistics',
    description: 'Cross-border freight and warehousing operations.',
  },
  {
    id: 'p2',
    slug: 'bright-build',
    name: 'Bright Build',
    location: 'Warsaw, Poland',
    industry: 'Construction',
    primaryCategorySlug: 'construction',
    description: 'Residential and commercial construction.',
  },
]

describe('CategoryGrid', () => {
  it('links a category with a matching partner to that partner filtered by category', () => {
    render(
      <MemoryRouter>
        <CategoryGrid partners={partners} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Logistics' })).toHaveAttribute(
      'href',
      '/partners/northline-logistics?category=logistics',
    )
    expect(screen.getByRole('link', { name: 'Construction' })).toHaveAttribute(
      'href',
      '/partners/bright-build?category=construction',
    )
  })

  it('renders a category with no matching partner as non-clickable', () => {
    render(
      <MemoryRouter>
        <CategoryGrid partners={partners} />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: 'Other' })).not.toBeInTheDocument()
    expect(screen.getByText('Other')).toHaveAttribute('aria-disabled', 'true')
  })

  it('renders all seven category labels', () => {
    render(
      <MemoryRouter>
        <CategoryGrid partners={partners} />
      </MemoryRouter>,
    )

    for (const label of ['Construction', 'Manufacturing', 'Logistics', 'Hospitality', 'IT', 'Drivers', 'Other']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('lets the last partner win when multiple partners share a primaryCategorySlug', () => {
    const duplicatePartners: Partner[] = [
      ...partners,
      {
        id: 'p3',
        slug: 'other-logistics-co',
        name: 'Other Logistics Co',
        location: 'Berlin, Germany',
        industry: 'Logistics & Freight',
        primaryCategorySlug: 'logistics',
        description: 'Another logistics provider.',
      },
    ]

    render(
      <MemoryRouter>
        <CategoryGrid partners={duplicatePartners} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Logistics' })).toHaveAttribute(
      'href',
      '/partners/other-logistics-co?category=logistics',
    )
  })
})

describe('CategoryGridSkeleton', () => {
  it('renders one skeleton placeholder per category', () => {
    render(<CategoryGridSkeleton />)

    expect(screen.getAllByRole('status')).toHaveLength(7)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
