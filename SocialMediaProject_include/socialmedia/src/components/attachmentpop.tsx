import React, { useMemo, useState } from 'react'
import { X } from 'lucide-react'

interface attachmentOptionType {
  icon: React.ReactNode
  label: string
  reference?: React.RefObject<HTMLInputElement | null>
}

interface AttachmentPopProps {
  closePop: () => void
  menuOptions: attachmentOptionType[]
}

export default function Attachmentpop({ closePop, menuOptions }: AttachmentPopProps) {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)
  const safeMenuOptions = useMemo(() => (Array.isArray(menuOptions) ? menuOptions : []), [menuOptions])

  const activeLabel = safeMenuOptions[activeMenuIndex]?.label

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200"
    >
      <div className="h-4/5 min-w-3/4 flex flex-col rounded-xl bg-white shadow-xl ring-1 ring-yellow-100/70 overflow-hidden" >
        {/* Header */}
        <div className="menu rounded-xl flex items-center justify-between px-3 py-2 bg-gradient-to-r from-yellow-50 via-white to-yellow-50">
          <ul className="flex flex-wrap items-center justify-start gap-1 p-1 m-1 rounded-full">
            {safeMenuOptions.map((option, idx) => {
              const isActive = ( idx === activeMenuIndex ) ;
              return (
                <li key={idx} className="flex items-center cursor-pointer rounded-full">
                  <button
                    type="button"
                    onClick={() => setActiveMenuIndex(idx)}
                    className={
                      `flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border
                      ${isActive
                        ? 'bg-yellow-100 text-yellow-900 border-yellow-500 shadow-md shadow-yellow-300/40'
                        : 'bg-white text-yellow-500 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300'
                        }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span 
                    className={`inline-flex items-center justify-center transition-colors duration-150
                    ${isActive ? 'text-white' : 'text-yellow-700'} `}
                    >
                      {option.icon}
                    </span>
                    <span className="whitespace-nowrap">{option.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            onClick={closePop}
            className="p-1.5 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-100 bg-white ring-1 ring-gray-200"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="container border border-black flex-1" aria-label={activeLabel ? `Active: ${activeLabel}` : 'Attachment menu'}>

        </div>

        {/* Footer */}
        <div className="footer px-4 py-3 border-t border-yellow-100 bg-white/80">
          <div className="flex items-center justify-between">
            <div />
            <div className="flex items-center gap-2">
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

