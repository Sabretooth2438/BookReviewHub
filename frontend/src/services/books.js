import api from './axios'

export const fetchBooks = () => api.get('/api/books')
export const createBook = (data) => api.post('/api/books', data)
export const updateBook = (id, data) => api.put(`/api/books/${id}`, data)
export const deleteBook = (id) => api.delete(`/api/books/${id}`)
