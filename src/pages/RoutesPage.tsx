import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../utils/supabase'
import { toggleFavorite } from '../utils/favoriteRoute'

interface FavoriteRoute {
  rota_id: string
  nome: string
  distancia_total: number | null
  duracao_total: string | null
  criado_em: string
}

export function RoutesPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { toast } = useToast()
  const [routes, setRoutes] = useState<FavoriteRoute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchFavorites() {
      const { data, error } = await supabase
        .from('rotas_favoritas')
        .select('rota_id, rotas ( nome, distancia_total, duracao_total, criado_em )')
        .eq('usuario_id', user!.id)

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const mapped: FavoriteRoute[] = (data ?? [])
        .filter((row: any) => row.rotas)
        .map((row: any) => ({
          rota_id: row.rota_id,
          nome: row.rotas.nome,
          distancia_total: row.rotas.distancia_total,
          duracao_total: row.rotas.duracao_total,
          criado_em: row.rotas.criado_em,
        }))
        .sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime())

      setRoutes(mapped)
      setLoading(false)
    }

    fetchFavorites()
  }, [user])

  async function handleRemove(routeId: string) {
    await toggleFavorite(routeId)
    setRoutes((prev) => prev.filter((r) => r.rota_id !== routeId))
    toast({ type: 'success', message: t('favorites.removed') })
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">{t('favorites.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('favorites.subtitle')}</p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">{t('common.loading')}</p>
        ) : routes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-semibold text-navy">{t('favorites.empty')}</p>
            <p className="mt-2 text-sm text-slate-400">{t('favorites.emptySub')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {routes.map((route) => (
              <div
                key={route.rota_id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{route.nome}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {route.distancia_total != null && `${route.distancia_total.toFixed(1)} km`}
                    {route.distancia_total != null && route.duracao_total && ' · '}
                    {route.duracao_total && route.duracao_total}
                    {route.distancia_total != null && ' · '}
                    {formatDate(route.criado_em)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  radius={15}
                  className="ml-3 shrink-0"
                  onClick={() => handleRemove(route.rota_id)}
                >
                  {t('favorites.delete')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
