import type { Vacancy } from '../../api/types'
import EmptyState from '../ui/EmptyState'
import VacancyCard from './VacancyCard'

interface VacancyListProps {
  vacancies: Vacancy[]
}

export const VACANCY_GRID_CLASSNAME = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

export default function VacancyList({ vacancies }: VacancyListProps) {
  if (vacancies.length === 0) {
    return <EmptyState title="No vacancies match your filters" description="Try a different search term or category." />
  }

  return (
    <div className={VACANCY_GRID_CLASSNAME}>
      {vacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} vacancy={vacancy} />
      ))}
    </div>
  )
}
