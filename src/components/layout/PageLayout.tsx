import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function PageLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  // A non-modal dialog doesn't inert the rest of the page automatically (unlike showModal()),
  // so do it manually — this keeps the header, and its own toggle button, interactive while open.
  useEffect(() => {
    if (mainRef.current) mainRef.current.inert = isMenuOpen
    if (footerRef.current) footerRef.current.inert = isMenuOpen
  }, [isMenuOpen])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isMenuOpen) return

    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = overflow
    }
  }, [isMenuOpen])

  return (
    <div className="flex min-h-screen flex-col">
      <Header isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} />
      <main ref={mainRef} className="flex-1">
        <Suspense fallback={<div />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer ref={footerRef} />
    </div>
  )
}
