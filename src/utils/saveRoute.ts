import { supabase } from './supabase'
import i18n from '../i18n'
import type { SelectedAttraction } from '../types/attraction'
import type { TravelTime } from './routeCalculator'

interface SaveRouteParams {
  attractions: SelectedAttraction[]
  travelTimes: TravelTime[]
  totalDistanceKm: number
  totalDurationMin: number
  nome?: string
}

export async function saveRoute({
  attractions,
  travelTimes,
  totalDistanceKm,
  totalDurationMin,
  nome,
}: SaveRouteParams): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: statusData } = await supabase
    .from('status_rota')
    .select('id')
    .eq('nome', 'calculada')
    .single()

  if (!statusData) return null

  const routeNome = nome?.trim() || i18n.t('share.routeName', { count: attractions.length })

  const { data: routeData, error: routeError } = await supabase
    .from('rotas')
    .insert({
      usuario_id: user.id,
      status_id: statusData.id,
      ponto_inicio_id: attractions[0]?.id ?? null,
      nome: routeNome,
      distancia_total: totalDistanceKm,
      duracao_total: `${Math.floor(totalDurationMin)} min`,
      dados_rotas: { travelTimes },
    })
    .select('id')
    .single()

  if (routeError) return null

  if (!routeData) return null

  const rotaAtracoes = attractions.map((a) => ({
    rota_id: routeData.id,
    atracao_id: a.id,
    ordem: a.order,
  }))

  const { error: pivotError } = await supabase
    .from('rota_atracoes')
    .insert(rotaAtracoes)

  if (pivotError) {
    console.error('[saveRoute] pivot insert error:', pivotError)
    return null
  }

  return routeData.id
}

export async function updateRouteOrder(
  routeId: string,
  attractions: SelectedAttraction[]
): Promise<boolean> {
  const updates = attractions.map((a) =>
    supabase
      .from('rota_atracoes')
      .update({ ordem: a.order })
      .eq('rota_id', routeId)
      .eq('atracao_id', a.id)
  )

  const results = await Promise.all(updates)
  return results.every((r) => !r.error)
}
