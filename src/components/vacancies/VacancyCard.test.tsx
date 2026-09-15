import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Vacancy } from '../../api/types'
import VacancyCard from './VacancyCard'

const vacancy: Vacancy = {
  id: 'v1',
  partnerSlug: 'northline-logistics',
  title: 'Warehouse Operative',
  categorySlug: 'logistics',
  location: 'Rotterdam, Netherlands',
  employmentType: 'Full-time',
  salary: '€2,200 / month',
  postedAt: '2026-08-20',
  description: 'Pick, pack, and load pallets.',
}

describe('VacancyCard', () => {
  it('renders the vacancy title, location, and category', () => {
    render(<VacancyCard vacancy={vacancy} />)

    expect(screen.getByText('Warehouse Operative')).toBeInTheDocument()
    expect(screen.getByText('Rotterdam, Netherlands')).toBeInTheDocument()
    expect(screen.getByText('logistics')).toBeInTheDocument()
  })
})
