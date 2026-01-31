import { router } from './trpc'
import { healthRouter } from './routers/health'
import { authRouter } from './routers/auth'
import { notesRouter } from './domains/notes/router'

export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  notes: notesRouter,
})

export type AppRouter = typeof appRouter
