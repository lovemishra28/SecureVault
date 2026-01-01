'use client'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldHalved,
  faRightFromBracket,
  faPlus,
  faSearch,
  faUser,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { signOut, useSession } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import { useState } from 'react'

interface HeaderProps {
  onAddNew?: () => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onMenuToggle?: () => void
}

export function Header({ onAddNew, searchQuery, onSearchChange, onMenuToggle }: HeaderProps) {
  const { data: session } = useSession()
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Menu + Logo */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 md:hidden"
              >
                <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl">
                <FontAwesomeIcon icon={faShieldHalved} className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent hidden xs:inline">
                SecureVault
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          {onSearchChange && (
            <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  type="text"
                  placeholder="Search credentials..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Search Toggle */}
            {onSearchChange && (
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 md:hidden"
              >
                <FontAwesomeIcon icon={showMobileSearch ? faTimes : faSearch} className="w-5 h-5" />
              </button>
            )}
            
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/25"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            )}

            <ThemeToggle />

            {/* User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session?.user?.email}
                </p>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {onSearchChange && showMobileSearch && (
          <div className="py-3 md:hidden">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                type="text"
                placeholder="Search credentials..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
