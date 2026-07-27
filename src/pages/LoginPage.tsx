import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoSvg from '../assets/Logo.svg'
import { useAuth } from '../contexts/AuthContext'
import { AuthForm } from '../components/AuthForm'

export function LoginPage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (user) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800 sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3">
          <img src={logoSvg} alt={t('common.appName')} className="h-14 w-14" />
          <h1 className="text-xl font-bold text-navy dark:text-slate-100">{t('common.appName')}</h1>
          <p className="text-sm text-slate-500">{t('login.subtitle')}</p>
        </div>

        <AuthForm />
      </div>
    </div>
  )
}
