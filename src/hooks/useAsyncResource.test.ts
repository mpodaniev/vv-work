import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ApiError } from '../api/types'
import { useAsyncResource } from './useAsyncResource'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('useAsyncResource', () => {
  it('transitions loading -> success with data', async () => {
    const { promise, resolve } = deferred<{ id: string }>()
    const { result } = renderHook(() => useAsyncResource(() => promise, []))

    expect(result.current.status).toBe('loading')

    resolve({ id: '1' })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toEqual({ id: '1' })
    expect(result.current.error).toBeNull()
  })

  it('transitions loading -> error with the ApiError payload', async () => {
    const { promise, reject } = deferred<{ id: string }>()
    const { result } = renderHook(() => useAsyncResource(() => promise, []))

    const apiError: ApiError = { message: 'boom', status: 500 }
    reject(apiError)

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toEqual(apiError)
    expect(result.current.data).toBeNull()
  })

  it('retry() re-invokes the loader and can recover to success', async () => {
    const first = deferred<{ id: string }>()
    const second = deferred<{ id: string }>()
    let callCount = 0
    const loader = () => (callCount++ === 0 ? first.promise : second.promise)
    const { result } = renderHook(() => useAsyncResource(loader, []))

    first.reject({ message: 'boom', status: 500 } satisfies ApiError)
    await waitFor(() => expect(result.current.status).toBe('error'))

    result.current.retry()
    await waitFor(() => expect(result.current.status).toBe('loading'))

    second.resolve({ id: '2' })
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toEqual({ id: '2' })
    expect(result.current.error).toBeNull()
  })

  it('does not apply a late update after unmount', async () => {
    const { promise, resolve } = deferred<{ id: string }>()
    const { result, unmount } = renderHook(() => useAsyncResource(() => promise, []))

    unmount()
    resolve({ id: '1' })
    await promise

    expect(result.current.data).toBeNull()
  })
})
