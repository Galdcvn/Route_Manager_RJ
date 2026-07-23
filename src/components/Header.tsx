import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoSvg from '../assets/Logo.svg'
import { MenuDrawer } from './MenuDrawer'
import { AuthModal } from './AuthModal'
import { useAuth } from '../contexts/AuthContext'
import { useRoute } from '../contexts/RouteContext'

const LANGUAGES = ['pt', 'en', 'es'] as const

export function Header() {
  const { t, i18n } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const { user, signOut } = useAuth()
  const { resetFlow } = useRoute()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    if (dropdownOpen || langOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen, langOpen])

  function changeLang(lng: string) {
    i18n.changeLanguage(lng)
    setLangOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-3 py-3 sm:px-6 sm:py-4">
        <Link to="/">
          <img src={logoSvg} alt={t('common.appName')} className="h-10 w-10 sm:h-12 sm:w-12" />
        </Link>

        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition hover:bg-slate-100"
              aria-label="Language"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {LANGUAGES.map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLang(lng)}
                    className={`flex w-full items-center px-4 py-2.5 text-sm transition hover:bg-slate-50 ${
                      i18n.language === lng ? 'font-semibold text-pink' : 'text-navy'
                    }`}
                  >
                    {t(`lang.${lng}`)}
                  </button>
                ))}
              </div>
            )}
          </div>

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
                        {user.user_metadata?.full_name || t('common.user')}
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
                      {t('header.myProfile')}
                    </Link>
                    <Link
                      to="/rotas"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy transition hover:bg-slate-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      {t('header.myRoutes')}
                    </Link>
                    <Link
                      to="/app"
                      onClick={() => { resetFlow(); setDropdownOpen(false) }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy transition hover:bg-slate-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <circle cx="12" cy="11" r="3" />
                      </svg>
                      {t('header.planRoute')}
                    </Link>
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false) }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      {t('header.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="rounded-full bg-sky px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:brightness-110"
              >
                {t('header.signIn')}
              </button>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col gap-1 p-2 md:hidden"
            aria-label={t('header.openMenu')}
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
