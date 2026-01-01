'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; icon: string; color: string }) => void
}

const iconOptions = [
  { value: 'building-columns', label: 'Bank' },
  { value: 'file-lines', label: 'Document' },
  { value: 'share-nodes', label: 'Social' },
  { value: 'envelope', label: 'Email' },
  { value: 'id-card', label: 'ID Card' },
  { value: 'folder', label: 'Folder' },
  { value: 'globe', label: 'Globe' },
  { value: 'credit-card', label: 'Card' },
  { value: 'key', label: 'Key' },
  { value: 'lock', label: 'Lock' },
  { value: 'wallet', label: 'Wallet' },
]

const colorOptions = [
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#84cc16', // Lime
  '#f97316', // Orange
]

export function CategoryModal({ isOpen, onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('folder')
  const [color, setColor] = useState('#FFAD33')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, icon, color })
    setName('')
    setIcon('folder')
    setColor('#FFAD33')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
          {/* Modal Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Add New Category
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Investment Accounts"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {iconOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIcon(opt.value)}
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                      icon === opt.value
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300'
                    }`}
                    title={opt.label}
                  >
                    <span className="text-sm sm:text-lg">{opt.label.slice(0, 2)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      color === c ? 'ring-2 ring-offset-2 ring-amber-500' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
