import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import PageLayout from './PageLayout'

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
  document.documentElement.style.overflow = ''
})

afterEach(() => {
  vi.restoreAllMocks()
  document.documentElement.style.overflow = ''
})

function renderPageLayout() {
  const router = createMemoryRouter([{ path: '/', element: <PageLayout />, children: [{ index: true, element: <div>Home content</div> }] }])
  render(<RouterProvider router={router} />)
}

describe('PageLayout', () => {
  it('does not inert main/footer and keeps scroll unlocked when the menu is closed', () => {
    renderPageLayout()

    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    expect(main?.inert).toBe(false)
    expect(footer?.inert).toBe(false)
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('inerts main/footer and locks body scroll when the menu is opened', async () => {
    const user = userEvent.setup()
    renderPageLayout()

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }))

    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    expect(main?.inert).toBe(true)
    expect(footer?.inert).toBe(true)
    expect(document.documentElement.style.overflow).toBe('hidden')
  })

  it('reverts inert and scroll lock when the menu is closed again', async () => {
    const user = userEvent.setup()
    renderPageLayout()

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }))
    await user.click(screen.getByRole('button', { name: 'Close navigation menu' }))

    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    expect(main?.inert).toBe(false)
    expect(footer?.inert).toBe(false)
    expect(document.documentElement.style.overflow).toBe('')
  })
})
