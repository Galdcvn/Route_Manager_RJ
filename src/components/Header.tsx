import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoSvg from '../assets/Logo.svg'
import { MenuDrawer } from './MenuDrawer'
import { AuthModal } from './AuthModal'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
  { label: 'Início', to: '/' },
  { label: 'Planejar Rota', to: '/app' },
]

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-3 py-3 sm:px-6 sm:py-4">
        <Link to="/">
          <img src={logoSvg} alt="Route Manager RJ" className="h-10 w-10 sm:h-12 sm:w-12" />
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

        <div className="flex items-center gap-3">
          {/* Desktop: botão login ou avatar */}
          <div className="hidden md:block">
            {user ? (
              <Link to="/profile">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white transition hover:ring-2 hover:ring-pink/30">
                  {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </div>
              </Link>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="rounded-full bg-sky px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Entrar
              </button>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col gap-1 p-2 md:hidden"
            aria-label="Abrir menu"
          >
            <span className="block h-0.5 w-6 bg-navy" />
            <span className="block h-0.5 w-6 bg-navy" />
          </button>
        </div>
      </header>

      <MenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
