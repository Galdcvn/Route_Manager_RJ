import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { AuthModal } from '../components/AuthModal'
import { useState } from 'react'

export function HomePage() {
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl">
              Planeje sua rota pelos pontos turísticos do Rio de Janeiro
            </h1>

            <p className="mt-4 text-base text-slate-500 sm:text-lg">
              Escolha as atrações que deseja visitar e descubra a melhor rota para conhecer a cidade maravilhosa.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              {user ? (
                <Link to="/app">
                  <Button variant="sky" radius={15}>
                    Planejar Rota
                  </Button>
                </Link>
              ) : (
                <Button variant="sky" radius={15} onClick={() => setAuthOpen(true)}>
                  Começar agora
                </Button>
              )}
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <img
              src="/src/assets/Mapa_RJ.svg"
              alt="Mapa do Rio de Janeiro"
              className="h-64 w-auto sm:h-80 lg:h-96"
            />
          </div>
        </section>
      </main>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
