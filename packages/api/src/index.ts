import { createHTTPServer } from '@trpc/server/adapters/standalone'
import cors from 'cors'
import { appRouter } from './router'
import { createContext } from './trpc'
import { sql } from './db'
import { migrate } from './migrate'

const port = parseInt(process.env.PORT || '3001')

async function start() {
  await migrate(sql)

  const server = createHTTPServer({
    router: appRouter,
    createContext,
    middleware: cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    }),
  })

  server.listen(port)
  console.log(`tRPC server running on port ${port}`)
}

start()
