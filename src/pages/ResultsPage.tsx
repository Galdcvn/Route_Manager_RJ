import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { RouteMap } from '../components/RouteMap'
import { RouteLoading } from '../components/RouteLoading'
import { Button } from '../components/Button'
import { useRoute } from '../contexts/RouteContext'
import { useToast } from '../contexts/ToastContext'
import { useGoogleMapsLoaded } from '../hooks/useGoogleMapsLoaded'
import { calculateRoute, type TravelTime } from '../utils/routeCalculator'
import { saveRoute } from '../utils/saveRoute'
import { shareWhatsApp } from '../utils/shareWhatsApp'

const ICONS: Record<string, string> = {
  DRIVING: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
  WALKING: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
  TRANSIT: 'M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V8h5v3zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V8h5v3z',
}

export function ResultsPage() {
  const { selected, mainAttraction, setSavedRouteId } = useRoute()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isLoaded, loadError } = useGoogleMapsLoaded()

  const [calculating, setCalculating] = useState(false)
  const [travelTimes, setTravelTimes] = useState<TravelTime[]>([])
  const [directionResult, setDirectionResult] = useState<google.maps.DirectionsResult | null>(null)
  const [totalDistance, setTotalDistance] = useState('')
  const [totalDuration, setTotalDuration] = useState('')

  const orderedAttractions = mainAttraction
    ? [
        { ...mainAttraction, order: 1 },
        ...selected
          .filter((s) => s.id !== mainAttraction.id)
          .map((s, i) => ({ ...s, order: i + 2 })),
      ]
    : selected

  useEffect(() => {
    if (!isLoaded || orderedAttractions.length < 2) return

    setCalculating(true)

    calculateRoute(orderedAttractions)
      .then(async (results) => {
        const driving = results.find((r) => r.travelTimes[0].mode === 'DRIVING')
        if (driving) {
          setTravelTimes(driving.travelTimes)
          setTotalDistance(driving.travelTimes[0].distance)
          setTotalDuration(driving.travelTimes[0].duration)
          setDirectionResult(driving.directionResult)

          const routeId = await saveRoute({
            attractions: orderedAttractions,
            travelTimes: driving.travelTimes,
            totalDistanceKm: driving.totalDistanceKm,
            totalDurationMin: driving.totalDurationMin,
          })
          if (routeId) setSavedRouteId(routeId)
        }
        setTravelTimes(results.map((r) => r.travelTimes[0]))
      })
      .catch((err) => {
        console.error('Erro ao calcular rota:', err)
        toast({ type: 'error', message: 'Erro ao calcular rota. Tente novamente.' })
      })
      .finally(() => setCalculating(false))
  }, [isLoaded, orderedAttractions, toast, setSavedRouteId])

  if (loadError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <p className="text-lg font-bold text-navy">Erro ao carregar o Google Maps</p>
          <p className="mt-2 text-sm text-slate-500">Verifique sua conexao e recarregue a pagina.</p>
          <Button variant="pink" radius={15} className="mt-6" onClick={() => navigate('/app')}>
            Voltar
          </Button>
        </main>
      </div>
    )
  }

  if (!isLoaded || calculating) {
    return <RouteLoading phase={!isLoaded ? 'loading-map' : 'calculating'} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header da rota */}
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mb-6 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy sm:text-3xl">
                {orderedAttractions.length > 0
                  ? `Rota: ${orderedAttractions.length} parada${orderedAttractions.length !== 1 ? 's' : ''}`
                  : 'Nenhuma atração selecionada'}
              </h1>
              {totalDistance && totalDuration && (
                <p className="mt-1 text-sm text-slate-500">
                  {totalDistance} · {totalDuration}
                </p>
              )}
            </div>
            <Button variant="outline" radius={15} onClick={() => navigate('/app')}>
              Editar
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Mapa */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="h-64 sm:h-80 lg:h-full lg:min-h-[400px]">
              <RouteMap attractions={orderedAttractions} directionResult={directionResult} />
            </div>
          </div>

          {/* Dados da rota */}
          <div className="flex flex-col gap-6">
            {/* Lista de paradas */}
            {orderedAttractions.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="mb-3 text-sm font-semibold text-navy">Paradas na ordem da rota</h2>
                <ol className="space-y-3">
                  {orderedAttractions.map((attraction, i) => (
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

            {/* Tempos por modalidade */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {travelTimes.map((t) => (
                <div
                  key={t.mode}
                  className="flex flex-col items-center rounded-xl border border-slate-200 p-3"
                >
                  <svg
                    className="mb-2 h-5 w-5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={ICONS[t.mode]} />
                  </svg>
                  <p className="text-xs font-medium text-slate-500">{t.label}</p>
                  <p className="text-sm font-bold text-navy">{t.duration}</p>
                  <p className="text-xs text-slate-400">{t.distance}</p>
                </div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="lime"
                radius={15}
                className="flex-1"
                onClick={() => shareWhatsApp(orderedAttractions, travelTimes)}
              >
                Compartilhar rota (WPP)
              </Button>
              <Button variant="sky" radius={15} className="flex-1" disabled>
                Gerar PDF
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
