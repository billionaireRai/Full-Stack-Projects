'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, SparklesIcon, Check, RefreshCw, CopyIcon, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Loader from './loader'

// typescript types...
export interface PostSummaryMeta {
  name:string
  handle:string
  content: string
  hashtags?: string[]
  mentions?: string[]
  mediaCount?: number
  likes?: number
  reposts?: number
  comments?: number
  views?: number
  bookmarks?: number
  postedAt?: string
  taggedLocation?: { text: string; coordinates: number[] }[]
  poll?: { question: string; options: { text: string; votes: number }[] }
  sentiment?: 'positive' | 'neutral' | 'negative'
  category?: string
  keywords?: string[]
}

export interface ProfileSummaryMeta {
  name: string
  handle: string
  bio: string
  followers?: string
  following?: string
  posts?: string
  joinDate?: string
  location?: string
  website?: string
  isVerified?: boolean
  plan?: string
  interests?: string[]
  contentCategories?: string[]
  avgEngagement?: string
}

interface AISummaryProps {
  type: 'post' | 'account'
  meta: PostSummaryMeta | ProfileSummaryMeta
  onClose: () => void
}



export default function AISummary({ type , meta , onClose }: AISummaryProps) {
  const isPost = type === 'post' ;
  const specificType = isPost ? 'Post' : 'Account' ;
  const [LoadingOutput, setLoadingOutput] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string>(''); // state holding AI explanation...

  const metaRef = useRef<HTMLDivElement>(null);

  // Narrow the type for safe access...
  // const profileMeta = !isPost ? (meta as ProfileSummaryMeta) : null;
  // const postMeta = isPost ? (meta as PostSummaryMeta) : null;

  // Generate AI explanation from meta data on mount
  useEffect(() => {
    setAiExplanation('')
  }, []);

  const handleCopy = async () => {
    if (metaRef.current) {
      try {
        await navigator.clipboard.writeText(metaRef.current.innerText);
        setCopied(true);
        toast.success('Summary copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy summary');
      }
    }
  };

  const handleRegenerate = () => {
    setLoadingOutput(true);
    toast.success('Regenerating summary...');
    setTimeout(() => {
      setLoadingOutput(false);
      toast.success('Summary regenerated!');
    }, 2000);
  };

  const handleShare = async () => {
    const text = metaRef.current?.innerText || aiExplanation;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI ${specificType} Analysis for ${meta.handle}`,
          text: text,
        });
        toast.success('Shared successfully!');
      } catch {
        toast.error('Failed to share');
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Analysis copied to clipboard — you can share it now!');
      } catch {
        toast.error('Failed to copy for sharing');
      }
    }
  };

  // Format numbers
  const formatNum = (num?: number): string => {
    if (num === undefined) return '\u2014';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const sentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'negative': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
        <div
          className='w-full relative max-w-xl h-full max-h-[85vh] bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl border border-yellow-100 dark:border-yellow-900/30 overflow-hidden'
        >
          {/* Header */}
          <div className='flex items-center justify-between gap-3 px-5 py-4 border-b rounded-lg border-yellow-100 dark:border-yellow-900/20 bg-gradient-to-r from-yellow-50/80 to-amber-50/50 dark:from-yellow-950/10 dark:to-amber-950/5'>
            <div className='flex items-center justify-start gap-3'>
              <div>
                <SparklesIcon size={25} />
              </div>
              <div className='flex flex-col'>
                <span className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  AI {specificType} Analysis
                  <div className="flex items-center justify-center w-5 h-5 bg-yellow-100 dark:bg-yellow-950 rounded-full shadow-sm">
                    <Image src='/images/yellow-tick.png' width={15} height={15} alt="verified" className="object-cover" />
                  </div>
                </span>
                <div className='flex items-start justify-center max-w-sm'>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    Comprehensive AI-powered analysis with detailed insights and breakdown of
                  </span>
                  <Link href={`/${meta.handle}`} className="text-[11px] text-yellow-600 dark:text-yellow-400 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors duration-200 font-semibold py-0.5 px-2 rounded-full inline-flex items-center gap-1">
                    {meta.handle}
                  </Link>
                </div>
              </div>
            </div>
            <button onClick={onClose} className='cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1.5 transition-all duration-200' >
              <X size={16} />
            </button>
          </div>

          {/* Main Body */}
          <div className="overflow-y-auto h-3/4">
            {LoadingOutput ? (
              <div className="flex items-center justify-center h-full">
                <Loader loadingtext={`AI is analyzing this ${specificType.toLowerCase()}...`} />
              </div>
            ) : (
              <div className='flex flex-col gap-2 p-3 h-full rounded-lg'>
                <div className='flex items-center justify-start gap-1.5 flex-wrap'>
                  <button onClick={handleCopy} className='flex items-center text-xs text-gray-600 dark:text-gray-400 justify-center gap-1 border-none outline-none hover:bg-gray-100 dark:hover:bg-gray-950 rounded-full p-2 cursor-pointer transition-colors duration-200' type="button">
                    {copied ? <Check size={15} className="text-green-500" /> : <CopyIcon size={15} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button onClick={handleRegenerate} className='flex items-center text-xs text-gray-600 dark:text-gray-400 justify-center gap-1 border-none outline-none hover:bg-gray-100 dark:hover:bg-gray-950 rounded-full p-2 cursor-pointer transition-colors duration-200' type="button">
                    <RefreshCw size={15} />
                    <span>Regenerate</span>
                  </button>
                  <button onClick={handleShare} className='flex items-center text-xs text-gray-600 dark:text-gray-400 justify-center gap-1 border-none outline-none hover:bg-gray-100 dark:hover:bg-gray-950 rounded-full p-2 cursor-pointer transition-colors duration-200' type="button">
                    <Share2 size={15} />
                    <span>Share</span>
                  </button>
                </div>
                <div ref={metaRef} className='border border-gray-200 dark:border-gray-800 h-full rounded-lg overflow-y-auto bg-gradient-to-b from-yellow-50/30 to-white dark:from-yellow-950/5 dark:to-neutral-950 p-4'>
                  {aiExplanation ? (
                    <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line font-mono">
                      
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                      <div className="flex flex-col items-center gap-2">
                        <SparklesIcon size={24} className="text-yellow-400" />
                        <span className="text-sm">AI analysis will appear here</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* footer */}
          <div className='flex sticky bottom-0 items-center justify-between px-5 py-3 rounded-lg
           border-t border-yellow-100/80 dark:border-yellow-900/20 bg-yellow-50 dark:bg-zinc-950'>
            <div className='flex items-center gap-3'>
                <div>
                  <Image
                    src='https://res.cloudinary.com/dvgcc6gts/image/upload/v1785046887/icons8-chatgpt-48_uhveaf.png'
                    width={20}
                    height={20}
                    alt='ChatGPT'
                    className='object-contain'
                  />
                </div>
              <div className='flex flex-col leading-tight'>
                <span className='text-[8px] uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 font-medium'>Powered by OpenAI</span>
                <span className='text-xs font-semibold text-gray-800 dark:text-gray-200'>ChatGPT</span>
              </div>
            </div>
            <div className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100/50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-800/20'>
              <SparklesIcon size={12} className='text-yellow-600 dark:text-yellow-400' />
              <span className='text-[10px] font-medium text-yellow-700 dark:text-yellow-300'>AI-Powered Insights</span>
            </div>
          </div>
      </div>
     </div>
   </>
)}
