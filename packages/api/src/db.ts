import postgres from 'postgres'

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
})

export async function checkDb() {
  const result = await sql`SELECT 1 as ok`
  return result[0].ok === 1
}
