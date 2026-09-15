import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Partner } from '../../api/types'

interface PartnerPreviewCardProps {
  partner: Partner
}

const PartnerPreviewCard = memo(function PartnerPreviewCard({ partner }: PartnerPreviewCardProps) {
  return (
    <article className="flex flex-col gap-2 rounded-md border border-border p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-medium text-fg">{partner.name}</h3>
        {partner.vacancyCount !== undefined && (
          <span className="rounded-full bg-border/50 px-3 py-1 text-sm text-fg">{partner.vacancyCount} jobs</span>
        )}
      </div>
      <p className="text-sm text-muted">
        {partner.location} · {partner.industry}
      </p>
      <p className="text-sm text-fg">{partner.description}</p>
      <Link to={`/partners/${partner.slug}`} className="text-sm font-medium text-accent hover:underline">
        View jobs
      </Link>
    </article>
  )
})

export default PartnerPreviewCard
