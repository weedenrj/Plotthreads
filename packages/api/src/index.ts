import { config } from 'dotenv'
config({ path: '../../.env.local' })
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.get('/health', (c) => c.json({ status: 'ok' }))

const port = parseInt(process.env.PORT || '3001')
console.log(`Server running on port ${port}`)
serve({ fetch: app.fetch, port })
