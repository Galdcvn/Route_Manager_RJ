import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

type AuthModalProps = {
  open: boolean
  onClose: () => void
}

type Tab = 'login' | 'signup'

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { t } = useTranslation()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!open) return null

  function reset() {
    setEmail('')
    setPassword('')
    setNome('')
    setShowPassword(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = tab === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, nome)

    setLoading(false)

    if (result.error) {
      toast({ type: 'error', message: result.error })
    } else {
      handleClose()
    }
  }

  async function handleGoogle() {
    await signInWithGoogle()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">
              {tab === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
            </h2>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                tab === 'login' ? 'bg-white text-navy shadow-sm' : 'text-slate-500'
              }`}
            >
              {t('auth.login')}
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                tab === 'signup' ? 'bg-white text-navy shadow-sm' : 'text-slate-500'
              }`}
            >
              {t('auth.signup')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 'signup' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">{t('auth.name')}</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder={t('auth.namePlaceholder')}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-sky focus:ring-2 focus:ring-sky/20"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-navy outline-none transition focus:border-sky focus:ring-2 focus:ring-sky/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm text-navy outline-none transition focus:border-sky focus:ring-2 focus:ring-sky/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50"
            >
              {loading ? t('common.loading') : tab === 'login' ? t('auth.login') : t('auth.signup')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">{t('common.or')}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-sm font-medium text-navy transition hover:bg-slate-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('auth.loginGoogle')}
          </button>
        </div>
      </div>
    </>
  )
}
