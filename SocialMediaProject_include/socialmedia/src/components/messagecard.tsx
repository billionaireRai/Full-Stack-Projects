'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usernameRegex } from '@/app/controllers/regex'
import Image from 'next/image'
import { motion , AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import EmojiPicker, { EmojiClickData ,Theme } from 'emoji-picker-react'
import { useSound } from 'use-sound'
import { BanIcon, Eraser, Flag, Folder, Images, Mic, Music, Paperclip, PhoneIcon, SendIcon, Smile, Trash, Video, CheckCircle, MessageCirclePlus, User, PinIcon, SearchIcon, BellOff, Lock, Bell, PinOff, Ban, LockOpenIcon, MicOff, X, AtSign } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AudioRecordModal from '@/components/audioRecordModal'
import Sharecontactonchat from '@/components/sharecontactonchat'
import BlockChatPop from '@/components/blockchat'
import Mediapopmodal, { mediaType } from './mediapopmodal'
import AddAccinchatlist from '@/components/adduserinchatlist'
import toast from 'react-hot-toast'
import { userCardProp } from '@/components/usercard'
import { infoForChatCard } from './chataccountcard'
import Attachmentpop from './attachmentpop'
import Videoplayer from './videoplayer'
import Audioplayer from './Audioplayer'

interface Message {
  id: string
  sendername: string
  senderhandle: string
  text: string
  media?:mediaType[]
  timestamp: string
  isOwn: boolean
  avatar: string
  status?: 'sent' | 'delivered' | 'seen'
}

interface attachmentOptionType {
  icon: React.ReactNode
  label: string
  reference?: React.RefObject<HTMLInputElement | null>
}

interface MessageCardProps {
  chatCardDetails?: infoForChatCard
  handleAudioPop: () => void
  handleAddChat: () => void
  updateCardDetail: (msg: string, time: string) => void
  openBlockPop:() => void
  openReportPop:() => void
  openDeletePop:() => void
}

export default function MessageCard({ chatCardDetails,openBlockPop, openReportPop , handleAudioPop, handleAddChat, updateCardDetail ,openDeletePop }: MessageCardProps) {
  const { resolvedTheme , } = useTheme()
  const [play] = useSound('/audio/notification.mp3')
  const heightGap: number = 200
  const msgsection = useRef<HTMLDivElement | null>(null)
  const messagesize = useRef<number>(15)
  const imageRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLInputElement | null>(null)
  const audioRef = useRef<HTMLInputElement | null>(null)
  const [messagePage, setmessagePage] = useState<number>(1);
  const [messageText, setmessageText] = useState('')
  const [PopMedia, setPopMedia] = useState<mediaType>()
  const [MediaFiles, setMediaFiles] = useState<File[]>([]);
  const [imgUrls, setimgUrls] = useState<string[]>([]);
  const [videoUrls, setvideoUrls] = useState<string[]>([]);
  const [audioUrls, setaudioUrls] = useState<string[]>([]);
  const [mentions, setmentions] = useState<string[]>([]);
  const [openChatThreeDot, setopenChatThreeDot] = useState<boolean>(false)
  const [loadingChat, setloadingChat] = useState<boolean>(false);
  const [sendingMessage, setsendingMessage] = useState<boolean>(false);
  const [showMedia, setshowMedia] = useState<boolean>(false);
  const [showAttachments, setshowAttachments] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [showFilePopup, setShowFilePopup] = useState<boolean>(false)
  const [shareContact, setshareContact] = useState<boolean>(false)

  const hasAddedMediaOrMention = MediaFiles.length > 0 || mentions.length > 0 ; // if some media is added to share...
  // Attachments option
  const attachFileoptions = useMemo(() => [
      { icon: <Images className="w-5 h-5 text-blue-500" />, label: 'image' , reference:imageRef },
      { icon: <Video className="w-5 h-5 text-purple-500" />, label: 'video' , reference:videoRef },
      { icon: <Music className="w-5 h-5 text-pink-500" />, label: 'audio' , reference:audioRef },
      { icon: <AtSign className="w-5 h-5 text-red-500" />, label: 'mention' },
    ],
  [],)

  // Dummy messages (some have media)
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
        media: [
          {
            url: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=60',
            media_type: 'image',
          },
        ],
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
        media: [
          {
            url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=60',
            media_type: 'image',
          },
          {
            media_type: 'audio',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          },
        ],
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
        status: 'sent',
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
        status: 'sent',
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
        status: 'sent',
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
  
  // useeffect for pagination of chat history...
  // useEffect(() => {
  //   if ((msgsection.current?.scrollTop ?? 0) <= heightGap) {
  //     console.log("Current Gap gap from above :",msgsection.current?.scrollTop)
  //   }

  // }, [msgsection.current?.scrollTop])
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (openChatThreeDot && !target.closest('.Three_dot')) setopenChatThreeDot(false);
      
      if (showFilePopup && !target.closest('.file_popup')) setShowFilePopup(false);
      
      if (showEmojiPicker && !target.closest('.emoji_picker_wrapper'))  setShowEmojiPicker(false);

      if (shareContact && !target.closest('.mentionpop'))  setshareContact(false);
    }

    document.addEventListener('mousedown', handleClickOutside) ;

    return () => {
      document.removeEventListener('mousedown', handleClickOutside) ;
    }
  }, [openChatThreeDot,showFilePopup,showEmojiPicker,shareContact])

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setmessageText((prev) => prev + emojiData.emoji)
  }

  // function for handling mention adding...
  const handleMentionAdd = (handle:string) => { 
    setmentions((prev) => (prev ? [...prev, handle] : prev));
    toast.success(`Mentioned account ${handle}`);
   }

  const handleFileOptionClick = (option:attachmentOptionType) => {
    if (option.label === 'mention') {
      setshareContact(true);
      setShowFilePopup(false);
    } else {
      setShowFilePopup(false);
      option.reference?.current?.click();
    }
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
      // will render media url array with types...
      media:[
        {
          url: '/images/twitter.png',
          media_type: 'image',
        }
      ],
      isOwn: true,
      avatar:
        'https://res.cloudinary.com/dvgcc6gts/image/upload/v1778002271/briezl-media/%40amritanshdevProfilePic.jpeg.jpg',
      status: 'sent',
    }

    setMessages((prevmessages) => [...prevmessages, newMessage])
    setmessageText('');
    play()
  }

  // handling media click...
  function handleMediaPop(media:mediaType) {
    setPopMedia(media);
    setshowMedia(true);
  }
  // downscrolling of chat on new message...
  useEffect(() => {
    if (!msgsection.current) return ;
    const lastmessage = Messages[Messages.length - 1] ;
    msgsection.current.scrollTop = msgsection.current.scrollHeight
    updateCardDetail(lastmessage.text,lastmessage.timestamp)
  }, [Messages])

  // logic for hanlding attachments sharing...  
    const removeArrayElement = (setters: React.Dispatch<React.SetStateAction<any[]>>[], index: number) => {
      setters.forEach(setter => setter(prev => prev.filter((_, i) => i !== index)));
    };
  
    const handleMediaInclude = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        if (type === 'image') {
          setimgUrls(prev => [...prev, url]);
          setMediaFiles(prev => [...prev, file]);
        } else if(type === 'video') {
          setvideoUrls(prev => [...prev, url]);
          setMediaFiles(prev => [...prev, file]);          
        } else {
          setaudioUrls(prev => [...prev, url]);
          setMediaFiles(prev => [...prev, file]);
        }
      }
      e.target.value = '';
    };

  // function for parsing mentions into Link...
  const makeMentionsAsLink = (msg: string) => {
    if (!msg?.trim()) return null ;
  
    const parts = msg.split(/(@[a-zA-Z0-9_]{8,20})/g);
  
    return parts.map((part, idx) => {
      if (part.startsWith("@") && usernameRegex.test(part.slice(1))) {
  
       return (
        <Link
          key={idx}
          href={`/${part}`}
          className="text-yellow-500 hover:text-shadow-xs text-shadow-yellow-400"
        >
          {part}
        </Link>
       );
      }
        
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="flex flex-col h-full rounded-md">
      {!chatCardDetails ? (
        <div className="flex flex-col items-center justify-center h-fit text-center p-6">
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
          <div className="text-xs flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 max-w-md">
            <b>These chats are instant based for other device (No message history available on other device login)</b>
            <p>Select any chat to start a conversation or add an account to Send messages, share media, and keep up with the latest updates.you chats are (End-To-End Encrypted)</p>
            <div><Lock className='text-black dark:text-white'/></div>
          </div>
          </div>
      ) : (
        <div className='flex flex-col h-full rounded-xl'>
          {/* Chat Header */}
          <div className="sticky top-0 flex items-center px-4 py-3 justify-between rounded-md shadow-sm border-b border-gray-200 dark:border-gray-900 dark:bg-black z-10">
           <div className="flex items-center gap-3">
             <div onClick={() => { handleMediaPop({ url:chatCardDetails?.avatarUrl , media_type:'image' }) }} className="relative cursor-pointer">
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
          <div className='flex items-center justify-end gap-1 p-2 rounded-full flex-1'>
            {chatCardDetails.pinned && <PinIcon className="w-5 h-5 rotate-45 text-yellow-500" /> }
            {chatCardDetails.blockedTo && <Ban className="w-5 h-5 text-red-500" /> }
            {chatCardDetails.isMuted && <MicOff className="w-5 h-5 text-blue-500" /> }
          </div>
          <div className="relative">
            <button
              onClick={() => setopenChatThreeDot(!openChatThreeDot)}
              className={`px-3 py-1 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition ${chatCardDetails.blockedTo && 'blur-none'}`}
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
                  className='w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950'
                  onClick={() => setopenChatThreeDot(false)}
                >
                  <User className="w-4 h-4" />
                  <div>
                    View <b>{chatCardDetails?.handle}</b>
                  </div>
                </Link>

                <button
                  className={`w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${chatCardDetails.blockedTo && 'blur-sm cursor-not-allowed'}`}
                  onClick={() => { setshowAttachments(true) ; setopenChatThreeDot(false) }}
                  disabled={chatCardDetails.blockedTo}
                >
                  <Folder className="w-4 h-4" />
                  <div>View all attachements</div>
                </button>

                <button
                  className={`w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${chatCardDetails.blockedTo && 'blur-sm cursor-not-allowed'}`}
                  onClick={() => setopenChatThreeDot(false)}
                  disabled={chatCardDetails.blockedTo}
                >
                  {chatCardDetails.isMuted ? <Bell className="w-4 h-4"/> : <BellOff className="w-4 h-4" /> }
                  <div>{chatCardDetails.isMuted ? <b>UnMute</b> : 'Mute'} notifications</div>
                </button>

                <button
                  className={`w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${chatCardDetails.blockedTo && 'blur-sm cursor-not-allowed'}`}
                  onClick={() => setopenChatThreeDot(false)}
                  disabled={chatCardDetails.blockedTo}
                >
                  {chatCardDetails.pinned ? <PinOff className="w-4 h-4"/> : <PinIcon className="w-4 h-4 rotate-45" /> }
                  <div>{chatCardDetails.pinned ? <b>UnPin</b> : 'Pin'} chat</div>
                </button>

                <button
                  className={`w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${chatCardDetails.blockedTo && 'blur-sm cursor-not-allowed'}`}
                  onClick={() => setopenChatThreeDot(false)}
                  disabled={chatCardDetails.blockedTo}
                >
                  <SearchIcon className="w-4 h-4" />
                  <div>Search messages</div>
                </button>

                <button
                  className={`w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${chatCardDetails.blockedTo && 'blur-sm cursor-not-allowed'}`}
                  onClick={() => setopenChatThreeDot(false)}
                  disabled={chatCardDetails.blockedTo}
                >
                  <Eraser className="w-4 h-4" />
                  <div>Clear chat history</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                  onClick={() => { openReportPop() ; setopenChatThreeDot(false)}}
                >
                  <Flag className="w-4 h-4" />
                  <div>Report chat</div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                  onClick={() => { openBlockPop() ; setopenChatThreeDot(false) }}
                >
                  {chatCardDetails.blockedTo ? <LockOpenIcon className="w-4 h-4"/> : <Ban className="w-4 h-4" /> }
                  <div>
                    {chatCardDetails.blockedTo ? <b>UnBlock</b> : 'Block' } chats <b>{chatCardDetails?.handle}</b>
                  </div>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md truncate flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                  onClick={() => { openDeletePop?.()  ; setopenChatThreeDot(false)}}
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
        <div ref={msgsection} className={`overflow-y-auto overflow-x-hidden flex gap-2 flex-col p-2 h-full rounded-md ${chatCardDetails.blockedTo && 'blur-sm'}`}>
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

              <div className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg ${message.isOwn ? 'items-end' : 'items-start'}`}>
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
                  {Array.isArray(message.media) && message.media?.length && (
                    <div className="my-2 flex flex-col gap-2 w-full rounded-xl ">
                      {message.media.map((m, idx) => (
                        <div key={`${m.media_type}-${idx}`}>
                          {m.media_type === 'image' && (
                            <div onClick={() => { handleMediaPop(m) }} className="relative w-80 h-70">
                              <Image src={m.url} alt="message-image" fill className="w-full cursor-pointer hover:scale-101 transition-transform duration-200 rounded-xl object-cover" />
                            </div>
                          )}
                          {m.media_type === 'video' && (
                            <div onClick={() => { handleMediaPop(m) }} className="w-80 h-70">
                              <video src={m.url} controls className="w-full cursor-pointer hover:scale-101 transition-transform duration-200 rounded-xl" />
                            </div>
                          )}
                          {m.media_type === 'audio' && (
                            <div>
                              <div className="w-full cursor-pointer transition-transform duration-200">
                                <Audioplayer url={m.url} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed break-words">{makeMentionsAsLink(message.text)}</p>
                </motion.div>

                <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <span>{message.timestamp}</span>
                  {message.isOwn && message.status && (
                    <span className="flex items-center">
                      {message.status === 'sent' && (
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
            <div className="flex items-center justify-end gap-1 py-2 px-4 mt-2 rounded-xl">
              <span className='rounded-full py-1 px-3 text-yellow-500'>sending</span>
              <span className="animate-bounce w-2 h-2 rounded-full border border-yellow-500 bg-yellow-500"></span>
              <span className="animate-bounce w-2 h-2 rounded-full border border-yellow-500 bg-yellow-500" style={{ animationDelay: "0.2s" }} ></span>
              <span className="animate-bounce w-2 h-2 rounded-full border border-yellow-500 bg-yellow-500" style={{ animationDelay: "0.4s" }} ></span>
            </div>
          )}
        </AnimatePresence>
      </div>
      {/* Message composer */}
       <div className={`flex flex-col justify-start gap-2 ${hasAddedMediaOrMention && 'mt-5'} rounded-xl`}>
        <div className="flex flex-wrap gap-2 items-center rounded-xl">
          {/* media user want to send... */}
          {[...imgUrls.map((url, index) => ({ url, index, kind: 'image' })),...videoUrls.map((url, index) => ({ url, index, kind: 'video' })),...audioUrls.map((url, index) => ({ url, index, kind: 'audio' }))].map((item) => (
            <div
              key={`${item.kind}-${item.index}-${item.url}`}
              className={`relative group rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-black ${item.kind === 'audio' ? 'w-xs' : 'w-50'} h-42`}
            >
              <AnimatePresence>
              {item.kind === 'image' && (
                <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale:0.9 , opacity:0 }}
                 transition={{ delay: item.index * 0.05 }}
                 >
                <Image
                  src={item.url}
                  alt={`preview image ${item.index + 1}`}
                  fill
                  className="object-cover cursor-pointer transition-transform duration-200 hover:scale-102"
                  onClick={() => { handleMediaPop({ url:item.url , media_type:item.kind }) }}
                />
                </motion.div>
              )}


              {item.kind === 'video' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: item.index * 0.05 }}
                  className="absolute inset-0 cursor-pointer transition-transform duration-200 hover:scale-102 flex items-center justify-center bg-black/10"
                >
                  <div 
                    className="w-full h-full object-cover" 
                    onClick={() => { handleMediaPop({ url:item.url , media_type:item.kind }) }} 
                  >
                    <Videoplayer url={item.url} />
                  </div>
                </motion.div>
              )}

              {item.kind === 'audio' && (
                 <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: item.index * 0.05 }}
                  className="absolute inset-0 cursor-pointer transition-transform duration-200 hover:scale-102 flex flex-col items-center justify-center gap-3 p-2"
                >
                   <span className="text-yellow-500 rounded-full bg-yellow-100 dark:bg-yellow-950 p-4">
                     <Music className="w-8 h-8" />
                   </span>
                   <span className="text-[10px] text-gray-600 dark:text-gray-300 w-full" >
                    <Audioplayer url={item.url} />
                   </span>
                 </motion.div>
              )}
              </AnimatePresence>

              <button
                type="button"
                aria-label="remove media"
                onClick={() =>
                  item.kind === 'image'
                    ? removeArrayElement([setimgUrls, setMediaFiles], item.index)
                    : item.kind === 'video'
                      ? removeArrayElement([setvideoUrls, setMediaFiles], item.index)
                      : removeArrayElement([setaudioUrls, setMediaFiles], item.index)
                }
                className="absolute top-1 right-1 w-7 h-7 rounded-full cursor-pointer bg-black dark:bg-black/80 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
          {/* accounts which user wanna mention */}
          {Array.isArray(mentions) && mentions.length > 0 && (
            <div className="flex flex-wrap gap-2">
            {mentions.map((handle,idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }} 
                  key={idx} 
                  className='group relative border rounded-full flex items-center justify-center'
                >
                <Link
                  key={handle}
                  href={`/${handle}`}
                  className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-gray-950 py-2 px-3 rounded-full "
                >
                  {handle}
                </Link>
              <button
                type="button"
                aria-label="remove media"
                onClick={() => setmentions(mentions.filter((mention) => mention !== handle))}
                className="absolute -top-2 -right-2 p-1 w-5 h-5 rounded-full cursor-pointer bg-black dark:bg-black/80 shadow-sm flex items-center justify-center opacity-0 group-hover: group-hover:opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="text-red-500" />
              </button>
             </motion.div>
            ))}
            </div>
          )}

        <div className={`messagesendsection relative border border-gray-200 dark:border-gray-900 inset-shadow-yellow-200 w-full rounded-xl px-4 py-1 mt-3 bg-white dark:bg-black flex flex-row flex-nowrap items-center gap-3 z-10 ${chatCardDetails.blockedTo && 'blur-sm'}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={chatCardDetails.blockedTo}
                className={`p-2 cursor-pointer rounded-full bg-white dark:bg-black text-black hover:bg-gray-200 dark:hover:bg-gray-950 ${chatCardDetails.blockedTo && 'cursor-not-allowed'}`}
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
              className='absolute bottom-14 left-0 z-50 emoji_picker_wrapper'
            >
              <EmojiPicker
                onEmojiClick={(emoji) => { onEmojiClick(emoji) }}
                theme={resolvedTheme === 'dark' ? Theme.DARK : Theme.LIGHT}
              />
            </motion.div>
          )}

          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowFilePopup(!showFilePopup)}
                  disabled={chatCardDetails.blockedTo}
                  className='p-2 cursor-pointer rounded-full bg-white dark:bg-black text-black hover:bg-gray-200 dark:hover:bg-gray-950'
                >
                  <Paperclip className="w-4 h-4 dark:invert" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>

            {/* mention pop container... */}
            {shareContact && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }} 
                className='mentionpop absolute bottom-10 left-0 border border-gray-200 dark:border-gray-800 rounded-xl'>
              <Sharecontactonchat 
                closeShareContact={() => { setshareContact(false) }}
                addInMention={(handle) => { handleMentionAdd(handle) }}
              />
              </motion.div>
            )}

            {/* attachment controller options... */}
            {showFilePopup && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='file_popup absolute bottom-10 left-0 mt-3 z-50 w-44 bg-white dark:bg-black border rounded-lg shadow-xl overflow-hidden'
              >
                <div className="flex flex-col p-1.5">
                  {attachFileoptions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleFileOptionClick(item)}
                      className="flex items-center cursor-pointer rounded-lg gap-3 px-3 py-2 w-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-950"
                    >
                      <div 
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-950">
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
              disabled={chatCardDetails.blockedTo}
              placeholder="Type your message..."
              className={`w-full text-sm backdrop-blur-sm outline-none border border-transparent focus:border-yellow-400 focus:ring-3 focus:ring-yellow-400/30 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 transition duration-300 ${chatCardDetails.blockedTo && 'cursor-not-allowed'}`}
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              {(messageText.trim() || hasAddedMediaOrMention) ? (
                <button
                  onClick={() => handleSendMessage(messageText)}
                  disabled={chatCardDetails.blockedTo}
                  className='p-2 cursor-pointer rounded-full bg-white dark:bg-black text-black hover:bg-gray-200 dark:hover:bg-gray-950'
                >
                  <SendIcon className="w-4 h-4 dark:invert" />
                </button>
              ) : (
                <button
                  onClick={handleAudioPop}
                  disabled={chatCardDetails.blockedTo}
                  className='p-2 cursor-pointer rounded-full bg-white dark:bg-black text-black hover:bg-gray-200 dark:hover:bg-gray-950'
                >
                  <Mic className="w-4 h-4 dark:invert" />
                </button>
              )}
            </TooltipTrigger>
            <TooltipContent>{messageText ? 'Send message' : 'Voice message'}</TooltipContent>
          </Tooltip>
         </div>
       </div>

         {/* Hidden file inputs */}
        <input
          type="file"
          accept="image/*"
          ref={imageRef}
          onChange={(e) => handleMediaInclude(e, 'image')}
          className="hidden"
          multiple
        />
        <input
          type="file"
          accept="video/*"
          ref={videoRef}
          onChange={(e) => handleMediaInclude(e, 'video')}
          className="hidden"
        />
        <input
          type="file"
          accept="audio/*"
          ref={audioRef}
          onChange={(e) => handleMediaInclude(e, 'audio')}
          className="hidden"
        />
        {/* <input
          type="tel"
          pattern="[0-9]{10}"
          ref={contactRef}
          onChange={(e) => handleMediaInclude(e, 'audio')}
          className="hidden"
        /> */}
    </div>
  )}
{showMedia && PopMedia && (
  <Mediapopmodal closepop={() => { setshowMedia(false) }} media={PopMedia}/>
)}

{showAttachments && (
  <Attachmentpop handleMediaClick={(m:mediaType) => { handleMediaPop(m) }} closePop={() => { setshowAttachments(false) }} menuOptions={attachFileoptions} />
)}

</div>
)}

