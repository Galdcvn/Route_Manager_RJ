import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import type { Attraction } from '../types/attraction'

interface UseAttractionsResult {
  attractions: Attraction[]
  loading: boolean
  error: string | null
}

export function useAttractions(): UseAttractionsResult {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAttractions() {
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
        if (cancelled) return

        const mapped: Attraction[] = (data ?? []).map((row: any) => {
          const infoPt = row.informacao_atracao?.find(
            (i: any) => i.idiomas?.codigo === 'pt'
          )

          const imagem = row.imagens_atracao
            ?.sort((a: any, b: any) => a.ordem - b.ordem)[0]
            ?.imagens?.url

          return {
            id: row.id,
            nome: row.nome,
            categoria: row.categoria_atracao?.nome ?? 'outro',
            descricao: infoPt?.descricao,
            horarios: infoPt?.horarios,
            rua: row.endereco_atracao?.rua,
            bairro: row.endereco_atracao?.bairro,
            cidade: row.endereco_atracao?.cidade,
            imagem_url: imagem,
            localizacao: {
              lat: row.localizacao?.coordinates?.[1] ?? 0,
              lng: row.localizacao?.coordinates?.[0] ?? 0,
            },
          }
        })

        setAttractions(mapped)
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Erro ao buscar atrações')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAttractions()
    return () => { cancelled = true }
  }, [])

  return { attractions, loading, error }
}
