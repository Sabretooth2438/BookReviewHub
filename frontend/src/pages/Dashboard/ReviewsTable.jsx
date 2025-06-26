import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
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
  const { token } = useAuth()
  const role = roleFromToken(token)
  const ownerEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : ''

  /* books list */
  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  })
  const bookMap = Object.fromEntries(
    (books?.data ?? []).map((b) => [b.id, b.title])
  )

  /* filters */
  const [bookId, setBookId] = useState('')
  const [search, setSearch] = useState('')

  /* reviews */
  const {
    data: reviews,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['reviews', bookId || 'ALL'],
    queryFn: async () => {
      if (!books) return []

      /* single book selected → one call */
      if (bookId) return rev.fetchReviews(bookId).then((r) => r.data)

      /* all books → call them **in parallel** */
      const lists = await Promise.all(
        books.data.map((b) => rev.fetchReviews(b.id).then((r) => r.data))
      )
      return lists.flat()
    },
    staleTime: 1000 * 60 * 5, // 5 min
    enabled: !!books,
  })

  /* search filter */
  const visible =
    reviews?.filter((r) =>
      (r.content + (r.username ?? ''))
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    ) ?? []

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

        <div className="flex items-center gap-4 flex-wrap mb-4">
          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="border rounded p-2
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

          <Input
            className="max-w-xs"
            placeholder="Search text or user…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isFetching && (
          <p className="text-sm text-gray-500 mb-2 animate-pulse">Loading…</p>
        )}

        {visible.map((r) => (
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
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {!r.anonymous && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                )}
                <span>
                  by {r.anonymous ? 'Anonymous' : r.username || r.createdBy}
                </span>
              </div>
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editR.anonymous || false}
                onChange={(e) =>
                  setEditR({ ...editR, anonymous: e.target.checked })
                }
              />
              Post anonymously
            </label>
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
