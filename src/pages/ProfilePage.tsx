import { useState, useEffect, useRef } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase'

export function ProfilePage() {
  const { user } = useAuth()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setNome(user.user_metadata?.full_name ?? '')
      setEmail(user.email ?? '')
      setAvatarUrl(user.user_metadata?.avatar_url ?? null)
    }
  }, [user])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Selecione um arquivo de imagem.' })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter no máximo 2MB.' })
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setMessage(null)
  }

  async function uploadAvatar(): Promise<string | null> {
    if (!avatarFile || !user) return avatarUrl

    const ext = avatarFile.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('Avatars')
      .upload(path, avatarFile, { upsert: true })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    const { data } = supabase.storage.from('Avatars').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage(null)

    let finalAvatarUrl = avatarUrl

    if (avatarFile) {
      const uploaded = await uploadAvatar()
      if (uploaded) {
        finalAvatarUrl = uploaded
      } else {
        setMessage({ type: 'error', text: 'Erro ao enviar a imagem. Tente novamente.' })
        setSaving(false)
        return
      }
    }

    const { error } = await supabase.auth.updateUser({
      data: { full_name: nome, avatar_url: finalAvatarUrl },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      const { error: dbError } = await supabase
        .from('usuario')
        .update({
          nome_completo: nome,
          avatar_url: finalAvatarUrl,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (dbError) {
        setMessage({ type: 'error', text: dbError.message })
      } else {
        setAvatarUrl(finalAvatarUrl)
        setAvatarFile(null)
        setAvatarPreview(null)
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      }
    }

    setSaving(false)
  }

  const displayImage = avatarPreview || avatarUrl

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Meu Perfil</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie suas informações pessoais.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          {/* Avatar com upload */}
          <div className="mb-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-navy"
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-xl font-bold text-white">
                  {nome.charAt(0)?.toUpperCase() || email.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </button>
            <div>
              <p className="text-lg font-semibold text-navy">{nome || 'Usuário'}</p>
              <p className="text-sm text-slate-400">{email}</p>
              <p className="mt-1 text-xs text-slate-400">Clique na foto para alterar (máx. 2MB)</p>
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
