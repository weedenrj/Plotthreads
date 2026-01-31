import { initTRPC, TRPCError } from '@trpc/server'
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { sql } from './db'
import { parseCookies } from './lib/cookies'
import { decryptSession, type SessionData } from './lib/session'

export type User = SessionData['user'] | null

export function createContext({ req, res }: CreateHTTPContextOptions) {
  const cookies = parseCookies(req.headers.cookie)
  const session = cookies.session ? decryptSession(cookies.session) : null
  const user: User = session?.user ?? null

  return { sql, req, res, user }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

export type ProtectedContext = Context & { user: NonNullable<Context['user']> }
