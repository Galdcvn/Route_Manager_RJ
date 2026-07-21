import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { useRoute } from '../contexts/RouteContext'

export function ResultsPage() {
  const { selected, mainAttraction } = useRoute()

  const orderedAttractions = mainAttraction
    ? [
        mainAttraction,
        ...selected.filter((s) => s.id !== mainAttraction.id),
      ]
    : selected

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Mapa */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="relative h-64 sm:h-80 lg:h-full lg:min-h-[400px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/src/assets/Mapa_RJ.svg"
                  alt="Mapa da rota"
                  className="h-48 w-auto opacity-20 sm:h-64"
                  style={{ filter: 'grayscale(1) brightness(1.2)' }}
                />
              </div>

              {/* Rota tracejada */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" fill="none">
                <path
                  d="M130 100 Q200 130 200 180 Q200 230 150 250"
                  stroke="#4CA3FF"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Dados da rota */}
          <div className="flex flex-col gap-6">
            {/* Título */}
            <div>
              <h1 className="text-2xl font-bold text-navy sm:text-3xl">
                {orderedAttractions.length > 0
                  ? `Rota: ${orderedAttractions.length} parada${orderedAttractions.length !== 1 ? 's' : ''}`
                  : 'Nenhuma atração selecionada'}
              </h1>
            </div>

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
              {[
                { label: 'Carro', time: '—', color: 'bg-sky' },
                { label: 'Andar', time: '—', color: 'bg-lime' },
                { label: 'Transporte público', time: '—', color: 'bg-pink' },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center rounded-xl border border-slate-200 p-3"
                >
                  <div className={`mb-2 h-3 w-3 rounded-full ${t.color}`} />
                  <p className="text-xs font-medium text-slate-500">{t.label}</p>
                  <p className="text-sm font-bold text-navy">{t.time}</p>
                </div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="lime" radius={15} className="flex-1">
                Compartilhar rota (WPP)
              </Button>
              <Button variant="sky" radius={15} className="flex-1">
                Gerar PDF
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
