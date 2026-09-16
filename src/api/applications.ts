import { mockFetch, type MockFetchOptions } from './client'
import type { ApplicationPayload } from './types'

// No persistence layer exists yet, so the loader is a no-op; `payload` stays a
// parameter so call sites read naturally and a real backend can slot in later.
export function submitApplication(payload: ApplicationPayload, opts?: MockFetchOptions): Promise<void> {
  return mockFetch(() => {
    void payload
  }, opts)
}
