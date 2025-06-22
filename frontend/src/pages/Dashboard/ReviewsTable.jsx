import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBooks } from '../../services/books'
import * as rev from '../../services/reviews'
import Header from '../../components/layout/Header'
import Button from '../../components/Button'
import Dialog from '../../components/Dialog'
import ConfirmDialog from '../../components/ConfirmDialog'
import Input from '../../components/Input'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { roleFromToken } from '../../utils/jwt'

const ReviewsTable = () => {
  const qc = useQueryClient()
  const { token } = useAuth()
  const role = roleFromToken(token)
  const ownerEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : ''

  /* books */
  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  })
  const bookMap = Object.fromEntries(
    (books?.data ?? []).map((b) => [b.id, b.title])
  )

  /* dropdown */
  const [bookId, setBookId] = useState('')

  const { data: reviews, refetch } = useQuery({
    queryKey: ['reviews', bookId || 'ALL'],
    queryFn: async () => {
      if (bookId) return rev.fetchReviews(bookId).then((r) => r.data)

      const all = []
      for (const b of books?.data ?? []) {
        const list = await rev.fetchReviews(b.id).then((r) => r.data)
        all.push(...list)
      }
      return all
    },
    enabled: !!books,
  })

  /* mutations */
  const save = useMutation({
    mutationFn: (r) => rev.updateReview(r.id, r),
    onSuccess: refetch,
  })
  const del = useMutation({
    mutationFn: rev.deleteReview,
    onSuccess: refetch,
  })

  /* local state */
  const [editR, setEditR] = useState(null)
  const [delId, setDelId] = useState(null)

  useEffect(() => {
    if (books) refetch()
  }, [bookId, books, refetch])

  const ownerOf = (r) => r.createdBy === ownerEmail

  return (
    <>
      <Header />

      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Reviews (admin)</h1>

        <select
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="border rounded p-2 mb-4
                     bg-white text-gray-900
                     dark:bg-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">— All Books —</option>
          {books?.data?.map((b) => (
            <option value={b.id} key={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        {reviews?.map((r) => (
          <div
            key={r.id}
            className="border-b py-2 flex justify-between items-start"
          >
            <div className="max-w-xl space-y-1">
              <Link
                to={`/book/${r.bookId}`}
                className="font-medium hover:underline"
              >
                {bookMap[r.bookId] ?? 'Unknown Book'}
              </Link>
              <p>{r.content}</p>
              <p className="text-xs text-gray-500">by {r.createdBy}</p>
            </div>

            <div className="space-x-2">
              {ownerOf(r) && (
                <>
                  <Button onClick={() => setEditR(r)}>Edit</Button>
                  <Button onClick={() => setDelId(r.id)}>Delete</Button>
                </>
              )}
              {role === 'ADMIN' && !ownerOf(r) && (
                <Button onClick={() => setDelId(r.id)}>Delete</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* edit dialog */}
      <Dialog open={!!editR} onClose={() => setEditR(null)}>
        {editR && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              save.mutate(editR, { onSuccess: () => setEditR(null) })
            }}
          >
            <h2 className="text-lg font-semibold">Edit Review</h2>
            <Input
              as="textarea"
              value={editR.content}
              onChange={(e) => setEditR({ ...editR, content: e.target.value })}
            />
            <Input
              type="number"
              value={editR.rating}
              onChange={(e) =>
                setEditR({ ...editR, rating: Number(e.target.value) })
              }
            />
            <Button type="submit" className="w-full">
              Update
            </Button>
          </form>
        )}
      </Dialog>

      {/* delete confirm */}
      <ConfirmDialog
        open={!!delId}
        title="Delete Review"
        message="Delete this review? This cannot be undone."
        onConfirm={() => del.mutate(delId)}
        onCancel={() => setDelId(null)}
      />
    </>
  )
}

export default ReviewsTable
