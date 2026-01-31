import { router } from './trpc'
import { healthRouter } from './routers/health'
import { notesRouter } from './domains/notes/router'

export const appRouter = router({
  health: healthRouter,
  notes: notesRouter,
})

export type AppRouter = typeof appRouter
