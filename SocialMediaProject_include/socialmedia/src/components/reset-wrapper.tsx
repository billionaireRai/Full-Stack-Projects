'use client'

import { Key } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'

export default function ResetWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const token = searchParams.get('token')
  const showModal = pathname === '/auth/reset-password' && !token 

  return (
    <>
      <div className={`${showModal && 'pointer-events-none select-none blur-sm'} `}>
        {children}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-2xl transition-all duration-300 dark:border-gray-800 dark:bg-black">
           {/* Icon */}
           <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
             <Key className="h-10 w-10 text-amber-600 dark:text-amber-400" />
           </div>

           {/* Heading */}
           <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
             Reset Link Issue !!
           </h2>

           {/* Description */}
           <p className="mt-4 text-center text-sm leading-6 text-gray-600 dark:text-gray-400">
             This password reset link is no longer valid or has expired.
             For your security, password reset links can only be used for a
             limited time.
           </p>

           {/* Notice */}
           <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
             <p className="text-sm text-amber-700 dark:text-amber-300">
               Request a new password reset link to continue.
             </p>
           </div>
           
           {/* Button */}
             <Link
               href="/auth/forgot-password"
               className="mt-2 flex w-full items-center justify-center rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-amber-600 hover:shadow-lg active:scale-[0.98]"
             >
               Request New Reset Link
             </Link>
           </div>
        </div>
      )}
    </>
  )
}