import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import EmployerCta from './EmployerCta'

describe('EmployerCta', () => {
  it('renders the heading, benefits, and a CTA linking to contacts', () => {
    render(
      <MemoryRouter>
        <EmployerCta />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Need workers?' })).toBeInTheDocument()
    expect(screen.getByText('Access pre-screened candidates')).toBeInTheDocument()
    expect(screen.getByText('Post vacancies in minutes')).toBeInTheDocument()
    expect(screen.getByText('Dedicated partner support')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contacts')
  })
})
