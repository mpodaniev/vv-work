import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { RouterProvider } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { router } from './router'

beforeAll(() => {
  // jsdom doesn't implement ResizeObserver, which Header (rendered via PageLayout) relies on.
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

describe('router', () => {
  it('nests all pages under a PageLayout route at "/"', () => {
    expect(router.routes).toHaveLength(1)

    const rootRoute = router.routes[0]
    expect(rootRoute?.path).toBe('/')

    const children = rootRoute?.children ?? []
    expect(children).toHaveLength(4)
    expect(children.some((route) => route.index)).toBe(true)
    expect(children.some((route) => route.path === 'partners/:slug')).toBe(true)
    expect(children.some((route) => route.path === 'contacts')).toBe(true)
    expect(children.some((route) => route.path === '*')).toBe(true)
  })

  it('renders HomePage at the index route', async () => {
    await act(async () => {
      await router.navigate('/')
    })
    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: 'Home page' })).toBeInTheDocument()
  })

  it('renders ContactsPage at /contacts', async () => {
    await act(async () => {
      await router.navigate('/contacts')
    })
    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: 'Contacts page' })).toBeInTheDocument()
  })

  it('renders PartnerPage at /partners/:slug', async () => {
    await act(async () => {
      await router.navigate('/partners/acme')
    })
    render(<RouterProvider router={router} />)

    expect(await screen.findAllByRole('status')).not.toHaveLength(0)
  })

  it('renders NotFoundPage for unmatched paths', async () => {
    await act(async () => {
      await router.navigate('/does-not-exist')
    })
    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: '404 — page not found' })).toBeInTheDocument()
  })
})
