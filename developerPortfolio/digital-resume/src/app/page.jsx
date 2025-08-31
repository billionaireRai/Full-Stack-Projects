'use client'

import { Poppins } from 'next/font/google'
import { Tooltip ,TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react'
import { Rocket } from 'lucide-react';
import Link from 'next/link';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function landingPage() {
  const [lineIndex, setLineIndex] = useState(0)
  const [terminalContent, setTerminalContent] = useState([])
  const canvasRef = useRef(null)

  const [lines,setlines] = useState([
    'Initializing dev Portfolio interface...',
    '👨‍💻 amritansh_Rai() — Full Stack Developer & Visionary Software Engineer.',
    '🧠 Turning ideas into scalable digital solutions using MERN & Next.js and Many other tools...',
    '🚀 Passionately building future-ready apps with clean code & powerful UI.',
    '✅ Lets Now Explore My Digital Portfolio Interface...'
  ]);

  useEffect(() => {
    if (lineIndex < lines.length) {
      const timer = setTimeout(() => {
        setTerminalContent((prev) => [...prev, lines[lineIndex]])
        setLineIndex(lineIndex + 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [lineIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = (canvas.width = window.innerWidth)
    const h = (canvas.height = window.innerHeight)

    const cols = Math.floor(w / 20) + 1
    const yPos = Array(cols).fill(0)
    const characters =
      'アァイィウヴエカキクケコサシスセソタチツテトナニヌネノハヒフヘ!@#$%^&*()+/*~ホ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#00ff9f'
      ctx.font = '18px monospace'

      yPos.forEach((y, ind) => {
        const text = characters[Math.floor(Math.random() * characters.length)]
        const x = ind * 20
        ctx.fillText(text, x, y)
        yPos[ind] = y > h + Math.random() * 100 ? 0 : y + 20
      })
    }

    const interval = setInterval(draw, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={'relative w-screen h-screen overflow-hidden bg-black'}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />

      <div className={`${poppins.className} absolute inset-0 z-10 flex flex-col items-center justify-center px-4`}>
        <div className="w-full max-w-4xl p-8 rounded-xl bg-black bg-opacity-70 backdrop-blur-lg border-none outline-none shadow-2xl shadow-green-800 animate-fade-in text-[#00ff9f] text-sm font-mono space-y-4 mb-8">
          {terminalContent.map((line, index) => (
            <div
              key={index}
              className='animate-pulse-fast tracking-wide leading-relaxed'
              style={{
                textShadow: '0 0 8px #00ff9f, 0 0 16px #00ff9f',
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <section className={`${index === (terminalContent.length - 1) ? 'flex flex-row items-center justify-between' : ''}`}>
                <span>{line}</span>
                { index === (terminalContent.length - 1) 
                ? 
                <Tooltip>
                  <TooltipTrigger>
                    <Image className='invert rotate-270 animate-caret-blink' src='/back-button.png' width={30} height={30} alt='back-arrow' /> 
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hover Below On the Blur Item</p>
                  </TooltipContent>
                </Tooltip>
                :
                ''}
              </section>
            </div>
          ))}
        </div>

        {lineIndex === lines.length && (
          <Link href='/home'>
          <button
            className="flex flex-row items-center gap-2 cursor-pointer mt-4 px-8 py-3 bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 text-black font-semibold rounded-lg shadow-sm hover:blur-none blur-md shadow-green-500 transition-all duration-600 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          >
            <Rocket/><span>Enter Portfolio</span>
          </button>
          </Link>
        )}
      </div>
    </div>
  )
}
