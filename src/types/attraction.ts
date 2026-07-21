export interface Attraction {
  id: string
  nome: string
  categoria: string
  descricao?: string
  horarios?: string
  bairro?: string
  cidade?: string
  imagem_url?: string
  localizacao: {
    lat: number
    lng: number
  }
}

export interface SelectedAttraction extends Attraction {
  order: number
}
