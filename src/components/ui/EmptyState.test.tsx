import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(<EmptyState title="No results" description="Try a different filter." />)
    expect(screen.getByText('No results')).toBeInTheDocument()
    expect(screen.getByText('Try a different filter.')).toBeInTheDocument()
  })
})
