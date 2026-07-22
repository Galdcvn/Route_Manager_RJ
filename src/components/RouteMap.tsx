import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SelectedAttraction } from '../types/attraction'

const RJ_CENTER: [number, number] = [-22.9519, -43.1822]

function createNumberIcon(number: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #EB6092;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 12px;
      font-weight: bold;
      font-family: Montserrat, sans-serif;
    ">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function FitBounds({ attractions }: { attractions: SelectedAttraction[] }) {
  const map = useMap()

  useEffect(() => {
    if (attractions.length === 0) return
    if (attractions.length === 1) {
      map.setView([attractions[0].localizacao.lat, attractions[0].localizacao.lng], 14)
      return
    }
    const bounds = L.latLngBounds(
      attractions.map((a) => [a.localizacao.lat, a.localizacao.lng] as [number, number])
    )
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [attractions, map])

  return null
}

interface RouteMapProps {
  attractions: SelectedAttraction[]
  polylinePath?: { lat: number; lng: number }[]
}

export function RouteMap({ attractions, polylinePath }: RouteMapProps) {
  const polylinePositions: [number, number][] =
    polylinePath && polylinePath.length > 1
      ? polylinePath.map((p) => [p.lat, p.lng])
      : attractions.map((a) => [a.localizacao.lat, a.localizacao.lng])

  return (
    <MapContainer
      center={RJ_CENTER}
      zoom={12}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <FitBounds attractions={attractions} />

      {attractions.map((a, i) => (
        <Marker
          key={a.id}
          position={[a.localizacao.lat, a.localizacao.lng]}
          icon={createNumberIcon(i + 1)}
        />
      ))}

      {polylinePositions.length > 1 && (
        <Polyline
          positions={polylinePositions}
          pathOptions={{
            color: '#4CA3FF',
            weight: 3,
            opacity: 0.8,
            dashArray: '12, 8',
          }}
        />
      )}
    </MapContainer>
  )
}
