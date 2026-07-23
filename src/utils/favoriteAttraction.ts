import { supabase } from './supabase'

export async function getFavoriteIds(userId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from('atracoes_favoritas')
    .select('atracao_id')
    .eq('usuario_id', userId)

  return new Set(data?.map((r: any) => r.atracao_id) ?? [])
}

export async function toggleFavoriteAttraction(
  userId: string,
  attractionId: string
): Promise<boolean> {
  const { data: existing } = await supabase
    .from('atracoes_favoritas')
    .select('atracao_id')
    .eq('usuario_id', userId)
    .eq('atracao_id', attractionId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('atracoes_favoritas')
      .delete()
      .eq('usuario_id', userId)
      .eq('atracao_id', attractionId)
    return false
  }

  await supabase
    .from('atracoes_favoritas')
    .insert({ usuario_id: userId, atracao_id: attractionId })
  return true
}
