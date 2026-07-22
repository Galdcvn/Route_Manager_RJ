import type { SelectedAttraction } from '../types/attraction'
import type { TravelTime } from './routeCalculator'

export function shareWhatsApp(
  attractions: SelectedAttraction[],
  travelTimes: TravelTime[]
): void {
  const driving = travelTimes.find((t) => t.mode === 'DRIVING')

  const lines: string[] = []
  lines.push('*Minha rota pelo Rio de Janeiro*')
  lines.push('')
  attractions.forEach((a, i) => {
    lines.push(`${i + 1}. *${a.nome}*${a.bairro ? ` - ${a.bairro}` : ''}`)
  })
  lines.push('')
  if (driving) {
    lines.push(`Distancia: ${driving.distance}`)
    lines.push(`Tempo estimado (carro): ${driving.duration}`)
  }
  lines.push('')
  lines.push('Rota criada no Route Manager RJ')

  const text = encodeURIComponent(lines.join('\n'))
  window.open(`https://wa.me/?text=${text}`, '_blank')
}
