export interface Contato {
  tipo: string
  valor: string
}

export interface Attraction {
  id: string
  nome: string
  categoria: string
  descricao?: string
  horarios?: string
  rua?: string
  bairro?: string
  cidade?: string
  imagem_url?: string
  contatos?: Contato[]
  localizacao: {
    lat: number
    lng: number
  }
}

export interface SelectedAttraction extends Attraction {
  order: number
}
