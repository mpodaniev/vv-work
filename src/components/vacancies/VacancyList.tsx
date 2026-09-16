import { memo } from 'react'
import type { Vacancy } from '../../api/types'
import CardGrid from '../ui/CardGrid'
import VacancyCard from './VacancyCard'

interface VacancyListProps {
  vacancies: Vacancy[]
}

const VacancyList = memo(function VacancyList({ vacancies }: VacancyListProps) {
  return (
    <CardGrid
      items={vacancies}
      keyExtractor={(vacancy) => vacancy.id}
      renderItem={(vacancy) => <VacancyCard vacancy={vacancy} />}
      emptyTitle="No vacancies match your filters"
      emptyDescription="Try a different search term or category."
    />
  )
})

export default VacancyList
