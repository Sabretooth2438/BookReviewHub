import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import ResetPw from '../components/ResetPw'
import Input from '../components/Input'
import Button from '../components/Button'
import { fetchProfile, updateProfile } from '../services/auth'

const Profile = () => {
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    fetchProfile().then((res) => {
      setUsername(res.data.username || '')
      setAvatarUrl(res.data.avatarUrl || '')
    })
  }, [])

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(reader.result)
    reader.readAsDataURL(file)
  }

  const submit = async (e) => {
    e.preventDefault()
    await updateProfile(username, avatarUrl)
  }

  return (
    <>
      <Header />
      <main className="p-6 max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Account settings</h1>
        <form onSubmit={submit} className="space-y-3">
          <Input
            placeholder="Display name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
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
