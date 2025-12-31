'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { CredentialCard } from '@/components/CredentialCard'
import { CredentialModal } from '@/components/CredentialModal'
import { CategoryModal } from '@/components/CategoryModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVault, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { CredentialFormData, EncryptedData } from '@/types'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  _count?: { credentials: number }
}

interface Credential {
  id: string
  title: string
  description?: string | null
  website?: string | null
  username?: string | null
  customerId?: string | null
  notes?: string | null
  categoryId: string
  sensitiveData: EncryptedData
  category?: Category
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  const fetchCredentials = useCallback(async () => {
    try {
      const url = selectedCategory
        ? `/api/credentials?categoryId=${selectedCategory}`
        : '/api/credentials'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setCredentials(data)
      }
    } catch (error) {
      console.error('Error fetching credentials:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchCategories()
      fetchCredentials()
    }
  }, [session, fetchCategories, fetchCredentials])

  const handleAddCredential = () => {
    setEditingCredential(null)
    setIsCredentialModalOpen(true)
  }

  const handleEditCredential = (credential: Credential) => {
    setEditingCredential(credential)
    setIsCredentialModalOpen(true)
  }

  const handleSaveCredential = async (data: CredentialFormData) => {
    try {
      const url = editingCredential
        ? `/api/credentials/${editingCredential.id}`
        : '/api/credentials'
      const method = editingCredential ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success(editingCredential ? 'Credential updated!' : 'Credential added!')
        setIsCredentialModalOpen(false)
        fetchCredentials()
        fetchCategories()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to save credential')
      }
    } catch (error) {
      console.error('Error saving credential:', error)
      toast.error('Failed to save credential')
    }
  }

  const handleDeleteCredential = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) return

    try {
      const res = await fetch(`/api/credentials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Credential deleted!')
        fetchCredentials()
        fetchCategories()
      } else {
        toast.error('Failed to delete credential')
      }
    } catch (error) {
      console.error('Error deleting credential:', error)
      toast.error('Failed to delete credential')
    }
  }

  const handleSaveCategory = async (data: { name: string; icon: string; color: string }) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Category created!')
        setIsCategoryModalOpen(false)
        fetchCategories()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    }
  }

  const filteredCredentials = credentials.filter((cred) => {
    const matchesSearch =
      searchQuery === '' ||
      cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your vault...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header
        onAddNew={handleAddCredential}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={() => setIsCategoryModalOpen(true)}
        />

        <main className="flex-1 p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : 'All Credentials'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {filteredCredentials.length} item{filteredCredentials.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Credentials Grid */}
          {filteredCredentials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCredentials.map((credential) => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  onEdit={handleEditCredential}
                  onDelete={handleDeleteCredential}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-6 bg-gray-100 dark:bg-neutral-900 rounded-full mb-4">
                <FontAwesomeIcon icon={faVault} className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No credentials found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Start by adding your first credential'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddCredential}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg"
                >
                  Add Credential
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CredentialModal
        isOpen={isCredentialModalOpen}
        onClose={() => setIsCredentialModalOpen(false)}
        onSave={handleSaveCredential}
        categories={categories}
        credential={editingCredential}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
