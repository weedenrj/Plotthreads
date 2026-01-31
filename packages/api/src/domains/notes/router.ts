import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../../trpc'
import { noteQueries } from './queries'

export const notesRouter = router({
  list: publicProcedure.query(({ ctx }) => noteQueries.list(ctx.sql)),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const [note] = await noteQueries.getById(ctx.sql, input.id)
      return note ?? null
    }),

  create: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const [note] = await noteQueries.create(ctx.sql, input.content)
      return note
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const [note] = await noteQueries.update(ctx.sql, input.id, input.content)
      return note ?? null
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await noteQueries.delete(ctx.sql, input.id)
      return { success: true }
    }),
})
