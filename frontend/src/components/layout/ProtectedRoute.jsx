import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

const ProtectedRoute = ({ role, children }) => {
  const { token } = useAuth()

  const hasRole = () => {
    if (!role) return !!token
    try {
      const [, payload] = token.split('.')
      return JSON.parse(atob(payload)).role === role
    } catch {
      return false
    }
  }

  return hasRole() ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
