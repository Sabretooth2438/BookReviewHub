import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup, login } from '../services/auth'
import { useAuth } from '../auth/AuthProvider'
import Input from '../components/Input'
import Button from '../components/Button'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPw] = useState('')
  const [pw2, setPw2] = useState('')

  const { dispatch } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (password !== pw2) {
      alert('Passwords do not match')
      return
    }
    await signup(email, password)
    const { data } = await login(email, password)
    dispatch({ type: 'LOGIN', token: data.token })
    nav('/profile')
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form
        onSubmit={submit}
        className="w-80 space-y-4 bg-white dark:bg-gray-900/80 rounded-xl shadow p-6 ring-1 ring-gray-900/10 dark:ring-white/20"
      >
        <h1 className="text-2xl font-bold text-center">Signup</h1>

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
        <Input
          type="password"
          placeholder="Repeat password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
        />

        <Button className="w-full">Create account</Button>

        <p className="text-center text-sm">
          Have an account?{' '}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup
