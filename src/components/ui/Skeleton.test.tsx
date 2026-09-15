import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Skeleton from './Skeleton'

describe('Skeleton', () => {
  it('renders a status placeholder', () => {
    render(<Skeleton className="h-24 w-full" />)
    expect(screen.getByRole('status')).toHaveClass('h-24', 'w-full')
  })
})
