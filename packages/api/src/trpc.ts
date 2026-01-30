import { initTRPC } from '@trpc/server'
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { sql } from './db'

export function createContext({ req, res }: CreateHTTPContextOptions) {
  return { sql, req, res }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
