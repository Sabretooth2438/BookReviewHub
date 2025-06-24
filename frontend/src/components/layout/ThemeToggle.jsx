import { useState, useLayoutEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.theme === 'dark')

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.theme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed bottom-6 right-6 lg:right-8 z-50
                  w-12 h-12 grid place-items-center
                  rounded-full shadow-lg
                  bg-gray-800 text-white
                  dark:bg-gray-200 dark:text-gray-800"
      title="Toggle theme"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default ThemeToggle
