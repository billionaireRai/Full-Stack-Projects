import { getShareLinks } from "@/lib/getShareLink";
import useCreatePost from "@/app/states/createpost";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SharePopupProps {
  open: boolean;
  onClose: () => void;
  onCopy: () => void;
  link:string;
  text:string;
  followerCount?: string;
  followingCount?: string;
}

const SharePopup: React.FC<SharePopupProps> = ({
  open,
  onClose,
  onCopy,
  link,
  text,
  followerCount = 0,
  followingCount = 0,
}) => {
    const shareLinks = getShareLinks(link,text);
    const { setCreatePop } = useCreatePost() ; 

   // handle create post click...
   const handleCreatePostClick = () => { 
    setCreatePop(true) ;
    onClose?.() ;
    onCopy?.()
    }

   if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-[500px] max-w-[90%]
          h-1/2 max-h-[90%]
          rounded-2xl
          bg-white dark:bg-neutral-900
          text-neutral-900 dark:text-neutral-100
          shadow-xl
          p-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Share in a post</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 p-1 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-950">
            <X size={18} />
          </button>
        </div>

        {/* Create Post */}
        <button
          onClick={() => { handleCreatePostClick() }}
          className="
            w-full rounded-full
            bg-yellow-400
            text-white
            py-2 font-medium
            hover:opacity-90 transition cursor-pointer
          "
        >
          Create post
        </button>

        {/* followers */}
        <div className="flex items-center font-semibold justify-center gap-4">
           <p className="mt-3 flex items-center text-sm text-neutral-500">
             {parseInt(String(followerCount).substring(0,followerCount.toString().length - 1)) > 0
               ? `${followerCount} followers`
               : "No followers"}
           </p>
           <p className="mt-3 flex items-center text-sm text-neutral-500">
             {parseInt(String(followingCount).substring(0,followingCount.toString().length - 1)) > 0
               ? `${followingCount} followings`
               : "No followings"}
           </p>
        </div>

        <div className="my-4 border-t border-neutral-200 dark:border-neutral-700" />

        {/* Share Options */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          <ShareOption label="Gmail" iconUrl="/images/search.png" link={shareLinks.gmail} />
          <ShareOption label="Facebook" iconUrl="/images/facebook.png" link={shareLinks.facebook} />
          <ShareOption label="WhatsApp" iconUrl="/images/whatsapp.png" link={shareLinks.whatsapp} />
          <ShareOption label="Instagram" iconUrl="/images/instagram.png" link='https://www.instagram.com' />
          <ShareOption label="X" iconUrl="/images/twitter.png" link={shareLinks.twitter} />
          <ShareOption label="Github" iconUrl="/images/github.png" link='https://www.github.com' />
        </div>

        {/* Share Link */}
        <div className="mt-4 flex gap-2">
          <input
            readOnly
            value={link}
            className="
              flex-1 rounded-lg
              border border-neutral-300 dark:border-neutral-700
              bg-neutral-100 dark:bg-neutral-800
              px-3 py-2 text-sm
              outline-none
            "
          />
          <button
            onClick={onCopy}
            className="
              rounded-lg px-4 py-2
              bg-yellow-400 text-white
              hover:bg-yellow-500 transition cursor-pointer
            "
          >
            Copy
          </button>
        </div>

      </div>
    </div>
  );
};

const ShareOption: React.FC<{ label: string; iconUrl: string , link:string }> = ({
  label,
  iconUrl,
  link
}) => {
  return (
    <div className="flex flex-col items-center min-w-[64px] cursor-pointer">
    {/* Each option click redirects to official share endpoint... */}
      <Link
        href={link}
        target="_blink"
        className="
          h-12 w-12 rounded-full
          bg-neutral-200 dark:bg-neutral-800
          flex items-center justify-center
          text-lg
        "
      >
        <Image src={iconUrl} height={35} width={35} alt={label} />
      </Link>
      <span className="mt-1 text-xs text-center">{label}</span>
    </div>
  );
};

export default SharePopup;
