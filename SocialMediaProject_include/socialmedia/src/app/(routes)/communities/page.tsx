'use client'

import React from 'react'
import Underdevelopment from '@/components/underdevelopment';
import { MdGroup } from 'react-icons/md';

export default function Communities () {
    const UnderDev = true ;

    if (UnderDev) {
        return (
            <Underdevelopment icon={<MdGroup size={40} />} lable='Communities' progress={0} />
        )
    }

    return (
        <div className='border border-black rounded-md h-full text-center font-bold'>
            Communities Page
        </div>
    )

}
