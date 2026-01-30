# Plotthreads

A narrative thread management PWA built with React 19, Vite 7, and Tailwind CSS.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm generate-pwa-assets` | Regenerate PWA icons from logo |

## Tech Stack

- **React** 19.x
- **Vite** 7.x
- **TypeScript** 5.x
- **Tailwind CSS** 4.x
- **vite-plugin-pwa** for service worker and manifest

## PWA Features

- Installable on desktop and mobile
- Offline support via service worker
- Auto-update with user prompt
- Custom theme colors

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Route-level components
├── lib/            # Utilities and helpers
├── types/          # TypeScript definitions
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.
