import { Link } from 'react-router-dom'
import type { Category, Partner } from '../../api/types'
import categoriesJson from '../../data/categories.json'
import Skeleton from '../ui/Skeleton'

const categories = categoriesJson as Category[]

interface CategoryGridProps {
  partnersByCategory: Map<string, Partner[]>
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

export default function CategoryGrid({ partnersByCategory }: CategoryGridProps) {
  return (
    <div className={CATEGORY_GRID_CLASSNAME}>
      {categories.map((category) => {
        const categoryPartners = partnersByCategory.get(category.slug)

        if (!categoryPartners || categoryPartners.length === 0) {
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
          <div key={category.slug} className="flex flex-col gap-2 rounded-md border border-border p-4">
            <span className="text-center text-sm font-medium text-fg">{category.label}</span>
            <ul className="flex flex-col gap-1">
              {categoryPartners.map((partner) => (
                <li key={partner.slug}>
                  <Link
                    to={`/partners/${partner.slug}?category=${category.slug}`}
                    className="block text-center text-sm text-muted transition-colors hover:text-fg hover:underline"
                  >
                    {partner.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
