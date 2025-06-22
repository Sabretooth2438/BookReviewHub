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
import { useAuth } from '../auth/AuthProvider'

const BookDetails = () => {
  const { id } = useParams()
  const qc = useQueryClient()
  const { token } = useAuth()
  const ownerEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : ''

  /* book query */
  const { data: book } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
    select: (res) => res.data.find((b) => b.id === id),
  })

  /* reviews query */
  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => rev.fetchReviews(id).then((r) => r.data),
  })

  /* mutations */
  const make = useMutation({
    mutationFn: (d) => rev.createReview(id, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', id] }),
  })
  const update = useMutation({
    mutationFn: (r) => rev.updateReview(r.id, r),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', id] }),
  })
  const del = useMutation({
    mutationFn: rev.deleteReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', id] }),
  })

  /* local state */
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [editR, setEditR] = useState(null)
  const [delId, setDelId] = useState(null)

  if (!book) return null

  return (
    <>
      <Header />

      <section className="p-6 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-900/80 rounded-xl p-6 shadow">
          {book.imageUrl && (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full max-w-xs mx-auto aspect-[3/4] object-contain mb-6"
            />
          )}

          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{book.author}</p>
          <StarRating value={book.rating} />

          <div className="mt-4 max-h-60 overflow-y-auto whitespace-pre-line">
            {book.description}
          </div>

          {token && (
            <div className="my-6 space-y-3">
              <textarea
                className="w-full border rounded p-2 bg-white dark:bg-gray-800"
                placeholder="Write a review…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <input
                type="number"
                min="0"
                max="5"
                className="border rounded p-2 w-24 bg-white dark:bg-gray-800"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <Button
                onClick={() => make.mutate({ content, rating: Number(rating) })}
              >
                Submit
              </Button>
            </div>
          )}

          <h2 className="text-xl font-semibold mt-8 mb-4">Reviews</h2>

          {reviews?.map((r) => {
            const owner = r.createdBy === ownerEmail
            return (
              <article
                key={r.id}
                className="border-b py-4 flex justify-between"
              >
                <div>
                  <StarRating value={r.rating} />
                  <p>{r.content}</p>
                  <p className="text-xs text-gray-500">by {r.createdBy}</p>
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
      </section>

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

export default BookDetails
