'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function sidenavbar() {
    const pathname = usePathname() ;
    if (!pathname.startsWith('/username/')) return ( <> </> ) ;
    
    return (
        <div className='border border-black w-[100px] h-screen mx-3'>
             
        </div>
    )  
} 
