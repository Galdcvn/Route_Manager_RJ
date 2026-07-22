import type { SelectedAttraction } from '../types/attraction'
import { haversineKm } from './distance'
import i18n from '../i18n'

export interface TravelTime {
  mode: 'DRIVING' | 'WALKING' | 'BICYCLE'
  label: string
  distance: string
  duration: string
}

function getTravelLabels() {
  return {
    DRIVING: i18n.t('route.driving'),
    WALKING: i18n.t('route.walking'),
    BICYCLE: i18n.t('route.bicycle'),
  }
}

interface OSRMRouteResponse {
  routes: {
    geometry: string
    legs: {
      summary: { distance: number; duration: number }
    }[]
    distance: number
    duration: number
  }[]
}

function decodePolyline6(encoded: string): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let b: number
    let shift = 0
    let result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = result & 1 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlng = result & 1 ? ~(result >> 1) : result >> 1
    lng += dlng

    points.push({ lat: lat / 1e6, lng: lng / 1e6 })
  }

  return points
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function optimizeOrder(attractions: SelectedAttraction[]): SelectedAttraction[] {
  if (attractions.length <= 2) return attractions

  const main = attractions[0]
  const remaining = attractions.slice(1)
  const optimized: SelectedAttraction[] = [main]
  let current = main

  while (remaining.length > 0) {
    let nearestIdx = 0
    let nearestDist = Infinity

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineKm(
        current.localizacao.lat,
        current.localizacao.lng,
        remaining[i].localizacao.lat,
        remaining[i].localizacao.lng
      )
      if (dist < nearestDist) {
        nearestDist = dist
        nearestIdx = i
      }
    }

    const nearest = remaining.splice(nearestIdx, 1)[0]
    optimized.push(nearest)
    current = nearest
  }

  return optimized.map((a, i) => ({ ...a, order: i + 1 }))
}

async function fetchOSRMRoute(
  coordinates: string,
  proxyPath: string,
  osrmProfile: string
): Promise<OSRMRouteResponse> {
  const url = `/api/osrm/${proxyPath}/route/v1/${osrmProfile}/${coordinates}?overview=full&geometries=polyline6&steps=false`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(url, { signal: controller.signal })

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error(`OSRM ${proxyPath}: ${data.code ?? 'no code'} - ${data.message ?? 'no routes'}`)
    }

    return data
  } finally {
    clearTimeout(timeout)
  }
}

export type RouteResult = {
  travelTimes: TravelTime[]
  polylinePath: { lat: number; lng: number }[]
  totalDistanceKm: number
  totalDurationMin: number
  optimizedOrder: SelectedAttraction[]
}

export async function calculateRoute(
  attractions: SelectedAttraction[]
): Promise<RouteResult[]> {
  const validAttractions = attractions
    .filter((a) => a.localizacao.lat !== 0 || a.localizacao.lng !== 0)

  if (validAttractions.length < 2) return []

  const ordered = optimizeOrder(validAttractions)
  const coordinates = ordered.map((a) => `${a.localizacao.lng},${a.localizacao.lat}`).join(';')

  const labels = getTravelLabels()
  const MODE_CONFIG: { mode: 'DRIVING' | 'WALKING' | 'BICYCLE'; label: string; proxyPath: string; osrmProfile: string }[] = [
    { mode: 'DRIVING', label: labels.DRIVING, proxyPath: 'driving', osrmProfile: 'driving' },
    { mode: 'WALKING', label: labels.WALKING, proxyPath: 'foot', osrmProfile: 'foot' },
    { mode: 'BICYCLE', label: labels.BICYCLE, proxyPath: 'cycling', osrmProfile: 'cycling' },
  ]

  const settled = await Promise.allSettled(
    MODE_CONFIG.map(async ({ mode, label, proxyPath, osrmProfile }) => {
      const data = await fetchOSRMRoute(coordinates, proxyPath, osrmProfile)
      const route = data.routes[0]
      const polylinePath = route?.geometry ? decodePolyline6(route.geometry) : []
      const totalDistanceKm = (route?.distance ?? 0) / 1000
      const totalDurationMin = (route?.duration ?? 0) / 60
      return {
        travelTimes: [{ mode, label, distance: `${totalDistanceKm.toFixed(1)} km`, duration: formatDuration(totalDurationMin) }],
        polylinePath,
        totalDistanceKm,
        totalDurationMin,
        optimizedOrder: ordered,
      }
    })
  )

  return settled
    .filter((r): r is PromiseFulfilledResult<RouteResult> => r.status === 'fulfilled')
    .map((r) => r.value)
}
