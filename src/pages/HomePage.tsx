import type { ReactNode } from 'react'
import { getPartners } from '../api/partners'
import type { Partner } from '../api/types'
import CategoryGrid, { CategoryGridSkeleton } from '../components/home/CategoryGrid'
import EmployerCta from '../components/home/EmployerCta'
import Hero from '../components/home/Hero'
import PartnerPreviewList, { PartnerPreviewListSkeleton } from '../components/home/PartnerPreviewList'
import Container from '../components/ui/Container'
import ErrorState from '../components/ui/ErrorState'
import { useAsyncResource, type AsyncResourceState } from '../hooks/useAsyncResource'

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

  return (
    <>
      <Hero />

      <Container className="flex flex-col gap-8 py-section">
        <section aria-labelledby="categories-heading" className="flex flex-col gap-4">
          <h2 id="categories-heading" className="text-2xl font-semibold text-fg">
            Browse by category
          </h2>

          {renderSection(partnersResource, <CategoryGridSkeleton />, (partners) => (
            <CategoryGrid partners={partners} />
          ))}
        </section>

        <EmployerCta />

        <section id="partners-section" aria-labelledby="partners-heading" className="flex flex-col gap-4">
          <h2 id="partners-heading" className="text-2xl font-semibold text-fg">
            Our partners
          </h2>

          {renderSection(partnersResource, <PartnerPreviewListSkeleton />, (partners) => (
            <PartnerPreviewList partners={partners} />
          ))}
        </section>
      </Container>
    </>
  )
}
