import { render } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('attaches the passed ref to the footer DOM element', () => {
    const ref = createRef<HTMLElement>()
    render(<Footer ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('FOOTER')
  })
})
