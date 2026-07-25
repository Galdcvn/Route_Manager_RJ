import { useTranslation } from 'react-i18next'
import { AuthForm } from './AuthForm'

type AuthModalProps = {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">{t('common.appName')}</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <AuthForm onSuccess={onClose} />
        </div>
      </div>
    </>
  )
}
