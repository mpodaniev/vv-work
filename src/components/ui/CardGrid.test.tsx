import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CardGrid, { CardGridSkeleton } from './CardGrid'

interface Item {
  id: string
  name: string
}

const items: Item[] = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Beta' },
]

describe('CardGrid', () => {
  it('renders one item per entry, keyed by keyExtractor', () => {
    render(
      <CardGrid
        items={items}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <span>{item.name}</span>}
        emptyTitle="No items"
      />,
    )

    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('renders the empty state when there are no items', () => {
    render(
      <CardGrid
        items={[]}
        keyExtractor={(item: Item) => item.id}
        renderItem={(item) => <span>{item.name}</span>}
        emptyTitle="No items"
        emptyDescription="Check back later."
      />,
    )

    expect(screen.getByText('No items')).toBeInTheDocument()
    expect(screen.getByText('Check back later.')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })
})

describe('CardGridSkeleton', () => {
  it('renders the given number of skeleton placeholders', () => {
    render(<CardGridSkeleton count={4} />)
    expect(screen.getAllByRole('status')).toHaveLength(4)
  })
})
