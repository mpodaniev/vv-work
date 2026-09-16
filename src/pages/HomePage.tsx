import type { ReactNode } from 'react'
import { getPartners } from '../api/partners'
import type { Partner } from '../api/types'
import { getVacancies } from '../api/vacancies'
import CategoryGrid, { CategoryGridSkeleton } from '../components/home/CategoryGrid'
import EmployerCta from '../components/home/EmployerCta'
import Hero from '../components/home/Hero'
import PartnerPreviewList, { PartnerPreviewListSkeleton } from '../components/home/PartnerPreviewList'
import Container from '../components/ui/Container'
import ErrorState from '../components/ui/ErrorState'
import { useAsyncResource, type AsyncResourceState } from '../hooks/useAsyncResource'

// Lower than the mockFetch default: this loader fans out into N+1 calls (getPartners
// plus one getVacancies per partner), so the default 0.2 error rate would compound
// into a near-certain failure once there are more than a couple of partners.
const CATEGORY_LOADER_ERROR_RATE = 0.03

async function loadPartnersByCategory(signal: AbortSignal): Promise<Map<string, Partner[]>> {
  const partners = await getPartners({ signal, errorRate: CATEGORY_LOADER_ERROR_RATE })
  const partnersWithVacancies = await Promise.all(
    partners.map(async (partner) => ({
      partner,
      vacancies: await getVacancies(partner.slug, { signal, errorRate: CATEGORY_LOADER_ERROR_RATE }),
    })),
  )

  const partnersByCategory = new Map<string, Partner[]>()
  for (const { partner, vacancies } of partnersWithVacancies) {
    const categorySlugs = new Set(vacancies.map((vacancy) => vacancy.categorySlug))
    for (const categorySlug of categorySlugs) {
      const existing = partnersByCategory.get(categorySlug)
      if (existing) existing.push(partner)
      else partnersByCategory.set(categorySlug, [partner])
    }
  }

  return partnersByCategory
}

function renderSection<T>(
  resource: AsyncResourceState<T>,
  skeleton: ReactNode,
  renderSuccess: (data: T) => ReactNode,
) {
  if (resource.status === 'idle' || resource.status === 'loading') return skeleton
  if (resource.status === 'error' && resource.error) {
    return <ErrorState message={resource.error.message} onRetry={resource.retry} />
  }
  if (resource.status === 'success' && resource.data) return renderSuccess(resource.data)
  return null
}

export default function HomePage() {
  const partnersResource = useAsyncResource<Partner[]>((signal) => getPartners({ signal }), [])
  const partnersByCategoryResource = useAsyncResource<Map<string, Partner[]>>(loadPartnersByCategory, [])

  return (
    <>
      <Hero />

      <Container className="flex flex-col gap-8 py-section">
        <section aria-labelledby="categories-heading" className="flex flex-col gap-4">
          <h2 id="categories-heading" className="text-2xl font-semibold text-fg">
            Browse by category
          </h2>

          {/* min-height matches the skeleton's own rendered height so an error state
              (much shorter than a 7-card grid) doesn't collapse the section and shift
              everything below it — see PLAN.md item 17/18 CLS investigation. */}
          <div className="min-h-44">
            {renderSection(partnersByCategoryResource, <CategoryGridSkeleton />, (partnersByCategory) => (
              <CategoryGrid partnersByCategory={partnersByCategory} />
            ))}
          </div>
        </section>

        <EmployerCta />

        <section id="partners-section" aria-labelledby="partners-heading" className="flex flex-col gap-4">
          <h2 id="partners-heading" className="text-2xl font-semibold text-fg">
            Our partners
          </h2>

          <div className="min-h-68">
            {renderSection(partnersResource, <PartnerPreviewListSkeleton />, (partners) => (
              <PartnerPreviewList partners={partners} />
            ))}
          </div>
        </section>
      </Container>
    </>
  )
}
