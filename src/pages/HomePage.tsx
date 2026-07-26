import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { useRoute } from '../contexts/RouteContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../utils/supabase'
import { formatInterval } from '../utils/formatInterval'

interface DashboardRoute {
  id: string
  nome: string
  distancia_total: number | null
  duracao_total: string | null
  criado_em: string
}

export function HomePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { loadSavedRoute: loadRoute } = useRoute()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [favoriteRoutes, setFavoriteRoutes] = useState<DashboardRoute[]>([])
  const [recentRoutes, setRecentRoutes] = useState<DashboardRoute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchDashboard() {
      try {
        const [favsRes, recentRes] = await Promise.all([
          supabase
            .from('rotas_favoritas')
            .select('rota_id, rotas ( id, nome, distancia_total, duracao_total, criado_em )')
            .eq('usuario_id', user!.id)
            .order('criado_em', { ascending: false })
            .limit(5),
          supabase
            .from('rotas')
            .select('id, nome, distancia_total, duracao_total, criado_em')
            .eq('usuario_id', user!.id)
            .order('criado_em', { ascending: false })
            .limit(5),
        ])

        const favs: DashboardRoute[] = (favsRes.data ?? [])
          .filter((row: any) => row.rotas)
          .map((row: any) => ({
            id: row.rota_id,
            nome: row.rotas.nome,
            distancia_total: row.rotas.distancia_total,
            duracao_total: row.rotas.duracao_total,
            criado_em: row.rotas.criado_em,
          }))

        const recent: DashboardRoute[] = (recentRes.data ?? []).map((row: any) => ({
          id: row.id,
          nome: row.nome,
          distancia_total: row.distancia_total,
          duracao_total: row.duracao_total,
          criado_em: row.criado_em,
        }))

        setFavoriteRoutes(favs)
        setRecentRoutes(recent)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [user])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  async function handleOpenRoute(routeId: string) {
    const ok = await loadRoute(routeId)
    if (ok) {
      navigate(`/results?route=${routeId}`)
    } else {
      toast({ type: 'error', message: t('common.error') })
    }
  }

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || t('common.user')

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* ── Saudação ── */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">
            {t('home.greeting', { name: displayName })}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t('home.greetingSub')}</p>
        </div>

        {/* ── Cards de ação rápida ── */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <Link to="/app" className="group">
            <div className="rounded-2xl border-2 border-pink/20 bg-pink/5 p-4 transition hover:border-pink/40 hover:bg-pink/10 sm:p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-pink/10 text-pink transition group-hover:bg-pink group-hover:text-white sm:h-12 sm:w-12">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <p className="text-sm font-bold text-navy sm:text-base">{t('home.newRoute')}</p>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">{t('home.newRouteSub')}</p>
            </div>
          </Link>

          <Link to="/rotas" className="group">
            <div className="rounded-2xl border-2 border-sky/20 bg-sky/5 p-4 transition hover:border-sky/40 hover:bg-sky/10 sm:p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky/10 text-sky transition group-hover:bg-sky group-hover:text-white sm:h-12 sm:w-12">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-sm font-bold text-navy sm:text-base">{t('home.savedRoutes')}</p>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">{t('home.savedRoutesSub')}</p>
            </div>
          </Link>

          <Link to="/profile" className="group col-span-2 sm:col-span-1">
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100 sm:p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-slate-200 group-hover:text-navy sm:h-12 sm:w-12">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-navy sm:text-base">{t('home.viewProfile')}</p>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">{user?.email}</p>
            </div>
          </Link>
        </div>

        {/* ── Rotas Favoritas ── */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">{t('home.savedRoutes')}</h2>
            {favoriteRoutes.length > 0 && (
              <Link to="/rotas" className="text-sm font-medium text-pink transition hover:text-pink/80">
                {t('home.seeAll')}
              </Link>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-pink border-t-transparent" />
            </div>
          ) : favoriteRoutes.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-400">{t('home.noRoutes')}</p>
              <p className="mt-1 text-xs text-slate-300">{t('home.noRoutesSub')}</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4 sm:pb-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
              {favoriteRoutes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => handleOpenRoute(route.id)}
                  className="min-w-[200px] flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-pink/30 hover:bg-pink/5 sm:min-w-0 sm:p-5"
                >
                  <p className="truncate text-sm font-semibold text-navy">{route.nome}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {route.distancia_total != null && `${route.distancia_total.toFixed(1)} km`}
                    {route.distancia_total != null && route.duracao_total && ' · '}
                    {formatInterval(route.duracao_total)}
                    {route.criado_em && ` · ${formatDate(route.criado_em)}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── Rotas Recentes ── */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">{t('home.recent')}</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-pink border-t-transparent" />
            </div>
          ) : recentRoutes.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-400">{t('home.noRoutes')}</p>
              <p className="mt-1 text-xs text-slate-300">{t('home.noRoutesSub')}</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4 sm:pb-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
              {recentRoutes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => handleOpenRoute(route.id)}
                  className="min-w-[200px] flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-pink/30 hover:bg-pink/5 sm:min-w-0 sm:p-5"
                >
                  <p className="truncate text-sm font-semibold text-navy">{route.nome}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {route.distancia_total != null && `${route.distancia_total.toFixed(1)} km`}
                    {route.distancia_total != null && route.duracao_total && ' · '}
                    {formatInterval(route.duracao_total)}
                    {route.criado_em && ` · ${formatDate(route.criado_em)}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
