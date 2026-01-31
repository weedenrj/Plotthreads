import { config } from 'dotenv'
config({ path: '../../.env.local' })

import postgres from 'postgres'

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : 'require',
})

export async function checkDb() {
  const result = await sql`SELECT 1 as ok`
  return result[0].ok === 1
}
