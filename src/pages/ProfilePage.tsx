import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../utils/supabase'

export function ProfilePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { toast } = useToast()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
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
      toast({ type: 'error', message: t('profile.avatarError') })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ type: 'error', message: t('profile.avatarSizeError') })
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
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

    let finalAvatarUrl = avatarUrl

    if (avatarFile) {
      const uploaded = await uploadAvatar()
      if (uploaded) {
        finalAvatarUrl = uploaded
      } else {
        toast({ type: 'error', message: t('profile.avatarUploadError') })
        setSaving(false)
        return
      }
    }

    const { error } = await supabase.auth.updateUser({
      data: { full_name: nome, avatar_url: finalAvatarUrl },
    })

    if (error) {
      toast({ type: 'error', message: error.message })
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
        toast({ type: 'error', message: dbError.message })
      } else {
        setAvatarUrl(finalAvatarUrl)
        setAvatarFile(null)
        setAvatarPreview(null)
        toast({ type: 'success', message: t('profile.profileUpdated') })
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
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">{t('profile.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('profile.subtitle')}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-navy"
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={t('profile.avatarAlt')}
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
              <p className="text-lg font-semibold text-navy">{nome || t('common.user')}</p>
              <p className="text-sm text-slate-400">{email}</p>
              <p className="mt-1 text-xs text-slate-400">{t('profile.avatarHint')}</p>
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">{t('profile.fullNameLabel')}</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={t('profile.namePlaceholder')}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-sky focus:ring-2 focus:ring-sky/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">{t('profile.emailLabel')}</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-400"
              />
              <p className="mt-1 text-xs text-slate-400">{t('auth.emailCantChange')}</p>
            </div>

            <div className="flex justify-end">
              <Button variant="sky" radius={15} disabled={saving}>
                {saving ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
