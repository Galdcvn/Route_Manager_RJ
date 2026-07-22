-- ============================================================================
-- Seed: Traduções EN/ES para as atrações
-- Execute APÓS seed.sql (precisa das idiomas e atracoes já inseridas)
-- ============================================================================

DO $$
DECLARE
  idioma_en UUID;
  idioma_es UUID;
BEGIN
  SELECT id INTO idioma_en FROM idiomas WHERE codigo = 'en';
  SELECT id INTO idioma_es FROM idiomas WHERE codigo = 'es';

  -- 1. Cristo Redentor
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000001', idioma_en, '30-meter Christ statue atop Corcovado mountain at 710 meters altitude. One of the 7 New Wonders of the World.', 'Daily 8am to 7pm'),
    ('a0000001-0000-0000-0000-000000000001', idioma_es, 'Estatua de Cristo de 30 metros de altura en la cima del Corcovado, a 710 metros de altitud. Una de las 7 Nuevas Maravillas del Mundo.', 'Diariamente 8h a 19h');

  -- 2. Pão de Açúcar (Sugarloaf)
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000002', idioma_en, '396-meter monolith with a cable car connecting to Morro da Urca. 360-degree panoramic view of the city.', 'Daily 8am to 9pm'),
    ('a0000001-0000-0000-0000-000000000002', idioma_es, 'Monolito de 396 metros con teleférico que conecta al Morro da Urca. Vista panorámica de 360° de la ciudad.', 'Diariamente 8h a 21h');

  -- 3. Copacabana
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000003', idioma_en, 'One of the most famous beaches in the world, with 4 km of shoreline and a Portuguese stone promenade designed by Roberto Burle Marx.'),
    ('a0000001-0000-0000-0000-000000000003', idioma_es, 'Una de las playas más famosas del mundo, con 4 km de extensión y un paseo de piedra portuguesa diseñado por Roberto Burle Marx.');

  -- 4. Ipanema
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000004', idioma_en, 'Iconic Rio beach, immortalized by bossa nova. Known for its Posto 9 and sophisticated shopping.'),
    ('a0000001-0000-0000-0000-000000000004', idioma_es, 'Playa icónica del Río, inmortalizada por la bossa nova. Conocida por su Posto 9 y su comercio sofisticado.');

  -- 5. Estádio do Maracanã
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000005', idioma_en, 'Brazil''s largest stadium, host of World Cup finals. Capacity for 78,000 people. Guided tours available.', 'Guided tours: Mon-Sat 10am to 5pm'),
    ('a0000001-0000-0000-0000-000000000005', idioma_es, 'El estadio más grande de Brasil, sede de finales de Copa del Mundo. Capacidad para 78.000 personas. Visitas guiadas disponibles.', 'Visitas guiadas: lun a sáb 10h a 17h');

  -- 6. Museu do Amanhã
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000006', idioma_en, 'Interactive science museum focused on sustainability. Architecture by Santiago Calatrava.', 'Tue-Sun 10am to 5pm. Closed Monday'),
    ('a0000001-0000-0000-0000-000000000006', idioma_es, 'Museo interactivo de ciencias con enfoque en sostenibilidad. Arquitectura de Santiago Calatrava.', 'Mar a dom 10h a 17h. Lunes cerrado');

  -- 7. Arcos da Lapa
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000007', idioma_en, '18th-century aqueduct with 42 arches. Now houses a cultural center and outdoor concert venue. Symbol of Rio''s bohemian life.'),
    ('a0000001-0000-0000-0000-000000000007', idioma_es, 'Acueducto del siglo XVIII con 42 arcos. Hoy alberga un centro cultural y escenario de shows al aire libre. Símbolo de la bohemia carioca.');

  -- 8. Escadaria Selarón
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000008', idioma_en, '215 steps covered with tiles from over 60 countries. Work of Chilean artist Jorge Selarón.'),
    ('a0000001-0000-0000-0000-000000000008', idioma_es, '215 escalones revestidos con azulejos de más de 60 países. Obra del artista chileno Jorge Selarón.');

  -- 9. Jardim Botânico
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000009', idioma_en, 'One of the largest botanical gardens in the world, with 137 hectares and over 6,500 tropical species.', 'Mon-Fri 8am to 5pm. Sat-Sun 8am to 6pm'),
    ('a0000001-0000-0000-0000-000000000009', idioma_es, 'Uno de los jardines botánicos más grandes del mundo, con 137 hectáreas y más de 6.500 especies tropicales.', 'Lun a vie 8h a 17h. Sáb y dom 8h a 18h');

  -- 10. Santa Teresa
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000010', idioma_en, 'Bohemian hilltop neighborhood with art studios, bars, restaurants, and cobblestone streets. Accessible by historic tram.'),
    ('a0000001-0000-0000-0000-000000000010', idioma_es, 'Barrio bohemio en la cuesta del cerro, con ateliés, bares, restaurantes y calles empedradas. Accesible en tranvía histórico.');

  -- 11. Mercado Municipal da Central
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000011', idioma_en, 'Century-old market with dozens of stalls offering local food, tropical fruits, and regional products.', 'Mon-Sat 6am to 6pm'),
    ('a0000001-0000-0000-0000-000000000011', idioma_es, 'Mercado centenario con docenas de puestos de comida típica, frutas tropicales y productos regionales.', 'Lun a sáb 6h a 18h');

  -- 12. Pedra do Sal
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000012', idioma_en, 'Birthplace of Rio''s samba. Historic spot with open-air samba circles on Monday and Friday nights.'),
    ('a0000001-0000-0000-0000-000000000012', idioma_es, 'Cuna del samba carioca. Lugar histórico con ruedas de samba al aire libre en las noches de lunes y viernes.');

  -- 13. Parque das Ruínas
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000013', idioma_en, 'Cultural space with ruins of the Baronesa de Nova Friburgo mansion. Panoramic view of Guanabara Bay.', 'Tue-Sun 12pm to 6pm'),
    ('a0000001-0000-0000-0000-000000000013', idioma_es, 'Espacio cultural con ruinas de la mansión de la Baronesa de Nova Friburgo. Vista panorámica de la Bahía de Guanabara.', 'Mar a dom 12h a 18h');

  -- 14. Corcovado
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao, horarios) VALUES
    ('a0000001-0000-0000-0000-000000000014', idioma_en, '710m mountain in the heart of Tijuca Forest. The Corcovado train takes you to Christ the Redeemer.', 'Daily 8am to 7pm'),
    ('a0000001-0000-0000-0000-000000000014', idioma_es, 'Montaña de 710m en el corazón de la Floresta da Tijuca. El tren del Corcovado te lleva hasta el Cristo Redentor.', 'Diariamente 8h a 19h');

  -- 15. Praia de Botafogo
  INSERT INTO informacao_atracao (atracao_id, idioma_id, descricao) VALUES
    ('a0000001-0000-0000-0000-000000000015', idioma_en, 'Calm bay with a view of Sugarloaf Mountain. Leisure area with bike path and sand court.'),
    ('a0000001-0000-0000-0000-000000000015', idioma_es, 'Bahía tranquila con vista al Pão de Açúcar. Área de esparcimiento con ciclovía y cancha de arena.');

END $$;
