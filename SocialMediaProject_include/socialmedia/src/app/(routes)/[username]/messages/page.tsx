'use client'

import React,{ useState , useEffect }from 'react'
import { motion } from 'framer-motion';
import Chatusercard from '@/components/chatusercard'
import Link from 'next/link'
import { useTheme } from 'next-themes'
// import useUnreadMessage from '@/app/states/unreadmessage'; 
import Image from 'next/image';
import AudioRecordModal from '@/components/audioRecordModal';
import BlockChatPop from '@/components/blockchat';
import MessageCard from '@/components/messagecard';
import Sharecontactonchat from '@/components/sharecontactonchat';
import Adduserinchatlist from '@/components/adduserinchatlist';
import { Acctype } from '@/components/adduserinchatlist'
import useSound from 'use-sound' ;
import EmojiPicker ,{ EmojiClickData } from 'emoji-picker-react';
import { SearchIcon, PlusCircleIcon,SendIcon ,User, BellOff,Folder, Eraser, UserX, Flag, Trash, Smile, Paperclip, Mic, Image as image, Video, File, Music, Square, Play, X, PhoneIcon, BarChart3, Images, MessageCirclePlus, BanIcon , Link2Icon, BellDot } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast';
import { infoForChatCard } from '@/components/chatusercard'

export default function Messages() {
  const [ChatSearch, setChatSearch] = useState('') ; // input for searching a paticular chat...
  const { resolvedTheme } = useTheme();
  const [ play ] = useSound('/audio/notification.mp3') ;
  const [CurrentOpenChat, setCurrentOpenChat] = useState<infoForChatCard>();
  const [chatSlideOpen, setchatSlideOpen] = useState<boolean>(false) ;
  const [addChatPop, setaddChatPop] = useState<boolean>(false);

  const handleAddUser = (AccForChat: Acctype) => {
    const newChat: infoForChatCard = {
      id: AccForChat.id,
      name: AccForChat.name,
      handle: AccForChat.handle,
      isVerified: false,
      lastMessage: 'New chat created !!',
      timestamp: 'Just now',
      avatarUrl: AccForChat.avatarUrl,
      unreadCount: 0
    };
    setconversations(prev => [...prev, newChat]);
  };
  const [openChatThreeDot, setopenChatThreeDot] = useState<boolean>(false) ;
  const [messageText, setmessageText] = useState('') ;
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [blockAccPop, setblockAccPop] = useState<boolean>(false);
  const [OpenedCard, setOpenedCard] = useState<infoForChatCard>() ;
  const [shareContact, setshareContact] = useState<boolean>(false);
  const [showFilePopup, setShowFilePopup] = useState<boolean>(false) ;
  const [showAudioModal, setShowAudioModal] = useState<boolean>(false) ;
 // const { setUnreadMessage } = useUnreadMessage() ; // getting the unread message state...
  const [conversations, setconversations] = useState<infoForChatCard[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      handle: '@alicejohnson',
      lastMessage: 'Hey, how are you?',
      timestamp: 'Fri Jun 05 2026', // random previous date via toDateString()
      isVerified: true,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Bob Smith',
      handle: '@bobsmith',
      lastMessage: 'Let\'s meet tomorrow',
      timestamp: '9:15 AM',
      isVerified: false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Charlie Brown',
      handle: '@charliebrown',
      lastMessage: 'Thanks for the help!',
      timestamp: 'Yesterday',
      isVerified:true,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '4',
      name: 'Diana Prince',
      handle: '@dianaprince',
      lastMessage: 'See you soon',
      timestamp: '2 days ago',
      isVerified:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 4
    },
    {
      id: '5',
      name: 'Eve Wilson',
      handle: '@evewilson',
      lastMessage: 'What\'s up?',
      timestamp: '3 hours ago',
      isVerified:true,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '6',
      name: 'Frank Miller',
      handle: '@frankmiller',
      lastMessage: 'Good morning!',
      timestamp: '8:45 AM',
      isVerified:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '7',
      name: 'Grace Lee',
      handle: '@gracelee',
      lastMessage: 'Call me later',
      timestamp: '1 hour ago',
      isVerified:true,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1
    },
    {
      id: '8',
      name: 'Henry Davis',
      handle: '@henrydavis',
      lastMessage: 'Nice work!',
      timestamp: 'Yesterday',
      isVerified:true,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1
    },
    {
      id: '9',
      name: 'Isaac Newton',
      handle: '@isaacnewton',
      lastMessage: 'Physics is fun!',
      timestamp: '5 minutes ago',
      isVerified:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 3
    },
    {
      id: '10',
      name: 'Jack Ryan',
      handle: '@jackryan',
      lastMessage: 'Mission accomplished',
      timestamp: '2 hours ago',
      isVerified:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '11',
      name: 'Karen White',
      handle: '@karenwhite',
      lastMessage: 'Let\'s catch up',
      timestamp: '1 day ago',
      isVerified:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 2
    },
    {
      id: '12',
      name: 'Liam Green',
      handle: '@liamgreen',
      lastMessage: 'Great idea!',
      timestamp: '30 minutes ago',
      isVerified:true,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1
    },
    {
      id: '13',
      name: 'Mia Black',
      handle: '@miablack',
      lastMessage: 'See you at the event',
      timestamp: '4 hours ago',
      isVerified:true,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '14',
      name: 'Noah Blue',
      handle: '@noahblue',
      lastMessage: 'Thanks again',
      timestamp: '3 days ago',
      isVerified:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 5
    },
    {
      id: '15',
      name: 'Olivia Red',
      handle: '@olivared',
      lastMessage: 'Happy birthday!',
      timestamp: '6 hours ago',
      isVerified:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    }
  ])
  const attachFileoptions = [
    { icon: <Images className="w-3 h-3 text-blue-500" />, label: "Photos" },
    { icon: <Video className="w-3 h-3 text-purple-500" />, label: "Videos" },
    { icon: <Music className="w-3 h-3 text-pink-500" />, label: "Audio" },
    { icon: <PhoneIcon className="w-3 h-3 text-red-500" />, label: "Contact" },
  ]
  const [filteredCards, setFilteredCards] = useState(conversations); // for handling the searched result array...

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
       if (openChatThreeDot && !(event.target as Element).closest('.Three_dot')) {
         setopenChatThreeDot(false)
       }
       if (showFilePopup && !(event.target as Element).closest('.file_popup')) {
         setShowFilePopup(false)
       }
     }

     if (openChatThreeDot || showFilePopup) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
       document.removeEventListener('mousedown', handleClickOutside)
     }
    }, [openChatThreeDot,showFilePopup])

  // function for calculating total unread message...
  function calculateTotalUnread(arrOfCardInfo : infoForChatCard[]) : void{
    let total = arrOfCardInfo.reduce((acc, obj) => acc + obj.unreadCount , 0);
    // setUnreadMessage(total) ; // updating the total unread messages...
  }

  const handleSearch = (searchedText: string) => {
    const filtered = conversations.filter((chatCard) =>
      chatCard.name.toLowerCase().includes(searchedText.toLowerCase()) ||  // high chance that account search without case sensitivity...
      chatCard.handle.toLowerCase().includes(searchedText.toLowerCase())
    );
    setFilteredCards(filtered);
  };
  // useffect hook for handling the search change...
  useEffect(() => {
    if (ChatSearch.trim())  handleSearch(ChatSearch); // run the funtion if something is searched...

    else  setFilteredCards(conversations); // show all if search is empty...
  }, [ChatSearch,conversations]);


  useEffect(() => {
    let getCardInfo = conversations.find((card) => card.id === CurrentOpenChat?.id) ;
    setOpenedCard(getCardInfo) ;
  }, [CurrentOpenChat])
  
  // function handling emoji selection logic...
  const onEmojiClick = (emojiData:EmojiClickData) => {
    setmessageText((prev) => prev + emojiData.emoji);
  };

  // useffect for page load actions..
  useEffect(() => {
    calculateTotalUnread(conversations);
  }, [])

  // function handling file option clicking logic...
  const handleFileOptionClick = (clickedLable:string) => {
     if (clickedLable === 'Contact') {
      setshareContact(true);
     }
     setShowFilePopup(false)
   }

  // function for handling chatcard click...
  function handleChatCardClick(card:infoForChatCard) {
    setCurrentOpenChat(card) ;  
    card.unreadCount = 0 ;
     setchatSlideOpen(true) 
  }

   // function handling sending message...
   const handleSendMessage = (msg:string) => {

    setmessageText('') ;
    play() ;
  }

  return (
    <div className='h-full flex flex-col lg:flex-row p-1 gap-1 font-poppins rounded-md dark:bg-black'>
        <div className={`relative chatList h-full flex-2 flex-col gap-1 rounded-md overflow-y-scroll overflow-x-hidden ${chatSlideOpen ? 'hidden lg:flex' : 'flex'}`}>
            <div className='searchSection sticky top-0 backdrop-blur-md flex items-center w-full max-w-md mx-auto p-2 m-2 rounded-lg  shadow-md border border-gray-200 dark:border-gray-700'>
                <span 
                  onClick={() => { handleSearch(ChatSearch) }}
                  className='text-gray-500 dark:text-gray-400 mr-1 cursor-pointer'>
                    <SearchIcon size={20} />
                </span>
                <input
                  type="text"
                  value={ChatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Search you chats..."
                  className="flex-grow backdrop-blur-sm outline-none border border-transparent focus:border-yellow-400 focus:ring-3 focus:ring-yellow-400/30 rounded-md px-3 py-1 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 transition-colors duration-200"
                />
            </div>
           {Array.isArray(filteredCards) && filteredCards.length > 0 ? 
            filteredCards.sort((card1,card2) => card2.unreadCount - card1.unreadCount).map((card) => (
              <Chatusercard onclick={() => { handleChatCardClick(card) }} key={card.id} cardInfo={card} currentOpenChat={CurrentOpenChat} />
            )) : (
            <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-950 flex items-center justify-center border border-gray-200 dark:border-gray-800">
                  <SearchIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">
                  No chats found
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                  {ChatSearch.trim() ? (
                    <>
                    No conversations match <span className="font-medium text-gray-900 dark:text-gray-200">“<b>{ChatSearch.trim()}</b>”</span>.
                    </>
                  ):(
                    <>
                    No chat started with any account...
                    </>
                  )}
                </p>
              </div>
            )}
            <div 
             onClick={() => { setaddChatPop(!addChatPop) }}
             className='sticky bottom-0 w-full flex items-center justify-center px-2 py-4 dark:bg-black/60 backdrop-blur-sm cursor-pointer rounded-full font-semibold'>
              <div className='flex items-center justify-center gap-2'><PlusCircleIcon  /><span>Add Account</span></div>
            </div>
        </div>

        {/* main chat section... */}
        <div className={`ChatSection h-full flex-4 rounded-md overflow-y-hidden transition-all duration-700`}>
          { OpenedCard && (
             <div className={`lg:hidden flex items-center justify-end rounded-md p-2`}>
                 <img 
                   onClick={() => { setchatSlideOpen(!chatSlideOpen) }}
                   src="/images/up-arrow.png" 
                   alt="arrow-open" 
                   className={`w-10 h-10 dark:invert cursor-pointer active:animate-ping transform ${ chatSlideOpen ? 'rotate-180' : 'rotate-0'}`}
                 />
             </div>
          )}
      <div className="relative flex flex-col h-full rounded-t-md">
     {OpenedCard ? (
      <>
        {/* Chat Header */}
        <div className="sticky top-0 flex items-center px-4 py-3 justify-between rounded-md shadow-sm border-b border-gray-200 dark:border-gray-900 dark:bg-black z-10">
          {/* Left Section - Avatar + Account Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={OpenedCard.avatarUrl}
                alt={OpenedCard.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              {/* bottom right yellow dot... */}
              <span className="absolute bottom-0 right-0 block w-3 h-3 bg-yellow-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div>

            <div className="flex flex-col">
              <h3 className="flex items-center gap-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                <span>{OpenedCard.name}</span>
                <span>.</span>
                <Link href={`/${OpenedCard.handle}`} className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  {OpenedCard.handle}
                </Link>
                {OpenedCard.isVerified && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                    <Image src='/images/yellow-tick.png' width={18} height={18} alt='verified'/>
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {OpenedCard.lastMessage} • {OpenedCard.timestamp}
              </p>
            </div>
          </div>

          {/* Right Section - 3 Dots */}
          <div className="relative">
            <button
              onClick={() => setopenChatThreeDot(!openChatThreeDot)}
              className="px-3 py-1 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 transition"
            >
              <span>⋮</span>
            </button>
            {openChatThreeDot && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="Three_dot absolute p-2 top-0 right-0 w-65 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl dark:shadow-gray-950 overflow-hidden z-50 animate-fadeIn">
                <Link href={`/${OpenedCard?.handle}`}
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => { setopenChatThreeDot(false) }}
                >
                   <User className="w-4 h-4" />
                   View<b>{OpenedCard?.handle}</b>
                </Link>
                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => { setopenChatThreeDot(false) }}
                >
                  <Folder className="w-4 h-4" />View all attachements
                </button>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => { setopenChatThreeDot(false) }}
                >
                  <Eraser className="w-4 h-4" />Clear chat history
                </button>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => { setopenChatThreeDot(false) }}
                >
                  <BanIcon className="w-4 h-4" />Block<b>{OpenedCard?.handle}</b>
                </button>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                  onClick={() => { setopenChatThreeDot(false) }}
                >
                  <Flag className="w-4 h-4" />Report Chat
                </button>

                <button
                  className="w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-700 hover:bg-red-100"
                  onClick={() => { setopenChatThreeDot(false) }}
                >
                  <Trash className="w-4 h-4" />Delete Conversation
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* section for main messages... */}
        <div className='overflow-y-auto p-2 flex flex-col flex-1 rounded-md'>
          {/* Component handling all the message related logic... */}
          {/* will pass the card details for current open chat and further proccessing inside the components... */}
          <MessageCard /> 
        </div>

          {/* message sending controls...  */}
          <div className="messagesendsection border border-gray-200 dark:border-gray-900 inset-shadow-yellow-200 sticky bottom-0 w-full rounded-xl px-4 py-1 bg-white dark:bg-black flex items-center gap-3 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => { setShowEmojiPicker(!showEmojiPicker) }}
                  className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200">
                  <Smile className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Add emoji
              </TooltipContent>
            </Tooltip>
            { showEmojiPicker && (
              <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='absolute bottom-14 left-0 z-50' >
                {/* @ts-ignore */}
                <EmojiPicker onEmojiClick={(emoji) => { onEmojiClick(emoji) }} theme={resolvedTheme === 'dark' ? 'dark' : resolvedTheme === 'light' ? 'light' : undefined} />
              </motion.div>
            )}
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setShowFilePopup(!showFilePopup)} className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Attach file
                </TooltipContent>
              </Tooltip>
              {showFilePopup && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3 }} className="file_popup absolute bottom-10 left-20 transform -translate-x-1/2 mt-3 z-50 
                w-44 bg-white dark:bg-black border rounded-lg shadow-xl overflow-hidden"
             >
              <div className="flex flex-col p-2">
                 {attachFileoptions.map((item, index) => (
                   <button
                     key={index}
                    onClick={() => { handleFileOptionClick(item.label) }}
                     className="flex items-center cursor-pointer rounded-lg gap-3 px-3 py-2 w-full text-sm font-medium text-gray-700 
                    dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-950">
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
                className="w-full bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl px-5 py-2.5 outline-none border-transparent border-none focus:bg-white dark:focus:bg-gray-950"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                {messageText ? (
                <button 
                onClick={() => { handleSendMessage(messageText) }}
                className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200 transition">
                   <SendIcon className="w-4 h-4" />
                </button>
                ) : (
                <button onClick={() => setShowAudioModal(true)} className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200 transition">
                  <Mic className="w-4 h-4" />
                </button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {messageText ? "Send message" : "Voice message"}
              </TooltipContent>
            </Tooltip>
          </div>
      </>
    ) : (
      /* Fallback when no chat is selected */
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <MessageCirclePlus onClick={() => { setaddChatPop(!addChatPop) }} size={64} className="cursor-pointer hover:scale-105 text-black dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-2">
          No Chat Selected yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm text-sm">
          Select a chat from the chatlist you have texted in past or add an account to start messaging.
        </p>
      </div>
    )}
  </div>
</div>
{showAudioModal && (
  <AudioRecordModal closePopUp={() => setShowAudioModal(false)} />
)}
{addChatPop && (
  <Adduserinchatlist closePop={() => setaddChatPop(false)} onAddChat={handleAddUser} />
)}
{shareContact && (
  <Sharecontactonchat closeShareContact={() => setshareContact(false)}  />
)}
{blockAccPop && (
  <BlockChatPop key={CurrentOpenChat?.id} username={String(CurrentOpenChat?.handle)} closeBlockPop={() => { setblockAccPop(false) }} isBlocked={false} updateblockState={() => {}}  />
)}
    </div>
)}
