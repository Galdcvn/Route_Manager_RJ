import { useJsApiLoader } from '@react-google-maps/api'

export function useGoogleMapsLoaded() {
  return useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY ?? '',
    libraries: ['geometry'],
  })
}
