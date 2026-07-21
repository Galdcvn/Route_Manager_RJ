import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { AttractionCard } from '../components/AttractionCard'
import { Button } from '../components/Button'

const steps = ['Main Attraction', 'Next Attractions', 'Results']

const attractions = [
  { id: 1, name: 'Cristo Redentor' },
  { id: 2, name: 'Pão de Açúcar' },
  { id: 3, name: 'Copacabana' },
  { id: 4, name: 'Maracanã' },
  { id: 5, name: 'Sugarloaf' },
]

export function AppPage() {
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
          <p className="mt-1 text-sm text-slate-500">Selecione o ponto de interesse para iniciar sua rota.</p>
        </div>

        {/* Cards de atrações */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-4 sm:mb-10 sm:gap-5 sm:pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {attractions.map((attraction, i) => (
            <AttractionCard
              key={attraction.id}
              name={attraction.name}
              selected={i === 0}
            />
          ))}
        </div>

        {/* Botão next */}
        <div className="flex justify-end">
          <Link to="/results">
            <Button variant="pink" radius={15}>
              Next
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
