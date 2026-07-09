import React from 'react'
import { AtSign , Text , Globe , SparklesIcon } from 'lucide-react'

export default function Aifeaturespost() {
  const postAIfeatures =  [
    { 
         title: 'AI recommended mention',
         desc: 'Get smart mention suggestions based on your text.',
         icon: <AtSign size={18} className="text-yellow-500" />
     },
     {
       title: 'Rewrite post caption',
       desc: 'Make your post friendly, professional, or punchy.',
       icon: <Text size={18} className="text-yellow-500" />
     },
     {
       title: 'Hashtag & keywords',
       desc: 'Auto-suggest relevant hashtags and keywords.',
       icon: <Globe size={18} className="text-yellow-500" />
     }
  ]
  return (
    <>
     <div className="px-5 py-4 AI-features border-b rounded-xl flex gap-1.5 items-center border-gray-100 dark:border-zinc-900">
      <SparklesIcon size={30} />
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI based features</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Boost your posts with helpful AI suggestions.
        </p>
      </div>
     </div>
    <div className="p-3">
     {postAIfeatures.map((opt) => (
         <div
         key={opt.title}
         className="w-full cursor-pointer text-left flex items-start gap-3 p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors"
         >
         <div className="mt-0.5 w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
           {opt.icon}
         </div>
         <div className="flex-1">
           <p className="text-sm font-semibold text-gray-900 dark:text-white">{opt.title}</p>
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">
              {opt.desc}
            </p>
          </div>
        </div>
    ))}  
    </div>
    </>
  )
}
