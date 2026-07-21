import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { MenuDrawer } from './MenuDrawer'

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Route Manager', to: '/app' },
  { label: 'Contato', to: '/' },
  { label: 'Sobre', to: '/' },
]

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-3 py-3 sm:px-6 sm:py-4">
        <Link to="/">
          <Logo className="h-10 w-10 sm:h-12 sm:w-12" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-navy transition hover:text-pink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col gap-1 p-2 md:hidden"
          aria-label="Abrir menu"
        >
          <span className="block h-0.5 w-6 bg-navy" />
          <span className="block h-0.5 w-6 bg-navy" />
        </button>
      </header>

      <MenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
