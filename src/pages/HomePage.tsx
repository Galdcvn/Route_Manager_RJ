import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Button } from '../components/Button'

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h1>

            <div className="mt-6 sm:mt-8">
              <Link to="/app">
                <Button variant="sky" radius={15}>
                  Get Started
                </Button>
              </Link>
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
    </div>
  )
}
