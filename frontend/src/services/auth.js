import api from './axios'

export const signup = (email, password) =>
  api.post('/api/auth/signup', { email, password })

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password })

export const resetPassword = (oldPassword, newPassword) =>
  api.post('/api/auth/reset-password', { oldPassword, newPassword })

// Fetches the current user's profile. If a token is provided, it includes it in the request headers.

export const fetchProfile = (token) =>
  api.get(
    '/api/auth/profile',
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  )

export const updateProfile = (username) =>
  api.put('/api/auth/profile', { username })
