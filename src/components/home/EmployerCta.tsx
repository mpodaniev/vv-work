import { Link } from 'react-router-dom'

const benefits = ['Access pre-screened candidates', 'Post vacancies in minutes', 'Dedicated partner support']

export default function EmployerCta() {
  return (
    <section className="flex flex-col gap-4 rounded-md border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-fg">Need workers?</h2>
        <ul className="flex flex-col gap-1 text-sm text-muted">
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>
      <Link
        to="/contacts"
        className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-base font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Find a worker
      </Link>
    </section>
  )
}
