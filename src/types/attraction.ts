export interface Contato {
  tipo: string
  valor: string
}

export interface Attraction {
  id: string
  nome: string
  categoria: string
  descricao?: string | null
  horarios?: string | null
  rua?: string | null
  bairro?: string | null
  cidade?: string | null
  imagem_url?: string | null
  contatos?: Contato[]
  localizacao: {
    lat: number
    lng: number
  }
}

export interface SelectedAttraction extends Attraction {
  order: number
}
