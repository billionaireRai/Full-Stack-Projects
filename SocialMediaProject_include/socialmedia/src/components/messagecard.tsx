import React,{ useEffect , useState } from 'react'
import { CheckCircle } from 'lucide-react' ;
import Image from 'next/image'

interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
  isOwn: boolean
  avatar: string
  status?: 'sending' | 'delivered' | 'read'
}

interface MessageCardProps {
  messages?: Message[]
}

export default function MessageCard({ messages = [] }: MessageCardProps) {
  const [displayMessages, setdisplayMessages] = useState<Message[] | []>([])
  // will update the array with messages...
  const MessagesArray : Message[] = [
    {
      id: '1',
      sender: 'Alice Johnson',
      text: 'Hey, how are you doing?',
      timestamp: new Date().toLocaleString(),
      isOwn: false,
      avatar: '/images/myProfile.jpg',
      status: 'read'
    },
    {
      id: '2',
      sender: 'You',
      text: 'I\'m doing great! Thanks for asking. How about you?',
      timestamp: new Date().toLocaleString(),
      isOwn: true,
      avatar: '/images/myProfile.jpg',
      status: 'delivered'
    },
    {
      id: '3',
      sender: 'Alice Johnson',
      text: 'I\'m good too. Just working on some projects. What are you up to?',
      timestamp: new Date().toLocaleString(),
      isOwn: false,
      avatar: '/images/myProfile.jpg',
      status: 'read'
    },
    {
      id: '4',
      sender: 'You',
      text: 'Same here! Building a social media app. It\'s quite challenging but fun.',
      timestamp: new Date().toLocaleString(),
      isOwn: true,
      avatar: '/images/myProfile.jpg',
      status: 'sending'
    }
  ]


  // useeffect runing on first page reload...
  useEffect(() => {
    if (messages.length > 0) {
      setdisplayMessages(messages) ;
    } else {
      setdisplayMessages(MessagesArray)
    }
  }, [])
  

  return (
    <div className='flex flex-col gap-4 p-4 h-full overflow-y-auto bg-gray-50 dark:bg-black rounded-md'>
      {displayMessages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {/* Avatar */}
          <div className='flex-shrink-0'>
            <Image
              src={message.avatar}
              alt={`${message.sender} avatar`}
              width={40}
              height={40}
              className='w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700'
            />
          </div>

          {/* Message Bubble */}
          <div className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg ${message.isOwn ? 'items-end' : 'items-start'}`}>
            {/* Sender Name (only for received messages) */}
            {!message.isOwn && (
              <span className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>
                {message.sender}
              </span>
            )}

            {/* Message Content */}
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm ${
                message.isOwn
                  ? 'bg-yellow-400 dark:bg-blue-500 dark:text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className='text-sm leading-relaxed break-words'>{message.text}</p>
            </div>

            {/* Timestamp and Status */}
            <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              <span>{message.timestamp}</span>
              {message.isOwn && message.status && (
                <span className='flex items-center'>
                  {message.status === 'sending' && <span><CheckCircle height={20} width={20} className='stroke-3'/></span>}
                  {message.status === 'delivered' && <span><CheckCircle height={20} width={20} className='stroke-yellow-400 stroke-3'/></span>}
                  {message.status === 'read' &&  
                  <span>
                    <CheckCircle height={20} width={20} className='stroke-3 stroke-green-500'/>
                  </span> }
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

