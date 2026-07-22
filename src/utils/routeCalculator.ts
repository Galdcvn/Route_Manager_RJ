import type { SelectedAttraction } from '../types/attraction'

export interface TravelTime {
  mode: 'DRIVING' | 'WALKING' | 'TRANSIT'
  label: string
  distance: string
  duration: string
}

export interface RouteCalculation {
  travelTimes: TravelTime[]
  directionResult: google.maps.DirectionsResult
  totalDistanceKm: number
  totalDurationMin: number
}

const MODE_CONFIG: { mode: 'DRIVING' | 'WALKING' | 'TRANSIT'; label: string }[] = [
  { mode: 'DRIVING', label: 'Carro' },
  { mode: 'WALKING', label: 'Andar' },
  { mode: 'TRANSIT', label: 'Transporte público' },
]

export async function calculateRoute(
  attractions: SelectedAttraction[]
): Promise<RouteCalculation[]> {
  const directionsService = new google.maps.DirectionsService()

  const ordered = [...attractions].sort((a, b) => a.order - b.order)

  const results = await Promise.all(
    MODE_CONFIG.map(async ({ mode, label }) => {
      const waypoints = ordered.slice(1, -1).map((a) => ({
        location: { lat: a.localizacao.lat, lng: a.localizacao.lng },
        stopover: true,
      }))

      const origin = { lat: ordered[0].localizacao.lat, lng: ordered[0].localizacao.lng }
      const destination = {
        lat: ordered[ordered.length - 1].localizacao.lat,
        lng: ordered[ordered.length - 1].localizacao.lng,
      }

      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode[mode],
        provideRouteAlternatives: false,
      }

      const result = await directionsService.route(request)

      let totalDistanceM = 0
      let totalDurationS = 0
      result.routes[0].legs.forEach((leg) => {
        totalDistanceM += leg.distance?.value ?? 0
        totalDurationS += leg.duration?.value ?? 0
      })

      const totalDistanceKm = totalDistanceM / 1000
      const totalDurationMin = totalDurationS / 60

      return {
        travelTimes: [
          {
            mode,
            label,
            distance: `${totalDistanceKm.toFixed(1)} km`,
            duration: formatDuration(totalDurationMin),
          },
        ],
        directionResult: result,
        totalDistanceKm,
        totalDurationMin,
      }
    })
  )

  return results
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}
