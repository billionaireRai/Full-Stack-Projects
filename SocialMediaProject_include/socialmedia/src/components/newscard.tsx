import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NewsCardProps {
  source: string
  category: string
  title: string
  gradient:string
  timeAgo: string
  location: string
  href?: string
}

export default function NewsCard({ 
  source, 
  category, 
  title, 
  timeAgo, 
  gradient,
  location, 
  href = '/' 
}: NewsCardProps) {
  return (
    <Link 
      href={href} 
      className="group block p-3 rounded-2xl bg-white/70 dark:bg-gray-950 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 hover:bg-white/90 dark:hover:bg-gray-900 border border-white/20 dark:border-gray-700/50 transition-all duration-300 ease-out hover:no-underline focus:outline-none focus:ring-1 focus:ring-blue-500/50"
      aria-label={`Read ${title} from ${source}`}
    >
      <div className="flex items-start space-x-4">
        {/* Source Logo - Gradient Badge */}
        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center ring-2 ring-white/30 group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-white font-bold text-sm leading-none tracking-tight drop-shadow-sm">
            {source}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category */}
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            {category}
          </p>
          
          {/* Title */}
          <h3 className="font-bold text-lg leading-6 text-gray-900 dark:text-white group-hover:text-gray-950 dark:group-hover:text-white line-clamp-2 mb-3 transition-colors pr-2">
            {title}
          </h3>
          
          {/* Metadata */}
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span className="flex items-center space-x-1">
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{timeAgo}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{location}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
