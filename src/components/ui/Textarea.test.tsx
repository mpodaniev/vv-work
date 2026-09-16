import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Textarea from './Textarea'

describe('Textarea', () => {
  it('associates the label with the textarea via htmlFor/id', () => {
    render(<Textarea label="Message" />)

    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })

  it('renders an error message, marks the field invalid, and suppresses the hint', () => {
    render(<Textarea label="Message" error="Message must be 500 characters or fewer." hint="Optional details" />)

    const textarea = screen.getByLabelText('Message')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    const error = screen.getByText('Message must be 500 characters or fewer.')
    expect(textarea).toHaveAttribute('aria-describedby', error.id)
    expect(screen.queryByText('Optional details')).not.toBeInTheDocument()
  })

  it('renders a hint and points aria-describedby at it when there is no error', () => {
    render(<Textarea label="Message" hint="Optional details" />)

    const textarea = screen.getByLabelText('Message')
    expect(textarea).toHaveAttribute('aria-invalid', 'false')
    const hint = screen.getByText('Optional details')
    expect(textarea).toHaveAttribute('aria-describedby', hint.id)
  })

  it('omits aria-describedby when there is neither an error nor a hint', () => {
    render(<Textarea label="Message" />)

    expect(screen.getByLabelText('Message')).not.toHaveAttribute('aria-describedby')
  })
})
