import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NotFoundPage from './NotFoundPage'

describe('NotFoundPage', () => {
  it('renders a 404 heading for an unmatched path', () => {
    const router = createMemoryRouter([{ path: '*', element: <NotFoundPage /> }], {
      initialEntries: ['/does-not-exist'],
    })

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: '404 — page not found' })).toBeInTheDocument()
  })
})
