import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Attraction, SelectedAttraction } from '../types/attraction'
import { supabase } from '../utils/supabase'
import { parseWKBHex } from '../utils/parseWKB'
import i18n from '../i18n'

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
  loadSavedRoute: (routeId: string) => Promise<boolean>
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

  const loadSavedRoute = useCallback(async (routeId: string): Promise<boolean> => {
    const { data: route, error: routeError } = await supabase
      .from('rotas')
      .select('ponto_inicio_id')
      .eq('id', routeId)
      .single()

    if (routeError || !route) return false

    const lang = i18n.language.split('-')[0] || 'pt'

    const { data: pivot, error: pivotError } = await supabase
      .from('rota_atracoes')
      .select('atracao_id, ordem')
      .eq('rota_id', routeId)
      .order('ordem')

    if (pivotError || !pivot) return false

    const attractionIds = pivot.map((r: any) => r.atracao_id)

    const { data: atracoes, error: atracoesError } = await supabase
      .from('atracoes')
      .select(`
        id,
        nome,
        localizacao,
        categoria_atracao ( nome ),
        endereco_atracao ( rua, bairro, cidade ),
        informacao_atracao ( descricao, horarios, idiomas ( codigo ) ),
        imagens_atracao ( ordem, imagens ( url ) )
      `)
      .in('id', attractionIds)

    if (atracoesError || !atracoes) return false

    const mapped: SelectedAttraction[] = atracoes.map((row: any) => {
      const info = row.informacao_atracao?.find(
        (i: any) => i.idiomas?.codigo === lang
      ) ?? row.informacao_atracao?.find(
        (i: any) => i.idiomas?.codigo === 'pt'
      )

      const imagem = row.imagens_atracao
        ?.sort((a: any, b: any) => a.ordem - b.ordem)[0]
        ?.imagens?.url

      const pivotRow = pivot.find((p: any) => p.atracao_id === row.id)

      return {
        id: row.id,
        nome: row.nome,
        categoria: row.categoria_atracao?.nome ?? 'outro',
        descricao: info?.descricao,
        horarios: info?.horarios,
        rua: row.endereco_atracao?.rua,
        bairro: row.endereco_atracao?.bairro,
        cidade: row.endereco_atracao?.cidade,
        imagem_url: imagem,
        localizacao: parseWKBHex(row.localizacao),
        order: pivotRow?.ordem ?? 0,
      }
    })

    mapped.sort((a, b) => a.order - b.order)

    const main = mapped.find((a) => a.id === route.ponto_inicio_id) ?? mapped[0] ?? null

    setStep('select-main')
    setSelected(mapped)
    setMainAttraction(main)
    setSavedRouteId(routeId)

    return true
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
        loadSavedRoute,
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
