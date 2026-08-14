export interface DbUsuario {
  id: string
  nome_completo: string | null
  avatar_url: string | null
  criado_em: string
}

export interface DbAtracao {
  id: string
  nome: string
  localizacao: string
}

export interface DbCategoriaAtracao {
  nome: string
}

export interface DbEnderecoAtracao {
  rua: string | null
  bairro: string | null
  cidade: string | null
}

export interface DbIdioma {
  codigo: string
}

export interface DbInformacaoAtracao {
  descricao: string | null
  horarios: string | null
  idiomas: DbIdioma[] | null
}

export interface DbImagem {
  url: string
}

export interface DbImagensAtracao {
  ordem: number | null
  imagens: DbImagem[] | null
}

export interface DbContatoAtracao {
  tipo: string
  valor: string
}

export interface DbRota {
  id: string
  usuario_id: string
  nome: string | null
  ponto_inicio_id: string
  distancia_total: number | null
  duracao_total: string | null
  criado_em: string
}

export interface DbRotaAtracao {
  rota_id: string
  atracao_id: string
  ordem: number
}

export interface DbRotaFavorita {
  usuario_id: string
  rota_id: string
}

export interface DbAtracaoFavorita {
  usuario_id: string
  atracao_id: string
}

export interface AtracaoRow {
  id: string
  nome: string
  localizacao: string
  categoria_atracao: DbCategoriaAtracao[] | null
  endereco_atracao: DbEnderecoAtracao[] | null
  informacao_atracao: DbInformacaoAtracao[] | null
  imagens_atracao: DbImagensAtracao[] | null
  contato_atracao: DbContatoAtracao[] | null
}

export interface RotaRow {
  id: string
  ponto_inicio_id: string
  nome: string | null
}

export interface RotaAtracaoRow {
  atracao_id: string
  ordem: number
}

export interface RotaFavoritaJoin {
  rota_id: string
  rotas: DbRota | DbRota[] | null
}

export interface RotasRow {
  id: string
  nome: string | null
  distancia_total: number | null
  duracao_total: string | null
  criado_em: string
  usuario_id: string
}
