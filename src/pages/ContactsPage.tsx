import ApplicationForm from '../components/forms/ApplicationForm'
import Container from '../components/ui/Container'

export default function ContactsPage() {
  return (
    <Container className="max-w-xl py-section">
      <h1 className="text-3xl font-semibold text-fg">Apply now</h1>
      <p className="mt-2 text-muted">Leave your details and we'll match you with a partner.</p>
      <div className="mt-8">
        <ApplicationForm />
      </div>
    </Container>
  )
}
