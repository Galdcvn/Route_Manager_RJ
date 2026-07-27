import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoSvg from '../assets/Logo.svg'
import { MenuDrawer } from './MenuDrawer'
import { AuthModal } from './AuthModal'
import { AvatarImg } from './AvatarImg'
import { useAuth } from '../contexts/AuthContext'
import { useRoute } from '../contexts/RouteContext'
import { useTheme } from '../contexts/ThemeContext'

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
  const { theme, toggleTheme } = useTheme()

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
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-3 py-3 dark:bg-slate-900 sm:px-6 sm:py-4">
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
              aria-haspopup="menu"
              aria-expanded={langOpen}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800" role="menu">
                {LANGUAGES.map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLang(lng)}
                    role="menuitem"
                    className={`flex w-full items-center px-4 py-2.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 ${
                      i18n.language === lng ? 'font-semibold text-pink' : 'text-navy dark:text-slate-300'
                    }`}
                  >
                    {t(`lang.${lng}`)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Desktop: dropdown do avatar ou botão login */}
          <div className="hidden md:block" ref={dropdownRef}>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white transition hover:ring-2 hover:ring-pink/30"
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                >
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImg
                      src={user.user_metadata.avatar_url}
                      alt=""
                      fallback={user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || ''}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800" role="menu">
                    <div className="px-4 py-2">
                      <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">
                        {user.user_metadata?.full_name || t('common.user')}
                      </p>
                      <p className="truncate text-xs text-slate-400">{user.email}</p>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-700" />
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
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
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      {t('header.myRoutes')}
                    </Link>
                    <Link
                      to="/app"
                      onClick={() => { resetFlow(); setDropdownOpen(false) }}
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <circle cx="12" cy="11" r="3" />
                      </svg>
                      {t('header.planRoute')}
                    </Link>
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false) }}
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
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
