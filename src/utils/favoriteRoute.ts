import { supabase } from './supabase'

export async function isFavorited(routeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('rotas_favoritas')
    .select('usuario_id')
    .eq('usuario_id', user.id)
    .eq('rota_id', routeId)
    .maybeSingle()

  return !!data
}

export async function toggleFavorite(routeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: existing } = await supabase
    .from('rotas_favoritas')
    .select('usuario_id')
    .eq('usuario_id', user.id)
    .eq('rota_id', routeId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('rotas_favoritas')
      .delete()
      .eq('usuario_id', user.id)
      .eq('rota_id', routeId)
    return false
  }

  await supabase
    .from('rotas_favoritas')
    .insert({ usuario_id: user.id, rota_id: routeId })
  return true
}
