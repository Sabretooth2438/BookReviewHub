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
  // legacy code referenced a username value on submit which caused a runtime
  // error after the username field was removed. Keep a variable so older
  // builds won't crash while the signup flow only requires email and password.
  const username = email
  const { dispatch } = useAuth()
  const nav = useNavigate()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

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
        className="w-80 space-y-4 bg-white dark:bg-gray-900/80
                    rounded-xl shadow p-6
                    ring-1 ring-gray-900/10 dark:ring-white/20"
      >
        <h1 className="text-2xl font-bold text-center">Signup</h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Display name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Avatar URL"
          value={avatarUrl}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <input type="file" onChange={handleFile} />
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
