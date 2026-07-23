import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../utils/supabase'
import { parseWKBHex } from '../utils/parseWKB'
import type { Attraction } from '../types/attraction'
import i18n from '../i18n'

interface UseAttractionsResult {
  attractions: Attraction[]
  loading: boolean
  error: string | null
}

export function useAttractions(): UseAttractionsResult {
  const [rawData, setRawData] = useState<any[]>([])
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
        if (!cancelled) setRawData(data ?? [])
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? i18n.t('attractions.fetchError'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAttractions()
    return () => { cancelled = true }
  }, [])

  const attractions = useMemo(() => {
    const lang = i18n.language.split('-')[0] || 'pt'

    return rawData.map((row: any) => {
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
  }, [rawData, i18n.language])

  return { attractions, loading, error }
}
