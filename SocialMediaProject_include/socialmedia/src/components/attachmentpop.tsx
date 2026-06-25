import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, BookOpen, ImageOff, Music, X } from 'lucide-react'
import { mediaType } from './mediapopmodal'
import Usercard, { userCardProp } from './usercard'
import Audioplayer from './Audioplayer'
import Videoplayer from './videoplayer'
import Mediacontrols from './mediacontrols'
import axiosInstance from '@/lib/interceptor'
import toast from 'react-hot-toast'

interface attachmentOptionType {
  icon: React.ReactNode
  label: string
  reference?: React.RefObject<HTMLInputElement | null>
}

interface AttachmentPopProps {
  menuOptions: attachmentOptionType[] ;
  handleMediaClick:(m:mediaType) => void ;
  closePop: () => void ;
  targetHandle:string
}

export default function Attachmentpop({ closePop, menuOptions , handleMediaClick , targetHandle }: AttachmentPopProps) {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)
  const [activeMediaIndex, setactiveMediaIndex] = useState(0)

  const imageExamples: mediaType[] = [
    { url: '/images/default-banner.jpg', media_type: 'image' },
    { url: '/images/age-range.png', media_type: 'image' },
    { url: '/images/comment.png', media_type: 'image' },
    { url: '/images/insert-picture-icon.png', media_type: 'image' },
    { url: '/images/myProfile.jpg', media_type: 'image' },
    { url: '/images/twitter.png', media_type: 'image' },
    { url: '/images/whatsapp.png', media_type: 'image' },
    { url: '/images/instagram.png', media_type: 'image' },
    { url: '/images/facebook.png', media_type: 'image' },
  ]

  const videoExamples: mediaType[] = [
    { url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', media_type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', media_type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', media_type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', media_type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', media_type: 'video' },
  ]

  const audioExamples: mediaType[] = [
    { url: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.png', media_type: 'audio' },
    { url: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav', media_type: 'audio' },
    { url: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav', media_type: 'audio' },
    { url: 'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther60.wav', media_type: 'audio' },
    { url: 'https://www2.cs.uic.edu/~i101/SoundFiles/Adventure60.wav', media_type: 'audio' },
  ]

  // combining all sample arrays...
  const allAttachmentExamples: mediaType[] = [...imageExamples, ...videoExamples, ...audioExamples]

  const mentionExamples: userCardProp[] = [
    {
      decodedHandle: '@kr$na',
      name: 'Kr$na',
      content: 'MERN • GenAI • Web3',
      IsFollowing: false,
      account: {
        name: 'Kr$na',
        handle: '@kr$na',
        bio: 'MERN • GenAI • Web3',
        location: {
          text: 'Remote',
          coordinates: [28.450637197292124, 77.14711048980648],
        },
        website: 'https://example.com/krna',
        joinDate: 'January 2020',
        following: '120',
        followers: '12,400',
        Posts: '340',
        isVerified: true,
        isCompleted: false,
        plan: 'Pro',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/myProfile.jpg',
      },
    },
    {
      decodedHandle: '@jhonDoe',
      name: 'Jhon Doe',
      content: 'Coffee + Deployments ☕',
      IsFollowing: true,
      account: {
        name: 'Jhon Doe',
        handle: '@jhonDoe',
        bio: 'Coffee + Deployments ☕',
        location: {
          text: 'San Francisco, CA',
          coordinates: [28.450637197292124, 77.14711048980648],
        },
        website: 'https://example.com/jhon',
        joinDate: 'March 2019',
        following: '342',
        followers: '1,247',
        Posts: '89',
        isVerified: false,
        isCompleted: true,
        plan: 'Free',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/myProfile.jpg',
      },
    },
    {
      decodedHandle: '@dev_sam',
      name: 'Sam Dev',
      content: 'Full-stack builder',
      IsFollowing: false,
      account: {
        name: 'Sam Dev',
        handle: '@dev_sam',
        bio: 'Full-stack builder',
        location: {
          text: 'New York, NY',
          coordinates: [40.7128, -74.006],
        },
        website: 'https://example.com/sam',
        joinDate: 'June 2021',
        following: '77',
        followers: '2,310',
        Posts: '120',
        isVerified: false,
        isCompleted: false,
        plan: 'Standard',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/myProfile.jpg',
      },
    },
    {
      decodedHandle: '@ai_nora',
      name: 'Nora AI',
      content: 'LLM experiments & notes',
      IsFollowing: false,
      account: {
        name: 'Nora AI',
        handle: '@ai_nora',
        bio: 'LLM experiments & notes',
        location: {
          text: 'Austin, TX',
          coordinates: [30.2672, -97.7431],
        },
        website: 'https://example.com/nora',
        joinDate: 'October 2022',
        following: '58',
        followers: '8,905',
        Posts: '210',
        isVerified: true,
        isCompleted: false,
        plan: 'Pro',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/myProfile.jpg',
      },
    },
    {
      decodedHandle: '@webmike',
      name: 'Mike Web',
      content: 'React/Next.js UI crafts',
      IsFollowing: true,
      account: {
        name: 'Mike Web',
        handle: '@webmike',
        bio: 'React/Next.js UI crafts',
        location: {
          text: 'London, UK',
          coordinates: [51.5072, -0.1276],
        },
        website: 'https://example.com/mike',
        joinDate: 'April 2020',
        following: '150',
        followers: '3,420',
        Posts: '95',
        isVerified: false,
        isCompleted: true,
        plan: 'Standard',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/myProfile.jpg',
      },
    },
  ]

  const [Attachements, setAttachements] = useState<mediaType[]>(allAttachmentExamples)
  const [specificAttachments, setspecificAttachments] = useState<mediaType[]>([])
  const [mentions, setmentions] = useState<userCardProp[]>(mentionExamples)

  // operations related to state variables...
  const safeMenuOptions = useMemo(() => (Array.isArray(menuOptions) ? menuOptions : []), [menuOptions])
  const activeLabel = safeMenuOptions[activeMenuIndex]?.label

  // useffect for menu change...
  useEffect(() => {
    const label = activeLabel?.toLowerCase();
    setactiveMediaIndex(0);
    setspecificAttachments(Attachements.filter((attachment) => attachment.media_type === label));
  }, [activeMenuIndex, activeLabel, Attachements])

  // function for fetching details...
  async function getAllAttachments() {
    try {
      const attachmentres = await axiosInstance.get(`/api/chat/attachments?targetAccHandle=${targetHandle}`);
      if (attachmentres.status === 200) {
        setAttachements(attachmentres.data.attachments)
        setmentions(attachmentres.data.mentions);
      }
    } catch (error) {
      console.log("An Error occured...");
      toast.error("Error occured in getting attachments !!");
    }
  }
  // useeffect triggered on page load...
  useEffect(() => {
    // getAllAttachments() ;
  }, [])

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-40 animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="h-11/12 min-w-3/4 flex flex-col rounded-xl bg-white dark:bg-black shadow-xl border border-gray-300 dark:border-gray-900 p-1 overflow-hidden">
        {/* Header */}
        <div className="menu rounded-xl flex items-center justify-between p-2 bg-yellow-50 dark:bg-black">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-yellow-800 dark:text-yellow-600 flex items-center justify-start gap-1">
                {safeMenuOptions[activeMenuIndex]?.icon}
                <span>{activeLabel}</span>
              </div>
              <span className="text-xs text-yellow-600/90 max-w-md">
                {activeLabel !== 'mention' ? (
                  `These are the ${activeLabel} shared by you or the account you’re chatting with in this conversation.`
                ) : (
                  'These are the accounts mentioned by you or the account you’re chatting with in this conversation.'
                )}
              </span>
            </div>
          </div>

          <ul className="flex flex-wrap items-center justify-start gap-1 p-1 m-1 rounded-full">
            {safeMenuOptions.map((option, idx) => {
              const isActive = idx === activeMenuIndex
              return (
                <li key={idx} className="flex items-center rounded-full">
                  <button
                    type="button"
                    onClick={() => setActiveMenuIndex(idx)}
                    className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border
                      ${isActive ? 'bg-yellow-100 dark:bg-yellow-300 text-black border-yellow-500 shadow-md dark:shadow-yellow-500/40 shadow-yellow-300/40' : 'bg-white dark:bg-black text-yellow-500 border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 hover:border-yellow-300'}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={`inline-flex items-center justify-center transition-colors duration-150 ${isActive ? 'text-white' : 'text-yellow-700'} `}>
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
            className="p-1.5 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-900 bg-white ring-1 ring-gray-200 dark:ring-gray-900"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="container overflow-x-hidden flex-1 rounded-xl" aria-label={activeLabel ? `Active: ${activeLabel}` : 'Attachment menu'}>
          {activeLabel === 'mention' ? (
            <div className="h-full w-full p-4">
              <div className="h-full flex flex-col gap-2">
                {mentions.length > 0 && mentions.map((u, idx) => (
                    <Usercard key={idx} {...u} />
                  ))}
                {mentions.length === 0 && <li className="text-sm text-gray-500 py-8 text-center">No mentions available</li>}
              </div>
            </div>
          ) : (
            <div className="h-full w-full p-1">
              {specificAttachments.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center flex flex-col items-center">
                    <ImageOff size={40} />
                    <div className="text-sm font-semibold text-gray-700 mt-1">No {activeLabel} found</div>
                    <div className="text-xs text-gray-500">No {activeLabel} have been shared in this conversation...</div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full overflow-hidden scroll-smooth">
                  <motion.div
                    transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                    className="relative h-full flex items-center justify-center overflow-hidden perspective-[1200px] rounded-xl"
                  >
                    {specificAttachments.map((m, idx) => {
                      const offset = idx - activeMediaIndex
                      if (Math.abs(offset) > 2) return null // only 2 media after and before will be shown...

                      const isActive = offset === 0 // same and active media

                      let transform = ''
                      let zIndex = 0
                      let opacity = 1

                      if (offset === 0) {
                        transform = 'translateX(0px) scale(1)'
                        zIndex = 30
                      }
                      if (offset === -1) {
                        transform = 'translateX(-300px) scale(0.8) rotateY(25deg)'
                        zIndex = 10
                        opacity = 0.4
                      }
                      if (offset === 1) {
                        transform = 'translateX(300px) scale(0.8) rotateY(-25deg)'
                        zIndex = 10
                        opacity = 0.4
                      }
                      if (offset === -2) {
                        transform = 'translateX(-480px) scale(0.6) rotateY(35deg)'
                        zIndex = 20
                        opacity = 0.7
                      }
                      if (offset === 2) {
                        transform = 'translateX(480px) scale(0.6) rotateY(-35deg)'
                        zIndex = 20
                        opacity = 0.7
                      }

                      return (
                        <div
                          key={`${m.media_type}-${m.url}-${idx}`}
                          onClick={() => setactiveMediaIndex(idx)}
                          className="absolute cursor-pointer transition-all duration-500 ease-out"
                          style={{ transform, zIndex, opacity }}
                        >
                          <div
                            onClick={() => { handleMediaClick(m) }}
                            className={`overflow-hidden rounded-3xl bg-white dark:bg-gray-300 shadow-xl
                              ${isActive ? 'border ring-3 ring-yellow-500/30 border-yellow-500' : 'border border-yellow-200'}`}
                          >
                            {m.media_type === 'image' && <img src={m.url} className="w-md h-[400px] md:h-[450px] object-cover" />}

                            {m.media_type === 'video' && (
                              <div className='w-md h-[400px] md:h-[450px]'>
                                <Videoplayer url={m.url} />
                              </div>
                            )}

                            {m.media_type === 'audio' && (
                              <div className="w-md h-[300px] md:h-[400px] flex flex-col gap-2 items-center justify-center bg-yellow-50 dark:bg-black">
                                 <span className="text-yellow-500 rounded-full bg-yellow-100 dark:bg-gray-950 p-4">
                                   <Music className="w-8 h-8" />
                                 </span>
                                <Audioplayer url={m.url} />
                               </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <section className="footer px-4 py-3 border-t rounded-xl bg-white/80 dark:bg-black/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-full justify-between gap-2">
              {specificAttachments.length > 0 && (
                <div className="flex items-center text-xs bg-yellow-50 dark:bg-black ring-2 ring-yellow-500/40 border border-yellow-500 text-yellow-600 p-2 rounded-full justify-center gap-1">
                  <BookOpen size={18} />
                  <span>
                    {activeMediaIndex + 1}/{specificAttachments.length}
                  </span>
                </div>
              )}
            </div>

            <span className="flex items-center rounded-full p-1 ring-2 ring-yellow-500/40 border border-yellow-500 text-yellow-600">
              <ArrowLeftCircleIcon
                onClick={() => {
                  if (specificAttachments.length === 0) return
                  setactiveMediaIndex(activeMediaIndex === 0 ? specificAttachments.length - 1 : activeMediaIndex - 1)
                }}
                className="cursor-pointer hover:scale-110 transition-transform duration-300"
                size={35}
              />
              <ArrowRightCircleIcon
                onClick={() => {
                  if (specificAttachments.length === 0) return
                  setactiveMediaIndex(activeMediaIndex === specificAttachments.length - 1 ? 0 : activeMediaIndex + 1)
                }}
                className="cursor-pointer hover:scale-110 transition-transform duration-300"
                size={35}
              />
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

