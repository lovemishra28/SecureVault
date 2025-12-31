'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faTrash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { EncryptedData, CredentialFormData, Credential, Category } from '@/types'

interface CredentialModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CredentialFormData) => void
  categories: Category[]
  credential?: Credential | null
}

export function CredentialModal({
  isOpen,
  onClose,
  onSave,
  categories,
  credential,
}: CredentialModalProps) {
  const [formData, setFormData] = useState<CredentialFormData>({
    title: '',
    description: '',
    website: '',
    username: '',
    customerId: '',
    categoryId: categories[0]?.id || '',
    notes: '',
    sensitiveData: {},
  })
  const [customFields, setCustomFields] = useState<{ key: string; value: string }[]>([])
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (credential) {
      setFormData({
        title: credential.title,
        description: credential.description || '',
        website: credential.website || '',
        username: credential.username || '',
        customerId: credential.customerId || '',
        categoryId: credential.categoryId,
        notes: credential.notes || '',
        sensitiveData: credential.sensitiveData || {},
      })
      setCustomFields(credential.sensitiveData?.customFields || [])
    } else {
      setFormData({
        title: '',
        description: '',
        website: '',
        username: '',
        customerId: '',
        categoryId: categories[0]?.id || '',
        notes: '',
        sensitiveData: {},
      })
      setCustomFields([])
    }
  }, [credential, categories, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      sensitiveData: {
        ...formData.sensitiveData,
        customFields: customFields.filter((f) => f.key && f.value),
      },
    })
  }

  const updateSensitiveData = (field: keyof EncryptedData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sensitiveData: {
        ...prev.sensitiveData,
        [field]: value,
      },
    }))
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }])
  }

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...customFields]
    updated[index][field] = value
    setCustomFields(updated)
  }

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index))
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  if (!isOpen) return null

  const passwordFields = [
    { key: 'loginPassword', label: 'Login Password' },
    { key: 'transactionPassword', label: 'Transaction Password' },
    { key: 'smsPassword', label: 'SMS Password' },
    { key: 'pin', label: 'PIN' },
    { key: 'atmPin', label: 'ATM PIN' },
    { key: 'upiPin', label: 'UPI PIN' },
    { key: 'mpin', label: 'MPIN' },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white dark:bg-neutral-900 px-6 py-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {credential ? 'Edit Credential' : 'Add New Credential'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., HDFC Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username / User ID
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Sensitive Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Sensitive Information (Encrypted)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {passwordFields.map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords[key] ? 'text' : 'password'}
                        value={(formData.sensitiveData as Record<string, string>)[key] || ''}
                        onChange={(e) => updateSensitiveData(key as keyof EncryptedData, e.target.value)}
                        className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
                      >
                        <FontAwesomeIcon
                          icon={showPasswords[key] ? faEyeSlash : faEye}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Secret Question
                </label>
                <input
                  type="text"
                  value={formData.sensitiveData.secretQuestion || ''}
                  onChange={(e) => updateSensitiveData('secretQuestion', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Secret Answer
                </label>
                <div className="relative">
                  <input
                    type={showPasswords['secretAnswer'] ? 'text' : 'password'}
                    value={formData.sensitiveData.secretAnswer || ''}
                    onChange={(e) => updateSensitiveData('secretAnswer', e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('secretAnswer')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
                  >
                    <FontAwesomeIcon
                      icon={showPasswords['secretAnswer'] ? faEyeSlash : faEye}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Custom Fields
                </h3>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="flex items-center space-x-1 text-sm text-amber-600 hover:text-amber-700"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  <span>Add Field</span>
                </button>
              </div>

              {customFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Field name"
                    value={field.key}
                    onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomField(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder="Additional notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg"
              >
                {credential ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
