import type { SelectedAttraction } from '../types/attraction'

type TravelMode = 'driving' | 'walking' | 'bicycling'

function buildGoogleMapsUrl(
  attractions: SelectedAttraction[],
  travelMode: TravelMode
): string {
  if (attractions.length === 0) return ''

  const origin = `${attractions[0].localizacao.lat},${attractions[0].localizacao.lng}`
  const destination = `${attractions[attractions.length - 1].localizacao.lat},${attractions[attractions.length - 1].localizacao.lng}`

  const waypoints = attractions
    .slice(1, -1)
    .map((a) => `${a.localizacao.lat},${a.localizacao.lng}`)
    .join('|')

  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: travelMode,
  })

  if (waypoints) {
    params.set('waypoints', waypoints)
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`
}

function buildWazeUrl(attraction: SelectedAttraction): string {
  return `https://waze.com/ul?ll=${attraction.localizacao.lat},${attraction.localizacao.lng}&navigate=yes`
}

async function openExternal(url: string, title?: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title: title ?? 'Route Manager RJ', url })
      return
    } catch {
      // User cancelled or share failed — fall through to window.open
    }
  }
  window.open(url, '_blank')
}

export function openGoogleMaps(
  attractions: SelectedAttraction[],
  travelMode: TravelMode = 'driving'
) {
  const url = buildGoogleMapsUrl(attractions, travelMode)
  if (url) openExternal(url, 'Route Manager RJ')
}

export function openWaze(attraction: SelectedAttraction) {
  openExternal(buildWazeUrl(attraction), 'Route Manager RJ')
}
