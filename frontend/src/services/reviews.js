import api from './axios'

export const fetchReviews = (bookId) => api.get(`/api/reviews/book/${bookId}`)

export const createReview = (bookId, data) =>
  api.post(`/api/reviews/book/${bookId}`, data)

export const updateReview = (id, data) => api.put(`/api/reviews/${id}`, data)

export const deleteReview = (id) => api.delete(`/api/reviews/${id}`)
