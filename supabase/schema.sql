-- ============================================================================
-- Route Manager RJ — Schema do Banco de Dados
-- PostgreSQL + PostGIS + Supabase
-- ============================================================================

-- ============================================================================
-- EXTENSÕES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE idioma_codigo AS ENUM ('pt', 'en', 'es');

-- ============================================================================
-- BLOCO 1: USUÁRIOS
-- ============================================================================

-- Tabela principal de usuários (1:1 com auth.users do Supabase)
CREATE TABLE usuario (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  nome_completo TEXT NOT NULL,
  avatar_url TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idiomas suportados pelo sistema
CREATE TABLE idiomas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo idioma_codigo NOT NULL UNIQUE,
  nome TEXT NOT NULL
);

-- Tabela pivô: idioma de preferência do usuário (N:N)
CREATE TABLE idioma_usuario (
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  idioma_id UUID NOT NULL REFERENCES idiomas(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, idioma_id)
);

-- ============================================================================
-- BLOCO 2: ATRAÇÕES (antes de rotas, por causa do ponto_inicio_id)
-- ============================================================================

-- Categorias de atrações
CREATE TABLE categoria_atracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE
);

-- Atrações / pontos de interesse
CREATE TABLE atracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID NOT NULL REFERENCES categoria_atracao(id) ON DELETE RESTRICT,
  nome TEXT NOT NULL,
  localizacao GEOGRAPHY(POINT, 4326) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contatos das atrações (telefone, site, redes sociais)
CREATE TABLE contato_atracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atracao_id UUID NOT NULL REFERENCES atracoes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  valor TEXT NOT NULL
);

-- Endereço das atrações (1:1)
CREATE TABLE endereco_atracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atracao_id UUID NOT NULL UNIQUE REFERENCES atracoes(id) ON DELETE CASCADE,
  rua TEXT,
  numero TEXT,
  bairro TEXT,
  cidade TEXT NOT NULL DEFAULT 'Rio de Janeiro',
  estado TEXT NOT NULL DEFAULT 'RJ',
  cep TEXT
);

-- Informações das atrações por idioma (internacionalização)
CREATE TABLE informacao_atracao (
  atracao_id UUID NOT NULL REFERENCES atracoes(id) ON DELETE CASCADE,
  idioma_id UUID NOT NULL REFERENCES idiomas(id) ON DELETE RESTRICT,
  descricao TEXT NOT NULL,
  horarios TEXT,
  PRIMARY KEY (atracao_id, idioma_id)
);

-- Imagens das atrações
CREATE TABLE imagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  legenda TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela pivô: imagens associadas a atrações (N:N com ordem)
CREATE TABLE imagens_atracao (
  atracao_id UUID NOT NULL REFERENCES atracoes(id) ON DELETE CASCADE,
  imagem_id UUID NOT NULL REFERENCES imagens(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (atracao_id, imagem_id)
);

-- Tabela pivô: atrações favoritas do usuário (N:N)
CREATE TABLE atracoes_favoritas (
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  atracao_id UUID NOT NULL REFERENCES atracoes(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (usuario_id, atracao_id)
);

-- ============================================================================
-- BLOCO 3: ROTAS
-- ============================================================================

-- Status possíveis de uma rota
CREATE TABLE status_rota (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE
);

-- Rotas criadas pelos usuários
CREATE TABLE rotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
  status_id UUID NOT NULL REFERENCES status_rota(id) ON DELETE RESTRICT,
  ponto_inicio_id UUID REFERENCES atracoes(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  distancia_total NUMERIC,
  duracao_total INTERVAL,
  dados_rotas JSONB,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela pivô: atrações que compõem uma rota (N:N com ordem)
CREATE TABLE rota_atracoes (
  rota_id UUID NOT NULL REFERENCES rotas(id) ON DELETE CASCADE,
  atracao_id UUID NOT NULL REFERENCES atracoes(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL,
  PRIMARY KEY (rota_id, atracao_id)
);

-- Tabela pivô: rotas favoritas do usuário (N:N)
CREATE TABLE rotas_favoritas (
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  rota_id UUID NOT NULL REFERENCES rotas(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (usuario_id, rota_id)
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

CREATE INDEX idx_rotas_usuario ON rotas(usuario_id);
CREATE INDEX idx_rotas_status ON rotas(status_id);
CREATE INDEX idx_rota_atracoes_rota ON rota_atracoes(rota_id);
CREATE INDEX idx_rota_atracoes_atracao ON rota_atracoes(atracao_id);
CREATE INDEX idx_contato_atracao ON contato_atracao(atracao_id);
CREATE INDEX idx_informacao_atracao ON informacao_atracao(atracao_id);
CREATE INDEX idx_imagems_atracao ON imagens_atracao(atracao_id);
CREATE INDEX idx_atracoes_categoria ON atracoes(categoria_id);
CREATE INDEX idx_atracoes_localizacao ON atracoes USING GIST(localizacao);

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE idiomas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idioma_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_rota ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE rota_atracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotas_favoritas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoria_atracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE atracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contato_atracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE endereco_atracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE informacao_atracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagens_atracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE atracoes_favoritas ENABLE ROW LEVEL SECURITY;

-- --- usuario ---
CREATE POLICY "Qualquer um vê perfis públicos"
  ON usuario FOR SELECT USING (true);

CREATE POLICY "Usuário edita próprio perfil"
  ON usuario FOR UPDATE USING (auth.uid() = id);

-- --- idiomas ---
CREATE POLICY "Qualquer um vê idiomas"
  ON idiomas FOR SELECT USING (true);

-- --- idioma_usuario ---
CREATE POLICY "Usuário vê próprias preferências de idioma"
  ON idioma_usuario FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuário gerencia próprias preferências de idioma"
  ON idioma_usuario FOR ALL USING (auth.uid() = usuario_id);

-- --- status_rota ---
CREATE POLICY "Qualquer um vê status"
  ON status_rota FOR SELECT USING (true);

-- --- rotas ---
CREATE POLICY "Qualquer um vê rotas"
  ON rotas FOR SELECT USING (true);

CREATE POLICY "Criador edita própria rota"
  ON rotas FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Usuário cria rotas para si"
  ON rotas FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Criador deleta própria rota"
  ON rotas FOR DELETE USING (auth.uid() = usuario_id);

-- --- rota_atracoes ---
CREATE POLICY "Qualquer um vê composição de rotas"
  ON rota_atracoes FOR SELECT USING (true);

CREATE POLICY "Criador da rota gerencia atrações da rota"
  ON rota_atracoes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM rotas
      WHERE rotas.id = rota_atracoes.rota_id
        AND rotas.usuario_id = auth.uid()
    )
  );

-- --- rotas_favoritas ---
CREATE POLICY "Usuário vê próprios favoritos"
  ON rotas_favoritas FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuário gerencia próprios favoritos"
  ON rotas_favoritas FOR ALL USING (auth.uid() = usuario_id);

-- --- categoria_atracao ---
CREATE POLICY "Qualquer um vê categorias"
  ON categoria_atracao FOR SELECT USING (true);

-- --- atracoes ---
CREATE POLICY "Qualquer um vê atrações"
  ON atracoes FOR SELECT USING (true);

-- --- contato_atracao ---
CREATE POLICY "Qualquer um vê contatos"
  ON contato_atracao FOR SELECT USING (true);

-- --- endereco_atracao ---
CREATE POLICY "Qualquer um vê endereços"
  ON endereco_atracao FOR SELECT USING (true);

-- --- informacao_atracao ---
CREATE POLICY "Qualquer um vê informações"
  ON informacao_atracao FOR SELECT USING (true);

-- --- imagens ---
CREATE POLICY "Qualquer um vê imagens"
  ON imagens FOR SELECT USING (true);

-- --- imagens_atracao ---
CREATE POLICY "Qualquer um vê imagens de atrações"
  ON imagens_atracao FOR SELECT USING (true);

-- --- atracoes_favoritas ---
CREATE POLICY "Usuário vê próprios favoritos"
  ON atracoes_favoritas FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuário gerencia próprios favoritos"
  ON atracoes_favoritas FOR ALL USING (auth.uid() = usuario_id);

-- ============================================================================
-- SEED: Dados iniciais
-- ============================================================================

-- Status de rota
INSERT INTO status_rota (nome) VALUES
  ('rascunho'),
  ('calculada'),
  ('concluida');

-- Categorias de atração
INSERT INTO categoria_atracao (nome) VALUES
  ('monumento'),
  ('praia'),
  ('restaurante'),
  ('museu'),
  ('parque'),
  ('mirante'),
  ('igreja'),
  ('mercado'),
  ('outro');

-- Idiomas
INSERT INTO idiomas (codigo, nome) VALUES
  ('pt', 'Português'),
  ('en', 'English'),
  ('es', 'Español');
