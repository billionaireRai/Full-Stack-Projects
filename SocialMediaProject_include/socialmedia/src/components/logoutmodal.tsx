import React from 'react'
import Link from 'next/link'
import { handleLogoutAccountLogic } from '@/lib/logout'
import { LogOutIcon } from 'lucide-react'

interface logoutModalProp {
  closePopUp?: () => void
  handle:string
}

export default function LogoutModal({ closePopUp ,handle }: logoutModalProp) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Modal */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white dark:bg-black rounded-lg p-5 max-w-md mx-4 shadow-xl border border-gray-300 dark:border-gray-900">
          {/* Title */}
          <h2 className="text-black flex items-center gap-1.5 dark:text-white text-xl font-bold mb-4"><LogOutIcon/><span>Confirm Log Out</span></h2>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            Are you sure you want to log out from <Link href={`/${handle}`}><b>{handle}</b></Link> ? You will need to sign in again to access your account.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={closePopUp}
              className="cursor-pointer flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { handleLogoutAccountLogic(handle) }}
              className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
