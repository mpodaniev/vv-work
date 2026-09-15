import { useSearchParams } from 'react-router-dom'
import type { Category } from '../../api/types'
import VacancySearchInput from './VacancySearchInput'

interface VacancyFiltersProps {
  categories: Category[]
}

export default function VacancyFilters({ categories }: VacancyFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') ?? ''

  const handleQueryChange = (next: string) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        if (next) {
          params.set('q', next)
        } else {
          params.delete('q')
        }
        return params
      },
      { replace: true },
    )
  }

  const handleCategoryToggle = (slug: string) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        if (activeCategory === slug) {
          params.delete('category')
        } else {
          params.set('category', slug)
        }
        return params
      },
      { replace: true },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <VacancySearchInput value={searchParams.get('q') ?? ''} onChange={handleQueryChange} />
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.slug
          return (
            <button
              key={category.slug}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleCategoryToggle(category.slug)}
              className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-transparent text-fg hover:bg-border/30'
              }`}
            >
              {category.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
