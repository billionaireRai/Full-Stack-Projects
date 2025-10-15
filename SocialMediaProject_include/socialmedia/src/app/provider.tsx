"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from 'react-hot-toast'
import CreatePost from '@/components/createpost'
import useCreatePost from '@/app/states/createpost'

export default function Providers({ children }: { children: React.ReactNode }) {
  const { isCreatePop } = useCreatePost()
  return (
    <TooltipProvider>
      <SessionProvider>
        {children}
        <Toaster position="top-center" />
        { isCreatePop && <CreatePost /> }
      </SessionProvider>
    </TooltipProvider>
  )
}
