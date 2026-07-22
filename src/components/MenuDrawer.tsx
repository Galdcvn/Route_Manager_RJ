import { useAuth } from '../contexts/AuthContext'
import { AuthModal } from './AuthModal'
import { useState } from 'react'
import { Link } from 'react-router-dom'

type MenuDrawerProps = {
  open: boolean
  onClose: () => void
}

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const { user, signOut } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-white shadow-xl transition-transform duration-300 sm:w-72 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-bold text-navy">Menu</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            aria-label="Fechar menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {user ? (
            <>
              {/* Logado */}
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                    {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">
                    {user.user_metadata?.full_name || 'Usuário'}
                  </p>
                  <p className="truncate text-xs text-slate-400">{user.email}</p>
                </div>
              </div>

              <div className="my-2 h-px bg-slate-100" />

              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-navy transition hover:bg-slate-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Perfil
              </Link>

              <Link
                to="/app"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-navy transition hover:bg-slate-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                Planejar Rota
              </Link>

              <div className="my-2 h-px bg-slate-100" />

              <button
                onClick={() => { signOut(); onClose() }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sair
              </button>
            </>
          ) : (
            <>
              {/* Deslogado */}
              <button
                onClick={() => { setAuthOpen(true); onClose() }}
                className="flex items-center gap-3 rounded-xl bg-sky px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                Login
              </button>
            </>
          )}
        </nav>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
