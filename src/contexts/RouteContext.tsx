import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Attraction, SelectedAttraction } from '../types/attraction'

interface RouteContextValue {
  selected: SelectedAttraction[]
  toggleAttraction: (attraction: Attraction) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
  mainAttraction: Attraction | null
  setMainAttraction: (attraction: Attraction | null) => void
}

const RouteContext = createContext<RouteContextValue | null>(null)

export function RouteProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedAttraction[]>([])
  const [mainAttraction, setMainAttraction] = useState<Attraction | null>(null)

  const isSelected = useCallback(
    (id: string) => selected.some((s) => s.id === id),
    [selected]
  )

  const toggleAttraction = useCallback((attraction: Attraction) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.id === attraction.id)
      if (exists) {
        return prev.filter((s) => s.id !== attraction.id)
      }
      return [...prev, { ...attraction, order: prev.length + 1 }]
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelected([])
    setMainAttraction(null)
  }, [])

  return (
    <RouteContext.Provider
      value={{
        selected,
        toggleAttraction,
        clearSelection,
        isSelected,
        mainAttraction,
        setMainAttraction,
      }}
    >
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider')
  }
  return context
}
