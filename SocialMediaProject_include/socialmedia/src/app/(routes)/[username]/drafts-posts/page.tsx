'use client'

import React from 'react'
import Underdevelopment from '@/components/underdevelopment';
import { MdDrafts } from 'react-icons/md';

export default function Drafts () {
    const UnderDev = true ;

    if (UnderDev) {
        return (
            <Underdevelopment icon={<MdDrafts size={40} />} lable='Draft Posts' progress={0} />
        )
    }

    return (
        <div className='border border-black rounded-md h-full text-center font-bold'>
            Drafts Page
        </div>
    )

}
