import { supabase } from './supabase'
import type { SelectedAttraction } from '../types/attraction'
import type { TravelTime } from './routeCalculator'

interface SaveRouteParams {
  attractions: SelectedAttraction[]
  travelTimes: TravelTime[]
  totalDistanceKm: number
  totalDurationMin: number
}

export async function saveRoute({
  attractions,
  travelTimes,
  totalDistanceKm,
  totalDurationMin,
}: SaveRouteParams): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: statusData } = await supabase
    .from('status_rota')
    .select('id')
    .eq('nome', 'calculada')
    .single()

  if (!statusData) return null

  const nome = `Rota ${attractions.length} paradas - ${new Date().toLocaleDateString('pt-BR')}`

  const { data: routeData, error: routeError } = await supabase
    .from('rotas')
    .insert({
      usuario_id: user.id,
      status_id: statusData.id,
      ponto_inicio_id: attractions[0]?.id ?? null,
      nome,
      distancia_total: totalDistanceKm,
      duracao_total: `${Math.floor(totalDurationMin)} minutes`,
      dados_rotas: { travelTimes },
    })
    .select('id')
    .single()

  if (routeError || !routeData) return null

  const rotaAtracoes = attractions.map((a) => ({
    rota_id: routeData.id,
    atracao_id: a.id,
    ordem: a.order,
  }))

  const { error: pivotError } = await supabase
    .from('rota_atracoes')
    .insert(rotaAtracoes)

  if (pivotError) return null

  return routeData.id
}
