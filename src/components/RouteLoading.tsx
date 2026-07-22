import { useState, useEffect } from 'react'

const steps = [
  'Encontrando melhor rota...',
  'Calculando distâncias...',
  'Estimando tempos...',
  'Preparando mapa...',
]

export function RouteLoading() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-pink border-t-transparent" />
          <div className="absolute inset-2 animate-spin rounded-full border-4 border-sky border-b-transparent" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>

        {/* Texto animado */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-navy">Calculando melhor rota</h2>
          <p className="mt-1 text-sm text-slate-400 transition-all duration-300">
            {steps[currentStep]}
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink to-sky transition-all duration-700"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
