import { Link } from 'react-router-dom'
import Button from '../Button'
import { useAuth } from '../../auth/AuthProvider'
import { roleFromToken } from '../../utils/jwt'

const Header = () => {
  const { token, dispatch } = useAuth()
  const role = roleFromToken(token)

  return (
    <header
      className="flex items-center justify-between p-4 
              bg-gray-800 text-white 
              sticky top-0 z-50"
    >
      <Link to="/" className="font-bold">
        BookReviewHub
      </Link>

      <nav className="space-x-4">
        {role === 'ADMIN' && (
          <>
            <Link to="/admin" className="hover:underline">
              Books&nbsp;▸
            </Link>
            <Link to="/admin/reviews" className="hover:underline">
              Reviews&nbsp;▸
            </Link>
          </>
        )}

        {token ? (
          <>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
            <Button onClick={() => dispatch({ type: 'LOGOUT' })}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
