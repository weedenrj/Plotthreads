import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/lib/trpc'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Note = {
  id: number
  content: string
  created_at: string
}

export function Notes() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')

  const { data: notes, isLoading, error } = useQuery(trpc.notes.list.queryOptions())

  const createMutation = useMutation({
    ...trpc.notes.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.notes.list.queryKey() })
      setNewContent('')
    },
  })

  const updateMutation = useMutation({
    ...trpc.notes.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.notes.list.queryKey() })
      setEditingId(null)
      setEditContent('')
    },
  })

  const deleteMutation = useMutation({
    ...trpc.notes.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.notes.list.queryKey() })
    },
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent.trim()) return
    createMutation.mutate({ content: newContent })
  }

  const handleUpdate = (id: number) => {
    if (!editContent.trim()) return
    updateMutation.mutate({ id, content: editContent })
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditContent('')
  }

  if (error) {
    return (
      <div className="text-red-400">
        Error loading notes: {error.message}
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <form onSubmit={handleCreate} className="flex gap-3">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write a new note..."
          className="flex-1 rounded-lg border border-shadow-grey-700 bg-shadow-grey-900 px-4 py-2 text-ivory-100 placeholder:text-tan-400 focus:border-brandy-500 focus:outline-none"
        />
        <Button type="submit" disabled={createMutation.isPending || !newContent.trim()}>
          {createMutation.isPending ? 'Adding...' : 'Add Note'}
        </Button>
      </form>

      {isLoading ? (
        <div className="text-tan-300">Loading notes...</div>
      ) : notes?.length === 0 ? (
        <div className="text-tan-300">No notes yet. Create one above.</div>
      ) : (
        <div className="space-y-3">
          {notes?.map((note: Note) => (
            <Card key={note.id}>
              <CardContent className="flex items-center gap-3 p-4">
                {editingId === note.id ? (
                  <>
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 rounded-lg border border-shadow-grey-700 bg-shadow-grey-900 px-3 py-1.5 text-ivory-100 focus:border-brandy-500 focus:outline-none"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(note.id)}
                      disabled={updateMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{note.content}</span>
                    <Button size="sm" variant="ghost" onClick={() => startEditing(note)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate({ id: note.id })}
                      disabled={deleteMutation.isPending}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
