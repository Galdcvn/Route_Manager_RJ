import type { Attraction } from '../types/attraction'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

interface ScoredAttraction {
  attraction: Attraction
  score: number
}

export function smartSearch(
  attractions: Attraction[],
  query: string
): Attraction[] {
  if (!query.trim()) return attractions

  const terms = normalize(query).split(/\s+/).filter(Boolean)

  const scored: ScoredAttraction[] = attractions.map((a) => {
    const fields = [
      { text: normalize(a.nome), weight: 4 },
      { text: normalize(a.categoria), weight: 3 },
      { text: normalize(a.bairro ?? ''), weight: 2 },
      { text: normalize(a.descricao ?? ''), weight: 1 },
    ]

    let score = 0
    for (const term of terms) {
      for (const field of fields) {
        if (field.text === term) {
          score += field.weight * 10
        } else if (field.text.includes(term)) {
          score += field.weight * 5
        } else if (field.text.split(/\s+/).some((word) => word.startsWith(term))) {
          score += field.weight * 3
        }
      }
    }

    return { attraction: a, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.attraction)
}
