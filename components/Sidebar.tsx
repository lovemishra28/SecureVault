'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuildingColumns,
  faFileLines,
  faShareNodes,
  faEnvelope,
  faIdCard,
  faFolder,
  faGlobe,
  faCreditCard,
  faKey,
  faLock,
  faWallet,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

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

interface Category {
  id: string
  name: string
  icon: string
  color: string
  _count?: { credentials: number }
}

interface SidebarProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
  onAddCategory: () => void
}

export function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}: SidebarProps) {
  const totalCredentials = categories.reduce(
    (sum, cat) => sum + (cat._count?.credentials || 0),
    0
  )

  return (
    <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {/* All Items */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
            selectedCategory === null
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faFolder} className="w-5 h-5" />
            <span className="font-medium">All Items</span>
          </div>
          <span className="px-2 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-600 rounded-full">
            {totalCredentials}
          </span>
        </button>

        <div className="pt-4 pb-2">
          <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Categories
          </h3>
        </div>

        {/* Category List */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
              selectedCategory === category.id
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon
                icon={iconMap[category.icon] || faFolder}
                className="w-5 h-5"
                style={{ color: category.color }}
              />
              <span className="font-medium truncate">{category.name}</span>
            </div>
            <span className="px-2 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-600 rounded-full">
              {category._count?.credentials || 0}
            </span>
          </button>
        ))}

        {/* Add Category Button */}
        <button
          onClick={onAddCategory}
          className="w-full flex items-center justify-center px-4 py-3 mt-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-all"
        >
          <span>+ Add Category</span>
        </button>
      </nav>
    </aside>
  )
}
