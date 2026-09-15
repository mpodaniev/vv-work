import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockFetch } from './client'

describe('mockFetch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves with the loader result on success', async () => {
    const loader = vi.fn(() => ({ value: 42 }))
    // First random() call draws the delay, the second is the error roll — return
    // a fast delay draw, then a value above the default 0.2 error rate.
    const random = vi.fn().mockReturnValueOnce(0).mockReturnValueOnce(0.9)
    const promise = mockFetch(loader, { random })

    await vi.advanceTimersByTimeAsync(1000)

    await expect(promise).resolves.toEqual({ value: 42 })
    expect(loader).toHaveBeenCalledTimes(1)
  })

  it('rejects with an ApiError shape when the error roll fails', async () => {
    const loader = vi.fn(() => ({ value: 42 }))
    const random = vi.fn().mockReturnValueOnce(0).mockReturnValueOnce(0)
    const promise = mockFetch(loader, { random })
    const assertion = expect(promise).rejects.toMatchObject({ message: expect.any(String), status: 500 })

    await vi.advanceTimersByTimeAsync(1000)

    await assertion
    expect(loader).not.toHaveBeenCalled()
  })

  it('rejects immediately with AbortError when the signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    const loader = vi.fn(() => ({ value: 42 }))

    await expect(mockFetch(loader, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
    expect(loader).not.toHaveBeenCalled()
  })

  it('rejects with AbortError when the signal aborts before the delay elapses', async () => {
    const controller = new AbortController()
    const loader = vi.fn(() => ({ value: 42 }))
    const promise = mockFetch(loader, { signal: controller.signal, random: () => 0 })

    controller.abort()

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
    expect(loader).not.toHaveBeenCalled()
  })
})
