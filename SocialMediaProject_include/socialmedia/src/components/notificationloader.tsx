import React from 'react'
import { NotificationCardSkeleton } from './notificationcard'
import Loader from './loader'

export default function Notificationloader({ cardnums }:{ cardnums:number }) {
  return (
    <>
    <div
        className='rounded-xl flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 px-1'
        aria-live='polite'
    >
        <div className='flex items-center justify-center'>
          <Loader/>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          {Array.from({ length:cardnums }).map((_,i) => ( 
            <div key={i}> 
              <NotificationCardSkeleton isodd={( i%2 !== 0 ) ? true : false } />
            </div> 
          ))}
        </div>
    </div>
    </>
  )
}
