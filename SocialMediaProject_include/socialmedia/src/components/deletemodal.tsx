import { Delete } from 'lucide-react'
import React from 'react'

interface deleteModalProp {
  closePopUp?: () => void
  onDelete?: () => void
  itemType?:string
}

export default function DeleteModal({closePopUp, onDelete , itemType = 'item'}: deleteModalProp) {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Modal */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white dark:bg-black rounded-lg p-6 max-w-sm mx-4 shadow-xl border border-gray-300 dark:border-gray-900">
          {/* Title */}
          <h2 className="text-black flex flex-row items-center gap-1.5 dark:text-white text-xl font-bold mb-4">
            <Delete color="#dc2626" size={22} />
            <span>Confirm Deletion</span>
          </h2>

          {/* Description */}
          <p className="text-gray-800 dark:text-gray-300 text-sm mb-6">
            Are you sure you want to <b>delete</b> this {itemType} ? <b>This action cannot be undone.</b>
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={closePopUp}
              className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-950 text-gray-800 dark:text-gray-200 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
