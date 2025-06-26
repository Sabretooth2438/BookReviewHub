import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchBooks,
  deleteBook,
  createBook,
  updateBook,
} from '../../services/books'
import Header from '../../components/layout/Header'
import Button from '../../components/Button'
import Dialog from '../../components/Dialog'
import ConfirmDialog from '../../components/ConfirmDialog'
import Input from '../../components/Input'
import StarRating from '../../components/StarRating'
import { Link } from 'react-router-dom'

const blank = {
  title: '',
  author: '',
  description: '',
  imageUrl: '',
  rating: 0,
}

const BooksTable = () => {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['books'], queryFn: fetchBooks })

  /* local ui state */
  const [search, setSearch] = useState('')
  const [formOpen, setOpen] = useState(false)
  const [draft, setDraft] = useState(blank)
  const [delId, setDelId] = useState(null)

  /* derived rows */
  const rows =
    data?.data?.filter((b) =>
      (b.title + b.author).toLowerCase().includes(search.trim().toLowerCase())
    ) ?? []

  /* helpers */
  const onFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => setDraft({ ...draft, imageUrl: r.result })
    r.readAsDataURL(f)
  }

  /* mutations */
  const save = useMutation({
    mutationFn: (b) =>
      b.id
        ? updateBook(b.id, { ...b, rating: undefined })
        : createBook({ ...b, rating: 0 }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  })

  const del = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  })

  return (
    <>
      <Header />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <h1 className="text-xl font-bold">Books (admin)</h1>

          {/* search bar */}
          <Input
            className="max-w-xs"
            placeholder="Search title or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button onClick={() => (setDraft(blank), setOpen(true))}>
            + Add
          </Button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border p-2">Cover</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr
                key={b.id}
                className="even:bg-gray-50 dark:even:bg-gray-900/40"
              >
                <td className="border p-2 w-20">
                  {b.imageUrl && (
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="aspect-[3/4] object-cover"
                    />
                  )}
                </td>
                <td className="border p-2">
                  <Link
                    to={`/book/${b.id}`}
                    className="font-medium hover:underline"
                  >
                    {b.title}
                  </Link>
                </td>
                <td className="border p-2">
                  <StarRating value={b.rating} />
                </td>
                <td className="border p-2 space-x-2">
                  <Button onClick={() => (setDraft(b), setOpen(true))}>
                    Edit
                  </Button>
                  <Button onClick={() => setDelId(b.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* create / edit dialog */}
      <Dialog open={formOpen} onClose={() => setOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            save.mutate(draft, { onSuccess: () => setOpen(false) })
          }}
        >
          <h2 className="text-lg font-semibold">
            {draft.id ? 'Edit Book' : 'Add Book'}
          </h2>

          <Input
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Input
            placeholder="Author"
            value={draft.author}
            onChange={(e) => setDraft({ ...draft, author: e.target.value })}
          />
          <Input
            as="textarea"
            placeholder="Description"
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
          />
          <Input
            placeholder="Image URL"
            value={draft.imageUrl}
            onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
          />
          <input type="file" onChange={onFile} />

          <Button type="submit" className="w-full">
            {draft.id ? 'Update' : 'Create'}
          </Button>
        </form>
      </Dialog>

      {/* delete confirm */}
      <ConfirmDialog
        open={!!delId}
        title="Delete Book"
        message="Delete this book? This cannot be undone."
        onConfirm={() => del.mutate(delId)}
        onCancel={() => setDelId(null)}
      />
    </>
  )
}

export default BooksTable
