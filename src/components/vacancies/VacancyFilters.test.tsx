import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigationType, useSearchParams } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Category } from '../../api/types'
import VacancyFilters from './VacancyFilters'

const categories: Category[] = [
  { slug: 'logistics', label: 'Logistics' },
  { slug: 'it', label: 'IT' },
]

function ParamsProbe() {
  const [searchParams] = useSearchParams()
  return <div data-testid="params">{searchParams.toString()}</div>
}

function NavigationTypeProbe() {
  const navigationType = useNavigationType()
  return <div data-testid="nav-type">{navigationType}</div>
}

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/partners/test-partner']}>
      <VacancyFilters categories={categories} />
      <ParamsProbe />
      <NavigationTypeProbe />
    </MemoryRouter>,
  )
}

describe('VacancyFilters', () => {
  it('updates the q search param as the user types', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await user.type(screen.getByRole('searchbox'), 'welder')

    expect(screen.getByTestId('params')).toHaveTextContent('q=welder')
  })

  it('sets and clears the category param when a pill is toggled', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    const pill = screen.getByRole('button', { name: 'IT' })
    expect(pill).toHaveAttribute('aria-pressed', 'false')

    await user.click(pill)
    expect(pill).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('params')).toHaveTextContent('category=it')

    await user.click(pill)
    expect(pill).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('params')).not.toHaveTextContent('category=it')
  })

  it('replaces the history entry instead of pushing when a category pill is toggled', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    const pill = screen.getByRole('button', { name: 'IT' })

    await user.click(pill)
    expect(screen.getByTestId('nav-type')).toHaveTextContent('REPLACE')

    await user.click(pill)
    expect(screen.getByTestId('nav-type')).toHaveTextContent('REPLACE')
  })
})
