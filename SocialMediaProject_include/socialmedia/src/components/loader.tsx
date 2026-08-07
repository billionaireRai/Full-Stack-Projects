import React from 'react'
import { AnimatePresence , motion } from 'framer-motion'

export default function Loader({ loadingtext }: { loadingtext?:string }) {
  return (
      <AnimatePresence>
          <motion.div
            className="flex flex-col items-center justify-center gap-4 w-full min-h-[220px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-8 h-8 border-4 border-yellow-200 dark:border-yellow-300 border-t-yellow-500 dark:border-t-yellow-600 rounded-full animate-spin"
              animate={{ rotate: 360 }}
              transition={{ duration: 1 , repeat: Infinity , ease: "linear" }}
            />
            <div className='text-gray-500'>
              {loadingtext}
            </div>
          </motion.div>
      </AnimatePresence>
  )
}

