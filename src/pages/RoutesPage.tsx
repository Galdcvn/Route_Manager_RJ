import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { SearchInput } from '../components/SearchInput'
import { RouteSkeleton } from '../components/RouteSkeleton'
import { useAuth } from '../contexts/AuthContext'
import { useRoute } from '../contexts/RouteContext'
import { useToast } from '../contexts/ToastContext'
import { useDebounce } from '../hooks/useDebounce'
import { supabase } from '../utils/supabase'
import { toggleFavorite } from '../utils/favoriteRoute'
import { formatInterval } from '../utils/formatInterval'
import type { RotaFavoritaJoin } from '../types/supabase'

interface FavoriteRoute {
  rota_id: string
  nome: string | null
  distancia_total: number | null
  duracao_total: string | null
  criado_em: string
}

export function RoutesPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { loadSavedRoute } = useRoute()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [routes, setRoutes] = useState<FavoriteRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const filteredRoutes = useMemo(() => {
    if (!debouncedSearch.trim()) return routes
    const q = debouncedSearch.trim().toLowerCase()
    return routes.filter((r) => r.nome?.toLowerCase().includes(q) ?? false)
  }, [routes, debouncedSearch])

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

      const mapped: FavoriteRoute[] = ((data ?? []) as RotaFavoritaJoin[])
        .filter((row) => row.rotas && row.rotas.length > 0)
        .map((row) => ({
          rota_id: row.rota_id,
          nome: row.rotas![0].nome,
          distancia_total: row.rotas![0].distancia_total,
          duracao_total: row.rotas![0].duracao_total,
          criado_em: row.rotas![0].criado_em,
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

  async function handleView(routeId: string) {
    const ok = await loadSavedRoute(routeId)
    if (ok) {
      navigate('/results')
    } else {
      toast({ type: 'error', message: t('common.error') })
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-navy dark:text-slate-100 sm:text-3xl">{t('favorites.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('favorites.subtitle')}</p>
          {routes.length > 0 && (
            <div className="mt-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={t('favorites.search')}
              />
            </div>
          )}
        </div>

        {loading ? (
          <RouteSkeleton />
        ) : routes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-lg font-semibold text-navy dark:text-slate-100">{t('favorites.empty')}</p>
            <p className="mt-2 text-sm text-slate-400">{t('favorites.emptySub')}</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-slate-400">{t('favorites.noResults')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredRoutes.map((route) => (
              <div
                key={route.rota_id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">{route.nome}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {route.distancia_total != null && `${route.distancia_total.toFixed(1)} km`}
                    {route.distancia_total != null && route.duracao_total && ' · '}
                    {formatInterval(route.duracao_total)}
                    {route.distancia_total != null && ' · '}
                    {formatDate(route.criado_em)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <Button
                    variant="sky"
                    radius={15}
                    onClick={() => handleView(route.rota_id)}
                  >
                    {t('favorites.view')}
                  </Button>
                  <Button
                    variant="outline"
                    radius={15}
                    onClick={() => handleRemove(route.rota_id)}
                  >
                    {t('favorites.delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
