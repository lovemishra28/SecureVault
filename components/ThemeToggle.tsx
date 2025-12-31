'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-gray-200 dark:bg-neutral-800 w-10 h-10">
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors"
      aria-label="Toggle theme"
    >
      <FontAwesomeIcon
        icon={theme === 'dark' ? faSun : faMoon}
        className="w-5 h-5 text-gray-800 dark:text-amber-400"
      />
    </button>
  )
}
