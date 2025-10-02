'use client'
import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

const Toastify = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <Toaster 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#121212', // Dark black background
              color: '#e0e0e0', // Light gray text for contrast
              padding: '16px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
              fontSize: '15px',
              fontWeight: '500',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              backdropFilter: 'none',
              border: '1px solid #333',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            },
            success: {
              iconTheme: {
                primary: '#34d399', // Tailwind `green-400`
                secondary: '#d1fae5', // Tailwind `green-100`
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171', // Tailwind `red-400`
                secondary: '#fee2e2', // Tailwind `red-100`
              },
            },
          }} 
          position="top-center" 
          reverseOrder={false} 
        />
      )}
      {children}
    </>
  )
}

export default Toastify
