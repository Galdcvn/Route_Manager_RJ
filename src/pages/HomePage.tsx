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
            <div className="relative">
              <img
                src="/src/assets/Mapa_RJ.svg"
                alt="Mapa do Rio de Janeiro"
                className="h-64 w-auto sm:h-80 lg:h-96"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg className="h-16 w-16 sm:h-20 sm:w-20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
                    fill="#EB6092"
                  />
                  <circle cx="12" cy="11" r="4" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
