import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Container from './Container'

describe('Container', () => {
  it('renders its children', () => {
    render(
      <Container>
        <p>Hello world</p>
      </Container>,
    )

    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('applies the base layout classes', () => {
    render(<Container>content</Container>)

    expect(screen.getByText('content')).toHaveClass('mx-auto', 'w-full', 'max-w-6xl')
  })

  it('merges a custom className with the base classes', () => {
    render(<Container className="custom-class">content</Container>)

    const element = screen.getByText('content')
    expect(element).toHaveClass('custom-class')
    expect(element).toHaveClass('mx-auto')
  })
})
