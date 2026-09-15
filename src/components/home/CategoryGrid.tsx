import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Category, Partner } from '../../api/types'
import categoriesJson from '../../data/categories.json'
import Skeleton from '../ui/Skeleton'

const categories = categoriesJson as Category[]

interface CategoryGridProps {
  partners: Partner[]
}

const CATEGORY_GRID_CLASSNAME = 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'

export function CategoryGridSkeleton() {
  return (
    <div className={CATEGORY_GRID_CLASSNAME}>
      {categories.map((category) => (
        <Skeleton key={category.slug} className="h-20 w-full" />
      ))}
    </div>
  )
}

export default function CategoryGrid({ partners }: CategoryGridProps) {
  const partnersByCategory = useMemo(
    () => new Map(partners.map((partner) => [partner.primaryCategorySlug, partner])),
    [partners],
  )

  return (
    <div className={CATEGORY_GRID_CLASSNAME}>
      {categories.map((category) => {
        const partner = partnersByCategory.get(category.slug)

        if (!partner) {
          return (
            <div
              key={category.slug}
              aria-disabled="true"
              className="flex items-center justify-center rounded-md border border-border p-4 text-center text-sm font-medium text-muted opacity-50"
            >
              {category.label}
            </div>
          )
        }

        return (
          <Link
            key={category.slug}
            to={`/partners/${partner.slug}?category=${category.slug}`}
            className="flex items-center justify-center rounded-md border border-border p-4 text-center text-sm font-medium text-fg transition-colors hover:bg-border/30"
          >
            {category.label}
          </Link>
        )
      })}
    </div>
  )
}
