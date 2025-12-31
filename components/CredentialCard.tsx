'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faCopy,
  faEdit,
  faTrash,
  faExternalLink,
  faUser,
  faIdCard,
  faBuildingColumns,
  faFileLines,
  faShareNodes,
  faEnvelope,
  faFolder,
  faGlobe,
  faCreditCard,
  faKey,
  faLock,
  faWallet,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'
import { EncryptedData, Credential } from '@/types'

const iconMap: Record<string, IconDefinition> = {
  'building-columns': faBuildingColumns,
  'file-lines': faFileLines,
  'share-nodes': faShareNodes,
  envelope: faEnvelope,
  'id-card': faIdCard,
  folder: faFolder,
  globe: faGlobe,
  'credit-card': faCreditCard,
  key: faKey,
  lock: faLock,
  wallet: faWallet,
}

interface CredentialCardProps {
  credential: Credential
  onEdit: (credential: Credential) => void
  onDelete: (id: string) => void
}

export function CredentialCard({ credential, onEdit, onDelete }: CredentialCardProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  const togglePassword = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const renderPasswordField = (label: string, value: string | undefined, fieldKey: string) => {
    if (!value) return null
    
    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">
            {showPasswords[fieldKey] ? value : '••••••••'}
          </span>
          <button
            onClick={() => togglePassword(fieldKey)}
            className="p-1 text-gray-400 hover:text-amber-500 transition-colors"
            title={showPasswords[fieldKey] ? 'Hide' : 'Show'}
          >
            <FontAwesomeIcon
              icon={showPasswords[fieldKey] ? faEyeSlash : faEye}
              className="w-4 h-4"
            />
          </button>
          <button
            onClick={() => copyToClipboard(value, label)}
            className="p-1 text-gray-400 hover:text-amber-500 transition-colors"
            title="Copy"
          >
            <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  const categoryIcon = credential.category?.icon || 'folder'
  const categoryColor = credential.category?.color || '#6366f1'

  return (
    <div className="card-hover bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-800 overflow-hidden animate-fade-in">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              <FontAwesomeIcon
                icon={iconMap[categoryIcon] || faFolder}
                className="w-5 h-5"
                style={{ color: categoryColor }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {credential.title}
              </h3>
              {credential.category && (
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor,
                  }}
                >
                  {credential.category.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(credential)}
              className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(credential.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-1">
        {credential.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {credential.description}
          </p>
        )}

        {/* Website Link */}
        {credential.website && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-neutral-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">Website</span>
            <a
              href={credential.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 hover:underline text-sm"
            >
              <span className="truncate max-w-[150px]">{credential.website}</span>
              <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Username */}
        {credential.username && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-neutral-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-2" />
              Username
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{credential.username}</span>
              <button
                onClick={() => copyToClipboard(credential.username!, 'Username')}
                className="p-1 text-gray-400 hover:text-amber-500 transition-colors"
              >
                <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Customer ID */}
        {credential.customerId && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-neutral-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon icon={faIdCard} className="w-3 h-3 mr-2" />
              Customer ID
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{credential.customerId}</span>
              <button
                onClick={() => copyToClipboard(credential.customerId!, 'Customer ID')}
                className="p-1 text-gray-400 hover:text-amber-500 transition-colors"
              >
                <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Sensitive Data Fields */}
        {renderPasswordField('Login Password', credential.sensitiveData.loginPassword, 'loginPassword')}
        {renderPasswordField('Transaction Password', credential.sensitiveData.transactionPassword, 'transactionPassword')}
        {renderPasswordField('SMS Password', credential.sensitiveData.smsPassword, 'smsPassword')}
        {renderPasswordField('PIN', credential.sensitiveData.pin, 'pin')}
        {renderPasswordField('ATM PIN', credential.sensitiveData.atmPin, 'atmPin')}
        {renderPasswordField('UPI PIN', credential.sensitiveData.upiPin, 'upiPin')}
        {renderPasswordField('MPIN', credential.sensitiveData.mpin, 'mpin')}
        {renderPasswordField('Secret Question', credential.sensitiveData.secretQuestion, 'secretQuestion')}
        {renderPasswordField('Secret Answer', credential.sensitiveData.secretAnswer, 'secretAnswer')}

        {/* Custom Fields */}
        {credential.sensitiveData.customFields?.map((field, index) => (
          renderPasswordField(field.key, field.value, `custom-${index}`)
        ))}

        {/* Notes */}
        {credential.notes && (
          <div className="pt-3 mt-2 border-t border-gray-200 dark:border-neutral-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Notes</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{credential.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
