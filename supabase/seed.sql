-- ============================================================================
-- Seed: Atrações reais do Rio de Janeiro
-- Execute APÓS o schema.sql e trigger.sql
-- ============================================================================

-- Pegar IDs das categorias
DO $$
DECLARE
  cat_monumento UUID;
  cat_praia UUID;
  cat_museu UUID;
  cat_mirante UUID;
  cat_parque UUID;
  cat_mercado UUID;
  cat_igreja UUID;
  cat_restaurante UUID;
  cat_outro UUID;
  idioma_pt UUID;
BEGIN
  SELECT id INTO cat_monumento FROM categoria_atracao WHERE nome = 'monumento';
  SELECT id INTO cat_praia FROM categoria_atracao WHERE nome = 'praia';
  SELECT id INTO cat_museu FROM categoria_atracao WHERE nome = 'museu';
  SELECT id INTO cat_mirante FROM categoria_atracao WHERE nome = 'mirante';
  SELECT id INTO cat_parque FROM categoria_atracao WHERE nome = 'parque';
  SELECT id INTO cat_mercado FROM categoria_atracao WHERE nome = 'mercado';
  SELECT id INTO cat_igreja FROM categoria_atracao WHERE nome = 'igreja';
  SELECT id INTO cat_restaurante FROM categoria_atracao WHERE nome = 'restaurante';
  SELECT id INTO cat_outro FROM categoria_atracao WHERE nome = 'outro';
  SELECT id INTO idioma_pt FROM idiomas WHERE codigo = 'pt';

  -- 1. Cristo Redentor
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000001', cat_monumento, 'Cristo Redentor', ST_MakePoint(-43.2105, -22.9519)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000001', 'Parque Nacional da Tijuca - Alto da Boa Vista', 'Alto da Boa Vista', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000001', idioma_pt, 'Estátua de Cristo de 30 metros de altura no topo do Corcovado, com 710 metros de altitude. Uma das 7 Novas Maravilhas do Mundo.', 'Diariamente 8h às 19h');

  -- 2. Pão de Açúcar (Sugarloaf)
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000002', cat_mirante, 'Pão de Açúcar', ST_MakePoint(-43.1563, -22.9486)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000002', 'Praia Vermelha, s/n', 'Urca', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000002', idioma_pt, 'Monólito de 396 metros com teleférico que conecta ao Morro da Urca. Vista panorâmica de 360° da cidade.', 'Diariamente 8h às 21h');

  -- 3. Copacabana
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000003', cat_praia, 'Copacabana', ST_MakePoint(-43.1822, -22.9711)::geography);
  INSERT INTO endereco_atracao (atracao_id, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000003', 'Copacabana', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000003', idioma_pt, 'Uma das praias mais famosas do mundo, com 4 km de extensão e calçadão em pedra portuguesa projetado por Roberto Burle Marx.');

  -- 4. Ipanema
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000004', cat_praia, 'Ipanema', ST_MakePoint(-43.2042, -22.9838)::geography);
  INSERT INTO endereco_atracao (atracao_id, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000004', 'Ipanema', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000004', idioma_pt, 'Praia icônica do Rio, imortalizada pela bossa nova. Conhecida por seu posto 9 e comércio sofisticado.');

  -- 5. Maracanã
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000005', cat_monumento, 'Estádio do Maracanã', ST_MakePoint(-43.2302, -22.9121)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000005', 'Rua Professor Eurico Rabelo, s/n', 'Maracanã', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000005', idioma_pt, 'Maior estádio do Brasil, palco de finais de Copa do Mundo. Capacidade para 78 mil pessoas. Visitas guiadas disponíveis.', 'Visitas guiadas: seg a sáb 10h às 17h');

  -- 6. Museu do Amanhã
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000006', cat_museu, 'Museu do Amanhã', ST_MakePoint(-43.1775, -22.9035)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000006', 'Praça Mauá, 1', 'Porto Maravilha', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000006', idioma_pt, 'Museu interativo de ciências com foco em sustentabilidade. Arquitetura de Santiago Calatrava.', 'Ter a dom 10h às 17h. Segunda fechado');

  -- 7. Arcos da Lapa
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000007', cat_monumento, 'Arcos da Lapa', ST_MakePoint(-43.1806, -22.9133)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000007', 'Rua do Riachuelo', 'Lapa', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000007', idioma_pt, 'Aqueduto do século XVIII com 42 arcos. Hoje abriga o centro cultural e palco de shows ao ar livre. Símbolo da boemia carioca.');

  -- 8. Escadaria Selarón
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000008', cat_monumento, 'Escadaria Selarón', ST_MakePoint(-43.1824, -22.9133)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000008', 'Rua Manuel Carneiro', 'Lapa', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000008', idioma_pt, '215 degraus revestidos com azulejos de mais de 60 países. Obra do artista chileno Jorge Selarón.');

  -- 9. Jardim Botânico
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000009', cat_parque, 'Jardim Botânico', ST_MakePoint(-43.2247, -22.9698)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000009', 'Rua Jardim Botânico, 1008', 'Jardim Botânico', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000009', idioma_pt, 'Um dos maiores jardins botânicos do mundo, com 137 hectares e mais de 6.500 espécies tropicais.', 'Seg a sex 8h às 17h. Sáb e dom 8h às 18h');

  -- 10. Santa Teresa
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000010', cat_outro, 'Santa Teresa', ST_MakePoint(-43.1822, -22.9219)::geography);
  INSERT INTO endereco_atracao (atracao_id, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000010', 'Santa Teresa', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000010', idioma_pt, 'Bairro boêmio no alto do morro, com ateliês, bares, restaurantes e ruas de pedra. Acessível pelo bonde histórico.');

  -- 11. Mercado Municipal
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000011', cat_mercado, 'Mercado Municipal da Central', ST_MakePoint(-43.1822, -22.9075)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000011', 'Rua Senador Vergueiro, 348', 'Centro', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000011', idioma_pt, 'Mercado centenário com dezenas de barracas de comida típica, frutas tropicais e produtos regionais.', 'Seg a sáb 6h às 18h');

  -- 12. Pedra do Sal
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000012', cat_monumento, 'Pedra do Sal', ST_MakePoint(-43.1920, -22.8945)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000012', 'Rua da Pedra do Sal', 'Saúde', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000012', idioma_pt, 'Berço do samba carioca. Lugar histórico com rodas de samba ao ar livre nas noites de segunda e sexta.');

  -- 13. Parque das Ruínas
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000013', cat_mirante, 'Parque das Ruínas', ST_MakePoint(-43.1806, -22.9206)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000013', 'Rua Cosme Velho, 533', 'Cosme Velho', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000013', idioma_pt, 'Espaço cultural com ruínas da mansão da Baronesa de Nova Friburgo. Vista panorâmica da Baía de Guanabara.', 'Ter a dom 12h às 18h');

  -- 14. Corcovado
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000014', cat_mirante, 'Corcovado', ST_MakePoint(-43.2105, -22.9519)::geography);
  INSERT INTO endereco_atracao (atracao_id, rua, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000014', 'Parque Nacional da Tijuca', 'Alto da Boa Vista', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000014', idioma_pt, 'Montanha de 710m no coração da Floresta da Tijuca. Trem do Corcovado leva até o Cristo Redentor.', 'Diariamente 8h às 19h');

  -- 15. Praia de Botafogo
  INSERT INTO atracoes (id, categoria_id, nome, localizacao) VALUES
    ('a0000001-0000-0000-0000-000000000015', cat_praia, 'Praia de Botafogo', ST_MakePoint(-43.1720, -22.9345)::geography);
  INSERT INTO endereco_atracao (atracao_id, bairro, cidade, estado) VALUES
    ('a0000001-0000-0000-0000-000000000015', 'Botafogo', 'Rio de Janeiro', 'RJ');
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000015', idioma_pt, 'Baía tranquila com vista para o Pão de Açúcar. Área de lazer com ciclovia e quadra de areia.');

END $$;
