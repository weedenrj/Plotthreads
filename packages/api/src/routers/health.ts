import { router, publicProcedure } from '../trpc'
import { checkDb } from '../db'

export const healthRouter = router({
  check: publicProcedure.query(async () => {
    const dbOk = await checkDb()
    return { status: 'ok', db: dbOk }
  }),
})
