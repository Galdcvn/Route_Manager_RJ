import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase'

export function ProfilePage() {
  const { user } = useAuth()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (user) {
      setNome(user.user_metadata?.full_name ?? '')
      setEmail(user.email ?? '')
    }
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({
      data: { full_name: nome },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      const { error: dbError } = await supabase
        .from('usuario')
        .update({ nome_completo: nome, atualizado_em: new Date().toISOString() })
        .eq('id', user.id)

      if (dbError) {
        setMessage({ type: 'error', text: dbError.message })
      } else {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      }
    }

    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Meu Perfil</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie suas informações pessoais.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-xl font-bold text-white">
              {nome.charAt(0)?.toUpperCase() || email.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-navy">{nome || 'Usuário'}</p>
              <p className="text-sm text-slate-400">{email}</p>
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Formulário */}
          <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-sky focus:ring-2 focus:ring-sky/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-400"
              />
              <p className="mt-1 text-xs text-slate-400">O email não pode ser alterado.</p>
            </div>

            {message && (
              <p className={`rounded-lg p-3 text-xs ${
                message.type === 'success'
                  ? 'bg-lime/10 text-lime'
                  : 'bg-red-50 text-red-600'
              }`}>
                {message.text}
              </p>
            )}

            <div className="flex justify-end">
              <Button variant="sky" radius={15} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
