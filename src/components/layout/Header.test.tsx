import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import Header from './Header'

beforeAll(() => {
  // jsdom doesn't implement ResizeObserver.
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )

  // jsdom doesn't implement <dialog> show()/close().
  HTMLDialogElement.prototype.show = vi.fn(function show(this: HTMLDialogElement) {
    this.open = true
  })
  HTMLDialogElement.prototype.close = vi.fn(function close(this: HTMLDialogElement) {
    this.open = false
  })
})

beforeEach(() => {
  vi.mocked(HTMLDialogElement.prototype.show).mockClear()
  vi.mocked(HTMLDialogElement.prototype.close).mockClear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderHeader(isMenuOpen: boolean, onMenuOpenChange = vi.fn()) {
  render(
    <MemoryRouter>
      <Header isMenuOpen={isMenuOpen} onMenuOpenChange={onMenuOpenChange} />
    </MemoryRouter>,
  )
  return { onMenuOpenChange }
}

describe('Header', () => {
  it('shows the closed state with the expected aria attributes', () => {
    renderHeader(false)

    const toggle = screen.getByRole('button', { name: 'Open navigation menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows the open state with the expected aria attributes', () => {
    renderHeader(true)

    const toggle = screen.getByRole('button', { name: 'Close navigation menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('calls onMenuOpenChange with the toggled value when the button is clicked', async () => {
    const user = userEvent.setup()
    const { onMenuOpenChange } = renderHeader(false)

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }))

    expect(onMenuOpenChange).toHaveBeenCalledWith(true)
  })

  it('opens the dialog via show() when isMenuOpen is true', () => {
    renderHeader(true)

    expect(HTMLDialogElement.prototype.show).toHaveBeenCalled()
    expect(HTMLDialogElement.prototype.close).not.toHaveBeenCalled()
  })

  it('closes the dialog via close() when isMenuOpen is false', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Header isMenuOpen={true} onMenuOpenChange={vi.fn()} />
      </MemoryRouter>,
    )
    expect(HTMLDialogElement.prototype.show).toHaveBeenCalled()

    rerender(
      <MemoryRouter>
        <Header isMenuOpen={false} onMenuOpenChange={vi.fn()} />
      </MemoryRouter>,
    )

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
  })

  it('calls onMenuOpenChange(false) when Escape is pressed while the menu is open', async () => {
    const user = userEvent.setup()
    const { onMenuOpenChange } = renderHeader(true)

    await user.keyboard('{Escape}')

    expect(onMenuOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not react to Escape when the menu is closed', async () => {
    const user = userEvent.setup()
    const { onMenuOpenChange } = renderHeader(false)

    await user.keyboard('{Escape}')

    expect(onMenuOpenChange).not.toHaveBeenCalled()
  })

  it('calls onMenuOpenChange(false) when a mobile nav link is clicked', async () => {
    const user = userEvent.setup()
    const { onMenuOpenChange } = renderHeader(true)

    const mobileNavLinks = screen.getAllByRole('link', { name: 'Contacts' })
    // The last "Contacts" link is the one rendered inside the mobile dialog nav.
    const mobileNavLink = mobileNavLinks.at(-1)
    if (!mobileNavLink) throw new Error('Expected a mobile "Contacts" nav link')
    await user.click(mobileNavLink)

    expect(onMenuOpenChange).toHaveBeenCalledWith(false)
  })
})
