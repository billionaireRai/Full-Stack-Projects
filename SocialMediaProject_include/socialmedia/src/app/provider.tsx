"use client"

import React, { useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import CreatePost from '@/components/createpost'
import useCreatePost from '@/app/states/createpost'
import SwitchAccountPopUp from '@/components/swithaccount'
import useSwitchAccount from '@/app/states/swithaccount'

export default function Providers({ children }: { children: React.ReactNode }) {
  const { isCreatePop } = useCreatePost()
  const { isPopOpen, setisPopOpen } = useSwitchAccount()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams) {
      const showSwitchPop = Boolean(searchParams.get('switch-account-pop'))
      setisPopOpen(showSwitchPop)
    }
  }, [searchParams, setisPopOpen])

  return (
    <TooltipProvider>
      <SessionProvider>
        {children}
        <Toaster position="top-center" />
        { isCreatePop && <CreatePost /> }
        { isPopOpen && <SwitchAccountPopUp /> }
      </SessionProvider>
    </TooltipProvider>
  )
}
