import React from 'react'
import Link from 'next/link'

interface newsCardProp {
    bannerImg?:string ,
    time?:string ,
    newsCategory?:string ,
    postsCount?:string ,
    profileRelated?:[{
        avatar?:string[] ,
        name?:string,
        href?:string
    }],

}

export default function newscard ({ bannerImg , time , newsCategory , postsCount , profileRelated = [{avatar: []}] } : newsCardProp) {
  return (
<li>
  <div className="flex flex-row items-start gap-3 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 cursor-pointer hover:shadow-md dark:hover:shadow-gray-900 transition-colors">
    {/* Thumbnail Image */}
    <img
      src={bannerImg}
      alt="News Thumbnail"
      className="w-20 h-20 object-cover rounded-lg"
    />
    {/* Text Section */}
    <div className="flex flex-col flex-1">
      <p className="text-gray-900 dark:text-white text-lg text-wrap leading-snug truncate">
        Modi and Ishiba's Bullet Train Ride Accelerates India-Japan Ties
      </p>
      
      {/* Metadata */}
      <div className="md:flex md:items-center grid grid-rows-2 grid-cols-2 text-sm font-semibold truncate text-gray-600 dark:text-gray-400 gap-2 mt-2">
        <span>{time}</span>
        <span className='hidden md:block'>•</span>
        <span>{newsCategory}</span>
        <span className='hidden md:block'>•</span>
        <span>{postsCount} posts</span>
        {profileRelated && profileRelated.length > 0 && (
          <>
            <span className='hidden md:block'>•</span>
            <span className='flex flex-row -space-x-3'>
              {profileRelated.map((profile, index) => (
                <Link href={profile.href || '#'} key={index}>
                  <img
                    src={profile.avatar?.[0] || '/images/myProfile.jpg'}
                    alt={`${profile.name || 'User'} avatar`}
                    className="rounded-full w-10 h-10 border-4 border-white dark:border-black object-cover"
                  />
                </Link>
              ))}
            </span>
          </>
        )}
    </div>
    </div>
  </div>
</li>

    
  )
}
