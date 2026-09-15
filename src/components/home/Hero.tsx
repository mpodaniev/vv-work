import Container from '../ui/Container'

export default function Hero() {
  return (
    <section className="bg-accent/10">
      <Container className="flex flex-col gap-4 py-16 text-center items-center">
        <h1 className="text-4xl font-semibold text-fg sm:text-5xl">Find work with trusted partners</h1>
        <p className="max-w-2xl text-lg text-muted">
          We connect job seekers with vetted employers across logistics, construction, manufacturing, hospitality,
          IT, and driving roles.
        </p>
        <a
          href="#partners-section"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-base font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Browse partners
        </a>
      </Container>
    </section>
  )
}
