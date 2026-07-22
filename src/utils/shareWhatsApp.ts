import type { SelectedAttraction } from '../types/attraction'
import type { TravelTime } from './routeCalculator'
import i18n from '../i18n'

export function shareWhatsApp(
  attractions: SelectedAttraction[],
  travelTimes: TravelTime[]
): void {
  const t = i18n.t.bind(i18n)
  const driving = travelTimes.find((tt) => tt.mode === 'DRIVING')

  const lines: string[] = []
  lines.push(t('share.header'))
  lines.push('')
  attractions.forEach((a, i) => {
    lines.push(`${i + 1}. *${a.nome}*${a.bairro ? ` - ${a.bairro}` : ''}`)
  })
  lines.push('')
  if (driving) {
    lines.push(t('share.distance', { distance: driving.distance }))
    lines.push(t('share.duration', { duration: driving.duration }))
  }
  lines.push('')
  lines.push(t('share.footer'))

  const text = encodeURIComponent(lines.join('\n'))
  window.open(`https://wa.me/?text=${text}`, '_blank')
}
