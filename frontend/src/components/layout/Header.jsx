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
                  bg-gray-800 text-white sticky top-0 z-50"
    >
      <Link to="/" className="font-bold">
        BookReviewHub
      </Link>

      <nav className="flex items-center gap-4">
        {role === 'ADMIN' && (
          <>
            <Link to="/admin" className="hover:underline whitespace-nowrap">
              Books&nbsp;▸
            </Link>
            <Link
              to="/admin/reviews"
              className="hover:underline whitespace-nowrap"
            >
              Reviews&nbsp;▸
            </Link>
          </>
        )}

        {token ? (
          <>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </button>
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
