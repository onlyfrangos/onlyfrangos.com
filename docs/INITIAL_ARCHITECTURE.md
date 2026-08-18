# INITIAL ARCHITECTURE — OnlyFrangos

## 1. Visao geral

OnlyFrangos starts with two interfaces: Feed/Home and User Profile. The architecture favors clarity, contributor friendliness, and a modular monolith backend.

## 2. Principios da arquitetura

- Monorepo TypeScript with predictable structure.
- NestJS modular monolith (no microservices in MVP).
- Next.js feature-based frontend architecture.
- Minimal viable data model for Feed/Profile only.
- Cursor pagination and stable REST contracts.
- Avoid overengineering.

## 3. Stack e justificativas

- Monorepo: pnpm Workspaces + Turborepo.
- Frontend: Next.js + React + TypeScript + Tailwind + shadcn/ui when useful.
- Backend: NestJS + REST + Swagger.
- Data: PostgreSQL + Prisma + Redis future-ready.
- Dev: Docker Compose + ESLint + Prettier + tests + .env.example.

## 4. Estrutura do monorepo

```text
onlyfrangos/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   └── sdk/
├── prisma/
├── docs/
├── docker-compose.yml
├── pnpm-workspace.yaml
└── turbo.json
```

Responsibilities:

- apps/web: Feed and Profile UI.
- apps/api: auth/users/profiles/posts/follows/likes/comments/gyms.
- packages/ui: shared UI components.
- packages/types: shared API/domain types.
- packages/config: shared lint/format/ts settings.
- packages/sdk: typed API client.
- prisma: schema, migrations, seed.

## 5. Arquitetura do frontend

- App Router pages as composition layer.
- Domain features:
  - features/feed
  - features/profile
- Shared UI:
  - components/layout
  - components/primitives
- Data layer:
  - services/api-client
  - hooks (TanStack Query)

## 6. Componentes do Feed

- Sidebar/navigation
- Feed header
- Feed list
- Post card
- Author info
- Media
- Actions (like/comment)
- Likes summary
- Caption
- Comment preview
- Timestamp
- Suggestions
- Skeleton and empty states

## 7. Componentes do Perfil

- Avatar
- Username/name/bio
- Counters (posts/followers/following)
- Follow/unfollow button
- Gym and fitness goal
- Public physical info section (privacy-aware)
- External location link
- Physical evolution panel
- Post grid

## 8. Responsividade

- Desktop: sidebar + main + secondary column.
- Tablet: reduced secondary column.
- Mobile: bottom navigation and single-column content.

## 9. Arquitetura do backend

MVP modules:

- auth
- users
- profiles
- posts
- follows
- likes
- comments
- gyms

Future-ready only:

- media pipeline
- notifications
- advanced search

## 10. Modelo inicial de dados

Core entities:

- User
- Profile
- Post
- PostMedia
- Follow
- Like
- Comment
- Gym

IDs use UUID v7.

## 11. Endpoints REST

- GET /api/v1/feed
- GET /api/v1/users/:username
- GET /api/v1/users/:username/posts
- POST /api/v1/users/:id/follow
- DELETE /api/v1/users/:id/follow
- POST /api/v1/posts/:id/likes
- DELETE /api/v1/posts/:id/likes
- GET /api/v1/posts/:id/comments
- POST /api/v1/posts/:id/comments

## 12. Seeds/dados de desenvolvimento

- 5-10 users
- ~20 posts
- follows/likes/comments
- gym records
- profile privacy variations

## 13. Estrategia de testes

- Unit tests for services/components.
- Integration tests for API modules.
- Minimal E2E for auth, feed, and profile flows.

## 14. Experiencia de desenvolvimento

Target boot flow:

```bash
pnpm install
docker compose up -d
pnpm dev
```

## 15. Roadmap tecnico inicial

1. Bootstrap monorepo.
2. Local infra and env.
3. Prisma schema + migrations + seed.
4. API baseline.
5. Web layout baseline.
6. Feed screen.
7. Profile screen.
8. API integration.
9. Tests and docs.

## Implementation Order

### Phase 1 — Bootstrap do monorepo

- Objective: workspace and pipelines.
- Involved: root package.json, turbo.json, workspaces.
- Depends on: none.
- Done when: all tasks run from root.

### Phase 2 — Infraestrutura local

- Objective: PostgreSQL (Redis optional profile).
- Involved: docker-compose.yml, .env.example.
- Depends on: Phase 1.
- Done when: database starts and is reachable.

### Phase 3 — Banco e Prisma

- Objective: schema, migration, seed.
- Involved: prisma/*.
- Depends on: Phase 2.
- Done when: data can be generated and seeded.

### Phase 4 — API basica

- Objective: auth and social interaction endpoints.
- Involved: apps/api modules.
- Depends on: Phase 3.
- Done when: Swagger documents MVP endpoints.

### Phase 5 — Design system

- Objective: foundational reusable UI and tokens.
- Involved: packages/ui, apps/web styles.
- Depends on: Phase 1.
- Done when: base components power feed/profile layouts.

### Phase 6 — Layout principal

- Objective: responsive shell for desktop/tablet/mobile.
- Involved: apps/web layout.
- Depends on: Phase 5.
- Done when: nav and content adapt across breakpoints.

### Phase 7 — Feed

- Objective: chronological feed UI and interactions.
- Involved: apps/web feed features + API calls.
- Depends on: Phases 4 and 6.
- Done when: feed reads real API data.

### Phase 8 — Perfil

- Objective: profile UI with privacy-aware physical info.
- Involved: apps/web profile features + API calls.
- Depends on: Phases 4 and 6.
- Done when: profile renders user data and posts.

### Phase 9 — Integracao frontend/backend

- Objective: typed contracts and robust error handling.
- Involved: packages/types, packages/sdk, apps/web services.
- Depends on: Phases 7 and 8.
- Done when: end-to-end flows are stable.

### Phase 10 — Testes e documentacao

- Objective: OSS readiness.
- Involved: tests, README, CONTRIBUTING, CODE_OF_CONDUCT, LICENSE.
- Depends on: Phase 9.
- Done when: CI checks pass and onboarding is clear.
