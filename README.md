# Route Manager RJ

Aplicativo de planejamento de rotas turísticas no Rio de Janeiro. O usuário seleciona os pontos que deseja visitar, define um ponto de partida, e o sistema calcula a melhor rota em ordem de eficiência usando OSRM.

---

## Funcionalidades

- **Auth completa**: página dedicada de login (`/login`) com email/senha + Google OAuth (Supabase Auth)
- **Todas as rotas protegidas**: redireciona para `/login` se não autenticado
- **Internacionalização**: suporte a Português, Inglês e Espanhol (i18next com detecção de idioma do navegador)
- **Perfil do usuário**: editar nome, upload de avatar para Supabase Storage
- **Seleção de atrações**: fluxo em 2 etapas — etapa 1 escolhe atração principal, etapa 2 mostra atrações próximas (≤5km) + busca
- **Favoritar atrações**: botão de coração nos cards, sync com Supabase (`atracoes_favoritas`), atrações favoritas aparecem primeiro na lista
- **Busca inteligente**: scoring multi-campo (nome 4x, categoria 3x, bairro 2x, descrição 1x), normalização NFD para acentos
- **Otimização de rota**: algoritmo nearest-neighbor com Haversine — reordena atrações a partir da principal para minimizar distância total
- **Cálculo de rotas via OSRM**: rotas para carro, a pé e bicicleta, chamadas em paralelo com timeout 15s
- **Mapa interativo com Leaflet**: markers numerados, polyline da rota, auto-zoom com FitBounds
- **Loading animado**: tela com fases visuais (conectando ao servidor / calculando rotas)
- **Favoritar rotas**: botão nos resultados, sync com Supabase (`rotas_favoritas`), acesso rápido em "Minhas Rotas"
- **Minhas Rotas** (`/rotas`): lista de rotas favoritas com data, distância e duração; botões para visualizar e remover
- **Visualizar rota salva**: carrega rota do banco de dados e redireciona para `/results` com atras restaurados
- **Abrir no Google Maps/Waze**: gera URL de navegação com todos os pontos da rota
- **Compartilhar via WhatsApp**: formatação da rota como mensagem e envio
- **Toast notifications**: sistema global com auto-dismiss (4s sucesso, 5s erro)
- **Reset automático**: fluxo reseta ao navegar para Home ou Planejar Rota

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Navegação | React Router 7 |
| Internacionalização | i18next + react-i18next |
| Mapa | Leaflet + react-leaflet + OpenStreetMap tiles |
| Rotas | OSRM (Open Source Routing Machine) via Vite proxy / Vercel rewrites |
| Backend/DB | Supabase (PostgreSQL + PostGIS + Auth + Storage) |
| Deploy | Vercel |
| Gerenciador de pacotes | Yarn |

---

## Estrutura do projeto

```
route-manager-rj/
├── index.html
├── package.json
├── vite.config.ts              # Proxy OSRM em dev (driving/foot/cycling)
├── vercel.json                 # Proxy OSRM em produção (Vercel rewrites)
├── tsconfig.json
│
├── public/
│   ├── favicon.svg
│   └── Mapa_RJ.svg             # Mapa do RJ (asset estático)
│
├── supabase/
│   ├── schema.sql              # Schema completo do banco (14 tabelas)
│   ├── trigger.sql             # Trigger: auto-cria usuario no signup
│   ├── seed.sql                # 15 atrações reais do RJ com coordenadas
│   └── seed_i18n.sql           # Traduções EN/ES das 15 atrações
│
├── Referencias_iniciais/       # Mockups e guia de estilo do Figma
│
└── src/
    ├── main.tsx                # Entry point React + init i18n
    ├── App.tsx                 # Router com AuthProvider, RouteProvider, ToastProvider
    ├── vite-env.d.ts           # Tipos das env vars
    │
    ├── i18n/
    │   ├── index.ts            # Config i18next (detecção de idioma, fallback)
    │   ├── pt.json             # Traduções PT
    │   ├── en.json             # Traduções EN
    │   └── es.json             # Traduções ES
    │
    ├── styles/
    │   └── global.css          # Tokens de cor, fonte Montserrat, reset, animações
    │
    ├── assets/
    │   └── Logo.svg            # Logo RM RJ (Figma)
    │
    ├── contexts/
    │   ├── AuthContext.tsx      # Auth context/provider (Supabase Auth)
    │   ├── RouteContext.tsx     # Estado do fluxo de 2 etapas + resetFlow + loadSavedRoute
    │   └── ToastContext.tsx     # Toast notifications globais
    │
    ├── hooks/
    │   └── useAttractions.ts   # Fetch de atrações + parse WKB + favoritas (sorting + toggle)
    │
    ├── components/
    │   ├── Header.tsx          # Header responsivo + dropdown desktop + seletor de idioma
    │   ├── MenuDrawer.tsx      # Drawer lateral (mobile) com resetFlow
    │   ├── Button.tsx          # Botão com 5 cores e 4 border-radius
    │   ├── AttractionCard.tsx  # Card com imagem, favoritar (coração), info, estado selecionado
    │   ├── AttractionInfoModal.tsx # Modal com endereço, horários, descrição
    │   ├── SearchInput.tsx     # Busca com botão de limpar
    │   ├── AuthModal.tsx       # Modal de login/signup/Google (header/menu)
    │   ├── ProtectedRoute.tsx  # Redireciona para /login se não autenticado
    │   ├── RouteMap.tsx        # Mapa Leaflet com markers, polyline, FitBounds
    │   └── RouteLoading.tsx    # Loading animado com fases (i18n)
    │
    ├── pages/
    │   ├── LoginPage.tsx       # Página de login/signup com tabs + Google OAuth
    │   ├── HomePage.tsx        # Landing page (protegida, reseta fluxo)
    │   ├── AppPage.tsx         # Seleção de atrações (2 etapas + busca + favoritar)
    │   ├── ResultsPage.tsx     # Resultados (mapa + OSRM + favoritar rota + Open Maps)
    │   ├── RoutesPage.tsx      # Minhas Rotas (lista de rotas favoritas, visualizar/remover)
    │   ├── ProfilePage.tsx     # Perfil do usuário (editar nome + avatar)
    │   └── NotFoundPage.tsx    # 404
    │
    └── utils/
        ├── supabase.ts         # Cliente Supabase
        ├── distance.ts         # Fórmula de Haversine (distância client-side)
        ├── search.ts           # Busca inteligente multi-campo
        ├── routeCalculator.ts  # OSRM paralelo + otimização nearest-neighbor + decode polyline6 + i18n
        ├── parseWKB.ts         # Parse de WKB hex (PostGIS) para lat/lng
        ├── saveRoute.ts        # Salvar rota no Supabase DB
        ├── favoriteRoute.ts    # Favoritar/desfavoritar rotas (rotas_favoritas)
        ├── favoriteAttraction.ts # Favoritar/desfavoritar atrações (atracoes_favoritas)
        ├── openInMaps.ts       # Abrir rota no Google Maps ou Waze
        └── shareWhatsApp.ts    # Formatar mensagem e abrir wa.me (i18n)
```

---

## Rotas

| Rota | Página | Autenticação | Descrição |
|------|--------|-------------|-----------|
| `/login` | LoginPage | pública | Login/signup com email + Google |
| `/` | HomePage | protegida | Landing page com hero, mapa do RJ e CTA |
| `/app` | AppPage | protegida | Seleção de atrações (2 etapas + busca + favoritar) |
| `/results` | ResultsPage | protegida | Mapa + rotas OSRM + favoritar + Open Maps + WPP |
| `/rotas` | RoutesPage | protegida | Minhas Rotas (lista de rotas favoritas) |
| `/profile` | ProfilePage | protegida | Editar nome e avatar |
| `*` | NotFoundPage | pública | 404 |

---

## Design System

### Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `sky` | `#4CA3FF` | Azul principal, botões primários |
| `lime` | `#8BC34A` | Verde, botões secundários |
| `mustard` | `#F5A623` | Amarelo/dourado, destaques |
| `orange` | `#FF9800` | Laranja, ações |
| `pink` | `#EB6092` | Rosa, atrações selecionadas, pin do mapa |
| `navy` | `#0F3B64` | Azul escuro, textos principais |
| `cyan` | `#4AB6D9` | Azul claro, acentos |

### Tipografia

**Montserrat** (Google Fonts) — pesos 300 a 900.

### Componentes

- **Button**: 5 variantes de cor (`sky`, `lime`, `mustard`, `orange`, `pink`) × 4 border-radius (0, 5, 10, 15) + variante `outline`
- **Header**: Logo + seletor de idioma + dropdown desktop (avatar) / hamburger mobile
- **MenuDrawer**: Drawer lateral com perfil, planejar rota (com resetFlow) e logout
- **LoginPage**: Página dedicada com tabs login/signup + Google OAuth + toggle senha
- **AuthModal**: Modal de login (usado no Header e MenuDrawer para usuários deslogados)
- **ProtectedRoute**: Redireciona para `/login` se não autenticado, mostra spinner durante carregamento
- **AttractionCard**: Card com imagem, favoritar (coração), info (i), categoria, bairro, estado selecionado
- **AttractionInfoModal**: Modal com endereço, horários e descrição da atração
- **SearchInput**: Campo de busca com botão de limpar
- **RouteMap**: Mapa Leaflet com markers numerados e polyline
- **RouteLoading**: Loading animado com fases visuais (internacionalizado)

---

## Banco de Dados

Schema completo em `supabase/schema.sql` — 14 tabelas com PostGIS, RLS e seeds.

### Setup

```bash
# 1. Aplicar schema
# Copiar conteúdo de supabase/schema.sql no SQL Editor do Supabase → Run

# 2. Aplicar trigger (auto-cria usuario no signup)
# Copiar conteúdo de supabase/trigger.sql no SQL Editor → Run

# 3. Aplicar seeds (15 atrações reais do RJ)
# Copiar conteúdo de supabase/seed.sql no SQL Editor → Run

# 4. Aplicar traduções EN/ES (precisa das idiomas e atracoes já inseridas)
# Copiar conteúdo de supabase/seed_i18n.sql no SQL Editor → Run

# 5. Garantir que todos os users existentes tenham registro na tabela usuario:
INSERT INTO usuario (id, nome_completo)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users
WHERE id NOT IN (SELECT id FROM usuario)
ON CONFLICT (id) DO NOTHING;
```

### Diagrama

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   usuario   │────<│ idioma_usuario   │>────│    idiomas      │
└──────┬──────┘     └──────────────────┘     └─────────────────┘
       │
       ├────< rotas_favoritas >──── rotas ────> status_rota
       │
       ├────< atracoes_favoritas >──── atracoes ────> categoria_atracao
       │                              │
       │               ┌──────────────┼──────────────┐
       │               │              │              │
       │     contato_atracao   endereco_atracao   informacao_atracao
       │                                              │
       │                                    ┌─────────┴────────┐
       │                                    │                  │
       │                              imagens_atracao      idiomas
       │                                    │
       │                                imagens
       │
       └────< rota_atracoes >──── atracoes
```

### Tabelas

| Bloco | Tabela | Descrição |
|-------|--------|-----------|
| **Usuários** | `usuario` | Perfil (1:1 com auth.users) |
| | `idiomas` | Idiomas suportados (pt, en, es) |
| | `idioma_usuario` | Preferência de idioma do usuário |
| **Atrações** | `categoria_atracao` | Categorias (monumento, praia, etc.) |
| | `atracoes` | Pontos de interesse com localização (PostGIS GEOGRAPHY) |
| | `contato_atracao` | Telefone, site, redes sociais |
| | `endereco_atracao` | Endereço completo (rua, bairro, cidade) |
| | `informacao_atracao` | Descrição e horários por idioma |
| | `imagens` | Galeria de imagens |
| | `imagens_atracao` | Associação imagens ↔ atrações |
| | `atracoes_favoritas` | Atrações favoritas do usuário |
| **Rotas** | `status_rota` | Estados: rascunho, calculada, concluída |
| | `rotas` | Rotas com distância, duração e dados da API |
| | `rota_atracoes` | Atrações da rota com ordem |
| | `rotas_favoritas` | Rotas favoritas do usuário |

---

## Arquitetura de Rotas (OSRM)

### Fluxo

1. Usuário seleciona atrações na `/app` (pode favoritar atrações individuais)
2. `RouteContext` armazena atrações + atração principal
3. `ResultsPage` calcula rotas chamando `routeCalculator.ts`
4. `optimizeOrder()` reordena atrações por **nearest-neighbor** (Haversine) a partir da principal
5. `routeCalculator.ts` faz chamadas **em paralelo** ao OSRM via proxy (timeout 15s por modo)
6. `Promise.allSettled` garante que modos que falharam não bloqueiam os que funcionaram
7. Respostas contêm polyline6 que é decodificada para coordenadas
8. `RouteMap.tsx` renderiza no Leaflet com markers numerados e polyline
9. Tempo/duração exibidos por modalidade (labels internacionalizados)
10. Usuário pode **favoritar a rota** (salva em `rotas_favoritas`)
11. **"Abrir no Maps"** gera URL de navegação no Google Maps/Waze com todos os pontos
12. **"Minhas Rotas"** (`/rotas`) lista rotas favoritas; **"Ver"** carrega a rota via `loadSavedRoute()` e redireciona para `/results`

### Sistema de Favoritos

**Atrações** (`favoriteAttraction.ts`):
- `getFavoriteIds(userId)` → busca IDs favoritados do usuário
- `toggleFavoriteAttraction(userId, attractionId)` → adiciona/remove
- `useAttractions` retorna `favoriteIds` (Set) e `toggleFavorite` (callback)
- Atrações favoritas aparecem primeiro na lista (sorting)

**Rotas** (`favoriteRoute.ts`):
- `isFavorited(routeId)` → verifica se rota é favorita
- `toggleFavorite(routeId)` → adiciona/remove de `rotas_favoritas`
- Botão favoritar na `ResultsPage`; toast confirma ação

**Visualizar rota salva** (`loadSavedRoute` no `RouteContext`):
- Busca `rotas` + `rota_atracoes` + `atracoes` com JOINs
- Restaura `selected`, `mainAttraction`, `savedRouteId`
- Redireciona para `/results`

### Abrir no Maps/Waze (`openInMaps.ts`)

- `openGoogleMaps(attractions, travelMode)` → gera URL `google.com/maps/dir/` com origin, destination e waypoints
- `openWaze(attraction)` → gera URL `waze.com/ul?ll=` com navegação ativa
- No mobile usa `navigator.share()` quando disponível; fallback para `window.open`
- Travel mode mapping: `DRIVING` → `driving`, `WALKING` → `walking`, `BICYCLE` → `bicycling`

### Proxy

**Dev** (`vite.config.ts`):
- `/api/osrm/driving/*` → `https://routing.openstreetmap.de/routed-car`
- `/api/osrm/foot/*` → `https://routing.openstreetmap.de/routed-foot`
- `/api/osrm/cycling/*` → `https://routing.openstreetmap.de/routed-bike`

**Produção** (`vercel.json`): mesmas rewrites via Vercel.

### Parse de coordenadas (PostGIS)

O Supabase retorna colunas `GEOGRAPHY` como WKB hex (binário). `utils/parseWKB.ts` decodifica strings EWKB para `{ lat, lng }`. Atrações com coordenadas `0,0` (Null Island) são filtradas antes de enviar ao OSRM.

### Travel Modes

| Modo do Usuário | Perfil OSRM |
|----------------|-------------|
| DRIVING | `driving` |
| WALKING | `foot` |
| BICYCLE | `cycling` |

---

## Como rodar

```bash
# Instalar dependências
yarn

# Iniciar dev server
yarn dev

# Build para produção
yarn build

# Preview do build
yarn preview
```

### Variáveis de ambiente

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

Nenhuma chave de API de mapas é necessária — OSRM e OpenStreetMap são gratuitos e open source.

---

## Deploy (Vercel)

O projeto está configurado para deploy na Vercel com rewrites do OSRM em `vercel.json`. Basta conectar o repositório ao Vercel e configurar as variáveis de ambiente no painel.

---

## Licença

Projeto privado — Route Manager RJ.
