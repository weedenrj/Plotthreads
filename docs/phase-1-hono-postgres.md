# Phase 1: Hono API + Postgres Setup

> Auth implementation saved to `/docs/google-oauth-plan.md` for Phase 2.

## Goal

Hono API backend deployed to Railway with:
- Health check endpoint
- Postgres connection
- pnpm workspace structure working

## Architecture

```
plotthreads/
├── packages/
│   └── api/                    # Hono backend (NEW)
│       ├── src/
│       │   ├── index.ts        # Entry + health route
│       │   └── db.ts           # Postgres connection
│       ├── package.json
│       └── tsconfig.json
├── pnpm-workspace.yaml         # Enable workspaces
└── package.json                # Root scripts
```

## pnpm Workspace Setup

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

### Root package.json (add scripts)

```json
{
  "scripts": {
    "dev:api": "pnpm --filter @plotthreads/api dev",
    "build:api": "pnpm --filter @plotthreads/api build",
    "start:api": "pnpm --filter @plotthreads/api start"
  }
}
```

## packages/api Setup

### package.json

```json
{
  "name": "@plotthreads/api",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "hono": "^4",
    "@hono/node-server": "^1",
    "postgres": "^3"
  },
  "devDependencies": {
    "tsx": "^4",
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### src/index.ts

```typescript
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.get('/health', (c) => c.json({ status: 'ok' }))

const port = parseInt(process.env.PORT || '3001')
console.log(`Server running on port ${port}`)
serve({ fetch: app.fetch, port })
```

### src/db.ts

```typescript
import postgres from 'postgres'

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
})

export async function checkDb() {
  const result = await sql`SELECT 1 as ok`
  return result[0].ok === 1
}
```

## Railway Configuration

### Two Services in One Project

**Service 1: Frontend** (existing)
- Root: `/`
- Build: `pnpm build`

**Service 2: API** (new)
- Root: `/`
- Build: `pnpm install && pnpm build:api`
- Start: `pnpm start:api`
- Watch paths: `packages/api/**`

### Environment Variables (API service)

```
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
FRONTEND_URL=https://plotthreads.up.railway.app
NODE_ENV=production
```

### Add Postgres

1. In Railway project, click "+ New" → "Database" → "PostgreSQL"
2. Copy `DATABASE_URL` to API service variables (or use reference syntax)

### nixpacks.toml (if needed)

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["corepack enable && pnpm install"]
```

## Files to Create

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Enable workspaces |
| `packages/api/package.json` | API package config |
| `packages/api/tsconfig.json` | TypeScript config |
| `packages/api/src/index.ts` | Hono app entry |
| `packages/api/src/db.ts` | Postgres connection |

## Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add dev:api, build:api, start:api scripts |

## Verification

1. `pnpm install` - Workspace resolves, no errors
2. `pnpm dev:api` - Server starts on :3001
3. `curl localhost:3001/health` - Returns `{"status":"ok"}`
4. Deploy to Railway - Build succeeds
5. `curl https://api.../health` - Returns `{"status":"ok"}`
6. Add Postgres - Connection works
