import { config } from 'dotenv'
config({ path: '../../.env.local' })

import { createHTTPServer } from '@trpc/server/adapters/standalone'
import cors from 'cors'
import { appRouter } from './router'
import { createContext } from './trpc'

const port = parseInt(process.env.PORT || '3001')

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
