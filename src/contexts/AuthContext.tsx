import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, nome: string) => Promise<{ error?: string }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  deleteAccount: () => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }

  async function signUp(email: string, password: string, nome: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: nome } },
    })
    return { error: error?.message }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    return { error: error?.message }
  }

  async function deleteAccount() {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return { error: 'Not authenticated' }

    // 1. Get all user's route IDs
    const { data: userRoutes } = await supabase
      .from('rotas')
      .select('id')
      .eq('usuario_id', currentUser.id)

    const routeIds = (userRoutes ?? []).map((r) => r.id)

    // 2. Delete favorites (they reference both usuario and rotas)
    await supabase.from('rotas_favoritas').delete().eq('usuario_id', currentUser.id)
    await supabase.from('atracoes_favoritas').delete().eq('usuario_id', currentUser.id)

    // 3. Delete route compositions (rota_atracoes cascades on rotas delete, but explicit is safer)
    if (routeIds.length > 0) {
      await supabase.from('rota_atracoes').delete().in('rota_id', routeIds)
      await supabase.from('rotas').delete().in('id', routeIds)
    }

    // 4. Delete usuario (now safe — no rotas reference it)
    const { error: dbError } = await supabase
      .from('usuario')
      .delete()
      .eq('id', currentUser.id)

    if (dbError) return { error: dbError.message }

    // 5. Sign out (auth user remains in Supabase but all profile data is gone)
    await supabase.auth.signOut()
    return { error: undefined }
  }

  return (
    <AuthContext.Provider       value={{ user, session, loading, signIn, signUp, signInWithGoogle, signOut, resetPassword, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
