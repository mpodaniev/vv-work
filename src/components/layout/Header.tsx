import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Container from '../ui/Container'

const navLinks = [
  { to: '/', label: 'Find a job' },
  { to: '/', label: 'Find a worker' },
  { to: '/', label: 'About us' },
  { to: '/', label: 'Partners' },
  { to: '/contacts', label: 'Contacts' },
]

interface HeaderProps {
  isMenuOpen: boolean
  onMenuOpenChange: (isOpen: boolean) => void
}

export default function Header({ isMenuOpen, onMenuOpenChange }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const observer = new ResizeObserver(([entry]) => {
      if (entry) setHeaderHeight(entry.contentRect.height)
    })
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isMenuOpen && !dialog.open) {
      dialog.show()
    } else if (!isMenuOpen && dialog.open) {
      dialog.close()
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onMenuOpenChange(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen, onMenuOpenChange])

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `text-base font-medium transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-fg'}`

  const mobileNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `${navLinkClassName({ isActive })} text-2xl`

  return (
    <header ref={headerRef} className="relative z-50 border-b border-border bg-bg">
      <Container className="flex items-center justify-between py-4">
        <NavLink to="/" className="text-xl font-bold text-fg">
          VV Work
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.to} end={link.to === '/'} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-border p-2 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => onMenuOpenChange(!isMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {isMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        className="mobile-menu"
        style={{ top: headerHeight, height: `calc(100vh - ${headerHeight}px)` }}
        aria-label="Mobile navigation"
      >
        <Container className="flex h-full flex-col items-center justify-center gap-8 py-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={mobileNavLinkClassName}
              onClick={() => onMenuOpenChange(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </Container>
      </dialog>
    </header>
  )
}
