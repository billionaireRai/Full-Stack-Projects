'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import EmojiPicker, { EmojiClickData ,Theme } from 'emoji-picker-react'
import { useSound } from 'use-sound'
import { BanIcon, Eraser, Flag, Folder, Images, Mic, Music, Paperclip, PhoneIcon, SendIcon, Smile, Trash, Video, CheckCircle, MessageCirclePlus, User } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AudioRecordModal from '@/components/audioRecordModal'
import Sharecontactonchat from '@/components/sharecontactonchat'
import BlockChatPop from '@/components/blockchat'
import AddAccinchatlist from '@/components/adduserinchatlist'
import toast from 'react-hot-toast'
import { userCardProp } from '@/components/usercard'
import { infoForChatCard } from './chataccountcard'

interface Message {
  id: string
  sendername: string
  senderhandle: string
  text: string
  timestamp: string
  isOwn: boolean
  avatar: string
  status?: 'sending' | 'sent' | 'delivered' | 'seen'
}

interface MessageCardProps {
  chatCardDetails?: infoForChatCard
  handleAudioPop:() => void  
  handleAddChat:() => void
}

export default function MessageCard({ chatCardDetails , handleAudioPop ,handleAddChat }: MessageCardProps) {
  const { resolvedTheme , } = useTheme()
  const [play] = useSound('/audio/notification.mp3')
  const [messageText, setmessageText] = useState('')
  const [openChatThreeDot, setopenChatThreeDot] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFilePopup, setShowFilePopup] = useState(false)
  const [shareContact, setshareContact] = useState(false)
  const [blockAccPop, setblockAccPop] = useState(false)

  // Attach options (from page.tsx)
  const attachFileoptions = useMemo(
    () => [
      { icon: <Images className="w-3 h-3 text-blue-500" />, label: 'Photos' },
      { icon: <Video className="w-3 h-3 text-purple-500" />, label: 'Videos' },
      { icon: <Music className="w-3 h-3 text-pink-500" />, label: 'Audio' },
      { icon: <PhoneIcon className="w-3 h-3 text-red-500" />, label: 'Contact' },
    ],
    [],
  )

  // Dummy messages (keep existing behavior)
  const MessagesArray = useMemo<Message[]>(
    () => [
      {
        id: '1',
        sendername: 'Alice Johnson',
        senderhandle: '@alicejhonson',
        text: 'Hey, how are you doing?',
        timestamp: new Date().toLocaleString(),
        isOwn: false,
        avatar: '/images/myProfile.jpg',
        status: 'seen',
      },
      {
        id: '2',
        sendername: 'Amritansh Rai',
        senderhandle: '@amritanshdev__',
        text: "I'm doing great! Thanks for asking. How about you?",
        timestamp: new Date().toLocaleString(),
        isOwn: true,
        avatar:
          'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
        status: 'delivered',
      },
      {
        id: '3',
        sendername: 'Alice Johnson',
        senderhandle: '@alicejhonson',
        text: "I'm good too. Just working on some projects. What are you up to?",
        timestamp: new Date().toLocaleString(),
        isOwn: false,
        avatar: '/images/myProfile.jpg',
        status: 'seen',
      },
      {
        id: '4',
        sendername: 'Amritansh Rai',
        senderhandle: '@amritanshdev__',
        text: "Same here! Building a social media app. It's quite challenging but fun.",
        timestamp: new Date().toLocaleString(),
        isOwn: true,
        avatar:
          'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
        status: 'sending',
      },
    ],
    [],
  )

  const [Messages, setMessages] = useState<Message[]>([])

  // IMPORTANT: sync message list when chat changes
  useEffect(() => {
    // temporary: using dummy array that updates on chat switch.
    // Later replace this with real fetch by conversation/chat id.
    setMessages(MessagesArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatCardDetails?.id])


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (openChatThreeDot && !target.closest('.Three_dot')) {
        setopenChatThreeDot(false)
      }
      if (showFilePopup && !target.closest('.file_popup')) {
        setShowFilePopup(false)
      }
    }

    if (openChatThreeDot || showFilePopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openChatThreeDot, showFilePopup])

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setmessageText((prev) => prev + emojiData.emoji)
  }

  const handleFileOptionClick = (clickedLable: string) => {
    if (clickedLable === 'Contact') {
      setshareContact(true)
    }
    setShowFilePopup(false)
  }

  const handleSendMessage = (_msg: string) => {
    setmessageText('')
    play()
  }

  return (
    <div className="flex flex-col h-full rounded-md">
      { !chatCardDetails ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className='bg-yellow-400 text-black hover:animate-none animate-ping mb-2 rounded-full p-2'>
            <MessageCirclePlus
              onClick={handleAddChat}
              size={75}
              className="cursor-pointer hover:scale-105 text-black dark:text-gray-500"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-2">
            No Chat Selected yet
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md">
            Select any chat to start a conversation. Send messages, share media, and keep up with the latest updates.
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="sticky top-0 flex items-center px-4 py-3 justify-between rounded-md shadow-sm border-b border-gray-200 dark:border-gray-900 dark:bg-black z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
              <img
                src={chatCardDetails?.avatarUrl}
                alt={chatCardDetails?.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <span className="absolute bottom-0 right-0 block w-3 h-3 bg-yellow-500 border-2 border-white dark:border-gray-800 rounded-full" />
            </div>

            <div className="flex flex-col">
              <h3 className="flex items-center gap-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                <span>{chatCardDetails?.name}</span>
                <span>.</span>
                <Link
                  href={`/${chatCardDetails?.handle}`}
                  className="text-xs text-gray-500 dark:text-gray-400 font-normal"
                >
                  {chatCardDetails?.handle}
                </Link>
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {chatCardDetails?.lastMessage} • {chatCardDetails?.timestamp}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setopenChatThreeDot(!openChatThreeDot)}
              className="px-3 py-1 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition"
            >
              <span>⋮</span>
            </button>

            {openChatThreeDot && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="Three_dot absolute p-2 top-0 right-0 min-w-65 w-fit bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-xl shadow-xl dark:shadow-gray-950 overflow-hidden z-50"
              >
                <Link
                  href={`/${chatCardDetails?.handle}`}
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <User className="w-4 h-4" />
                  <div>
                    View <b>{chatCardDetails?.handle}</b>
                  </div>
                </Link>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <Folder className="w-4 h-4" />
                  <div>View all attachements</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <Eraser className="w-4 h-4" />
                  <div>Clear chat history</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <BanIcon className="w-4 h-4" />
                  <div>
                    Block chats <b>{chatCardDetails?.handle}</b>
                  </div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <Flag className="w-4 h-4" />
                  <div>Report chat</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <Trash className="w-4 h-4" />
                  <div>
                    Delete chat <b>{chatCardDetails?.handle}</b>
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto p-2 flex flex-col border border-black h-full rounded-md">
          {Messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="flex-shrink-0">
                <Image
                  src={message.avatar}
                  alt={`${message.senderhandle} avatar`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div
                className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg ${
                  message.isOwn ? 'items-end' : 'items-start'
                }`}
              >
                {!message.isOwn && (
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {message.sendername}
                  </span>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm ${
                    message.isOwn
                      ? 'bg-yellow-400 dark:bg-blue-500 dark:text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                </div>

                <div
                  className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                    message.isOwn ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <span>{message.timestamp}</span>
                  {message.isOwn && message.status && (
                    <span className="flex items-center">
                      {message.status === 'sending' && (
                        <CheckCircle height={20} width={20} className="stroke-3" />
                      )}
                      {message.status === 'delivered' && (
                        <CheckCircle height={20} width={20} className="stroke-yellow-400 stroke-3" />
                      )}
                      {message.status === 'seen' && (
                        <CheckCircle height={20} width={20} className="stroke-3 stroke-green-500" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

        {/* Message composer */}
        <div className="messagesendsection border border-gray-200 dark:border-gray-900 inset-shadow-yellow-200 sticky bottom-0 w-full rounded-xl px-4 py-1 bg-white dark:bg-black flex items-center gap-3 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200"
              >
                <Smile className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>

          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-14 left-0 z-50"
            >
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  onEmojiClick(emoji)
                }}
                theme={resolvedTheme === 'dark' ? Theme.DARK : Theme.LIGHT}
              />
            </motion.div>
          )}

          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowFilePopup(!showFilePopup)}
                  className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>

            {showFilePopup && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="file_popup absolute bottom-10 left-20 transform -translate-x-1/2 mt-3 z-50 w-44 bg-white dark:bg-black border rounded-lg shadow-xl overflow-hidden"
              >
                <div className="flex flex-col p-2">
                  {attachFileoptions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleFileOptionClick(item.label)}
                      className="flex items-center cursor-pointer rounded-lg gap-3 px-3 py-2 w-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-950"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800">
                        {item.icon}
                      </div>
                      <span className="tracking-wide">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex-1">
            <input
              type="text"
              value={messageText}
              onChange={(e) => {
                setmessageText(e.target.value)
              }}
              placeholder="type a message..."
              className="w-full bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl px-5 py-2.5 outline-none border-transparent border-none focus:bg-white dark:focus:bg-gray-950"
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              {messageText ? (
                <button
                  onClick={() => handleSendMessage(messageText)}
                  className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200 transition"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAudioPop}
                  className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200 transition"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </TooltipTrigger>
            <TooltipContent>{messageText ? 'Send message' : 'Voice message'}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {blockAccPop && (
        <BlockChatPop
          key={chatCardDetails?.id}
          username={String(chatCardDetails?.handle)}
          closeBlockPop={() => {
            setblockAccPop(false)
          }}
          isBlocked={false}
          updateblockState={() => {}}
        />
      )}
    </div>
  )}
</div>
)}

