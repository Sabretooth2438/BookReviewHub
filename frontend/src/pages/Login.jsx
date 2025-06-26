import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, fetchProfile } from '../services/auth'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../auth/AuthProvider'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPw] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const { dispatch } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)

    try {
      /* 1️⃣ authenticate */
      const { data } = await login(email, password)
      const jwt = data.token

      /* save token for the whole app */
      dispatch({ type: 'LOGIN', token: jwt })

      /* 2️⃣ fetch profile USING the fresh JWT explicitly
            → avoids race with Axios interceptor */
      const prof = await fetchProfile(jwt).then((r) => r.data)
      const needsUsername = !prof.username?.trim()

      /* 3️⃣ success banner then redirect */
      setMsg({ type: 'ok', text: 'Login successful.' })
      setTimeout(() => {
        nav(needsUsername ? '/profile' : '/')
      }, 800)
    } catch (err) {
      setMsg({ type: 'err', text: 'Invalid email or password.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form
        onSubmit={submit}
        className="w-80 space-y-4 bg-white dark:bg-gray-900/80
                    rounded-xl shadow p-6 ring-1 ring-gray-900/10 dark:ring-white/20"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {msg && (
          <div
            onClick={() => setMsg(null)}
            className={`p-3 rounded text-sm cursor-pointer ${
              msg.type === 'ok'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {msg.text}
          </div>
        )}

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

        <Button className="w-full" disabled={busy}>
          {busy ? 'Logging in…' : 'Login'}
        </Button>

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
