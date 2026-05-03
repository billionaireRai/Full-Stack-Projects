import React from 'react'
import Link from 'next/link'
import { MdAnalytics } from 'react-icons/md'
import { Briefcase, Crown, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

interface PropType {
    username:string
}

export default function Notaccessablepop ({ username } : PropType) {
  return (
    <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          >
            <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-900 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 m-2 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-xl">
                    <MdAnalytics className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Advanced Analytics Available</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Unlock powerful insights for your account</p>
                  </div>
                </div>
              </div>
    
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 text-xs dark:text-gray-300 mb-6">
                  Upgrade to unlock deeper insights, audience demographics, sentiment analysis, and more powerful metrics to grow and monitor your presence...
                </p>
    
                {/* Plan Buttons */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  <Link
                    href={'/subscription?utm_source=analytics-upgrade&plan=Pro'}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-950 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Pro Plan</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Priority support & more features</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href={'/subscription?utm_source=analytics-upgrade&plan=Creator'}
                    className="flex items-center justify-between p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-400 dark:bg-yellow-600 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-yellow-400">Creator Plan</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Advanced analytics & insights</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
    
    
                  <Link
                    href={'/subscription?utm_source=analytics-upgrade&plan=Premium'}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-950 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Premium Plan</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Full API access & exclusive features</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
    
                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t rounded-lg border-gray-100 dark:border-gray-800">
                  <Link
                    href={`/${username}`}
                    className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors cursor-pointer font-medium"
                  >
                    Maybe Later
                  </Link>
                  <Link
                    href={'/subscription?utm_source=analytics-modal'}
                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    View All Plans
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
  )
}
