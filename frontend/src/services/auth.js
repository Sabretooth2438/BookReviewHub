import api from './axios'

export const signup = (email, password) =>
  api.post('/api/auth/signup', { email, password })

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password })

export const resetPassword = (oldPassword, newPassword) =>
  api.post('/api/auth/reset-password', { oldPassword, newPassword })

/**
 * If a token string is passed, send it explicitly in the header so the
 * very first profile call after login cannot race the interceptor.
 * Otherwise (token === undefined) fall back to the interceptor.
 */
export const fetchProfile = (token) =>
  api.get(
    '/api/auth/profile',
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  )

export const updateProfile = (username) =>
  api.put('/api/auth/profile', { username })

// avatar upload removed – placeholder SVG is always shown
