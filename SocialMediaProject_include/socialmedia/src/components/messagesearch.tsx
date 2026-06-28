'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SearchIcon, X, ArrowDown, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useActiveChatMessages from '@/app/states/activechatmessage'
import { BsExclamation } from 'react-icons/bs'

interface MessageSearchProps {
  close: () => void
  scrollInMsgSection:(msgindex:number) => void
}

type MatchedMessage = {
  idx: number
  text: string
}

function highlightText(text: string, query: string) {
  const trimmed = query.trim() ;
  if (!trimmed) return text ;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'ig')

  const parts = text.split(re)
  return parts.map((part, i) => {
    const isMatch = part.toLowerCase() === trimmed.toLowerCase()
    return isMatch ? (
      <mark
        key={i}
        className="bg-yellow-200/70 dark:bg-yellow-500/20 text-amber-900 dark:text-amber-200 px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  })
}

export default function Messagesearch({ close , scrollInMsgSection }: MessageSearchProps) {
  const { messages } = useActiveChatMessages()
  const [query, setQuery] = useState(''); // search text by user...
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const matched: MatchedMessage[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const res: MatchedMessage[] = []
    for (let i = 0; i < messages.length; i++) {
      const t = messages[i]?.text ?? ''
      if (t.toLowerCase().includes(q))  res.push({ idx: i, text: t }) ;
    }
    return res
  }, [messages, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, matched.length])

  const activeMessageIdx = matched[activeIndex]?.idx

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()

      if (!matched.length) return ;

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, matched.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        close()
        scrollInMsgSection(matched[activeMessageIdx].idx)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close, matched.length])


  return (
    <div 
    role="dialog" 
    aria-modal="true" 
    onClick={close} 
    className="fixed w-full h-full inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-300" >
      {/* panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.18 }}
        onClick={(e:Event) => e.stopPropagation()}
        className="flex flex-col w-full h-full max-w-2xl max-h-4/5 p-2 rounded-2xl bg-white dark:bg-black shadow-2xl"
      >
        <div className="p-2 sm:p-3 border-b border-gray-200/40 rounded-xl dark:border-gray-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/15 dark:bg-yellow-500/15 flex items-center justify-center border border-yellow-400/25">
              <SearchIcon className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
            </div>

            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Search messages
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Searching inside the active chat (chat current opened in panel).
              </p>
            </div>

            <button
              onClick={close}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-950 cursor-pointer transition"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                autoFocus
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any message…"
                className="w-full outline-none border border-transparent focus:border-yellow-400 dark:focus:border-yellow-600 dark:focus:ring-400/50 focus:ring-3 focus:ring-yellow-400/20 rounded-xl dark:border-gray-800/70 bg-white dark:bg-black backdrop-blur-sm px-4 py-2.5 text-sm transition-all duration-200"
              />
            </div>

            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                disabled={!matched.length}
                onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                className="p-2 rounded-full cursor-pointer border border-gray-200/70 dark:border-gray-800/70 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition"
                aria-label="Previous match"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!matched.length}
                onClick={() => setActiveIndex((i) => Math.min(i + 1, matched.length - 1))}
                className="p-2 rounded-full cursor-pointer border border-gray-200/70 dark:border-gray-800/70 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition"
                aria-label="Next match"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>
              {query.trim() && (
                <>
                  Found <b className="text-gray-900 dark:text-gray-100">{matched.length}</b> matches
                </>
              )}
            </span>
            {query.trim() && matched.length > 0 && (
              <span>
                Selected {activeIndex + 1}/{matched.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto flex-1 rounded-xl">
          <AnimatePresence mode="wait">
            {!query.trim() ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="h-[220px] flex flex-col items-center justify-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-yellow-400/15 dark:bg-yellow-500/15 border border-yellow-400/25 flex items-center justify-center">
                  <SearchIcon className="w-6 h-6 text-yellow-700 dark:text-yellow-300" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Search any message</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 max-w-lg">
                      Results will appear as you type. This search scans through the text of messages in the
                      active chat state and highlights matching words for quick navigation.
                    </p>
                </div>
              </motion.div>
            ) : matched.length === 0 ? (
              <motion.div
                key="noresults"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="h-[220px] flex flex-col items-center justify-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200/50 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 flex items-center justify-center">
                  <BsExclamation className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">No matches found</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 max-w-lg">
                    Try searching a different key word which could possibly exist in that message.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                {matched.map((m, i) => {
                  const isActive = (i === activeIndex) ;
                  const msg = messages[m.idx] ;
                  return (
                    <button
                      key={m.idx}
                      type="button"
                      onClick={() => { close() ; scrollInMsgSection(m.idx) }}
                      className={`w-full cursor-pointer text-left rounded-xl border px-3 py-2.5 transition 
                        ${isActive
                          ? 'bg-yellow-400/15 dark:bg-yellow-950/30 border-yellow-400/30'
                          : 'bg-white/60 dark:bg-black/20 border-gray-200/60 dark:border-gray-800/60 hover:bg-zinc-950/5'
                      }`}
                      aria-current={isActive}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs flex text-gray-600 dark:text-gray-400 mb-1">
                            <div className='flex items-center justify-center gap-1'>
                              <span className="font-semibold">{msg?.sendername}</span>
                              <span className="font-semibold">{msg?.senderhandle}</span>
                            </div>
                            <span className="mx-2">•</span>
                            <span>{msg?.timestamp}</span>
                          </div>
                          <div className="text-xs text-gray-900 dark:text-gray-100 break-words">
                            {highlightText(msg?.text, query)}
                          </div>
                        </div>

                        {isActive && (
                          <div className="shrink-0">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400/20 dark:bg-yellow-500/20 border border-yellow-400/30 text-yellow-800 dark:text-yellow-200">
                              {i + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="p-1 sm:p-2 border rounded-xl dark:border-gray-800/60">
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between gap-3">
            <span>
              Use 
              <b className='bg-yellow-200 dark:bg-zinc-950 text-yellow-800 dark:text-yellow-600 px-2 py-1 rounded-full'>↑</b> 
              & 
              <b className='bg-yellow-200 dark:bg-zinc-950 text-yellow-800 dark:text-yellow-600 px-2 py-1 rounded-full'>↓</b> 
              to navigate and 
              <b className='bg-yellow-200 dark:bg-zinc-950 text-yellow-800 dark:text-yellow-600 px-2 py-1 rounded-full'>Esc</b> to close.
            </span>
            <button
              className="text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-950 cursor-pointer py-2 px-4 rounded-full dark:text-yellow-300 font-semibold"
              onClick={() => setQuery('')}
              disabled={!query.trim()}
            >
              Clear
            </button>
          </div>
        </div>

        {/* active index quick ref for your next logic */}
        <input type="hidden" value={String(activeMessageIdx ?? '')} readOnly />
      </motion.div>
    </div>
  )
}

