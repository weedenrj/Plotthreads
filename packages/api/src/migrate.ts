import { readdir, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Sql } from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(__dirname, '../migrations')

export async function migrate(sql: Sql): Promise<void> {
  // Create migrations tracking table
  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  // Get already-applied migrations
  const applied = await sql<{ name: string }[]>`SELECT name FROM _migrations`
  const appliedSet = new Set(applied.map((m) => m.name))

  // Read migration files
  const files = await readdir(MIGRATIONS_DIR)
  const migrations = files
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b))

  // Apply new migrations
  for (const file of migrations) {
    if (appliedSet.has(file)) continue

    const filePath = join(MIGRATIONS_DIR, file)
    const content = await readFile(filePath, 'utf-8')

    console.log(`Applying migration: ${file}`)
    await sql.begin(async (tx) => {
      await tx.unsafe(content)
      await (tx as unknown as Sql)`INSERT INTO _migrations (name) VALUES (${file})`
    })
    console.log(`Applied: ${file}`)
  }
}
