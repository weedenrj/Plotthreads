# Plotthreads

React + Vite + Tailwind PWA scaffold.

## Commands

```bash
pnpm dev              # Development server
pnpm build            # Production build
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
├── public/                 # Static assets
├── src/
│   ├── components/        # UI components
│   │   ├── ui/           # Base primitives (ShadCN)
│   │   └── features/     # Feature-specific components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Route-level components
│   ├── lib/              # Pure utilities
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
└── .claude/
    ├── agents/           # Subagent definitions
    └── commands/         # Slash command definitions
```

## Subagents

### `/component` - Component Library
Create, fix, update, or refactor components using ShadCN.

```
/component add button
/component fix Icon sizing
/component update ThreadCard add edit mode
```

### `/vally-code-review` - Code Review
Comprehensive code review for bugs and pattern drift.

```
/vally-code-review              # Review uncommitted changes
/vally-code-review main..HEAD   # Review branch commits
/vally-code-review abc123       # Review specific commit
```

### `/build-subagent` - Subagent Builder
Encode a workflow from the current conversation into a reusable subagent.

## Development Practices

### Guard Clauses
Validate early, return early. Avoid nested conditionals.

### Make Illegal States Unrepresentable
Use discriminated unions so TypeScript catches invalid states at compile time.

### Pure Core, Impure Shell
Keep pure logic in `lib/`. Side effects belong in hooks and components.

### Boring Code
Readable beats clever. If it needs a comment to explain, rewrite it.
