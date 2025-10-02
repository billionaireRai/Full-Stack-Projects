"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SessionProvider>
        {children}
        <Toaster position="top-center" />
      </SessionProvider>
    </TooltipProvider>
  )
}
