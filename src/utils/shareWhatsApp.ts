import type { SelectedAttraction } from '../types/attraction'
import type { TravelTime } from './routeCalculator'
import i18n from '../i18n'

function buildShareText(
  attractions: SelectedAttraction[],
  travelTimes: TravelTime[],
  routeId?: string | null
): string {
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
  if (routeId) {
    lines.push(`${window.location.origin}/results?route=${routeId}`)
    lines.push('')
  }
  lines.push(t('share.footer'))

  return lines.join('\n')
}

export async function shareRoute(
  attractions: SelectedAttraction[],
  travelTimes: TravelTime[],
  routeId?: string | null
): Promise<void> {
  const text = buildShareText(attractions, travelTimes, routeId)

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Route Manager RJ', text })
      return
    } catch {
      // User cancelled or share failed — fall through to WhatsApp
    }
  }

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}
