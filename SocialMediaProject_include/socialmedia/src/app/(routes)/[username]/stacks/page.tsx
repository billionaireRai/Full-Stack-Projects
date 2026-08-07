'use client'

import React from 'react'
import Underdevelopment from '@/components/underdevelopment';
import { List } from 'lucide-react';

export default function Stacks () {
    const UnderDev = true ;

    if (UnderDev) {
        return (
            <Underdevelopment icon={<List size={40} />} lable='Stacks' progress={2} />
        )
    }

    return (
        <div className='border border-black rounded-md h-full text-center font-bold'>
            Stacks Page
        </div>
    )

}
