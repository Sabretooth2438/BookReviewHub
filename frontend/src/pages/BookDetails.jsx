import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBooks } from '../services/books'
import * as rev from '../services/reviews'
import Header from '../components/layout/Header'
import StarRating from '../components/StarRating'
import Button from '../components/Button'
import Dialog from '../components/Dialog'
import ConfirmDialog from '../components/ConfirmDialog'
import Input from '../components/Input'
import { useAuth } from '../auth/AuthProvider'
import defaultAvatar from '../assets/avatar.svg'

const BookDetails = () => {
  const { id } = useParams()
  const qc = useQueryClient()
  const { token } = useAuth()
  const ownerEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : ''

  const { data: book } = useQuery({
    queryKey: ['books', id],
    queryFn: fetchBooks,
    select: (res) => res.data.find((b) => b.id === id),
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => rev.fetchReviews(id).then((r) => r.data),
  })

  const invalidateBook = () => qc.invalidateQueries({ queryKey: ['books', id] })

  const make = useMutation({
    mutationFn: (d) => rev.createReview(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', id] })
      invalidateBook()
    },
  })

  const update = useMutation({
    mutationFn: (r) => rev.updateReview(r.id, r),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', id] })
      invalidateBook()
    },
  })

  const del = useMutation({
    mutationFn: rev.deleteReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', id] })
      invalidateBook()
    },
  })

  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [anonymous, setAnonymous] = useState(false)
  const [editR, setEditR] = useState(null)
  const [delId, setDelId] = useState(null)

  if (!book) return null

  return (
    <>
      <Header />

      <section className="p-6 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-900/80 rounded-xl p-6 shadow">
          {/* cover */}
          {book.imageUrl && (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full max-w-xs mx-auto aspect-[3/4] object-cover mb-6"
              onError={(e) => (e.currentTarget.style.opacity = 0)}
            />
          )}

          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{book.author}</p>

          <div className="flex items-center gap-2 mb-4">
            <StarRating value={book.rating} />
            <span className="text-sm text-gray-500">
              ({book.rating.toFixed(1)})
            </span>
          </div>

          <div className="mt-4 max-h-60 overflow-y-auto whitespace-pre-line">
            {book.description}
          </div>

          {/* ── review form ── */}
          {token && (
            <div className="my-6 space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Post anonymously
              </label>
              <textarea
                className="w-full border rounded p-2 bg-white dark:bg-gray-800"
                placeholder="Write a review…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarRating value={rating} onChange={setRating} />
                  <span className="text-sm text-gray-500">({rating})</span>
                </div>
                <Button
                  onClick={() => {
                    make.mutate({
                      content,
                      rating: Number(rating),
                      anonymous,
                    })
                    setContent('')
                    setRating(0)
                    setAnonymous(false)
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          {/* ── reviews ── */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Reviews</h2>

          <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
            {reviews?.map((r) => {
              const owner = r.createdBy === ownerEmail
              const avatarSrc = r.avatarUrl || defaultAvatar

              return (
                <article
                  key={r.id}
                  className="border-b pb-3 flex justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <StarRating value={r.rating} />
                      <span className="text-sm text-gray-500">
                        ({r.rating})
                      </span>
                    </div>
                    <p>{r.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {!r.anonymous && (
                        <img
                          src={r.avatarUrl || defaultAvatar}
                          alt={r.username || 'avatar'}
                          className="w-6 h-6 rounded-full object-cover
                                      bg-gray-300 dark:bg-gray-700
                                      p-1 dark:invert"
                          onError={(e) => (e.currentTarget.src = defaultAvatar)}
                        />
                      )}
                      <span>
                        by{' '}
                        {r.anonymous ? 'Anonymous' : r.username || r.createdBy}
                      </span>
                    </div>
                  </div>

                  {owner && (
                    <div className="space-x-2">
                      <Button onClick={() => setEditR(r)}>Edit</Button>
                      <Button onClick={() => setDelId(r.id)}>Delete</Button>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* edit dialog */}
      <Dialog open={!!editR} onClose={() => setEditR(null)}>
        {editR && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              update.mutate(editR, { onSuccess: () => setEditR(null) })
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
            <div className="flex items-center gap-2">
              <StarRating
                value={editR.rating}
                onChange={(val) => setEditR({ ...editR, rating: val })}
              />
              <span className="text-sm text-gray-500">({editR.rating})</span>
            </div>
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
        onConfirm={() => {
          del.mutate(delId)
          setDelId(null)
        }}
        onCancel={() => setDelId(null)}
      />
    </>
  )
}

export default BookDetails
