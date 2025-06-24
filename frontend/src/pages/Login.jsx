import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, fetchProfile } from '../services/auth'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../auth/AuthProvider'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPw] = useState('')
  const { dispatch } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const { data } = await login(email, password)
    dispatch({ type: 'LOGIN', token: data.token })

    const prof = await fetchProfile().then((r) => r.data)
    const needsUsername = !prof.username?.trim()

    nav(needsUsername ? '/profile' : '/')
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form
        onSubmit={submit}
        className="w-80 space-y-4 bg-white dark:bg-gray-900/80
                    rounded-xl shadow p-6 ring-1 ring-gray-900/10 dark:ring-white/20"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPw(e.target.value)}
        />
        <Button className="w-full">Login</Button>

        <p className="text-center text-sm">
          No account?{' '}
          <Link to="/signup" className="underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
