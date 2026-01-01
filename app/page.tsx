'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-black dark:via-neutral-900 dark:to-stone-950 flex flex-col">
      {/* Header */}
      <header className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl">
              <FontAwesomeIcon icon={faShieldHalved} className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              SecureVault
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <Link
              href="/auth/signin"
              className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section - Centered */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-0">
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg mb-6 sm:mb-8">
            <FontAwesomeIcon icon={faShieldHalved} className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Your Personal
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              {' '}Secure Vault
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 px-4">
            Store and manage your passwords, bank credentials, and sensitive information
            with military-grade encryption.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-xl text-base sm:text-lg hover:from-amber-500 hover:to-amber-700 transition-all shadow-xl hover:shadow-amber-500/25"
            >
              Create Your Vault
            </Link>
            <Link
              href="/auth/signin"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-xl text-base sm:text-lg font-medium border border-gray-300 dark:border-neutral-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all"
            >
              Access Your Vault
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
        <p>© 2024 SecureVault. Your data, secured.</p>
      </footer>
    </div>
  )
}
