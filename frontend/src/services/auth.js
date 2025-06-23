import api from './axios'

export const signup = (email, password, username, avatarUrl) =>
  api.post('/api/auth/signup', { email, password, username, avatarUrl })

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password })

export const resetPassword = (oldPassword, newPassword) =>
  api.post('/api/auth/reset-password', { oldPassword, newPassword })

export const fetchProfile = () => api.get('/api/auth/profile')

export const updateProfile = (username) =>
  api.put('/api/auth/profile', { username })

export const uploadAvatar = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/api/auth/profile/avatar', fd)
}
