'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion , AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import EmojiPicker, { EmojiClickData ,Theme } from 'emoji-picker-react'
import { useSound } from 'use-sound'
import { BanIcon, Eraser, Flag, Folder, Images, Mic, Music, Paperclip, PhoneIcon, SendIcon, Smile, Trash, Video, CheckCircle, MessageCirclePlus, User, PinIcon, SearchIcon, BellOff } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AudioRecordModal from '@/components/audioRecordModal'
import Sharecontactonchat from '@/components/sharecontactonchat'
import BlockChatPop from '@/components/blockchat'
import Mediapopmodal from './mediapopmodal'
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
  handleAudioPop: () => void
  handleAddChat: () => void
  updateCardDetail: (msg: string, time: string) => void
}

export default function MessageCard({
  chatCardDetails,
  handleAudioPop,
  handleAddChat,
  updateCardDetail,
}: MessageCardProps) {
  const { resolvedTheme , } = useTheme()
  const [play] = useSound('/audio/notification.mp3')
  const msgsection = useRef<HTMLDivElement | null>(null)
  const messagesize = useRef<Number>(15) ;
  const [messagePage, setmessagePage] = useState<Number>(1);
  const [messageText, setmessageText] = useState('')
  const [openChatThreeDot, setopenChatThreeDot] = useState<boolean>(false)
  const [loadingChat, setloadingChat] = useState<boolean>(false);
  const [sendingMessage, setsendingMessage] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [showFilePopup, setShowFilePopup] = useState<boolean>(false)
  const [shareContact, setshareContact] = useState<boolean>(false)
  const [blockChatPop, setblockChatPop] = useState<boolean>(true)

  // Attachments option
  const attachFileoptions = useMemo(
    () => [
      { icon: <Images className="w-3 h-3 text-blue-500" />, label: 'Photos' },
      { icon: <Video className="w-3 h-3 text-purple-500" />, label: 'Videos' },
      { icon: <Music className="w-3 h-3 text-pink-500" />, label: 'Audio' },
      { icon: <PhoneIcon className="w-3 h-3 text-red-500" />, label: 'Contact' },
    ],
    [],
  )

  // Dummy messages
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
        status: 'seen',
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
        status: 'seen',
      },
      {
        id: '5',
        sendername: 'Alice Johnson',
        senderhandle: '@alicejhonson',
        text: 'Nice! Are you working on chat features as well?',
        timestamp: new Date().toLocaleString(),
        isOwn: false,
        avatar: '/images/myProfile.jpg',
        status: 'seen',
      },
      {
        id: '6',
        sendername: 'Amritansh Rai',
        senderhandle: '@amritanshdev__',
        text: 'Yes—message UI, notifications, and some realtime syncing.',
        timestamp: new Date().toLocaleString(),
        isOwn: true,
        avatar:
          'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
        status: 'seen',
      },
      {
        id: '7',
        sendername: 'Alice Johnson',
        senderhandle: '@alicejhonson',
        text: 'That sounds awesome. How are you handling pagination?',
        timestamp: new Date().toLocaleString(),
        isOwn: false,
        avatar: '/images/myProfile.jpg',
        status: 'seen',
      },
      {
        id: '8',
        sendername: 'Amritansh Rai',
        senderhandle: '@amritanshdev__',
        text: 'I’m loading older messages when you scroll up page size 15.',
        timestamp: new Date().toLocaleString(),
        isOwn: true,
        avatar:
          'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
        status: 'seen',
      },
      {
        id: '9',
        sendername: 'Alice Johnson',
        senderhandle: '@alicejhonson',
        text: 'Perfect. Also, emoji pickers are always a nice touch 😄',
        timestamp: new Date().toLocaleString(),
        isOwn: false,
        avatar: '/images/myProfile.jpg',
        status: 'seen',
      },
      {
        id: '10',
        sendername: 'Amritansh Rai',
        senderhandle: '@amritanshdev__',
        text: 'Yep! Added emoji picker and attachment options too.',
        timestamp: new Date().toLocaleString(),
        isOwn: true,
        avatar:
          'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
        status: 'delivered',
      },
      {
        id: '11',
        sendername: 'Alice Johnson',
        senderhandle: '@alicejhonson',
        text: 'Do you support media uploads and sending voice notes?',
        timestamp: new Date().toLocaleString(),
        isOwn: false,
        avatar: '/images/myProfile.jpg',
        status: 'sending',
      },
      {
        id: '12',
        sendername: 'Amritansh Rai',
        senderhandle: '@amritanshdev__',
        text: 'Working on it. For now, attachments UI is ready and voice notes trigger a modal.',
        timestamp: new Date().toLocaleString(),
        isOwn: true,
        avatar:
          'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
        status: 'sending',
      },
      {
        id: '13',
        sendername: 'Alice Johnson',
        senderhandle: '@alicejhonson',
        text: 'Great progress. Want to test the UI once you’re done with backend wiring?',
        timestamp: new Date().toLocaleString(),
        isOwn: false,
        avatar: '/images/myProfile.jpg',
        status: 'delivered',
      },
      {
        id: '14',
        sendername: 'Amritansh Rai',
        senderhandle: '@amritanshdev__',
        text: 'Absolutely. Let’s also cover delivery + seen states properly.',
        timestamp: new Date().toLocaleString(),
        isOwn: true,
        avatar:
          'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
        status: 'delivered',
      },
      {
        id: '15',
        sendername: 'Alice Johnson',
        senderhandle: '@alicejhonson',
        text: 'Cool—send me an update when you push the changes!',
        timestamp: new Date().toLocaleString(),
        isOwn: false,
        avatar: '/images/myProfile.jpg',
        status: 'sending',
      },
    ],
    [],
  )

  const [Messages, setMessages] = useState<Message[]>([])

  // useeffect running whenever chat changes...
  useEffect(() => {
    // axios request...

    setMessages(MessagesArray)

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
    if (!_msg.trim()) return null
    const trimmedmsg = _msg.trim() ;

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sendername: 'Amritansh Rai',
      senderhandle: '@amritanshdev__',
      text: trimmedmsg,
      timestamp: new Date().toLocaleString(),
      isOwn: true,
      avatar:
        'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
      status: 'delivered',
    }

    setMessages((prevmessages) => [...prevmessages, newMessage])
    setmessageText('');
    play()
  }

  useEffect(() => {
    if (!msgsection.current) return ;
    const lastmessage = Messages[Messages.length - 1] ;
    msgsection.current.scrollTop = msgsection.current.scrollHeight
    updateCardDetail(lastmessage.text,lastmessage.timestamp)
  }, [Messages])

  return (
    <div className="flex flex-col h-full rounded-md">
      {!chatCardDetails ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          {/* message circle beep section */}
          <div className="relative inline-flex">
            <span className="absolute inset-0 rounded-full bg-yellow-200 dark:bg-yellow-950 animate-ping opacity-75"></span>
            <div className="relative rounded-full p-2">
              <MessageCirclePlus
                onClick={handleAddChat}
                size={75}
                className="cursor-pointer hover:scale-105 text-yellow-500 dark:text-yellow-700 transition-transform"
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-2">
            No Chat Selected yet
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md">
            Select any chat to start a conversation or add an account to Send messages, share media, and keep up with the latest updates.
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="sticky top-0 flex items-center px-4 py-3 justify-between rounded-md shadow-sm border-b border-gray-200 dark:border-gray-900 dark:bg-black z-10">
            <div className="flex items-center gap-3">
             <div className="relative cursor-pointer">
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
                 {chatCardDetails?.isVerified && 
                   <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                     <Image src='/images/yellow-tick.png' width={18} height={18} alt='verified'/>
                    </span>
                 }
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
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <User className="w-4 h-4" />
                  <div>
                    View <b>{chatCardDetails?.handle}</b>
                  </div>
                </Link>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <Folder className="w-4 h-4" />
                  <div>View all attachements</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <BellOff className="w-4 h-4" />
                  <div>Mute notifications</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <PinIcon className="w-4 h-4 rotate-45" />
                  <div>Pin chat</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <SearchIcon className="w-4 h-4" />
                  <div>Search messages</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <Eraser className="w-4 h-4" />
                  <div>Clear chat history</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <Flag className="w-4 h-4" />
                  <div>Report chat</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                  onClick={() => { setblockChatPop(true) ; setopenChatThreeDot(false) }}
                >
                  <BanIcon className="w-4 h-4" />
                  <div>
                    Block chats <b>{chatCardDetails?.handle}</b>
                  </div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
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
        <div ref={msgsection} className="overflow-y-auto flex gap-2 flex-col p-2 h-full rounded-md">
         <AnimatePresence>
          {Messages.map((message) => (
            <motion.div
              layout
              key={message.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="flex-shrink-0">
                <Image
                  src={message.avatar}
                  alt={`${message.senderhandle} avatar`}
                  width={40}
                  height={40}
                  className="w-13 h-13 rounded-full object-cover border-1 border-gray-200 dark:border-gray-800"
                />
              </div>

              <div
                className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg ${
                  message.isOwn ? 'items-end' : 'items-start'
                }`}
              >
                {!message.isOwn && (
                  <div className="text-xs flex gap-1 items-center font-medium text-gray-600 dark:text-gray-400 mb-1">
                    <span>{message.sendername}</span><b>.</b><Link href={`/${message.senderhandle}`}>{message.senderhandle}</Link>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`px-4 py-2 rounded-2xl shadow-sm ${
                    message.isOwn
                      ? 'bg-yellow-400 dark:bg-yellow-500 dark:text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                </motion.div>

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
            </motion.div>
          ))}
          { sendingMessage && (
            <div className="flex gap-1">
              <span className="animate-bounce">•</span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                •
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.4s" }}
              >
                •
              </span>
            </div>
          )}
        </AnimatePresence>
      </div>
        {/* Message composer */}
        <div className="messagesendsection relative border border-gray-200 dark:border-gray-900 inset-shadow-yellow-200 w-full rounded-xl px-4 py-1 mt-3 bg-white dark:bg-black flex items-center gap-3 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 cursor-pointer rounded-full bg-white dark:bg-black text-black hover:bg-gray-200 dark:hover:bg-gray-950"
              >
                <Smile className="w-4 h-4 dark:invert" />
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
                  className="p-2 cursor-pointer rounded-full bg-white dark:bg-black text-black hover:bg-gray-200 dark:hover:bg-gray-950"
                >
                  <Paperclip className="w-4 h-4 dark:invert" />
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
              onChange={(e) => { setmessageText(e.target.value) }}
              placeholder="type a message..."
              className="w-full text-sm bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl px-5 py-2.5 outline-none border-transparent border-none focus:bg-white dark:focus:bg-gray-950"
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              {messageText ? (
                <button
                  onClick={() => handleSendMessage(messageText)}
                  className="p-2 cursor-pointer rounded-full bg-white dark:bg-black text-black hover:bg-gray-200 transition dark:hover:bg-gray-950"
                >
                  <SendIcon className="w-4 h-4 dark:invert" />
                </button>
              ) : (
                <button
                  onClick={handleAudioPop}
                  className="p-2 cursor-pointer rounded-full bg-white dark:bg-black text-black hover:bg-gray-200 transition dark:hover:bg-gray-950"
                >
                  <Mic className="w-4 h-4 dark:invert" />
                </button>
              )}
            </TooltipTrigger>
            <TooltipContent>{messageText ? 'Send message' : 'Voice message'}</TooltipContent>
          </Tooltip>
        </div>

    </div>
  )}
{/* {
  <Mediapopmodal/>
} */}
{blockChatPop && (
  <BlockChatPop
    key={chatCardDetails?.id}
    username={String(chatCardDetails?.handle)}
    closeBlockPop={() => { setblockChatPop(false) }}
    isBlocked={false}
    updateblockState={() => {}}
  />
)}
</div>
)}

