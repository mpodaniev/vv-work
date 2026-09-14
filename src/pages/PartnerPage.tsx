import { useParams } from 'react-router-dom'
import Container from '../components/ui/Container'

export default function PartnerPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <Container className="py-section">
      <h1>Partner page: {slug}</h1>
    </Container>
  )
}
