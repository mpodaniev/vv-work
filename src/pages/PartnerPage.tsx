import { useCallback, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getPartnerBySlug } from '../api/partners'
import type { Category } from '../api/types'
import { getVacancies } from '../api/vacancies'
import { CardGridSkeleton } from '../components/ui/CardGrid'
import Container from '../components/ui/Container'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import VacancyFilters from '../components/vacancies/VacancyFilters'
import VacancyList from '../components/vacancies/VacancyList'
import categoriesJson from '../data/categories.json'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

const categories = categoriesJson as Category[]

export default function PartnerPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()

  const partnerResource = useAsyncResource(
    useCallback((signal) => getPartnerBySlug(slug, { signal }), [slug]),
    [slug],
  )

  const vacanciesResource = useAsyncResource(
    useCallback((signal) => getVacancies(slug, { signal }), [slug]),
    [slug],
  )

  // `q` is written to the URL synchronously on every keystroke (see VacancyFilters), so this
  // component re-renders per keystroke too — but that's cheap. VacancyList/VacancyCard don't,
  // because filteredVacancies is memoized against the *debounced* query, so VacancyList keeps
  // receiving the same array reference until the debounce window settles.
  const debouncedQuery = useDebouncedValue(searchParams.get('q') ?? '', 300)
  const category = searchParams.get('category') ?? ''

  const filteredVacancies = useMemo(() => {
    const list = vacanciesResource.data ?? []
    const normalizedQuery = debouncedQuery.trim().toLowerCase()
    return list.filter((v) => {
      const matchesQuery = v.title.toLowerCase().includes(normalizedQuery)
      const matchesCategory = !category || v.categorySlug === category
      return matchesQuery && matchesCategory
    })
  }, [vacanciesResource.data, debouncedQuery, category])

  // Only offer categories the partner actually has vacancies in — a filter pill that always
  // yields "No vacancies match your filters" isn't a useful choice to present.
  const availableCategories = useMemo(() => {
    const vacancySlugs = new Set((vacanciesResource.data ?? []).map((v) => v.categorySlug))
    return categories.filter((c) => vacancySlugs.has(c.slug))
  }, [vacanciesResource.data])

  return (
    <Container className="flex flex-col gap-8 py-section">
      {partnerResource.status === 'error' && partnerResource.error && (
        <ErrorState message={partnerResource.error.message} onRetry={partnerResource.retry} />
      )}

      {(partnerResource.status === 'idle' || partnerResource.status === 'loading') && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
      )}

      {partnerResource.status === 'success' && partnerResource.data && (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-fg">{partnerResource.data.name}</h1>
            <p className="text-muted">
              {partnerResource.data.location} · {partnerResource.data.industry}
            </p>
            <p className="text-fg">{partnerResource.data.description}</p>
          </div>

          <div className="flex flex-col gap-6">
            <VacancyFilters categories={availableCategories} />

            {(vacanciesResource.status === 'idle' || vacanciesResource.status === 'loading') && (
              <CardGridSkeleton count={6} itemClassName="h-24 w-full" />
            )}

            {vacanciesResource.status === 'error' && vacanciesResource.error && (
              <ErrorState message={vacanciesResource.error.message} onRetry={vacanciesResource.retry} />
            )}

            {vacanciesResource.status === 'success' && <VacancyList vacancies={filteredVacancies} />}
          </div>
        </>
      )}
    </Container>
  )
}
