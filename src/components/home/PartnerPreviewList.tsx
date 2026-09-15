import type { Partner } from '../../api/types'
import EmptyState from '../ui/EmptyState'
import Skeleton from '../ui/Skeleton'
import PartnerPreviewCard from './PartnerPreviewCard'

interface PartnerPreviewListProps {
  partners: Partner[]
}

const PARTNER_GRID_CLASSNAME = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

export function PartnerPreviewListSkeleton() {
  return (
    <div className={PARTNER_GRID_CLASSNAME}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  )
}

export default function PartnerPreviewList({ partners }: PartnerPreviewListProps) {
  if (partners.length === 0) {
    return <EmptyState title="No partners available" description="Check back soon for new partners." />
  }

  return (
    <div className={PARTNER_GRID_CLASSNAME}>
      {partners.map((partner) => (
        <PartnerPreviewCard key={partner.id} partner={partner} />
      ))}
    </div>
  )
}
