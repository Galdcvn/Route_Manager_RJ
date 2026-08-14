import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../utils/supabase'
import { parseWKBHex } from '../utils/parseWKB'
import { getFavoriteIds, toggleFavoriteAttraction } from '../utils/favoriteAttraction'
import { useAuth } from '../contexts/AuthContext'
import type { Attraction } from '../types/attraction'
import type { AtracaoRow } from '../types/supabase'
import i18n from '../i18n'

const CACHE_KEY = 'attractions_cache'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface UseAttractionsResult {
  attractions: Attraction[]
  loading: boolean
  error: string | null
  favoriteIds: Set<string>
  toggleFavorite: (attractionId: string) => void
}

export function useAttractions(): UseAttractionsResult {
  const { user } = useAuth()
  const [rawData, setRawData] = useState<AtracaoRow[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return []
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp > CACHE_TTL) return []
      return data
    } catch {
      return []
    }
  })
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
            imagens_atracao ( ordem, imagens ( url ) ),
            contato_atracao ( tipo, valor )
          `)
          .order('nome')

        if (dbError) throw dbError
        if (!cancelled) {
          setRawData(data ?? [])
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: data ?? [], timestamp: Date.now() }))
        }

        if (user && !cancelled) {
          const favs = await getFavoriteIds(user.id)
          if (!cancelled) setFavoriteIds(favs)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : i18n.t('attractions.fetchError')
        if (!cancelled) setError(message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [user])

  const toggleFavorite = useCallback(async (attractionId: string) => {
    const wasFavorited = favoriteIds.has(attractionId)

    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (wasFavorited) {
        next.delete(attractionId)
      } else {
        next.add(attractionId)
      }
      return next
    })

    if (!user) return

    try {
      await toggleFavoriteAttraction(user.id, attractionId)
    } catch {
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (wasFavorited) {
          next.add(attractionId)
        } else {
          next.delete(attractionId)
        }
        return next
      })
    }
  }, [user, favoriteIds])

  const attractions = useMemo(() => {
    const lang = i18n.language?.split('-')[0] || 'pt'

    const mapped = rawData.map((row) => {
      const getIdiomaCodigo = (idiomas: any): string | undefined =>
        Array.isArray(idiomas) ? idiomas[0]?.codigo : idiomas?.codigo

      const info = row.informacao_atracao?.find(
        (i) => getIdiomaCodigo(i.idiomas) === lang
      ) ?? row.informacao_atracao?.find(
        (i) => getIdiomaCodigo(i.idiomas) === 'pt'
      )

      const imagem = row.imagens_atracao
        ?.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))[0]
        ?.imagens?.[0]?.url

      return {
        id: row.id,
        nome: row.nome,
        categoria: row.categoria_atracao?.[0]?.nome ?? 'outro',
        descricao: info?.descricao,
        horarios: info?.horarios,
        rua: row.endereco_atracao?.[0]?.rua,
        bairro: row.endereco_atracao?.[0]?.bairro,
        cidade: row.endereco_atracao?.[0]?.cidade,
        imagem_url: imagem,
        contatos: row.contato_atracao ?? [],
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
