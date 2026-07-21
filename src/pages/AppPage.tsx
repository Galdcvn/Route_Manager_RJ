import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { AttractionCard } from '../components/AttractionCard'
import { AttractionInfoModal } from '../components/AttractionInfoModal'
import { Button } from '../components/Button'
import { useAttractions } from '../hooks/useAttractions'
import { useRoute } from '../contexts/RouteContext'
import { haversineKm } from '../utils/distance'
import type { Attraction } from '../types/attraction'

const RADIUS_KM = 5
const steps = ['Escolher atração principal', 'Atrações próximas', 'Resultado']

export function AppPage() {
  const { attractions, loading, error } = useAttractions()
  const { step, setStep, selected, toggleAttraction, mainAttraction, setMainAttraction, resetFlow } = useRoute()
  const navigate = useNavigate()
  const [infoAttraction, setInfoAttraction] = useState<Attraction | null>(null)

  const nearbyAttractions = useMemo(() => {
    if (!mainAttraction) return []
    return attractions.filter((a) => {
      if (a.id === mainAttraction.id) return false
      const dist = haversineKm(
        mainAttraction.localizacao.lat,
        mainAttraction.localizacao.lng,
        a.localizacao.lat,
        a.localizacao.lng
      )
      return dist <= RADIUS_KM
    })
  }, [attractions, mainAttraction])

  const handleSelectMain = (attraction: Attraction) => {
    if (mainAttraction?.id === attraction.id) {
      setMainAttraction(null)
    } else {
      setMainAttraction(attraction)
    }
  }

  const handleProceed = () => {
    if (mainAttraction && !selected.some((s) => s.id === mainAttraction.id)) {
      toggleAttraction(mainAttraction)
    }
    setStep('select-nearby')
  }

  const handleBack = () => {
    resetFlow()
  }

  const handleBackToMain = () => {
    setStep('select-main')
  }

  const currentStepIndex = step === 'select-main' ? 0 : 1
  const canProceedStep1 = mainAttraction !== null
  const canProceedStep2 = selected.length >= 1

  const displayAttractions = step === 'select-main' ? attractions : nearbyAttractions

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 overflow-x-auto sm:mb-8">
          <ol className="flex items-center gap-2 whitespace-nowrap">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold sm:text-sm ${
                    i === currentStepIndex ? 'text-pink' : i < currentStepIndex ? 'text-sky' : 'text-slate-300'
                  }`}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <svg className="h-4 w-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Título */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mb-8 sm:p-6">
          {step === 'select-main' ? (
            <>
              <h1 className="text-xl font-bold text-navy sm:text-2xl">Escolha a atração principal</h1>
              <p className="mt-1 text-sm text-slate-500">
                Selecione o ponto de partida da sua rota.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-navy sm:text-2xl">
                Atrações próximas a {mainAttraction?.nome}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Raio de {RADIUS_KM} km · Selecione mais atrações para sua rota.
              </p>
              {selected.length > 0 && (
                <p className="mt-2 text-xs text-pink font-medium">
                  {selected.length} atração{selected.length !== 1 ? 'ões' : ''} selecionada{selected.length !== 1 ? 's' : ''}
                </p>
              )}
            </>
          )}
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Nenhuma atração próxima */}
        {step === 'select-nearby' && !loading && nearbyAttractions.length === 0 && (
          <div className="rounded-2xl border border-mustard/30 bg-mustard/10 p-4 text-sm text-mustard">
            Nenhuma atração encontrada dentro de {RADIUS_KM} km de {mainAttraction?.nome}.
          </div>
        )}

        {/* Cards de atrações */}
        {!loading && !error && displayAttractions.length > 0 && (
          <div className="mb-8 flex gap-4 overflow-x-auto pb-4 sm:mb-10 sm:gap-5 sm:pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {displayAttractions.map((attraction) => {
              const isMain = mainAttraction?.id === attraction.id
              const isSelected = selected.some((s) => s.id === attraction.id)

              return (
                <AttractionCard
                  key={attraction.id}
                  name={attraction.nome}
                  category={attraction.categoria}
                  image={attraction.imagem_url}
                  bairro={attraction.bairro}
                  selected={step === 'select-main' ? isMain : isSelected}
                  onClick={() => {
                    if (step === 'select-main') {
                      handleSelectMain(attraction)
                    } else {
                      toggleAttraction(attraction)
                    }
                  }}
                  onInfoClick={() => setInfoAttraction(attraction)}
                />
              )
            })}
          </div>
        )}
      </main>

      {/* Barra fixa inferior */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {step === 'select-main' ? (
            <>
              <Link to="/">
                <Button variant="outline" radius={15}>
                  Voltar
                </Button>
              </Link>
              <Button
                variant={canProceedStep1 ? 'pink' : 'outline'}
                radius={15}
                disabled={!canProceedStep1}
                onClick={handleProceed}
              >
                Prosseguir
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" radius={15} onClick={handleBackToMain}>
                Voltar
              </Button>
              <Button
                variant={canProceedStep2 ? 'pink' : 'outline'}
                radius={15}
                disabled={!canProceedStep2}
                onClick={() => navigate('/results')}
              >
                Calcular rota
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modal de informações */}
      <AttractionInfoModal
        open={infoAttraction !== null}
        onClose={() => setInfoAttraction(null)}
        attraction={infoAttraction}
      />
    </div>
  )
}
