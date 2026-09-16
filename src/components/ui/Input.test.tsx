import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Input from './Input'

describe('Input', () => {
  it('associates the label with the input via htmlFor/id', () => {
    render(<Input label="Name" />)

    const input = screen.getByLabelText('Name')
    expect(input).toBeInTheDocument()
  })

  it('renders an error message, marks the field invalid, and suppresses the hint', () => {
    render(<Input label="Phone" error="Enter a valid phone number." hint="A helpful hint" />)

    const input = screen.getByLabelText('Phone')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Enter a valid phone number.')).toBeInTheDocument()
    expect(screen.queryByText('A helpful hint')).not.toBeInTheDocument()

    const errorId = screen.getByText('Enter a valid phone number.').id
    expect(input).toHaveAttribute('aria-describedby', errorId)
  })

  it('renders a hint and points aria-describedby at it when there is no error', () => {
    render(<Input label="Telegram" hint="A helpful hint" />)

    const input = screen.getByLabelText('Telegram')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    const hint = screen.getByText('A helpful hint')
    expect(input).toHaveAttribute('aria-describedby', hint.id)
  })

  it('omits aria-describedby when there is neither an error nor a hint', () => {
    render(<Input label="Message" />)

    expect(screen.getByLabelText('Message')).not.toHaveAttribute('aria-describedby')
  })

  it('renders a decorative prefix without affecting the accessible name or value', () => {
    render(<Input label="Phone" prefix="+" value="380" onChange={() => {}} />)

    const prefix = screen.getByText('+')
    expect(prefix).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByLabelText('Phone')).toHaveValue('380')
  })
})
