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

// ─── Distance matrix (cached per calculation) ───────────────────────────

function buildDistanceMatrix(attractions: SelectedAttraction[]): number[][] {
  const n = attractions.length
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = haversineKm(
        attractions[i].localizacao.lat, attractions[i].localizacao.lng,
        attractions[j].localizacao.lat, attractions[j].localizacao.lng
      )
      matrix[i][j] = d
      matrix[j][i] = d
    }
  }
  return matrix
}

// ─── Held-Karp with fixed starting point ────────────────────────────────

interface HeldKarpResult {
  order: number[]
  distance: number
}

function heldKarpFixedStart(
  matrix: number[][],
  startIndex: number
): HeldKarpResult {
  const n = matrix.length
  if (n <= 1) return { order: [startIndex], distance: 0 }
  if (n === 2) {
    const other = startIndex === 0 ? 1 : 0
    return {
      order: [startIndex, other],
      distance: matrix[startIndex][other],
    }
  }

  const SIZE = 1 << n
  const INF = Infinity

  const dp: number[][] = Array.from({ length: SIZE }, () => Array(n).fill(INF))
  const parent: number[][] = Array.from({ length: SIZE }, () => Array(n).fill(-1))

  dp[1 << startIndex][startIndex] = 0

  for (let mask = 1; mask < SIZE; mask++) {
    for (let u = 0; u < n; u++) {
      if (dp[mask][u] === INF) continue
      if (!(mask & (1 << u))) continue

      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue

        const nextMask = mask | (1 << v)
        const newDist = dp[mask][u] + matrix[u][v]

        if (newDist < dp[nextMask][v]) {
          dp[nextMask][v] = newDist
          parent[nextMask][v] = u
        }
      }
    }
  }

  const fullMask = SIZE - 1
  let lastIdx = -1
  let bestDist = INF

  for (let u = 0; u < n; u++) {
    if (dp[fullMask][u] < bestDist) {
      bestDist = dp[fullMask][u]
      lastIdx = u
    }
  }

  // Reconstruct path
  const path: number[] = []
  let mask = fullMask
  let current = lastIdx

  while (current !== -1) {
    path.unshift(current)
    const prev = parent[mask][current]
    mask ^= (1 << current)
    current = prev
  }

  return { order: path, distance: bestDist }
}

// ─── Global optimum: best starting point ────────────────────────────────

interface GlobalOptimumResult {
  optimizedOrder: SelectedAttraction[]
  startIndex: number
  totalDistanceKm: number
}

function findGlobalOptimum(
  attractions: SelectedAttraction[],
  matrix: number[][]
): GlobalOptimumResult {
  let bestDistance = Infinity
  let bestOrder: number[] = []
  let bestStart = 0

  for (let i = 0; i < attractions.length; i++) {
    const result = heldKarpFixedStart(matrix, i)
    if (result.distance < bestDistance) {
      bestDistance = result.distance
      bestOrder = result.order
      bestStart = i
    }
  }

  return {
    optimizedOrder: bestOrder.map((idx, pos) => ({
      ...attractions[idx],
      order: pos + 1,
    })),
    startIndex: bestStart,
    totalDistanceKm: bestDistance,
  }
}

// ─── User's route with Held-Karp (fixed starting point) ─────────────────

function optimizeOrderHeldKarp(
  attractions: SelectedAttraction[],
  matrix: number[][]
): SelectedAttraction[] {
  const startIndex = 0 // main attraction is always first
  const result = heldKarpFixedStart(matrix, startIndex)
  return result.order.map((idx, pos) => ({
    ...attractions[idx],
    order: pos + 1,
  }))
}

// ─── OSRM fetch ─────────────────────────────────────────────────────────

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

// ─── Build RouteResult from OSRM response ───────────────────────────────

function buildRouteResult(
  data: OSRMRouteResponse,
  mode: 'DRIVING' | 'WALKING' | 'BICYCLE',
  label: string,
  ordered: SelectedAttraction[]
): {
  travelTimes: TravelTime[]
  polylinePath: { lat: number; lng: number }[]
  totalDistanceKm: number
  totalDurationMin: number
  optimizedOrder: SelectedAttraction[]
} {
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
}

// ─── Public types ───────────────────────────────────────────────────────

export type RouteResult = {
  travelTimes: TravelTime[]
  polylinePath: { lat: number; lng: number }[]
  totalDistanceKm: number
  totalDurationMin: number
  optimizedOrder: SelectedAttraction[]
}

export type CalculateRouteResult = {
  userRoute: RouteResult[]
  optimalRoute: RouteResult[] | null
  optimalDifferent: boolean
}

// ─── Main function ──────────────────────────────────────────────────────

const OPTIMAL_DIFF_THRESHOLD_KM = 0.5

export async function calculateRoute(
  attractions: SelectedAttraction[]
): Promise<CalculateRouteResult> {
  const validAttractions = attractions
    .filter((a) => a.localizacao.lat !== 0 || a.localizacao.lng !== 0)

  if (validAttractions.length < 2) {
    return { userRoute: [], optimalRoute: null, optimalDifferent: false }
  }

  const matrix = buildDistanceMatrix(validAttractions)
  const labels = getTravelLabels()

  const MODE_CONFIG: { mode: 'DRIVING' | 'WALKING' | 'BICYCLE'; label: string; proxyPath: string; osrmProfile: string }[] = [
    { mode: 'DRIVING', label: labels.DRIVING, proxyPath: 'driving', osrmProfile: 'driving' },
    { mode: 'WALKING', label: labels.WALKING, proxyPath: 'foot', osrmProfile: 'foot' },
    { mode: 'BICYCLE', label: labels.BICYCLE, proxyPath: 'cycling', osrmProfile: 'cycling' },
  ]

  // 1. Optimize user's order (Held-Karp with user's main as start)
  const userOrdered = optimizeOrderHeldKarp(validAttractions, matrix)
  const userCoords = userOrdered.map((a) => `${a.localizacao.lng},${a.localizacao.lat}`).join(';')

  // 2. Find global optimum
  const globalOpt = findGlobalOptimum(validAttractions, matrix)
  const optCoords = globalOpt.optimizedOrder.map((a) => `${a.localizacao.lng},${a.localizacao.lat}`).join(';')

  // 3. Check if optimal is meaningfully different from user's route
  const userHeldKarp = heldKarpFixedStart(matrix, 0)
  const optimalDifferent =
    globalOpt.totalDistanceKm > 0 &&
    userHeldKarp.distance - globalOpt.totalDistanceKm > OPTIMAL_DIFF_THRESHOLD_KM &&
    globalOpt.startIndex !== 0

  // 4. Fetch OSRM for user route + optimal route (parallel)
  const osrmTasks: Promise<OSRMRouteResponse>[] = []
  const taskMeta: { mode: 'DRIVING' | 'WALKING' | 'BICYCLE'; label: string; coords: string; isOptimal: boolean }[] = []

  for (const cfg of MODE_CONFIG) {
    osrmTasks.push(fetchOSRMRoute(userCoords, cfg.proxyPath, cfg.osrmProfile))
    taskMeta.push({ mode: cfg.mode, label: cfg.label, coords: userCoords, isOptimal: false })

    if (optimalDifferent) {
      osrmTasks.push(fetchOSRMRoute(optCoords, cfg.proxyPath, cfg.osrmProfile))
      taskMeta.push({ mode: cfg.mode, label: cfg.label, coords: optCoords, isOptimal: true })
    }
  }

  const settled = await Promise.allSettled(osrmTasks)

  const userResults: RouteResult[] = []
  const optResults: RouteResult[] = []

  settled.forEach((result, i) => {
    if (result.status !== 'fulfilled') return
    const meta = taskMeta[i]
    const routeResult = buildRouteResult(result.value, meta.mode, meta.label, meta.isOptimal ? globalOpt.optimizedOrder : userOrdered)

    if (meta.isOptimal) {
      optResults.push(routeResult)
    } else {
      userResults.push(routeResult)
    }
  })

  return {
    userRoute: userResults,
    optimalRoute: optimalDifferent && optResults.length > 0 ? optResults : null,
    optimalDifferent: optimalDifferent && optResults.length > 0,
  }
}
