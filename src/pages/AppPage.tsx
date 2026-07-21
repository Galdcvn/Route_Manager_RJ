import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { AttractionCard } from '../components/AttractionCard'
import { Button } from '../components/Button'
import { useAttractions } from '../hooks/useAttractions'
import { useRoute } from '../contexts/RouteContext'

const steps = ['Escolher atrações', 'Rota calculada', 'Resultado']

export function AppPage() {
  const { attractions, loading, error } = useAttractions()
  const { selected, toggleAttraction, mainAttraction, setMainAttraction } = useRoute()
  const navigate = useNavigate()

  const handleSelectMain = (attraction: (typeof attractions)[0]) => {
    if (mainAttraction?.id === attraction.id) {
      setMainAttraction(null)
    } else {
      setMainAttraction(attraction)
      if (!selected.some((s) => s.id === attraction.id)) {
        toggleAttraction(attraction)
      }
    }
  }

  const canProceed = mainAttraction !== null && selected.length >= 2

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 overflow-x-auto sm:mb-8">
          <ol className="flex items-center gap-2 whitespace-nowrap">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold sm:text-sm ${
                    i === 0 ? 'text-pink' : 'text-slate-300'
                  }`}
                >
                  {step}
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
          <h1 className="text-xl font-bold text-navy sm:text-2xl">Escolha a atração principal</h1>
          <p className="mt-1 text-sm text-slate-500">
            Selecione o ponto de partida e as atrações que deseja visitar.
          </p>
          {selected.length > 0 && (
            <p className="mt-2 text-xs text-pink font-medium">
              {selected.length} atração{selected.length !== 1 ? 'ões' : ''} selecionada{selected.length !== 1 ? 's' : ''}
              {mainAttraction && ` · Partindo de ${mainAttraction.nome}`}
            </p>
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

        {/* Cards de atrações */}
        {!loading && !error && (
          <div className="mb-8 flex gap-4 overflow-x-auto pb-4 sm:mb-10 sm:gap-5 sm:pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {attractions.map((attraction) => {
              const isMain = mainAttraction?.id === attraction.id
              const isSelected = selected.some((s) => s.id === attraction.id)

              return (
                <AttractionCard
                  key={attraction.id}
                  name={attraction.nome}
                  category={attraction.categoria}
                  image={attraction.imagem_url}
                  bairro={attraction.bairro}
                  selected={isMain}
                  onClick={() => handleSelectMain(attraction)}
                />
              )
            })}
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-between">
          <Link to="/">
            <Button variant="outline" radius={15}>
              Voltar
            </Button>
          </Link>
          <Button
            variant={canProceed ? 'pink' : 'outline'}
            radius={15}
            disabled={!canProceed}
            onClick={() => navigate('/results')}
          >
            Calcular rota
          </Button>
        </div>
      </main>
    </div>
  )
}
