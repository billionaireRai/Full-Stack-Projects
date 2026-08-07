'use client'

import React from 'react'
import Underdevelopment from '@/components/underdevelopment';
import { CalendarClock } from 'lucide-react';

export default function Scheduledposts () {
    const UnderDev = true ;

    if (UnderDev) {
        return (
            <Underdevelopment icon={<CalendarClock size={40} />} lable='Scheduled Posts' progress={0} />
        )
    }

    return (
        <div className='border border-black rounded-md h-full text-center font-bold'>
            Scheduled Posts Page
        </div>
    )

}
