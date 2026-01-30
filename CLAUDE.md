# Plotthreads

React + Vite + Tailwind PWA scaffold.

## Commands

```bash
pnpm dev              # Frontend + API concurrently
pnpm dev:web          # Frontend only (port 5173)
pnpm dev:api          # API only (port 3001)
pnpm build            # Production build (frontend)
pnpm build:api        # Production build (API)
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm generate-pwa-assets  # Generate PWA icons from logo
```

## Code Quality Gates

```bash
pnpm build && pnpm lint
```

Both must pass before commit.

## Directory Structure

```
plotthreads/
├── packages/
│   └── api/
│       └── src/
│           ├── index.ts        # Standalone tRPC server
│           ├── trpc.ts         # tRPC instance + context
│           ├── router.ts       # Root router + AppRouter type export
│           ├── db.ts           # Postgres connection
│           └── routers/        # Domain routers
│               └── health.ts
├── public/                     # Static assets
├── src/
│   ├── components/            # UI components
│   │   ├── ui/               # Base primitives (ShadCN)
│   │   └── features/         # Feature-specific components
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Route-level components
│   ├── lib/                  # Pure utilities + tRPC client
│   ├── types/                # TypeScript types
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
└── .claude/
    ├── agents/               # Subagent definitions
    └── commands/             # Slash command definitions
```

## Subagents

### `/component` - Component Library
Create, fix, update, or refactor components using ShadCN.

```
/component add button
/component fix Icon sizing
/component update ThreadCard add edit mode
```

### `/build-subagent` - Subagent Builder
Encode a workflow from the current conversation into a reusable subagent.

### `code-reviewer` agent
Comprehensive code review for bugs and pattern drift. Invoked automatically or via Task tool.

## Development Practices

### Guard Clauses
Validate early, return early. Avoid nested conditionals.

### Make Illegal States Unrepresentable
Use discriminated unions so TypeScript catches invalid states at compile time.

### Pure Core, Impure Shell
Keep pure logic in `lib/`. Side effects belong in hooks and components.

### Boring Code
Readable beats clever. If it needs a comment to explain, rewrite it.

## API Architecture

### Stack
- **Server**: tRPC standalone adapter (Node.js)
- **Client**: tRPC React + TanStack Query
- **Database**: Postgres via `postgres` driver
- **Validation**: Zod schemas

### Adding a New Router

1. Create `packages/api/src/routers/[name].ts`
2. Define procedures with Zod input validation
3. Export router from the file
4. Merge into `router.ts`

Example:
```typescript
// packages/api/src/routers/thread.ts
import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const threadRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.sql`SELECT * FROM threads`
  }),
  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const [thread] = await ctx.sql`
        INSERT INTO threads (title) VALUES (${input.title}) RETURNING *
      `
      return thread
    }),
})
```

### Frontend Usage

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/lib/trpc'

function Threads() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.thread.list.queryOptions())
  const createThread = useMutation(trpc.thread.create.mutationOptions())

  // TanStack Query patterns work as expected
}
```

### Type Flow

Types flow automatically from server to client:
1. Define procedure in `routers/*.ts` with Zod input + return type
2. Merge into `router.ts` (exports `AppRouter` type)
3. Frontend imports `AppRouter` type in `src/lib/trpc.ts`
4. All `trpc.*` calls have full autocomplete and type checking
