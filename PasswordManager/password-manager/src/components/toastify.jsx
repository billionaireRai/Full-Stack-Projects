import React from 'react'
import { Toaster } from 'react-hot-toast'

const Toastify = ({ children }) => {
  return (
    <>
      <Toaster 
      toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937', // Tailwind `gray-800`
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
            fontSize: '15px',
          },
          success: {
            iconTheme: {
              primary: '#10b981', // Tailwind `green-500`
              secondary: '#ecfdf5', // Tailwind `green-50`
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // Tailwind `red-500`
              secondary: '#fee2e2', // Tailwind `red-100`
            },
          },
        }} 
      position="top-center" 
      reverseOrder={false} />
      {children}
    </>
  )
}

export default Toastify
