import { Header } from '../components/Header'
import { Button } from '../components/Button'

const timelineStops = [
  { distance: '100m', time: '50min' },
  { distance: '200m', time: '5min' },
  { distance: '500m', time: '15min' },
  { distance: '1km', time: '10min' },
]

const transportTimes = [
  { label: 'Carro', time: '30min', color: 'bg-sky' },
  { label: 'Andar', time: '2h 10min', color: 'bg-lime' },
  { label: 'Infraestrutura', time: '45min', color: 'bg-mustard' },
  { label: 'C. pé', time: '1h 30min', color: 'bg-orange' },
  { label: 'Transporte público', time: '55min', color: 'bg-pink' },
]

export function ResultsPage() {
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

              {/* Pins */}
              <svg className="absolute top-1/4 left-1/3 h-6 w-6" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#EF4444" />
                <circle cx="12" cy="11" r="4" fill="white" />
              </svg>
              <svg className="absolute top-1/2 left-1/2 h-6 w-6" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#EF4444" />
                <circle cx="12" cy="11" r="4" fill="white" />
              </svg>
              <svg className="absolute bottom-1/3 left-1/4 h-6 w-6" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#EF4444" />
                <circle cx="12" cy="11" r="4" fill="white" />
              </svg>

              {/* Rota */}
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
              <h1 className="text-2xl font-bold text-navy sm:text-3xl">Tempo total estimado: 30min</h1>
            </div>

            {/* Timeline */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex min-w-[300px] items-center justify-between">
                {timelineStops.map((stop, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="flex h-4 w-4 rotate-45 bg-red-500" />
                    <p className="text-xs font-semibold text-navy">{stop.distance}</p>
                    <p className="text-[10px] text-slate-400">{stop.time}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-0.5 w-full bg-red-200" />
            </div>

            {/* Tempos por modalidade */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {transportTimes.map((t) => (
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
