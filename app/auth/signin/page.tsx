'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved, faEnvelope, faLock, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Welcome back!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-black dark:via-neutral-900 dark:to-stone-950 p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg mb-4">
            <FontAwesomeIcon icon={faShieldHalved} className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            SecureVault
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your personal password manager
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-neutral-800">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 focus:ring-4 focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          Your data is encrypted and secure
        </p>
      </div>
    </div>
  )
}
