'use client'

import React,{ useState , useEffect }from 'react'
import ChatAccountcard from '@/components/chataccountcard'
import ReportPop from '@/components/reportPop'
import Link from 'next/link'
import Image from 'next/image';
import AudioRecordModal from '@/components/audioRecordModal';
import BlockChatPop from '@/components/blockchat';
import MessageCard from '@/components/messagecard';
import Sharecontactonchat from '@/components/sharecontactonchat';
import AddAccinchatlist from '@/components/adduserinchatlist';
import { userCardProp } from '@/components/usercard';
import { SearchIcon, PlusCircleIcon,SendIcon ,User, BellOff,Folder, Eraser, UserX, Flag, Trash, Smile, Paperclip, Mic, Image as image, Video, File, Music, Square, Play, X, PhoneIcon, BarChart3, Images, MessageCirclePlus, BanIcon , Link2Icon, BellDot, MessageCircleDashed } from 'lucide-react'
import toast from 'react-hot-toast';
import { infoForChatCard } from '@/components/chataccountcard'
import axiosInstance from '@/lib/interceptor';
import DeleteModal from '@/components/deletemodal'

export default function Messages() {
  const [ChatSearch, setChatSearch] = useState('') ; // input for searching a paticular chat...
  const [CurrentOpenChat, setCurrentOpenChat] = useState<infoForChatCard>();
  const [chatSlideOpen, setchatSlideOpen] = useState<boolean>(false) ;
  const [addChatPop, setaddChatPop] = useState<boolean>(false);
  const [openChatThreeDot, setopenChatThreeDot] = useState<boolean>(false) ;
  const [blockChatPop, setblockChatPop] = useState<boolean>(false);
  const [showDeletePop, setshowDeletePop] = useState<boolean>(false);
  const [showReportChat, setshowReportChat] = useState<boolean>(false);
  const [showFilePopup, setShowFilePopup] = useState<boolean>(false) ;
  const [showAudioModal, setShowAudioModal] = useState<boolean>(false) ;
  const [conversations, setconversations] = useState<infoForChatCard[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      handle: '@alicejohnson',
      lastMessage: 'Hey, how are you?',
      timestamp: 'Fri Jun 05 2026', // random previous date via toDateString()
      isVerified: true,
      pinned:false,
      isMuted:true,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 2,
      publicKey:'abcdefgh'
    },
    {
      id: '2',
      name: 'Bob Smith',
      handle: '@bobsmith',
      lastMessage: 'Let\'s meet tomorrow',
      timestamp: '9:15 AM',
      isVerified: false,
      pinned:true,
      isMuted:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0,
      publicKey:'ijklmnop'
    },
    {
      id: '291f0n4t4bnb03',
      name: 'Charlie Brown',
      handle: '@charliebrown',
      lastMessage: 'Thanks for the help!',
      timestamp: 'Yesterday',
      isVerified:true,
      pinned:true,
      isMuted:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0,
      publicKey:'qrstuvwx'
    },
    {
      id: '4',
      name: 'Diana Prince',
      handle: '@dianaprince',
      lastMessage: 'See you soon',
      timestamp: '2 days ago',
      isVerified:false,
      isMuted:false,
      pinned:false,
      blockedTo:true,
      blockedBy:false,      
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 4,
      publicKey:'yzagdgtebv'
    },
    {
      id: '5',
      name: 'Eve Wilson',
      handle: '@evewilson',
      lastMessage: 'What\'s up?',
      timestamp: '3 hours ago',
      isVerified:true,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0,
      publicKey:'rppwmlmbint'
    },
    {
      id: '6',
      name: 'Frank Miller',
      handle: '@frankmiller',
      lastMessage: 'Good morning!',
      timestamp: '8:45 AM',
      isVerified:false,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0,
      publicKey:'30mr3m0gnkfs'
    },
    {
      id: '7',
      name: 'Grace Lee',
      handle: '@gracelee',
      lastMessage: 'Call me later',
      timestamp: '1 hour ago',
      isVerified:true,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1,
      publicKey:'39jjnnnubfnef'
    },
    {
      id: '8',
      name: 'Henry Davis',
      handle: '@henrydavis',
      lastMessage: 'Nice work!',
      timestamp: 'Yesterday',
      isVerified:true,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1,
      publicKey:'dkmwdibvettt'
    },
    {
      id: '9',
      name: 'Isaac Newton',
      handle: '@isaacnewton',
      lastMessage: 'Physics is fun!',
      timestamp: '5 minutes ago',
      isVerified:false,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 3,
      publicKey:'rnniogr2rpr'
    },
    {
      id: '10',
      name: 'Jack Ryan',
      handle: '@jackryan',
      lastMessage: 'Mission accomplished',
      timestamp: '2 hours ago',
      isVerified:false,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0,
      publicKey:'0n1o39njje9'
    },
    {
      id: '11',
      name: 'Karen White',
      handle: '@karenwhite',
      lastMessage: 'Let\'s catch up',
      timestamp: '1 day ago',
      isVerified:false,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 2,
      publicKey:'wlmwnnivrmwp'
    },
    {
      id: '12',
      name: 'Liam Green',
      handle: '@liamgreen',
      lastMessage: 'Great idea!',
      timestamp: '30 minutes ago',
      isVerified:true,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 1,
      publicKey:'ofnndisbntuc'
    },
    {
      id: '13',
      name: 'Mia Black',
      handle: '@miablack',
      lastMessage: 'See you at the event',
      timestamp: '4 hours ago',
      isVerified:true,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0,
      publicKey:'jsinjwenoi5rn'
    },
    {
      id: '4t3ghur0o3oe',
      name: 'Noah Blue',
      handle: '@noahblue',
      lastMessage: 'Thanks again',
      timestamp: '3 days ago',
      isVerified:false,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:true,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 5,
      publicKey:'eon2nigkmvort'
    },
    {
      id: '15',
      name: 'Olivia Red',
      handle: '@olivared',
      lastMessage: 'Happy birthday!',
      timestamp: '6 hours ago',
      isVerified:false,
      isMuted:false,
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      avatarUrl: '/images/myProfile.jpg',
      unreadCount: 0,
      publicKey:'utbgnhskrnohwe'
    }
  ])
  const attachFileoptions = [
    { icon: <Images className="w-3 h-3 text-blue-500" />, label: "Photos" },
    { icon: <Video className="w-3 h-3 text-purple-500" />, label: "Videos" },
    { icon: <Music className="w-3 h-3 text-pink-500" />, label: "Audio" },
    { icon: <PhoneIcon className="w-3 h-3 text-red-500" />, label: "Contact" },
  ]
  const [filteredCards, setFilteredCards] = useState(conversations); // for handling the searched result array...
  
  // for adding new chat in UI...
  const handleAddUser = (AccForChat: userCardProp,pubkey:string) => {
    const newChat: infoForChatCard = {
      id: String(AccForChat?.id),
      name: String(AccForChat?.name),
      handle: String(AccForChat.decodedHandle),
      isVerified: Boolean(AccForChat.account?.isVerified),
      pinned:false,
      blockedTo:false,
      blockedBy:false,
      isMuted:false,
      lastMessage: 'New chat created just now !!',
      timestamp: 'Just now',
      publicKey:pubkey.trim(),
      avatarUrl: String(AccForChat.account?.avatarUrl),
      unreadCount: 0,
    };
    // handling some edge cases...
    if (!conversations.some((conv) => conv.id === newChat.id)) { 
      setaddChatPop(false);
      toast.success(<>Added <b className='mx-1'>{newChat.handle}</b> to your chats...</>)
      setconversations((prev) => [...prev, newChat]) ; 
    }
    else toast.error(<>Chat already exists with <b className='mx-1'>{newChat.handle}</b></>) ;
  };


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

  // function fethcing all conversations...
  async function getConversations() {
    axiosInstance.get('/api/account/conversations')
      .then((apires) => {
        if (apires.status === 200) {
          setconversations(apires.data.conversations);
        }
      })
      .catch(() => {
        console.log('Issue in fetching conversations !!');
      })
    }
    
  // useffect for page load actions..
  useEffect(() => {
    // getConversations();
  }, [])


  useEffect(() => {
    calculateTotalUnread(conversations);
  }, [conversations])

  // function handling card info updation
  const handleCardDetailUpdate = (lastmsg: string, time: string) => {
    setconversations((prev) => {
      const targetId = CurrentOpenChat?.id;
      if (!targetId) return prev;
      return prev.map((c) =>
        c.id === targetId? { ...c, lastMessage: lastmsg, timestamp: time } : c
      );
    });

    setCurrentOpenChat((prevdetail) => {
      if (!prevdetail) return prevdetail;
      return { ...prevdetail, lastMessage: lastmsg, timestamp: time };
    });
  }

  // function for handling chat array operations...
  function conversationArrOperation(arr: infoForChatCard[]): infoForChatCard[] {
    return arr.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned === true ? 1 : -1 ;
      return b.unreadCount - a.unreadCount;
    });
  }

  // function returning next chat...
  function giveNextChat(CHATID?:string) : infoForChatCard {
    const currentChatIndex = conversations.findIndex(conv => conv.id === CHATID);
    const targetIndex = currentChatIndex === (conversations.length - 1) ? 0 : (currentChatIndex + 1) ; 
    return conversations[targetIndex] ;
  }
  const handleChatDeletion = async () => {
    const loadingT = toast.loading(`Deleting your chat with ${CurrentOpenChat?.handle}`);
    try {
      const deletionApi = await axiosInstance.delete(`/api/account/conversations?conversationid=${CurrentOpenChat?.id}`);
      if (deletionApi.status === 200) {
        toast.dismiss(loadingT);
        toast.success(`Chat deleted successfully !!`);
        setshowDeletePop(false);
        setCurrentOpenChat(giveNextChat(CurrentOpenChat?.id));
        setconversations(conversations.filter((conv) => conv.id !== CurrentOpenChat?.id));
      } else {
        toast.error(`Server status unfavourable ${deletionApi.status}`);
        toast.dismiss(loadingT);
      }
    } catch (error) {
      toast.error("An error occured in deletion !!");
      toast.dismiss(loadingT);
    }
  }

  return (
    <div className='h-full flex flex-col md:flex-row p-1 gap-1 font-poppins rounded-md dark:bg-black'>
        <div className={`relative chatList ${chatSlideOpen ? 'h-1/4' : 'h-3/4'} md:h-full flex-col gap-1 rounded-md overflow-y-auto overflow-x-hidden`}>
            <div className='searchSection sticky top-0 backdrop-blur-md flex items-center w-full mx-auto p-2 m-2 rounded-lg  shadow-md border border-gray-200 dark:border-gray-700'>
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
                  className="w-full backdrop-blur-sm outline-none border border-transparent focus:border-yellow-400 focus:ring-3 focus:ring-yellow-400/30 rounded-md px-3 py-1 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 transition duration-300"
                  autoFocus
                />
            </div>
            <div className='my-1 flex items-center justify-between rounded-xl px-1'>
              <MessageCircleDashed className='text-yellow-500' />
              <span className='border border-yellow-400 text-yellow-500 dark:bg-zinc-950 text-xs p-2 rounded-full'>
                <b>{conversations.length}</b> chat conversations
              </span>
            </div>
           {Array.isArray(filteredCards) && filteredCards.length > 0 ? conversationArrOperation(filteredCards).map((card) => (
              <ChatAccountcard 
                key={card.id} 
                cardInfo={card} 
                currentOpenChat={CurrentOpenChat} 
                countUpdate={() => { card.unreadCount = 0 }}
                currentChat={() => { setCurrentOpenChat(card) }}
                openChat={() => { setchatSlideOpen(true) }}
              />

            )) : (
            <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-950 flex items-center justify-center border border-gray-200 dark:border-gray-800">
                  <SearchIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">
                  No chats found
                </h3>
                <p className="mt-1 max-w-xs text-sm text-gray-600 dark:text-gray-400">
                  {ChatSearch.trim() ? (
                    <>
                    No conversations match <span className="font-medium text-gray-900 dark:text-gray-200">“<b>{ChatSearch.trim()}</b>”</span>.
                    </>
                  ):(
                    <>
                    you have'nt started chatting with any account , add an account & start having fun...
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
        <div className="flex flex-col gap-4 p-2 h-1/4 md:h-full flex-1 dark:bg-black rounded-md">
         <MessageCard 
          updateCardDetail={(msg,time) => { handleCardDetailUpdate(msg,time) }} 
          chatCardDetails={CurrentOpenChat} handleAudioPop={() => { setShowAudioModal(true) }} 
          handleAddChat={() => { setaddChatPop(true) }}
          openBlockPop={() => { setblockChatPop(true) }}
          openReportPop={() => { setshowReportChat(true) }}
          openDeletePop={() => { setshowDeletePop(true) }}
         />
        </div>
        
        {showAudioModal && (
          <AudioRecordModal closePopUp={() => setShowAudioModal(false)} />
        )}
       {addChatPop && (
         <AddAccinchatlist closePop={() => setaddChatPop(false)} onAddChat={handleAddUser} />
       )}
       {showReportChat && CurrentOpenChat && (
        <ReportPop closeReportModal={() => { setshowReportChat(false) }} username={CurrentOpenChat.handle} convid={CurrentOpenChat.id} />
       )}
       {showDeletePop && CurrentOpenChat && (
        <DeleteModal closePopUp={() => { setshowDeletePop(false) }} itemType='entire chat' onDelete={handleChatDeletion}/>
       )}

       {/* correct this */}
       { blockChatPop && CurrentOpenChat && (
        <BlockChatPop 
         conv={CurrentOpenChat} 
         closeBlockPop={() => { setblockChatPop(false) }} 
         updateblockState={(updatedState) => {setCurrentOpenChat((prev) => (prev ? { ...prev, blocked: updatedState } : prev)) }}

        />
       )}
    </div>
)}
