import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/auth'
import { useAuth } from '../auth/AuthProvider'
import Input from './Input'
import Button from './Button'

const ResetPw = () => {
  const [oldPw, setOldPw] = useState('')
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const { dispatch } = useAuth()
  const nav = useNavigate()

  const same = pw1 === pw2 && pw1.trim()

  const doReset = async () => {
    if (!same) {
      setMsg({ type: 'err', text: 'New passwords do not match' })
      return
    }
    setBusy(true)
    setMsg(null)

    try {
      await resetPassword(oldPw.trim(), pw1.trim())
      setMsg({ type: 'ok', text: 'Password updated. Please log in again.' })

      setTimeout(() => {
        dispatch({ type: 'LOGOUT' })
        nav('/login')
      }, 1500)
    } catch (e) {
      const text =
        e.response?.status === 401
          ? 'Current password is incorrect'
          : 'Reset failed. Try again.'
      setMsg({ type: 'err', text })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4 max-w-sm">
      {msg && (
        <div
          className={`p-3 rounded text-sm ${
            msg.type === 'ok'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {msg.text}
        </div>
      )}

      <Input
        type="password"
        placeholder="Current password"
        value={oldPw}
        onChange={(e) => setOldPw(e.target.value)}
      />
      <Input
        type="password"
        placeholder="New password"
        value={pw1}
        onChange={(e) => setPw1(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Repeat new password"
        value={pw2}
        onChange={(e) => setPw2(e.target.value)}
      />

      <Button onClick={doReset} disabled={busy || !same}>
        {busy ? 'Updating…' : 'Reset password'}
      </Button>
    </div>
  )
}

export default ResetPw
