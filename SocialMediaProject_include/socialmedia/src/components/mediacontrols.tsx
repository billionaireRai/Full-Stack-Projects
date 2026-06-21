'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Share, Trash, Download, LinkIcon, Flag, LucideRefreshCcwDot } from 'lucide-react'
import { mediaType } from './mediapopmodal'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export type MediaControlAction = 'reset-zoom' | 'zoom-in' | 'zoom-out' | 'share' | 'delete' | 'download' | 'copyLink' | 'report'

export interface MediaControlsProps {
  media: mediaType
  onZoomIn: () => void
  onZoomOut: () => void
  resetZoom:() => void
}

const controlsOptions : ReadonlyArray<{ action: MediaControlAction ; label: string ; Icon: React.ComponentType<{ className?: string }>}> = [
  { action: 'reset-zoom', label: 'Reset-zoom', Icon:LucideRefreshCcwDot  },
  { action: 'zoom-in', label: 'Zoom-in', Icon: ZoomIn },
  { action: 'zoom-out', label: 'Zoom-out', Icon: ZoomOut },
  { action: 'share', label: 'Share', Icon: Share },
  { action: 'delete', label: 'Delete', Icon: Trash },
  { action: 'download', label: 'Download', Icon: Download },
  { action: 'copyLink', label: 'Copy link', Icon: LinkIcon },
  { action: 'report', label: 'Report', Icon: Flag },
]

export default function Mediacontrols({ media: _media, onZoomIn, onZoomOut, resetZoom }: MediaControlsProps) {
  const handleClick = (action: MediaControlAction) => {
    if (action === 'zoom-in') onZoomIn()
    if (action === 'zoom-out') onZoomOut()
    if (action === 'reset-zoom') resetZoom()

    // if permanent actions function called and defined here...
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
              <button
                type="button"
                onClick={() => handleClick(action)}
                className="p-2 rounded-full cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors text-yellow-600 dark:text-yellow-400"
                disabled={disabled}
              >
                <Icon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        )
      })}
    </motion.div>
  )
}

