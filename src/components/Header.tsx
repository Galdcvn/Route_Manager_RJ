import { useState, useRef, useEffect } from 'react'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, signOut } = useAuth()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

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
          {/* Desktop: dropdown do avatar ou botão login */}
          <div className="hidden md:block" ref={dropdownRef}>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white transition hover:ring-2 hover:ring-pink/30"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    <div className="px-4 py-2">
                      <p className="truncate text-sm font-semibold text-navy">
                        {user.user_metadata?.full_name || 'Usuário'}
                      </p>
                      <p className="truncate text-xs text-slate-400">{user.email}</p>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy transition hover:bg-slate-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Meu Perfil
                    </Link>
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false) }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      Sair
                    </button>
                  </div>
                )}
              </div>
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
