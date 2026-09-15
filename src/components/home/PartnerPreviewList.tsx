import type { Partner } from '../../api/types'
import CardGrid, { CardGridSkeleton } from '../ui/CardGrid'
import PartnerPreviewCard from './PartnerPreviewCard'

interface PartnerPreviewListProps {
  partners: Partner[]
}

export function PartnerPreviewListSkeleton() {
  return <CardGridSkeleton count={6} itemClassName="h-32 w-full" />
}

export default function PartnerPreviewList({ partners }: PartnerPreviewListProps) {
  return (
    <CardGrid
      items={partners}
      keyExtractor={(partner) => partner.id}
      renderItem={(partner) => <PartnerPreviewCard partner={partner} />}
      emptyTitle="No partners available"
      emptyDescription="Check back soon for new partners."
    />
  )
}
