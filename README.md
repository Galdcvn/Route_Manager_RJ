# Route Manager RJ

Aplicativo de planejamento de rotas turísticas no Rio de Janeiro. O usuário seleciona os pontos que deseja visitar, define um ponto de partida, e o sistema calcula a melhor rota em ordem de eficiência.

---

## Funcionalidades

- Seleção de pontos turísticos com mapa interativo
- Cálculo automático da melhor rota por ordem de eficiência
- Sistema de favoritos (rotas e atrações)
- Internacionalização (Português, Inglês, Espanhol)
- Menu drawer com suporte a temas claro/escuro

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Navegação | React Router 7 |
| Backend/DB | Supabase (PostgreSQL + PostGIS + Auth) |
| Gerenciador de pacotes | Yarn |

---

## Estrutura do projeto

```
route-manager-rj/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
│
├── public/
│   └── favicon.svg
│
├── supabase/
│   └── schema.sql              # Schema completo do banco (14 tabelas)
│
├── Referencias_iniciais/        # Mockups e guia de estilo do Figma
│   ├── Buttons.png
│   ├── Group 51.png
│   ├── Logo.png
│   ├── Menu.png
│   ├── Paleta de cores.png
│   ├── Protótipo Página Inicial (Padrão Não Logado).png
│   └── Tipografia.png
│
└── src/
    ├── main.tsx                 # Entry point React
    ├── App.tsx                  # Router (3 rotas)
    │
    ├── styles/
    │   └── global.css           # Tokens de cor, fonte Montserrat, reset
    │
    ├── assets/
    │   ├── Logo.svg             # Logo RM RJ (Figma)
    │   └── Mapa_RJ.svg          # Mapa do Estado do RJ (Figma)
    │
    ├── components/
    │   ├── Header.tsx           # Header responsivo com nav + hamburger
    │   ├── Button.tsx           # Botão com 5 cores e 4 border-radius
    │   ├── MenuDrawer.tsx       # Drawer lateral (login + idiomas)
    │   └── AttractionCard.tsx   # Card de atração com estado selecionado
    │
    ├── pages/
    │   ├── HomePage.tsx         # Landing page (hero + mapa + CTA)
    │   ├── AppPage.tsx          # Seleção de atrações (breadcrumbs + cards)
    │   └── ResultsPage.tsx      # Dashboard de resultados (mapa + timeline)
    │
    └── utils/
        └── supabase.ts          # Cliente Supabase
```

---

## Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | HomePage | Landing page com hero, mapa do RJ e botão "Get Started" |
| `/app` | AppPage | Seleção de atrações com breadcrumbs e cards |
| `/results` | ResultsPage | Dashboard com mapa da rota, timeline e tempos por modalidade |

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
- **Header**: Logo + nav links (desktop) + hamburger (mobile)
- **MenuDrawer**: Drawer lateral com opções de Login e Idiomas
- **AttractionCard**: Card com imagem, nome e estado selecionado (borda rosa)

---

## Banco de Dados

Schema completo em `supabase/schema.sql` — 14 tabelas com PostGIS, RLS e seeds.

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
| | `atracoes` | Pontos de interesse com localização (PostGIS) |
| | `contato_atracao` | Telefone, site, redes sociais |
| | `endereco_atracao` | Endereço completo |
| | `informacao_atracao` | Descrição e horários por idioma |
| | `imagens` | Galeria de imagens |
| | `imagens_atracao` | Associação imagens ↔ atrações |
| | `atracoes_favoritas` | Atrações favoritas do usuário |
| **Rotas** | `status_rota` | Estados: rascunho, calculada, concluída |
| | `rotas` | Rotas com distância, duração e dados da API |
| | `rota_atracoes` | Atrações da rota com ordem |
| | `rotas_favoritas` | Rotas favoritas do usuário |

### Configuração de FKs

| Tipo | Configuração | Exemplo |
|------|-------------|---------|
| Tabelas principais | `ON DELETE RESTRICT` | rotas → usuario |
| Tabelas pivô | `ON DELETE CASCADE` | rota_atracoes, favoritos |
| Campo opcional | `ON DELETE SET NULL` | rotas.ponto_inicio_id |

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

---

## Como aplicar o banco de dados

1. Acesse o painel do Supabase
2. Vá em **SQL Editor**
3. Cole o conteúdo de `supabase/schema.sql`
4. Clique em **Run**

---

## Referências de design

Os mockups e guia de estilo estão em `Referencias_iniciais/`:

- **Buttons.png** — Variações de botões (cores × border-radius)
- **Group 51.png** — Wireframes das 3 telas
- **Logo.png** — Estudo da identidade visual RM RJ
- **Menu.png** — Drawer lateral (claro/escuro, logado/deslogado)
- **Paleta de cores.png** — Cores oficiais do projeto
- **Protótipo Página Inicial.png** — Mockup da homepage
- **Tipografia.png** — Especificação da fonte Gotham Pro (usamos Montserrat como alternativa gratuita)

---

## Licença

Projeto privado — Route Manager RJ.
