import { memo } from 'react'
import type { Vacancy } from '../../api/types'
import { formatDate } from '../../lib/format'

interface VacancyCardProps {
  vacancy: Vacancy
}

const VacancyCard = memo(function VacancyCard({ vacancy }: VacancyCardProps) {
  return (
    <article className="flex flex-col gap-2 rounded-md border border-border p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-medium text-fg">{vacancy.title}</h3>
        <span className="rounded-full bg-border/50 px-3 py-1 text-sm text-fg">{vacancy.categorySlug}</span>
      </div>
      <p className="text-sm text-muted">{vacancy.location}</p>
      <p className="text-sm text-muted">{vacancy.employmentType}</p>
      {vacancy.salary && <p className="text-sm font-medium text-fg">{vacancy.salary}</p>}
      <p className="text-sm text-muted">Posted {formatDate(vacancy.postedAt)}</p>
      <p className="text-sm text-fg">{vacancy.description}</p>
    </article>
  )
})

export default VacancyCard
