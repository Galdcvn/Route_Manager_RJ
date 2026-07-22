import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Attraction, SelectedAttraction } from '../types/attraction'

export type RouteStep = 'select-main' | 'select-nearby'

interface RouteContextValue {
  step: RouteStep
  setStep: (step: RouteStep) => void
  selected: SelectedAttraction[]
  toggleAttraction: (attraction: Attraction) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
  mainAttraction: Attraction | null
  setMainAttraction: (attraction: Attraction | null) => void
  resetFlow: () => void
  savedRouteId: string | null
  setSavedRouteId: (id: string | null) => void
}

const RouteContext = createContext<RouteContextValue | null>(null)

export function RouteProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<RouteStep>('select-main')
  const [selected, setSelected] = useState<SelectedAttraction[]>([])
  const [mainAttraction, setMainAttraction] = useState<Attraction | null>(null)
  const [savedRouteId, setSavedRouteId] = useState<string | null>(null)

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

  const resetFlow = useCallback(() => {
    setStep('select-main')
    setSelected([])
    setMainAttraction(null)
    setSavedRouteId(null)
  }, [])

  const clearSelection = useCallback(() => {
    setSelected([])
    setMainAttraction(null)
  }, [])

  return (
    <RouteContext.Provider
      value={{
        step,
        setStep,
        selected,
        toggleAttraction,
        clearSelection,
        isSelected,
        mainAttraction,
        setMainAttraction,
        resetFlow,
        savedRouteId,
        setSavedRouteId,
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
