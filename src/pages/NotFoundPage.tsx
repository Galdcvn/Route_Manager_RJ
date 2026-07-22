import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Button } from '../components/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-6xl font-bold text-pink">404</p>
        <h1 className="mt-4 text-2xl font-bold text-navy">Pagina nao encontrada</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          O endereco que voce tentou acessar nao existe ou foi movido.
        </p>
        <Link to="/" className="mt-8">
          <Button variant="pink" radius={15}>
            Voltar ao inicio
          </Button>
        </Link>
      </main>
    </div>
  )
}
