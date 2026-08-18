# OnlyFrangos

OnlyFrangos is an open source social network focused on fitness and gym community.

## Monorepo

- apps/web: Next.js frontend
- apps/api: NestJS backend
- packages/ui: shared UI primitives
- packages/types: shared types
- packages/config: shared tool configs
- packages/sdk: shared API client

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Start local dependencies:

```bash
docker compose up -d
```

3. Run apps in development:

```bash
pnpm dev
```

## Environment

Copy .env.example to .env and adjust values if needed.

## Architecture

See docs/INITIAL_ARCHITECTURE.md.
