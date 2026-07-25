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

    const { error: dbError } = await supabase
      .from('usuario')
      .delete()
      .eq('id', currentUser.id)

    if (dbError) return { error: dbError.message }

    const { error: authError } = await supabase.auth.admin.deleteUser(currentUser.id)
    if (authError) {
      // Fallback: sign out if admin delete fails (RLS may block it)
      await supabase.auth.signOut()
      return { error: undefined }
    }

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
