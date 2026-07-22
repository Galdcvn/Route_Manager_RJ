import { useCallback } from 'react'
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api'
import { useGoogleMapsLoaded } from '../hooks/useGoogleMapsLoaded'
import type { SelectedAttraction } from '../types/attraction'

const RJ_CENTER = { lat: -22.9519, lng: -43.1822 }

interface RouteMapProps {
  attractions: SelectedAttraction[]
  directionResult?: google.maps.DirectionsResult | null
}

const containerStyle = { width: '100%', height: '100%', minHeight: '400px' }

export function RouteMap({ attractions, directionResult }: RouteMapProps) {
  const { isLoaded, loadError } = useGoogleMapsLoaded()

  const center = (() => {
    if (attractions.length === 0) return RJ_CENTER
    const lat = attractions.reduce((sum, a) => sum + a.localizacao.lat, 0) / attractions.length
    const lng = attractions.reduce((sum, a) => sum + a.localizacao.lng, 0) / attractions.length
    return { lat, lng }
  })()

  const markers = attractions.map((a) => ({
    position: { lat: a.localizacao.lat, lng: a.localizacao.lng },
    label: String(a.order),
    title: a.nome,
  }))

  const polylinePath = (() => {
    if (!isLoaded) return attractions.map((a) => ({ lat: a.localizacao.lat, lng: a.localizacao.lng }))
    if (directionResult) {
      const route = directionResult.routes[0]
      if (route?.overview_polyline) {
        return google.maps.geometry?.encoding.decodePath(route.overview_polyline) ?? []
      }
    }
    return attractions.map((a) => ({ lat: a.localizacao.lat, lng: a.localizacao.lng }))
  })()

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (attractions.length === 0) return
      const b = new google.maps.LatLngBounds()
      attractions.forEach((a) => b.extend({ lat: a.localizacao.lat, lng: a.localizacao.lng }))
      map.fitBounds(b, 50)
    },
    [attractions]
  )

  if (loadError) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center bg-slate-100 text-sm text-slate-500">
        Erro ao carregar o mapa.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center bg-slate-100">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-pink border-t-transparent" />
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onMapLoad}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
        ],
      }}
    >
      {markers.map((m, i) => (
        <Marker
          key={i}
          position={m.position}
          label={{
            text: m.label,
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
          title={m.title}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: '#EB6092',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />
      ))}

      {polylinePath.length > 1 && (
        <Polyline
          path={polylinePath}
          options={{
            strokeColor: '#4CA3FF',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1 }, offset: '0', repeat: '12px' }],
          }}
        />
      )}
    </GoogleMap>
  )
}
