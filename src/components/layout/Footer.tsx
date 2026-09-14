import type { Ref } from 'react'
import Container from '../ui/Container'

const footerColumns = [
  {
    title: 'VV Work',
    links: [
      { label: 'About us', href: '#' },
      { label: 'Partners', href: '#' },
    ],
  },
  {
    title: 'For candidates',
    links: [
      { label: 'Find a job', href: '/' },
      { label: 'How it works', href: '#' },
    ],
  },
  {
    title: 'For employers',
    links: [
      { label: 'Find a worker', href: '/' },
      { label: 'Post a vacancy', href: '#' },
    ],
  },
  {
    title: 'Contacts',
    links: [
      { label: 'contacts', href: '/contacts' },
      { label: 'support@vvwork.example', href: 'mailto:support@vvwork.example' },
    ],
  },
]

const socialLinks = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
]

export default function Footer({ ref }: { ref?: Ref<HTMLElement> }) {
  return (
    <footer ref={ref} className="border-t border-border bg-bg">
      <Container className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{column.title}</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-base text-fg hover:text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 sm:flex-row">
        <div className="flex gap-4">
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} className="text-sm text-muted hover:text-accent">
              {social.label}
            </a>
          ))}
        </div>

        <div className="flex gap-4 text-sm text-muted">
          <a href="#" className="hover:text-accent">
            Privacy policy
          </a>
          <a href="#" className="hover:text-accent">
            Terms of use
          </a>
        </div>

        <p className="text-sm text-muted">&copy; {new Date().getFullYear()} VV Work</p>
      </Container>
    </footer>
  )
}
