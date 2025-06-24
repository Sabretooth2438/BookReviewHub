import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import ResetPw from '../components/ResetPw'
import Input from '../components/Input'
import Button from '../components/Button'
import { fetchProfile, updateProfile, uploadAvatar } from '../services/auth'

const Profile = () => {
  const [username, setUsername] = useState('')
  const [current, setCurrent] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [msg, setMsg] = useState(null)

  /* ── load profile ── */
  useEffect(() => {
    fetchProfile().then((res) => {
      setCurrent(res.data.username || '')
      setUsername(res.data.username || '')
      setAvatarUrl(res.data.avatarUrl || '')
    })
  }, [])

  /* ── avatar upload ── */
  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const { data } = await uploadAvatar(file)
    setAvatarUrl(data.url)
    setMsg('✓ Profile image updated')
  }

  /* ── username update ── */
  const submit = async (e) => {
    e.preventDefault()
    if (username.trim() === current.trim()) return
    await updateProfile(username.trim())
    setCurrent(username.trim())
    setMsg('✓ Username updated')
  }

  return (
    <>
      <Header />

      <main className="p-6 max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Account settings</h1>

        {msg && (
          <div
            onClick={() => setMsg(null)}
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300
                        px-3 py-2 rounded cursor-pointer text-sm"
          >
            {msg}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Current username: {current || <em>(none)</em>}
          </p>

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-20 h-20 rounded-full"
            />
          )}
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Input
            placeholder="Display name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input type="file" onChange={handleFile} />
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
