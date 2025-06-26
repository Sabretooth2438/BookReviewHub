import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import ResetPw from '../components/ResetPw'
import Input from '../components/Input'
import Button from '../components/Button'
import { fetchProfile, updateProfile } from '../services/auth'
import { useAuth } from '../auth/AuthProvider'
import defaultAvatar from '../assets/avatar.svg'

const Profile = () => {
  const [username, setUsername] = useState('')
  const [current, setCurrent] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [msg, setMsg] = useState(null)
  const { token } = useAuth()

  /* load profile once token is ready */
  useEffect(() => {
    if (!token) return
    fetchProfile().then((res) => {
      setCurrent(res.data.username || '')
      setUsername(res.data.username || '')
      setAvatarUrl(res.data.avatarUrl || '')
    })
  }, [token])

  /* username update */
  const submit = async (e) => {
    e.preventDefault()
    if (username.trim() === current.trim()) return
    await updateProfile(username.trim())
    setCurrent(username.trim())
    setMsg('✓ Username updated')
  }

  const avatarSrc = avatarUrl || defaultAvatar

  return (
    <>
      <Header />

      <main className="p-6 max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Account settings</h1>

        {msg && (
          <div
            onClick={() => setMsg(null)}
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300
                        px-3 py-2 rounded cursor-pointer text-sm text-center"
          >
            {msg}
          </div>
        )}

        {/* avatar + username */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover
                        bg-gray-200 dark:bg-gray-800
                        p-2 dark:invert"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <p className="text-sm text-gray-500">
            Current username: {current || <em>(none)</em>}
          </p>
        </div>

        {/* username form */}
        <form onSubmit={submit} className="space-y-3">
          <Input
            placeholder="Display name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Update profile
          </Button>
        </form>

        <ResetPw />
      </main>
    </>
  )
}

export default Profile
