'use client'

import React, { useState , useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Share, Trash, Download, LinkIcon, Flag, LucideRefreshCcwDot } from 'lucide-react'
import { mediaType } from './mediapopmodal'
import toast from 'react-hot-toast'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { handleDownload } from '@/lib/utils'
import { getShareLinks } from '@/lib/getShareLink'

type ShareOption = 'gmail' | 'facebook' | 'whatsapp' | 'twitter' | 'github' | 'instagram' |'post'

export type MediaControlAction = 'reset-zoom' | 'zoom-in' | 'zoom-out' | 'share' | 'delete' | 'download' | 'copyLink' | 'report'

export interface MediaControlsProps {
  media: mediaType
  onZoomIn: () => void
  onZoomOut: () => void
  resetZoom: () => void
}

const controlsOptions: ReadonlyArray<{ action: MediaControlAction; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { action: 'reset-zoom', label: 'Reset-zoom', Icon: LucideRefreshCcwDot },
  { action: 'zoom-in', label: 'Zoom-in', Icon: ZoomIn },
  { action: 'zoom-out', label: 'Zoom-out', Icon: ZoomOut },
  { action: 'share', label: 'Share', Icon: Share },
  { action: 'delete', label: 'Delete', Icon: Trash },
  { action: 'download', label: 'Download', Icon: Download },
  { action: 'copyLink', label: 'Copy link', Icon: LinkIcon },
  { action: 'report', label: 'Report', Icon: Flag },
]

const shareOptionMeta: ReadonlyArray<{ option: ShareOption; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { option: 'twitter', label: 'Twitter', Icon: (props) => <img src="/images/twitter.png" alt="twitter" className={props.className} aria-hidden /> },
  { option: 'facebook', label: 'Facebook', Icon: (props) => <img src="/images/facebook.png" alt="facebook" className={props.className} aria-hidden /> },
  { option: 'whatsapp', label: 'WhatsApp', Icon: (props) => <img src="/images/whatsapp.png" alt="whatsapp" className={props.className} aria-hidden /> },
  { option: 'instagram', label: 'Instagram', Icon: (props) => <img src="/images/instagram.png" alt="instagram" className={props.className} aria-hidden /> },
  { option: 'gmail', label: 'Gmail', Icon: (props) => <img src="/images/search.png" alt="gmail" className={props.className} aria-hidden /> },
  { option: 'github', label: 'GitHub', Icon: (props) => <img src="/images/github.png" alt="github" className={props.className} aria-hidden /> },
  { option: 'post', label: 'Copy link', Icon: (props) => <img src="/images/share.png" alt="post" className={props.className} aria-hidden /> },
]

export default function Mediacontrols({ media: _media, onZoomIn, onZoomOut, resetZoom }: MediaControlsProps) {
  const shareLinks = getShareLinks(_media.url,`Check this ${_media.media_type} media`)
  const [OpenShareOptions, setOpenShareOptions] = useState(false) ;

  const copyMediaLink = async () => {
    await navigator.clipboard.writeText(_media.url)
    toast.success('Media URL copied !!', { position: 'top-right' })
  }

  const handleClick = (action: MediaControlAction) => {
    if (action === 'zoom-in') onZoomIn();
    if (action === 'zoom-out') onZoomOut();
    if (action === 'reset-zoom') resetZoom();

    if (action === 'copyLink') copyMediaLink();

    if (action === 'download') handleDownload(_media.url, 'test-download');

    if (action === 'share') setOpenShareOptions((v) => !v);

    // completing the deletions logic...
  }

  return (
    <motion.div
      className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-900 bg-white/80 dark:bg-black/60 px-2 py-1"
      aria-label="Media controls"
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.6 }}
      whileHover={{ y: -1 }}
    >
      {controlsOptions.slice(0, 7).map(({ action, label, Icon }) => {
        const disabled = (action === 'zoom-in' && !onZoomIn) || (action === 'zoom-out' && !onZoomOut)
        return (
          <Tooltip key={action}>
            <TooltipTrigger asChild>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => handleClick(action)}
                  className="p-2 rounded-full cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors text-yellow-600 dark:text-yellow-400"
                  disabled={disabled}
                >
                  <Icon className="w-4 h-4" />
                </button>

                {action === 'share' && OpenShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-45 h-auto absolute p-1 flex flex-col left-0 bottom-full bg-white dark:bg-black z-50 rounded-lg overflow-hidden shadow-lg"
                  >
                  {shareOptionMeta.map(({ option, label, Icon: OptIcon }) => (
                    option !== 'post' ? (
                      <Link
                        key={option}
                        href={shareLinks[option]}
                        className="flex items-center cursor-pointer rounded-lg gap-2 px-3 py-2 text-sm hover:bg-yellow-100 dark:hover:bg-zinc-950 transition-colors text-gray-800 dark:text-gray-100"
                      >
                        <OptIcon className={`w-6 h-6 text-yellow-600 dark:text-yellow-400 ${label === 'GitHub' && 'dark:invert'}`} />
                        <span>{label}</span>
                      </Link>
                    ) : (
                      <button
                        key={option}
                        type="button"
                        onClick={copyMediaLink}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-yellow-100 dark:hover:bg-zinc-950 transition-colors text-gray-800 dark:text-gray-100"
                      >
                        <OptIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 dark:invert" />
                        <span>{label}</span>
                      </button>
                    )
                  ))}
                  </motion.div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        )
      })}
    </motion.div>
  )
}

