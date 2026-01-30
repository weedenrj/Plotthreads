# Plotthreads

A React Progressive Web Application (PWA) for narrative thread management.

## Runtime Architecture

Plotthreads is a client-side Single Page Application (SPA) with PWA capabilities:

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   React SPA                         │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │    │
│  │  │  Pages   │  │Components│  │   Custom Hooks   │   │    │
│  │  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │    │
│  │       │             │                 │             │    │
│  │       └─────────────┴─────────────────┘             │    │
│  │                     │                               │    │
│  │              ┌──────┴──────┐                        │    │
│  │              │   lib/      │                        │    │
│  │              │  utilities  │                        │    │
│  │              └─────────────┘                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                  │
│  ┌───────────────────────┴───────────────────────────┐      │
│  │              Service Worker (PWA)                 │      │
│  │  • Offline caching  • Background sync  • Push     │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  External    │
                    │    APIs      │
                    └──────────────┘
```

**Key characteristics:**
- **Vite** as build tool with HMR for development
- **React Router** for client-side routing
- **Service Worker** for offline-first PWA capabilities
- **IndexedDB/LocalStorage** for client-side persistence

## Directory Structure

```
plotthreads/
├── public/                 # Static assets served as-is
│   ├── icons/             # PWA icons (generated)
│   └── manifest.webmanifest
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI primitives
│   │   └── features/     # Feature-specific components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Route-level page components
│   ├── lib/              # Pure utilities and helpers
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # Global styles and themes
│   ├── App.tsx           # Root application component
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
└── package.json
```

## Layer Responsibilities

### Pages (`src/pages/`)
Route-level components that compose features and handle page-specific logic.
- Map to routes in the router configuration
- Coordinate feature components
- Handle route parameters and navigation

### Components (`src/components/`)
Reusable UI building blocks following composition patterns.
- **ui/**: Base primitives (Button, Input, Card) - no business logic
- **features/**: Domain-specific components that compose primitives

#### Icon Component (`src/components/Icon.tsx`)

Centralized icon system using a name-based lookup. All SVG icons are defined in one place.

```typescript
import { Icon, type IconName } from './components/Icon'

// Usage
<Icon name="thread" />
<Icon name="connection" className="h-8 w-8" />

// Available icons (IconName type):
// 'thread' | 'connection' | 'timeline' | 'offline' | 'export' | 'secure'
```

**Adding new icons:**
1. Add the icon name to the `IconName` type union
2. Add the SVG path(s) to the `icons` record
3. Icons use a 24x24 viewBox with stroke-based rendering (strokeWidth 1.5)

### Hooks (`src/hooks/`)
Custom hooks that encapsulate reusable logic.
- State management patterns
- Side effect handling
- Data fetching logic

### Lib (`src/lib/`)
Pure utility functions with no React dependencies.
- Data transformations
- Validation logic
- API client wrappers
- Constants and configuration

## Commands

```bash
pnpm dev              # Development server with HMR
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm generate-pwa-assets  # Generate PWA icons from logo
```

## Code Quality Gates

All changes must pass before commit:

```bash
pnpm build && pnpm lint
```

Both commands must succeed with zero errors. No exceptions.

## Conventions

### Component Patterns

**File naming:**
- Components: `PascalCase.tsx` (e.g., `ThreadCard.tsx`)
- Hooks: `useXxx.ts` (e.g., `useThreads.ts`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Types: `types.ts` or `Xxx.types.ts`

**Props interfaces:**
```typescript
// Define props interface directly above component
interface ThreadCardProps {
  thread: Thread;
  onSelect: (id: string) => void;
  isActive?: boolean;
}

export function ThreadCard({ thread, onSelect, isActive = false }: ThreadCardProps) {
  // ...
}
```

**Component composition over prop drilling:**
```typescript
// Prefer compound components
<Thread>
  <Thread.Header title={thread.title} />
  <Thread.Content>{thread.body}</Thread.Content>
  <Thread.Actions onEdit={handleEdit} />
</Thread>

// Over deeply nested props
<Thread
  headerTitle={thread.title}
  content={thread.body}
  onHeaderEdit={handleEdit}
  // ... prop explosion
/>
```

### Custom Hooks

**Naming convention:** Always prefix with `use`

```typescript
// Good
export function useThreads() { }
export function useLocalStorage<T>(key: string) { }

// Bad
export function getThreads() { }  // Not a hook name
export function threadHook() { }  // Doesn't follow convention
```

**Return patterns:**
```typescript
// For state + actions, return object for named access
function useThread(id: string) {
  return { thread, isLoading, error, refetch };
}

// For simple state pairs, tuple is acceptable
function useToggle(initial: boolean): [boolean, () => void] {
  return [value, toggle];
}
```

### State Management

- **Local state**: `useState` for component-specific state
- **Shared state**: Context or state management library for cross-component state
- **Server state**: Dedicated data-fetching hooks with caching
- **URL state**: Use URL parameters for shareable/bookmarkable state

## PWA Conventions

### Service Worker Updates

Use the ReloadPrompt pattern for update notifications:

```typescript
// ReloadPrompt.tsx - notify users of available updates
function ReloadPrompt() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div role="alert">
      <p>New version available!</p>
      <button onClick={() => updateServiceWorker(true)}>
        Reload
      </button>
    </div>
  );
}
```

### Offline-First Design

- Cache critical assets in service worker
- Implement optimistic UI updates
- Queue mutations when offline, sync when online
- Show clear offline/online status indicators
- Gracefully degrade features requiring connectivity

### Manifest & Icons

Required icon sizes for `manifest.webmanifest`:
- 192x192 (standard)
- 512x512 (splash screen)
- 180x180 (Apple touch icon)

Use `pnpm generate-pwa-assets` to generate all required sizes from source logo.

---

## The Plotthreads Manifesto: Deterministic Clarity 2.0

> "Make it work, make it right, make it fast" — Kent Beck
> "Make it *deterministic*, make it *obvious*, make it *boring*" — Our addendum

### 1. Bouncer Pattern (Guard Clauses)

Validate inputs at the door. Invalid state never enters the building.

```typescript
// BAD: Nested conditionals, unclear flow
function ThreadEditor({ thread }: Props) {
  if (thread) {
    if (thread.canEdit) {
      if (!thread.isArchived) {
        return <Editor thread={thread} />;
      } else {
        return <ArchivedNotice />;
      }
    } else {
      return <ReadOnlyView thread={thread} />;
    }
  } else {
    return <EmptyState />;
  }
}

// GOOD: Guard clauses, linear flow
function ThreadEditor({ thread }: Props) {
  if (!thread) return <EmptyState />;
  if (!thread.canEdit) return <ReadOnlyView thread={thread} />;
  if (thread.isArchived) return <ArchivedNotice />;

  return <Editor thread={thread} />;
}
```

### 2. Design by Contract (DbC)

Functions declare their expectations. Violations are bugs in the caller.

```typescript
/**
 * Formats a thread for display.
 *
 * @precondition thread.id must be a valid UUID
 * @precondition thread.createdAt must be a valid Date
 * @postcondition returns formatted thread with displayDate string
 */
function formatThread(thread: Thread): FormattedThread {
  // Precondition checks (dev only, stripped in prod)
  if (import.meta.env.DEV) {
    invariant(isValidUUID(thread.id), `Invalid thread ID: ${thread.id}`);
    invariant(thread.createdAt instanceof Date, 'createdAt must be Date');
  }

  return {
    ...thread,
    displayDate: formatRelativeDate(thread.createdAt),
  };
}
```

### 3. Total Functions (Make Illegal States Unrepresentable)

Use TypeScript's type system to eliminate invalid states at compile time.

```typescript
// BAD: Runtime checks everywhere
interface Thread {
  status: string;
  publishedAt: Date | null;  // null when draft, set when published... maybe?
}

// GOOD: Types encode valid states
type Thread =
  | { status: 'draft'; publishedAt?: never }
  | { status: 'published'; publishedAt: Date }
  | { status: 'archived'; publishedAt: Date; archivedAt: Date };

// Now TypeScript enforces: published threads ALWAYS have publishedAt
function getPublishDate(thread: Thread): Date | null {
  if (thread.status === 'published' || thread.status === 'archived') {
    return thread.publishedAt;  // TypeScript knows this exists
  }
  return null;
}
```

### 4. Sanctified Core vs Impure Shell

Pure business logic in the center, side effects at the edges.

```typescript
// PURE CORE (src/lib/) - no side effects, easily testable
function calculateThreadScore(thread: Thread, interactions: Interaction[]): number {
  const recency = daysSince(thread.createdAt);
  const engagement = interactions.length;
  return engagement / Math.max(recency, 1);
}

function sortByScore(threads: Thread[], scores: Map<string, number>): Thread[] {
  return [...threads].sort((a, b) =>
    (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0)
  );
}

// IMPURE SHELL (hooks/components) - orchestrates side effects
function useRankedThreads() {
  const { threads } = useThreads();           // Side effect: data fetching
  const { interactions } = useInteractions(); // Side effect: data fetching

  return useMemo(() => {
    const scores = new Map(
      threads.map(t => [t.id, calculateThreadScore(t, interactions)])
    );
    return sortByScore(threads, scores);      // Pure transformation
  }, [threads, interactions]);
}
```

### 5. Let It Crash (Error Boundaries)

Unrecoverable errors should crash visibly. Error boundaries catch and report.

```typescript
// Component-level error boundary for graceful degradation
<ErrorBoundary
  fallback={<ThreadErrorFallback />}
  onError={(error) => reportToErrorService(error)}
>
  <ThreadList threads={threads} />
</ErrorBoundary>

// For truly unrecoverable states, crash explicitly
function useRequiredThread(id: string) {
  const { thread, error } = useThread(id);

  if (error) {
    throw error;  // Let error boundary handle it
  }

  if (!thread) {
    throw new Error(`Thread ${id} not found - this should never happen`);
  }

  return thread;  // Guaranteed to exist
}
```

### 6. Linear Railway Flow

Data flows in one direction. Transform or fail, never both.

```typescript
// BAD: Mixed success/failure handling
async function saveThread(data: unknown) {
  try {
    const validated = validate(data);
    if (!validated.success) {
      showError(validated.error);
      return;
    }
    const saved = await api.save(validated.data);
    if (saved.error) {
      showError(saved.error);
      return;
    }
    showSuccess('Saved!');
    return saved.data;
  } catch (e) {
    showError(e);
  }
}

// GOOD: Railway-oriented, each step transforms or fails
import { Result, ok, err } from '@/lib/result';

async function saveThread(data: unknown): Promise<Result<Thread, AppError>> {
  return pipe(
    data,
    validate,              // Result<ValidThread, ValidationError>
    andThen(api.save),     // Result<Thread, ApiError>
    mapError(toAppError),  // Result<Thread, AppError>
  );
}

// Usage in component - handle result at the edge
function useSaveThread() {
  return useMutation({
    mutationFn: saveThread,
    onSuccess: (result) => {
      result.match({
        ok: (thread) => toast.success(`Saved: ${thread.title}`),
        err: (error) => toast.error(error.message),
      });
    },
  });
}
```

### Real-World Example: Thread Creation Form

Applying all principles together:

```typescript
// types/thread.ts - Total Functions
type ThreadDraft = {
  title: string;
  content: string;
  tags: string[];
};

type ThreadCreateResult =
  | { success: true; thread: Thread }
  | { success: false; errors: ValidationError[] };

// lib/thread-validation.ts - Sanctified Core (pure)
function validateThreadDraft(draft: ThreadDraft): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!draft.title.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  }
  if (draft.title.length > 200) {
    errors.push({ field: 'title', message: 'Title must be under 200 characters' });
  }
  if (!draft.content.trim()) {
    errors.push({ field: 'content', message: 'Content is required' });
  }

  return errors;
}

// hooks/useCreateThread.ts - Impure Shell
function useCreateThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: ThreadDraft): Promise<ThreadCreateResult> => {
      // Bouncer: validate at the door
      const errors = validateThreadDraft(draft);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      // Railway: linear flow to API
      const thread = await api.threads.create(draft);
      return { success: true, thread };
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['threads'] });
      }
    },
  });
}

// components/features/CreateThreadForm.tsx - Component with guards
interface CreateThreadFormProps {
  onSuccess: (thread: Thread) => void;
  initialDraft?: Partial<ThreadDraft>;
}

export function CreateThreadForm({ onSuccess, initialDraft }: CreateThreadFormProps) {
  const { mutate, isPending, data } = useCreateThread();
  const [draft, setDraft] = useState<ThreadDraft>({
    title: initialDraft?.title ?? '',
    content: initialDraft?.content ?? '',
    tags: initialDraft?.tags ?? [],
  });

  // Guard: show errors if validation failed
  const errors = data?.success === false ? data.errors : [];

  // Guard: redirect on success
  useEffect(() => {
    if (data?.success) {
      onSuccess(data.thread);
    }
  }, [data, onSuccess]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(draft);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Title"
        value={draft.title}
        onChange={(title) => setDraft(d => ({ ...d, title }))}
        error={errors.find(e => e.field === 'title')?.message}
      />
      <FormField
        label="Content"
        value={draft.content}
        onChange={(content) => setDraft(d => ({ ...d, content }))}
        error={errors.find(e => e.field === 'content')?.message}
        multiline
      />
      <TagInput
        value={draft.tags}
        onChange={(tags) => setDraft(d => ({ ...d, tags }))}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Thread'}
      </Button>
    </form>
  );
}
```

---

*Remember: Boring code is reliable code. Clever code is legacy code.*
