import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { Button } from '../components/Button'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-6xl font-bold text-pink">404</p>
        <h1 className="mt-4 text-2xl font-bold text-navy">{t('notfound.title')}</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {t('notfound.description')}
        </p>
        <Link to="/" className="mt-8">
          <Button variant="pink" radius={15}>
            {t('notfound.backHome')}
          </Button>
        </Link>
      </main>
    </div>
  )
}
