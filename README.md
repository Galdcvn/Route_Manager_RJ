# Route Manager RJ

Aplicativo de planejamento de rotas turísticas no Rio de Janeiro. O usuário seleciona os pontos que deseja visitar, define um ponto de partida, e o sistema calcula a melhor rota em ordem de eficiência usando OSRM.

---

## Funcionalidades

- **Auth completa**: login/signup com email + senha, login com Google (Supabase Auth), modal de auth, rotas protegidas
- **Perfil do usuário**: editar nome, upload de avatar para Supabase Storage, preview
- **Seleção de atrações**: fluxo em 2 etapas — etapa 1 escolhe atração principal, etapa 2 mostra atrações próximas (≤5km) + busca
- **Busca inteligente**: scoring multi-campo (nome 4x, categoria 3x, bairro 2x, descrição 1x), normalização NFD para acentos
- **Cálculo de rotas via OSRM**: rotas para carro, a pé e bicicleta, com decode de polyline6
- **Mapa interativo com Leaflet**: markers numerados, polyline da rota, auto-zoom com FitBounds
- **Loading animado**: tela com fases visuais (conectando ao servidor / calculando rotas)
- **Compartilhar via WhatsApp**: formatação da rota como mensagem e envio
- **Toast notifications**: sistema global com auto-dismiss (4s sucesso, 5s erro)
- **404 page**: página de erro com botão de retorno

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Navegação | React Router 7 |
| Mapa | Leaflet + react-leaflet + OpenStreetMap tiles |
| Rotas | OSRM (Open Source Routing Machine) via Vite proxy |
| Backend/DB | Supabase (PostgreSQL + PostGIS + Auth + Storage) |
| Gerenciador de pacotes | Yarn |

---

## Estrutura do projeto

```
route-manager-rj/
├── index.html
├── package.json
├── vite.config.ts              # Proxy OSRM (driving/foot/cycling)
├── tsconfig.json
│
├── public/
│   └── favicon.svg
│
├── supabase/
│   ├── schema.sql              # Schema completo do banco (14 tabelas)
│   ├── trigger.sql             # Trigger: auto-cria usuario no signup
│   └── seed.sql                # 15 atrações reais do RJ com coordenadas
│
├── Referencias_iniciais/       # Mockups e guia de estilo do Figma
│
└── src/
    ├── main.tsx                # Entry point React
    ├── App.tsx                 # Router com AuthProvider, RouteProvider, ToastProvider
    ├── vite-env.d.ts           # Tipos das env vars
    │
    ├── styles/
    │   └── global.css          # Tokens de cor, fonte Montserrat, reset, animações
    │
    ├── assets/
    │   ├── Logo.svg            # Logo RM RJ (Figma)
    │   └── Mapa_RJ.svg         # Mapa do Estado do RJ (Figma)
    │
    ├── contexts/
    │   ├── AuthContext.tsx      # Auth context/provider (Supabase Auth)
    │   ├── RouteContext.tsx     # Estado do fluxo de 2 etapas
    │   └── ToastContext.tsx     # Toast notifications globais
    │
    ├── hooks/
    │   └── useAttractions.ts   # Fetch de atrações com JOINs + parse WKB
    │
    ├── components/
    │   ├── Header.tsx          # Header responsivo + dropdown desktop
    │   ├── MenuDrawer.tsx      # Drawer lateral (mobile)
    │   ├── Button.tsx          # Botão com 5 cores e 4 border-radius
    │   ├── AttractionCard.tsx  # Card de atração com estado selecionado
    │   ├── AttractionInfoModal.tsx # Modal com endereço, horários, descrição
    │   ├── SearchInput.tsx     # Busca com botão de limpar
    │   ├── AuthModal.tsx       # Modal de login/signup/Google
    │   ├── ProtectedRoute.tsx  # Rota protegida (redireciona se não logado)
    │   ├── RouteMap.tsx        # Mapa Leaflet com markers, polyline, FitBounds
    │   └── RouteLoading.tsx    # Loading animado com fases
    │
    ├── pages/
    │   ├── HomePage.tsx        # Landing page (hero + mapa + CTA)
    │   ├── AppPage.tsx         # Seleção de atrações (2 etapas + busca)
    │   ├── ResultsPage.tsx     # Resultados (mapa Leaflet + rotas OSRM + WPP)
    │   ├── ProfilePage.tsx     # Perfil do usuário (editar nome + avatar)
    │   └── NotFoundPage.tsx    # 404
    │
    └── utils/
        ├── supabase.ts         # Cliente Supabase
        ├── distance.ts         # Fórmula de Haversine (distância client-side)
        ├── search.ts           # Busca inteligente multi-campo
        ├── routeCalculator.ts  # OSRM API via Vite proxy + decode polyline6
        ├── parseWKB.ts         # Parse de WKB hex (PostGIS) para lat/lng
        ├── saveRoute.ts        # Salvar rota no Supabase DB
        └── shareWhatsApp.ts    # Formatar mensagem e abrir wa.me
```

---

## Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | HomePage | Landing page com hero, mapa do RJ e CTA |
| `/app` | AppPage | Seleção de atrações (2 etapas + busca) |
| `/results` | ResultsPage | Mapa Leaflet + rotas OSRM + tempos por modalidade + share WPP |
| `/profile` | ProfilePage | Editar nome e avatar (protegida) |
| `*` | NotFoundPage | 404 |

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

- **Button**: 5 variantes de cor (`sky`, `lime`, `mustard`, `orange`, `pink`) × 4 border-radius (0, 5, 10, 15)
- **Header**: Logo + nav links (desktop) + hamburger (mobile) + dropdown com avatar
- **MenuDrawer**: Drawer lateral com perfil, planejar rota e logout
- **AttractionCard**: Card com imagem, nome, categoria e estado selecionado
- **AttractionInfoModal**: Modal com endereço, horários e descrição da atração
- **SearchInput**: Campo de busca com botão de limpar
- **AuthModal**: Modal de login com email/senha + Google OAuth
- **RouteMap**: Mapa Leaflet com markers numerados e polyline
- **RouteLoading**: Loading animado com fases visuais

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

1. Usuário seleciona atrações na `/app`
2. `RouteContext` armazena atrações + atração principal
3. `ResultsPage` calcula rotas chamando `routeCalculator.ts`
4. `routeCalculator.ts` faz chamadas sequenciais ao OSRM via Vite proxy:
   - `GET /api/osrm/driving/route/v1/driving/{coords}`
   - `GET /api/osrm/foot/route/v1/foot/{coords}`
   - `GET /api/osrm/cycling/route/v1/cycling/{coords}`
5. Respostas contêm polyline6 que é decodificada para coordenadas
6. `RouteMap.tsx` renderiza no Leaflet com markers numerados e polyline
7. Tempo/duração exibidos por modalidade

### Proxy (Vite dev)

`vite.config.ts` roteia:
- `/api/osrm/driving/*` → `https://routing.openstreetmap.de/routed-car`
- `/api/osrm/foot/*` → `https://routing.openstreetmap.de/routed-foot`
- `/api/osrm/cycling/*` → `https://routing.openstreetmap.de/routed-bike`

### Parse de coordenadas (PostGIS)

O Supabase retorna colunas `GEOGRAPHY` como WKB hex (binário). `utils/parseWKB.ts` decodifica strings EWKB para `{ lat, lng }`. Atrações com coordenadas `0,0` (Null Island) são filtradas antes de enviar ao OSRM.

### Travel Modes

| Modo do Usuário | Perfil OSRM |
|----------------|-------------|
| DIRIVING | `driving` |
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

## Licença

Projeto privado — Route Manager RJ.
