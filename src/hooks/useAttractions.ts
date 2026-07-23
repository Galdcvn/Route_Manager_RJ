import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../utils/supabase'
import { parseWKBHex } from '../utils/parseWKB'
import { getFavoriteIds, toggleFavoriteAttraction } from '../utils/favoriteAttraction'
import { useAuth } from '../contexts/AuthContext'
import type { Attraction } from '../types/attraction'
import i18n from '../i18n'

interface UseAttractionsResult {
  attractions: Attraction[]
  loading: boolean
  error: string | null
  favoriteIds: Set<string>
  toggleFavorite: (attractionId: string) => void
}

export function useAttractions(): UseAttractionsResult {
  const { user } = useAuth()
  const [rawData, setRawData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        const { data, error: dbError } = await supabase
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
          .order('nome')

        if (dbError) throw dbError
        if (!cancelled) setRawData(data ?? [])

        if (user && !cancelled) {
          const favs = await getFavoriteIds(user.id)
          if (!cancelled) setFavoriteIds(favs)
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? i18n.t('attractions.fetchError'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [user])

  const toggleFavorite = useCallback((attractionId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(attractionId)) {
        next.delete(attractionId)
        if (user) toggleFavoriteAttraction(user.id, attractionId)
      } else {
        next.add(attractionId)
        if (user) toggleFavoriteAttraction(user.id, attractionId)
      }
      return next
    })
  }, [user])

  const attractions = useMemo(() => {
    const lang = i18n.language.split('-')[0] || 'pt'

    const mapped = rawData.map((row: any) => {
      const info = row.informacao_atracao?.find(
        (i: any) => i.idiomas?.codigo === lang
      ) ?? row.informacao_atracao?.find(
        (i: any) => i.idiomas?.codigo === 'pt'
      )

      const imagem = row.imagens_atracao
        ?.sort((a: any, b: any) => a.ordem - b.ordem)[0]
        ?.imagens?.url

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
      }
    })

    return mapped.sort((a, b) => {
      const aFav = favoriteIds.has(a.id)
      const bFav = favoriteIds.has(b.id)
      if (aFav !== bFav) return aFav ? -1 : 1
      return a.nome.localeCompare(b.nome)
    })
  }, [rawData, i18n.language, favoriteIds])

  return { attractions, loading, error, favoriteIds, toggleFavorite }
}
