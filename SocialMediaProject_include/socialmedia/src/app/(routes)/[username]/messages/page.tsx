'use client'

import React,{ useState , useEffect }from 'react'
import Chatusercard from '@/components/chatusercard'
import { useTheme } from 'next-themes'
// import useUnreadMessage from '@/app/states/unreadmessage'; 
import Image from 'next/image';
import AudioRecordModal from '@/components/audioRecordModal';
import MessageCard from '@/components/messagecard';
import Sharecontactonchat from '@/components/sharecontactonchat';
import Adduserinchatlist from '@/components/adduserinchatlist';
import { USER } from '@/components/adduserinchatlist'
import useSound from 'use-sound' ;
import EmojiPicker ,{ EmojiClickData } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { SearchIcon, PlusCircleIcon, MessageCircleIcon,SendIcon ,User, BellOff,Folder, Eraser, UserX, Flag, Trash, Smile, Paperclip, Mic, Image as image, Video, File, Music, Square, Play, X, PhoneIcon, BarChart3 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast';

export interface infoForChatCard {
  id: string;
  name: string;
  handle: string;
  lastMessage: string;
  timestamp: string;
  avatarUrl: string;
  unreadCount: number;
}

export default function Messages() {
  const [PersonSearch, setPersonSearch] = useState('') ;
  const [ play ] = useSound('/audio/notification.mp3') ;
  const { resolvedTheme } = useTheme();
  const [CurrentOpenChat, setCurrentOpenChat] = useState<string>('');
  const [chatSlideOpen, setchatSlideOpen] = useState<boolean>(false) ;
  const [addUserPop, setaddUserPop] = useState<boolean>(false);

  const handleAddUser = (user: USER) => {
    const newChat: infoForChatCard = {
      id: user.id,
      name: user.name,
      handle: user.handle,
      lastMessage: 'New chat created',
      timestamp: 'Just now',
      avatarUrl: user.avatarUrl,
      unreadCount: 0
    };
    setcardInfo(prev => [...prev, newChat]);
  };
  const [openChatThreeDot, setopenChatThreeDot] = useState<boolean>(false) ;
  const [messageText, setmessageText] = useState('') ;
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [OpenedCard, setOpenedCard] = useState<infoForChatCard>() ;
  const [shareContact, setshareContact] = useState<boolean>(false);
  const [showFilePopup, setShowFilePopup] = useState<boolean>(false) ;
  const [showAudioModal, setShowAudioModal] = useState<boolean>(false) ;
 // const { setUnreadMessage } = useUnreadMessage() ; // getting the unread message state...
  const [cardInfo, setcardInfo] = useState<infoForChatCard[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      handle: 'alicejohnson',
      lastMessage: 'Hey, how are you?',
      timestamp: '10:30 AM',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Bob Smith',
      handle: 'bobsmith',
      lastMessage: 'Let\'s meet tomorrow',
      timestamp: '9:15 AM',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Charlie Brown',
      handle: 'charliebrown',
      lastMessage: 'Thanks for the help!',
      timestamp: 'Yesterday',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '4',
      name: 'Diana Prince',
      handle: 'dianaprince',
      lastMessage: 'See you soon',
      timestamp: '2 days ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 4
    },
    {
      id: '5',
      name: 'Eve Wilson',
      handle: 'evewilson',
      lastMessage: 'What\'s up?',
      timestamp: '3 hours ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '6',
      name: 'Frank Miller',
      handle: 'frankmiller',
      lastMessage: 'Good morning!',
      timestamp: '8:45 AM',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '7',
      name: 'Grace Lee',
      handle: 'gracelee',
      lastMessage: 'Call me later',
      timestamp: '1 hour ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1
    },
    {
      id: '8',
      name: 'Henry Davis',
      handle: 'henrydavis',
      lastMessage: 'Nice work!',
      timestamp: 'Yesterday',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1
    },
    {
      id: '9',
      name: 'Isaac Newton',
      handle: 'isaacnewton',
      lastMessage: 'Physics is fun!',
      timestamp: '5 minutes ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 3
    },
    {
      id: '10',
      name: 'Jack Ryan',
      handle: 'jackryan',
      lastMessage: 'Mission accomplished',
      timestamp: '2 hours ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '11',
      name: 'Karen White',
      handle: 'karenwhite',
      lastMessage: 'Let\'s catch up',
      timestamp: '1 day ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 2
    },
    {
      id: '12',
      name: 'Liam Green',
      handle: 'liamgreen',
      lastMessage: 'Great idea!',
      timestamp: '30 minutes ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1
    },
    {
      id: '13',
      name: 'Mia Black',
      handle: 'miablack',
      lastMessage: 'See you at the event',
      timestamp: '4 hours ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    },
    {
      id: '14',
      name: 'Noah Blue',
      handle: 'noahblue',
      lastMessage: 'Thanks again',
      timestamp: '3 days ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 5
    },
    {
      id: '15',
      name: 'Olivia Red',
      handle: 'olivared',
      lastMessage: 'Happy birthday!',
      timestamp: '6 hours ago',
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0
    }
  ])
  const attachFileoptions = [
    { icon: <image className="w-3 h-3 text-blue-500" />, label: "Photos" },
    { icon: <Video className="w-3 h-3 text-purple-500" />, label: "Videos" },
    { icon: <File className="w-3 h-3 text-green-500" />, label: "Documents" },
    { icon: <Music className="w-3 h-3 text-pink-500" />, label: "Audio" },
    { icon: <PhoneIcon className="w-3 h-3 text-red-500" />, label: "Contact" },
    { icon: <BarChart3 className="w-3 h-3 text-red-500" />, label: "Poll" },
  ]
  const [filteredCards, setFilteredCards] = useState(cardInfo); // for handling the searched result array...

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
    const filtered = cardInfo.filter((userCard) =>
      userCard.name.toLowerCase().includes(searchedText.toLowerCase()) ||  // high chance that user search without case sensitivity...
      userCard.handle.toLowerCase().includes(searchedText.toLowerCase())
    );
    setFilteredCards(filtered);
  };
  // useffect hook for handling the search change...
  useEffect(() => {
   if (PersonSearch.trim()) {
    handleSearch(PersonSearch); // run the funtion if something is searched...
  } else {
    setFilteredCards(cardInfo); // show all if search is empty
  }
}, [PersonSearch, cardInfo]);


  useEffect(() => {
    let getCardInfo = cardInfo.find((card) => card.id === CurrentOpenChat) ;
    setOpenedCard(getCardInfo) ;
  }, [CurrentOpenChat])
  
  // function handling emoji selection logic...
  const onEmojiClick = (emojiData:EmojiClickData) => {
    setmessageText((prev) => prev + emojiData.emoji);
  };

  // useffect for page load actions..
  useEffect(() => {
    calculateTotalUnread(cardInfo);
  }, [])

  // function handling file option clicking logic...
  const handleFileOptionClick = (clickedLable:string) => {
     if (clickedLable === 'Contact') {
      setshareContact(true);
     }
     setShowFilePopup(false)
   }

  const menuItems = [
    { icon: User, label: 'View Profile'},
    { icon: BellOff, label: 'Mute Notifications'},
    { icon: Folder, label: 'View Media, Links & Docs' },
    { icon: Eraser, label: 'Clear Chat' },
    { icon: UserX, label: 'Block User' },
    { icon: Flag, label: 'Report Chat' },
    { icon: Trash, label: 'Delete Chat', className: 'text-red-700 dark:text-red-700' },
  ];

   // function handling sending message...
   const handleSendMessage = (msg:string) => {
    setmessageText('') ;
    play() ;
  }

  return (
    <div className='h-full flex flex-col lg:flex-row md:ml-72 p-1 gap-1 font-poppins rounded-md dark:bg-black'>
        <div className={`relative chatList h-full flex-2 flex-col gap-1 rounded-md overflow-y-scroll overflow-x-hidden ${chatSlideOpen ? 'hidden lg:flex' : 'flex'}`}>
            <div className='sticky top-0 searchSection backdrop-blur-md flex items-center w-full max-w-md mx-auto p-2 mb-3 rounded-lg bg-gray-100/80 dark:bg-gray-950/80 shadow-md border border-gray-300 dark:border-gray-700'>
                <span 
                  onClick={() => { handleSearch(PersonSearch) }}
                  className='text-gray-500 dark:text-gray-400 mr-3 cursor-pointer'>
                    <SearchIcon size={20} />
                </span>
                <input
                    type="text"
                    value={PersonSearch}
                    onChange={(e) => setPersonSearch(e.target.value)}
                    placeholder="Search people..."
                    className="flex-grow bg-transparent outline-none border border-transparent focus:border-yellow-400 dark:focus:border-blue-500 focus:ring-1 focus:ring-yellow-400 dark:focus:ring-blue-400 rounded-md px-3 py-1 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                />
            </div>
            {filteredCards.map((card) => (
              <Chatusercard onclick={() => { setCurrentOpenChat(card.id) ;  card.unreadCount = 0 ; setchatSlideOpen(true) }} key={card.id} cardInfo={card} currentOpenChat={CurrentOpenChat} />
            ))}
            <div 
             onClick={() => { setaddUserPop(!addUserPop) }}
             className='mt-10 w-full flex items-center justify-center p-2 cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-950 rounded-lg'>
              <span><PlusCircleIcon  /></span>
            </div>
        </div>
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
          {/* Left Section - Avatar + User Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={OpenedCard.avatarUrl}
                alt={OpenedCard.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div>

            <div className="flex flex-col">
              <h3 className="flex items-center gap-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                <span>{OpenedCard.name}</span>
                <span>.</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                  @{OpenedCard.handle}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                  <Image src='/images/yellow-tick.png' width={18} height={18} alt='verified'/>
                </span>
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
              <div className="Three_dot absolute right-2 font-semibold p-2 top-12 w-65 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl dark:shadow-gray-950 overflow-hidden z-50 animate-fadeIn">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full cursor-pointer rounded-md flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${item.className || ''}`}
                    onClick={() => { setopenChatThreeDot(false) }}
                  >
                    <item.icon className="w-4 h-4" /> {item.label}
                  </button>
                ))}
              </div>
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
          <div className="messagesendsection shadow-md sticky bottom-0 w-full rounded-md px-4 py-1 bg-white dark:bg-black flex items-center gap-3 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => { setShowEmojiPicker(!showEmojiPicker) }}
                  className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200 transition">
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
                  <button onClick={() => setShowFilePopup(!showFilePopup)} className="p-2 cursor-pointer rounded-full bg-white dark:invert text-black hover:bg-gray-200 transition">
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
                    dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-950 transition-all duration-200">
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
                className="w-full bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl px-5 py-2.5 outline-none border-transparent border-none focus:bg-white dark:focus:bg-gray-900 transition-all duration-300"
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
        <MessageCircleIcon size={64} className="text-black dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-2">
          No Chat Selected yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm">
          Select a chat from the chatlist or add a user to start messaging.
        </p>
      </div>
    )}
  </div>
</div>
{showAudioModal && (
  <AudioRecordModal closePopUp={() => setShowAudioModal(false)} />
)}
{addUserPop && (
  <Adduserinchatlist closePop={() => setaddUserPop(false)} onAddUser={handleAddUser} />
)}
{shareContact && (
  <Sharecontactonchat closeShareContact={() => setshareContact(false)}  />
)}
    </div>
)}
