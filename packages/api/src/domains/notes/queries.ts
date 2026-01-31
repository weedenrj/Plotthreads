import type { Sql } from 'postgres'

export type Note = {
  id: number
  content: string
  created_at: Date
}

export const noteQueries = {
  list: (sql: Sql) =>
    sql<Note[]>`SELECT * FROM notes ORDER BY created_at DESC`,

  getById: (sql: Sql, id: number) =>
    sql<Note[]>`SELECT * FROM notes WHERE id = ${id}`,

  create: (sql: Sql, content: string) =>
    sql<Note[]>`INSERT INTO notes (content) VALUES (${content}) RETURNING *`,

  update: (sql: Sql, id: number, content: string) =>
    sql<Note[]>`UPDATE notes SET content = ${content} WHERE id = ${id} RETURNING *`,

  delete: (sql: Sql, id: number) =>
    sql`DELETE FROM notes WHERE id = ${id}`,
}
