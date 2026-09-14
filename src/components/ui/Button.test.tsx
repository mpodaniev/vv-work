import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('applies the primary variant classes by default', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button', { name: 'Click me' })).toHaveClass('bg-accent', 'text-white')
  })

  it('applies the secondary variant classes when requested', () => {
    render(<Button variant="secondary">Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toHaveClass('bg-transparent', 'border', 'border-border')
    expect(button).not.toHaveClass('bg-accent')
  })

  it('merges a custom className with the variant classes', () => {
    render(<Button className="custom-class">Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('bg-accent')
  })

  it('passes through native button props', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button type="submit" onClick={onClick} disabled>
        Submit
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Submit' })
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toBeDisabled()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
