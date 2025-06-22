import { createContext, useReducer, useEffect, useContext } from 'react'
export const Auth = createContext()

/* ---------- helper hook ---------- */
export const useAuth = () => useContext(Auth) // ← add this

/* ---------- provider ---------- */
const init = () => localStorage.getItem('token') ?? null

function reducer(_, action) {
  if (action.type === 'LOGIN') {
    localStorage.setItem('token', action.token)
    return action.token
  }
  if (action.type === 'LOGOUT') {
    localStorage.removeItem('token')
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, dispatch] = useReducer(reducer, null, init)

  /* auto-logout when token expires */
  useEffect(() => {
    if (!token) return
    const { exp } = JSON.parse(atob(token.split('.')[1]))
    const ms = exp * 1000 - Date.now()
    const id = setTimeout(() => dispatch({ type: 'LOGOUT' }), ms)
    return () => clearTimeout(id)
  }, [token])

  return <Auth.Provider value={{ token, dispatch }}>{children}</Auth.Provider>
}
