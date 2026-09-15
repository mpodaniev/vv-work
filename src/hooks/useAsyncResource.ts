import { useCallback, useEffect, useState, type DependencyList } from 'react'
import { isApiError, type ApiError } from '../api/types'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncResourceState<T> {
  status: AsyncStatus
  data: T | null
  error: ApiError | null
  retry: () => void
}

/**
 * `deps` mirrors useEffect's own dependency list — the hook does NOT infer
 * dependencies from `loader`'s identity, since callers typically pass a fresh
 * inline closure each render. Put every value `loader` closes over into `deps`.
 */
export function useAsyncResource<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
): AsyncResourceState<T> {
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off the fetch requires resetting status synchronously
    setStatus('loading')
    setError(null)

    loader(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setData(result)
        setStatus('success')
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(isApiError(err) ? err : { message: 'Unexpected error', status: 500 })
        setStatus('error')
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps is caller-supplied and intentionally spread
  }, [...deps, retryToken])

  const retry = useCallback(() => setRetryToken((t) => t + 1), [])

  return { status, data, error, retry }
}
