'use client'

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface mediaType {
  url: string;
  media_type: string;
}

interface modalProps {
  closepop: () => void;
  media: mediaType | null;
}

export default function Mediapopmodal({ closepop, media }: modalProps) {
  const isVideo = media?.media_type === 'video';

  useEffect(() => {
   const onKeyDown = (e: KeyboardEvent) => {
     if (e.key === 'Escape') closepop();
   };
    
   window.addEventListener('keydown', onKeyDown);
   return () => window.removeEventListener('keydown', onKeyDown);
  }, [closepop]);

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      onClick={closepop}
    >
      <div className="relative p-2 flex rounded-lg w-full h-full" >
        <div className="flex items-center justify-center w-full h-full rounded-lg">
          {isVideo ? (
            <video
              src={media?.url}
              controls
              autoPlay
              className="w-auto h-4/5 rounded-xl object-contain"
            />
          ) : (
            <img
              src={media?.url}
              alt="Media"
              className="w-auto h-4/5 rounded-xl object-contain"
            />
          )}
        </div>
      </div>
   </div>
  );
}

