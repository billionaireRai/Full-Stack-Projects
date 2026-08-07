'use client'

import React from 'react'
import Underdevelopment from '@/components/underdevelopment';
import { BadgeQuestionMark } from 'lucide-react';

export default function Help () {
    const UnderDev = true ;

    if (UnderDev) {
        return (
            <Underdevelopment icon={<BadgeQuestionMark size={40} />} lable='Help Page' progress={0} />
        )
    }

    return (
        <div className='border border-black rounded-md h-full text-center font-bold'>
            Help Page
        </div>
    )

}
