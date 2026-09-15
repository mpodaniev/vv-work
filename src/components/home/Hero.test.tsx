import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the heading and a CTA linking to the partners section', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse partners' })).toHaveAttribute('href', '#partners-section')
  })
})
