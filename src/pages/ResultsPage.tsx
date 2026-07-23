import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { RouteMap } from '../components/RouteMap'
import { RouteLoading } from '../components/RouteLoading'
import { Button } from '../components/Button'
import { useRoute } from '../contexts/RouteContext'
import { useToast } from '../contexts/ToastContext'
import { calculateRoute, type TravelTime } from '../utils/routeCalculator'
import { saveRoute } from '../utils/saveRoute'
import { shareWhatsApp } from '../utils/shareWhatsApp'
import { isFavorited, toggleFavorite } from '../utils/favoriteRoute'
import type { SelectedAttraction } from '../types/attraction'

const ICONS: Record<string, string> = {
  DRIVING: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
  WALKING: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
  BICYCLE: 'M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z',
}

export function ResultsPage() {
  const { t } = useTranslation()
  const { selected, mainAttraction, savedRouteId, setSavedRouteId, resetFlow } = useRoute()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [calculating, setCalculating] = useState(false)
  const [travelTimes, setTravelTimes] = useState<TravelTime[]>([])
  const [polylinePath, setPolylinePath] = useState<{ lat: number; lng: number }[]>([])
  const [totalDistance, setTotalDistance] = useState('')
  const [totalDuration, setTotalDuration] = useState('')
  const [optimizedAttractions, setOptimizedAttractions] = useState<SelectedAttraction[]>([])
  const [error, setError] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const fetchingRef = useRef(false)

  const orderedAttractions = useMemo(
    () =>
      mainAttraction
        ? [
            { ...mainAttraction, order: 1 },
            ...selected
              .filter((s) => s.id !== mainAttraction.id)
              .map((s, i) => ({ ...s, order: i + 2 })),
          ]
        : selected,
    [selected, mainAttraction]
  )

  const routeKey = useMemo(
    () => orderedAttractions.map((a) => a.id).join(','),
    [orderedAttractions]
  )

  const doFetch = useCallback(() => {
    if (fetchingRef.current) return
    if (orderedAttractions.length < 2) return

    fetchingRef.current = true
    setCalculating(true)
    setError(false)

    calculateRoute(orderedAttractions)
      .then(async (results) => {
        const driving = results.find((r) => r.travelTimes[0].mode === 'DRIVING')
        if (driving) {
          setTravelTimes(driving.travelTimes)
          setTotalDistance(driving.travelTimes[0].distance)
          setTotalDuration(driving.travelTimes[0].duration)
          setPolylinePath(driving.polylinePath)
          setOptimizedAttractions(driving.optimizedOrder)

          const routeId = await saveRoute({
            attractions: driving.optimizedOrder,
            travelTimes: driving.travelTimes,
            totalDistanceKm: driving.totalDistanceKm,
            totalDurationMin: driving.totalDurationMin,
          })
          if (routeId) {
            setSavedRouteId(routeId)
          } else {
            toast({ type: 'error', message: t('results.saveError') })
          }
        }
        setTravelTimes(results.map((r) => r.travelTimes[0]))
      })
      .catch((err) => {
        console.error('Route calculation error:', err)
        setError(true)
        toast({ type: 'error', message: t('results.calcFail') })
      })
      .finally(() => {
        fetchingRef.current = false
        setCalculating(false)
      })
  }, [orderedAttractions, toast, setSavedRouteId, t])

  useEffect(() => {
    doFetch()
  }, [routeKey, doFetch])

  useEffect(() => {
    if (!savedRouteId) return
    isFavorited(savedRouteId).then(setFavorited)
  }, [savedRouteId])

  async function handleFavorite() {
    if (!savedRouteId) return
    const result = await toggleFavorite(savedRouteId)
    setFavorited(result)
    toast({ type: 'success', message: t(result ? 'favorites.saved' : 'favorites.removed') })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <p className="text-lg font-bold text-navy">{t('results.calcError')}</p>
          <p className="mt-2 text-sm text-slate-500">{t('results.calcErrorSub')}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="pink" radius={15} onClick={() => navigate('/app')}>
              {t('common.back')}
            </Button>
            <Button variant="lime" radius={15} onClick={doFetch}>
              {t('common.retry')}
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (calculating) {
    return <RouteLoading phase="calculating" />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mb-6 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy sm:text-3xl">
                {optimizedAttractions.length > 0
                  ? t('results.routeTitle', { count: optimizedAttractions.length })
                  : t('results.noSelection')}
              </h1>
              {totalDistance && totalDuration && (
                <p className="mt-1 text-sm text-slate-500">
                  {totalDistance} · {totalDuration}
                </p>
              )}
            </div>
            <Button variant="outline" radius={15} onClick={() => navigate('/app')}>
              {t('common.edit')}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="h-64 sm:h-80 lg:h-full lg:min-h-[400px]">
              <RouteMap attractions={optimizedAttractions} polylinePath={polylinePath} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {optimizedAttractions.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="mb-3 text-sm font-semibold text-navy">{t('results.stopsTitle')}</h2>
                <ol className="space-y-3">
                  {optimizedAttractions.map((attraction, i) => (
                    <li key={attraction.id} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-navy">{attraction.nome}</p>
                        {attraction.bairro && (
                          <p className="text-xs text-slate-400">{attraction.bairro}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {travelTimes.map((t2) => (
                <div
                  key={t2.mode}
                  className="flex flex-col items-center rounded-xl border border-slate-200 p-3"
                >
                  <svg
                    className="mb-2 h-5 w-5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={ICONS[t2.mode]} />
                  </svg>
                  <p className="text-xs font-medium text-slate-500">{t2.label}</p>
                  <p className="text-sm font-bold text-navy">{t2.duration}</p>
                  <p className="text-xs text-slate-400">{t2.distance}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="pink"
                radius={15}
                className="flex-1"
                onClick={() => { resetFlow(); navigate('/app') }}
              >
                {t('results.newRoute')}
              </Button>
              <Button
                variant="lime"
                radius={15}
                className="flex-1"
                onClick={() => shareWhatsApp(optimizedAttractions, travelTimes)}
              >
                {t('results.shareWpp')}
              </Button>
              <Button
                variant={favorited ? 'mustard' : 'sky'}
                radius={15}
                className="flex-1"
                disabled={!savedRouteId}
                onClick={handleFavorite}
              >
                {favorited ? t('favorites.saved') : t('favorites.save')}
              </Button>
              <Button variant="sky" radius={15} className="flex-1" disabled>
                {t('results.generatePdf')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
