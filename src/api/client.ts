import type { ApiError } from './types'

export interface MockFetchOptions {
  signal?: AbortSignal
  minDelayMs?: number
  maxDelayMs?: number
  errorRate?: number
  random?: () => number
}

/**
 * Simulates a network round-trip against local JSON "data". Draws `random()` twice —
 * once for the delay, once for the error roll — so a test stubbing a single fixed
 * value affects both draws identically; pass a stateful/counter stub when the two
 * draws need to differ.
 */
export async function mockFetch<T>(loader: () => T, opts: MockFetchOptions = {}): Promise<T> {
  const { signal, minDelayMs = 300, maxDelayMs = 800, errorRate = 0.2, random = Math.random } = opts

  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

  const delay = minDelayMs + random() * (maxDelayMs - minDelayMs)

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, delay)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })

  if (random() < errorRate) {
    throw { message: 'Something went wrong. Please try again.', status: 500 } satisfies ApiError
  }

  return loader()
}
